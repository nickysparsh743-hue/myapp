import { Target, Clock, Shield, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import LegalNav from '../components/LegalNav'
const SLAPage = () => {
    const serviceLevels = [
        {
            service: 'Web Development Support',
            sla: '99.9% Uptime',
            response: '2 hours for critical issues',
            resolution: '24 hours for critical issues',
            coverage: '24/7 for production issues'
        },
        {
            service: 'AI/ML Model Support',
            sla: '99.5% Availability',
            response: '4 hours for model failures',
            resolution: '48 hours for performance issues',
            coverage: 'Business hours + on-call'
        },
        {
            service: 'Cybersecurity Monitoring',
            sla: '99.99% Monitoring',
            response: '30 minutes for critical alerts',
            resolution: '2 hours for active threats',
            coverage: '24/7/365'
        },
        {
            service: 'Data Analytics Support',
            sla: '99.5% Dashboard Availability',
            response: '4 hours for data issues',
            resolution: '48 hours for reporting errors',
            coverage: 'Business hours'
        },
        {
            service: 'Emergency Support',
            sla: '100% Emergency Response',
            response: '15 minutes for P1 incidents',
            resolution: 'Based on incident severity',
            coverage: '24/7 for contract clients'
        }
    ]

    const incidentSeverity = [
        {
            level: 'P1 - Critical',
            description: 'Production system down, security breach, data loss',
            response: '15 minutes',
            resolution: '2 hours',
            examples: 'Website offline, data breach, critical vulnerability'
        },
        {
            level: 'P2 - High',
            description: 'Major functionality impaired, performance degradation',
            response: '2 hours',
            resolution: '24 hours',
            examples: 'Slow performance, key feature broken, security alert'
        },
        {
            level: 'P3 - Medium',
            description: 'Minor issues, non-critical functionality affected',
            response: '4 hours',
            resolution: '3 business days',
            examples: 'UI issues, non-critical bugs, enhancement requests'
        },
        {
            level: 'P4 - Low',
            description: 'Cosmetic issues, documentation requests, questions',
            response: '1 business day',
            resolution: '5 business days',
            examples: 'Typos, documentation updates, general inquiries'
        }
    ]

    const serviceCredits = [
        {
            uptime: '99.9% - 100%',
            credit: '0%',
            description: 'Meets SLA requirements'
        },
        {
            uptime: '99.0% - 99.89%',
            credit: '10%',
            description: 'Minor service credit'
        },
        {
            uptime: '95.0% - 98.99%',
            credit: '25%',
            description: 'Significant service credit'
        },
        {
            uptime: 'Below 95.0%',
            credit: '50%',
            description: 'Major service credit'
        }
    ]

    return (
        <>
            <section className="pt-32 pb-20">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Service Level <span className="gradient-text">Agreement</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Guaranteed performance and support levels for Algo X services
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            Effective Date: {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    {/* Introduction */}
                    <div className="glass-effect rounded-3xl p-8 mb-12">
                        <div className="flex items-start gap-4">
                            <Target className="w-8 h-8 text-neon-green flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-bold mb-2">SLA Commitment</h2>
                                <p className="text-gray-400 mb-4">
                                    This Service Level Agreement (SLA) defines the performance and support
                                    standards for Algo X services. It applies to all clients with active
                                    support contracts or maintenance agreements.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold gradient-text mb-2">99.9%</div>
                                        <div className="text-sm text-gray-400">Uptime Guarantee</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
                                        <div className="text-sm text-gray-400">Critical Support</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold gradient-text mb-2">100%</div>
                                        <div className="text-sm text-gray-400">SLA Compliance</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Level Table */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            Service Level <span className="gradient-text">Commitments</span>
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-4 px-6 text-left">Service</th>
                                        <th className="py-4 px-6 text-left">SLA</th>
                                        <th className="py-4 px-6 text-left">Response Time</th>
                                        <th className="py-4 px-6 text-left">Resolution Time</th>
                                        <th className="py-4 px-6 text-left">Support Coverage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceLevels.map((service, index) => (
                                        <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="py-4 px-6 font-medium">{service.service}</td>
                                            <td className="py-4 px-6">
                                                <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-sm">
                                                    {service.sla}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-400">{service.response}</td>
                                            <td className="py-4 px-6 text-gray-400">{service.resolution}</td>
                                            <td className="py-4 px-6">
                                                <span className="px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-sm">
                                                    {service.coverage}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Incident Severity */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            Incident Severity <span className="gradient-text">Levels</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {incidentSeverity.map((severity, index) => (
                                <div key={index} className="glass-effect rounded-2xl p-6 border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${index === 0 ? 'bg-red-500/20' :
                                                index === 1 ? 'bg-orange-500/20' :
                                                    index === 2 ? 'bg-yellow-500/20' :
                                                        'bg-blue-500/20'
                                            }`}>
                                            <AlertTriangle className={`w-6 h-6 ${index === 0 ? 'text-red-400' :
                                                    index === 1 ? 'text-orange-400' :
                                                        index === 2 ? 'text-yellow-400' :
                                                            'text-blue-400'
                                                }`} />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${index === 0 ? 'bg-red-500/20 text-red-400' :
                                                index === 1 ? 'bg-orange-500/20 text-orange-400' :
                                                    index === 2 ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {severity.level.split(' - ')[0]}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold mb-3">{severity.level}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{severity.description}</p>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Response Time</p>
                                            <p className="text-sm font-medium">{severity.response}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Resolution Time</p>
                                            <p className="text-sm font-medium">{severity.resolution}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Examples</p>
                                            <p className="text-sm">{severity.examples}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Service Credits */}
                    <div className="glass-effect rounded-3xl p-8 mb-12">
                        <h3 className="text-2xl font-bold mb-6 text-center">
                            Service <span className="gradient-text">Credits</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {serviceCredits.map((credit, index) => (
                                <div key={index} className="text-center">
                                    <div className={`p-6 rounded-2xl mb-4 ${index === 0 ? 'bg-neon-green/10' :
                                            index === 1 ? 'bg-yellow-500/10' :
                                                index === 2 ? 'bg-orange-500/10' :
                                                    'bg-red-500/10'
                                        }`}>
                                        <div className={`text-3xl font-bold mb-2 ${index === 0 ? 'text-neon-green' :
                                                index === 1 ? 'text-yellow-500' :
                                                    index === 2 ? 'text-orange-500' :
                                                        'text-red-500'
                                            }`}>
                                            {credit.credit}
                                        </div>
                                        <div className="text-sm text-gray-400">Service Credit</div>
                                    </div>
                                    <h4 className="font-bold mb-2">{credit.uptime} Uptime</h4>
                                    <p className="text-sm text-gray-400">{credit.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <p className="text-gray-400 text-center">
                                Service credits are calculated monthly and applied to next invoice.
                                Credits are the sole remedy for SLA breaches.
                            </p>
                        </div>
                    </div>

                    {/* Support Process */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <div className="glass-effect rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="w-6 h-6 text-neon-green" />
                                <h3 className="text-xl font-bold">Support Process</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    'Submit ticket via support portal or email',
                                    'Automatic ticket creation and prioritization',
                                    'Immediate acknowledgment for P1/P2 incidents',
                                    'Regular updates until resolution',
                                    'Post-resolution review and reporting'
                                ].map((step, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold">{index + 1}</span>
                                        </div>
                                        <p className="text-gray-400">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-effect rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-6 h-6 text-neon-green" />
                                <h3 className="text-xl font-bold">Exclusions</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    'Scheduled maintenance windows',
                                    'Force majeure events',
                                    'Client-side network issues',
                                    'Third-party service outages',
                                    'Client-requested downtime',
                                    'Security incidents caused by client actions'
                                ].map((exclusion, index) => (
                                    <div key={index} className="flex items-start gap-2 text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                                        <span>{exclusion}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Service-Specific SLAs */}
                    <div className="glass-effect rounded-3xl p-8 mb-12">
                        <h3 className="text-2xl font-bold mb-6 text-center">
                            Service-Specific <span className="gradient-text">SLAs</span>
                        </h3>

                        <div className="space-y-6">
                            {[
                                {
                                    service: 'AI Model Performance',
                                    metrics: 'Accuracy, latency, throughput',
                                    guarantee: 'Within 5% of trained model performance',
                                    monitoring: 'Real-time performance monitoring',
                                    remediation: 'Automatic model retraining trigger'
                                },
                                {
                                    service: 'Data Pipeline Processing',
                                    metrics: 'Data freshness, completeness, accuracy',
                                    guarantee: '99.5% data processing success rate',
                                    monitoring: 'End-to-end pipeline monitoring',
                                    remediation: 'Automatic retry and alerting'
                                },
                                {
                                    service: 'Security Monitoring',
                                    metrics: 'Threat detection time, false positive rate',
                                    guarantee: '99.9% threat detection accuracy',
                                    monitoring: 'Continuous security monitoring',
                                    remediation: 'Immediate alert and response workflow'
                                },
                                {
                                    service: 'API Availability',
                                    metrics: 'Uptime, response time, error rate',
                                    guarantee: '99.95% API availability',
                                    monitoring: 'Global API endpoint monitoring',
                                    remediation: 'Automatic failover and scaling'
                                }
                            ].map((sla, index) => (
                                <div key={index} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                                    <h4 className="text-lg font-bold mb-3 gradient-text">{sla.service}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Metrics</p>
                                            <p className="text-sm">{sla.metrics}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Guarantee</p>
                                            <p className="text-sm">{sla.guarantee}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Monitoring</p>
                                            <p className="text-sm">{sla.monitoring}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray500 mb-1">Remediation</p>
                                            <p className="text-sm">{sla.remediation}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact & Compliance */}
                    <div className="glass-effect rounded-3xl p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">SLA Compliance & Reporting</h3>
                        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                            Monthly SLA compliance reports are available to all clients with active
                            support contracts. Contact our support team for custom SLA requirements.
                        </p>
                        <div className="space-y-4">
                            <a
                                href="mailto:sla@algo-x.com"
                                className="btn-primary inline-flex items-center gap-2 mx-2"
                            >
                                Request SLA Report
                            </a>
                            <a
                                href="/contact"
                                className="btn-secondary inline-flex items-center gap-2 mx-2"
                            >
                                Contact Support Team
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <LegalNav />
        </>
    )
}

export default SLAPage