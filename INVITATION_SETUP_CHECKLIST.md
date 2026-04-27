# Member Invitation System - Quick Setup Checklist

## Pre-Deployment

- [ ] Review `MEMBER_INVITATION_SYSTEM.md` for full documentation
- [ ] Have access to Supabase SQL Editor
- [ ] Have at least 2 test user accounts created

## Step 1: Database Setup (5 minutes)

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Create a new query
4. Copy the contents of `ADD_MEMBER_CONTACT_DETAILS.sql`
5. Run the query
6. Verify success - no errors shown

**Verification:**
- [ ] No error messages
- [ ] New columns visible in database

## Step 2: Verify API Route (2 minutes)

The API route should already exist:
- [ ] File exists: `src/app/api/dashboard/team-members/details/route.js`
- [ ] Contains POST handler
- [ ] Imports createClient from supabase

## Step 3: Test Component Integration (3 minutes)

1. Check file exists: `src/components/MemberDetailsForm.js`
2. Check updated file: `src/app/dashboard/teams/requests/page.js`
3. Check new page exists: `src/app/dashboard/teams/[id]/page.js`

**Expected files:**
- [ ] `src/components/MemberDetailsForm.js` (450+ lines)
- [ ] `src/app/dashboard/teams/[id]/page.js` (550+ lines)
- [ ] `src/app/dashboard/teams/requests/page.js` (updated with form import)
- [ ] `src/app/api/dashboard/team-members/details/route.js` (60+ lines)

## Step 4: Start Development Server

```bash
cd /home/nick/algox/myapp
npm run dev
```

Wait for:
- [ ] "ready - started server on 0.0.0.0:3000"
- [ ] No compilation errors

## Step 5: Manual Testing

### Test 1: Create Team & Invite Member

1. **Login as User A** (team lead)
   - [ ] Navigate to `/dashboard/teams`
   - [ ] Click "Create Team"
   - [ ] Fill in: Name, Specialization, Description
   - [ ] Click "Create Team"
   - [ ] See success message ✅

2. **Invite Member B**
   - [ ] Click "Manage" on your team card
   - [ ] Should see team management page
   - [ ] Click "Invite Member"
   - [ ] Enter User B's email
   - [ ] Click "Send Invite"
   - [ ] See success message ✅

3. **Check Team Stats**
   - [ ] Total Members: 2 (or more)
   - [ ] Profile Complete: 1 (only lead)
   - [ ] Pending: 1 (newly invited member)
   - [ ] Members table shows User B with "Pending" status

### Test 2: Complete Member Profile

1. **Logout and Login as User B**
   - [ ] Logout from User A
   - [ ] Login as User B
   - [ ] Automatically see Member Details Form modal

2. **Complete Step 1: Contact Info**
   - [ ] Modal title shows "Welcome to [Team Name]! 🎉"
   - [ ] Progress bar shows Step 1 of 3
   - [ ] Fill Email: `user.b@example.com`
   - [ ] Fill Phone: `+1234567890`
   - [ ] Select Timezone: `UTC-5` (or your timezone)
   - [ ] Select Communication: `Both` 🔄
   - [ ] Click "Next" ✅

3. **Complete Step 2: About You**
   - [ ] Progress bar shows Step 2 of 3
   - [ ] Fill Location: `San Francisco, USA`
   - [ ] Fill Bio: `Full stack developer with 5 years experience`
   - [ ] Click "Next" ✅

4. **Complete Step 3: Emergency Contact**
   - [ ] Progress bar shows Step 3 of 3
   - [ ] Fill Emergency Contact: `Jane Smith`
   - [ ] Fill Emergency Phone: `+9876543210`
   - [ ] See Summary section with all info
   - [ ] Click "Complete & Join Team" 
   - [ ] See loading spinner then close

### Test 3: Verify Profile Completion

1. **Login as User A**
   - [ ] Navigate to team management page
   - [ ] See User B marked as "Completed" ✓
   - [ ] Click "View" for User B
   - [ ] Modal shows all contact details:
     - [ ] Email: `user.b@example.com`
     - [ ] Phone: `+1234567890`
     - [ ] Location: `San Francisco, USA`
     - [ ] Timezone: `UTC-5`
     - [ ] Bio visible
     - [ ] Emergency Contact: `Jane Smith`
     - [ ] Emergency Phone: `+9876543210`
   - [ ] Close modal

2. **Check Statistics**
   - [ ] Total Members: 2
   - [ ] Profile Complete: 2 ✅
   - [ ] Pending: 0 ✅
   - [ ] Occupancy shows correct percentage

### Test 4: Filter Functionality

1. **Still on team management page**
   - [ ] Click "Completed" filter button
   - [ ] See only members with completed profiles
   - [ ] Click "Pending" filter button
   - [ ] See only members awaiting profile completion
   - [ ] Click "All" filter button
   - [ ] See all members

## Step 6: Edge Case Testing

### Test: Duplicate Invite Prevention
1. Try to invite same user twice
   - [ ] Get error message: "This user is already a member"

### Test: Invalid Email
1. Try to invite non-existent email
   - [ ] Get error message: "User with this email not found"

### Test: Resend Invitation
1. Invite new member (don't complete profile)
2. As team lead, click "Resend"
   - [ ] See invitation link in modal
   - [ ] Can copy link to clipboard
   - [ ] Link format: `/dashboard/teams/[teamId]/join/[userId]`

### Test: Form Validation
1. Try to submit Step 1 without email
   - [ ] Error message: "Please fill in both email and phone"
2. Try to submit with invalid email
   - [ ] Error message: "Please enter a valid email"

## Step 7: Data Verification

Check database directly in Supabase:

1. **Open SQL Editor**
2. **Check team_members table:**
   ```sql
   SELECT id, user_id, team_id, profile_completed, contact_details 
   FROM team_members 
   LIMIT 5;
   ```
   - [ ] See `profile_completed: true` for members who completed
   - [ ] See JSON data in `contact_details` column

3. **Check specific member:**
   ```sql
   SELECT contact_details 
   FROM team_members 
   WHERE user_id = '[user-id]' 
   AND profile_completed = true;
   ```
   - [ ] See valid JSON with email, phone, address, bio, etc.

## Step 8: Production Deployment

- [ ] All tests passing
- [ ] No console errors
- [ ] Database migration completed
- [ ] Components rendering correctly
- [ ] Forms submitting successfully

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Failed to save details" | Check API route exists and has correct path |
| Modal not showing for new members | Verify `profile_completed = false` in DB |
| Contact details not visible | Verify you're the team lead, member completed profile |
| Invite fails with 404 | Check user exists in profiles table with that email |
| Form validation errors | Check form fields match required in Step 1-3 |

## Success Criteria ✅

Once all tests pass, your system is ready:

- [x] Teams created successfully
- [x] Members invited via email lookup
- [x] Profile form appears on login
- [x] 3-step form collects all data
- [x] Contact details saved to database
- [x] Team leads can view member info
- [x] Emergency contact visible only to lead
- [x] Statistics update correctly
- [x] Filtering works as expected
- [x] No mock data - all real from database

## Next Actions

1. **Train team leads** on invitation process
2. **Communicate** member profile requirements
3. **Monitor** profile completion rates
4. **Collect feedback** for improvements
5. **Optional**: Enable email notifications

## Support

For detailed information, see: `MEMBER_INVITATION_SYSTEM.md`

For database schema details, see: `ADD_MEMBER_CONTACT_DETAILS.sql`
