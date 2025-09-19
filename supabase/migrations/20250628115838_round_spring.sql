/*
  # Fix Database Constraints and Issues

  1. Database Fixes
    - Fix any constraint issues in iptv_offers table
    - Ensure proper indexes and triggers
    - Add proper validation constraints
    - Fix any data integrity issues

  2. Security
    - Verify RLS policies are working correctly
    - Ensure proper permissions for CRUD operations

  3. Performance
    - Add missing indexes for better query performance
    - Optimize triggers for updated_at columns
*/

-- First, let's ensure the update_updated_at_column function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Fix iptv_offers table constraints and ensure proper structure
DO $$
BEGIN
  -- Check if table exists and fix any issues
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'iptv_offers') THEN
    
    -- Ensure all required columns exist with proper constraints
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'id') THEN
      ALTER TABLE iptv_offers ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'name') THEN
      ALTER TABLE iptv_offers ADD COLUMN name text NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'price') THEN
      ALTER TABLE iptv_offers ADD COLUMN price text DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'description') THEN
      ALTER TABLE iptv_offers ADD COLUMN description text DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'image_url') THEN
      ALTER TABLE iptv_offers ADD COLUMN image_url text DEFAULT 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'download_url') THEN
      ALTER TABLE iptv_offers ADD COLUMN download_url text NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'app_name') THEN
      ALTER TABLE iptv_offers ADD COLUMN app_name text NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'created_at') THEN
      ALTER TABLE iptv_offers ADD COLUMN created_at timestamptz DEFAULT now();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'updated_at') THEN
      ALTER TABLE iptv_offers ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;
    
    -- Ensure NOT NULL constraints are properly set
    ALTER TABLE iptv_offers ALTER COLUMN name SET NOT NULL;
    ALTER TABLE iptv_offers ALTER COLUMN download_url SET NOT NULL;
    ALTER TABLE iptv_offers ALTER COLUMN app_name SET NOT NULL;
    
    -- Ensure default values are set
    ALTER TABLE iptv_offers ALTER COLUMN price SET DEFAULT '';
    ALTER TABLE iptv_offers ALTER COLUMN description SET DEFAULT '';
    ALTER TABLE iptv_offers ALTER COLUMN image_url SET DEFAULT 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400';
    ALTER TABLE iptv_offers ALTER COLUMN created_at SET DEFAULT now();
    ALTER TABLE iptv_offers ALTER COLUMN updated_at SET DEFAULT now();
    
  ELSE
    -- Create the table if it doesn't exist
    CREATE TABLE iptv_offers (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      price text DEFAULT '',
      description text DEFAULT '',
      image_url text DEFAULT 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400',
      download_url text NOT NULL,
      app_name text NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Fix android_boxes table constraints and ensure proper structure
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'android_boxes') THEN
    
    -- Ensure all required columns exist with proper constraints
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'id') THEN
      ALTER TABLE android_boxes ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'name') THEN
      ALTER TABLE android_boxes ADD COLUMN name text NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'price') THEN
      ALTER TABLE android_boxes ADD COLUMN price text NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'description') THEN
      ALTER TABLE android_boxes ADD COLUMN description text DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'image_url') THEN
      ALTER TABLE android_boxes ADD COLUMN image_url text DEFAULT 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'purchase_url') THEN
      ALTER TABLE android_boxes ADD COLUMN purchase_url text NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'specifications') THEN
      ALTER TABLE android_boxes ADD COLUMN specifications text DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'is_available') THEN
      ALTER TABLE android_boxes ADD COLUMN is_available boolean DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'created_at') THEN
      ALTER TABLE android_boxes ADD COLUMN created_at timestamptz DEFAULT now();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'updated_at') THEN
      ALTER TABLE android_boxes ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;
    
    -- Ensure NOT NULL constraints are properly set
    ALTER TABLE android_boxes ALTER COLUMN name SET NOT NULL;
    ALTER TABLE android_boxes ALTER COLUMN price SET NOT NULL;
    ALTER TABLE android_boxes ALTER COLUMN purchase_url SET NOT NULL;
    
    -- Ensure default values are set
    ALTER TABLE android_boxes ALTER COLUMN description SET DEFAULT '';
    ALTER TABLE android_boxes ALTER COLUMN image_url SET DEFAULT 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400';
    ALTER TABLE android_boxes ALTER COLUMN specifications SET DEFAULT '';
    ALTER TABLE android_boxes ALTER COLUMN is_available SET DEFAULT true;
    ALTER TABLE android_boxes ALTER COLUMN created_at SET DEFAULT now();
    ALTER TABLE android_boxes ALTER COLUMN updated_at SET DEFAULT now();
    
  ELSE
    -- Create the table if it doesn't exist
    CREATE TABLE android_boxes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      price text NOT NULL,
      description text DEFAULT '',
      image_url text DEFAULT 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400',
      purchase_url text NOT NULL,
      specifications text DEFAULT '',
      is_available boolean DEFAULT true,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Fix admin_settings table constraints and ensure proper structure
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_settings') THEN
    
    -- Ensure all required columns exist with proper constraints
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'id') THEN
      ALTER TABLE admin_settings ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'service_name') THEN
      ALTER TABLE admin_settings ADD COLUMN service_name text NOT NULL DEFAULT 'TechnSat chez Wassim';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'available_apps') THEN
      ALTER TABLE admin_settings ADD COLUMN available_apps text[] NOT NULL DEFAULT ARRAY['MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM', 'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player', 'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY', 'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER', 'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV', 'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS'];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'created_at') THEN
      ALTER TABLE admin_settings ADD COLUMN created_at timestamptz DEFAULT now();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'updated_at') THEN
      ALTER TABLE admin_settings ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;
    
    -- Ensure NOT NULL constraints and defaults are properly set
    ALTER TABLE admin_settings ALTER COLUMN service_name SET NOT NULL;
    ALTER TABLE admin_settings ALTER COLUMN service_name SET DEFAULT 'TechnSat chez Wassim';
    ALTER TABLE admin_settings ALTER COLUMN available_apps SET NOT NULL;
    ALTER TABLE admin_settings ALTER COLUMN created_at SET DEFAULT now();
    ALTER TABLE admin_settings ALTER COLUMN updated_at SET DEFAULT now();
    
  ELSE
    -- Create the table if it doesn't exist
    CREATE TABLE admin_settings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      service_name text NOT NULL DEFAULT 'TechnSat chez Wassim',
      available_apps text[] NOT NULL DEFAULT ARRAY['MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM', 'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player', 'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY', 'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER', 'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV', 'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS'],
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE iptv_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE android_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Anyone can read IPTV offers" ON iptv_offers;
DROP POLICY IF EXISTS "Authenticated users can insert IPTV offers" ON iptv_offers;
DROP POLICY IF EXISTS "Authenticated users can update IPTV offers" ON iptv_offers;
DROP POLICY IF EXISTS "Authenticated users can delete IPTV offers" ON iptv_offers;

DROP POLICY IF EXISTS "Anyone can read Android boxes" ON android_boxes;
DROP POLICY IF EXISTS "Authenticated users can insert Android boxes" ON android_boxes;
DROP POLICY IF EXISTS "Authenticated users can update Android boxes" ON android_boxes;
DROP POLICY IF EXISTS "Authenticated users can delete Android boxes" ON android_boxes;

DROP POLICY IF EXISTS "Anyone can read admin settings" ON admin_settings;
DROP POLICY IF EXISTS "Authenticated users can insert admin settings" ON admin_settings;
DROP POLICY IF EXISTS "Authenticated users can update admin settings" ON admin_settings;

-- Create comprehensive RLS policies for iptv_offers
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

-- Create comprehensive RLS policies for android_boxes
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

-- Create comprehensive RLS policies for admin_settings
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

-- Drop existing triggers to recreate them properly
DROP TRIGGER IF EXISTS update_iptv_offers_updated_at ON iptv_offers;
DROP TRIGGER IF EXISTS update_android_boxes_updated_at ON android_boxes;
DROP TRIGGER IF EXISTS update_admin_settings_updated_at ON admin_settings;

-- Create updated_at triggers for all tables
CREATE TRIGGER update_iptv_offers_updated_at
  BEFORE UPDATE ON iptv_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_android_boxes_updated_at
  BEFORE UPDATE ON android_boxes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_iptv_offers_created_at ON iptv_offers(created_at);
CREATE INDEX IF NOT EXISTS idx_iptv_offers_app_name ON iptv_offers(app_name);
CREATE INDEX IF NOT EXISTS idx_android_boxes_created_at ON android_boxes(created_at);
CREATE INDEX IF NOT EXISTS idx_android_boxes_is_available ON android_boxes(is_available);

-- Insert default admin settings if none exist
INSERT INTO admin_settings (service_name, available_apps)
SELECT 
  'TechnSat chez Wassim',
  ARRAY['MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM', 'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player', 'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY', 'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER', 'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV', 'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS']
WHERE NOT EXISTS (SELECT 1 FROM admin_settings);

-- Clean up any invalid data that might cause issues
UPDATE iptv_offers SET 
  name = COALESCE(NULLIF(TRIM(name), ''), 'Unnamed App'),
  price = COALESCE(price, ''),
  description = COALESCE(description, ''),
  image_url = COALESCE(NULLIF(TRIM(image_url), ''), 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400'),
  download_url = COALESCE(NULLIF(TRIM(download_url), ''), 'https://wa.me/21655338664'),
  app_name = COALESCE(NULLIF(TRIM(app_name), ''), 'MTNPlus')
WHERE name IS NULL OR name = '' OR download_url IS NULL OR download_url = '' OR app_name IS NULL OR app_name = '';

UPDATE android_boxes SET 
  name = COALESCE(NULLIF(TRIM(name), ''), 'Unnamed Box'),
  price = COALESCE(NULLIF(TRIM(price), ''), 'Contact for Price'),
  description = COALESCE(description, ''),
  image_url = COALESCE(NULLIF(TRIM(image_url), ''), 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400'),
  purchase_url = COALESCE(NULLIF(TRIM(purchase_url), ''), 'https://wa.me/21655338664'),
  specifications = COALESCE(specifications, ''),
  is_available = COALESCE(is_available, true)
WHERE name IS NULL OR name = '' OR price IS NULL OR price = '' OR purchase_url IS NULL OR purchase_url = '';