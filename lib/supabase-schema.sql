-- YatriGuide Supabase Registrations Table Schema
-- Run this SQL in your Supabase Dashboard -> SQL Editor to create the table

CREATE TABLE IF NOT EXISTS public.registrations (
  id TEXT PRIMARY KEY,
  vehicle_number TEXT,
  vehicle_type TEXT,
  travel_from TEXT,
  travel_from_other TEXT,
  travel_to TEXT,
  travel_to_other TEXT,
  route_stops JSONB DEFAULT '[]'::jsonb,
  route_history JSONB DEFAULT '[]'::jsonb,
  tour_from TEXT,
  tour_to TEXT,
  driver_type TEXT,
  owner_name TEXT,
  owner_age TEXT,
  owner_phone TEXT,
  owner_whatsapp TEXT,
  owner_aadhar TEXT,
  owner_gender TEXT,
  owner_blood_group TEXT,
  driver_name TEXT,
  vehicle_owner_name TEXT,
  vehicle_owner_contact TEXT,
  driver_age TEXT,
  driver_phone TEXT,
  driver_whatsapp TEXT,
  driver_aadhar TEXT,
  driver_gender TEXT,
  driver_blood_group TEXT,
  other_name TEXT,
  other_age TEXT,
  other_phone TEXT,
  other_whatsapp TEXT,
  other_gender TEXT,
  other_blood_group TEXT,
  emergency_contact_name TEXT,
  emergency_contact_no TEXT,
  passenger_count TEXT,
  passenger_details JSONB,
  stay_days TEXT,
  validity_date TEXT,
  goal_to_home TEXT,
  blood_group TEXT,
  email TEXT,
  message TEXT,
  registration_password TEXT,
  password JSONB,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add route history columns to an existing registrations table safely.
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS route_stops JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS route_history JSONB DEFAULT '[]'::jsonb;

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow full access for service_role key and public reads for verification
CREATE POLICY "Enable read for all" ON public.registrations FOR SELECT USING (true);
CREATE POLICY "Enable insert for all" ON public.registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON public.registrations FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON public.registrations FOR DELETE USING (true);
