import { Cookie, Settings, Shield, EyeOff, Clock } from 'lucide-react'
import LegalNav from '../components/LegalNav'

const CookiesPage = () => {
    const cookieCategories = [
        {
            name: 'Essential Cookies',
            icon: Shield,
            description: 'Required for basic website functionality.',
            examples: [
                'Session management',
                'Security features',
                'Load balancing',
                'User preferences storage'
            ],
            necessary: true
        },
        {
            name: 'Performance Cookies',
            icon: Settings,
            description: 'Help us understand how visitors interact with our website.',
            examples: [
                'Page visit counts',
                'Error tracking',
                'Page load times',
                'Navigation patterns'
            ],
            necessary: false
        },
        {
            name: 'Analytics Cookies',
            icon: EyeOff,
            description: 'Collect information about website usage.',
            examples: [
                'Google Analytics',
                'Heatmaps',
                'Conversion tracking',
                'User flow analysis'
            ],
            necessary: false
        },
        {
            name: 'Functional Cookies',
            icon: Cookie,
            description: 'Enable enhanced functionality and personalization.',
            examples: [
                'Language preferences',
                'Font size choices',
                'Remembering login status',
                'Form autocomplete'
            ],
            necessary: false
        },
        {
            name: 'Advertising Cookies',
            icon: Clock,
            description: 'Used to deliver relevant advertisements.',
            examples: [
                'Remarketing campaigns',
                'Interest-based ads',
                'Ad performance measurement',
                'Cross-device tracking'
            ],
            necessary: false
        }
    ]

    const thirdPartyCookies = [
        {
            provider: 'Google Analytics',
            purpose: 'Website analytics and performance tracking',
            cookies: '_ga, _gid, _gat',
            privacy: 'https://policies.google.com/privacy'
        },
        {
            provider: 'Stripe',
            purpose: 'Payment processing and fraud prevention',
            cookies: '__stripe_mid, __stripe_sid',
            privacy: 'https://stripe.com/privacy'
        },
        {
            provider: 'Vercel',
            purpose: 'Performance and security monitoring',
            cookies: '_vercel_analytics',
            privacy: 'https://vercel.com/legal/privacy-policy'
        },
        {
            provider: 'Hotjar',
            purpose: 'User behavior and heatmap analysis',
            cookies: '_hj*',
            privacy: 'https://www.hotjar.com/legal/policies/privacy'
        }
    ]

    return (
        <>
            <section className="pt-32 pb-20">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Cookie <span className="gradient-text">Policy</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            How we use cookies and similar technologies across Algo X services
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            Last Updated: {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    {/* Introduction */}
                    <div className="glass-effect rounded-3xl p-8 mb-12">
                        <div className="flex items-start gap-4">
                            <Cookie className="w-8 h-8 text-neon-green flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-bold mb-2">About Cookies</h2>
                                <p className="text-gray-400 mb-4">
                                    Cookies are small text files stored on your device when you visit our website.
                                    They help us provide, protect, and improve our services. This policy explains
                                    the types of cookies we use and how you can manage them.
                                </p>
                                <p className="text-gray-400">
                                    By using our website, you consent to our use of cookies as described in this policy,
                                    unless you have disabled them in your browser settings.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cookie Categories */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            Types of <span className="gradient-text">Cookies</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cookieCategories.map((category, index) => (
                                <div key={index} className="glass-effect rounded-2xl p-6 border border-white/10 h-full">
                                    <div className="flex items-center gap-3 mb-4">
                                        <category.icon className="w-6 h-6 text-neon-green" />
                                        <h3 className="text-lg font-bold">{category.name}</h3>
                                        {category.necessary && (
                                            <span className="px-2 py-1 text-xs rounded-full bg-neon-green/20 text-neon-green">
                                                Necessary
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 mb-4 text-sm">{category.description}</p>
                                    <h4 className="font-medium mb-2 text-sm">Examples:</h4>
                                    <ul className="space-y-1">
                                        {category.examples.map((example, idx) => (
                                            <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                                {example}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Third-Party Cookies */}
                    <div className="glass-effect rounded-3xl p-8 mb-12">
                        <h3 className="text-2xl font-bold mb-6 text-center">
                            Third-Party <span className="gradient-text">Cookies</span>
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-4 px-6 text-left">Provider</th>
                                        <th className="py-4 px-6 text-left">Purpose</th>
                                        <th className="py-4 px-6 text-left">Cookies Used</th>
                                        <th className="py-4 px-6 text-left">Privacy Policy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {thirdPartyCookies.map((provider, index) => (
                                        <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="py-4 px-6 font-medium">{provider.provider}</td>
                                            <td className="py-4 px-6 text-gray-400">{provider.purpose}</td>
                                            <td className="py-4 px-6">
                                                <code className="text-xs bg-white/5 px-2 py-1 rounded">
                                                    {provider.cookies}
                                                </code>
                                            </td>
                                            <td className="py-4 px-6">
                                                <a
                                                    href={provider.privacy}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-neon-green hover:text-neon-blue transition-colors"
                                                >
                                                    View Policy →
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Cookie Management */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <div className="glass-effect rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">Managing Cookies</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">Browser Settings</h4>
                                    <p className="text-gray-400 text-sm">
                                        Most browsers allow you to refuse cookies or alert you when cookies are being sent.
                                        However, disabling essential cookies may affect website functionality.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Opt-Out Tools</h4>
                                    <p className="text-gray-400 text-sm">
                                        Use tools like the Digital Advertising Alliance's opt-out page or
                                        Google's Ads Settings to manage advertising cookies.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Do Not Track</h4>
                                    <p className="text-gray-400 text-sm">
                                        We respect Do Not Track signals and will not load analytics or
                                        advertising cookies if your browser sends this signal.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-effect rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">Cookie Duration</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">Session Cookies</h4>
                                    <p className="text-gray-400 text-sm">
                                        Temporary cookies deleted when you close your browser. Used for
                                        session management and security.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Persistent Cookies</h4>
                                    <p className="text-gray-400 text-sm">
                                        Remain on your device for set periods (days, months, years).
                                        Used for preferences and analytics.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">First-Party vs Third-Party</h4>
                                    <p className="text-gray-400 text-sm">
                                        First-party cookies are set by our domain. Third-party cookies
                                        are set by external services we use.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service-Specific Cookie Information */}
                    <div className="glass-effect rounded-3xl p-8 mb-12">
                        <h3 className="text-2xl font-bold mb-6 text-center">
                            Service-Specific <span className="gradient-text">Cookie Usage</span>
                        </h3>

                        <div className="space-y-6">
                            {[
                                {
                                    service: 'AI/ML Platform',
                                    cookies: 'Session tokens, model preferences, API usage tracking',
                                    purpose: 'User authentication, model performance tracking, usage analytics',
                                    management: 'User dashboard with cookie preferences'
                                },
                                {
                                    service: 'Analytics Dashboard',
                                    cookies: 'Dashboard preferences, data visualization settings, report filters',
                                    purpose: 'Custom dashboard setup, user preferences storage, report caching',
                                    management: 'Built-in cookie controls in dashboard settings'
                                },
                                {
                                    service: 'Client Portal',
                                    cookies: 'Login sessions, project preferences, notification settings',
                                    purpose: 'Secure authentication, personalized interface, communication preferences',
                                    management: 'Portal settings page with cookie management'
                                },
                                {
                                    service: 'Marketing Website',
                                    cookies: 'Analytics, A/B testing, conversion tracking',
                                    purpose: 'Marketing optimization, user experience improvement, lead tracking',
                                    management: 'Cookie consent banner with granular controls'
                                }
                            ].map((service, index) => (
                                <div key={index} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                                    <h4 className="text-lg font-bold mb-2 gradient-text">{service.service}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Cookies Used</p>
                                            <p className="text-sm">{service.cookies}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Purpose</p>
                                            <p className="text-sm">{service.purpose}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Management</p>
                                            <p className="text-sm">{service.management}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Consent & Contact */}
                    <div className="glass-effect rounded-3xl p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">Cookie Consent & Questions</h3>
                        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                            We display a cookie consent banner on your first visit. You can change
                            your preferences at any time using the cookie settings tool.
                        </p>
                        <div className="space-y-4">
                            <button className="btn-primary mx-2">
                                Update Cookie Preferences
                            </button>
                            <a
                                href="mailto:privacy@algo-x.com"
                                className="btn-secondary inline-flex items-center gap-2 mx-2"
                            >
                                Contact Privacy Team
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <LegalNav />
        </>
    )
}

export default CookiesPage