'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const login = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            return { success: true, user: data.user }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const register = async (userData) => {
        try {
            const { name, email, password, role } = userData

            // Sign up with Supabase
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        role: role || 'user'
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            })

            if (error) throw error

            // Create user profile in your custom table
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            name,
                            email,
                            role: role || 'user',
                            created_at: new Date()
                        }
                    ])

                if (profileError) throw profileError
            }

            return {
                success: true,
                user: data.user,
                message: 'Please check your email to confirm your account!'
            }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const forgotPassword = async (email) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`
            })

            if (error) throw error

            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const resetPassword = async (newPassword) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) throw error

            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const changePassword = async (oldPassword, newPassword) => {
        try {
            // First verify old password by re-authenticating
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: oldPassword
            })

            if (signInError) throw new Error('Current password is incorrect')

            // Update to new password
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) throw error

            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const value = {
        user,
        loading,
        login,
        register,
        forgotPassword,
        resetPassword,
        changePassword,
        logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}