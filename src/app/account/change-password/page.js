'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Key } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'
import Message from '../components/Message'
import PasswordInput from '../components/PasswordInput'

export default function ChangePasswordPage() {
    const router = useRouter()
    const { changePassword } = useAuth()
    const [formData, setFormData] = useState({
        oldPassword: '',
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
        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Please fill in all fields' })
            return false
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' })
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
            const result = await changePassword(formData.oldPassword, formData.newPassword)

            if (result.success) {
                setMessage({ type: 'success', text: 'Password changed successfully!' })
                setTimeout(() => {
                    router.push('/account/login')
                }, 1500)
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to change password' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Change Password"
            subtitle="Update your password"
            icon={Key}
        >
            <Message type={message.type} text={message.text} />

            <form onSubmit={handleSubmit} className="space-y-4">
                <PasswordInput
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                    label="Current Password"
                />

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
                    {loading ? 'Processing...' : 'Change Password'}
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