'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
    X, UserPlus, Search, Mail, Phone, MapPin, Check, AlertCircle,
    Loader, Copy, CheckCircle, Clock, Filter, Eye, EyeOff
} from 'lucide-react'

export default function ManageTeamPage({ params }) {
    const { user } = useAuth()
    const router = useRouter()
    const supabase = createClient()
    const teamId = params.id

    const [team, setTeam] = useState(null)
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviting, setInviting] = useState(false)
    const [filter, setFilter] = useState('all') // all, completed, pending
    const [selectedMember, setSelectedMember] = useState(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)

    useEffect(() => {
        if (teamId && user) {
            fetchTeamData()
        }
    }, [teamId, user])

    const fetchTeamData = async () => {
        try {
            setLoading(true)
            setError(null)

            const { data: teamData, error: teamError } = await supabase
                .from('teams')
                .select(`
                    *,
                    lead:lead_id (id, name, avatar),
                    team_members (
                        id,
                        user_id,
                        role,
                        joined_at,
                        profile_completed,
                        contact_details,
                        profiles:user_id (id, name, email, avatar)
                    )
                `)
                .eq('id', teamId)
                .single()

            if (teamError) throw teamError

            // Verify user is the team lead
            if (teamData.lead_id !== user.id) {
                setError('You do not have permission to manage this team')
                setLoading(false)
                return
            }

            setTeam(teamData)
            setMembers(teamData.team_members || [])
        } catch (err) {
            console.error('Error fetching team:', err)
            setError(err.message || 'Failed to load team')
        } finally {
            setLoading(false)
        }
    }

    const handleInviteMember = async () => {
        if (!inviteEmail) {
            setError('Email address is required')
            return
        }

        if (!inviteEmail.includes('@')) {
            setError('Please enter a valid email address')
            return
        }

        // Check if already invited
        if (members.some(m => m.profiles?.email === inviteEmail)) {
            setError('This user is already a member of this team')
            return
        }

        setInviting(true)
        setError(null)

        try {
            // Find user by email
            const { data: profiles, error: findError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', inviteEmail)
                .single()

            if (findError && findError.code !== 'PGRST116') {
                throw findError
            }

            if (!profiles) {
                setError('User with this email not found')
                setInviting(false)
                return
            }

            // Add member to team
            const { data: newMember, error: addError } = await supabase
                .from('team_members')
                .insert([{
                    team_id: teamId,
                    user_id: profiles.id,
                    role: 'member',
                    profile_completed: false
                }])
                .select(`
                    *,
                    profiles:user_id (id, name, email, avatar)
                `)

            if (addError) throw addError

            // Update team member count
            const newCount = (members.length || 0) + 1
            await supabase
                .from('teams')
                .update({ member_count: newCount })
                .eq('id', teamId)

            setSuccess(`${inviteEmail} has been invited to the team! They'll receive instructions to complete their profile.`)
            setInviteEmail('')
            setShowInviteModal(false)
            setMembers([...members, newMember[0]])

            setTimeout(() => setSuccess(null), 4000)
        } catch (err) {
            console.error('Error inviting member:', err)
            setError(err.message || 'Failed to invite member')
        } finally {
            setInviting(false)
        }
    }

    const filteredMembers = members.filter(member => {
        if (filter === 'completed') return member.profile_completed
        if (filter === 'pending') return !member.profile_completed
        return true
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading team...</p>
                </div>
            </div>
        )
    }

    if (!team) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 text-lg">{error || 'Team not found'}</p>
                <button
                    onClick={() => router.push('/dashboard/teams')}
                    className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90"
                >
                    Back to Teams
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={() => router.push('/dashboard/teams')}
                            className="text-gray-400 hover:text-gray-200 transition-colors"
                        >
                            ← Back
                        </button>
                        <h1 className="text-3xl font-bold">{team.name}</h1>
                        <span className="px-3 py-1 bg-neon-green/20 text-neon-green text-xs font-bold rounded-full">
                            {team.specialization}
                        </span>
                    </div>
                    <p className="text-gray-400 ml-12">{team.description}</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity flex items-center gap-2 w-fit"
                >
                    <UserPlus className="w-5 h-5" /> Invite Member
                </button>
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
                    <CheckCircle className="w-5 h-5" />
                    {success}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-effect p-6 rounded-2xl border border-white/10">
                    <p className="text-gray-400 text-sm mb-2">Total Members</p>
                    <p className="text-4xl font-bold text-neon-green">{members.length}</p>
                    <p className="text-xs text-gray-500 mt-2">Capacity: {team.capacity}</p>
                </div>
                <div className="glass-effect p-6 rounded-2xl border border-white/10">
                    <p className="text-gray-400 text-sm mb-2">Profile Complete</p>
                    <p className="text-4xl font-bold text-neon-blue">{members.filter(m => m.profile_completed).length}</p>
                    <p className="text-xs text-gray-500 mt-2">Details submitted</p>
                </div>
                <div className="glass-effect p-6 rounded-2xl border border-white/10">
                    <p className="text-gray-400 text-sm mb-2">Pending</p>
                    <p className="text-4xl font-bold text-yellow-400">{members.filter(m => !m.profile_completed).length}</p>
                    <p className="text-xs text-gray-500 mt-2">Awaiting profile</p>
                </div>
                <div className="glass-effect p-6 rounded-2xl border border-white/10">
                    <p className="text-gray-400 text-sm mb-2">Occupancy</p>
                    <p className="text-4xl font-bold text-purple-400">{Math.round((members.length / team.capacity) * 100)}%</p>
                    <p className="text-xs text-gray-500 mt-2">Of capacity</p>
                </div>
            </div>

            {/* Filter */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <label className="text-sm font-bold">Filter Members:</label>
                </div>
                <div className="flex gap-3">
                    {[
                        { id: 'all', label: `All (${members.length})` },
                        { id: 'completed', label: `Completed (${members.filter(m => m.profile_completed).length})` },
                        { id: 'pending', label: `Pending (${members.filter(m => !m.profile_completed).length})` }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filter === f.id
                                    ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Members Table */}
            <div className="glass-effect rounded-2xl border border-white/10 overflow-hidden">
                {filteredMembers.length === 0 ? (
                    <div className="p-12 text-center">
                        <UserPlus className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">
                            {filter === 'pending'
                                ? 'No pending profile submissions'
                                : filter === 'completed'
                                ? 'No completed profiles yet'
                                : 'No members yet. Invite someone to get started!'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-white/10 bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">Member</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">Joined</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredMembers.map(member => (
                                    <tr key={member.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center text-dark text-sm font-bold">
                                                    {member.profiles?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{member.profiles?.name}</p>
                                                    <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-300">{member.profiles?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {member.profile_completed ? (
                                                <div className="flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-green-400" />
                                                    <span className="text-sm text-green-400 font-bold">Completed</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-sm text-yellow-400 font-bold">Pending</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-400">
                                                {new Date(member.joined_at).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedMember(member)
                                                    setShowDetailsModal(true)
                                                }}
                                                className="px-3 py-1 rounded-lg bg-neon-green/20 text-neon-green hover:bg-neon-green/30 transition-colors text-sm font-bold"
                                            >
                                                {member.profile_completed ? 'View' : 'Resend'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-dark to-dark-darker rounded-2xl border border-neon-green/30 max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Invite Member</h2>
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="member@example.com"
                                    onKeyPress={(e) => e.key === 'Enter' && handleInviteMember()}
                                    className="w-full bg-dark-darker border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    User must already have an account in the system
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-red-300 text-sm">{error}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 transition-colors font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInviteMember}
                                disabled={inviting}
                                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {inviting ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Inviting...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        Send Invite
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Member Details Modal */}
            {showDetailsModal && selectedMember && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-dark to-dark-darker rounded-2xl border border-neon-green/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Member Details</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {selectedMember.profile_completed ? (
                            <div className="space-y-6">
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex gap-3">
                                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-green-400">Profile Completed ✓</p>
                                        <p className="text-xs text-green-300 mt-1">
                                            All information has been submitted
                                        </p>
                                    </div>
                                </div>

                                {selectedMember.contact_details && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                            <p className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                                                <Mail className="w-4 h-4" /> Email
                                            </p>
                                            <p className="font-bold text-white">{selectedMember.contact_details.email}</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                            <p className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                                                <Phone className="w-4 h-4" /> Phone
                                            </p>
                                            <p className="font-bold text-white">{selectedMember.contact_details.phone}</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                            <p className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" /> Location
                                            </p>
                                            <p className="font-bold text-white">{selectedMember.contact_details.address}</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                            <p className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> Timezone
                                            </p>
                                            <p className="font-bold text-white">{selectedMember.contact_details.timezone}</p>
                                        </div>
                                        <div className="md:col-span-2 p-4 bg-white/5 rounded-lg border border-white/10">
                                            <p className="text-xs text-gray-500 mb-2">Bio</p>
                                            <p className="text-white text-sm">{selectedMember.contact_details.bio}</p>
                                        </div>
                                        <div className="md:col-span-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-2">Emergency Contact</p>
                                            <p className="font-bold text-white">{selectedMember.contact_details.emergency_contact}</p>
                                            <p className="text-sm text-gray-400 mt-1">{selectedMember.contact_details.emergency_phone}</p>
                                        </div>
                                        <div className="md:col-span-2 p-4 bg-white/5 rounded-lg border border-white/10">
                                            <p className="text-xs text-gray-500 mb-2">Communication Preference</p>
                                            <p className="font-bold text-white capitalize">{selectedMember.contact_details.communication_preference}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-3">
                                    <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-yellow-400">Awaiting Profile Completion</p>
                                        <p className="text-xs text-yellow-300 mt-1">
                                            Member has been invited but hasn't completed their profile yet
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/5 rounded-lg border border-white/10 text-center">
                                    <p className="text-gray-400 mb-4">
                                        Share this unique invite link with the member:
                                    </p>
                                    <div className="p-3 bg-dark rounded-lg border border-white/10 font-mono text-sm text-neon-green break-all mb-4">
                                        {`${window.location.origin}/dashboard/teams/${teamId}/join/${selectedMember.user_id}`}
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `${window.location.origin}/dashboard/teams/${teamId}/join/${selectedMember.user_id}`
                                            )
                                            setSuccess('Invite link copied to clipboard!')
                                            setTimeout(() => setSuccess(null), 2000)
                                        }}
                                        className="px-4 py-2 bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full"
                                    >
                                        <Copy className="w-4 h-4" /> Copy Invite Link
                                    </button>
                                </div>

                                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <p className="text-xs text-blue-300 text-center">
                                        The member can also accept the invitation from the team requests page
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
