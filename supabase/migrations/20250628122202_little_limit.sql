/*
  # Fix RLS policies for admin operations

  1. Security Updates
    - Update RLS policies to allow proper admin operations
    - Ensure authenticated users can perform all CRUD operations
    - Add policies for anon users where appropriate for public read access

  2. Policy Changes
    - Keep read access for anonymous users
    - Allow authenticated users to perform all operations
    - Ensure admin operations work correctly
*/

-- Drop existing policies to recreate them with proper permissions
DROP POLICY IF EXISTS "Anyone can read IPTV offers" ON iptv_offers;
DROP POLICY IF EXISTS "Authenticated users can insert IPTV offers" ON iptv_offers;
DROP POLICY IF EXISTS "Authenticated users can update IPTV offers" ON iptv_offers;
DROP POLICY IF EXISTS "Authenticated users can delete IPTV offers" ON iptv_offers;

-- Recreate policies with proper permissions
CREATE POLICY "Anyone can read IPTV offers"
  ON iptv_offers
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert IPTV offers"
  ON iptv_offers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update IPTV offers"
  ON iptv_offers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete IPTV offers"
  ON iptv_offers
  FOR DELETE
  TO authenticated
  USING (true);

-- Fix Android boxes policies
DROP POLICY IF EXISTS "Anyone can read Android boxes" ON android_boxes;
DROP POLICY IF EXISTS "Authenticated users can insert Android boxes" ON android_boxes;
DROP POLICY IF EXISTS "Authenticated users can update Android boxes" ON android_boxes;
DROP POLICY IF EXISTS "Authenticated users can delete Android boxes" ON android_boxes;

CREATE POLICY "Anyone can read Android boxes"
  ON android_boxes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert Android boxes"
  ON android_boxes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update Android boxes"
  ON android_boxes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete Android boxes"
  ON android_boxes
  FOR DELETE
  TO authenticated
  USING (true);

-- Fix admin settings policies
DROP POLICY IF EXISTS "Anyone can read admin settings" ON admin_settings;
DROP POLICY IF EXISTS "Authenticated users can insert admin settings" ON admin_settings;
DROP POLICY IF EXISTS "Authenticated users can update admin settings" ON admin_settings;

CREATE POLICY "Anyone can read admin settings"
  ON admin_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert admin settings"
  ON admin_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update admin settings"
  ON admin_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);