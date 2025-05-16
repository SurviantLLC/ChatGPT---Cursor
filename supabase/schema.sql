-- Create tables and setup relationships
-- Note: auth.users table is created automatically by Supabase Auth

-- Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_path TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Interactions table
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  swipe BOOLEAN NOT NULL,
  rating SMALLINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  -- A user can only have one interaction with an idea
  CONSTRAINT unique_user_idea UNIQUE (user_id, idea_id),
  -- Rating must be between 1 and 10
  CONSTRAINT valid_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 10))
);

-- Create storage bucket for idea images
INSERT INTO storage.buckets (id, name, public) VALUES ('ideas', 'ideas', true);

-- Set up RLS (Row Level Security) policies for tables

-- Ideas RLS policies
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Everyone can read ideas
CREATE POLICY "Anyone can read ideas"
  ON ideas FOR SELECT
  USING (true);

-- Only authenticated users can insert ideas, and they can only set themselves as the author
CREATE POLICY "Authenticated users can create ideas"
  ON ideas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own ideas
CREATE POLICY "Authors can update their own ideas"
  ON ideas FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Authors can delete their own ideas
CREATE POLICY "Authors can delete their own ideas"
  ON ideas FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Interactions RLS policies
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Users can read all interactions
CREATE POLICY "Anyone can read interactions"
  ON interactions FOR SELECT
  USING (true);

-- Users can only create/update interactions for themselves
CREATE POLICY "Users can create their own interactions"
  ON interactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions"
  ON interactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own interactions
CREATE POLICY "Users can delete their own interactions"
  ON interactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Set up storage policies
CREATE POLICY "Anyone can read idea images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ideas');

CREATE POLICY "Authenticated users can upload idea images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'ideas' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own idea images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'ideas' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own idea images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'ideas' AND (storage.foldername(name))[1] = auth.uid()::text);
