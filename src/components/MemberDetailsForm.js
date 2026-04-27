'use client'

import { useState, useEffect } from 'react'
import {
    X, Mail, Phone, MapPin, Clock, MessageSquare, AlertCircle,
    Check, User, Shield, Save, Loader
} from 'lucide-react'

export default function MemberDetailsForm({ member, teamName, onComplete, onClose }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        address: '',
        timezone: 'UTC',
        communication_preference: 'email',
        emergency_contact: '',
        emergency_phone: '',
        bio: ''
    })

    const timezones = [
        'UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6',
        'UTC-5', 'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC', 'UTC+1',
        'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5', 'UTC+6', 'UTC+7', 'UTC+8',
        'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12'
    ]

    const communicationOptions = [
        { value: 'email', label: '📧 Email', icon: Mail },
        { value: 'phone', label: '📱 Phone', icon: Phone },
        { value: 'both', label: '🔄 Both', icon: MessageSquare }
    ]

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validateStep = () => {
        if (step === 1) {
            if (!formData.email || !formData.phone) {
                setError('Please fill in both email and phone')
                return false
            }
            if (!formData.email.includes('@')) {
                setError('Please enter a valid email')
                return false
            }
        }
        if (step === 2) {
            if (!formData.address) {
                setError('Please enter your address')
                return false
            }
            if (!formData.bio) {
                setError('Please tell us about yourself')
                return false
            }
        }
        if (step === 3) {
            if (!formData.emergency_contact || !formData.emergency_phone) {
                setError('Emergency contact information is required')
                return false
            }
        }
        setError(null)
        return true
    }

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1)
        }
    }

    const handlePrevious = () => {
        setError(null)
        setStep(step - 1)
    }

    const handleSubmit = async () => {
        if (!validateStep()) return

        setLoading(true)
        try {
            const response = await fetch('/api/dashboard/team-members/details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    member_id: member.id,
                    contact_details: formData
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save details')
            }

            onComplete && onComplete()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-dark to-dark-darker rounded-2xl border border-neon-green/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border-b border-white/10 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                            Welcome to {teamName}! 🎉
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Step {step} of 3 • Complete your profile</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pt-6">
                    <div className="flex gap-2">
                        {[1, 2, 3].map((num) => (
                            <div
                                key={num}
                                className={`h-2 flex-1 rounded-full transition-all ${
                                    num < step
                                        ? 'bg-gradient-to-r from-neon-green to-neon-blue'
                                        : num === step
                                        ? 'bg-neon-green'
                                        : 'bg-white/10'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Step 1: Contact Information */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center text-dark font-bold">
                                    1
                                </div>
                                <h3 className="text-xl font-bold">Contact Information</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-neon-green" />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your.email@example.com"
                                        className="w-full bg-dark-darker border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-neon-blue" />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+1 (555) 123-4567"
                                        className="w-full bg-dark-darker border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-purple-400" />
                                        Timezone
                                    </label>
                                    <select
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleInputChange}
                                        className="w-full bg-dark-darker border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
                                    >
                                        {timezones.map(tz => (
                                            <option key={tz} value={tz}>{tz}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                                        Preferred Communication
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {communicationOptions.map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    communication_preference: option.value
                                                }))}
                                                className={`p-3 rounded-lg border transition-all ${
                                                    formData.communication_preference === option.value
                                                        ? 'border-neon-green bg-neon-green/10'
                                                        : 'border-white/10 hover:border-white/20'
                                                }`}
                                            >
                                                <div className="text-sm font-bold">{option.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Personal Details */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center text-dark font-bold">
                                    2
                                </div>
                                <h3 className="text-xl font-bold">About You</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-red-400" />
                                        Location / Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="City, Country or Full Address"
                                        className="w-full bg-dark-darker border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4 text-neon-green" />
                                        Professional Bio *
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Tell us about your expertise, interests, and what you bring to the team..."
                                        className="w-full bg-dark-darker border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors resize-none"
                                        rows="4"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        {formData.bio.length}/500 characters
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Emergency Contact */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center text-dark font-bold">
                                    3
                                </div>
                                <h3 className="text-xl font-bold">Emergency Contact</h3>
                            </div>

                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-3 mb-6">
                                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <p className="text-yellow-300 text-sm">
                                    Help us reach you in case of urgent matters. This information is only visible to team leads.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4 text-orange-400" />
                                        Emergency Contact Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="emergency_contact"
                                        value={formData.emergency_contact}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Jane Doe"
                                        className="w-full bg-dark-darker border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-orange-400" />
                                        Emergency Contact Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="emergency_phone"
                                        value={formData.emergency_phone}
                                        onChange={handleInputChange}
                                        placeholder="+1 (555) 123-4567"
                                        className="w-full bg-dark-darker border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mt-8 p-4 bg-neon-green/5 border border-neon-green/30 rounded-lg space-y-2">
                                <h4 className="font-bold text-neon-green flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Summary
                                </h4>
                                <p className="text-xs text-gray-400">
                                    <span className="text-gray-300 font-bold">Email:</span> {formData.email}
                                </p>
                                <p className="text-xs text-gray-400">
                                    <span className="text-gray-300 font-bold">Phone:</span> {formData.phone}
                                </p>
                                <p className="text-xs text-gray-400">
                                    <span className="text-gray-300 font-bold">Location:</span> {formData.address}
                                </p>
                                <p className="text-xs text-gray-400">
                                    <span className="text-gray-300 font-bold">Timezone:</span> {formData.timezone}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-dark border-t border-white/10 p-6 flex gap-3">
                    {step > 1 && (
                        <button
                            onClick={handlePrevious}
                            className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 transition-colors font-bold"
                        >
                            Back
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Complete & Join Team
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
