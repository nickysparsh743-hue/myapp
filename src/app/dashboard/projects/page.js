'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Search, Filter, Plus, MoreVertical,
    Calendar, Users, BarChart, MessageSquare,
    Clock, CheckCircle, AlertCircle, Download,
    Eye, Edit, Trash2, Share2, Copy, TrendingUp, DollarSign, X, Check
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useProjects } from '@/lib/hooks/useDashboard'

export default function ProjectsPage() {
    const { user } = useAuth()
    const { projects, loading } = useProjects(user?.id)
    const router = useRouter()
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [deleteConfirmation, setDeleteConfirmation] = useState(null)
    const [shareProject, setShareProject] = useState(null)
    const [duplicating, setDuplicating] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [message, setMessage] = useState(null)

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

    const handleDeleteProject = async (projectId) => {
        setDeleting(true)
        try {
            const response = await fetch(`/api/dashboard/projects/${projectId}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                setMessage({ type: 'success', text: 'Project deleted successfully' })
                setDeleteConfirmation(null)
                // Refresh projects list
                setTimeout(() => {
                    router.refresh()
                }, 1000)
            } else {
                setMessage({ type: 'error', text: 'Failed to delete project' })
            }
        } catch (error) {
            console.error('Error deleting project:', error)
            setMessage({ type: 'error', text: 'Error deleting project' })
        } finally {
            setDeleting(false)
        }
    }

    const handleDuplicateProject = async (project) => {
        setDuplicating(true)
        try {
            const response = await fetch('/api/dashboard/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...project,
                    name: `${project.name} (Copy)`,
                    id: undefined,
                    created_at: undefined,
                    updated_at: undefined
                })
            })
            if (response.ok) {
                setMessage({ type: 'success', text: 'Project duplicated successfully' })
                setTimeout(() => {
                    router.refresh()
                }, 1000)
            } else {
                setMessage({ type: 'error', text: 'Failed to duplicate project' })
            }
        } catch (error) {
            console.error('Error duplicating project:', error)
            setMessage({ type: 'error', text: 'Error duplicating project' })
        } finally {
            setDuplicating(false)
        }
    }

    const handleShareProject = (project) => {
        setShareProject(project)
    }

    const copyShareLink = async () => {
        const shareLink = `${window.location.origin}/dashboard/projects/${shareProject.id}`
        try {
            await navigator.clipboard.writeText(shareLink)
            setMessage({ type: 'success', text: 'Link copied to clipboard' })
            setTimeout(() => setShareProject(null), 1000)
        } catch (error) {
            console.error('Error copying link:', error)
            setMessage({ type: 'error', text: 'Failed to copy link' })
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
                                {projects.reduce((sum, project) => sum + (Number(project.team) || 0), 0)}
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
                                {projects.length > 0 ? Math.round(projects.reduce((sum, project) => sum + (Number(project.progress) || 0), 0) / projects.length) : 0}%
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
                                            <Link
                                                href={`/dashboard/projects/${project.id}`}
                                                className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2 block"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </Link>
                                            <Link
                                                href={`/dashboard/projects/${project.id}/edit`}
                                                className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2 block"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit Project
                                            </Link>
                                            <button 
                                                onClick={() => handleShareProject(project)}
                                                className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                <Share2 className="w-4 h-4" />
                                                Share
                                            </button>
                                            <button 
                                                onClick={() => handleDuplicateProject(project)}
                                                disabled={duplicating}
                                                className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50">
                                                <Copy className="w-4 h-4" />
                                                {duplicating ? 'Duplicating...' : 'Duplicate'}
                                            </button>
                                            <button 
                                                onClick={() => setDeleteConfirmation(project)}
                                                className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors text-red-400 flex items-center gap-2">
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
                                        <p>{project.tasks?.completed || 0}/{project.tasks?.total || 0}</p>
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

            {/* Success/Error Message */}
            {message && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'} flex items-center gap-2`}>
                    {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="glass-effect rounded-2xl border border-white/10 p-6 max-w-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-lg bg-red-500/20">
                                <AlertCircle className="w-6 h-6 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold">Delete Project</h3>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete <strong>{deleteConfirmation.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:border-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteProject(deleteConfirmation.id)}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {shareProject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="glass-effect rounded-2xl border border-white/10 p-6 max-w-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Share Project</h3>
                            <button
                                onClick={() => setShareProject(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                            Share this project with others using the link below:
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/projects/${shareProject.id}`}
                                readOnly
                                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                            />
                            <button
                                onClick={copyShareLink}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                                <Copy className="w-4 h-4" />
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}