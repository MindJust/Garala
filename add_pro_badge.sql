-- Add is_pro column to profiles table
-- This enables PRO badge display on AdCards for professional sellers

-- 1. Add the column with default false
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_pro boolean DEFAULT false;

-- 2. Add a comment to document the column
COMMENT ON COLUMN public.profiles.is_pro IS 'Indicates if the user has a professional/business account';

-- 3. Optional: Create an index for faster queries filtering by PRO users
CREATE INDEX IF NOT EXISTS idx_profiles_is_pro ON public.profiles(is_pro) 
WHERE is_pro = true;

-- 4. Optional: Set some test users as PRO (Replace with your actual user IDs)
-- UPDATE public.profiles SET is_pro = true WHERE id = 'your-user-id-here';

-- Verify the change
SELECT id, username, full_name, is_pro 
FROM public.profiles 
LIMIT 5;
