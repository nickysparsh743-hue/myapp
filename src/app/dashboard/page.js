'use client'

import { useState, useEffect } from 'react'
import {
    TrendingUp, Clock, CheckCircle, AlertCircle,
    FileText, MessageSquare, Users, Calendar,
    ArrowUpRight, ArrowDownRight, Download, Share2,
    Star, Target, Zap, BarChart3
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    const [stats, setStats] = useState({
        activeProjects: 3,
        completedProjects: 12,
        pendingTasks: 8,
        storageUsed: '4.2 GB'
    })

    const [recentActivities, setRecentActivities] = useState([])
    const [upcomingMilestones, setUpcomingMilestones] = useState([])

    useEffect(() => {
        // Mock data
        setRecentActivities([
            {
                id: 1,
                type: 'file_upload',
                user: 'Sarah Chen',
                project: 'E-commerce Platform',
                time: '2 hours ago',
                icon: FileText
            },
            {
                id: 2,
                type: 'message',
                user: 'Mike Rodriguez',
                project: 'Mobile Banking App',
                time: '4 hours ago',
                icon: MessageSquare
            },
            {
                id: 3,
                type: 'milestone',
                user: 'Alex Johnson',
                project: 'AI Chatbot',
                time: '1 day ago',
                icon: Target
            },
            {
                id: 4,
                type: 'review',
                user: 'Emma Davis',
                project: 'Data Dashboard',
                time: '2 days ago',
                icon: Star
            }
        ])

        setUpcomingMilestones([
            {
                id: 1,
                project: 'E-commerce Platform',
                milestone: 'Payment Integration',
                dueDate: 'Tomorrow',
                status: 'pending'
            },
            {
                id: 2,
                project: 'Mobile Banking App',
                milestone: 'Security Review',
                dueDate: 'In 3 days',
                status: 'in_progress'
            },
            {
                id: 3,
                project: 'AI Chatbot',
                milestone: 'Final Deployment',
                dueDate: 'Next Week',
                status: 'pending'
            }
        ])
    }, [])

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Welcome back, John! 👋</h1>
                        <p className="text-gray-400">
                            Here's what's happening with your projects today.
                        </p>
                    </div>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity">
                            New Project
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                            Quick Tour
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-neon-green/20 to-neon-blue/20">
                            <TrendingUp className="w-6 h-6 text-neon-green" />
                        </div>
                        <span className="text-sm text-green-400 flex items-center">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            12%
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{stats.activeProjects}</h3>
                    <p className="text-gray-400">Active Projects</p>
                </div>

                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                            <CheckCircle className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-sm text-green-400 flex items-center">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            8%
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{stats.completedProjects}</h3>
                    <p className="text-gray-400">Completed Projects</p>
                </div>

                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
                            <Clock className="w-6 h-6 text-yellow-400" />
                        </div>
                        <span className="text-sm text-red-400 flex items-center">
                            <ArrowDownRight className="w-4 h-4 mr-1" />
                            3%
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{stats.pendingTasks}</h3>
                    <p className="text-gray-400">Pending Tasks</p>
                </div>

                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                            <BarChart3 className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-sm text-green-400 flex items-center">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            5%
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{stats.storageUsed}</h3>
                    <p className="text-gray-400">Storage Used</p>
                </div>
            </div>

            {/* Projects Overview & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Projects Overview */}
                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Projects Overview</h2>
                        <Link
                            href="/dashboard/projects"
                            className="text-sm text-neon-green hover:underline"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                name: 'E-commerce Platform',
                                progress: 75,
                                deadline: 'Dec 15, 2024',
                                team: 4,
                                status: 'active'
                            },
                            {
                                name: 'Mobile Banking App',
                                progress: 45,
                                deadline: 'Jan 20, 2025',
                                team: 6,
                                status: 'active'
                            },
                            {
                                name: 'AI Chatbot',
                                progress: 90,
                                deadline: 'Dec 5, 2024',
                                team: 3,
                                status: 'review'
                            },
                            {
                                name: 'Data Dashboard',
                                progress: 100,
                                deadline: 'Completed',
                                team: 2,
                                status: 'completed'
                            }
                        ].map((project, index) => (
                            <div key={index} className="p-4 rounded-lg bg-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium">{project.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs ${project.status === 'active' ? 'bg-neon-green/20 text-neon-green' :
                                            project.status === 'review' ? 'bg-yellow-500/20 text-yellow-500' :
                                                'bg-green-500/20 text-green-500'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                                        <span>Progress</span>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${project.status === 'active' ? 'bg-neon-green' :
                                                    project.status === 'review' ? 'bg-yellow-500' :
                                                        'bg-green-500'
                                                }`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {project.team}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {project.deadline}
                                        </span>
                                    </div>
                                    <button className="text-neon-green hover:underline text-sm">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity & Upcoming Milestones */}
                <div className="space-y-8">
                    {/* Recent Activity */}
                    <div className="glass-effect rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Recent Activity</h2>
                            <button className="text-sm text-gray-400 hover:text-white">
                                Clear All
                            </button>
                        </div>

                        <div className="space-y-4">
                            {recentActivities.map((activity) => {
                                const Icon = activity.icon
                                return (
                                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                        <div className="p-2 rounded-lg bg-white/10">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm">
                                                <span className="font-medium">{activity.user}</span>
                                                {' '}added a {activity.type} to{' '}
                                                <span className="font-medium">{activity.project}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Upcoming Milestones */}
                    <div className="glass-effect rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Upcoming Milestones</h2>
                            <Link
                                href="/dashboard/calendar"
                                className="text-sm text-neon-green hover:underline"
                            >
                                View Calendar
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {upcomingMilestones.map((milestone) => (
                                <div key={milestone.id} className="p-4 rounded-lg bg-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium">{milestone.milestone}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs ${milestone.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                'bg-neon-green/20 text-neon-green'
                                            }`}>
                                            {milestone.status === 'pending' ? 'Pending Approval' : 'In Progress'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-3">{milestone.project}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Due: {milestone.dueDate}</span>
                                        <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark text-xs font-semibold hover:opacity-90 transition-opacity">
                                            Review
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats & Tools */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-neon-green/20 to-neon-blue/20">
                            <Zap className="w-6 h-6 text-neon-green" />
                        </div>
                        <div>
                            <h3 className="font-bold">Quick Actions</h3>
                            <p className="text-sm text-gray-400">Common tasks</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between">
                            <span>Request Support</span>
                            <AlertCircle className="w-4 h-4" />
                        </button>
                        <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between">
                            <span>Download Invoice</span>
                            <Download className="w-4 h-4" />
                        </button>
                        <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between">
                            <span>Share Project</span>
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                            <Target className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold">Performance</h3>
                            <p className="text-sm text-gray-400">This month</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span>On-time Delivery</span>
                                <span className="font-bold text-green-400">95%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span>Client Satisfaction</span>
                                <span className="font-bold text-green-400">98%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-neon-green rounded-full" style={{ width: '98%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span>Task Completion</span>
                                <span className="font-bold text-yellow-400">87%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '87%' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                            <Star className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold">Recent Feedback</h3>
                            <p className="text-sm text-gray-400">From your team</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-sm italic mb-2">"Great progress on the payment integration! The documentation is clear."</p>
                            <p className="text-xs text-gray-400 text-right">- Sarah, Developer</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-sm italic mb-2">"Security review completed successfully. Ready for next phase."</p>
                            <p className="text-xs text-gray-400 text-right">- Mike, Security Lead</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}