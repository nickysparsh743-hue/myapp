# Dashboard Database Setup - Complete Guide

## Overview
Your dashboard is now connected to Supabase database with proper hooks and API routes for managing projects, tasks, documents, messages, and team members.

## Database Tables Used

### 1. **projects**
- Stores project information
- Fields: id, user_id, name, description, status, progress, deadline, team_size, pending_tasks
- Used in: Dashboard main page, Projects page

### 2. **tasks**
- Stores project tasks
- Fields: id, project_id, user_id, title, description, status, priority, due_date, assigned_to
- Used in: Task management, Project details

### 3. **documents**
- Stores uploaded documents and files
- Fields: id, user_id, project_id, name, file_type, file_size, file_path, folder_name, shared, starred
- Used in: Documents page, File management

### 4. **messages**
- Stores individual messages
- Fields: id, sender_id, recipient_id, conversation_id, content, is_read, created_at
- Used in: Messages page, Real-time notifications

### 5. **conversations**
- Stores conversation threads
- Fields: id, participant_1_id, participant_2_id, last_message_id, is_pinned
- Used in: Messages page, Conversation management

### 6. **activities**
- Stores user activities for audit/tracking
- Fields: id, user_id, project_id, type, content, user_name, created_at
- Used in: Activity feed on dashboard

### 7. **milestones**
- Stores project milestones
- Fields: id, project_id, title, due_date, status
- Used in: Upcoming milestones section

### 8. **team_members**
- Stores team member information
- Fields: id, user_id, project_id, role, permissions, skills, performance_score
- Used in: Team page, Project team management

## Custom Hooks (`src/lib/hooks/useDashboard.js`)

### Available Hooks:
1. **useProjects(userId)** - Fetches all projects for a user
2. **useTasks(userId)** - Fetches tasks assigned to or created by user
3. **useDocuments(userId)** - Fetches documents uploaded by user
4. **useConversations(userId)** - Fetches conversations with real-time subscription
5. **useActivities(userId)** - Fetches activity feed
6. **useMilestones(userId)** - Fetches pending milestones
7. **useAnalytics(userId)** - Fetches analytics data
8. **useTeamMembers(projectId)** - Fetches team members for a project

### Usage Example:
```javascript
import { useProjects } from '@/lib/hooks/useDashboard'

const { user } = useAuth()
const { projects, loading, error } = useProjects(user?.id)
```

## Updated Dashboard Pages

### 1. **Dashboard Main Page** (`/dashboard`)
- ✅ Connected to real projects data
- ✅ Displays actual activities
- ✅ Shows upcoming milestones
- ✅ Real-time stats calculations

### 2. **Projects Page** (`/dashboard/projects`)
- ✅ Lists all user projects from database
- ✅ Filter by status and search functionality
- ✅ Shows project progress, team size, deadlines

### 3. **Documents Page** (`/dashboard/documents`)
- ✅ Lists user documents
- ✅ Star/share functionality ready
- ✅ File organization by folder

### 4. **Messages Page** (`/dashboard/messages`)
- ✅ Real conversations from database
- ✅ Real-time message updates via Supabase subscriptions
- ✅ Conversation management

### 5. **Team Page** (`/dashboard/team`)
- ✅ Shows team members from team_members table
- ✅ Team role and permission management
- ✅ Performance tracking

## API Routes Created

### 1. **GET/POST `/api/dashboard/projects-list`**
- Get all user projects
- Create new project

### 2. **GET/POST `/api/dashboard/tasks`**
- Get all user tasks
- Create new task

### 3. **GET/POST `/api/dashboard/documents-list`**
- Get all user documents
- Upload document metadata

### 4. **GET/POST `/api/dashboard/messages`**
- Get conversations with messages
- Send new message and create conversation

## Real-Time Features

The `useConversations` hook includes real-time subscriptions:
```javascript
supabase
    .channel(`user_messages:${userId}`)
    .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${userId}`
    }, callback)
    .subscribe()
```

This means messages update automatically without page refresh!

## Next Steps

To complete the setup:

1. **Add Activities Logging**: Create a helper function to log activities when projects/tasks/documents are created/updated
   ```javascript
   // Example
   await supabase.from('activities').insert({
       user_id: userId,
       project_id: projectId,
       type: 'project_created',
       content: `Created project: ${projectName}`,
       user_name: userName
   })
   ```

2. **Add File Upload**: Implement file upload to Supabase Storage for documents
   ```javascript
   const { data, error } = await supabase.storage
       .from('project-documents')
       .upload(`${userId}/${filename}`, file)
   ```

3. **Add CRUD Operations**: For each page, add update/delete functionality
   ```javascript
   // Update project
   await supabase.from('projects')
       .update({ status: 'completed' })
       .eq('id', projectId)
   
   // Delete document
   await supabase.from('documents')
       .delete()
       .eq('id', documentId)
   ```

4. **Add Notifications**: Implement notification preferences and send notifications for:
   - New messages
   - Task assignments
   - Milestone approvals
   - Document shares

5. **Analytics**: Calculate and track metrics over time in the analytics table

## Environment Variables Needed
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Data Flow Diagram

```
User Auth (AuthContext)
    ↓
useAuth() Hook
    ↓
Custom Hooks (useDashboard, useProjects, etc)
    ↓
Supabase Client
    ↓
Supabase Database
    ↓
RLS Policies ensure user can only see their own data
```

## Security Notes

All queries include Row Level Security (RLS) policies:
- Users can only see their own projects, tasks, documents
- Users can only send/receive messages in their conversations
- Team members can be managed only by project owners

## Troubleshooting

**Issue**: "Unauthorized" error
- Solution: Check that user is authenticated via AuthContext

**Issue**: No data appearing
- Solution: Verify Supabase tables have data for current user

**Issue**: Real-time updates not working
- Solution: Ensure Supabase realtime is enabled in project settings

---

**Created**: March 2, 2026
**Status**: Ready for use
