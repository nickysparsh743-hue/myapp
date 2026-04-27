# Team Management System - Quick Reference

## 🚀 **Quick Start**

### **For Developers:**
```
1. Go to Dashboard Settings
2. Select "Professional Specialization" tab (or scroll down in Profile)
3. Choose your primary specialization
4. Select team preferences
5. Click Save
6. Go to /dashboard/teams/requests
7. Click "Browse Teams"
8. Find teams matching your specialization
9. Click "Request Join"
10. Wait for team lead approval
```

### **For Team Leads:**
```
1. Go to /dashboard/teams
2. Click "Create Team" to start a new team
3. Name, specialization, capacity, description
4. Click "Create Team"
5. Go to "Join Requests" button (top right)
6. Review pending requests
7. Click "Approve" or "Reject"
```

### **For Project Managers:**
```
1. Go to /dashboard/projects
2. Click "Create Project"
3. Fill basic info (name, description, dates, category)
4. Step 2: Select teams
5. See recommended teams for your category
6. Select multiple teams as needed
7. Continue and review
8. Create project
```

---

## 📁 **Files Created/Modified**

### **New Files:**
- `/src/app/dashboard/teams/requests/page.js` - Join request management
- `/SETUP_TEAM_SYSTEM.sql` - Database setup commands
- `/TEAM_SYSTEM_DOCUMENTATION.md` - Full documentation
- `/TEAM_MANAGEMENT_QUICK_REFERENCE.md` - This file

### **Modified Files:**
- `/src/app/dashboard/teams/page.js` - Added "Join Requests" button
- `/src/app/dashboard/projects/new/page.js` - Multi-team selection
- `/src/app/dashboard/settings/page.js` - Added specialization fields

---

## 🗄️ **Database Tables**

| Table | Purpose |
|-------|---------|
| `teams` | Team information and metadata |
| `team_members` | User membership in teams |
| `team_requests` | Join requests from users |
| `project_team_assignments` | Team assignments to projects |
| `profiles` | Updated with specialization |
| `projects` | Updated with team_id field |

---

## 🔑 **Key Specializations**

1. Web Development
2. Mobile Apps
3. AI & ML Solutions
4. Data Analytics
5. Cybersecurity
6. Bots & Automation
7. Graphics & UI/UX
8. Writing Services
9. Database Services

---

## 📊 **Request Status Flow**

```
Request Created (pending)
    ↓
Team Lead Reviews
    ↓
    ├─→ Approve → Added to team_members → Status: approved
    │
    └─→ Reject → Status: rejected
```

---

## 🎯 **Common Tasks**

### **Create a Team**
1. `/dashboard/teams` → "Create Team"
2. Fill in: Name, Specialization, Capacity, Description
3. Click "Create Team"
4. You're automatically added as Lead

### **Join a Team**
1. `/dashboard/teams/requests` → "Browse Teams"
2. Find a team you like
3. Click "Request Join"
4. Wait for approval (team lead reviews)

### **Manage Team Members**
1. `/dashboard/teams`
2. Click team card
3. View members
4. Lead can remove members
5. Lead can manage member roles

### **Create Project with Teams**
1. `/dashboard/projects` → "New Project"
2. Step 1: Enter basic info
3. Step 2: Select teams (recommended shown first)
4. Step 3: Add milestones
5. Step 4: Review and create

### **Approve Join Requests**
1. `/dashboard/teams/requests`
2. Click "Pending Approvals" tab
3. Review each request
4. Click "Approve" or "Reject"

---

## ⚠️ **Important Notes**

- A user can't request the same team twice
- Team leads are automatically members of their team
- Projects require at least 1 team
- Team recommendations appear when project category matches
- User specialization helps with team matching
- Approving a request automatically adds user to team

---

## 🔍 **Verification Checklist**

Before going live, verify:

- [ ] Database tables created in Supabase
- [ ] Can create a team
- [ ] Can select specialization in profile
- [ ] Can request to join teams
- [ ] Can approve/reject requests as lead
- [ ] Can create projects with multiple teams
- [ ] Team members appear in project assignments
- [ ] Join request workflow completes properly
- [ ] Member count updates when approving
- [ ] All forms validate correctly

---

## 🆘 **Troubleshooting**

**Can't create team?**
- Check teams table exists in Supabase
- Verify you're logged in
- Check browser console for errors

**Can't request to join?**
- Ensure team exists and is active
- Check you haven't already requested this team
- Verify profile is set up

**Can't approve requests?**
- Only team leads can approve for their teams
- Check request status is "pending"
- Verify user exists in system

**Teams not showing in project creation?**
- Ensure teams have status='active'
- Check specialization matches project category
- Verify at least one team exists

---

## 📞 **Getting Help**

If you encounter issues:
1. Check TEAM_SYSTEM_DOCUMENTATION.md for detailed info
2. Review database tables in Supabase SQL Editor
3. Check browser DevTools console for error messages
4. Verify all SQL commands from SETUP_TEAM_SYSTEM.sql were executed

---

## 🎉 **System Ready!**

Your team-based project management system is fully operational!

All components are integrated and ready to use:
- ✅ Teams Management
- ✅ Multi-Team Projects
- ✅ Join Requests
- ✅ User Specialization
