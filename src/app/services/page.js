import ServiceCard from '../components/ServiceCard'
import CTA from '../components/CTA'
import {
    Globe, Smartphone, Cpu, BarChart3, Shield, Bot,
    Palette, FileText, Code, Database, MessageSquare,
    TrendingUp, PaintBucket, Lock, PenTool
} from 'lucide-react'

const ServicesPage = () => {
    const services = [
        {
            icon: Globe,
            title: 'Web & App Development',
            description: 'Full-stack web and mobile application development using modern technologies.',
            features: [
                'Business websites & portfolios',
                'E-commerce platforms',
                'Custom web applications',
                'Mobile apps (iOS & Android)',
                'API development & integration',
                'Progressive Web Apps (PWA)'
            ],
            color: 'green'
        },
        {
            icon: Cpu,
            title: 'AI, ML & Bots',
            description: 'Intelligent automation and machine learning solutions for smart business operations.',
            features: [
                'AI chatbots (WhatsApp, Web, Telegram)',
                'Machine learning systems',
                'Process automation bots',
                'Predictive analytics models',
                'Natural Language Processing',
                'Computer vision solutions'
            ],
            color: 'blue'
        },
        {
            icon: BarChart3,
            title: 'Data Analytics',
            description: 'Transform your data into actionable insights with powerful analytics solutions.',
            features: [
                'Interactive dashboards',
                'Data visualization',
                'Business intelligence reports',
                'Data cleaning & preprocessing',
                'Predictive modeling',
                'Real-time analytics'
            ],
            color: 'purple'
        },
        {
            icon: Palette,
            title: 'Graphics & UI/UX',
            description: 'Beautiful, user-centric designs that enhance user experience and engagement.',
            features: [
                'Logo & brand identity design',
                'UI/UX design for web & mobile',
                'Wireframing & prototyping',
                'Design systems',
                'Social media graphics',
                'Marketing materials'
            ],
            color: 'green'
        },
        {
            icon: Shield,
            title: 'Cybersecurity',
            description: 'Comprehensive security solutions to protect your digital assets.',
            features: [
                'Vulnerability assessment',
                'Web application security',
                'Penetration testing',
                'Security consulting',
                'Incident response',
                'Security training'
            ],
            color: 'blue'
        },
        {
            icon: FileText,
            title: 'Writing Services',
            description: 'Professional writing services for technical and business content.',
            features: [
                'Technical documentation',
                'Academic writing (APA style)',
                'Business proposals',
                'Website content & SEO writing',
                'Reports & whitepapers',
                'Product descriptions'
            ],
            color: 'purple'
        },
    ]

    return (
        <>
            <section className="pt-32 pb-20">
                <div className="container-custom text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Our <span className="gradient-text">Services</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Comprehensive digital solutions tailored to help your business thrive in the digital age
                    </p>
                </div>
            </section>

            <section className="section-padding bg-dark-gray/30">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <ServiceCard key={index} {...service} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Our <span className="gradient-text">Process</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            A structured approach to ensure project success
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Discovery',
                                description: 'Understand your requirements and goals'
                            },
                            {
                                step: '02',
                                title: 'Planning',
                                description: 'Create detailed project roadmap'
                            },
                            {
                                step: '03',
                                title: 'Development',
                                description: 'Build and test the solution'
                            },
                            {
                                step: '04',
                                title: 'Delivery',
                                description: 'Deploy and provide support'
                            },
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center mx-auto mb-6">
                                    <span className="text-2xl font-bold">{item.step}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-400">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CTA />
        </>
    )
}

export default ServicesPage