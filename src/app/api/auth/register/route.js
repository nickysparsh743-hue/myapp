import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock database - replace with real database
const users = []

export async function POST(request) {
    try {
        const { name, email, password, role = 'user' } = await request.json()

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            )
        }

        // Check if user already exists
        if (users.find(user => user.email === email)) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = {
            id: Date.now(),
            name,
            email,
            password: hashedPassword,
            role,
            createdAt: new Date().toISOString()
        }

        users.push(user)

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
                message: 'User registered successfully',
                user: userWithoutPassword,
                token
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}