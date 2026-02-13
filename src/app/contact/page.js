'use client'

import { useState } from 'react'
import CTA from '../components/CTA'
import Link from 'next/link'
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react'

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: '',
        message: ''
    })

    const [status, setStatus] = useState({
        submitting: false,
        submitted: false,
        error: null
    })

    const services = [
        'Web Development',
        'Mobile Apps',
        'AI & ML Solutions',
        'Data Analytics',
        'Cybersecurity',
        'Bots & Automation',
        'Graphics & UI/UX',
        'Writing Services',
        'Other'
    ]

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setStatus({ submitting: true, submitted: false, error: null })

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message')
            }

            // Success
            setStatus({ submitting: false, submitted: true, error: null })

            // Reset form
            setFormData({
                name: '',
                email: '',
                service: '',
                message: ''
            })

            // Clear success message after 5 seconds
            setTimeout(() => {
                setStatus(prev => ({ ...prev, submitted: false }))
            }, 5000)

        } catch (error) {
            setStatus({ submitting: false, submitted: false, error: error.message })
        }
    }

    return (
        <>
            <section className="pt-32 pb-20">
                <div className="container-custom text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Get In <span className="gradient-text">Touch</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Let&apos;s discuss your project and bring your ideas to life
                    </p>
                </div>
            </section>

            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="glass-effect rounded-3xl p-8 neon-border">
                            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

                            {/* Success Message */}
                            {status.submitted && (
                                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <p className="text-green-400">
                                        Thank you! Your message has been sent successfully. We&apos;ll get back to you within 24 hours.
                                    </p>
                                </div>
                            )}

                            {/* Error Message */}
                            {status.error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <p className="text-red-400">
                                        {status.error}. Please try again or contact us directly via email.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={status.submitting}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={status.submitting}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="service" className="block text-sm font-medium mb-2">
                                        Service Needed *
                                    </label>
                                    <select
                                        id="service"
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        required
                                        disabled={status.submitting}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select a service</option>
                                        {services.map((service) => (
                                            <option key={service} value={service}>
                                                {service}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        disabled={status.submitting}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Tell us about your project..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status.submitting}
                                    className={`btn-primary w-full flex items-center justify-center gap-2 group ${status.submitting ? 'opacity-75 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {status.submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>

                            <div className="space-y-8 mb-12">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Email</h3>
                                        <a href="mailto:nicholusmush@gmail.com" className="text-gray-400 hover:text-neon-green transition-colors duration-300">
                                            nicholusmush@gmail.com
                                        </a>
                                        <p className="text-sm text-gray-500 mt-1">For project inquiries</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Phone</h3>
                                        <a href="tel:+254703576876" className="text-gray-400 hover:text-neon-green transition-colors duration-300">
                                            +254 703 576 876
                                        </a>
                                        <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9am-6pm EAT</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-neon-purple to-pink-500">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Location</h3>
                                        <p className="text-gray-400">Nairobi, Kenya</p>
                                        <p className="text-sm text-gray-500 mt-1">Available for remote collaboration worldwide</p>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Button */}
                            <div className="mb-12">
                                <a
                                    href="https://wa.me/254703576876"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all duration-300 w-full justify-center group"
                                >
                                    <MessageCircle className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="font-semibold">Chat on WhatsApp</span>
                                    <span className="text-xs text-green-400 ml-2">Typically replies within 1 hour</span>
                                </a>
                            </div>

                            {/* Response Time */}
                            <div className="glass-effect rounded-2xl p-6">
                                <h3 className="font-bold mb-4">Response Time</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Initial Response', value: 'Within 24 hours' },
                                        { label: 'Project Quote', value: '1-2 business days' },
                                        { label: 'Support', value: '24/7 for active projects' },
                                    ].map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-gray-400">{item.label}</span>
                                            <span className="font-semibold text-neon-green">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-neon-green/5 to-neon-blue/5 rounded-xl border border-white/5">
                                <p className="text-sm text-gray-400 text-center">
                                    🔒 Your information is secure and encrypted. We never share your data.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section - Unchanged */}
            <section className="section-padding bg-dark-gray/30">
                <div className="container-custom">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                        Frequently Asked <span className="gradient-text">Questions</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            {
                                question: 'What is your typical project timeline?',
                                answer: 'Timelines vary based on project complexity. Simple websites take 2-4 weeks, while complex AI systems may take 2-3 months.'
                            },
                            {
                                question: 'Do you provide ongoing support?',
                                answer: 'Yes, we offer various support packages including maintenance, updates, and 24/7 technical support.'
                            },
                            {
                                question: 'What payment models do you offer?',
                                answer: 'We offer fixed-price projects, hourly rates, and retainer models depending on project requirements.'
                            },
                            {
                                question: 'Do you work with international clients?',
                                answer: 'Absolutely! We serve clients globally while maintaining our focus on African markets.'
                            },
                        ].map((faq, index) => (
                            <div key={index} className="glass-effect rounded-2xl p-6 hover:neon-border transition-all duration-300">
                                <h3 className="font-bold mb-3">{faq.question}</h3>
                                <p className="text-gray-400">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Legal Links Section */}
            <section className="section-padding bg-dark-gray/50">
                <div className="container-custom">
                    <h3 className="text-2xl font-bold mb-8 text-center">
                        Legal <span className="gradient-text">Information</span>
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: 'Terms of Service', href: '/terms' },
                            { label: 'Privacy Policy', href: '/privacy' },
                            { label: 'Cookie Policy', href: '/cookies' },
                            { label: 'Refund Policy', href: '/refund' },
                            { label: 'Service Level', href: '/sla' }
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-neon-green/10 border border-white/10 hover:border-neon-green/30 transition-all duration-300 text-center text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <CTA />
        </>
    )
}

export default ContactPage