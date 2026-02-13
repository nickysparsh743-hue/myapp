'use client'

import { ArrowRight, MessageCircle, Zap } from 'lucide-react'
import Link from 'next/link'

const CTA = () => {
    return (
        <section className="relative section-padding overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
            </div>

            <div className="relative container-custom text-center z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Icon */}
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-neon-green to-neon-blue mb-8">
                        <Zap className="w-8 h-8 text-white" />
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Ready to Transform Your{' '}
                        <span className="gradient-text">Digital Presence?</span>
                    </h2>

                    {/* Description */}
                    <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                        Let&apos;s build something amazing together. Get a free consultation and project quote today.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/contact"
                            className="btn-primary flex items-center gap-2 group px-10"
                        >
                            Start Your Project
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                        <Link
                            href="https://wa.me/0703576876"
                            target="_blank"
                            className="btn-secondary flex items-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Chat on WhatsApp
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/10">
                        {[
                            { value: '48h', label: 'Response Time' },
                            { value: 'Free', label: 'Consultation' },
                            { value: '100%', label: 'Confidential' },
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl font-bold gradient-text mb-2">{item.value}</div>
                                <div className="text-sm text-gray-400">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA