import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock database
const users = []

export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const token = authHeader.split(' ')[1]
        const { oldPassword, newPassword } = await request.json()

        // Verify token
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        // Find user
        const user = users.find(u => u.email === decoded.email)
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Verify old password
        const isValidPassword = await bcrypt.compare(oldPassword, user.password)
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword

        return NextResponse.json(
            { message: 'Password changed successfully' },
            { status: 200 }
        )

    } catch (error) {
        console.error('Change password error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}