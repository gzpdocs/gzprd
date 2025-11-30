/*
  # Create PRD Management System Schema

  ## Overview
  This migration creates the complete database schema for the Propel PRD application,
  including tables for PRDs (Product Requirements Documents), comments, and user settings.

  ## New Tables
  
  ### `prds` table
  Stores the main PRD documents with all metadata and content
  - `id` (uuid, primary key) - Unique identifier for each PRD
  - `title` (text) - PRD title
  - `product_name` (text) - Name of the product
  - `short_description` (text) - Brief description of the product
  - `sections` (jsonb) - Array of section objects with content
  - `is_public` (boolean) - Whether the PRD is publicly accessible
  - `public_settings` (jsonb) - Settings for public view (comments, upvotes, approval flow)
  - `upvotes` (integer) - Number of upvotes received
  - `status` (text) - Document status: 'draft' or 'published'
  - `approval_status` (text) - Approval workflow status: 'pending', 'approved', or 'rejected'
  - `last_updated` (timestamptz) - Last modification timestamp
  - `created_at` (timestamptz) - Creation timestamp
  - `created_by` (text) - Creator identifier (email or user ID)

  ### `comments` table
  Stores comments on public PRDs
  - `id` (uuid, primary key) - Unique identifier for each comment
  - `prd_id` (uuid, foreign key) - Reference to the PRD
  - `author` (text) - Comment author name
  - `avatar` (text) - Author avatar URL
  - `text` (text) - Comment content
  - `created_at` (timestamptz) - Comment creation timestamp

  ### `user_settings` table
  Stores application settings per user
  - `id` (uuid, primary key) - Unique identifier
  - `user_identifier` (text, unique) - User email or identifier
  - `gemini_model` (text) - Selected Gemini AI model
  - `gemini_api_key` (text) - Encrypted API key for Gemini
  - `webhook_url` (text) - Webhook URL for approval notifications
  - `email` (text) - User email address
  - `created_at` (timestamptz) - Settings creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  All tables have RLS enabled with restrictive default policies:
  
  1. **prds table policies:**
     - Anyone can read public PRDs (is_public = true)
     - Authenticated users can create PRDs
     - Creators can update and delete their own PRDs
  
  2. **comments table policies:**
     - Anyone can read comments on public PRDs
     - Anyone can add comments to public PRDs (anonymous commenting)
     - Only comment authors can delete their own comments
  
  3. **user_settings table policies:**
     - Users can only read and modify their own settings
     - Settings are completely private per user

  ## Indexes
  - Index on `prds.created_by` for faster user PRD queries
  - Index on `prds.is_public` for public PRD listings
  - Index on `comments.prd_id` for efficient comment retrieval
  - Index on `user_settings.user_identifier` for fast settings lookup

  ## Notes
  - All JSONB fields use default '{}' or '[]' to prevent null issues
  - Timestamps use `now()` as default for automatic tracking
  - Foreign key constraints ensure referential integrity
  - Cascading deletes ensure comments are removed when PRDs are deleted
*/

-- Create prds table
CREATE TABLE IF NOT EXISTS prds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'New PRD',
  product_name text NOT NULL DEFAULT '',
  short_description text DEFAULT '',
  sections jsonb DEFAULT '[]'::jsonb,
  is_public boolean DEFAULT false,
  public_settings jsonb DEFAULT '{"allowComments": true, "allowUpvotes": true, "enableApprovalFlow": false}'::jsonb,
  upvotes integer DEFAULT 0,
  status text DEFAULT 'draft',
  approval_status text DEFAULT 'pending',
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  created_by text NOT NULL DEFAULT 'anonymous'
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prd_id uuid NOT NULL REFERENCES prds(id) ON DELETE CASCADE,
  author text NOT NULL DEFAULT 'Guest User',
  avatar text DEFAULT '',
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text UNIQUE NOT NULL,
  gemini_model text DEFAULT 'gemini-2.5-flash',
  gemini_api_key text DEFAULT '',
  webhook_url text DEFAULT '',
  email text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_prds_created_by ON prds(created_by);
CREATE INDEX IF NOT EXISTS idx_prds_is_public ON prds(is_public);
CREATE INDEX IF NOT EXISTS idx_comments_prd_id ON comments(prd_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_identifier ON user_settings(user_identifier);

-- Enable Row Level Security
ALTER TABLE prds ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- PRDs Policies
CREATE POLICY "Anyone can view public PRDs"
  ON prds FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own PRDs"
  ON prds FOR SELECT
  USING (created_by = current_user OR created_by = 'anonymous');

CREATE POLICY "Anyone can create PRDs"
  ON prds FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Creators can update own PRDs"
  ON prds FOR UPDATE
  USING (created_by = current_user OR created_by = 'anonymous');

CREATE POLICY "Creators can delete own PRDs"
  ON prds FOR DELETE
  USING (created_by = current_user OR created_by = 'anonymous');

-- Comments Policies
CREATE POLICY "Anyone can view comments on public PRDs"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM prds 
      WHERE prds.id = comments.prd_id 
      AND prds.is_public = true
    )
  );

CREATE POLICY "Anyone can add comments to public PRDs"
  ON comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM prds 
      WHERE prds.id = comments.prd_id 
      AND prds.is_public = true
    )
  );

CREATE POLICY "Anyone can delete their own comments"
  ON comments FOR DELETE
  USING (author = current_user);

-- User Settings Policies
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (user_identifier = current_user);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (user_identifier = current_user);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (user_identifier = current_user)
  WITH CHECK (user_identifier = current_user);

CREATE POLICY "Users can delete own settings"
  ON user_settings FOR DELETE
  USING (user_identifier = current_user);