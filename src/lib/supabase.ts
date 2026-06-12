import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined');

if (!hasSupabaseConfig) {
  console.warn(
    '[SUPABASE SETUP WARNING] Supabase connection is currently not configured.\n' +
    'To fully link with your live Supabase project, go to secrets / environment variables and set:\n' +
    ' - VITE_SUPABASE_URL\n' +
    ' - VITE_SUPABASE_ANON_KEY\n' +
    'Falling back to high-integrity local storage and console SQL simulation for the preview.'
  );
}

export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Clean SQL setup script of the PostgreSQL database designed for Supabase SQL Editor
export const SUPABASE_SETUP_SQL = `-- ----------------------------------------------------
-- RENEWEA SUPABASE POSTGRESQL TABLES SCHEMAS
-- Paste and run this script in your Supabase SQL Editor!
-- ----------------------------------------------------

-- 1. Create metrics table to track active performance indicators
CREATE TABLE IF NOT EXISTS metrics (
  id TEXT PRIMARY KEY,
  "currentKg" INTEGER NOT NULL DEFAULT 7450,
  "targetKg" INTEGER NOT NULL DEFAULT 10000,
  "volunteersCount" INTEGER NOT NULL DEFAULT 524,
  "eventsCount" INTEGER NOT NULL DEFAULT 112,
  "communitiesCount" INTEGER NOT NULL DEFAULT 58
);

-- Seed initial environmental metrics stats
INSERT INTO metrics (id, "currentKg", "targetKg", "volunteersCount", "eventsCount", "communitiesCount")
VALUES ('system_metrics', 7450, 10000, 524, 112, 58)
ON CONFLICT (id) DO NOTHING;

-- 2. Create volunteers table for registrations
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  skills TEXT,
  availability TEXT,
  message TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create initiatives table for environmental tracking
CREATE TABLE IF NOT EXISTS initiatives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create action logs table containing systemic notifications
CREATE TABLE IF NOT EXISTS logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  value TEXT,
  timestamp TEXT NOT NULL
);

-- Seed initial action logs for the ecosystem feed
INSERT INTO logs (type, description, timestamp)
VALUES 
  ('new_initiative', 'New Initiative "Oceanic Plastics Cleanup" registered via Toolkit tracker.', '12:00:00 PM'),
  ('new_volunteer', 'Sarah Jenkins registered to become an active Change Maker.', '2:15:30 PM')
ON CONFLICT DO NOTHING;
`;
