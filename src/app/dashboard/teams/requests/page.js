'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Search, Filter, Check, X, Clock,
    User, Calendar, AlertCircle, Plus, Trash2
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import MemberDetailsForm from '@/components/MemberDetailsForm'

export default function TeamRequestsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [activeTab, setActiveTab] = useState('outgoing') // 'outgoing' or 'incoming'
    const [outgoingRequests, setOutgoingRequests] = useState([])
    const [incomingRequests, setIncomingRequests] = useState([])
    const [availableTeams, setAvailableTeams] = useState([])
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [showBrowseTeams, setShowBrowseTeams] = useState(false)
    const [showDetailsForm, setShowDetailsForm] = useState(false)
    const [pendingTeam, setPendingTeam] = useState(null)
    const [pendingMember, setPendingMember] = useState(null)

    useEffect(() => {
        fetchRequests()
        checkPendingProfileCompletion()
    }, [user])

    const fetchRequests = async () => {
        if (!user) return

        try {
            setLoading(true)
            setError(null)

            // Fetch outgoing requests (requests user has made)
            const { data: outgoing, error: outgoingError } = await supabase
                .from('team_requests')
                .select(`
                    *,
                    team:team_id (id, name, specialization, member_count, capacity),
                    requested_by:requested_by_id (id, name, avatar)
                `)
                .eq('requested_by_id', user.id)
                .order('created_at', { ascending: false })

            if (outgoingError) throw outgoingError

            // Fetch incoming requests (requests to teams user leads)
            const { data: incoming, error: incomingError } = await supabase
                .from('team_requests')
                .select(`
                    *,
                    team:team_id (id, name, specialization, member_count, capacity, lead_id),
                    requested_by:requested_by_id (id, name, avatar, email, role)
                `)
                .eq('status', 'pending')

            if (incomingError) throw incomingError

            // Filter incoming to only show requests for teams user leads
            const { data: userTeams } = await supabase
                .from('teams')
                .select('id')
                .eq('lead_id', user.id)

            const userTeamIds = userTeams?.map(t => t.id) || []
            const filteredIncoming = incoming?.filter(req =>
                userTeamIds.includes(req.team_id)
            ) || []

            setOutgoingRequests(outgoing || [])
            setIncomingRequests(filteredIncoming)

            // Fetch available teams for browsing
            const { data: teams, error: teamsError } = await supabase
                .from('teams')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false })

            if (teamsError) throw teamsError
            setAvailableTeams(teams || [])
        } catch (err) {
            console.error('Error fetching requests:', err)
            setError(err.message || 'Failed to load requests')
        } finally {
            setLoading(false)
        }
    }

    const checkPendingProfileCompletion = async () => {
        if (!user) return

        try {
            // Check if user has any team_members entries that need profile completion
            const { data: memberData, error: memberError } = await supabase
                .from('team_members')
                .select(`
                    id,
                    team_id,
                    profile_completed,
                    team:team_id (id, name)
                `)
                .eq('user_id', user.id)
                .eq('profile_completed', false)
                .single()

            if (memberError && memberError.code !== 'PGRST116') {
                console.error('Error checking profile:', memberError)
                return
            }

            if (memberData) {
                // User has a pending profile to complete
                setPendingMember(memberData)
                setPendingTeam(memberData.team)
                setShowDetailsForm(true)
            }
        } catch (err) {
            console.error('Error checking pending profile:', err)
        }
    }

    const handleRequestToJoin = async (teamId) => {
        try {
            setError(null)

            // Check if already requested
            const { data: existing } = await supabase
                .from('team_requests')
                .select('id')
                .eq('team_id', teamId)
                .eq('requested_by_id', user.id)
                .in('status', ['pending', 'approved'])

            if (existing && existing.length > 0) {
                setError('You have already requested or joined this team')
                return
            }

            // Create request
            const { error: createError } = await supabase
                .from('team_requests')
                .insert([{
                    team_id: teamId,
                    requested_by_id: user.id,
                    status: 'pending'
                }])

            if (createError) throw createError

            setSuccess('Request sent successfully!')
            setShowBrowseTeams(false)
            fetchRequests()
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error requesting to join team:', err)
            setError(err.message || 'Failed to send request')
        }
    }

    const handleApproveRequest = async (requestId, teamId, userId) => {
        try {
            setError(null)

            // Approve request
            const { error: approveError } = await supabase
                .from('team_requests')
                .update({ status: 'approved', approved_at: new Date().toISOString() })
                .eq('id', requestId)

            if (approveError) throw approveError

            // Add user to team_members
            const { error: addMemberError } = await supabase
                .from('team_members')
                .insert([{
                    team_id: teamId,
                    user_id: userId,
                    role: 'member'
                }])

            if (addMemberError && addMemberError.code !== '23505') { // 23505 = unique constraint
                throw addMemberError
            }

            // Update team member count
            const { data: members } = await supabase
                .from('team_members')
                .select('id')
                .eq('team_id', teamId)

            await supabase
                .from('teams')
                .update({ member_count: members?.length || 0 })
                .eq('id', teamId)

            setSuccess('Request approved!')
            fetchRequests()
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error approving request:', err)
            setError(err.message || 'Failed to approve request')
        }
    }

    const handleRejectRequest = async (requestId) => {
        try {
            setError(null)

            const { error: rejectError } = await supabase
                .from('team_requests')
                .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
                .eq('id', requestId)

            if (rejectError) throw rejectError

            setSuccess('Request rejected')
            fetchRequests()
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error rejecting request:', err)
            setError(err.message || 'Failed to reject request')
        }
    }

    const handleCancelRequest = async (requestId) => {
        if (!confirm('Cancel this request?')) return

        try {
            setError(null)

            const { error: cancelError } = await supabase
                .from('team_requests')
                .delete()
                .eq('id', requestId)

            if (cancelError) throw cancelError

            setSuccess('Request cancelled')
            fetchRequests()
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error cancelling request:', err)
            setError(err.message || 'Failed to cancel request')
        }
    }

    const filterRequestsByStatus = (requests) => {
        if (filterStatus === 'all') return requests
        return requests.filter(r => r.status === filterStatus)
    }

    const filteredOutgoing = filterRequestsByStatus(outgoingRequests)
    const filteredIncoming = filterRequestsByStatus(incomingRequests)

    const getTeamsNotRequested = () => {
        const requestedTeamIds = new Set(outgoingRequests.map(r => r.team_id))
        return availableTeams.filter(t => !requestedTeamIds.has(t.id))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading requests...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Team Requests</h1>
                    <p className="text-gray-400">Manage join requests and team memberships</p>
                </div>
                <button
                    onClick={() => setShowBrowseTeams(true)}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity flex items-center gap-2 w-fit"
                >
                    <Plus className="w-5 h-5" /> Browse Teams
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
                    <Check className="w-5 h-5" />
                    {success}
                </div>
            )}

            {/* Tabs */}
            <div className="glass-effect rounded-2xl p-4 border border-white/10 inline-flex gap-2">
                <button
                    onClick={() => setActiveTab('outgoing')}
                    className={`px-6 py-2 rounded-lg transition-colors ${
                        activeTab === 'outgoing'
                            ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold'
                            : 'text-gray-300 hover:bg-white/10'
                    }`}
                >
                    My Requests ({outgoingRequests.length})
                </button>
                <button
                    onClick={() => setActiveTab('incoming')}
                    className={`px-6 py-2 rounded-lg transition-colors ${
                        activeTab === 'incoming'
                            ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold'
                            : 'text-gray-300 hover:bg-white/10'
                    }`}
                >
                    Pending Approvals ({incomingRequests.length})
                </button>
            </div>

            {/* Outgoing Requests */}
            {activeTab === 'outgoing' && (
                <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-green"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {filteredOutgoing.length === 0 ? (
                        <div className="text-center py-12 glass-effect rounded-2xl border border-white/10">
                            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No requests found</p>
                            <p className="text-gray-500 text-sm">Request to join teams to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredOutgoing.map(request => (
                                <div key={request.id} className="glass-effect rounded-2xl p-6 border border-white/10">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold">{request.team?.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    request.status === 'pending'
                                                        ? 'bg-yellow-500/20 text-yellow-400'
                                                        : request.status === 'approved'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-3">{request.team?.specialization}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(request.created_at).toLocaleDateString()}
                                                </span>
                                                <span>{request.team?.member_count}/{request.team?.capacity} members</span>
                                            </div>
                                        </div>
                                        {request.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancelRequest(request.id)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Incoming Requests */}
            {activeTab === 'incoming' && (
                <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-green"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {filteredIncoming.length === 0 ? (
                        <div className="text-center py-12 glass-effect rounded-2xl border border-white/10">
                            <Check className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No pending requests</p>
                            <p className="text-gray-500 text-sm">All requests are up to date</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredIncoming.map(request => (
                                <div key={request.id} className="glass-effect rounded-2xl p-6 border border-white/10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold mb-1">{request.team?.name}</h3>
                                            <p className="text-gray-400 text-sm">{request.team?.specialization}</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400">
                                            Pending
                                        </span>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center text-dark text-sm font-bold">
                                                {request.requested_by?.name?.charAt(0) || '?'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold">{request.requested_by?.name}</p>
                                                <p className="text-xs text-gray-500">{request.requested_by?.email}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">{request.requested_by?.role || 'Developer'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <Calendar className="w-4 h-4" />
                                        Requested {new Date(request.created_at).toLocaleDateString()}
                                    </div>

                                    {request.status === 'pending' && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleRejectRequest(request.id)}
                                                className="flex-1 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <X className="w-4 h-4" /> Reject
                                            </button>
                                            <button
                                                onClick={() => handleApproveRequest(request.id, request.team_id, request.requested_by_id)}
                                                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-400 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                            >
                                                <Check className="w-4 h-4" /> Approve
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Browse Teams Modal */}
            {showBrowseTeams && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark rounded-2xl border border-white/10 max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6 sticky top-0 bg-dark pb-4 border-b border-white/10">
                            <h2 className="text-2xl font-bold">Browse Teams</h2>
                            <button
                                onClick={() => setShowBrowseTeams(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {getTeamsNotRequested().length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-400">You've requested all available teams</p>
                                </div>
                            ) : (
                                getTeamsNotRequested().map(team => (
                                    <div key={team.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-neon-green/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-bold mb-1">{team.name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="px-2 py-1 bg-neon-green/20 text-neon-green rounded text-xs font-bold">
                                                        {team.specialization}
                                                    </span>
                                                    <span>{team.member_count}/{team.capacity} members</span>
                                                </div>
                                                {team.description && <p className="text-gray-400 text-sm mt-2">{team.description}</p>}
                                            </div>
                                            <button
                                                onClick={() => handleRequestToJoin(team.id)}
                                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity whitespace-nowrap ml-4"
                                            >
                                                Request Join
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Member Details Form Modal */}
            {showDetailsForm && pendingTeam && pendingMember && (
                <MemberDetailsForm
                    member={pendingMember}
                    teamName={pendingTeam.name}
                    onComplete={() => {
                        setShowDetailsForm(false)
                        checkPendingProfileCompletion()
                    }}
                    onClose={() => setShowDetailsForm(false)}
                />
            )}
        </div>
    )
}
