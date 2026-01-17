'use client'

import { useState } from 'react'
import CTA from '../components/CTA'
import Link from 'next/link'
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react'

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: '',
        message: ''
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

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission
        console.log('Form submitted:', formData)
        // Reset form
        setFormData({
            name: '',
            email: '',
            service: '',
            message: ''
        })
        alert('Thank you! We will contact you soon.')
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
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none transition-all duration-300"
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
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none transition-all duration-300"
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
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none transition-all duration-300"
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
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none transition-all duration-300 resize-none"
                                        placeholder="Tell us about your project..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary w-full flex items-center justify-center gap-2 group"
                                >
                                    Send Message
                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
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
                                        <a href="mailto:contact@algo-x.com" className="text-gray-400 hover:text-neon-green transition-colors duration-300">
                                            contact@algo-x.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Phone</h3>
                                        <a href="tel:+254700000000" className="text-gray-400 hover:text-neon-green transition-colors duration-300">
                                            +254 700 000 000
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-neon-purple to-pink-500">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Location</h3>
                                        <p className="text-gray-400">Nairobi, Kenya</p>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Button */}
                            <div className="mb-12">
                                <a
                                    href="https://wa.me/254700000000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all duration-300 w-full justify-center"
                                >
                                    <MessageCircle className="w-6 h-6 text-green-400" />
                                    <span className="font-semibold">Chat on WhatsApp</span>
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
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
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
                            <div key={index} className="glass-effect rounded-2xl p-6">
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
                            { label: 'Terms', href: '/terms' },
                            { label: 'Privacy', href: '/privacy' },
                            { label: 'Cookies', href: '/cookies' },
                            { label: 'Refund', href: '/refund' },
                            { label: 'SLA', href: '/sla' }
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-neon-green/10 border border-white/10 hover:border-neon-green/30 transition-all duration-300 text-center"
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