import { Shield, Lock, Eye, Database, Cookie, UserCheck } from 'lucide-react'
import LegalNav from '../components/LegalNav'

const PrivacyPage = () => {
    const privacySections = [
        {
            title: '1. Information We Collect',
            icon: Database,
            content: `Types of data collected through our services and interactions.`,
            details: [
                {
                    subtitle: 'Personal Information',
                    items: [
                        'Name, email, phone number for contact forms',
                        'Company information for business services',
                        'Billing and payment information',
                        'Communication records'
                    ]
                },
                {
                    subtitle: 'Technical Data',
                    items: [
                        'IP address and device information',
                        'Browser type and version',
                        'Pages visited and time spent',
                        'Referring website information'
                    ]
                },
                {
                    subtitle: 'Service-Specific Data',
                    items: [
                        'AI/ML: Training data provided by clients',
                        'Analytics: Client business data for processing',
                        'Development: Access credentials (securely stored)',
                        'Writing: Source materials and content'
                    ]
                }
            ]
        },
        {
            title: '2. How We Use Your Information',
            icon: Eye,
            content: `Purposes for collecting and processing your data.`,
            details: [
                {
                    subtitle: 'Service Delivery',
                    items: [
                        'To provide and maintain our services',
                        'To process payments and invoices',
                        'To communicate about projects',
                        'To deliver completed work'
                    ]
                },
                {
                    subtitle: 'Improvement & Analytics',
                    items: [
                        'To improve our services and website',
                        'To analyze usage patterns',
                        'To develop new features',
                        'For quality assurance'
                    ]
                },
                {
                    subtitle: 'Legal Compliance',
                    items: [
                        'To comply with legal obligations',
                        'To enforce our terms and policies',
                        'To protect rights and property',
                        'For fraud prevention'
                    ]
                }
            ]
        },
        {
            title: '3. Data Protection & Security',
            icon: Lock,
            content: `Measures we take to protect your information.`,
            details: [
                {
                    subtitle: 'Security Measures',
                    items: [
                        'Encryption of sensitive data in transit and at rest',
                        'Secure access controls and authentication',
                        'Regular security audits and vulnerability assessments',
                        'Employee training on data protection'
                    ]
                },
                {
                    subtitle: 'Data Handling',
                    items: [
                        'Client data processed only for specified purposes',
                        'Data minimization principles applied',
                        'Regular data backups and disaster recovery',
                        'Secure deletion of unnecessary data'
                    ]
                },
                {
                    subtitle: 'Third-Party Security',
                    items: [
                        'Vetting of third-party service providers',
                        'Data processing agreements with partners',
                        'GDPR compliance for EU clients',
                        'Regular compliance reviews'
                    ]
                }
            ]
        },
        {
            title: '4. Data Sharing & Disclosure',
            icon: Shield,
            content: `When and with whom we share your information.`,
            details: [
                {
                    subtitle: 'Service Providers',
                    items: [
                        'Payment processors (Stripe, PayPal)',
                        'Hosting providers (AWS, Vercel)',
                        'Communication tools (Email, Slack)',
                        'Analytics services (Google Analytics)'
                    ]
                },
                {
                    subtitle: 'Legal Requirements',
                    items: [
                        'When required by law or legal process',
                        'To protect against legal liability',
                        'To prevent or investigate wrongdoing',
                        'To protect safety of any person'
                    ]
                },
                {
                    subtitle: 'Business Transfers',
                    items: [
                        'In connection with merger or acquisition',
                        'During company restructuring',
                        'Asset transfer situations',
                        'With explicit client consent'
                    ]
                }
            ]
        },
        {
            title: '5. Your Rights & Choices',
            icon: UserCheck,
            content: `Your rights regarding your personal data.`,
            details: [
                {
                    subtitle: 'Access & Control',
                    items: [
                        'Right to access your personal data',
                        'Right to correct inaccurate data',
                        'Right to request deletion of data',
                        'Right to restrict processing'
                    ]
                },
                {
                    subtitle: 'Consent Management',
                    items: [
                        'Opt-out of marketing communications',
                        'Cookie preferences management',
                        'Withdraw consent at any time',
                        'Data portability requests'
                    ]
                },
                {
                    subtitle: 'Exercising Rights',
                    items: [
                        'Contact us at privacy@algo-x.com',
                        'Response within 30 days',
                        'No fee for reasonable requests',
                        'Verification of identity required'
                    ]
                }
            ]
        },
        {
            title: '6. Cookies & Tracking Technologies',
            icon: Cookie,
            content: `Use of cookies and similar technologies.`,
            details: [
                {
                    subtitle: 'Types of Cookies',
                    items: [
                        'Essential cookies (required for operation)',
                        'Performance cookies (analytics)',
                        'Functionality cookies (preferences)',
                        'Advertising cookies (marketing)'
                    ]
                },
                {
                    subtitle: 'Third-Party Cookies',
                    items: [
                        'Google Analytics for website statistics',
                        'Stripe for payment processing',
                        'Social media widgets',
                        'Embedded content from other sites'
                    ]
                },
                {
                    subtitle: 'Managing Cookies',
                    items: [
                        'Browser settings to control cookies',
                        'Opt-out of analytics tracking',
                        'Cookie consent banner on first visit',
                        'Do Not Track browser signals respected'
                    ]
                }
            ]
        },
        {
            title: '7. Service-Specific Privacy',
            icon: Shield,
            content: `Privacy considerations for specific services.`,
            details: [
                {
                    subtitle: 'AI & Machine Learning',
                    items: [
                        'Training data anonymized where possible',
                        'Models trained on secure isolated servers',
                        'Client data never used for other clients',
                        'Right to audit model data processing'
                    ]
                },
                {
                    subtitle: 'Cybersecurity Services',
                    items: [
                        'Penetration test findings confidential',
                        'Security assessment data encrypted',
                        'Vulnerability reports shared only with client',
                        'Compliance with security standards'
                    ]
                },
                {
                    subtitle: 'Data Analytics',
                    items: [
                        'Data aggregation and anonymization',
                        'Secure data transfer protocols',
                        'Client data retention policies',
                        'Compliance with data protection laws'
                    ]
                }
            ]
        },
        {
            title: '8. Data Retention',
            icon: Database,
            content: `How long we keep your information.`,
            details: [
                {
                    subtitle: 'Retention Periods',
                    items: [
                        'Project data: 7 years for tax purposes',
                        'Communication records: 3 years',
                        'Website analytics: 26 months',
                        'Backup data: 30 days rotation'
                    ]
                },
                {
                    subtitle: 'Deletion',
                    items: [
                        'Automatic deletion after retention period',
                        'Secure deletion methods used',
                        'Backup data purged according to schedule',
                        'Client can request earlier deletion'
                    ]
                }
            ]
        },
        {
            title: '9. International Data Transfers',
            icon: Shield,
            content: `Cross-border data transfer compliance.`,
            details: [
                {
                    subtitle: 'Data Processing Locations',
                    items: [
                        'Primary processing in Kenya',
                        'Some services hosted in US/EU',
                        'Cloud providers with global infrastructure',
                        'Compliance with data transfer regulations'
                    ]
                },
                {
                    subtitle: 'Safeguards',
                    items: [
                        'Standard Contractual Clauses (SCCs)',
                        'Adequacy decisions respected',
                        'Technical and organizational measures',
                        'Transparency about data locations'
                    ]
                }
            ]
        },
        {
            title: '10. Changes & Contact',
            icon: Shield,
            content: `Policy updates and contact information.`,
            details: [
                {
                    subtitle: 'Policy Updates',
                    items: [
                        'Will notify of material changes',
                        'Continued use constitutes acceptance',
                        'Review date displayed at top',
                        'Archive of previous versions available'
                    ]
                },
                {
                    subtitle: 'Contact Information',
                    items: [
                        'Data Protection Officer: dpo@algo-x.com',
                        'General inquiries: privacy@algo-x.com',
                        'Phone: +254 700 000 000',
                        'Address: Nairobi, Kenya'
                    ]
                }
            ]
        }
    ]

    return (
        <>
            <section className="pt-32 pb-20">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Privacy <span className="gradient-text">Policy</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            How we collect, use, and protect your information across all Algo X services
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            Effective Date: {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className="glass-effect rounded-3xl p-8 mb-12">
                        <div className="flex items-start gap-4">
                            <Shield className="w-8 h-8 text-neon-green flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-bold mb-2">Our Commitment</h2>
                                <p className="text-gray-400">
                                    At Algo X, we take privacy seriously. This policy explains how we handle your
                                    information across all our services: web development, AI/ML, cybersecurity,
                                    data analytics, graphics, writing, and mobile app development.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Sections */}
                    <div className="space-y-8 mb-16">
                        {privacySections.map((section, index) => (
                            <div key={index} className="glass-effect rounded-2xl p-6 border border-white/10">
                                <div className="flex items-start gap-4 mb-6">
                                    <section.icon className="w-8 h-8 text-neon-green flex-shrink-0" />
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
                                        <p className="text-gray-400 mb-6">{section.content}</p>

                                        {section.details.map((detail, idx) => (
                                            <div key={idx} className="mb-6 last:mb-0">
                                                <h4 className="text-lg font-semibold mb-3 text-neon-blue">
                                                    {detail.subtitle}
                                                </h4>
                                                <ul className="space-y-2">
                                                    {detail.items.map((item, itemIdx) => (
                                                        <li key={itemIdx} className="flex items-start gap-2 text-gray-300">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Data Processing Table */}
                    <div className="glass-effect rounded-3xl p-8 mb-12">
                        <h3 className="text-2xl font-bold mb-6 text-center">
                            Service-Specific Data Processing
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-4 px-6 text-left">Service</th>
                                        <th className="py-4 px-6 text-left">Data Collected</th>
                                        <th className="py-4 px-6 text-left">Purpose</th>
                                        <th className="py-4 px-6 text-left">Retention</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        {
                                            service: 'AI/ML Development',
                                            data: 'Training data, model parameters, usage logs',
                                            purpose: 'Model training, performance optimization',
                                            retention: '3 years or as per contract'
                                        },
                                        {
                                            service: 'Web Development',
                                            data: 'Website content, user data, analytics',
                                            purpose: 'Development, testing, deployment',
                                            retention: 'Project duration + 1 year'
                                        },
                                        {
                                            service: 'Cybersecurity',
                                            data: 'System logs, vulnerability reports, scan results',
                                            purpose: 'Security assessment, threat analysis',
                                            retention: '2 years for compliance'
                                        },
                                        {
                                            service: 'Data Analytics',
                                            data: 'Business data, KPIs, user behavior',
                                            purpose: 'Analysis, reporting, insights generation',
                                            retention: 'As specified in data processing agreement'
                                        },
                                        {
                                            service: 'Writing Services',
                                            data: 'Source materials, drafts, final content',
                                            purpose: 'Content creation, editing, delivery',
                                            retention: '3 years for reference'
                                        },
                                        {
                                            service: 'Graphics Design',
                                            data: 'Brand assets, design files, client feedback',
                                            purpose: 'Design creation, revisions, delivery',
                                            retention: '5 years for portfolio purposes'
                                        }
                                    ].map((row, index) => (
                                        <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="py-4 px-6 font-medium">{row.service}</td>
                                            <td className="py-4 px-6 text-gray-400">{row.data}</td>
                                            <td className="py-4 px-6 text-gray-400">{row.purpose}</td>
                                            <td className="py-4 px-6 text-gray-400">{row.retention}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="glass-effect rounded-3xl p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">Privacy Questions?</h3>
                        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                            For privacy-related inquiries, data subject requests, or to report a concern,
                            contact our Data Protection Officer.
                        </p>
                        <div className="space-y-4">
                            <a
                                href="mailto:dpo@algo-x.com"
                                className="btn-primary inline-flex items-center gap-2 mx-2"
                            >
                                Email DPO
                            </a>
                            <a
                                href="/contact"
                                className="btn-secondary inline-flex items-center gap-2 mx-2"
                            >
                                General Contact
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <LegalNav />
        </>
    )
}

export default PrivacyPage