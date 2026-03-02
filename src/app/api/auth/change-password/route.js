import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { oldPassword, newPassword } = await request.json()

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

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            )
        }

        // First verify old password by re-authenticating
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: oldPassword
        })

        if (signInError) {
            return NextResponse.json(
                { success: false, error: 'Current password is incorrect' },
                { status: 401 }
            )
        }

        // Update to new password
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { success: true, message: 'Password changed successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Change password API error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}