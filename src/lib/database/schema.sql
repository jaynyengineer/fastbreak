-- Fastbreak Event Dashboard Database Schema
-- Run these SQL commands in Supabase

-- Create users table (extends Supabase auth.users)
-- This table stores additional user information
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create venues table
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  capacity INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS events_user_id_idx ON public.events(user_id);
CREATE INDEX IF NOT EXISTS events_date_idx ON public.events(date);
CREATE INDEX IF NOT EXISTS events_sport_type_idx ON public.events(sport_type);
CREATE INDEX IF NOT EXISTS venues_event_id_idx ON public.venues(event_id);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- Users can only see their own record
CREATE POLICY users_select_own ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can only insert their own record
CREATE POLICY users_insert_own ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can only update their own record
CREATE POLICY users_update_own ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Events: Users can view all events
CREATE POLICY events_select_all ON public.events
  FOR SELECT
  USING (true);

-- Events: Users can only insert their own events
CREATE POLICY events_insert_own ON public.events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Events: Users can only update their own events
CREATE POLICY events_update_own ON public.events
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Events: Users can only delete their own events
CREATE POLICY events_delete_own ON public.events
  FOR DELETE
  USING (auth.uid() = user_id);

-- Venues: Users can view all venues (for all visible events)
CREATE POLICY venues_select_all ON public.venues
  FOR SELECT
  USING (true);

-- Venues: Users can insert venues for events they own
CREATE POLICY venues_insert_own ON public.venues
  FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM public.events WHERE user_id = auth.uid()
    )
  );

-- Venues: Users can update venues for events they own
CREATE POLICY venues_update_own ON public.venues
  FOR UPDATE
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    event_id IN (
      SELECT id FROM public.events WHERE user_id = auth.uid()
    )
  );

-- Venues: Users can delete venues for events they own
CREATE POLICY venues_delete_own ON public.venues
  FOR DELETE
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE user_id = auth.uid()
    )
  );

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.venues TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
