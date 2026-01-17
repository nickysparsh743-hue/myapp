'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check if user is logged in
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('auth-token')
                const userData = localStorage.getItem('user-data')

                if (token && userData) {
                    // Verify token with backend (in real app)
                    setUser(JSON.parse(userData))
                }
            } catch (error) {
                console.error('Auth check failed:', error)
                localStorage.removeItem('auth-token')
                localStorage.removeItem('user-data')
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    const login = async (email, password) => {
        try {
            // Mock API call - replace with real API
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
                localStorage.setItem('auth-token', data.token)
                localStorage.setItem('user-data', JSON.stringify(data.user))
                return { success: true, data }
            } else {
                const error = await response.json()
                return { success: false, error: error.message }
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' }
        }
    }

    const register = async (userData) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })

            if (response.ok) {
                const data = await response.json()
                return { success: true, data }
            } else {
                const error = await response.json()
                return { success: false, error: error.message }
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' }
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user-data')
        router.push('/')
    }

    const forgotPassword = async (email) => {
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            if (response.ok) {
                return { success: true }
            } else {
                const error = await response.json()
                return { success: false, error: error.message }
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' }
        }
    }

    const resetPassword = async (token, password) => {
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            })

            if (response.ok) {
                return { success: true }
            } else {
                const error = await response.json()
                return { success: false, error: error.message }
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' }
        }
    }

    const changePassword = async (oldPassword, newPassword) => {
        try {
            const token = localStorage.getItem('auth-token')
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ oldPassword, newPassword })
            })

            if (response.ok) {
                return { success: true }
            } else {
                const error = await response.json()
                return { success: false, error: error.message }
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' }
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            forgotPassword,
            resetPassword,
            changePassword,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    )
}