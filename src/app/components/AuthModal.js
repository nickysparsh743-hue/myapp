'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, Key } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const AuthModal = ({ isOpen, onClose, mode, onModeChange }) => {
    const { login, register, forgotPassword, resetPassword, changePassword } = useAuth()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        oldPassword: '',
        newPassword: '',
        resetToken: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [step, setStep] = useState(1) // For reset password flow

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
            resetForm()
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'user',
            oldPassword: '',
            newPassword: '',
            resetToken: ''
        })
        setMessage({ type: '', text: '' })
        setStep(1)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setMessage({ type: '', text: '' }) // Clear message when user types
    }

    const validateForm = () => {
        if (mode === 'login') {
            if (!formData.email || !formData.password) {
                setMessage({ type: 'error', text: 'Please fill in all fields' })
                return false
            }
        } else if (mode === 'register') {
            if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
                setMessage({ type: 'error', text: 'Please fill in all fields' })
                return false
            }
            if (formData.password !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'Passwords do not match' })
                return false
            }
            if (formData.password.length < 6) {
                setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
                return false
            }
        } else if (mode === 'forgot-password') {
            if (!formData.email) {
                setMessage({ type: 'error', text: 'Please enter your email' })
                return false
            }
        } else if (mode === 'reset-password') {
            if (!formData.newPassword || !formData.confirmPassword) {
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
        } else if (mode === 'change-password') {
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
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            let result

            if (mode === 'login') {
                result = await login(formData.email, formData.password)
            } else if (mode === 'register') {
                result = await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                })
            } else if (mode === 'forgot-password') {
                result = await forgotPassword(formData.email)
            } else if (mode === 'reset-password') {
                result = await resetPassword(formData.resetToken, formData.newPassword)
            } else if (mode === 'change-password') {
                result = await changePassword(formData.oldPassword, formData.newPassword)
            }

            if (result.success) {
                if (mode === 'login' || mode === 'register') {
                    setMessage({ type: 'success', text: 'Authentication successful!' })
                    setTimeout(() => {
                        onClose()
                        resetForm()
                    }, 1500)
                } else if (mode === 'forgot-password') {
                    setMessage({ type: 'success', text: 'Password reset link sent to your email!' })
                    setStep(2) // Show check email message
                } else if (mode === 'reset-password' || mode === 'change-password') {
                    setMessage({ type: 'success', text: 'Password changed successfully!' })
                    setTimeout(() => {
                        onModeChange('login')
                        resetForm()
                    }, 1500)
                }
            } else {
                setMessage({ type: 'error', text: result.error || 'Something went wrong' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' })
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const renderStep1 = () => (
        <>
            <div className="text-center mb-8 ">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-green/20 to-neon-blue/20 flex items-center justify-center mx-auto mb-4">
                    {mode === 'login' ? (
                        <Lock className="w-8 h-8 text-neon-green" />
                    ) : mode === 'register' ? (
                        <User className="w-8 h-8 text-neon-green" />
                    ) : (
                        <Key className="w-8 h-8 text-neon-green" />
                    )}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                    {mode === 'login' ? 'Welcome Back'
                        : mode === 'register' ? 'Create Account'
                            : 'Reset Password'}
                </h2>
                <p className="text-gray-400">
                    {mode === 'login' ? 'Sign in to your account'
                        : mode === 'register' ? 'Join our community today'
                            : 'Enter your email to reset password'}
                </p>
            </div>

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

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
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
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                            />
                        </div>
                    </div>
                )}

                {(mode === 'login' || mode === 'register' || mode === 'forgot-password') && (
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
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                            />
                        </div>
                    </div>
                )}

                {mode === 'register' && (
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
                                        className="sr-only peer"
                                    />
                                    <div className={`p-4 rounded-lg text-center transition-all ${formData.role === role
                                            ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold'
                                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                        }`}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {mode === 'change-password' && (
                    <div>
                        <label className="block text-sm font-medium mb-2">Current Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleInputChange}
                                placeholder="Enter current password"
                                className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <Eye className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {(mode === 'login' || mode === 'register' || mode === 'reset-password' || mode === 'change-password') && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {mode === 'change-password' ? 'New Password' : 'Password'}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name={mode === 'change-password' ? 'newPassword' : 'password'}
                                    value={mode === 'change-password' ? formData.newPassword : formData.password}
                                    onChange={handleInputChange}
                                    placeholder={mode === 'change-password' ? 'Enter new password' : 'Enter your password'}
                                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {(mode === 'register' || mode === 'reset-password' || mode === 'change-password') && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm your password"
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
                        )}
                    </>
                )}

                {mode === 'reset-password' && (
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
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' :
                        mode === 'login' ? 'Sign In' :
                            mode === 'register' ? 'Create Account' :
                                mode === 'forgot-password' ? 'Send Reset Link' :
                                    mode === 'reset-password' ? 'Reset Password' :
                                        'Change Password'
                    }
                </button>
            </form>

            <div className="mt-6 text-center space-y-4">
                {mode === 'login' && (
                    <>
                        <button
                            onClick={() => onModeChange('forgot-password')}
                            className="text-sm text-neon-green hover:underline"
                        >
                            Forgot your password?
                        </button>
                        <p className="text-gray-400">
                            Don&apos;t have an account?{' '}
                            <button
                                onClick={() => onModeChange('register')}
                                className="text-neon-green hover:underline"
                            >
                                Sign up
                            </button>
                        </p>
                    </>
                )}

                {mode === 'register' && (
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <button
                            onClick={() => onModeChange('login')}
                            className="text-neon-green hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                )}

                {mode === 'forgot-password' && (
                    <>
                        <button
                            onClick={() => onModeChange('reset-password')}
                            className="text-sm text-neon-green hover:underline"
                        >
                            Already have a reset token?
                        </button>
                        <p className="text-gray-400">
                            Remember your password?{' '}
                            <button
                                onClick={() => onModeChange('login')}
                                className="text-neon-green hover:underline"
                            >
                                Back to login
                            </button>
                        </p>
                    </>
                )}

                {(mode === 'reset-password' || mode === 'change-password') && (
                    <p className="text-gray-400">
                        Back to{' '}
                        <button
                            onClick={() => onModeChange('login')}
                            className="text-neon-green hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                )}
            </div>
        </>
    )

    const renderStep2 = () => (
        <div className="text-center py-8 ">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Check Your Email</h3>
            <p className="text-gray-300 mb-6">
                We&apos;ve sent a password reset link to <br />
                <span className="font-semibold">{formData.email}</span>
            </p>
            <p className="text-gray-400 mb-8">
                Please check your inbox and click on the link to reset your password.
            </p>
            <div className="space-y-4">
                <button
                    onClick={() => onModeChange('reset-password')}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity"
                >
                    Enter Reset Token
                </button>
                <button
                    onClick={() => {
                        setStep(1)
                        setMessage({ type: '', text: '' })
                    }}
                    className="w-full py-3 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors"
                >
                    Back to Forgot Password
                </button>
            </div>
        </div>
    )

    return (
        <div className="fixed inset-0 z-50 flex justify-center  overflow-y-auto p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative glass-effect rounded-2xl w-full max-w-md overflow-y-auto border border-white/10 shadow-2xl animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    {mode === 'forgot-password' && step === 2 ? renderStep2() : renderStep1()}
                </div>
            </div>
        </div>
    )
}

export default AuthModal