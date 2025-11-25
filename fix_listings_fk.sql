-- Fix foreign key relationship for listings table
-- Problem: listings.user_id references auth.users, but we need it to reference profiles
-- for Supabase's automatic join to work

-- Step 1: Drop existing foreign key
ALTER TABLE listings 
DROP CONSTRAINT IF EXISTS listings_user_id_fkey;

-- Step 2: Add new foreign key pointing to profiles table
ALTER TABLE listings
ADD CONSTRAINT listings_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

-- Step 3: Create an index for better join performance
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);

-- Note: After running this SQL in Supabase, the error should disappear
-- Supabase will now be able to join listings with profiles automatically
