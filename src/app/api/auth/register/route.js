import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { email, password, name, role } = await request.json()
        const supabase = await createClient()

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, role }
            }
        })

        if (error) throw error

        return NextResponse.json({
            success: true,
            user: data.user,
            message: 'Registration successful! Please check your email to confirm.'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 })
    }
}