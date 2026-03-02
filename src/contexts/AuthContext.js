'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [authError, setAuthError] = useState(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                console.log('🔍 Auth: Getting initial session...')
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('❌ Auth: Session error:', error)
                    setAuthError(error.message)
                    throw error
                }

                console.log('✅ Auth: Initial session:', session?.user?.email || 'No session')
                setSession(session)
                setUser(session?.user ?? null)
            } catch (error) {
                console.error('❌ Auth: Error getting session:', error)
                setAuthError(error.message)
            } finally {
                setLoading(false)
            }
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user')

            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
            setAuthError(null)

            // Handle different auth events
            switch (event) {
                case 'SIGNED_IN':
                    console.log('✅ Auth: User signed in:', session?.user?.email)
                    // Fetch profile after sign in
                    if (session?.user) {
                        await fetchUserProfile(session.user.id)
                    }
                    router.refresh()
                    break

                case 'SIGNED_OUT':
                    console.log('👋 Auth: User signed out')
                    router.refresh()
                    router.push('/')
                    break

                case 'TOKEN_REFRESHED':
                    console.log('🔄 Auth: Token refreshed')
                    break

                case 'USER_UPDATED':
                    console.log('📝 Auth: User updated')
                    if (session?.user) {
                        await fetchUserProfile(session.user.id)
                    }
                    router.refresh()
                    break

                case 'PASSWORD_RECOVERY':
                    console.log('🔐 Auth: Password recovery')
                    router.push('/account/reset-password')
                    break

                default:
                    console.log('ℹ️ Auth: Unhandled event:', event)
            }
        })

        return () => subscription.unsubscribe()
    }, [router, supabase.auth])

    // Helper function to fetch user profile
    const fetchUserProfile = async (userId) => {
        try {
            console.log('📥 Auth: Fetching profile for user:', userId)

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.log('⚠️ Auth: Profile fetch error:', error.message)
                return null
            }

            if (profile) {
                console.log('✅ Auth: Profile fetched:', profile.name)
                // Update user with profile data
                setUser(prev => prev ? { ...prev, ...profile } : null)
                return profile
            }
        } catch (error) {
            console.error('❌ Auth: Profile fetch exception:', error)
            return null
        }
    }

    const login = async (email, password) => {
        try {
            console.log('🔐 Auth: Login attempt for:', email)

            // Basic validation
            if (!email || !password) {
                return {
                    success: false,
                    error: 'Email and password are required'
                }
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                console.error('❌ Auth: Supabase login error:', {
                    message: error.message,
                    status: error.status,
                    name: error.name
                })

                // Handle specific error messages
                let errorMessage = error.message

                if (error.message.includes('Invalid login credentials')) {
                    errorMessage = 'Invalid email or password'
                } else if (error.message.includes('Email not confirmed')) {
                    errorMessage = 'Please verify your email address first. Check your inbox for the confirmation link.'
                } else if (error.message.includes('rate limit')) {
                    errorMessage = 'Too many login attempts. Please wait about 52 seconds before trying again.'
                } else if (error.message.includes('Database error')) {
                    errorMessage = 'Authentication service temporarily unavailable. Please try again in a few minutes.'
                } else if (error.message.includes('security purposes')) {
                    errorMessage = 'Too many attempts. Please wait a minute before trying again.'
                }

                return {
                    success: false,
                    error: errorMessage,
                    originalError: error.message // For debugging
                }
            }

            if (!data || !data.user) {
                console.error('❌ Auth: No user data returned')
                return {
                    success: false,
                    error: 'Login failed - no user data returned'
                }
            }

            console.log('✅ Auth: Login successful for:', data.user.email)

            // Fetch profile data
            try {
                const profile = await fetchUserProfile(data.user.id)
                if (profile) {
                    data.user = { ...data.user, ...profile }
                }
            } catch (profileErr) {
                console.error('⚠️ Auth: Profile fetch error:', profileErr)
                // Don't fail login if profile fetch fails
            }

            return {
                success: true,
                user: data.user,
                session: data.session
            }
        } catch (error) {
            console.error('❌ Auth: Unexpected login error:', {
                message: error.message,
                stack: error.stack
            })
            return {
                success: false,
                error: error.message || 'An unexpected error occurred. Please try again.'
            }
        }
    }

    const register = async (userData) => {
        try {
            const { name, email, password, role = 'user' } = userData

            console.log('🔐 Auth: Register attempt:', { email, name, role })

            // Validate inputs
            if (!email || !password || !name) {
                return {
                    success: false,
                    error: 'Name, email and password are required'
                }
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                return {
                    success: false,
                    error: 'Please enter a valid email address'
                }
            }

            // Password strength validation
            if (password.length < 6) {
                return {
                    success: false,
                    error: 'Password must be at least 6 characters long'
                }
            }

            // Sign up with Supabase
            console.log('📤 Auth: Calling supabase.auth.signUp...')
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        role: role
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            })

            if (error) {
                console.error('❌ Auth: Supabase signup error:', {
                    message: error.message,
                    status: error.status,
                    name: error.name
                })

                // Handle specific error messages
                let errorMessage = error.message

                if (error.message.includes('already registered') || error.message.includes('already exists')) {
                    errorMessage = 'An account with this email already exists. Please sign in instead.'
                } else if (error.message.includes('rate limit') || error.message.includes('security purposes')) {
                    errorMessage = 'Too many registration attempts. Please wait about 52 seconds before trying again.'
                } else if (error.message.includes('weak password')) {
                    errorMessage = 'Password is too weak. Please use a stronger password.'
                } else if (error.message.includes('Database error')) {
                    errorMessage = 'Registration service temporarily unavailable. Please try again in a few minutes.'
                } else if (error.message.includes('malformed')) {
                    errorMessage = 'Invalid email format. Please check your email address.'
                }

                return {
                    success: false,
                    error: errorMessage,
                    originalError: error.message // For debugging
                }
            }

            if (!data || !data.user) {
                console.error('❌ Auth: No user data returned from signup')
                return {
                    success: false,
                    error: 'Registration failed - no user data returned'
                }
            }

            console.log('✅ Auth: Supabase signup successful:', {
                userId: data.user.id,
                email: data.user.email,
                hasSession: !!data.session,
                identities: data.user.identities?.length
            })

            // Create user profile
            try {
                console.log('📝 Auth: Creating profile for user:', data.user.id)

                const profileData = {
                    id: data.user.id,
                    name,
                    email,
                    role: role,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }

                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([profileData])

                if (profileError) {
                    console.error('⚠️ Auth: Profile creation error:', {
                        message: profileError.message,
                        details: profileError.details,
                        hint: profileError.hint
                    })

                    // Check if it's a duplicate key error (profile already exists)
                    if (profileError.code === '23505') {
                        console.log('ℹ️ Auth: Profile already exists, continuing...')
                    } else {
                        // Don't fail registration, but log the error
                        console.error('⚠️ Auth: Non-critical profile error:', profileError)
                    }
                } else {
                    console.log('✅ Auth: Profile created successfully')
                }
            } catch (profileError) {
                console.error('⚠️ Auth: Profile creation exception:', profileError)
                // Don't fail registration if profile creation fails
            }

            // Determine if email confirmation is needed
            const needsConfirmation = !data.session && data.user?.identities?.length === 1

            console.log('📊 Auth: Registration status:', {
                needsConfirmation,
                hasSession: !!data.session,
                identitiesCount: data.user?.identities?.length
            })

            return {
                success: true,
                user: data.user,
                session: data.session,
                needsConfirmation,
                message: needsConfirmation
                    ? 'Registration successful! Please check your email to confirm your account. (Check spam folder too!)'
                    : 'Registration successful! You can now log in.'
            }
        } catch (error) {
            console.error('❌ Auth: Unexpected registration error:', {
                message: error.message,
                stack: error.stack
            })
            return {
                success: false,
                error: error.message || 'An unexpected error occurred. Please try again.'
            }
        }
    }

    const forgotPassword = async (email) => {
        try {
            console.log('🔐 Auth: Forgot password for:', email)

            if (!email) {
                return {
                    success: false,
                    error: 'Email is required'
                }
            }

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
            })

            if (error) {
                console.error('❌ Auth: Forgot password error:', error)

                let errorMessage = error.message
                if (error.message.includes('rate limit')) {
                    errorMessage = 'Too many requests. Please wait a minute before trying again.'
                } else if (error.message.includes('not found')) {
                    errorMessage = 'No account found with this email address.'
                }

                return { success: false, error: errorMessage }
            }

            console.log('✅ Auth: Password reset email sent to:', email)
            return {
                success: true,
                message: 'Password reset link sent to your email! (Check spam folder)'
            }
        } catch (error) {
            console.error('❌ Auth: Forgot password error:', error)
            return { success: false, error: error.message }
        }
    }

    const resetPassword = async (newPassword) => {
        try {
            console.log('🔐 Auth: Resetting password')

            if (!newPassword || newPassword.length < 6) {
                return {
                    success: false,
                    error: 'Password must be at least 6 characters'
                }
            }

            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) {
                console.error('❌ Auth: Reset password error:', error)

                let errorMessage = error.message
                if (error.message.includes('same as old')) {
                    errorMessage = 'New password must be different from current password'
                }

                return { success: false, error: errorMessage }
            }

            console.log('✅ Auth: Password reset successful')
            return {
                success: true,
                message: 'Password updated successfully! You can now log in with your new password.'
            }
        } catch (error) {
            console.error('❌ Auth: Reset password error:', error)
            return { success: false, error: error.message }
        }
    }

    const changePassword = async (oldPassword, newPassword) => {
        try {
            console.log('🔐 Auth: Changing password')

            // Validate
            if (!oldPassword || !newPassword) {
                return {
                    success: false,
                    error: 'Both current and new password are required'
                }
            }

            if (newPassword.length < 6) {
                return {
                    success: false,
                    error: 'New password must be at least 6 characters'
                }
            }

            // First verify old password by re-authenticating
            if (!user?.email) {
                return {
                    success: false,
                    error: 'User not authenticated'
                }
            }

            console.log('🔐 Auth: Verifying current password...')
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: oldPassword
            })

            if (signInError) {
                console.error('❌ Auth: Password verification failed')
                return {
                    success: false,
                    error: 'Current password is incorrect'
                }
            }

            // Update to new password
            console.log('🔐 Auth: Updating to new password...')
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) {
                console.error('❌ Auth: Password update error:', error)

                let errorMessage = error.message
                if (error.message.includes('same as old')) {
                    errorMessage = 'New password must be different from current password'
                }

                return { success: false, error: errorMessage }
            }

            console.log('✅ Auth: Password changed successfully')
            return {
                success: true,
                message: 'Password changed successfully!'
            }
        } catch (error) {
            console.error('❌ Auth: Change password error:', error)
            return { success: false, error: error.message }
        }
    }

    const logout = async () => {
        try {
            console.log('🔐 Auth: Logging out')

            const { error } = await supabase.auth.signOut()
            if (error) {
                console.error('❌ Auth: Logout error:', error)
                throw error
            }

            console.log('✅ Auth: Logout successful')
            setUser(null)
            setSession(null)
            router.push('/')
            router.refresh()

            return { success: true }
        } catch (error) {
            console.error('❌ Auth: Logout error:', error)
            return { success: false, error: error.message }
        }
    }

    const getSession = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) throw error
            return session
        } catch (error) {
            console.error('❌ Auth: Get session error:', error)
            return null
        }
    }

    const refreshSession = async () => {
        try {
            console.log('🔄 Auth: Refreshing session')

            const { data: { session }, error } = await supabase.auth.refreshSession()
            if (error) throw error

            setSession(session)
            setUser(session?.user ?? null)

            console.log('✅ Auth: Session refreshed')
            return session
        } catch (error) {
            console.error('❌ Auth: Refresh session error:', error)
            return null
        }
    }

    const value = {
        user,
        session,
        loading,
        authError,
        login,
        register,
        forgotPassword,
        resetPassword,
        changePassword,
        logout,
        getSession,
        refreshSession,
        isAuthenticated: !!user
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