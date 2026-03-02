'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'
import Message from '../components/Message'
import PasswordInput from '../components/PasswordInput'

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [attempts, setAttempts] = useState(0)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setMessage({ type: '', text: '' })
    }

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setMessage({ type: 'error', text: 'Please fill in all fields' })
            return false
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address' })
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        setMessage({ type: '', text: '' })

        // Log the attempt (without password)
        console.log('🔐 Login attempt for email:', formData.email)
        console.log('📊 Attempt number:', attempts + 1)

        try {
            const result = await login(formData.email, formData.password)

            // Log the full result for debugging
            console.log('📥 Login result:', result)

            if (result.success) {
                console.log('✅ Login successful for:', formData.email)
                setMessage({
                    type: 'success',
                    text: 'Login successful! Redirecting...'
                })

                // Increment successful login counter
                setAttempts(0)

                setTimeout(() => {
                    router.push('/dashboard')
                    router.refresh()
                }, 1500)
            } else {
                // Increment failed attempt counter
                setAttempts(prev => prev + 1)

                console.error('❌ Login failed:', result.error)

                // Handle specific error messages
                let errorMessage = result.error || 'Login failed'

                // Check for rate limiting
                if (errorMessage.toLowerCase().includes('security') ||
                    errorMessage.toLowerCase().includes('rate') ||
                    errorMessage.toLowerCase().includes('52 seconds')) {
                    errorMessage = 'Too many login attempts. Please wait a minute before trying again.'
                }

                // Check for invalid credentials
                else if (errorMessage.toLowerCase().includes('invalid login credentials')) {
                    errorMessage = 'Invalid email or password'
                }

                // Check for email confirmation
                else if (errorMessage.toLowerCase().includes('email not confirmed')) {
                    errorMessage = 'Please verify your email address first. Check your inbox for the confirmation link.'
                }

                // Check for database errors
                else if (errorMessage.toLowerCase().includes('database error')) {
                    errorMessage = 'Authentication service temporarily unavailable. Please try again in a few minutes.'
                }

                setMessage({ type: 'error', text: errorMessage })

                // If too many attempts, show additional info
                if (attempts >= 3) {
                    setMessage({
                        type: 'error',
                        text: 'Multiple failed attempts. If you forgot your password, click "Forgot password" below.'
                    })
                }
            }
        } catch (error) {
            console.error('❌ Unexpected login error:', error)
            console.error('Stack:', error.stack)

            setMessage({
                type: 'error',
                text: error.message || 'An unexpected error occurred. Please try again.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your account"
            icon={Lock}
        >
            <Message type={message.type} text={message.text} />

            {/* Show rate limit warning if many attempts */}
            {attempts >= 3 && (
                <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Multiple failed attempts. Too many tries may temporarily lock your account.</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            disabled={loading}
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            autoComplete="email"
                        />
                    </div>
                </div>

                <PasswordInput
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    label="Password"
                    disabled={loading}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                            Processing...
                        </span>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center space-y-4">
                <Link
                    href="/account/forgot-password"
                    className="block text-sm text-neon-green hover:underline hover:text-neon-blue transition-colors"
                >
                    Forgot your password?
                </Link>
                <p className="text-gray-400">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/account/register"
                        className="text-neon-green hover:underline hover:text-neon-blue transition-colors font-medium"
                    >
                        Sign up
                    </Link>
                </p>
            </div>

            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-xs text-gray-400">
                    <p className="font-mono">Debug: {attempts} attempt(s) | {loading ? 'Loading...' : 'Ready'}</p>
                </div>
            )}
        </AuthLayout>
    )
}