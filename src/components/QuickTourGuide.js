'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Home } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const QuickTourGuide = ({ onClose }) => {
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState(0)
    const [highlights, setHighlights] = useState(null)

    // Define tour steps based on user role
    const getTourSteps = () => {
        const userRole = user?.user_metadata?.role?.toLowerCase() || 'user'

        const commonSteps = [
            {
                title: 'Welcome to Dashboard',
                description: 'Your central hub for managing projects, activities, and team collaboration. Let\'s explore the key features.',
                highlightId: 'welcome-section',
                position: 'bottom'
            },
            {
                title: 'Dashboard Stats',
                description: 'Monitor your key metrics at a glance: Active Projects, Completed Projects, Pending Tasks, and Storage Usage.',
                highlightId: 'stats-grid',
                position: 'bottom'
            },
            {
                title: 'Projects Overview',
                description: 'Track all your projects here. Click "View All" to see complete project list with filters and search.',
                highlightId: 'projects-overview',
                position: 'top'
            },
            {
                title: 'Recent Activity',
                description: 'Stay updated with real-time activities from your team including file uploads, messages, and milestones.',
                highlightId: 'recent-activity',
                position: 'top'
            },
            {
                title: 'Upcoming Milestones',
                description: 'Never miss important dates. View all upcoming milestones and click "View Calendar" for detailed scheduling.',
                highlightId: 'upcoming-milestones',
                position: 'top'
            },
            {
                title: 'Quick Actions',
                description: 'Access common tasks quickly: Request Support, Download Invoices, and Share Projects.',
                highlightId: 'quick-actions',
                position: 'top'
            }
        ]

        const adminSteps = [
            ...commonSteps.slice(0, 2), // Welcome and stats
            {
                title: 'Team Management',
                description: 'As an Admin, you have access to team management features. Go to the Team section to manage members, roles, and permissions.',
                highlightId: 'stats-grid',
                position: 'bottom'
            },
            {
                title: 'User Roles & Permissions',
                description: 'Control who can do what in your workspace. Assign roles to team members and manage their access levels.',
                highlightId: 'stats-grid',
                position: 'bottom'
            },
            ...commonSteps.slice(2),
            {
                title: 'System Settings',
                description: 'Access Admin settings to configure workspace policies, security settings, and integrations.',
                highlightId: 'quick-actions',
                position: 'top'
            },
            {
                title: 'Analytics & Reports',
                description: 'View comprehensive analytics and generate reports on team performance and project metrics.',
                highlightId: 'performance-section',
                position: 'top'
            }
        ]

        const projectLeadSteps = [
            ...commonSteps.slice(0, 2),
            {
                title: 'Your Projects',
                description: 'As a Project Lead, view and manage all projects you\'re leading. Track progress, deadlines, and team assignments.',
                highlightId: 'projects-overview',
                position: 'top'
            },
            {
                title: 'Team Collaboration',
                description: 'Access the team section to view your team members and coordinate with them on project tasks.',
                highlightId: 'stats-grid',
                position: 'bottom'
            },
            ...commonSteps.slice(2, 4),
            {
                title: 'Milestone Tracking',
                description: 'Track key milestones for your projects. Create, update, and monitor progress toward project goals.',
                highlightId: 'upcoming-milestones',
                position: 'top'
            },
            ...commonSteps.slice(5)
        ]

        const userSteps = commonSteps

        if (userRole === 'admin') return adminSteps
        if (userRole === 'project_lead' || userRole === 'project lead') return projectLeadSteps
        return userSteps
    }

    const tourSteps = getTourSteps()

    const nextStep = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1)
            scrollToStep()
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
            scrollToStep()
        }
    }

    const scrollToStep = () => {
        setTimeout(() => {
            const element = document.querySelector(`[data-tour-id="${tourSteps[currentStep].highlightId}"]`)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        }, 100)
    }

    useEffect(() => {
        scrollToStep()
    }, [])

    const step = tourSteps[currentStep]
    const progress = ((currentStep + 1) / tourSteps.length) * 100

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

            {/* Tour Card */}
            <div className="fixed z-50 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border border-white/10 max-w-md"
                style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Home className="w-5 h-5 text-neon-green" />
                        <span className="text-sm text-gray-400">
                            Step {currentStep + 1} of {tourSteps.length}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-neon-green to-neon-blue transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3 text-white">
                        {step.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed">
                        {step.description}
                    </p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-3">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    {currentStep === tourSteps.length - 1 ? (
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity"
                        >
                            Complete Tour
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Skip Option */}
                <button
                    onClick={onClose}
                    className="w-full mt-4 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    Skip Tour
                </button>
            </div>

            {/* Highlight Element */}
            {step && (
                <div
                    className="fixed z-40 border-2 border-neon-green rounded-xl pointer-events-none animate-pulse"
                    style={{
                        boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)'
                    }}
                    data-tour-highlight
                />
            )}
        </>
    )
}

export default QuickTourGuide
