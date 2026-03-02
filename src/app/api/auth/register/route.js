import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { email, password, name, role } = await request.json()

        const cookieStore = cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    get(name) {
                        return cookieStore.get(name)?.value
                    },
                    set(name, value, options) {
                        try {
                            cookieStore.set({ name, value, ...options })
                        } catch (error) {
                            // Handle cookie error
                        }
                    },
                    remove(name, options) {
                        try {
                            cookieStore.set({ name, value: '', ...options })
                        } catch (error) {
                            // Handle cookie error
                        }
                    },
                },
            }
        )

        // Sign up the user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    role
                }
            }
        })

        if (authError) {
            return NextResponse.json(
                { success: false, error: authError.message },
                { status: 400 }
            )
        }

        // Create user profile in your custom table
        if (authData.user) {
            try {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            name,
                            email,
                            role,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    ])

                if (profileError) {
                    console.error('Profile creation error:', profileError)
                }
            } catch (profileError) {
                console.error('Profile creation exception:', profileError)
            }
        }

        return NextResponse.json(
            {
                success: true,
                user: authData.user,
                session: authData.session,
                message: authData.user?.identities?.length === 0
                    ? 'User already registered. Please sign in.'
                    : 'Please check your email to confirm your account!'
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Register API error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}