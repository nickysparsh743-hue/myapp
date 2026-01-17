'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

export default function ChangePasswordPage() {
    const { changePassword, user } = useAuth()
    const router = useRouter()

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setMessage({ type: '', text: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Please fill in all fields' })
            return
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' })
            return
        }

        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
            return
        }

        if (formData.oldPassword === formData.newPassword) {
            setMessage({ type: 'error', text: 'New password must be different from old password' })
            return
        }

        setLoading(true)
        const result = await changePassword(formData.oldPassword, formData.newPassword)

        if (result.success) {
            setMessage({ type: 'success', text: 'Password changed successfully!' })
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to change password' })
        }

        setLoading(false)
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400">Please log in to change your password</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-dark py-12">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-green/20 to-neon-blue/20 flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-neon-green" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Change Password</h1>
                    <p className="text-gray-400">Secure your account with a new password</p>
                </div>

                {/* Form */}
                <div className="glass-effect rounded-2xl p-8 border border-white/10">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'error'
                                ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                : 'bg-green-500/10 border border-green-500/20 text-green-400'
                            }`}>
                            {message.type === 'error' ? (
                                <AlertCircle className="w-5 h-5" />
                            ) : (
                                <CheckCircle className="w-5 h-5" />
                            )}
                            <span>{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showOldPassword ? 'text' : 'password'}
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleInputChange}
                                    placeholder="Enter current password"
                                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showOldPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    placeholder="Enter new password"
                                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                Password must be at least 6 characters long
                            </p>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm new password"
                                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Changing Password...' : 'Change Password'}
                        </button>

                        {/* Password Requirements */}
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h4 className="font-medium mb-2">Password Requirements:</h4>
                            <ul className="space-y-1 text-sm text-gray-400">
                                <li className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-600'
                                        }`} />
                                    At least 6 characters long
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${formData.newPassword !== formData.oldPassword && formData.oldPassword ? 'bg-green-500' : 'bg-gray-600'
                                        }`} />
                                    Different from current password
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${formData.newPassword === formData.confirmPassword && formData.confirmPassword ? 'bg-green-500' : 'bg-gray-600'
                                        }`} />
                                    Passwords match
                                </li>
                            </ul>
                        </div>
                    </form>
                </div>

                {/* Security Tips */}
                <div className="mt-8 p-6 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-neon-green" />
                        Security Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>• Use a unique password that you don&apos;t use elsewhere</li>
                        <li>• Consider using a password manager</li>
                        <li>• Enable two-factor authentication for extra security</li>
                        <li>• Change your password regularly</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}