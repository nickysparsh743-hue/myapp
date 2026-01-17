'use client'
import PricingCalculator from './components/PricingCalculator'
import Testimonials from './components/TestimonialSlider'
import Hero from './components/Hero'
import CTA from './components/CTA'
import ServiceCard from './components/ServiceCard'
import {
  Globe,
  Smartphone,
  Cpu,
  BarChart3,
  Shield,
  Bot,
  Palette,
  FileText
} from 'lucide-react'

export default function Home() {
  const services = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Modern, responsive websites and web applications built with cutting-edge technologies.',
      features: ['Business websites', 'E-commerce platforms', 'Web applications', 'CMS Development'],
      color: 'green'
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Cross-platform mobile applications for iOS and Android.',
      features: ['React Native apps', 'Flutter development', 'UI/UX design', 'App Store deployment'],
      color: 'blue'
    },
    {
      icon: Cpu,
      title: 'AI & ML',
      description: 'Intelligent systems powered by artificial intelligence and machine learning.',
      features: ['AI chatbots', 'Predictive analytics', 'Computer vision', 'Natural language processing'],
      color: 'purple'
    },
    {
      icon: BarChart3,
      title: 'Data Analytics',
      description: 'Transform raw data into actionable insights with powerful analytics.',
      features: ['Business intelligence', 'Data visualization', 'Dashboard design', 'Predictive modeling'],
      color: 'green'
    },
    {
      icon: Shield,
      title: 'Cybersecurity',
      description: 'Protect your digital assets with comprehensive security solutions.',
      features: ['Vulnerability assessment', 'Penetration testing', 'Security audits', 'Incident response'],
      color: 'blue'
    },
    {
      icon: Bot,
      title: 'Bots & Automation',
      description: 'Automate repetitive tasks and enhance customer engagement.',
      features: ['WhatsApp bots', 'Telegram bots', 'Workflow automation', 'Chatbot development'],
      color: 'purple'
    },
    {
      icon: Palette,
      title: 'Graphics & UI/UX',
      description: 'Beautiful, user-centric designs that enhance user experience.',
      features: ['Logo design', 'Brand identity', 'UI/UX design', 'Social media graphics'],
      color: 'green'
    },
    {
      icon: FileText,
      title: 'Writing Services',
      description: 'Professional content creation for various needs.',
      features: ['Technical writing', 'Academic writing', 'Business proposals', 'SEO content'],
      color: 'blue'
    },
  ]

  const technologies = [
    'Next.js', 'React', 'Django', 'Flask', 'PostgreSQL', 'MongoDB',
    'TensorFlow', 'PyTorch', 'Tailwind CSS', 'AWS', 'Docker', 'Git'
  ]

  return (
    <>
      <Hero />

      {/* Add Pricing Calculator */}
      <section className="section-padding">
        <div className="container-custom">
          <PricingCalculator />
        </div>
      </section>
      <Testimonials />



      {/* Services Preview */}
      <section className="section-padding bg-dark-gray/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/services" className="btn-secondary inline-flex items-center gap-2">
              View All Services
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose <span className="gradient-text">Algo X</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: 'Expert Team',
                    description: 'Our developers and analysts are experts in their fields with years of experience.'
                  },
                  {
                    title: 'AI-Driven Solutions',
                    description: 'Leverage the power of artificial intelligence for smarter business decisions.'
                  },
                  {
                    title: 'Secure & Scalable',
                    description: 'We build systems that are both secure and scalable for future growth.'
                  },
                  {
                    title: 'Transparent Pricing',
                    description: 'No hidden costs. We provide clear, affordable pricing for all services.'
                  },
                  {
                    title: 'African Focus',
                    description: 'Understanding local markets while delivering global-standard solutions.'
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="glass-effect rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  {technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-white/5 hover:bg-neon-green/5 border border-white/10 hover:border-neon-green/20 transition-all duration-300"
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold gradient-text mb-1">{tech}</div>
                        <div className="text-xs text-gray-400">Technology</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}