import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock database
const users = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        password: '$2a$10$YourHashedPasswordHere', // "password123"
        role: 'admin'
    }
]

export async function POST(request) {
    try {
        const { email, password } = await request.json()

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Find user
        const user = users.find(user => user.email === email)
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        )

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json(
            {
                message: 'Login successful',
                user: userWithoutPassword,
                token
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}