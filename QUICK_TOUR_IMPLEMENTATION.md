# Quick Tour Feature - Implementation Guide

## Overview
The Quick Tour feature is a role-based interactive guide that helps users navigate through the dashboard. The tour automatically adapts based on the user's role (ADMIN, USER, or PROJECT_LEAD).

## Features Implemented

### 1. **QuickTourGuide Component** (`/src/components/QuickTourGuide.js`)
An interactive tour component that displays step-by-step guidance with:
- **Modal-based interface** with overlay
- **Progress bar** showing completion percentage
- **Navigation buttons** (Previous, Next, Complete Tour)
- **Skip option** to exit the tour anytime
- **Smooth scrolling** to highlight sections
- **Role-based content** that changes based on user role

### 2. **Role-Based Tour Steps**

#### USER (Default - 6 steps)
1. Welcome to Dashboard
2. Dashboard Stats (Active Projects, Completed, Pending, Storage)
3. Projects Overview
4. Recent Activity Feed
5. Upcoming Milestones
6. Quick Actions

#### ADMIN (8 steps - Includes additional admin features)
- All user steps plus:
- Team Management section
- User Roles & Permissions configuration
- System Settings for admin controls
- Analytics & Reports for team performance

#### PROJECT LEAD (7 steps - Project-focused)
- Dashboard Stats
- Your Projects (manage projects you're leading)
- Team Collaboration (view assigned team members)
- Recent Activity
- Milestone Tracking
- Quick Actions
- Performance Metrics

## How to Use

### For Users
1. Click the "Quick Tour" button in the Welcome Banner
2. Follow the step-by-step guide
3. Use **Next** and **Previous** buttons to navigate
4. Click **Complete Tour** at the end or **Skip Tour** anytime

### Technical Integration

#### 1. Dashboard Page (`/src/app/dashboard/page.js`)
```javascript
// Import the component
import QuickTourGuide from '@/components/QuickTourGuide'

// Add state
const [showTour, setShowTour] = useState(false)

// Button to trigger tour
<button onClick={() => setShowTour(true)}>Quick Tour</button>

// Render modal when active
{showTour && <QuickTourGuide onClose={() => setShowTour(false)} />}
```

#### 2. Data Attributes
Dashboard sections are marked with `data-tour-id` attributes for highlighting:
- `data-tour-id="welcome-section"` - Welcome banner
- `data-tour-id="stats-grid"` - Stats cards
- `data-tour-id="projects-overview"` - Projects section
- `data-tour-id="recent-activity"` - Activity feed
- `data-tour-id="upcoming-milestones"` - Milestones section
- `data-tour-id="quick-actions"` - Quick action buttons
- `data-tour-id="performance-section"` - Performance metrics

## Role Detection

The tour automatically detects the user's role from the authentication context:
```javascript
const userRole = user?.user_metadata?.role?.toLowerCase() || 'user'
```

Supported roles:
- `admin` - Full admin tour
- `project_lead` or `project lead` - Project-focused tour
- `user` - Standard user tour (default)

## Customization Guide

### Adding New Tour Steps
Edit the `getTourSteps()` function in `QuickTourGuide.js`:

```javascript
const commonSteps = [
    {
        title: 'Step Title',
        description: 'Step description text',
        highlightId: 'element-id', // Match data-tour-id
        position: 'top' // or 'bottom'
    },
    // ... more steps
]
```

### Modifying Role-Specific Content
Each role has its own step array (adminSteps, projectLeadSteps, userSteps). Edit directly:

```javascript
const adminSteps = [
    ...commonSteps.slice(0, 2),
    {
        title: 'New Admin Feature',
        description: 'Description here',
        highlightId: 'admin-feature-id',
        position: 'top'
    },
    // ... rest of steps
]
```

### Styling the Tour Modal
The tour uses Tailwind CSS classes. Modify colors/sizes in the component:
- Border color: `border-neon-green`
- Progress bar: `from-neon-green to-neon-blue`
- Button styling: `from-neon-green to-neon-blue text-dark`

## UI/UX Features

### 1. **Highlight Effect**
- Green animated border around current section
- Glowing shadow effect for visibility
- Auto-scrolls section into view

### 2. **Progress Tracking**
- Visual progress bar at top
- "Step X of Y" counter
- Percentage-based animation

### 3. **Navigation**
- Previous button disabled on first step
- Next becomes "Complete Tour" on last step
- Always accessible Skip option

### 4. **Responsive Design**
- Centered modal that works on all screen sizes
- Overlay prevents interaction with other elements
- Smooth transitions and animations

## Technical Notes

### Z-Index Stack
- Background overlay: `z-40`
- Tour modal: `z-50`
- Ensures modal stays on top

### Event Handling
- Close button (X icon)
- Skip Tour text button
- Click overlay to close
- Complete Tour button on final step

### Performance Optimizations
- Components use React hooks efficiently
- Lazy rendering of tour steps
- Smooth scrolling with requestAnimationFrame timing
- Minimal DOM manipulation

## Testing Checklist

- [ ] Tour starts when "Quick Tour" button clicked
- [ ] All steps display correctly for each role
- [ ] Progress bar updates smoothly
- [ ] Sections highlight and scroll into view
- [ ] Navigation buttons work (prev/next)
- [ ] Skip button closes tour
- [ ] Complete Tour button on last step
- [ ] Close (X) button works
- [ ] Overlay click closes tour
- [ ] Role-based content shows correctly

## Future Enhancements

Potential improvements:
1. Add keyboard navigation (arrow keys)
2. Save tour completion state to database
3. Add tooltip-style hints on hover
4. Create video walkthrough option
5. Add "Show me again" option after completion
6. Track which users complete the tour
7. Add contextual help throughout dashboard
