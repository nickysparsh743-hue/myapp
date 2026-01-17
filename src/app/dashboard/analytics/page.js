'use client'

import { useState, useEffect } from 'react'
import {
    TrendingUp, TrendingDown, Users, DollarSign,
    Clock, Target, BarChart3, PieChart, LineChart,
    Download, Filter, Calendar, ArrowUpRight,
    ArrowDownRight, Eye, Share2, RefreshCw
} from 'lucide-react'

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState('month')
    const [metrics, setMetrics] = useState({})
    const [chartData, setChartData] = useState({})

    useEffect(() => {
        // Mock analytics data
        setMetrics({
            totalProjects: 24,
            activeProjects: 8,
            completedProjects: 16,
            totalRevenue: 185000,
            avgProjectValue: 7708,
            clientSatisfaction: 96,
            onTimeDelivery: 92,
            teamProductivity: 88
        })

        setChartData({
            revenue: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                data: [12000, 19000, 15000, 25000, 22000, 30000]
            },
            projects: {
                labels: ['Web', 'Mobile', 'AI', 'Security', 'Data'],
                data: [12, 8, 5, 3, 6]
            },
            timeline: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [75, 82, 68, 90]
            }
        })
    }, [timeRange])

    const stats = [
        {
            title: 'Total Revenue',
            value: `$${metrics.totalRevenue?.toLocaleString() || '0'}`,
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'from-green-500 to-emerald-500'
        },
        {
            title: 'Active Projects',
            value: metrics.activeProjects || 0,
            change: '+8.2%',
            trend: 'up',
            icon: Target,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Client Satisfaction',
            value: `${metrics.clientSatisfaction || 0}%`,
            change: '+3.1%',
            trend: 'up',
            icon: Users,
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'On-time Delivery',
            value: `${metrics.onTimeDelivery || 0}%`,
            change: '-1.5%',
            trend: 'down',
            icon: Clock,
            color: 'from-orange-500 to-yellow-500'
        }
    ]

    const topProjects = [
        { name: 'E-commerce Platform', revenue: 25000, progress: 75 },
        { name: 'Mobile Banking App', revenue: 35000, progress: 45 },
        { name: 'AI Chatbot System', revenue: 18000, progress: 90 },
        { name: 'Healthcare Management', revenue: 40000, progress: 20 },
        { name: 'Data Analytics Dashboard', revenue: 22000, progress: 100 }
    ]

    const teamPerformance = [
        { name: 'Sarah Chen', role: 'Lead Dev', tasks: 42, completion: 95 },
        { name: 'Mike Rodriguez', role: 'Security', tasks: 28, completion: 92 },
        { name: 'Alex Johnson', role: 'AI Specialist', tasks: 35, completion: 88 },
        { name: 'Emma Davis', role: 'UX Designer', tasks: 38, completion: 90 }
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-400">Track performance, revenue, and project metrics</p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                    >
                        <option value="week">Last 7 days</option>
                        <option value="month">Last 30 days</option>
                        <option value="quarter">Last quarter</option>
                        <option value="year">Last year</option>
                    </select>
                    <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className="glass-effect rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {stat.trend === 'up' ? (
                                        <ArrowUpRight className="w-4 h-4" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4" />
                                    )}
                                    {stat.change}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                            <p className="text-gray-400">{stat.title}</p>
                        </div>
                    )
                })}
            </div>

            {/* Charts & Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Revenue Trend</h2>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="h-64 flex items-end gap-2">
                        {chartData.revenue?.data.map((value, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-neon-green to-neon-blue rounded-t-lg transition-all hover:opacity-90"
                                    style={{ height: `${(value / 35000) * 100}%` }}
                                />
                                <span className="text-xs text-gray-400 mt-2">
                                    {chartData.revenue.labels[index]}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                        <div>
                            <p className="text-sm text-gray-400">Avg. Monthly Revenue</p>
                            <p className="text-lg font-bold">
                                ${Math.round(chartData.revenue?.data.reduce((a, b) => a + b, 0) / chartData.revenue?.data.length || 0).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Growth</p>
                            <p className="text-lg font-bold text-green-400">+12.5%</p>
                        </div>
                    </div>
                </div>

                {/* Project Distribution */}
                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Project Distribution</h2>
                        <div className="p-2 rounded-lg bg-white/5">
                            <PieChart className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {chartData.projects?.labels.map((label, index) => {
                            const percentage = Math.round((chartData.projects.data[index] / chartData.projects.data.reduce((a, b) => a + b, 0)) * 100)
                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{label}</span>
                                        <span className="text-sm text-gray-400">
                                            {chartData.projects.data[index]} projects ({percentage}%)
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Projects & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Projects by Revenue */}
                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Top Projects by Revenue</h2>
                        <button className="text-sm text-neon-green hover:underline">
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {topProjects.map((project, index) => (
                            <div key={index} className="p-4 rounded-lg bg-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold">{project.name}</h3>
                                        <p className="text-sm text-gray-400">${project.revenue.toLocaleString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs ${project.progress === 100 ? 'bg-green-500/20 text-green-400' :
                                            project.progress >= 75 ? 'bg-neon-green/20 text-neon-green' :
                                                project.progress >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {project.progress}%
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mr-4">
                                        <div
                                            className={`h-full rounded-full ${project.progress === 100 ? 'bg-green-500' :
                                                    project.progress >= 75 ? 'bg-neon-green' :
                                                        project.progress >= 50 ? 'bg-yellow-500' :
                                                            'bg-blue-500'
                                                }`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-gray-400 whitespace-nowrap">
                                        ${Math.round(project.revenue * (project.progress / 100)).toLocaleString()} billed
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Performance */}
                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Team Performance</h2>
                        <button className="text-sm text-neon-green hover:underline">
                            View Details
                        </button>
                    </div>

                    <div className="space-y-4">
                        {teamPerformance.map((member, index) => (
                            <div key={index} className="p-4 rounded-lg bg-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center">
                                            <Users className="w-5 h-5 text-dark" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{member.name}</h3>
                                            <p className="text-sm text-gray-400">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">{member.completion}%</div>
                                        <div className="text-sm text-gray-400">{member.tasks} tasks</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Task Completion</span>
                                        <span className="font-medium">{member.completion}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${member.completion >= 90 ? 'bg-neon-green' :
                                                    member.completion >= 80 ? 'bg-green-500' :
                                                        member.completion >= 70 ? 'bg-yellow-500' :
                                                            'bg-orange-500'
                                                }`}
                                            style={{ width: `${member.completion}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                            <Target className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold">Project Success Rate</h3>
                            <p className="text-sm text-gray-400">Completed vs Total</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold gradient-text mb-2">
                            {metrics.completedProjects && metrics.totalProjects
                                ? Math.round((metrics.completedProjects / metrics.totalProjects) * 100)
                                : 0
                            }%
                        </div>
                        <p className="text-gray-400">
                            {metrics.completedProjects || 0} of {metrics.totalProjects || 0} projects
                        </p>
                    </div>
                </div>

                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                            <Clock className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold">Avg. Project Duration</h3>
                            <p className="text-sm text-gray-400">Time to completion</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold gradient-text mb-2">42</div>
                        <p className="text-gray-400">days per project</p>
                    </div>
                </div>

                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                            <DollarSign className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-bold">Avg. Project Value</h3>
                            <p className="text-sm text-gray-400">Revenue per project</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold gradient-text mb-2">
                            ${metrics.avgProjectValue?.toLocaleString() || '0'}
                        </div>
                        <p className="text-gray-400">per completed project</p>
                    </div>
                </div>
            </div>

            {/* Insights */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold mb-6">Key Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border border-neon-green/20">
                        <h3 className="font-bold mb-2 text-neon-green">📈 Revenue Growth</h3>
                        <p className="text-gray-300">
                            Revenue has increased by 12.5% this quarter. Mobile app projects are driving most of the growth.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <h3 className="font-bold mb-2 text-purple-400">⚡ Team Efficiency</h3>
                        <p className="text-gray-300">
                            Development team productivity improved by 8% after implementing new workflow tools.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <h3 className="font-bold mb-2 text-blue-400">🎯 Client Satisfaction</h3>
                        <p className="text-gray-300">
                            96% client satisfaction rate maintained. Regular check-ins and transparent communication are key.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                        <h3 className="font-bold mb-2 text-yellow-400">⚠️ Areas for Improvement</h3>
                        <p className="text-gray-300">
                            On-time delivery decreased by 1.5%. Consider revisiting project estimation processes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}