-- Update listings table for XAF, optional description, Bangui location, phone
ALTER TABLE listings 
  ALTER COLUMN description DROP NOT NULL,
  ALTER COLUMN currency SET DEFAULT 'XAF',
  ADD COLUMN phone text;

-- Note: For existing data,  you might want to update currency
UPDATE listings SET currency = 'XAF' WHERE currency = 'EUR';
