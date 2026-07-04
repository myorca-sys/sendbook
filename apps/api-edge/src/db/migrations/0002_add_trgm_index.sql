-- Enable pg_trgm extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN Trigram indexes for fast ILIKE search on titles
CREATE INDEX IF NOT EXISTS media_metadata_title_main_trgm_idx ON media_metadata USING gin (title_main gin_trgm_ops);
CREATE INDEX IF NOT EXISTS media_metadata_title_english_trgm_idx ON media_metadata USING gin (title_english gin_trgm_ops);
CREATE INDEX IF NOT EXISTS media_metadata_title_native_trgm_idx ON media_metadata USING gin (title_native gin_trgm_ops);
