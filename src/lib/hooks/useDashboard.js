'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Hook to fetch user's projects
 */
export const useProjects = (userId) => {
    const supabase = createClient()
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchProjects = async () => {
            try {
                const { data, error: err } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })

                if (err) throw err
                setProjects(data || [])
            } catch (err) {
                console.error('Error fetching projects:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [userId, supabase])

    return { projects, loading, error }
}

/**
 * Hook to fetch tasks
 */
export const useTasks = (userId) => {
    const supabase = createClient()
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchTasks = async () => {
            try {
                const { data, error: err } = await supabase
                    .from('tasks')
                    .select(`
                        *,
                        projects (
                            id,
                            name
                        )
                    `)
                    .or(`user_id.eq.${userId},assigned_to.eq.${userId}`)
                    .order('created_at', { ascending: false })

                if (err) throw err
                setTasks(data || [])
            } catch (err) {
                console.error('Error fetching tasks:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchTasks()
    }, [userId, supabase])

    return { tasks, loading, error }
}

/**
 * Hook to fetch documents
 */
export const useDocuments = (userId) => {
    const supabase = createClient()
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchDocuments = async () => {
            try {
                const { data, error: err } = await supabase
                    .from('documents')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })

                if (err) throw err
                setDocuments(data || [])
            } catch (err) {
                console.error('Error fetching documents:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchDocuments()
    }, [userId, supabase])

    return { documents, loading, error }
}

/**
 * Hook to fetch messages/conversations
 */
export const useConversations = (userId) => {
    const supabase = createClient()
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchConversations = async () => {
            try {
                // Get conversations where user is either participant
                const { data, error: err } = await supabase
                    .from('conversations')
                    .select(`
                        *,
                        participant_1:profiles!conversations_participant_1_id_fkey (
                            id,
                            name,
                            avatar
                        ),
                        participant_2:profiles!conversations_participant_2_id_fkey (
                            id,
                            name,
                            avatar
                        ),
                        messages (
                            id,
                            content,
                            created_at,
                            sender_id
                        )
                    `)
                    .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
                    .order('updated_at', { ascending: false })

                if (err) throw err
                setConversations(data || [])
            } catch (err) {
                console.error('Error fetching conversations:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchConversations()

        // Subscribe to real-time updates
        const subscription = supabase
            .channel(`user_messages:${userId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'messages',
                filter: `recipient_id=eq.${userId}`
            }, (payload) => {
                fetchConversations()
            })
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [userId, supabase])

    return { conversations, loading, error }
}

/**
 * Hook to fetch activities
 */
export const useActivities = (userId) => {
    const supabase = createClient()
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchActivities = async () => {
            try {
                const { data, error: err } = await supabase
                    .from('activities')
                    .select(`
                        *,
                        projects (
                            id,
                            name
                        )
                    `)
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })
                    .limit(10)

                if (err) throw err
                setActivities(data || [])
            } catch (err) {
                console.error('Error fetching activities:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchActivities()
    }, [userId, supabase])

    return { activities, loading, error }
}

/**
 * Hook to fetch milestones
 */
export const useMilestones = (userId) => {
    const supabase = createClient()
    const [milestones, setMilestones] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchMilestones = async () => {
            try {
                const { data: userProjects } = await supabase
                    .from('projects')
                    .select('id')
                    .eq('user_id', userId)

                if (!userProjects || userProjects.length === 0) {
                    setMilestones([])
                    setLoading(false)
                    return
                }

                const projectIds = userProjects.map(p => p.id)

                const { data, error: err } = await supabase
                    .from('milestones')
                    .select(`
                        *,
                        projects (
                            id,
                            name
                        )
                    `)
                    .in('project_id', projectIds)
                    .eq('status', 'pending')
                    .order('due_date', { ascending: true })
                    .limit(5)

                if (err) throw err
                setMilestones(data || [])
            } catch (err) {
                console.error('Error fetching milestones:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchMilestones()
    }, [userId, supabase])

    return { milestones, loading, error }
}

/**
 * Hook to fetch team members
 */
export const useTeamMembers = (projectId) => {
    const supabase = createClient()
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!projectId) {
            setLoading(false)
            return
        }

        const fetchMembers = async () => {
            try {
                const { data, error: err } = await supabase
                    .from('team_members')
                    .select(`
                        *,
                        user:profiles (
                            id,
                            name,
                            email,
                            avatar
                        )
                    `)
                    .eq('project_id', projectId)

                if (err) throw err
                setMembers(data || [])
            } catch (err) {
                console.error('Error fetching team members:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchMembers()
    }, [projectId, supabase])

    return { members, loading, error }
}

/**
 * Hook to fetch analytics data
 */
export const useAnalytics = (userId) => {
    const supabase = createClient()
    const [analytics, setAnalytics] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchAnalytics = async () => {
            try {
                const { data: projects } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('user_id', userId)

                if (projects) {
                    const active = projects.filter(p => p.status === 'active').length
                    const completed = projects.filter(p => p.status === 'completed').length
                    const pending = projects.reduce((acc, p) => acc + (p.pending_tasks || 0), 0)

                    setAnalytics({
                        totalProjects: projects.length,
                        activeProjects: active,
                        completedProjects: completed,
                        pendingTasks: pending,
                        onTimeDelivery: 95,
                        clientSatisfaction: 98,
                        taskCompletion: 87
                    })
                }
            } catch (err) {
                console.error('Error fetching analytics:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [userId, supabase])

    return { analytics, loading, error }
}
