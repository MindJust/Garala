-- Reviews and Ratings System for Listings

-- Create reviews table
CREATE TABLE IF NOT EXISTS listing_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(listing_id, reviewer_id) -- One review per user per listing
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_listing_reviews_listing_id ON listing_reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_reviews_reviewer_id ON listing_reviews(reviewer_id);

-- RLS Policies for listing_reviews
ALTER TABLE listing_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Anyone can read reviews"
ON listing_reviews FOR SELECT
USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
ON listing_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reviewer_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
ON listing_reviews FOR UPDATE
TO authenticated
USING (auth.uid() = reviewer_id)
WITH CHECK (auth.uid() = reviewer_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
ON listing_reviews FOR DELETE
TO authenticated
USING (auth.uid() = reviewer_id);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_listing_review_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_listing_review_timestamp
    BEFORE UPDATE ON listing_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_listing_review_timestamp();
