import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // IMPORTANT: In Next.js 14+, we need to await cookies()
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    async get(name) {
                        const cookieStore = await cookies()
                        return cookieStore.get(name)?.value
                    },
                    async set(name, value, options) {
                        try {
                            const cookieStore = await cookies()
                            cookieStore.set({ name, value, ...options })
                        } catch (error) {
                            // Handle cookie error
                        }
                    },
                    async remove(name, options) {
                        try {
                            const cookieStore = await cookies()
                            cookieStore.set({ name, value: '', ...options })
                        } catch (error) {
                            // Handle cookie error
                        }
                    },
                },
            }
        )

        // Test 1: Check if we can get the session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        // Test 2: Try to sign in with test credentials (optional)
        let signInResult = null
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: 'debug@example.com',
                password: 'Debug123!'
            })
            signInResult = { success: !error, error: error?.message, user: data?.user?.email }
        } catch (signInError) {
            signInResult = { success: false, error: signInError.message }
        }

        return NextResponse.json({
            success: true,
            env: {
                url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
                key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'missing',
            },
            tests: {
                getSession: {
                    success: !sessionError,
                    error: sessionError?.message,
                    hasSession: !!sessionData?.session
                },
                signIn: signInResult
            }
        }, { status: 200 })

    } catch (error) {
        console.error('Debug API error:', error)
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}