import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { email } = await request.json()

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

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account/reset-password`,
        })

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { success: true, message: 'Password reset email sent' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Forgot password API error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}