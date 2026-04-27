'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, AlertCircle, Check } from 'lucide-react'
import Link from 'next/link'

export default function EditProjectPage() {
    const router = useRouter()
    const params = useParams()
    const projectId = params.id
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [project, setProject] = useState({
        name: '',
        description: '',
        status: 'active',
        progress: 0,
        priority: 'medium',
        budget: '',
        team: 0,
        startDate: '',
        endDate: ''
    })

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/dashboard/projects/${projectId}`)
                if (!response.ok) throw new Error('Failed to fetch project')
                const data = await response.json()
                setProject(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (projectId) {
            fetchProject()
        }
    }, [projectId])

    const handleInputChange = (field, value) => {
        setProject(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        setMessage(null)
        try {
            const response = await fetch(`/api/dashboard/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(project)
            })

            if (!response.ok) throw new Error('Failed to update project')

            setMessage({ type: 'success', text: 'Project updated successfully' })
            setTimeout(() => {
                router.push('/dashboard/projects')
            }, 1500)
        } catch (err) {
            setError(err.message)
            setMessage({ type: 'error', text: err.message })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading project...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/projects"
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Project</h1>
                        <p className="text-gray-400 text-sm">Update project details and settings</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Messages */}
            {message && (
                <div className={`px-6 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'} flex items-center gap-2`}>
                    {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            {/* Form */}
            <div className="glass-effect rounded-2xl border border-white/10 p-8 space-y-6">
                {/* Basic Info */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Project Name</label>
                            <input
                                type="text"
                                value={project.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                placeholder="Enter project name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Description</label>
                            <textarea
                                value={project.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none resize-none"
                                placeholder="Enter project description"
                            />
                        </div>
                    </div>
                </div>

                {/* Project Details */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Project Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Status</label>
                            <select
                                value={project.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                            >
                                <option value="planning">Planning</option>
                                <option value="active">Active</option>
                                <option value="review">Review</option>
                                <option value="completed">Completed</option>
                                <option value="on-hold">On Hold</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Priority</label>
                            <select
                                value={project.priority}
                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Progress (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={project.progress}
                                onChange={(e) => handleInputChange('progress', Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Team Members</label>
                            <input
                                type="number"
                                min="0"
                                value={project.team}
                                onChange={(e) => handleInputChange('team', Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Budget</label>
                            <input
                                type="text"
                                value={project.budget}
                                onChange={(e) => handleInputChange('budget', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                placeholder="e.g., $25,000"
                            />
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Timeline</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={project.startDate}
                                onChange={(e) => handleInputChange('startDate', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">End Date</label>
                            <input
                                type="date"
                                value={project.endDate}
                                onChange={(e) => handleInputChange('endDate', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <Link
                    href="/dashboard/projects"
                    className="flex-1 px-6 py-3 rounded-lg border border-white/10 hover:border-gray-400 transition-colors text-center font-semibold"
                >
                    Cancel
                </Link>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    )
}
