import { Code2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
    const services = [
        'Web Development',
        'Mobile Apps',
        'AI & ML Solutions',
        'Data Analytics',
        'Cybersecurity',
        'Bots & Automation',
        'Graphics & UI/UX',
        'Writing Services',
    ]

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Instagram, href: '#', label: 'Instagram' },
    ]
    const quickLinks = [
        'Home', 'Services', 'Portfolio', 'About', 'Contact',
        'Terms', 'Privacy', 'Cookies', 'Refund', 'SLA'
    ]
    
    return (
        <footer className="bg-dark-gray border-t border-white/10">
            <div className="container-custom section-padding">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <Code2 className="w-8 h-8 text-neon-green" />
                            <span className="text-2xl font-bold gradient-text">Algo X</span>
                        </div>
                        <p className="text-gray-400">
                            Intelligent digital solutions powered by code, data, and AI. We help businesses transform digitally.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-neon-green/10 transition-colors duration-300"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 gradient-text">Services</h3>
                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li key={service}>
                                    <Link
                                        href="/services"
                                        className="text-gray-400 hover:text-neon-green transition-colors duration-300"
                                    >
                                        {service}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 gradient-text">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                                        className="text-gray-400 hover:text-neon-green transition-colors duration-300"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 gradient-text">Legal</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Terms of Service', href: '/terms' },
                                { label: 'Privacy Policy', href: '/privacy' },
                                { label: 'Cookie Policy', href: '/cookies' },
                                { label: 'Refund Policy', href: '/refund' },
                                { label: 'Service Level Agreement', href: '/sla' }
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-neon-green transition-colors duration-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 gradient-text">Contact Us</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Mail className="w-5 h-5 text-neon-green" />
                                <span>contact@algo-x.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <Phone className="w-5 h-5 text-neon-green" />
                                <span>+254 700 000 000</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-neon-green" />
                                <span>Nairobi, Kenya</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Algo X. All rights reserved.</p>
                    <p className="text-sm mt-2">African-focused, global-standard digital solutions</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer