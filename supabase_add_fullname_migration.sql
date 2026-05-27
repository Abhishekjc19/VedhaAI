-- Migration to add full_name column to existing users table
-- Run this in Supabase SQL Editor if you already have the users table created

-- Add full_name column if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Update the handle_new_user function to include full_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, school_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'school_name'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    school_name = EXCLUDED.school_name,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- For existing users without full_name, you can optionally set a default
-- UPDATE public.users SET full_name = split_part(email, '@', 1) WHERE full_name IS NULL;
