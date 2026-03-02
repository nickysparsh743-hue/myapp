'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Key } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'
import Message from '../components/Message'

export default function ForgotPasswordPage() {
    const { forgotPassword } = useAuth()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) {
            setMessage({ type: 'error', text: 'Please enter your email' })
            return
        }

        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const result = await forgotPassword(email)

            if (result.success) {
                setEmailSent(true)
                setMessage({ type: 'success', text: 'Password reset link sent to your email!' })
            } else {
                setMessage({ type: 'error', text: result.error || 'Something went wrong' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' })
        } finally {
            setLoading(false)
        }
    }

    if (emailSent) {
        return (
            <AuthLayout
                title="Check Your Email"
                subtitle="We've sent you a reset link"
                icon={Mail}
            >
                <div className="text-center py-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-10 h-10 text-green-400" />
                    </div>
                    <p className="text-gray-300 mb-6">
                        We&apos;ve sent a password reset link to <br />
                        <span className="font-semibold">{email}</span>
                    </p>
                    <p className="text-gray-400 mb-8">
                        Please check your inbox and click on the link to reset your password.
                    </p>
                    <div className="space-y-4">
                        <Link
                            href="/account/reset-password"
                            className="block w-full py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity text-center"
                        >
                            Enter Reset Token
                        </Link>
                        <button
                            onClick={() => {
                                setEmailSent(false)
                                setMessage({ type: '', text: '' })
                            }}
                            className="w-full py-3 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your email to reset your password"
            icon={Key}
        >
            <Message type={message.type} text={message.text} />

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setMessage({ type: '', text: '' })
                            }}
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : 'Send Reset Link'}
                </button>
            </form>

            <div className="mt-6 text-center space-y-4">
                <Link
                    href="/account/reset-password"
                    className="block text-sm text-neon-green hover:underline"
                >
                    Already have a reset token?
                </Link>
                <p className="text-gray-400">
                    Remember your password?{' '}
                    <Link
                        href="/account/login"
                        className="text-neon-green hover:underline"
                    >
                        Back to login
                    </Link>
                </p>
            </div>
        </AuthLayout>
    )
}