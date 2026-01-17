'use client'

import { useState } from 'react'
import {
    Search, Filter, UserPlus, Mail, Phone,
    MoreVertical, Crown, Shield, Zap, Clock,
    MessageSquare, Video, Star, Edit, Trash2,
    Globe, Lock, Award, CheckCircle, XCircle
} from 'lucide-react'

export default function TeamPage() {
    const [members, setMembers] = useState([
        {
            id: 1,
            name: 'Sarah Chen',
            role: 'Lead Developer',
            email: 'sarah@algo-x.com',
            phone: '+254 712 345 678',
            avatar: '👩‍💻',
            status: 'active',
            permissions: 'admin',
            projects: 5,
            joined: 'Jan 15, 2023',
            skills: ['React', 'Node.js', 'AWS', 'Python'],
            performance: 95
        },
        {
            id: 2,
            name: 'Mike Rodriguez',
            role: 'Security Lead',
            email: 'mike@algo-x.com',
            phone: '+254 723 456 789',
            avatar: '👨‍💼',
            status: 'active',
            permissions: 'manager',
            projects: 3,
            joined: 'Mar 22, 2023',
            skills: ['Cybersecurity', 'Pen Testing', 'Compliance', 'Firewalls'],
            performance: 92
        },
        {
            id: 3,
            name: 'Alex Johnson',
            role: 'AI Specialist',
            email: 'alex@algo-x.com',
            phone: '+254 734 567 890',
            avatar: '👨‍🔬',
            status: 'active',
            permissions: 'developer',
            projects: 4,
            joined: 'Feb 10, 2023',
            skills: ['Machine Learning', 'TensorFlow', 'Python', 'Data Science'],
            performance: 88
        },
        {
            id: 4,
            name: 'Emma Davis',
            role: 'UX Designer',
            email: 'emma@algo-x.com',
            phone: '+254 745 678 901',
            avatar: '👩‍🎨',
            status: 'away',
            permissions: 'designer',
            projects: 6,
            joined: 'Apr 5, 2023',
            skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
            performance: 90
        },
        {
            id: 5,
            name: 'David Wilson',
            role: 'Project Manager',
            email: 'david@algo-x.com',
            phone: '+254 756 789 012',
            avatar: '👨‍💼',
            status: 'active',
            permissions: 'manager',
            projects: 8,
            joined: 'Dec 1, 2022',
            skills: ['Agile', 'Scrum', 'Jira', 'Communication'],
            performance: 96
        },
        {
            id: 6,
            name: 'Lisa Wang',
            role: 'Data Analyst',
            email: 'lisa@algo-x.com',
            phone: '+254 767 890 123',
            avatar: '👩‍💼',
            status: 'offline',
            permissions: 'analyst',
            projects: 2,
            joined: 'May 18, 2023',
            skills: ['SQL', 'Tableau', 'Statistics', 'Excel'],
            performance: 85
        }
    ])

    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    const filteredMembers = members.filter(member => {
        if (filter !== 'all' && member.status !== filter) return false
        if (search && !member.name.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-400 bg-green-400/20'
            case 'away': return 'text-yellow-400 bg-yellow-400/20'
            case 'offline': return 'text-gray-400 bg-gray-400/20'
            default: return 'text-gray-400 bg-white/5'
        }
    }

    const getPermissionIcon = (permission) => {
        switch (permission) {
            case 'admin': return Crown
            case 'manager': return Shield
            case 'developer': return Zap
            case 'designer': return Award
            case 'analyst': return Globe
            default: return Lock
        }
    }

    const handleInvite = () => {
        const email = prompt('Enter email to invite:')
        if (email) {
            // Handle invitation logic
            console.log('Inviting:', email)
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Team Management</h1>
                    <p className="text-gray-400">Manage your team members and permissions</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={handleInvite}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite Member
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Total Members</p>
                            <h3 className="text-2xl font-bold mt-2">{members.length}</h3>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-neon-green/20 to-neon-blue/20">
                            <Globe className="w-6 h-6 text-neon-green" />
                        </div>
                    </div>
                </div>

                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Active Now</p>
                            <h3 className="text-2xl font-bold mt-2">
                                {members.filter(m => m.status === 'active').length}
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
                            <p className="text-sm text-gray-400">Avg Performance</p>
                            <h3 className="text-2xl font-bold mt-2">
                                {Math.round(members.reduce((sum, m) => sum + m.performance, 0) / members.length)}%
                            </h3>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                            <Star className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="glass-effect rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Active Projects</p>
                            <h3 className="text-2xl font-bold mt-2">
                                {members.reduce((sum, m) => sum + m.projects, 0)}
                            </h3>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                            <Zap className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search team members..."
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
                            onClick={() => setFilter('away')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'away'
                                    ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold'
                                    : 'border border-white/10 hover:border-neon-green hover:bg-neon-green/10'
                                }`}
                        >
                            Away
                        </button>
                    </div>
                </div>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => {
                    const PermissionIcon = getPermissionIcon(member.permissions)
                    return (
                        <div key={member.id} className="glass-effect rounded-2xl border border-white/10 overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center text-xl">
                                                {member.avatar}
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark ${member.status === 'active' ? 'bg-green-500' :
                                                    member.status === 'away' ? 'bg-yellow-500' :
                                                        'bg-gray-500'
                                                }`} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{member.name}</h3>
                                            <p className="text-neon-green">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                        <div className="absolute right-0 mt-2 w-48 glass-effect rounded-lg border border-white/10 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                                            <div className="p-2">
                                                <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                    <MessageSquare className="w-4 h-4" />
                                                    Send Message
                                                </button>
                                                <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                    <Edit className="w-4 h-4" />
                                                    Edit Profile
                                                </button>
                                                <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                    <Video className="w-4 h-4" />
                                                    Schedule Call
                                                </button>
                                                <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors text-red-400 flex items-center gap-2">
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Performance */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <PermissionIcon className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm text-gray-400">{member.permissions}</span>
                                    </div>
                                </div>

                                {/* Performance */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-gray-400">Performance</span>
                                        <span className="font-medium">{member.performance}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
                                            style={{ width: `${member.performance}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6">
                                {/* Contact Info */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>{member.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{member.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>Joined {member.joined}</span>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="mb-6">
                                    <p className="text-sm font-medium mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {member.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/10"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center justify-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Message
                                    </button>
                                    <button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Call
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Empty State */}
            {filteredMembers.length === 0 && (
                <div className="glass-effect rounded-2xl p-12 border border-white/10 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No team members found</h3>
                    <p className="text-gray-400 mb-6">
                        Try adjusting your filters or invite new members
                    </p>
                    <button
                        onClick={handleInvite}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity"
                    >
                        <UserPlus className="w-5 h-5" />
                        Invite Team Member
                    </button>
                </div>
            )}

            {/* Permissions Guide */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4">Permission Levels</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        {
                            level: 'admin',
                            icon: Crown,
                            description: 'Full access to all features and settings',
                            color: 'from-red-500/20 to-orange-500/20'
                        },
                        {
                            level: 'manager',
                            icon: Shield,
                            description: 'Can manage projects and team members',
                            color: 'from-purple-500/20 to-pink-500/20'
                        },
                        {
                            level: 'developer',
                            icon: Zap,
                            description: 'Can access and work on assigned projects',
                            color: 'from-blue-500/20 to-cyan-500/20'
                        },
                        {
                            level: 'viewer',
                            icon: Lock,
                            description: 'Can view projects but cannot make changes',
                            color: 'from-gray-500/20 to-gray-600/20'
                        }
                    ].map((permission) => {
                        const Icon = permission.icon
                        return (
                            <div key={permission.level} className="p-4 rounded-lg bg-white/5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${permission.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium capitalize">{permission.level}</span>
                                </div>
                                <p className="text-sm text-gray-400">{permission.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}