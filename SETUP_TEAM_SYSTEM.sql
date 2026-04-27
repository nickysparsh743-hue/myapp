-- SQL Commands for Team-Based Project Management System
-- Run these in your Supabase SQL Editor

-- 1. Create team_requests table
CREATE TABLE public.team_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  requested_by_id uuid NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  approved_at timestamp with time zone,
  reviewed_at timestamp with time zone,
  CONSTRAINT team_requests_pkey PRIMARY KEY (id),
  CONSTRAINT team_requests_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE,
  CONSTRAINT team_requests_requested_by_id_fkey FOREIGN KEY (requested_by_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT team_requests_unique UNIQUE(team_id, requested_by_id)
);

-- 2. Create index for faster queries
CREATE INDEX idx_team_requests_status ON public.team_requests(status);
CREATE INDEX idx_team_requests_team_id ON public.team_requests(team_id);
CREATE INDEX idx_team_requests_requested_by_id ON public.team_requests(requested_by_id);

-- 3. If teams table doesn't exist yet, create it
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  specialization text NOT NULL,
  lead_id uuid NOT NULL,
  member_count integer DEFAULT 1,
  capacity integer DEFAULT 10,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT teams_pkey PRIMARY KEY (id),
  CONSTRAINT teams_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.profiles(id)
);

-- 4. If team_members table doesn't exist yet, create it
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text DEFAULT 'member',
  joined_at timestamp with time zone DEFAULT now(),
  CONSTRAINT team_members_pkey PRIMARY KEY (id),
  CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE,
  CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT team_members_unique UNIQUE(team_id, user_id)
);

-- 5. If project_team_assignments table doesn't exist yet, create it
CREATE TABLE IF NOT EXISTS public.project_team_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  team_id uuid NOT NULL,
  role text DEFAULT 'contributor',
  assigned_at timestamp with time zone DEFAULT now(),
  CONSTRAINT project_team_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT project_team_assignments_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
  CONSTRAINT project_team_assignments_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE,
  CONSTRAINT project_team_assignments_unique UNIQUE(project_id, team_id)
);

-- 6. Update projects table to add team_id if it doesn't exist
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES public.teams(id);

-- 7. Add specialization and team_preference to profiles if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS specialization text,
ADD COLUMN IF NOT EXISTS team_preference text[];
