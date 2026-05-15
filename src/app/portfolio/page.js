import PortfolioCard from '../components/PortfolioCard'
import CTA from '../components/CTA'

const PortfolioPage = () => {
    const projects = [
        {
            title: 'AI Chatbot for Businesses',
            description: 'Intelligent chatbot solution integrated with WhatsApp and web platforms for automated customer support.',
            technologies: ['Python', 'TensorFlow', 'React', 'FastAPI', 'MongoDB'],
            demoLink: 'https://nicholus-mush.github.io/aibot',
            githubLink: '#',
            type: 'ai'
        },
        {
            title: 'Data Analytics Dashboard',
            description: 'Real-time business intelligence dashboard with interactive visualizations and predictive analytics.',
            technologies: ['Next.js', 'D3.js', 'Python', 'PostgreSQL', 'Redis'],
            demoLink: 'https://nicholus-mush.github.io/dprivacy/',
            githubLink: '#',
            type: 'data'
        },
        {
            title: 'Secure Authentication System',
            description: 'Multi-factor authentication system with biometric verification and zero-trust architecture.',
            technologies: ['Node.js', 'React', 'JWT', 'OAuth2', 'Redis'],
            demoLink: '',
            githubLink: '#',
            type: 'security'
        },
        {
            title: 'Smart Agriculture Bot',
            description: 'AI-powered bot for precision farming with crop monitoring and automated irrigation control.',
            technologies: ['Python', 'OpenCV', 'IoT', 'React Native', 'Firebase'],
            demoLink: '',
            githubLink: '#',
            type: 'ai'
        },
        {
            title: 'Predictive ML System',
            description: 'Machine learning system for predicting customer churn with 95% accuracy.',
            technologies: ['Python', 'Scikit-learn', 'Pandas', 'Flask', 'Docker'],
            demoLink: '',
            githubLink: '#',
            type: 'ai'
        },
        {
            title: 'E-commerce Platform',
            description: 'Full-featured e-commerce platform with AI-powered recommendations and secure payments.',
            technologies: ['Next.js', 'Stripe', 'MongoDB', 'Tailwind CSS', 'Redis'],
            demoLink: 'https://nickysparsh743-hue.github.io/mainfo',
            githubLink: '#',
            type: 'web'
        },
        {
            title: 'Mobile Fitness App',
            description: 'Cross-platform mobile app for fitness tracking with AI-driven workout recommendations.',
            technologies: ['React Native', 'TensorFlow Lite', 'Firebase', 'Redux', 'Expo'],
            demoLink: '',
            githubLink: '#',
            type: 'mobile'
        },
        {
            title: 'Network Security Solution',
            description: 'Comprehensive network security solution with real-time threat detection and response.',
            technologies: ['Node.js', 'React', 'Elasticsearch', 'Kibana', 'Redis'],
            demoLink: '',
            githubLink: '#',
            type: 'security'
        },
        {
            title: 'Custom Web Application',
            description: 'Tailored web application development for unique business needs with modern technologies.',
            technologies: ['Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Docker'],
            demoLink: '',
            githubLink: '#',
            type: 'web'
        },
        {
            title: 'AI-Powered port Management System',
            description: 'Intelligent port management system leveraging AI for optimized operations and real-time decision-making.',
            technologies: ['Python', 'TensorFlow', 'Docker', 'Kubernetes', 'PostgreSQL'],
            demoLink: 'my-ap.vercel.app',
            githubLink: '#',
            type: 'ai'
        },
        {
            title: 'Ai powered journling app',
            description: 'AI-powered journaling application for personalized content generation and mood tracking.',
            technologies: ['React', 'Node.js', 'MongoDB', 'TensorFlow', 'Docker'],
            demoLink: 'https://nicholus-mush.github.io/aiintent/',
            githubLink: '#',
            type: 'ai'
        }
    ]

    return (
        <>
            <section className="pt-32 pb-20">
                <div className="container-custom text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Our <span className="gradient-text">Portfolio</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Showcasing our expertise through successful projects and innovative solutions
                    </p>
                </div>
            </section>

            <section className="section-padding bg-dark-gray/30">
                <div className="container-custom">
                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-3 mb-12 justify-center">
                        {['All', 'AI/ML', 'Web', 'Mobile', 'Security', 'Data'].map((category) => (
                            <button
                                key={category}
                                className="px-6 py-2 rounded-full border border-white/10 hover:border-neon-green hover:text-neon-green transition-all duration-300"
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <PortfolioCard key={index} {...project} />
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="mt-20 pt-12 border-t border-white/10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: '50+', label: 'Projects Completed' },
                                { value: '100%', label: 'Client Satisfaction' },
                                { value: '30+', label: 'Technologies Used' },
                                { value: '24/7', label: 'Support Available' },
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                                    <div className="text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <CTA />
        </>
    )
}

export default PortfolioPage