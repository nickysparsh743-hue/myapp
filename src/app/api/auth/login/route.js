import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { email, password } = await request.json()
        const supabase = await createClient()

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error

        return NextResponse.json({
            success: true,
            user: data.user
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 401 })
    }
}