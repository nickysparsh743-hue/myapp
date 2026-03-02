import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const type = requestUrl.searchParams.get('type') // 'recovery' or 'signup'

    if (code) {
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

        await supabase.auth.exchangeCodeForSession(code)
    }

    // Redirect based on type
    if (type === 'recovery') {
        return NextResponse.redirect(requestUrl.origin + '/account/reset-password')
    }

    return NextResponse.redirect(requestUrl.origin + '/dashboard')
}