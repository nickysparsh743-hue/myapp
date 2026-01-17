import Link from 'next/link'
import { FileText, Shield, Cookie, RefreshCw, Target } from 'lucide-react'

const LegalNav = () => {
    const legalPages = [
        {
            title: 'Terms of Service',
            href: '/terms',
            icon: FileText,
            description: 'Comprehensive terms for all services'
        },
        {
            title: 'Privacy Policy',
            href: '/privacy',
            icon: Shield,
            description: 'Data protection and privacy practices'
        },
        {
            title: 'Cookie Policy',
            href: '/cookies',
            icon: Cookie,
            description: 'Cookie usage and management'
        },
        {
            title: 'Refund Policy',
            href: '/refund',
            icon: RefreshCw,
            description: 'Refund eligibility and process'
        },
        {
            title: 'Service Level Agreement',
            href: '/sla',
            icon: Target,
            description: 'Performance guarantees and support'
        }
    ]

    return (
        <div className="glass-effect rounded-3xl p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 gradient-text">Legal Documentation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {legalPages.map((page) => (
                    <Link
                        key={page.href}
                        href={page.href}
                        className="group p-4 rounded-xl bg-white/5 hover:bg-neon-green/10 border border-white/10 hover:border-neon-green/30 transition-all duration-300"
                    >
                        <div className="flex flex-col items-center text-center">
                            <page.icon className="w-6 h-6 text-neon-green mb-3" />
                            <span className="font-medium text-sm mb-1">{page.title}</span>
                            <span className="text-xs text-gray-400">{page.description}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default LegalNav