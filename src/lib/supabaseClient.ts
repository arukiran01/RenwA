import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined');

if (!hasSupabaseConfig) {
  console.warn(
    '[SUPABASE CLIENT SETUP WARNING] Supabase connection is currently not configured.\n' +
    'To fully link with your live Supabase project, go to secrets / environment variables and set:\n' +
    ' - VITE_SUPABASE_URL\n' +
    ' - VITE_SUPABASE_ANON_KEY\n' +
    'Falling back to high-integrity local storage and console SQL simulation for the preview.'
  );
}

export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * =========================================================================
 * SUPABASE POSTGRESQL DATABASE SCHEMA DOCUMENTATION
 * =========================================================================
 * 
 * --- Table: volunteers ---
 * Column       | Type                        | Constraint / Default
 * ------------+-----------------------------+---------------------------------------
 * id          | uuid                        | PRIMARY KEY, default: gen_random_uuid()
 * name        | text                        | NOT NULL
 * email       | text                        | NOT NULL
 * phone       | text                        | NOT NULL
 * city        | text                        | NOT NULL
 * skills      | text                        | NULLABLE
 * availability| text                        | NULLABLE
 * message     | text                        | NULLABLE
 * createdAt   | timestamp with time zone    | default: now()
 * 
 * --- Table: initiatives ---
 * Column       | Type                        | Constraint / Default
 * ------------+-----------------------------+---------------------------------------
 * id          | uuid                        | PRIMARY KEY, default: gen_random_uuid()
 * name        | text                        | NOT NULL
 * email       | text                        | NOT NULL
 * phone       | text                        | NOT NULL
 * city        | text                        | NOT NULL
 * category    | text                        | NOT NULL
 * message     | text                        | NULLABLE
 * createdAt   | timestamp with time zone    | default: now()
 * 
 * --- Table: metrics ---
 * Column           | Type                    | Constraint / Default
 * -----------------+-------------------------+---------------------------------------
 * id               | text                    | PRIMARY KEY (e.g. 'system_metrics')
 * currentKg        | integer                 | NOT NULL, default: 7450
 * targetKg         | integer                 | NOT NULL, default: 10000
 * volunteersCount  | integer                 | NOT NULL, default: 524
 * eventsCount      | integer                 | NOT NULL, default: 112
 * communitiesCount | integer                 | NOT NULL, default: 58
 * 
 * --- Table: logs ---
 * Column       | Type                        | Constraint / Default
 * ------------+-----------------------------+---------------------------------------
 * id          | uuid                        | PRIMARY KEY, default: gen_random_uuid()
 * type        | text                        | NOT NULL (waste_update, new_volunteer, new_initiative)
 * description | text                        | NOT NULL
 * value       | text                        | NULLABLE
 * timestamp   | text                        | NOT NULL
 */

export interface SupabaseVolunteer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  skills?: string;
  availability?: string;
  message?: string;
  createdAt?: string;
}

export interface SupabaseInitiative {
  id?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  message?: string;
  createdAt?: string;
}
