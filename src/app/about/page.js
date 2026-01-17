import CTA from '../components/CTA'
import { Target, Eye, Heart, Award, Users, Globe, Shield, Cpu} from 'lucide-react'

const AboutPage = () => {
    const values = [
        {
            icon: Target,
            title: 'Innovation',
            description: 'Constantly exploring new technologies and approaches'
        },
        {
            icon: Heart,
            title: 'Integrity',
            description: 'Honest, transparent, and ethical in all dealings'
        },
        {
            icon: Award,
            title: 'Excellence',
            description: 'Committed to delivering the highest quality solutions'
        },
        {
            icon: Shield,
            title: 'Security',
            description: 'Prioritizing security and data protection'
        },
    ]

    const team = [
        {
            name: 'Alex Johnson',
            role: 'Lead Developer',
            expertise: ['AI/ML', 'Backend', 'Cybersecurity']
        },
        {
            name: 'Sarah Chen',
            role: 'UI/UX Designer',
            expertise: ['Design Systems', 'User Research', 'Prototyping']
        },
        {
            name: 'Mike Rodriguez',
            role: 'Data Scientist',
            expertise: ['Data Analytics', 'ML Models', 'BI']
        },
        {
            name: 'Emma Davis',
            role: 'Security Expert',
            expertise: ['Pen Testing', 'Security Audits', 'Compliance']
        },
    ]

    return (
        <>
            <section className="pt-32 pb-20">
                <div className="container-custom text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        About <span className="gradient-text">Algo X</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Pioneering intelligent digital solutions for the modern business landscape
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Mission */}
                        <div className="glass-effect rounded-3xl p-8 neon-border">
                            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-neon-green to-neon-blue mb-6">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                            <p className="text-gray-400 text-lg">
                                To deliver intelligent, secure, and scalable digital solutions powered by modern technology,
                                helping businesses thrive in the digital age through innovation and excellence.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="glass-effect rounded-3xl p-8 neon-border">
                            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple mb-6">
                                <Eye className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                            <p className="text-gray-400 text-lg">
                                To become Africa&apos;s leading AI-driven digital solutions platform,
                                recognized globally for innovation, security, and transformative impact.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section-padding bg-dark-gray/30">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Our <span className="gradient-text">Values</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-dark-gray to-dark mb-6 border border-white/10">
                                    <value.icon className="w-8 h-8 text-neon-green" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-gray-400">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Meet Our <span className="gradient-text">Team</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Experts dedicated to delivering exceptional results
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, index) => (
                            <div key={index} className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-neon-green/30 transition-all duration-300">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-green to-neon-blue mb-4 mx-auto" />
                                <h3 className="text-xl font-bold text-center mb-2">{member.name}</h3>
                                <p className="text-neon-green text-center mb-4">{member.role}</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {member.expertise.map((skill, skillIndex) => (
                                        <span
                                            key={skillIndex}
                                            className="px-3 py-1 text-xs rounded-full bg-neon-green/10 text-neon-green"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section-padding bg-dark-gray/50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why Work With <span className="gradient-text">Us</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'African Expertise',
                                description: 'Deep understanding of local markets with global technical standards',
                                icon: Globe
                            },
                            {
                                title: 'AI-First Approach',
                                description: 'Leveraging artificial intelligence for smarter solutions',
                                icon: Cpu
                            },
                            {
                                title: 'Client-Centric',
                                description: 'Your success is our priority at every step',
                                icon: Users
                            },
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-dark-gray to-dark mb-6 border border-white/10">
                                    <item.icon className="w-8 h-8 text-neon-green" />
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

export default AboutPage