-- Fix storage policies for listing images upload
-- Drop existing policies first
DROP POLICY IF EXISTS "Authenticated users can upload listing images." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own listing images." ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own listing images." ON storage.objects;

-- Recreate policies with correct conditions
CREATE POLICY "Authenticated users can upload listing images." ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'listing-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own listing images." ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'listing-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own listing images." ON storage.objects
  FOR DELETE USING (
    bucket_id = 'listing-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
