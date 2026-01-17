'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-gray to-dark" />
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-green/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-float delay-1000" />
            </div>

            <div className="relative container-custom section-padding text-center z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-8 animate-pulse-slow">
                        <Sparkles className="w-4 h-4 text-neon-green" />
                        <span className="text-sm font-medium gradient-text">Intelligent Digital Solutions</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        <span className="block">Algo X —</span>
                        <span className="block gradient-text mt-2">Intelligent Digital Solutions</span>
                        <span className="block text-xl md:text-2xl text-gray-300 mt-4">
                            Powered by Code, Data & AI
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                        We build websites, apps, AI systems, secure software, and digital content that help businesses grow.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <Link href="/contact" className="btn-primary flex items-center gap-2 group">
                            Get a Quote
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                        <Link href="/contact#contact" className="btn-secondary">
                            Talk to Us
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                        {[
                            { value: '50+', label: 'Projects' },
                            { value: '100%', label: 'Satisfaction' },
                            { value: '24/7', label: 'Support' },
                            { value: 'AI', label: 'Powered' },
                        ].map((stat, index) => (
                            <div key={index} className="glass-effect p-4 rounded-2xl neon-border">
                                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-neon-green/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-neon-green rounded-full mt-2" />
                </div>
            </div>
        </section>
    )
}

export default Hero