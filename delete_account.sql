-- Function to safely delete a user account and all related data
-- This handles cascade deletion of profiles, listings, and other user data

-- First, add delete policy for profiles
CREATE POLICY "Users can delete their own profile." ON profiles
  FOR DELETE USING ((SELECT auth.uid()) = id);

-- Function to delete user account (must be called from authenticated context)
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete from profiles (cascade will handle other relations)
  DELETE FROM public.profiles WHERE id = user_id;
  
  -- Delete from auth.users (this will cascade to everything else)
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;
