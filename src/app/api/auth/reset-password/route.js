import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Mock database and reset tokens
const users = []
const resetTokens = new Map()

export async function POST(request) {
    try {
        const { token, password } = await request.json()

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            )
        }

        // Find email by token
        let email = null
        for (const [userEmail, tokenData] of resetTokens.entries()) {
            if (tokenData.token === token && tokenData.expiresAt > Date.now()) {
                email = userEmail
                break
            }
        }

        if (!email) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 400 }
            )
        }

        // Find user and update password
        const user = users.find(u => u.email === email)
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword

        // Remove used token
        resetTokens.delete(email)

        return NextResponse.json(
            { message: 'Password reset successful' },
            { status: 200 }
        )

    } catch (error) {
        console.error('Reset password error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}