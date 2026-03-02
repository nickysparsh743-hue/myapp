'use client'

import { useState, useEffect } from 'react'
import {
    Calculator, Cpu, Globe, Database, Shield, Palette,
    FileText, Smartphone, BarChart3, Zap, Clock, DollarSign,
    Check, X, Download, Send, Calendar, AlertCircle, CheckCircle,
    Mail, Phone, MapPin, Loader
} from 'lucide-react'

const PricingCalculator = () => {
    const [services, setServices] = useState({
        web: false,
        mobile: false,
        ai: false,
        data: false,
        security: false,
        design: false,
        writing: false
    })

    const [complexity, setComplexity] = useState('medium')
    const [timeline, setTimeline] = useState('standard')
    const [teamSize, setTeamSize] = useState('standard')
    const [showDetails, setShowDetails] = useState(false)
    const [calculatedPrice, setCalculatedPrice] = useState(0)
    const [quoteRequested, setQuoteRequested] = useState(false)
    const [loading, setLoading] = useState(false)
    const [quoteMessage, setQuoteMessage] = useState(null)
    const [clientInfo, setClientInfo] = useState({
        name: '',
        email: '',
        company: '',
        description: ''
    })

    // Service definitions
    const serviceDefinitions = {
        web: {
            name: 'Web Development',
            icon: Globe,
            description: 'Custom websites & web applications',
            basePrice: 5000,
            complexityMultiplier: { low: 0.5, medium: 1, high: 2 },
            features: ['Responsive Design', 'CMS Integration', 'E-commerce', 'API Development']
        },
        mobile: {
            name: 'Mobile Apps',
            icon: Smartphone,
            description: 'iOS & Android applications',
            basePrice: 8000,
            complexityMultiplier: { low: 0.6, medium: 1.2, high: 2.5 },
            features: ['Cross-platform', 'App Store Deployment', 'Push Notifications', 'Offline Support']
        },
        ai: {
            name: 'AI/ML Solutions',
            icon: Cpu,
            description: 'Artificial Intelligence systems',
            basePrice: 15000,
            complexityMultiplier: { low: 0.4, medium: 1, high: 3 },
            features: ['Custom Models', 'Chatbots', 'Predictive Analytics', 'Computer Vision']
        },
        data: {
            name: 'Data Analytics',
            icon: BarChart3,
            description: 'Data processing & visualization',
            basePrice: 7000,
            complexityMultiplier: { low: 0.5, medium: 1, high: 2.2 },
            features: ['Dashboards', 'Reports', 'Predictive Models', 'Data Cleaning']
        },
        security: {
            name: 'Cybersecurity',
            icon: Shield,
            description: 'Security assessment & protection',
            basePrice: 6000,
            complexityMultiplier: { low: 0.6, medium: 1, high: 1.8 },
            features: ['Penetration Testing', 'Security Audits', 'Monitoring', 'Compliance']
        },
        design: {
            name: 'Graphics & UI/UX',
            icon: Palette,
            description: 'Design & user experience',
            basePrice: 3000,
            complexityMultiplier: { low: 0.5, medium: 1, high: 1.5 },
            features: ['UI/UX Design', 'Brand Identity', 'Prototyping', 'Design Systems']
        },
        writing: {
            name: 'Writing Services',
            icon: FileText,
            description: 'Content creation & documentation',
            basePrice: 2000,
            complexityMultiplier: { low: 0.5, medium: 1, high: 1.5 },
            features: ['Technical Writing', 'Content Strategy', 'SEO Content', 'Documentation']
        }
    }

    // Timeline multipliers
    const timelineMultipliers = {
        urgent: 1.8,    // +80%
        fast: 1.4,      // +40%
        standard: 1,    // Normal
        flexible: 0.9   // -10%
    }

    // Team size multipliers
    const teamSizeMultipliers = {
        solo: 0.7,      // Single developer
        standard: 1,    // Standard team (2-3)
        premium: 1.5,   // Dedicated team (4+)
        enterprise: 2   // Enterprise scale
    }

    // Complexity descriptions
    const complexityDescriptions = {
        low: 'Basic features, standard design, no complex integrations',
        medium: 'Custom features, responsive design, API integrations',
        high: 'Advanced features, complex architecture, multiple integrations'
    }

    // Calculate price
    const calculatePrice = () => {
        let total = 0

        // Add base prices for selected services
        Object.entries(services).forEach(([serviceKey, isSelected]) => {
            if (isSelected) {
                const service = serviceDefinitions[serviceKey]
                const basePrice = service.basePrice
                const complexityMult = service.complexityMultiplier[complexity]
                total += basePrice * complexityMult
            }
        })

        // Apply timeline multiplier
        total *= timelineMultipliers[timeline]

        // Apply team size multiplier
        total *= teamSizeMultipliers[teamSize]

        // Minimum project price
        total = Math.max(total, 1000)

        return Math.round(total)
    }

    // Update price when dependencies change
    useEffect(() => {
        const price = calculatePrice()
        setCalculatedPrice(price)
    }, [services, complexity, timeline, teamSize])

    // Handle service toggle
    const toggleService = (serviceKey) => {
        setServices(prev => ({
            ...prev,
            [serviceKey]: !prev[serviceKey]
        }))
    }

    // Get selected services count
    const selectedServicesCount = Object.values(services).filter(Boolean).length

    // Validate form
    const validateForm = () => {
        if (!clientInfo.name.trim()) {
            setQuoteMessage({ type: 'error', text: 'Please enter your name' })
            return false
        }
        if (!clientInfo.email.trim()) {
            setQuoteMessage({ type: 'error', text: 'Please enter your email address' })
            return false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(clientInfo.email)) {
            setQuoteMessage({ type: 'error', text: 'Please enter a valid email address' })
            return false
        }
        if (selectedServicesCount === 0) {
            setQuoteMessage({ type: 'error', text: 'Please select at least one service' })
            return false
        }
        return true
    }

    // Handle quote request
    const handleQuoteRequest = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            // Auto-hide error message after 5 seconds
            setTimeout(() => setQuoteMessage(null), 5000)
            return
        }

        setLoading(true)
        setQuoteMessage(null)

        try {
            // Prepare quote data
            const quoteData = {
                services: Object.entries(services)
                    .filter(([_, selected]) => selected)
                    .map(([key]) => serviceDefinitions[key].name),
                complexity,
                timeline,
                teamSize,
                estimatedPrice: calculatedPrice,
                clientInfo,
                timestamp: new Date().toISOString()
            }

            // Send to API
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quoteData)
            })

            const data = await response.json()

            if (data.success) {
                setQuoteRequested(true)
                setQuoteMessage({
                    type: 'success',
                    text: 'Quote request sent! Check your email for confirmation.'
                })

                // Reset form after 10 seconds
                setTimeout(() => {
                    setQuoteRequested(false)
                    setQuoteMessage(null)
                    setClientInfo({ name: '', email: '', company: '', description: '' })
                }, 10000)
            } else {
                throw new Error(data.error || 'Failed to send quote request')
            }
        } catch (error) {
            console.error('Quote error:', error)
            setQuoteMessage({
                type: 'error',
                text: error.message || 'Failed to send request. Please try again or contact us directly.'
            })

            setTimeout(() => setQuoteMessage(null), 5000)
        } finally {
            setLoading(false)
        }
    }

    // Download quote as text file
    const downloadQuote = () => {
        const selectedServicesList = Object.entries(services)
            .filter(([_, selected]) => selected)
            .map(([key]) => serviceDefinitions[key].name)
            .join('\n   • ')

        const quoteText = `ALGO X TECHNOLOGIES - PROJECT QUOTE
=====================================
Date: ${new Date().toLocaleDateString()}
Quote ID: Q-${Date.now().toString().slice(-6)}

CLIENT INFORMATION
------------------
Name: ${clientInfo.name || 'Not provided'}
Email: ${clientInfo.email || 'Not provided'}
Company: ${clientInfo.company || 'Not provided'}

PROJECT DETAILS
---------------
Services Selected:
   • ${selectedServicesList}

Complexity: ${complexity.toUpperCase()}
Timeline: ${timeline.toUpperCase()}
Team Size: ${teamSize.toUpperCase()}

COST ESTIMATE
-------------
Estimated Project Cost: $${calculatedPrice.toLocaleString()}

This quote includes:
• Initial consultation and requirements gathering
• Project planning and architecture design
• Development and testing
• Deployment and documentation
• 30 days of post-launch support

VALIDITY
--------
This quote is valid for 30 days from ${new Date().toLocaleDateString()}
Quote expires on: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

CONTACT INFORMATION
-------------------
Algo X Technologies
📍 Nairobi, Kenya
📧 contact@algo-x.com
📞 +254 700 000 000
🌐 www.algo-x.com

---
This is an estimate based on the information provided.
Final pricing may vary based on detailed requirements and scope.
`

        const blob = new Blob([quoteText], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `algo-x-quote-${Date.now()}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    // Reset all selections
    const resetSelections = () => {
        setServices({
            web: false,
            mobile: false,
            ai: false,
            data: false,
            security: false,
            design: false,
            writing: false
        })
        setComplexity('medium')
        setTimeline('standard')
        setTeamSize('standard')
        setClientInfo({ name: '', email: '', company: '', description: '' })
        setQuoteMessage(null)
    }

    return (
        <div className="glass-effect rounded-3xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                        <Calculator className="w-6 h-6 text-neon-green" />
                        Project Cost Calculator
                    </h3>
                    <p className="text-gray-400">Get instant estimate for your project</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={resetSelections}
                        className="px-4 py-2 rounded-lg border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-sm transition-all"
                        title="Reset all selections"
                    >
                        Reset
                    </button>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green/30 text-sm transition-all"
                    >
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                </div>
            </div>

            {/* Service Selection */}
            <div className="mb-8">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-neon-green" />
                    Select Services <span className="text-sm font-normal text-gray-400 ml-2">({selectedServicesCount} selected)</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(serviceDefinitions).map(([key, service]) => {
                        const Icon = service.icon
                        return (
                            <button
                                key={key}
                                onClick={() => toggleService(key)}
                                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left group relative overflow-hidden ${services[key]
                                        ? 'border-neon-green bg-gradient-to-br from-neon-green/20 to-neon-blue/20'
                                        : 'border-white/10 hover:border-neon-green/30 hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-lg transition-all ${services[key]
                                            ? 'bg-neon-green text-dark scale-110'
                                            : 'bg-white/5 group-hover:bg-neon-green/10'
                                        }`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    {services[key] ? (
                                        <Check className="w-5 h-5 text-neon-green" />
                                    ) : (
                                        <div className="w-5 h-5 border-2 border-white/20 rounded" />
                                    )}
                                </div>
                                <h5 className="font-bold mb-1">{service.name}</h5>
                                <p className="text-xs text-gray-400">{service.description}</p>
                                {showDetails && (
                                    <div className="mt-3 pt-3 border-t border-white/10">
                                        <p className="text-xs font-medium mb-2 text-neon-green">Includes:</p>
                                        <ul className="space-y-1">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="text-xs text-gray-400 flex items-center gap-1">
                                                    <div className="w-1 h-1 rounded-full bg-neon-green" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {services[key] && (
                                    <div className="absolute top-2 right-2">
                                        <span className="text-xs font-bold text-neon-green">
                                            ${service.basePrice.toLocaleString()}+
                                        </span>
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Configuration Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Complexity */}
                <div className="glass-effect rounded-2xl p-6">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-neon-green" />
                        Project Complexity
                    </h4>
                    <div className="space-y-3">
                        {[
                            { key: 'low', label: 'Basic', desc: 'Simple features', multiplier: '0.5x' },
                            { key: 'medium', label: 'Standard', desc: 'Custom features', multiplier: '1x' },
                            { key: 'high', label: 'Advanced', desc: 'Complex systems', multiplier: '2-3x' }
                        ].map((level) => (
                            <button
                                key={level.key}
                                onClick={() => setComplexity(level.key)}
                                className={`w-full p-3 rounded-lg text-left transition-all ${complexity === level.key
                                        ? 'bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border border-neon-green'
                                        : 'border border-white/10 hover:border-white/30'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium">{level.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">{level.multiplier}</span>
                                        {complexity === level.key && (
                                            <Check className="w-4 h-4 text-neon-green" />
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">{level.desc}</p>
                            </button>
                        ))}
                    </div>
                    {showDetails && (
                        <p className="text-xs text-gray-400 mt-4 p-3 bg-white/5 rounded-lg">
                            {complexityDescriptions[complexity]}
                        </p>
                    )}
                </div>

                {/* Timeline */}
                <div className="glass-effect rounded-2xl p-6">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-neon-green" />
                        Timeline
                    </h4>
                    <div className="space-y-3">
                        {[
                            { key: 'urgent', label: 'Urgent', desc: '2-4 weeks', multiplier: '+80%', color: 'text-red-400' },
                            { key: 'fast', label: 'Fast', desc: '4-8 weeks', multiplier: '+40%', color: 'text-orange-400' },
                            { key: 'standard', label: 'Standard', desc: '8-12 weeks', multiplier: 'Normal', color: 'text-green-400' },
                            { key: 'flexible', label: 'Flexible', desc: '12+ weeks', multiplier: '-10%', color: 'text-blue-400' }
                        ].map((time) => (
                            <button
                                key={time.key}
                                onClick={() => setTimeline(time.key)}
                                className={`w-full p-3 rounded-lg text-left transition-all ${timeline === time.key
                                        ? 'bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border border-neon-green'
                                        : 'border border-white/10 hover:border-white/30'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{time.label}</div>
                                        <div className="text-xs text-gray-400">{time.desc}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-sm font-bold ${time.color}`}>
                                            {time.multiplier}
                                        </div>
                                        {timeline === time.key && (
                                            <Check className="w-4 h-4 text-neon-green ml-auto mt-1" />
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Team Size */}
                <div className="glass-effect rounded-2xl p-6">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-neon-green" />
                        Team Size
                    </h4>
                    <div className="space-y-3">
                        {[
                            { key: 'solo', label: 'Solo Developer', desc: '1 specialist' },
                            { key: 'standard', label: 'Standard Team', desc: '2-3 members' },
                            { key: 'premium', label: 'Premium Team', desc: '4-6 members' },
                            { key: 'enterprise', label: 'Enterprise', desc: '7+ members' }
                        ].map((team) => (
                            <button
                                key={team.key}
                                onClick={() => setTeamSize(team.key)}
                                className={`w-full p-3 rounded-lg text-left transition-all ${teamSize === team.key
                                        ? 'bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border border-neon-green'
                                        : 'border border-white/10 hover:border-white/30'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium">{team.label}</span>
                                    {teamSize === team.key && (
                                        <Check className="w-4 h-4 text-neon-green" />
                                    )}
                                </div>
                                <p className="text-xs text-gray-400">{team.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Price Display & Actions */}
            <div className="bg-gradient-to-r from-dark-gray to-dark rounded-2xl p-8 text-center border border-neon-green/30">
                {selectedServicesCount === 0 ? (
                    <div className="py-8">
                        <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">Select services to get an estimate</p>
                        <p className="text-sm text-gray-500">Project prices start from $1,000</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <p className="text-gray-400 mb-2">Estimated Project Cost</p>
                            <div className="text-5xl font-bold gradient-text mb-2">
                                ${calculatedPrice.toLocaleString()}
                            </div>
                            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                                <span>For {selectedServicesCount} service{selectedServicesCount > 1 ? 's' : ''}</span>
                                <span>•</span>
                                <span className="capitalize">{complexity} complexity</span>
                                <span>•</span>
                                <span className="capitalize">{timeline} timeline</span>
                            </p>
                        </div>

                        {/* Message Display */}
                        {quoteMessage && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${quoteMessage.type === 'error'
                                    ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                    : 'bg-green-500/10 border border-green-500/20 text-green-400'
                                }`}>
                                {quoteMessage.type === 'error' ? (
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                ) : (
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                )}
                                <span className="text-sm">{quoteMessage.text}</span>
                            </div>
                        )}

                        {/* Quote Form */}
                        {quoteRequested ? (
                            <div className="p-6 bg-gradient-to-r from-neon-green/10 to-neon-blue/10 rounded-xl animate-fadeIn">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-green-400" />
                                </div>
                                <h4 className="text-xl font-bold mb-2">Quote Request Sent! 🎉</h4>
                                <p className="text-gray-400 mb-4">
                                    We&apos;ve sent a confirmation to <span className="text-neon-green font-semibold">{clientInfo.email}</span>
                                </p>
                                <p className="text-sm text-gray-500 mb-6">
                                    Our team will review your requirements and contact you within 24 hours.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={downloadQuote}
                                        className="btn-primary inline-flex items-center gap-2 px-6"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Quote Summary
                                    </button>
                                    <button
                                        onClick={() => {
                                            setQuoteRequested(false)
                                            setClientInfo({ name: '', email: '', company: '', description: '' })
                                        }}
                                        className="btn-secondary inline-flex items-center gap-2 px-6"
                                    >
                                        New Quote
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleQuoteRequest} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Your Name *"
                                            value={clientInfo.name}
                                            onChange={(e) => {
                                                setClientInfo(prev => ({ ...prev, name: e.target.value }))
                                                setQuoteMessage(null)
                                            }}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Email Address *"
                                            value={clientInfo.email}
                                            onChange={(e) => {
                                                setClientInfo(prev => ({ ...prev, email: e.target.value }))
                                                setQuoteMessage(null)
                                            }}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none transition-all"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Company (Optional)"
                                        value={clientInfo.company}
                                        onChange={(e) => {
                                            setClientInfo(prev => ({ ...prev, company: e.target.value }))
                                            setQuoteMessage(null)
                                        }}
                                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Project Description (Optional)"
                                        value={clientInfo.description}
                                        onChange={(e) => {
                                            setClientInfo(prev => ({ ...prev, description: e.target.value }))
                                            setQuoteMessage(null)
                                        }}
                                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none transition-all"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary flex items-center gap-2 px-8 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Get Detailed Quote
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={downloadQuote}
                                        className="btn-secondary flex items-center gap-2 px-8 transition-all hover:scale-105"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download Estimate
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                                    <span className="text-red-400">*</span> Required fields
                                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                    <span>30-day quote validity</span>
                                </p>
                            </form>
                        )}
                    </>
                )}
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center group hover:scale-105 transition-transform">
                        <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-neon-green/30 transition-all">
                            <Check className="w-6 h-6 text-neon-green" />
                        </div>
                        <p className="text-sm font-medium">No Hidden Costs</p>
                        <p className="text-xs text-gray-400">Transparent pricing with detailed breakdown</p>
                    </div>
                    <div className="text-center group hover:scale-105 transition-transform">
                        <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-neon-green/30 transition-all">
                            <Clock className="w-6 h-6 text-neon-green" />
                        </div>
                        <p className="text-sm font-medium">30-Day Quote Validity</p>
                        <p className="text-xs text-gray-400">Lock in your price for 30 days</p>
                    </div>
                    <div className="text-center group hover:scale-105 transition-transform">
                        <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-neon-green/30 transition-all">
                            <Shield className="w-6 h-6 text-neon-green" />
                        </div>
                        <p className="text-sm font-medium">14-Day Satisfaction</p>
                        <p className="text-xs text-gray-400">Money-back guarantee on initial consultation</p>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neon-green" />
                        <span>contact@algo-x.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-neon-green" />
                        <span>+254 700 000 000</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-neon-green" />
                        <span>Nairobi, Kenya</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PricingCalculator