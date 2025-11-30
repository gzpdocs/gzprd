/*
  # Add version column to PRDs table

  ## Changes
  This migration adds version tracking to the PRDs table.

  1. Modifications to `prds` table
    - Adds `version` (text) column with default value '1.0'
    - Allows users to specify custom version numbers for their PRDs

  ## Notes
  - Uses default value '1.0' for backward compatibility with existing PRDs
  - Version field is stored as text to allow flexible versioning schemes (e.g., "1.0", "2.1.3", "v1.0-beta")
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prds' AND column_name = 'version'
  ) THEN
    ALTER TABLE prds ADD COLUMN version text DEFAULT '1.0';
  END IF;
END $$;
