import { RefreshCw, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import LegalNav from '../components/LegalNav'
const RefundPage = () => {
    const refundPolicies = [
        {
            service: 'Web Development',
            eligible: [
                'Project cancelled before any work commenced',
                'Failure to deliver agreed scope within extended timeline',
                'Significant deviation from project specifications'
            ],
            notEligible: [
                'Change of mind after work has commenced',
                'Requested features beyond original scope',
                'Delays caused by client feedback timing',
                'Third-party service issues'
            ],
            process: 'Written request within 14 days of cancellation',
            timeframe: '30 business days'
        },
        {
            service: 'AI/ML Services',
            eligible: [
                'Model fails to meet agreed accuracy threshold',
                'Technical impossibility discovered during development',
                'Data quality issues preventing project completion'
            ],
            notEligible: [
                'Performance variations due to changing data',
                'Model retraining requests',
                'Scope expansion requests',
                'Integration with unsupported platforms'
            ],
            process: 'Technical assessment and validation required',
            timeframe: '45 business days'
        },
        {
            service: 'Cybersecurity',
            eligible: [
                'Service not performed as scheduled',
                'Critical tools/services unavailable',
                'False positive rates above agreed threshold'
            ],
            notEligible: [
                'Vulnerabilities discovered during assessment',
                'Remediation implementation costs',
                'Follow-up assessments',
                'Client system failures during testing'
            ],
            process: 'Service report review and validation',
            timeframe: '30 business days'
        },
        {
            service: 'Data Analytics',
            eligible: [
                'Inability to process provided data format',
                'Failure to deliver agreed reports',
                'Significant data accuracy issues in deliverables'
            ],
            notEligible: [
                'Data quality issues from client side',
                'Additional analysis requests',
                'Dashboard customization beyond scope',
                'Training and support services'
            ],
            process: 'Deliverable review and discrepancy analysis',
            timeframe: '30 business days'
        },
        {
            service: 'Writing Services',
            eligible: [
                'Plagiarism detected in delivered work',
                'Failure to meet agreed deadlines',
                'Content significantly deviates from brief'
            ],
            notEligible: [
                'Style preference changes',
                'Additional revision rounds',
                'Formatting changes',
                'Publication rights management'
            ],
            process: 'Content review against original brief',
            timeframe: '14 business days'
        },
        {
            service: 'Graphics & Design',
            eligible: [
                'Design significantly deviates from brief',
                'Failure to deliver agreed file formats',
                'Technical issues preventing usage'
            ],
            notEligible: [
                'Subjective design preferences',
                'Additional revision rounds',
                'Format conversion requests',
                'Source file modifications'
            ],
            process: 'Design review against project brief',
            timeframe: '21 business days'
        }
    ]

    const refundProcess = [
        {
            step: 1,
            title: 'Refund Request',
            description: 'Submit written request to refunds@algo-x.com with project details',
            timeframe: 'Within 30 days of issue',
            required: 'Project reference, reason, supporting evidence'
        },
        {
            step: 2,
            title: 'Assessment',
            description: 'Our team reviews the request against project terms and deliverables',
            timeframe: '7-10 business days',
            required: 'Technical evaluation, project documentation review'
        },
        {
            step: 3,
            title: 'Resolution',
            description: 'We propose solution: refund, credit, or additional work',
            timeframe: '3-5 business days',
            required: 'Client agreement to proposed resolution'
        },
        {
            step: 4,
            title: 'Processing',
            description: 'If approved, refund processed through original payment method',
            timeframe: '7-30 business days',
            required: 'Bank/Payment processor processing time'
        }
    ]

    return (
        <>
            <section className="pt-32 pb-20">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Refund <span className="gradient-text">Policy</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Clear and fair refund policies for all Algo X services
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            Effective Date: {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    {/* Overview */}
                    <div className="glass-effect rounded-3xl p-8 mb-12">
                        <div className="flex items-start gap-4">
                            <RefreshCw className="w-8 h-8 text-neon-green flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-bold mb-2">Our Refund Philosophy</h2>
                                <p className="text-gray-400 mb-4">
                                    At Algo X, we strive for complete client satisfaction. Our refund policy is designed
                                    to be fair, transparent, and service-specific. We believe in delivering value and
                                    will work diligently to resolve any issues before considering refunds.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold gradient-text mb-2">100%</div>
                                        <div className="text-sm text-gray-400">Satisfaction Guarantee</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold gradient-text mb-2">30 Days</div>
                                        <div className="text-sm text-gray-400">Refund Request Window</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold gradient-text mb-2">7 Days</div>
                                        <div className="text-sm text-gray-400">Initial Assessment</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* General Policies */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <div className="glass-effect rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <CheckCircle className="w-6 h-6 text-neon-green" />
                                <h3 className="text-xl font-bold">Eligible for Refund</h3>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    'Service not delivered as specified in contract',
                                    'Technical impossibility discovered during project',
                                    'Significant deviation from agreed specifications',
                                    'Project cancellation before work commencement',
                                    'Failure to meet legally binding service level agreements'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="glass-effect rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <XCircle className="w-6 h-6 text-red-400" />
                                <h3 className="text-xl font-bold">Not Eligible for Refund</h3>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    'Change of mind after work has commenced',
                                    'Services already rendered and delivered',
                                    'Additional features beyond original scope',
                                    'Delays caused by client-side issues',
                                    'Third-party service failures beyond our control',
                                    'Domain registration and hosting fees'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Service-Specific Policies */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            Service-Specific <span className="gradient-text">Refund Policies</span>
                        </h2>

                        <div className="space-y-6">
                            {refundPolicies.map((policy, index) => (
                                <div key={index} className="glass-effect rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-xl font-bold mb-4 gradient-text">{policy.service}</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-neon-green" />
                                                Eligible for Refund
                                            </h4>
                                            <ul className="space-y-2">
                                                {policy.eligible.map((item, idx) => (
                                                    <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                                <XCircle className="w-4 h-4 text-red-400" />
                                                Not Eligible for Refund
                                            </h4>
                                            <ul className="space-y-2">
                                                {policy.notEligible.map((item, idx) => (
                                                    <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                                        <div>
                                            <h4 className="font-medium mb-2">Refund Process</h4>
                                            <p className="text-sm text-gray-400">{policy.process}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-2">Processing Timeframe</h4>
                                            <p className="text-sm text-gray-400">{policy.timeframe}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Refund Process Steps */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            Refund <span className="gradient-text">Process</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {refundProcess.map((step, index) => (
                                <div key={index} className="glass-effect rounded-2xl p-6 border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center">
                                            <span className="font-bold">{step.step}</span>
                                        </div>
                                        <Clock className="w-5 h-5 text-gray-400" />
                                    </div>

                                    <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{step.description}</p>

                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-gray-500">Timeframe</p>
                                            <p className="text-sm font-medium">{step.timeframe}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Required</p>
                                            <p className="text-sm">{step.required}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Partial Refunds & Credits */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <div className="glass-effect rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <DollarSign className="w-6 h-6 text-neon-green" />
                                <h3 className="text-xl font-bold">Partial Refunds</h3>
                            </div>
                            <div className="space-y-4">
                                <p className="text-gray-400">
                                    In cases where partial work has been completed and delivered,
                                    we may offer partial refunds calculated as:
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                        <span>Value of undelivered work minus administrative fees</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                        <span>Proportional refund based on project completion percentage</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                        <span>Material costs deducted from refund amount</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="glass-effect rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <RefreshCw className="w-6 h-6 text-neon-green" />
                                <h3 className="text-xl font-bold">Service Credits</h3>
                            </div>
                            <div className="space-y-4">
                                <p className="text-gray-400">
                                    Instead of monetary refunds, we may offer service credits for:
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                        <span>Future projects with Algo X</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                        <span>Additional services on current project</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                        <span>Extended maintenance or support periods</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                        <span>Training sessions or consultations</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="glass-effect rounded-3xl p-8 mb-12">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold mb-4">Important Notes</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Payment Method Refunds</h4>
                                        <p className="text-gray-400 text-sm">
                                            Refunds are issued to the original payment method. Credit card refunds
                                            take 5-10 business days, bank transfers 7-30 business days.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Administrative Fees</h4>
                                        <p className="text-gray-400 text-sm">
                                            A 10% administrative fee may apply to refunds for work already commenced.
                                            This covers project setup, management, and administrative costs.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Dispute Resolution</h4>
                                        <p className="text-gray-400 text-sm">
                                            If we cannot resolve a refund dispute amicably, either party may seek
                                            mediation through the Nairobi Chamber of Commerce.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="glass-effect rounded-3xl p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">Refund Requests</h3>
                        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                            To request a refund or discuss refund eligibility, contact our finance team
                            with your project details and concerns.
                        </p>
                        <div className="space-y-4">
                            <a
                                href="mailto:refunds@algo-x.com"
                                className="btn-primary inline-flex items-center gap-2 mx-2"
                            >
                                Submit Refund Request
                            </a>
                            <a
                                href="/contact"
                                className="btn-secondary inline-flex items-center gap-2 mx-2"
                            >
                                Contact Finance Team
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <LegalNav />
        </>
    )
}

export default RefundPage