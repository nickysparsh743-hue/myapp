import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

/**
 * Log an activity to the activities table
 */
export const logActivity = async (userId, type, content, projectId = null, userName = null) => {
    try {
        const { data, error } = await supabase
            .from('activities')
            .insert([
                {
                    user_id: userId,
                    type,
                    content,
                    project_id: projectId,
                    user_name: userName || 'User'
                }
            ])
            .select()

        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Error logging activity:', error)
        throw error
    }
}

/**
 * Update project progress
 */
export const updateProjectProgress = async (projectId, progress) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .update({ progress })
            .eq('id', projectId)
            .select()

        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Error updating project progress:', error)
        throw error
    }
}

/**
 * Update project status
 */
export const updateProjectStatus = async (projectId, status) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .update({ status })
            .eq('id', projectId)
            .select()

        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Error updating project status:', error)
        throw error
    }
}

/**
 * Delete a project
 */
export const deleteProject = async (projectId) => {
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error deleting project:', error)
        throw error
    }
}

/**
 * Create a new project
 */
export const createProject = async (userId, projectData) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([
                {
                    user_id: userId,
                    name: projectData.name,
                    description: projectData.description || null,
                    status: projectData.status || 'active',
                    progress: projectData.progress || 0,
                    deadline: projectData.deadline || null,
                    due_date: projectData.due_date || projectData.deadline || null,
                    team_size: projectData.team_size || 1,
                    pending_tasks: projectData.pending_tasks || 0,
                    // New fields from form
                    category: projectData.category || null,
                    start_date: projectData.startDate || null,
                    budget: projectData.budget ? parseFloat(projectData.budget) : null,
                    priority: projectData.priority || 'medium',
                    requirements: projectData.requirements || null
                }
            ])
            .select()

        if (error) throw error
        
        // Log activity
        await logActivity(
            userId,
            'project_created',
            `Created project: ${projectData.name}`,
            data[0].id
        )

        return data[0]
    } catch (error) {
        console.error('Error creating project:', error)
        throw error
    }
}

/**
 * Create a new task
 */
export const createTask = async (userId, taskData) => {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .insert([
                {
                    user_id: userId,
                    project_id: taskData.project_id,
                    title: taskData.title,
                    description: taskData.description,
                    status: taskData.status || 'pending',
                    priority: taskData.priority || 'medium',
                    due_date: taskData.due_date,
                    assigned_to: taskData.assigned_to
                }
            ])
            .select()

        if (error) throw error
        
        // Log activity
        await logActivity(
            userId,
            'task_created',
            `Created task: ${taskData.title}`,
            taskData.project_id
        )

        return data[0]
    } catch (error) {
        console.error('Error creating task:', error)
        throw error
    }
}

/**
 * Update task status
 */
export const updateTaskStatus = async (taskId, status) => {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({ status })
            .eq('id', taskId)
            .select()

        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Error updating task status:', error)
        throw error
    }
}

/**
 * Delete a task
 */
export const deleteTask = async (taskId) => {
    try {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error deleting task:', error)
        throw error
    }
}

/**
 * Add team member to project
 */
export const addTeamMember = async (userId, projectId, role = 'developer') => {
    try {
        const { data, error } = await supabase
            .from('team_members')
            .insert([
                {
                    user_id: userId,
                    project_id: projectId,
                    role,
                    permissions: role
                }
            ])
            .select()

        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Error adding team member:', error)
        throw error
    }
}

/**
 * Remove team member from project
 */
export const removeTeamMember = async (memberId) => {
    try {
        const { error } = await supabase
            .from('team_members')
            .delete()
            .eq('id', memberId)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error removing team member:', error)
        throw error
    }
}

/**
 * Create a milestone
 */
export const createMilestone = async (projectId, title, dueDate) => {
    try {
        const { data, error } = await supabase
            .from('milestones')
            .insert([
                {
                    project_id: projectId,
                    title,
                    due_date: dueDate,
                    status: 'pending'
                }
            ])
            .select()

        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Error creating milestone:', error)
        throw error
    }
}

/**
 * Update milestone status
 */
export const updateMilestoneStatus = async (milestoneId, status) => {
    try {
        const { data, error } = await supabase
            .from('milestones')
            .update({ status })
            .eq('id', milestoneId)
            .select()

        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Error updating milestone:', error)
        throw error
    }
}

/**
 * Star/unstar a document
 */
export const toggleDocumentStar = async (documentId, starred) => {
    try {
        const { data, error } = await supabase
            .from('documents')
            .update({ starred: !starred })
            .eq('id', documentId)
            .select()

        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Error toggling document star:', error)
        throw error
    }
}

/**
 * Share/unshare a document
 */
export const toggleDocumentShare = async (documentId, shared) => {
    try {
        const { data, error } = await supabase
            .from('documents')
            .update({ shared: !shared })
            .eq('id', documentId)
            .select()

        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Error toggling document share:', error)
        throw error
    }
}

/**
 * Mark message as read
 */
export const markMessageAsRead = async (messageId) => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('id', messageId)
            .select()

        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Error marking message as read:', error)
        throw error
    }
}

/**
 * Pin/unpin conversation
 */
export const toggleConversationPin = async (conversationId, isPinned) => {
    try {
        const { data, error } = await supabase
            .from('conversations')
            .update({ is_pinned: !isPinned })
            .eq('id', conversationId)
            .select()

        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Error toggling conversation pin:', error)
        throw error
    }
}

export default {
    logActivity,
    updateProjectProgress,
    updateProjectStatus,
    deleteProject,
    createProject,
    createTask,
    updateTaskStatus,
    deleteTask,
    addTeamMember,
    removeTeamMember,
    createMilestone,
    updateMilestoneStatus,
    toggleDocumentStar,
    toggleDocumentShare,
    markMessageAsRead,
    toggleConversationPin
}
