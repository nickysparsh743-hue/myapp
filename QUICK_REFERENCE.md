# Quick Reference - Dashboard Integration

## Import Statements

```javascript
// In your components
import { useAuth } from '@/contexts/AuthContext'
import { 
    useProjects, 
    useTasks, 
    useDocuments, 
    useConversations,
    useActivities,
    useMilestones,
    useAnalytics,
    useTeamMembers 
} from '@/lib/hooks/useDashboard'

import {
    createProject,
    createTask,
    createMilestone,
    updateProjectProgress,
    updateProjectStatus,
    deleteProject,
    logActivity,
    // ... and many more
} from '@/lib/dashboard-utils'
```

## Hook Usage Examples

### Get Projects
```javascript
const { user } = useAuth()
const { projects, loading, error } = useProjects(user?.id)
```

### Get Tasks
```javascript
const { tasks, loading, error } = useTasks(user?.id)
```

### Get Documents
```javascript
const { documents, loading, error } = useDocuments(user?.id)
```

### Get Conversations (Real-time)
```javascript
const { conversations, loading, error } = useConversations(user?.id)
```

### Get Activities
```javascript
const { activities, loading, error } = useActivities(user?.id)
```

### Get Milestones
```javascript
const { milestones, loading, error } = useMilestones(user?.id)
```

### Get Analytics
```javascript
const { analytics, loading, error } = useAnalytics(user?.id)
```

### Get Team Members for a Project
```javascript
const { members, loading, error } = useTeamMembers(projectId)
```

## Utility Function Examples

### Create Project
```javascript
const project = await createProject(userId, {
    name: 'New Project',
    description: 'Description here',
    deadline: '2026-06-01',
    team_size: 3
})
```

### Create Task
```javascript
const task = await createTask(userId, {
    project_id: projectId,
    title: 'Task Title',
    description: 'Description',
    priority: 'high', // high, medium, low
    due_date: '2026-05-15',
    assigned_to: assigneeUserId
})
```

### Update Project Progress
```javascript
await updateProjectProgress(projectId, 75) // 0-100
```

### Update Project Status
```javascript
await updateProjectStatus(projectId, 'completed')
// Options: active, completed, on-hold, planning, review
```

### Delete Project
```javascript
await deleteProject(projectId)
```

### Create Task
```javascript
const task = await createTask(userId, {
    project_id: projectId,
    title: 'New Task',
    description: 'Description'
})
```

### Update Task Status
```javascript
await updateTaskStatus(taskId, 'completed')
// Options: pending, in-progress, completed, on-hold
```

### Delete Task
```javascript
await deleteTask(taskId)
```

### Create Milestone
```javascript
const milestone = await createMilestone(projectId, 'Phase 1 Complete', '2026-05-01')
```

### Update Milestone Status
```javascript
await updateMilestoneStatus(milestoneId, 'completed')
```

### Add Team Member
```javascript
await addTeamMember(userId, projectId, 'developer')
// Role options: developer, manager, admin
```

### Remove Team Member
```javascript
await removeTeamMember(memberId)
```

### Star Document
```javascript
await toggleDocumentStar(documentId, currentStarState)
```

### Share Document
```javascript
await toggleDocumentShare(documentId, currentSharedState)
```

### Mark Message as Read
```javascript
await markMessageAsRead(messageId)
```

### Pin Conversation
```javascript
await toggleConversationPin(conversationId, currentPinState)
```

### Log Activity
```javascript
await logActivity(userId, 'project_created', 'Created new project', projectId, userName)
```

## API Route Usage

### Call from Client

```javascript
// Get projects
const response = await fetch('/api/dashboard/projects-list')
const projects = await response.json()

// Create project
const response = await fetch('/api/dashboard/projects-list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'New Project',
        description: 'Description'
    })
})
const newProject = await response.json()

// Get tasks
const response = await fetch('/api/dashboard/tasks')
const tasks = await response.json()

// Create task
const response = await fetch('/api/dashboard/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        project_id: projectId,
        title: 'New Task',
        description: 'Description'
    })
})
const newTask = await response.json()
```

## Database Fields Reference

### projects table
```
id, user_id, name, description, status, progress, deadline, 
team_size, pending_tasks, created_at, updated_at
```

### tasks table
```
id, project_id, user_id, title, description, status, priority, 
due_date, assigned_to, created_at, updated_at
```

### documents table
```
id, user_id, project_id, name, file_type, file_size, file_path,
folder_name, shared, starred, uploaded_by, created_at, updated_at
```

### messages table
```
id, sender_id, recipient_id, conversation_id, content, is_read, created_at
```

### conversations table
```
id, participant_1_id, participant_2_id, last_message_id, is_pinned, 
created_at, updated_at
```

### activities table
```
id, user_id, project_id, type, content, user_name, created_at
```

### milestones table
```
id, project_id, title, due_date, status, created_at
```

### team_members table
```
id, user_id, project_id, role, permissions, skills, 
performance_score, joined_at, created_at, updated_at
```

## Common Patterns

### Complete Form Submission
```javascript
const handleCreateProject = async (formData) => {
    try {
        const project = await createProject(user.id, {
            name: formData.name,
            description: formData.description,
            deadline: formData.deadline
        })
        
        // Log activity
        await logActivity(
            user.id,
            'project_created',
            `Created project: ${formData.name}`,
            project.id,
            user.user_metadata?.name
        )
        
        // Refresh or navigate
        window.location.reload()
    } catch (error) {
        console.error('Error:', error)
        alert('Failed to create project')
    }
}
```

### Complete Dashboard Component
```javascript
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useProjects, useActivities } from '@/lib/hooks/useDashboard'

export default function Dashboard() {
    const { user } = useAuth()
    const { projects, loading: projectsLoading } = useProjects(user?.id)
    const { activities, loading: activitiesLoading } = useActivities(user?.id)
    
    const loading = projectsLoading || activitiesLoading
    
    if (loading) return <div>Loading...</div>
    if (!user) return <div>Please sign in</div>
    
    return (
        <div>
            <h1>Welcome, {user.user_metadata?.name}</h1>
            <div>
                <h2>Projects ({projects.length})</h2>
                {projects.map(p => (
                    <div key={p.id}>{p.name}</div>
                ))}
            </div>
            <div>
                <h2>Recent Activity</h2>
                {activities.map(a => (
                    <div key={a.id}>{a.content}</div>
                ))}
            </div>
        </div>
    )
}
```

## Error Handling

All hooks return error state:
```javascript
const { projects, loading, error } = useProjects(user?.id)

if (error) {
    return <div className="error">Error: {error}</div>
}
```

All utilities throw errors that should be caught:
```javascript
try {
    const project = await createProject(userId, data)
} catch (error) {
    console.error('Failed:', error.message)
}
```

---

**Print this out for quick reference!**
