'use client'

import { useState, useEffect } from 'react'
import {
    ChevronLeft, ChevronRight, Quote, Star, MapPin,
    Building, Calendar, CheckCircle, Play, Pause
} from 'lucide-react'

const TestimonialSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [direction, setDirection] = useState('next')

    const testimonials = [
        {
            id: 1,
            name: "Dr. Sarah Mwangi",
            role: "CEO, HealthTech Solutions",
            company: "Nairobi Hospital Network",
            content: "Algo X transformed our patient management system with their AI solution. The predictive analytics reduced wait times by 40% and improved patient satisfaction significantly. Their team was professional and delivered beyond expectations.",
            rating: 5,
            project: "AI-Powered Healthcare System",
            location: "Nairobi, Kenya",
            date: "March 2024",
            image: "👩‍⚕️",
            category: "ai"
        },
        {
            id: 2,
            name: "James Omondi",
            role: "CTO",
            company: "FinTech Africa Ltd",
            content: "The cybersecurity audit they conducted exposed vulnerabilities we never knew existed. Their team not only identified issues but helped us implement robust security measures. Our compliance score improved from 65% to 98%.",
            rating: 5,
            project: "Cybersecurity Infrastructure",
            location: "Lagos, Nigeria",
            date: "February 2024",
            image: "👨‍💼",
            category: "security"
        },
        {
            id: 3,
            name: "Amina Hassan",
            role: "Marketing Director",
            company: "EcoFarms Kenya",
            content: "Our e-commerce platform built by Algo X increased online sales by 300% in 6 months. The user experience is seamless, and the backend management system saves us hours daily. Their ongoing support is exceptional.",
            rating: 5,
            project: "E-commerce Platform",
            location: "Mombasa, Kenya",
            date: "January 2024",
            image: "👩‍💼",
            category: "web"
        },
        {
            id: 4,
            name: "Prof. David Chen",
            role: "Research Director",
            company: "University of Nairobi",
            content: "The data analytics dashboard they developed for our research department is incredible. It processes millions of data points in real-time and provides insights we couldn't get before. A game-changer for our work.",
            rating: 5,
            project: "Research Data Platform",
            location: "Nairobi, Kenya",
            date: "December 2023",
            image: "👨‍🏫",
            category: "data"
        },
        {
            id: 5,
            name: "Maria Rodriguez",
            role: "Operations Manager",
            company: "LogiTech East Africa",
            content: "The automation bots they created saved us over 200 man-hours per month. The ROI was achieved in just 3 months. Their understanding of logistics operations was impressive.",
            rating: 5,
            project: "Process Automation System",
            location: "Dar es Salaam, Tanzania",
            date: "November 2023",
            image: "👩‍🔧",
            category: "ai"
        },
        {
            id: 6,
            name: "Kwame Mensah",
            role: "Founder",
            company: "AgroTech Ghana",
            content: "From concept to launch, Algo X delivered a world-class mobile app for our agricultural platform. The user adoption has been phenomenal, and the tech support is always responsive.",
            rating: 5,
            project: "Mobile Agriculture App",
            location: "Accra, Ghana",
            date: "October 2023",
            image: "👨‍🌾",
            category: "mobile"
        }
    ]

    // Stats for social proof
    const stats = [
        { value: '98%', label: 'Client Satisfaction' },
        { value: '50+', label: 'Projects Completed' },
        { value: '100%', label: 'On-Time Delivery' },
        { value: '24/7', label: 'Support Available' }
    ]

    // Auto-play slider
    useEffect(() => {
        if (!isPlaying) return

        const handleNext = () => {
            setDirection('next')
            setCurrentIndex((prevIndex) =>
                prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
            )
        }

        const interval = setInterval(() => {
            handleNext()
        }, 5000)

        return () => clearInterval(interval)
    }, [isPlaying, testimonials.length])

    const handleNext = () => {
        setDirection('next')
        setCurrentIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        )
    }

    const handlePrev = () => {
        setDirection('prev')
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        )
    }

    const goToSlide = (index) => {
        setDirection(index > currentIndex ? 'next' : 'prev')
        setCurrentIndex(index)
    }

    // Get category color
    const getCategoryColor = (category) => {
        switch (category) {
            case 'ai': return 'from-neon-green to-neon-blue'
            case 'web': return 'from-neon-blue to-neon-purple'
            case 'security': return 'from-red-500 to-orange-500'
            case 'data': return 'from-purple-500 to-pink-500'
            case 'mobile': return 'from-green-500 to-blue-500'
            default: return 'from-neon-green to-neon-blue'
        }
    }

    // Get category icon
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'ai': return '🤖'
            case 'web': return '🌐'
            case 'security': return '🔒'
            case 'data': return '📊'
            case 'mobile': return '📱'
            default: return '⚡'
        }
    }

    return (
        <section className="section-padding bg-dark-gray/50">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Trusted by <span className="gradient-text">Innovators</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        See what our clients say about working with Algo X
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Testimonial Slider */}
                <div className="relative mb-12">
                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 w-12 h-12 rounded-full glass-effect border border-white/10 hover:border-neon-green flex items-center justify-center transition-all duration-300 hover:scale-110"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 w-12 h-12 rounded-full glass-effect border border-white/10 hover:border-neon-green flex items-center justify-center transition-all duration-300 hover:scale-110"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Testimonial Cards */}
                    <div className="relative overflow-hidden rounded-3xl">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${currentIndex * 100}%)`,
                                width: `${testimonials.length * 100}%`
                            }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={testimonial.id}
                                    className="w-full flex-shrink-0 px-4"
                                >
                                    <div className="glass-effect rounded-3xl p-8 border border-white/10">
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            {/* Left Column - Client Info */}
                                            <div className="lg:w-1/3">
                                                <div className="flex items-start gap-4 mb-6">
                                                    <div className="text-4xl">{testimonial.image}</div>
                                                    <div>
                                                        <h3 className="text-xl font-bold mb-1">{testimonial.name}</h3>
                                                        <p className="text-neon-green font-medium">{testimonial.role}</p>
                                                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                                                            <Building className="w-4 h-4" />
                                                            {testimonial.company}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center gap-1 mb-4">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                    <span className="ml-2 text-sm font-medium">5.0</span>
                                                </div>

                                                {/* Project Info */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(testimonial.category)} text-white text-xs font-medium`}>
                                                            {getCategoryIcon(testimonial.category)} {testimonial.project}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <MapPin className="w-4 h-4" />
                                                        {testimonial.location}
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <Calendar className="w-4 h-4" />
                                                        {testimonial.date}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column - Testimonial Content */}
                                            <div className="lg:w-2/3">
                                                <Quote className="w-8 h-8 text-neon-green/50 mb-4" />

                                                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                                    &quot;{testimonial.content}&quot;
                                                </p>

                                                {/* Key Results */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                                        <CheckCircle className="w-5 h-5 text-neon-green" />
                                                        <div>
                                                            <p className="font-medium">Project Success</p>
                                                            <p className="text-sm text-gray-400">Delivered on time & budget</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                                        <CheckCircle className="w-5 h-5 text-neon-green" />
                                                        <div>
                                                            <p className="font-medium">Ongoing Support</p>
                                                            <p className="text-sm text-gray-400">24/7 technical assistance</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Category Tags */}
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-3 py-1 rounded-full bg-neon-green/10 text-neon-green text-sm">
                                                        {testimonial.category === 'ai' ? 'Artificial Intelligence' :
                                                            testimonial.category === 'web' ? 'Web Development' :
                                                                testimonial.category === 'security' ? 'Cybersecurity' :
                                                                    testimonial.category === 'data' ? 'Data Analytics' : 'Mobile Development'}
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue text-sm">
                                                        African Market
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full bg-neon-purple/10 text-neon-purple text-sm">
                                                        Scalable Solution
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Play/Pause Controls */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="p-2 rounded-full glass-effect border border-white/10 hover:border-neon-green transition-colors"
                            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5" />
                            ) : (
                                <Play className="w-5 h-5" />
                            )}
                        </button>

                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index
                                            ? 'bg-neon-green w-8'
                                            : 'bg-white/30 hover:bg-white/50'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Client Logos */}
                <div className="glass-effect rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-6 text-center">
                        Trusted by <span className="gradient-text">Leading Organizations</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                        {[
                            { name: 'FinTech Africa', logo: '🏦' },
                            { name: 'HealthTech Solutions', logo: '🏥' },
                            { name: 'EcoFarms Kenya', logo: '🌱' },
                            { name: 'University of Nairobi', logo: '🎓' },
                            { name: 'LogiTech East Africa', logo: '🚚' },
                            { name: 'AgroTech Ghana', logo: '🌾' }
                        ].map((client, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
                            >
                                <div className="text-3xl mb-2">{client.logo}</div>
                                <p className="text-sm font-medium text-center">{client.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                        Join hundreds of satisfied clients who trust Algo X for their digital transformation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="btn-primary inline-flex items-center gap-2">
                            Start Your Project
                        </button>
                        <button className="btn-secondary inline-flex items-center gap-2">
                            View All Case Studies
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TestimonialSlider