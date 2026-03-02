'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, User, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'
import Message from '../components/Message'
import PasswordInput from '../components/PasswordInput'

export default function RegisterPage() {
    const router = useRouter()
    const { register } = useAuth()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [attempts, setAttempts] = useState(0)
    const [emailSent, setEmailSent] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setMessage({ type: '', text: '' })
    }

    const validateForm = () => {
        // Name validation
        if (!formData.name.trim()) {
            setMessage({ type: 'error', text: 'Please enter your full name' })
            return false
        }

        // Email validation
        if (!formData.email) {
            setMessage({ type: 'error', text: 'Please enter your email address' })
            return false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address' })
            return false
        }

        // Password validation
        if (!formData.password) {
            setMessage({ type: 'error', text: 'Please enter a password' })
            return false
        }
        if (formData.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
            return false
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Please confirm your password' })
            return false
        }
        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' })
            return false
        }

        // Password strength check (optional)
        const hasNumber = /\d/.test(formData.password)
        const hasLetter = /[a-zA-Z]/.test(formData.password)
        if (!hasNumber || !hasLetter) {
            setMessage({
                type: 'error',
                text: 'Password must contain both letters and numbers'
            })
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        setMessage({ type: '', text: '' })
        setEmailSent(false)

        // Log the attempt (without password)
        console.log('📝 Registration attempt:', {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            attempt: attempts + 1
        })

        try {
            const result = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            })

            // Log the full result for debugging
            console.log('📥 Registration result:', result)

            if (result.success) {
                console.log('✅ Registration successful for:', formData.email)
                setAttempts(0)

                // Check if email confirmation is needed
                if (result.needsConfirmation) {
                    setEmailSent(true)
                    setMessage({
                        type: 'success',
                        text: result.message || 'Registration successful! Please check your email to confirm your account.'
                    })

                    // Don't redirect immediately - let user read the message
                    setTimeout(() => {
                        router.push('/account/login?registered=true')
                    }, 5000)
                } else {
                    setMessage({
                        type: 'success',
                        text: result.message || 'Registration successful! Redirecting to dashboard...'
                    })
                    setTimeout(() => {
                        router.push('/dashboard')
                        router.refresh()
                    }, 1500)
                }
            } else {
                // Increment failed attempt counter
                setAttempts(prev => prev + 1)

                console.error('❌ Registration failed:', result.error)

                // Handle specific error messages
                let errorMessage = result.error || 'Registration failed'

                // Check for rate limiting
                if (errorMessage.toLowerCase().includes('security') ||
                    errorMessage.toLowerCase().includes('rate') ||
                    errorMessage.toLowerCase().includes('52 seconds')) {
                    errorMessage = 'Too many registration attempts. Please wait about a minute before trying again.'
                }

                // Check for existing user
                else if (errorMessage.toLowerCase().includes('already registered') ||
                    errorMessage.toLowerCase().includes('already exists') ||
                    errorMessage.toLowerCase().includes('duplicate')) {
                    errorMessage = 'An account with this email already exists. Please sign in instead.'
                }

                // Check for weak password
                else if (errorMessage.toLowerCase().includes('weak password')) {
                    errorMessage = 'Password is too weak. Please use a stronger password.'
                }

                // Check for database errors
                else if (errorMessage.toLowerCase().includes('database error')) {
                    errorMessage = 'Registration service temporarily unavailable. Please try again in a few minutes.'
                }

                // Check for email format
                else if (errorMessage.toLowerCase().includes('malformed')) {
                    errorMessage = 'Invalid email format. Please check your email address.'
                }

                setMessage({ type: 'error', text: errorMessage })
            }
        } catch (error) {
            console.error('❌ Unexpected registration error:', error)
            console.error('Stack:', error.stack)

            setMessage({
                type: 'error',
                text: error.message || 'An unexpected error occurred. Please try again.'
            })
        } finally {
            setLoading(false)
        }
    }

    // Show email confirmation message
    if (emailSent) {
        return (
            <AuthLayout
                title="Check Your Email"
                subtitle="Verify your account"
                icon={Mail}
            >
                <div className="text-center py-4">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-10 h-10 text-green-400" />
                    </div>

                    <h3 className="text-xl font-bold mb-3">Verification Email Sent!</h3>

                    <p className="text-gray-300 mb-4">
                        We&apos;ve sent a confirmation link to:
                    </p>

                    <p className="text-neon-green font-semibold mb-6">
                        {formData.email}
                    </p>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 text-left">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-300">
                                <p className="mb-2">📧 Click the link in the email to verify your account</p>
                                <p className="mb-2">⏱️ The link expires in 24 hours</p>
                                <p>📁 Check your spam folder if you don&apos;t see it</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/account/login')}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity"
                        >
                            Go to Login
                        </button>

                        <button
                            onClick={() => {
                                setEmailSent(false)
                                setMessage({ type: '', text: '' })
                            }}
                            className="w-full py-3 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors"
                        >
                            Back to Registration
                        </button>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join our community today"
            icon={User}
        >
            <Message type={message.type} text={message.text} />

            {/* Show attempt warning */}
            {attempts >= 2 && (
                <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Multiple failed attempts. Too many tries may temporarily block registration.</span>
                </div>
            )}

            {/* Rate limit warning */}
            {message.text?.includes('52 seconds') && (
                <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>⏱️ Rate limit reached. Please wait about 1 minute before trying again.</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            disabled={loading}
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            autoComplete="name"
                        />
                    </div>
                </div>

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

                <div>
                    <label className="block text-sm font-medium mb-2">Account Type</label>
                    <div className="flex gap-4">
                        {['user', 'client', 'admin'].map((role) => (
                            <label key={role} className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value={role}
                                    checked={formData.role === role}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="sr-only peer"
                                />
                                <div className={`p-4 rounded-lg text-center transition-all ${formData.role === role
                                        ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold'
                                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </div>
                            </label>
                        ))}
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

                <PasswordInput
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    label="Confirm Password"
                    disabled={loading}
                />

                {/* Password requirements hint */}
                <div className="text-xs text-gray-500 space-y-1">
                    <p className="flex items-center gap-2">
                        <CheckCircle className={`w-3 h-3 ${formData.password.length >= 6 ? 'text-green-400' : 'text-gray-600'}`} />
                        At least 6 characters
                    </p>
                    <p className="flex items-center gap-2">
                        <CheckCircle className={`w-3 h-3 ${/[a-zA-Z]/.test(formData.password) ? 'text-green-400' : 'text-gray-600'}`} />
                        Contains letters
                    </p>
                    <p className="flex items-center gap-2">
                        <CheckCircle className={`w-3 h-3 ${/\d/.test(formData.password) ? 'text-green-400' : 'text-gray-600'}`} />
                        Contains numbers
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                            Creating Account...
                        </span>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-400">
                    Already have an account?{' '}
                    <Link
                        href="/account/login"
                        className="text-neon-green hover:underline hover:text-neon-blue transition-colors font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </div>

            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-xs text-gray-400">
                    <p className="font-mono">Debug: {attempts} attempt(s) | {loading ? 'Loading...' : 'Ready'}</p>
                    <p className="font-mono text-xs mt-1">Redirect URL: {typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''}</p>
                </div>
            )}
        </AuthLayout>
    )
}