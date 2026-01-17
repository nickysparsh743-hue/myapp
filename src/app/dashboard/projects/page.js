'use client'

import { useState } from 'react'
import {
    Search, Filter, Plus, MoreVertical,
    Calendar, Users, BarChart, MessageSquare,
    Clock, CheckCircle, AlertCircle, Download,
    Eye, Edit, Trash2, Share2, Copy
} from 'lucide-react'
import Link from 'next/link'

export default function ProjectsPage() {
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: 'E-commerce Platform',
            description: 'Full-featured online store with AI recommendations',
            status: 'active',
            progress: 75,
            startDate: 'Oct 1, 2024',
            endDate: 'Dec 15, 2024',
            budget: '$25,000',
            team: 4,
            priority: 'high',
            tasks: { total: 24, completed: 18 }
        },
        {
            id: 2,
            name: 'Mobile Banking App',
            description: 'Secure mobile banking with biometric authentication',
            status: 'active',
            progress: 45,
            startDate: 'Sep 15, 2024',
            endDate: 'Jan 20, 2025',
            budget: '$35,000',
            team: 6,
            priority: 'critical',
            tasks: { total: 32, completed: 14 }
        },
        {
            id: 3,
            name: 'AI Chatbot System',
            description: 'Intelligent customer support chatbot',
            status: 'review',
            progress: 90,
            startDate: 'Aug 10, 2024',
            endDate: 'Dec 5, 2024',
            budget: '$18,000',
            team: 3,
            priority: 'medium',
            tasks: { total: 18, completed: 16 }
        },
        {
            id: 4,
            name: 'Data Analytics Dashboard',
            description: 'Real-time business intelligence platform',
            status: 'completed',
            progress: 100,
            startDate: 'Jul 1, 2024',
            endDate: 'Nov 15, 2024',
            budget: '$22,000',
            team: 2,
            priority: 'low',
            tasks: { total: 20, completed: 20 }
        },
        {
            id: 5,
            name: 'Healthcare Management System',
            description: 'Patient records and appointment scheduling',
            status: 'planning',
            progress: 20,
            startDate: 'Dec 1, 2024',
            endDate: 'Mar 30, 2025',
            budget: '$40,000',
            team: 5,
            priority: 'high',
            tasks: { total: 28, completed: 6 }
        },
        {
            id: 6,
            name: 'Social Media Analytics',
            description: 'AI-powered social media insights',
            status: 'on-hold',
            progress: 10,
            startDate: 'TBD',
            endDate: 'TBD',
            budget: '$15,000',
            team: 2,
            priority: 'low',
            tasks: { total: 15, completed: 2 }
        }
    ])

    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    const filteredProjects = projects.filter(project => {
        if (filter !== 'all' && project.status !== filter) return false
        if (search && !project.name.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-neon-green bg-neon-green/20 border-neon-green/30'
            case 'review': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30'
            case 'completed': return 'text-green-500 bg-green-500/20 border-green-500/30'
            case 'planning': return 'text-blue-500 bg-blue-500/20 border-blue-500/30'
            case 'on-hold': return 'text-gray-500 bg-gray-500/20 border-gray-500/30'
            default: return 'text-gray-400 bg-white/5 border-white/10'
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'bg-red-500/20 text-red-400'
            case 'high': return 'bg-orange-500/20 text-orange-400'
            case 'medium': return 'bg-yellow-500/20 text-yellow-400'
            case 'low': return 'bg-green-500/20 text-green-400'
            default: return 'bg-white/5 text-gray-400'
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Projects</h1>
                    <p className="text-gray-400">Track and manage all your projects in one place</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <Link
                        href="/dashboard/projects/new"
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Project
                    </Link>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                    ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold'
                                    : 'border border-white/10 hover:border-neon-green hover:bg-neon-green/10'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'active'
                                    ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold'
                                    : 'border border-white/10 hover:border-neon-green hover:bg-neon-green/10'
                                }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilter('review')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'review'
                                    ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold'
                                    : 'border border-white/10 hover:border-neon-green hover:bg-neon-green/10'
                                }`}
                        >
                            Review
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'completed'
                                    ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold'
                                    : 'border border-white/10 hover:border-neon-green hover:bg-neon-green/10'
                                }`}
                        >
                            Completed
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Total Projects</p>
                            <h3 className="text-2xl font-bold mt-2">{projects.length}</h3>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-neon-green/20 to-neon-blue/20">
                            <BarChart className="w-6 h-6 text-neon-green" />
                        </div>
                    </div>
                </div>

                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Active Projects</p>
                            <h3 className="text-2xl font-bold mt-2">
                                {projects.filter(p => p.status === 'active').length}
                            </h3>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Team Members</p>
                            <h3 className="text-2xl font-bold mt-2">
                                {projects.reduce((sum, project) => sum + project.team, 0)}
                            </h3>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                            <Users className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Avg. Progress</p>
                            <h3 className="text-2xl font-bold mt-2">
                                {Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length)}%
                            </h3>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                            <TrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="glass-effect rounded-2xl border border-white/10 overflow-hidden">
                        {/* Project Header */}
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold">{project.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">{project.description}</p>
                                </div>
                                <div className="relative group">
                                    <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 glass-effect rounded-lg border border-white/10 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                                        <div className="p-2">
                                            <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </button>
                                            <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                <Edit className="w-4 h-4" />
                                                Edit Project
                                            </button>
                                            <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                <Share2 className="w-4 h-4" />
                                                Share
                                            </button>
                                            <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                <Copy className="w-4 h-4" />
                                                Duplicate
                                            </button>
                                            <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors text-red-400 flex items-center gap-2">
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-400">Progress</span>
                                    <span className="font-medium">{project.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${project.status === 'active' ? 'bg-gradient-to-r from-neon-green to-neon-blue' :
                                                project.status === 'review' ? 'bg-yellow-500' :
                                                    project.status === 'completed' ? 'bg-green-500' :
                                                        'bg-blue-500'
                                            }`}
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-gray-400">Timeline</p>
                                        <p>{project.startDate} - {project.endDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-gray-400">Team</p>
                                        <p>{project.team} members</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-gray-400">Budget</p>
                                        <p>{project.budget}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-gray-400">Tasks</p>
                                        <p>{project.tasks.completed}/{project.tasks.total}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Project Footer */}
                        <div className="p-6 bg-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(project.priority)}`}>
                                        {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
                                    </span>
                                    {project.status === 'review' && (
                                        <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
                                            Needs Approval
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/dashboard/projects/${project.id}`}
                                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark text-sm font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        View Details
                                    </Link>
                                    <button className="p-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <div className="glass-effect rounded-2xl p-12 border border-white/10 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No projects found</h3>
                    <p className="text-gray-400 mb-6">
                        Try adjusting your filters or create a new project
                    </p>
                    <Link
                        href="/dashboard/projects/new"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Project
                    </Link>
                </div>
            )}
        </div>
    )
}