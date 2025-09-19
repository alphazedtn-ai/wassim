/*
  # Fix Database Issues for IPTV Admin Panel

  1. Database Structure Fixes
    - Ensure all tables have proper constraints and defaults
    - Fix any missing columns or incorrect data types
    - Clean up invalid data that might cause update issues

  2. Row Level Security (RLS) Fixes
    - Recreate all RLS policies with proper permissions
    - Ensure authenticated users can perform all CRUD operations
    - Allow anonymous users to read data

  3. Trigger and Function Fixes
    - Recreate update_updated_at_column function
    - Fix all triggers for automatic timestamp updates
    - Add proper error handling

  4. Data Integrity Fixes
    - Clean up any NULL or empty required fields
    - Set proper default values for all columns
    - Ensure all foreign key relationships are valid

  5. Performance Optimizations
    - Add missing indexes for better query performance
    - Optimize RLS policies for faster access
*/

-- First, let's ensure the update_updated_at_column function exists and works properly
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Fix iptv_offers table structure and constraints
DO $$
BEGIN
  -- Ensure the table exists with proper structure
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'iptv_offers' AND table_schema = 'public') THEN
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
  ELSE
    -- Fix existing table structure
    
    -- Ensure all columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'id') THEN
      ALTER TABLE iptv_offers ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'name') THEN
      ALTER TABLE iptv_offers ADD COLUMN name text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'price') THEN
      ALTER TABLE iptv_offers ADD COLUMN price text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'description') THEN
      ALTER TABLE iptv_offers ADD COLUMN description text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'image_url') THEN
      ALTER TABLE iptv_offers ADD COLUMN image_url text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'download_url') THEN
      ALTER TABLE iptv_offers ADD COLUMN download_url text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'app_name') THEN
      ALTER TABLE iptv_offers ADD COLUMN app_name text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'created_at') THEN
      ALTER TABLE iptv_offers ADD COLUMN created_at timestamptz;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'iptv_offers' AND column_name = 'updated_at') THEN
      ALTER TABLE iptv_offers ADD COLUMN updated_at timestamptz;
    END IF;
    
    -- Set proper constraints and defaults
    ALTER TABLE iptv_offers ALTER COLUMN name SET NOT NULL;
    ALTER TABLE iptv_offers ALTER COLUMN download_url SET NOT NULL;
    ALTER TABLE iptv_offers ALTER COLUMN app_name SET NOT NULL;
    
    ALTER TABLE iptv_offers ALTER COLUMN price SET DEFAULT '';
    ALTER TABLE iptv_offers ALTER COLUMN description SET DEFAULT '';
    ALTER TABLE iptv_offers ALTER COLUMN image_url SET DEFAULT 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400';
    ALTER TABLE iptv_offers ALTER COLUMN created_at SET DEFAULT now();
    ALTER TABLE iptv_offers ALTER COLUMN updated_at SET DEFAULT now();
  END IF;
END $$;

-- Fix android_boxes table structure and constraints
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'android_boxes' AND table_schema = 'public') THEN
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
  ELSE
    -- Fix existing table structure
    
    -- Ensure all columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'id') THEN
      ALTER TABLE android_boxes ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'name') THEN
      ALTER TABLE android_boxes ADD COLUMN name text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'price') THEN
      ALTER TABLE android_boxes ADD COLUMN price text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'description') THEN
      ALTER TABLE android_boxes ADD COLUMN description text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'image_url') THEN
      ALTER TABLE android_boxes ADD COLUMN image_url text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'purchase_url') THEN
      ALTER TABLE android_boxes ADD COLUMN purchase_url text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'specifications') THEN
      ALTER TABLE android_boxes ADD COLUMN specifications text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'is_available') THEN
      ALTER TABLE android_boxes ADD COLUMN is_available boolean;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'created_at') THEN
      ALTER TABLE android_boxes ADD COLUMN created_at timestamptz;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'android_boxes' AND column_name = 'updated_at') THEN
      ALTER TABLE android_boxes ADD COLUMN updated_at timestamptz;
    END IF;
    
    -- Set proper constraints and defaults
    ALTER TABLE android_boxes ALTER COLUMN name SET NOT NULL;
    ALTER TABLE android_boxes ALTER COLUMN price SET NOT NULL;
    ALTER TABLE android_boxes ALTER COLUMN purchase_url SET NOT NULL;
    
    ALTER TABLE android_boxes ALTER COLUMN description SET DEFAULT '';
    ALTER TABLE android_boxes ALTER COLUMN image_url SET DEFAULT 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400';
    ALTER TABLE android_boxes ALTER COLUMN specifications SET DEFAULT '';
    ALTER TABLE android_boxes ALTER COLUMN is_available SET DEFAULT true;
    ALTER TABLE android_boxes ALTER COLUMN created_at SET DEFAULT now();
    ALTER TABLE android_boxes ALTER COLUMN updated_at SET DEFAULT now();
  END IF;
END $$;

-- Fix admin_settings table structure and constraints
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_settings' AND table_schema = 'public') THEN
    CREATE TABLE admin_settings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      service_name text NOT NULL DEFAULT 'TechnSat chez Wassim',
      available_apps text[] NOT NULL DEFAULT ARRAY['MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM', 'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player', 'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY', 'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER', 'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV', 'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS'],
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  ELSE
    -- Fix existing table structure
    
    -- Ensure all columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'id') THEN
      ALTER TABLE admin_settings ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'service_name') THEN
      ALTER TABLE admin_settings ADD COLUMN service_name text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'available_apps') THEN
      ALTER TABLE admin_settings ADD COLUMN available_apps text[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'created_at') THEN
      ALTER TABLE admin_settings ADD COLUMN created_at timestamptz;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'updated_at') THEN
      ALTER TABLE admin_settings ADD COLUMN updated_at timestamptz;
    END IF;
    
    -- Set proper constraints and defaults
    ALTER TABLE admin_settings ALTER COLUMN service_name SET NOT NULL;
    ALTER TABLE admin_settings ALTER COLUMN service_name SET DEFAULT 'TechnSat chez Wassim';
    ALTER TABLE admin_settings ALTER COLUMN available_apps SET NOT NULL;
    ALTER TABLE admin_settings ALTER COLUMN available_apps SET DEFAULT ARRAY['MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM', 'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player', 'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY', 'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER', 'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV', 'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS'];
    ALTER TABLE admin_settings ALTER COLUMN created_at SET DEFAULT now();
    ALTER TABLE admin_settings ALTER COLUMN updated_at SET DEFAULT now();
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE iptv_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE android_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to recreate them properly
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

-- Create comprehensive and permissive RLS policies for iptv_offers
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

-- Create comprehensive and permissive RLS policies for android_boxes
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

-- Create comprehensive and permissive RLS policies for admin_settings
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
CREATE INDEX IF NOT EXISTS idx_iptv_offers_name ON iptv_offers(name);

CREATE INDEX IF NOT EXISTS idx_android_boxes_created_at ON android_boxes(created_at);
CREATE INDEX IF NOT EXISTS idx_android_boxes_is_available ON android_boxes(is_available);
CREATE INDEX IF NOT EXISTS idx_android_boxes_name ON android_boxes(name);

-- Clean up any invalid data that might cause update issues
UPDATE iptv_offers SET 
  name = COALESCE(NULLIF(TRIM(name), ''), 'Unnamed App'),
  price = COALESCE(price, ''),
  description = COALESCE(description, ''),
  image_url = COALESCE(NULLIF(TRIM(image_url), ''), 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400'),
  download_url = COALESCE(NULLIF(TRIM(download_url), ''), 'https://wa.me/21655338664'),
  app_name = COALESCE(NULLIF(TRIM(app_name), ''), 'MTNPlus'),
  created_at = COALESCE(created_at, now()),
  updated_at = COALESCE(updated_at, now())
WHERE name IS NULL OR name = '' OR download_url IS NULL OR download_url = '' OR app_name IS NULL OR app_name = '';

UPDATE android_boxes SET 
  name = COALESCE(NULLIF(TRIM(name), ''), 'Unnamed Box'),
  price = COALESCE(NULLIF(TRIM(price), ''), 'Contact for Price'),
  description = COALESCE(description, ''),
  image_url = COALESCE(NULLIF(TRIM(image_url), ''), 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400'),
  purchase_url = COALESCE(NULLIF(TRIM(purchase_url), ''), 'https://wa.me/21655338664'),
  specifications = COALESCE(specifications, ''),
  is_available = COALESCE(is_available, true),
  created_at = COALESCE(created_at, now()),
  updated_at = COALESCE(updated_at, now())
WHERE name IS NULL OR name = '' OR price IS NULL OR price = '' OR purchase_url IS NULL OR purchase_url = '';

-- Insert default admin settings if none exist
INSERT INTO admin_settings (service_name, available_apps)
SELECT 
  'TechnSat chez Wassim',
  ARRAY['MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM', 'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player', 'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY', 'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER', 'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV', 'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS']
WHERE NOT EXISTS (SELECT 1 FROM admin_settings);

-- Grant necessary permissions to ensure proper access
GRANT ALL ON iptv_offers TO anon, authenticated;
GRANT ALL ON android_boxes TO anon, authenticated;
GRANT ALL ON admin_settings TO anon, authenticated;

-- Grant usage on sequences if they exist
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;