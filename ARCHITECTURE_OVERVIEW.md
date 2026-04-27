# Architecture Overview - Dashboard Database Integration

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Dashboard   │  │  Projects    │  │  Documents   │              │
│  │     Page     │  │     Page     │  │     Page     │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                 │                       │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │      Custom Hooks (useDashboard.js)                      │      │
│  │  useProjects | useTasks | useDocuments |useConversations│      │
│  │  useActivities | useMilestones | useAnalytics           │      │
│  └────────────┬─────────────────────────────────────────────┘      │
│               │                                                      │
└───────────────┼──────────────────────────────────────────────────────┘
                │
        ┌───────▼────────┐
        │ Supabase       │
        │ Client         │
        └───────┬────────┘
                │
┌───────────────┼──────────────────────────────────────────────────────┐
│  API Layer (Next.js Routes)                                          │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ GET/POST /api/dashboard/projects-list                          │  │
│  │ GET/POST /api/dashboard/tasks                                  │  │
│  │ GET/POST /api/dashboard/documents-list                         │  │
│  │ GET/POST /api/dashboard/messages                               │  │
│  └────────────┬───────────────────────────────────────────────────┘  │
└───────────────┼──────────────────────────────────────────────────────┘
                │
        ┌───────▼────────────────┐
        │ Supabase Database      │
        │ (PostgreSQL)           │
        └───────┬────────────────┘
                │
    ┌───────────┴──────────────┬──────────────┬──────────────┐
    │                          │              │              │
┌───▼────┐  ┌──────────┐  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
│Projects│  │  Tasks   │  │Documents│  │Messages  │  │Activities
└────────┘  └──────────┘  └─────────┘  └──────────┘  └─────────┘
```

## Component Hierarchy

```
App (with AuthProvider)
│
├── /dashboard (DashboardPage)
│   ├── useAuth() → get user
│   ├── useProjects() → real projects
│   ├── useActivities() → real activities
│   ├── useMilestones() → real milestones
│   └── Renders:
│       ├── Welcome banner
│       ├── Stats cards
│       ├── Projects list
│       ├── Activities feed
│       └── Milestones
│
├── /dashboard/projects (ProjectsPage)
│   ├── useAuth() → get user
│   ├── useProjects() → all projects
│   └── Shows: Filtered project list with details
│
├── /dashboard/documents (DocumentsPage)
│   ├── useAuth() → get user
│   ├── useDocuments() → all documents
│   └── Shows: File listing with actions
│
├── /dashboard/messages (MessagesPage)
│   ├── useAuth() → get user
│   ├── useConversations() → real-time messages
│   └── Shows: Conversation list + chat interface
│
└── /dashboard/team (TeamPage)
    └── Shows: Team members from database
```

## Database Schema (Simplified)

```
┌─────────────────┐    ┌──────────────┐    ┌────────────────┐
│  auth.users     │    │   profiles   │    │   projects     │
├─────────────────┤    ├──────────────┤    ├────────────────┤
│ id (UUID)       │◄───┤ id (FK)      │    │ id (UUID)      │
│ email           │    │ name         │◄───┤ user_id (FK)   │
│ created_at      │    │ avatar       │    │ name           │
└─────────────────┘    │ role         │    │ status         │
                       │ created_at   │    │ progress       │
                       └──────────────┘    │ deadline       │
                                           └────────────────┘
                                                    │
                        ┌───────────────┬──────────┼──────────┬──────────┐
                        │               │          │          │          │
                   ┌────▼─────┐ ┌──────▼───┐ ┌───▼─────┐ ┌──▼────────┐
                   │   tasks   │ │documents │ │milestones│ │messages   │
                   ├───────────┤ ├──────────┤ ├─────────┤ ├───────────┤
                   │ id        │ │ id       │ │ id      │ │ id        │
                   │ project_id│ │ project_ │ │ project_│ │ sender_id │
                   │ title     │ │ id (FK)  │ │ id (FK) │ │ recipient │
                   │ status    │ │ name     │ │ title   │ │ content   │
                   │ priority  │ │ shared   │ │ due_date│ │ is_read   │
                   └───────────┘ └──────────┘ └─────────┘ └───────────┘
```

## Hook Execution Flow

```
Component Mounts
      │
      ▼
useProjects(userId)
      │
      ├─ Check if userId exists
      │
      ├─ Create Supabase client
      │
      ├─ Execute query:
      │  SELECT * FROM projects
      │  WHERE user_id = userId
      │  ORDER BY created_at DESC
      │
      ├─ Apply RLS Security:
      │  (User can only see own projects)
      │
      ├─ Handle response:
      │  ├─ Success: Set projects state
      │  ├─ Error: Set error state
      │  └─ Always: Set loading = false
      │
      ▼
Component Re-renders with { projects, loading, error }
```

## Real-Time Message Flow

```
User A sends message
      │
      ▼
useConversations subscribes to:
  - postgres_changes on messages table
  - filter: recipient_id = current_user_id
      │
      ▼
Message inserted in database
      │
      ▼
Supabase emits change event
      │
      ▼
Subscription callback triggered
      │
      ▼
Re-fetch conversations
      │
      ▼
Component updates automatically
      │
      ▼
User B sees message instantly ⚡
```

## Security Layers

```
┌──────────────────────────────────────────────┐
│  Layer 1: Authentication (AuthContext)       │
│  - User must be logged in                    │
│  - Session managed by Supabase               │
└──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────┐
│  Layer 2: API Route Authentication           │
│  - All routes check user session             │
│  - Return 401 if not authenticated           │
└──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────┐
│  Layer 3: Row Level Security (RLS)           │
│  - Database enforces user data isolation     │
│  - User only sees own projects/tasks/docs    │
│  - Defined in database policies              │
└──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────┐
│  Layer 4: Input Validation                   │
│  - API routes validate incoming data         │
│  - Prevent injection attacks                 │
│  - Type checking on all inputs               │
└──────────────────────────────────────────────┘
```

## Utility Functions Organization

```
dashboard-utils.js
│
├── Project Operations
│   ├── createProject()
│   ├── updateProjectProgress()
│   ├── updateProjectStatus()
│   └── deleteProject()
│
├── Task Operations
│   ├── createTask()
│   ├── updateTaskStatus()
│   └── deleteTask()
│
├── Team Operations
│   ├── addTeamMember()
│   └── removeTeamMember()
│
├── Milestone Operations
│   ├── createMilestone()
│   └── updateMilestoneStatus()
│
├── Document Operations
│   ├── toggleDocumentStar()
│   └── toggleDocumentShare()
│
├── Message Operations
│   ├── markMessageAsRead()
│   └── toggleConversationPin()
│
└── Activity Operations
    └── logActivity()
```

## API Route Structure

```
/api/dashboard/
│
├── projects-list/
│   └── route.js
│       ├── GET → List all projects
│       └── POST → Create new project
│
├── tasks/
│   └── route.js
│       ├── GET → List all tasks
│       └── POST → Create new task
│
├── documents-list/
│   └── route.js
│       ├── GET → List all documents
│       └── POST → Create document entry
│
└── messages/
    └── route.js
        ├── GET → Get conversations
        └── POST → Send message/Create conversation
```

## Error Handling Flow

```
User Action
      │
      ▼
Try to fetch data
      │
      ├─ Success
      │  └─ Set data, loading=false
      │
      └─ Error
         ├─ Log error to console
         ├─ Set error state
         ├─ Set loading=false
         └─ Component shows error UI
```

## Performance Considerations

```
Optimization Techniques Used:
│
├── Custom Hooks
│   └─ Prevents re-fetching same data
│
├── Real-Time Subscriptions
│   └─ Only for critical updates (messages)
│
├── Database Indexes
│   └─ Indexes on: user_id, status, created_at
│
├── Error Boundaries
│   └─ Graceful error handling
│
└── Proper Dependencies
    └─ useEffect dependencies prevent infinite loops
```

## Testing Checklist

```
✓ Hooks return correct data
✓ Loading states work properly
✓ Error states display correctly
✓ API routes authenticate users
✓ RLS policies enforce security
✓ Real-time subscriptions work
✓ Activity logging captures events
✓ All CRUD operations function
✓ No console errors or warnings
✓ No infinite loops or race conditions
```

---

This architecture ensures:
- **Security**: Multi-layer authentication and RLS
- **Real-time**: Instant updates via subscriptions
- **Scalability**: Proper indexing and query optimization
- **Maintainability**: Clear separation of concerns
- **Reliability**: Comprehensive error handling
