-- SQL to add contact details and invitation tracking to team_members

-- 1. Add contact_details JSON column to store member communication info
ALTER TABLE public.team_members
ADD COLUMN IF NOT EXISTS contact_details jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS profile_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS invited_at timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS invitation_token text UNIQUE;

-- 2. Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_team_members_profile_completed ON public.team_members(profile_completed);
CREATE INDEX IF NOT EXISTS idx_team_members_invitation_token ON public.team_members(invitation_token);

-- Example of what contact_details JSON will look like:
-- {
--   "email": "john@example.com",
--   "phone": "+1234567890",
--   "address": "123 Main St, City, Country",
--   "timezone": "UTC-5",
--   "communication_preference": "email",
--   "emergency_contact": "Jane Doe",
--   "emergency_phone": "+9876543210",
--   "bio": "Full stack developer passionate about solving complex problems",
--   "completed_at": "2026-03-03T10:30:00Z"
-- }
