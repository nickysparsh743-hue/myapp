'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Key } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'
import Message from '../components/Message'
import PasswordInput from '../components/PasswordInput'

export default function ResetPasswordPage() {
    const router = useRouter()
    const { resetPassword } = useAuth()
    const [formData, setFormData] = useState({
        resetToken: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setMessage({ type: '', text: '' })
    }

    const validateForm = () => {
        if (!formData.resetToken || !formData.newPassword || !formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Please fill in all fields' })
            return false
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' })
            return false
        }
        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const result = await resetPassword(formData.resetToken, formData.newPassword)

            if (result.success) {
                setMessage({ type: 'success', text: 'Password changed successfully!' })
                setTimeout(() => {
                    router.push('/account/login')
                }, 1500)
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to reset password' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your new password"
            icon={Key}
        >
            <Message type={message.type} text={message.text} />

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Reset Token</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            name="resetToken"
                            value={formData.resetToken}
                            onChange={handleInputChange}
                            placeholder="Enter reset token from email"
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                        />
                    </div>
                </div>

                <PasswordInput
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    label="New Password"
                />

                <PasswordInput
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    label="Confirm Password"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : 'Reset Password'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-400">
                    Back to{' '}
                    <Link
                        href="/account/login"
                        className="text-neon-green hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    )
}