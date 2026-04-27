'use client'

import { useState, useEffect, useRef } from 'react'
import {
    ChevronLeft, ChevronRight, Quote, Star, MapPin,
    Building, Calendar, CheckCircle, Play, Pause,
    Award, TrendingUp, Users, Clock, Sparkles,
    MessageCircle, ThumbsUp, Share2, Bookmark
} from 'lucide-react'

const TestimonialSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [direction, setDirection] = useState('next')
    const [isHovered, setIsHovered] = useState(false)
    const [activeFilter, setActiveFilter] = useState('all')
    const sliderRef = useRef(null)

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
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            category: "ai",
            results: "40% reduction in wait times",
            verified: true,
            featured: true
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
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            category: "security",
            results: "33% compliance improvement",
            verified: true,
            featured: false
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
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            category: "web",
            results: "300% sales increase",
            verified: true,
            featured: true
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
            image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            category: "data",
            results: "10x faster data processing",
            verified: true,
            featured: false
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
            image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            category: "ai",
            results: "200+ hours saved monthly",
            verified: true,
            featured: true
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
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            category: "mobile",
            results: "50k+ active users",
            verified: true,
            featured: false
        }
    ]

    // Filter categories
    const categories = [
        { id: 'all', name: 'All Projects', icon: '✨' },
        { id: 'ai', name: 'AI Solutions', icon: '🤖' },
        { id: 'web', name: 'Web Dev', icon: '🌐' },
        { id: 'security', name: 'Security', icon: '🔒' },
        { id: 'data', name: 'Data Analytics', icon: '📊' },
        { id: 'mobile', name: 'Mobile Apps', icon: '📱' }
    ]

    // Filtered testimonials
    const filteredTestimonials = activeFilter === 'all'
        ? testimonials
        : testimonials.filter(t => t.category === activeFilter)

    // Stats with icons
    const stats = [
        { value: '98%', label: 'Client Satisfaction', icon: <ThumbsUp className="w-5 h-5" />, color: 'from-green-400 to-emerald-500' },
        { value: '50+', label: 'Projects Completed', icon: <Award className="w-5 h-5" />, color: 'from-blue-400 to-indigo-500' },
        { value: '100%', label: 'On-Time Delivery', icon: <Clock className="w-5 h-5" />, color: 'from-purple-400 to-pink-500' },
        { value: '24/7', label: 'Support Available', icon: <Users className="w-5 h-5" />, color: 'from-orange-400 to-red-500' }
    ]

    // Auto-play slider
    useEffect(() => {
        if (!isPlaying || isHovered) return

        const interval = setInterval(() => {
            setDirection('next')
            setCurrentIndex((prevIndex) =>
                prevIndex === filteredTestimonials.length - 1 ? 0 : prevIndex + 1
            )
        }, 6000)

        return () => clearInterval(interval)
    }, [isPlaying, isHovered, filteredTestimonials.length])

    // Reset current index when filter changes
    useEffect(() => {
        setCurrentIndex(0)
    }, [activeFilter])

    const handleNext = () => {
        setDirection('next')
        setCurrentIndex((prevIndex) =>
            prevIndex === filteredTestimonials.length - 1 ? 0 : prevIndex + 1
        )
    }

    const handlePrev = () => {
        setDirection('prev')
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? filteredTestimonials.length - 1 : prevIndex - 1
        )
    }

    // Get gradient based on category
    const getCategoryGradient = (category) => {
        const gradients = {
            ai: 'from-cyan-500 to-blue-500',
            web: 'from-purple-500 to-pink-500',
            security: 'from-orange-500 to-red-500',
            data: 'from-green-500 to-emerald-500',
            mobile: 'from-indigo-500 to-purple-500'
        }
        return gradients[category] || 'from-neon-green to-neon-blue'
    }

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-dark to-dark-gray">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-neon-green/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl animate-pulse delay-1000" />

                {/* Grid Pattern */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container-custom relative z-10">
                {/* Header with Animation */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-neon-green" />
                        <span className="text-sm font-medium">Client Success Stories</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Trusted by{' '}
                        <span className="gradient-text bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                            Industry Leaders
                        </span>
                    </h2>

                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Discover how we've helped businesses across Africa achieve remarkable results through innovative technology solutions
                    </p>
                </div>

                {/* Stats Grid with Hover Effects */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 hover:scale-105 animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} p-3 mb-4 transform group-hover:rotate-12 transition-transform duration-300`}>
                                    <div className="w-full h-full text-white">
                                        {stat.icon}
                                    </div>
                                </div>

                                <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300 origin-left">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveFilter(category.id)}
                            className={`group relative px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeFilter === category.id
                                    ? 'bg-gradient-to-r from-neon-green to-neon-blue text-white shadow-lg scale-105'
                                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <span>{category.icon}</span>
                                {category.name}
                            </span>

                            {activeFilter === category.id && (
                                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-green to-neon-blue animate-pulse opacity-50" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Main Slider */}
                <div
                    className="relative mb-16"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    ref={sliderRef}
                >
                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-20 w-14 h-14 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-neon-green hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={filteredTestimonials.length <= 1}
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 md:translate-x-8 z-20 w-14 h-14 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-neon-green hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={filteredTestimonials.length <= 1}
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Testimonial Cards Container */}
                    <div className="relative overflow-hidden rounded-3xl">
                        <div
                            className="flex transition-transform duration-700 ease-out"
                            style={{
                                transform: `translateX(-${currentIndex * 100}%)`,
                            }}
                        >
                            {filteredTestimonials.map((testimonial, index) => (
                                <div
                                    key={testimonial.id}
                                    className="w-full flex-shrink-0 px-4"
                                >
                                    <div className="group/card relative bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-neon-green/5">
                                        {/* Featured Badge */}
                                        {testimonial.featured && (
                                            <div className="absolute top-6 right-6 z-10">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-md opacity-50 animate-pulse" />
                                                    <div className="relative px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white text-sm font-medium flex items-center gap-2">
                                                        <Award className="w-4 h-4" />
                                                        Featured Story
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Card Content */}
                                        <div className="p-8 lg:p-10">
                                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                                                {/* Left Column - Client Info */}
                                                <div className="lg:w-1/3">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="relative">
                                                            <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryGradient(testimonial.category)} rounded-full blur-md opacity-50 group-hover/card:opacity-75 transition-opacity`} />
                                                            <img
                                                                src={testimonial.image}
                                                                alt={testimonial.name}
                                                                className="relative w-20 h-20 rounded-full object-cover border-2 border-white/20 group-hover/card:scale-110 transition-transform duration-500"
                                                            />

                                                            {/* Verified Badge */}
                                                            {testimonial.verified && (
                                                                <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-neon-green flex items-center justify-center border-2 border-dark">
                                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <h3 className="text-xl font-bold mb-1 group-hover/card:text-neon-green transition-colors">
                                                                {testimonial.name}
                                                            </h3>
                                                            <p className="text-neon-green font-medium text-sm mb-2">
                                                                {testimonial.role}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                                <Building className="w-4 h-4 flex-shrink-0" />
                                                                <span className="truncate">{testimonial.company}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Rating with Animation */}
                                                    <div className="flex items-center gap-1 mb-6">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-5 h-5 transition-all duration-300 ${i < testimonial.rating
                                                                        ? 'fill-yellow-400 text-yellow-400 animate-bounce'
                                                                        : 'text-gray-600'
                                                                    }`}
                                                                style={{ animationDelay: `${i * 100}ms` }}
                                                            />
                                                        ))}
                                                        <span className="ml-2 text-sm font-medium text-gray-400">
                                                            ({testimonial.rating}.0)
                                                        </span>
                                                    </div>

                                                    {/* Project Info Cards */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 group-hover/card:bg-white/10 transition-colors">
                                                            <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryGradient(testimonial.category)} bg-opacity-20`}>
                                                                <span className="text-xl">{categories.find(c => c.id === testimonial.category)?.icon}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-400 mb-1">Project</p>
                                                                <p className="font-medium">{testimonial.project}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm text-gray-400 p-3 rounded-xl bg-white/5 group-hover/card:bg-white/10 transition-colors">
                                                            <MapPin className="w-4 h-4" />
                                                            {testimonial.location}
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm text-gray-400 p-3 rounded-xl bg-white/5 group-hover/card:bg-white/10 transition-colors">
                                                            <Calendar className="w-4 h-4" />
                                                            {testimonial.date}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Column - Testimonial Content */}
                                                <div className="lg:w-2/3">
                                                    {/* Quote Icon */}
                                                    <div className="relative mb-6">
                                                        <Quote className="w-12 h-12 text-neon-green/20 absolute -top-2 -left-2" />
                                                        <Quote className="w-8 h-8 text-neon-green/40 relative z-10" />
                                                    </div>

                                                    {/* Testimonial Text */}
                                                    <div className="relative">
                                                        <p className="text-lg text-gray-300 mb-8 leading-relaxed italic">
                                                            &ldquo;{testimonial.content}&rdquo;
                                                        </p>

                                                        {/* Key Result Highlight */}
                                                        <div className="inline-block mb-8">
                                                            <div className="relative">
                                                                <div className="absolute inset-0 bg-gradient-to-r from-neon-green to-neon-blue rounded-full blur-md opacity-20" />
                                                                <div className="relative px-6 py-3 bg-gradient-to-r from-neon-green/10 to-neon-blue/10 rounded-full border border-neon-green/20">
                                                                    <span className="text-neon-green font-semibold">
                                                                        Key Result: {testimonial.results}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Achievement Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                                        <div className="group/achievement p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-neon-green/20 group-hover/achievement:bg-neon-green/30 transition-colors">
                                                                    <TrendingUp className="w-4 h-4 text-neon-green" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-400">ROI Achieved</p>
                                                                    <p className="font-semibold">300% in 6 months</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="group/achievement p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-neon-blue/20 group-hover/achievement:bg-neon-blue/30 transition-colors">
                                                                    <Users className="w-4 h-4 text-neon-blue" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-400">Team Efficiency</p>
                                                                    <p className="font-semibold">+45% productivity</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Tech Stack Tags */}
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-green/10 to-neon-blue/10 text-neon-green text-sm border border-neon-green/20 hover:border-neon-green/40 transition-colors cursor-default">
                                                            {testimonial.category === 'ai' ? '🤖 AI & Machine Learning' :
                                                                testimonial.category === 'web' ? '🌐 Full Stack Development' :
                                                                    testimonial.category === 'security' ? '🔒 Enterprise Security' :
                                                                        testimonial.category === 'data' ? '📊 Big Data Analytics' : '📱 Cross-Platform'}
                                                        </span>
                                                        <span className="px-4 py-2 rounded-full bg-white/5 text-gray-300 text-sm border border-white/10 hover:border-white/20 transition-colors cursor-default">
                                                            🌍 African Market
                                                        </span>
                                                        <span className="px-4 py-2 rounded-full bg-white/5 text-gray-300 text-sm border border-white/10 hover:border-white/20 transition-colors cursor-default">
                                                            ⚡ Scalable Solution
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-between items-center mt-8">
                        {/* Play/Pause Button */}
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-neon-green transition-all duration-300"
                            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isPlaying ? 'bg-red-500/20' : 'bg-neon-green/20 group-hover:bg-neon-green/30'
                                }`}>
                                {isPlaying ? (
                                    <Pause className="w-4 h-4 text-red-400" />
                                ) : (
                                    <Play className="w-4 h-4 text-neon-green" />
                                )}
                            </div>
                            <span className="text-sm font-medium">
                                {isPlaying ? 'Pause' : 'Play'}
                            </span>
                        </button>

                        {/* Slide Indicators */}
                        <div className="flex gap-2">
                            {filteredTestimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDirection(index > currentIndex ? 'next' : 'prev')
                                        setCurrentIndex(index)
                                    }}
                                    className="group relative"
                                    aria-label={`Go to slide ${index + 1}`}
                                >
                                    <div className={`h-2 rounded-full transition-all duration-500 ${currentIndex === index
                                            ? 'w-12 bg-gradient-to-r from-neon-green to-neon-blue'
                                            : 'w-2 bg-white/30 group-hover:bg-white/50'
                                        }`} />

                                    {currentIndex === index && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-neon-green to-neon-blue rounded-full blur-sm opacity-50 animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Counter */}
                        <div className="text-sm text-gray-400">
                            <span className="text-white font-semibold">{currentIndex + 1}</span>
                            <span> / {filteredTestimonials.length}</span>
                        </div>
                    </div>
                </div>

                {/* Client Logo Wall */}
                <div className="relative mb-16">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent h-px" />

                    <h3 className="text-xl font-bold mb-8 text-center">
                        <span className="gradient-text">Trusted by Leading Organizations</span>
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[
                            { name: 'FinTech Africa', logo: '🏦', color: 'from-blue-400 to-indigo-500' },
                            { name: 'HealthTech Solutions', logo: '🏥', color: 'from-green-400 to-emerald-500' },
                            { name: 'EcoFarms Kenya', logo: '🌱', color: 'from-lime-400 to-green-500' },
                            { name: 'University of Nairobi', logo: '🎓', color: 'from-purple-400 to-pink-500' },
                            { name: 'LogiTech East Africa', logo: '🚚', color: 'from-orange-400 to-red-500' },
                            { name: 'AgroTech Ghana', logo: '🌾', color: 'from-yellow-400 to-amber-500' }
                        ].map((client, index) => (
                            <div
                                key={index}
                                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${client.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                <div className="relative z-10 text-center">
                                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-500">
                                        {client.logo}
                                    </div>
                                    <p className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                                        {client.name}
                                    </p>
                                </div>

                                {/* Hover Glow Effect */}
                                <div className={`absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-r ${client.color} rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced CTA Section */}
                <div className="relative text-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-neon-blue/20 rounded-3xl blur-3xl opacity-30 animate-pulse" />

                    <div className="relative p-12 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <h3 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Transform Your Business?
                        </h3>

                        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                            Join hundreds of satisfied clients who trust Algo X for their digital transformation journey
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="group relative px-8 py-4 bg-gradient-to-r from-neon-green to-neon-blue rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-neon-green/25">
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Your Project
                                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                            </button>

                            <button className="group px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                                View All Case Studies
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap justify-center gap-8 mt-8 pt-8 border-t border-white/10">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <CheckCircle className="w-4 h-4 text-neon-green" />
                                No commitment required
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <CheckCircle className="w-4 h-4 text-neon-green" />
                                Free consultation
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <CheckCircle className="w-4 h-4 text-neon-green" />
                                24/7 support
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out forwards;
                }
            `}</style>
        </section>
    )
}

export default TestimonialSlider