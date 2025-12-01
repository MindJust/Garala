-- Add public access policy for message-media bucket if it doesn't exist

-- First, create the bucket if needed (run in Supabase dashboard Storage section manually)
-- Bucket name: message-media
-- Public: false (we'll use signed URLs or RLS)

-- RLS Policies for message-media bucket
-- Allow users to upload to their own conversations
CREATE POLICY "Users can upload to conversations they're part of"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'message-media' 
    AND (storage.foldername(name))[1] IN (
        SELECT id::text 
        FROM conversations 
        WHERE participant_1 = auth.uid() 
        OR participant_2 = auth.uid()
    )
);

-- Allow users to read media from their conversations
CREATE POLICY "Users can read media from their conversations"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'message-media'
    AND (storage.foldername(name))[1] IN (
        SELECT id::text 
        FROM conversations 
        WHERE participant_1 = auth.uid() 
        OR participant_2 = auth.uid()
    )
);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'message-media'
    AND (storage.foldername(name))[1] IN (
        SELECT id::text 
        FROM conversations 
        WHERE participant_1 = auth.uid() 
        OR participant_2 = auth.uid()
    )
);
