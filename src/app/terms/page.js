import Link from 'next/link'
import { FileText, Shield, Lock, Scale, AlertCircle, CheckCircle } from 'lucide-react'
import LegalNav from '../components/LegalNav'
const TermsPage = () => {
    const sections = [
        {
            title: '1. Acceptance of Terms',
            icon: CheckCircle,
            content: `By accessing and using Algo X services, you agree to be bound by these Terms of Service. If you do not agree to all terms, do not use our services.`,
            subsections: [
                'These terms apply to all services: web development, AI/ML, cybersecurity, data analytics, graphics, writing, and mobile apps.',
                'You must be at least 18 years old or have parental consent.',
                'We reserve the right to modify these terms at any time.'
            ]
        },
        {
            title: '2. Service Scope & Deliverables',
            icon: FileText,
            content: `Clear definition of services, deliverables, and project boundaries.`,
            subsections: [
                'Web Development: Includes design, development, testing, and deployment. Hosting is separate unless specified.',
                'AI/ML Services: Model development, training, and deployment. Data preprocessing is client responsibility unless included.',
                'Cybersecurity: Assessment and recommendations. Implementation may require additional services.',
                'All deliverables are specified in individual project contracts.'
            ]
        },
        {
            title: '3. Intellectual Property Rights',
            icon: Scale,
            content: `Ownership and usage rights for all created assets and code.`,
            subsections: [
                'Client receives full ownership of final deliverables upon full payment.',
                'Background IP (pre-existing code, libraries) remains owned by Algo X.',
                'Source code is delivered only after final payment.',
                'We retain right to showcase work in portfolio unless specified otherwise.'
            ]
        },
        {
            title: '4. Payment Terms',
            icon: FileText,
            content: `Payment schedule, methods, and policies.`,
            subsections: [
                '50% deposit required to begin work.',
                'Balance due upon project completion before final delivery.',
                'Payments are non-refundable once work has commenced.',
                'Late payments incur 2% monthly interest.',
                'All prices in USD unless specified otherwise.'
            ]
        },
        {
            title: '5. Project Timeline & Revisions',
            icon: AlertCircle,
            content: `Timeline expectations and revision policies.`,
            subsections: [
                'Standard projects: 2-4 weeks from deposit.',
                'Complex projects: Timeline specified in contract.',
                'Includes 3 rounds of revisions per deliverable.',
                'Additional revisions billed at hourly rate.',
                'Client delays in feedback extend timeline proportionally.'
            ]
        },
        {
            title: '6. Confidentiality',
            icon: Lock,
            content: `Protection of client information and data.`,
            subsections: [
                'All client information treated as confidential.',
                'NDA available upon request.',
                'We implement security measures but cannot guarantee absolute security.',
                'Clients responsible for securing their own credentials.'
            ]
        },
        {
            title: '7. Service-Specific Terms',
            icon: Shield,
            content: `Additional terms for specific services.`,
            subsections: [
                'AI/ML Services: Performance depends on quality of training data.',
                'Cybersecurity: We identify vulnerabilities; remediation is separate service.',
                'Writing Services: Copyright transfers upon full payment. Plagiarism-free guarantee.',
                'Graphics: Native files delivered upon full payment.'
            ]
        },
        {
            title: '8. Liability & Warranty',
            icon: Shield,
            content: `Limitations of liability and warranty terms.`,
            subsections: [
                'Services provided "as is" without warranty of merchantability.',
                'Maximum liability limited to project fee.',
                'Not liable for indirect, consequential, or incidental damages.',
                '30-day bug fix warranty on development projects.',
                'No warranty on third-party integrations.'
            ]
        },
        {
            title: '9. Termination',
            icon: AlertCircle,
            content: `Conditions for terminating services.`,
            subsections: [
                'Either party may terminate with 30 days written notice.',
                'Client responsible for payment for work completed.',
                'Termination for breach effective immediately.',
                'Post-termination obligations survive.'
            ]
        },
        {
            title: '10. Governing Law',
            icon: Scale,
            content: `Legal jurisdiction and dispute resolution.`,
            subsections: [
                'Governed by laws of Kenya.',
                'Disputes resolved through arbitration in Nairobi.',
                'English language versions prevail.',
                'Severability clause: if one term invalid, others remain.'
            ]
        }
    ]

    const serviceSpecificTerms = [
        {
            service: 'AI & Machine Learning Services',
            terms: [
                'Client provides training data; quality affects model performance',
                'Models trained on client data remain client property',
                'Pre-trained models subject to their own licenses',
                'No guarantee of specific accuracy metrics',
                'Regular retraining recommended for optimal performance'
            ]
        },
        {
            service: 'Cybersecurity Services',
            terms: [
                'Penetration testing conducted with written authorization only',
                'Findings are confidential to client',
                'Remediation recommendations provided; implementation separate',
                'Regular security audits recommended',
                'Not responsible for breaches after service completion'
            ]
        },
        {
            service: 'Data Analytics Services',
            terms: [
                'Client owns their data; we process under license',
                'Results based on provided data accuracy',
                'Dashboards require ongoing maintenance',
                'Data backup is client responsibility',
                'Compliance with data protection laws is joint responsibility'
            ]
        },
        {
            service: 'Web & Mobile Development',
            terms: [
                'Browser compatibility as specified in contract',
                'Responsive design standards as of project date',
                'Third-party API integrations subject to their terms',
                'Maintenance plans available separately',
                'Hosting and domain registration are client responsibility'
            ]
        },
        {
            service: 'Writing & Content Services',
            terms: [
                'Copyright transfers upon full payment',
                'Plagiarism-free guarantee',
                'Client provides source materials and brief',
                'Two rounds of revisions included',
                'Rush fees apply for deadlines under 72 hours'
            ]
        },
        {
            service: 'Graphics & UI/UX Design',
            terms: [
                'Native files delivered upon final payment',
                'Stock imagery licenses are client responsibility',
                'Design system remains our IP unless purchased',
                'Brand guidelines developed collaboratively',
                'Print-ready files available at additional cost'
            ]
        }
    ]

    return (
        <>
            <section className="pt-32 pb-20">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Terms of <span className="gradient-text">Service</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Comprehensive terms governing all Algo X services and engagements
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            Last Updated: {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className="glass-effect rounded-3xl p-8 mb-12">
                        <div className="flex items-start gap-4 mb-6">
                            <AlertCircle className="w-8 h-8 text-neon-green flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-bold mb-2">Important Notice</h2>
                                <p className="text-gray-400">
                                    These Terms of Service govern all engagements with Algo X. By using our services,
                                    you agree to these terms. Specific project terms may be detailed in individual contracts.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Terms Sections */}
                    <div className="space-y-8 mb-16">
                        {sections.map((section, index) => (
                            <div key={index} className="glass-effect rounded-2xl p-6 border border-white/10">
                                <div className="flex items-start gap-4 mb-4">
                                    <section.icon className="w-6 h-6 text-neon-green flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-xl font-bold mb-3">{section.title}</h3>
                                        <p className="text-gray-400 mb-4">{section.content}</p>
                                        {section.subsections && (
                                            <ul className="space-y-2">
                                                {section.subsections.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Service-Specific Terms */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            Service-Specific <span className="gradient-text">Terms</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {serviceSpecificTerms.map((service, index) => (
                                <div key={index} className="glass-effect rounded-2xl p-6 border border-white/10 h-full">
                                    <h3 className="text-lg font-bold mb-4 gradient-text">{service.service}</h3>
                                    <ul className="space-y-3">
                                        {service.terms.map((term, idx) => (
                                            <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                                {term}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact for Questions */}
                    <div className="glass-effect rounded-3xl p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">Questions About Our Terms?</h3>
                        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                            For clarification on any terms or to discuss custom terms for your project,
                            please contact our legal team.
                        </p>
                        <Link
                            href="/contact"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            Contact Legal Team
                        </Link>
                    </div>
                </div>
            </section>

            {/* Add LegalNav at the bottom */}
            <LegalNav />
        </>
        
    )
}

export default TermsPage