/*
  # Create startups table

  1. New Tables
    - `startups`
      - `id` (uuid, primary key)
      - `user_id` (text, references auth.users)
      - `name` (text)
      - `description` (text)
      - `image_url` (text, optional)
      - `visibility` (text, default 'private')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `startups` table
    - Add policy for users to manage their own startups
    - Add policy for public read access to public startups
*/

CREATE TABLE IF NOT EXISTS startups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  name text,
  description text,
  image_url text,
  visibility text DEFAULT 'private',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE startups ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own startups
CREATE POLICY "Users can manage own startups"
  ON startups
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Policy for public read access to public startups
CREATE POLICY "Anyone can view public startups"
  ON startups
  FOR SELECT
  TO anon, authenticated
  USING (visibility = 'public');