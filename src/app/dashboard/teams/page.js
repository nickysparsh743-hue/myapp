'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Search, Filter, UserPlus, Settings, Trash2,
    Crown, Shield, Plus, Edit, X, Check,
    Users, TrendingUp, Award, Calendar, AlertCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export default function TeamsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    const [teams, setTeams] = useState([])
    const [filteredTeams, setFilteredTeams] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [search, setSearch] = useState('')
    const [filterSpecialization, setFilterSpecialization] = useState('all')
    const [view, setView] = useState('grid')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState(null)
    const [showMembersModal, setShowMembersModal] = useState(false)

    const specializations = [
        'Web Development',
        'Mobile Apps',
        'AI & ML Solutions',
        'Data Analytics',
        'Cybersecurity',
        'Bots & Automation',
        'Graphics & UI/UX',
        'Writing Services',
        'Database Services'
    ]

    // New team form
    const [newTeam, setNewTeam] = useState({
        name: '',
        description: '',
        specialization: '',
        capacity: 10
    })

    // Fetch teams
    useEffect(() => {
        fetchTeams()
    }, [user])

    const fetchTeams = async () => {
        if (!user) return

        try {
            setLoading(true)
            setError(null)

            const { data, error: fetchError } = await supabase
                .from('teams')
                .select(`
                    *,
                    lead:lead_id (id, name, avatar),
                    team_members (id, user_id, profiles:user_id (id, name, avatar, role))
                `)
                .order('created_at', { ascending: false })

            if (fetchError) throw fetchError

            setTeams(data || [])
            filterTeams(data || [], search, filterSpecialization)
        } catch (err) {
            console.error('Error fetching teams:', err)
            setError(err.message || 'Failed to load teams')
        } finally {
            setLoading(false)
        }
    }

    const filterTeams = (teamsData, searchTerm, specialization) => {
        let filtered = teamsData

        if (specialization !== 'all') {
            filtered = filtered.filter(t => t.specialization === specialization)
        }

        if (searchTerm) {
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredTeams(filtered)
    }

    const handleSearch = (value) => {
        setSearch(value)
        filterTeams(teams, value, filterSpecialization)
    }

    const handleFilterSpecialization = (value) => {
        setFilterSpecialization(value)
        filterTeams(teams, search, value)
    }

    const handleCreateTeam = async () => {
        if (!newTeam.name || !newTeam.specialization) {
            setError('Team name and specialization are required')
            return
        }

        try {
            setError(null)
            const { data, error: createError } = await supabase
                .from('teams')
                .insert([{
                    name: newTeam.name,
                    description: newTeam.description,
                    specialization: newTeam.specialization,
                    capacity: newTeam.capacity,
                    lead_id: user.id,
                    member_count: 1,
                    status: 'active'
                }])
                .select()

            if (createError) throw createError

            // Add creator as team member
            await supabase
                .from('team_members')
                .insert([{
                    team_id: data[0].id,
                    user_id: user.id,
                    role: 'lead'
                }])

            setSuccess('Team created successfully!')
            setNewTeam({ name: '', description: '', specialization: '', capacity: 10 })
            setShowCreateModal(false)
            fetchTeams()
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error creating team:', err)
            setError(err.message || 'Failed to create team')
        }
    }

    const handleDeleteTeam = async (teamId) => {
        if (!confirm('Are you sure? This will delete the team and all its associations.')) return

        try {
            const { error: deleteError } = await supabase
                .from('teams')
                .delete()
                .eq('id', teamId)

            if (deleteError) throw deleteError

            setSuccess('Team deleted successfully!')
            fetchTeams()
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error deleting team:', err)
            setError(err.message || 'Failed to delete team')
        }
    }

    const handleRemoveMember = async (teamId, memberId) => {
        if (!confirm('Remove this member from the team?')) return

        try {
            const { error: removeError } = await supabase
                .from('team_members')
                .delete()
                .eq('team_id', teamId)
                .eq('user_id', memberId)

            if (removeError) throw removeError

            // Update member count
            const { data: members } = await supabase
                .from('team_members')
                .select('id')
                .eq('team_id', teamId)

            await supabase
                .from('teams')
                .update({ member_count: members?.length || 0 })
                .eq('id', teamId)

            setSuccess('Member removed successfully!')
            fetchTeams()
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error removing member:', err)
            setError(err.message || 'Failed to remove member')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading teams...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Teams</h1>
                    <p className="text-gray-400">Manage and organize your teams by specialization</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push('/dashboard/teams/requests')}
                        className="px-6 py-3 rounded-lg border border-neon-green/30 text-neon-green font-bold hover:bg-neon-green/10 transition-colors flex items-center gap-2 w-fit"
                    >
                        <Users className="w-5 h-5" /> Join Requests
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity flex items-center gap-2 w-fit"
                    >
                        <Plus className="w-5 h-5" /> Create Team
                    </button>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    {success}
                </div>
            )}

            {/* Filters & Search */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search teams..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full bg-dark-darker border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                            />
                        </div>
                    </div>
                    <select
                        value={filterSpecialization}
                        onChange={(e) => handleFilterSpecialization(e.target.value)}
                        className="bg-dark-darker border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green min-w-[200px]"
                    >
                        <option value="all">All Specializations</option>
                        {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setView('grid')}
                            className={`px-4 py-3 rounded-lg transition-colors ${view === 'grid'
                                ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`px-4 py-3 rounded-lg transition-colors ${view === 'list'
                                ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                        >
                            List
                        </button>
                    </div>
                </div>
            </div>

            {/* Teams Grid/List */}
            {filteredTeams.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No teams found</p>
                    <p className="text-gray-500 text-sm">Create a new team to get started</p>
                </div>
            ) : (
                <div className={view === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                    {filteredTeams.map(team => (
                        <div
                            key={team.id}
                            className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-neon-green/30 transition-colors"
                        >
                            {/* Team Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-1">{team.name}</h3>
                                    <span className="inline-block px-3 py-1 bg-neon-green/20 text-neon-green text-xs font-bold rounded-full">
                                        {team.specialization}
                                    </span>
                                </div>
                                {user?.id === team.lead_id && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDeleteTeam(team.id)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Team Description */}
                            {team.description && (
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{team.description}</p>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-y border-white/10">
                                <div>
                                    <p className="text-xs text-gray-500">Members</p>
                                    <p className="text-lg font-bold">{team.member_count || 0}/{team.capacity}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Capacity</p>
                                    <p className="text-lg font-bold">{Math.round(((team.member_count || 0) / team.capacity) * 100)}%</p>
                                </div>
                            </div>

                            {/* Team Lead */}
                            <div className="mb-4 p-3 bg-white/5 rounded-lg">
                                <p className="text-xs text-gray-500 mb-2">Team Lead</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center text-dark text-sm font-bold">
                                        {team.lead?.name?.charAt(0) || '👤'}
                                    </div>
                                    <span className="text-sm font-bold">{team.lead?.name || 'Unknown'}</span>
                                    <Crown className="w-4 h-4 text-neon-green ml-auto" />
                                </div>
                            </div>

                            {/* Members Preview */}
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-2">Members ({team.team_members?.length || 0})</p>
                                <div className="flex flex-wrap gap-2">
                                    {team.team_members?.slice(0, 3).map(member => (
                                        <div
                                            key={member.id}
                                            className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
                                            title={member.profiles?.name}
                                        >
                                            {member.profiles?.name?.charAt(0) || '?'}
                                        </div>
                                    ))}
                                    {(team.team_members?.length || 0) > 3 && (
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 text-xs font-bold">
                                            +{(team.team_members?.length || 0) - 3}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedTeam(team)
                                        setShowMembersModal(true)
                                    }}
                                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Users className="w-4 h-4" /> Members
                                </button>
                                {user?.id === team.lead_id && (
                                    <button
                                        onClick={() => router.push(`/dashboard/teams/${team.id}`)}
                                        className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green/20 to-neon-blue/20 text-neon-green hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <Settings className="w-4 h-4" /> Manage
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Team Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark rounded-2xl border border-white/10 max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Create New Team</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Team Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Frontend Team"
                                    value={newTeam.name}
                                    onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                                    className="w-full bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Specialization *</label>
                                <select
                                    value={newTeam.specialization}
                                    onChange={(e) => setNewTeam({...newTeam, specialization: e.target.value})}
                                    className="w-full bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-green"
                                >
                                    <option value="">Select specialization</option>
                                    {specializations.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Description</label>
                                <textarea
                                    placeholder="What does this team do?"
                                    value={newTeam.description}
                                    onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                                    className="w-full bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Team Capacity</label>
                                <input
                                    type="number"
                                    min="2"
                                    max="50"
                                    value={newTeam.capacity || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '') {
                                            setNewTeam({...newTeam, capacity: ''});
                                        } else {
                                            const num = parseInt(val);
                                            if (!isNaN(num) && num >= 2 && num <= 50) {
                                                setNewTeam({...newTeam, capacity: num});
                                            }
                                        }
                                    }}
                                    className="w-full bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-green"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTeam}
                                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity"
                            >
                                Create Team
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Members Modal */}
            {showMembersModal && selectedTeam && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark rounded-2xl border border-white/10 max-w-md w-full max-h-[80vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6 sticky top-0 bg-dark pb-4 border-b border-white/10">
                            <h2 className="text-2xl font-bold">{selectedTeam.name} Members</h2>
                            <button
                                onClick={() => setShowMembersModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {selectedTeam.team_members?.map(member => (
                                <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center text-dark text-sm font-bold">
                                            {member.profiles?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{member.profiles?.name}</p>
                                            <p className="text-xs text-gray-500">{member.role}</p>
                                        </div>
                                    </div>
                                    {user?.id === selectedTeam.lead_id && member.user_id !== selectedTeam.lead_id && (
                                        <button
                                            onClick={() => handleRemoveMember(selectedTeam.id, member.user_id)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
