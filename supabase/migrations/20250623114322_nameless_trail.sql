/*
  # Create IPTV Website Tables

  1. New Tables
    - `iptv_offers`
      - `id` (uuid, primary key)
      - `name` (text, IPTV service name)
      - `price` (text, pricing info)
      - `description` (text, service description)
      - `image_url` (text, service image)
      - `download_url` (text, download link)
      - `app_name` (text, app name)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `admin_settings`
      - `id` (uuid, primary key)
      - `service_name` (text, business name)
      - `available_apps` (text array, list of available apps)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated admin access
*/

-- Create iptv_offers table
CREATE TABLE IF NOT EXISTS iptv_offers (
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

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL DEFAULT 'TechnSat chez Wassim',
  available_apps text[] NOT NULL DEFAULT ARRAY[
    'MTNPlus',
    'Orca Plus 4K',
    'Orca Pro+',
    'ESPRO',
    'ZEBRA',
    'OTT MTN EXTREAM',
    'Best IPTV HD',
    'STRONG 4K',
    'BD TV',
    '24 Live IPTV Page',
    'Pro Max TV Player',
    'X2 Smart',
    'Android Media Box',
    'Crazy TV Max',
    'شاهد BeIN',
    'AIS PLAY',
    'MATADOR',
    'MB Sat OTT-Pro TV',
    'NEO TV PRO',
    'COMBO IPTV',
    'MY HD PREMIER',
    'Downloader',
    'MAX OTT',
    'YouTube',
    'ULTRA IPTV',
    'MTN OTT STORE',
    'SAM IPTV',
    'BUENO TV',
    'M TV',
    'AP-LIVE WORLD CHANNELS'
  ],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE iptv_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for iptv_offers
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
  USING (true);

CREATE POLICY "Authenticated users can delete IPTV offers"
  ON iptv_offers
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for admin_settings
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
  USING (true);

-- Insert default admin settings if none exist
INSERT INTO admin_settings (service_name, available_apps)
SELECT 'TechnSat chez Wassim', ARRAY[
  'MTNPlus',
  'Orca Plus 4K',
  'Orca Pro+',
  'ESPRO',
  'ZEBRA',
  'OTT MTN EXTREAM',
  'Best IPTV HD',
  'STRONG 4K',
  'BD TV',
  '24 Live IPTV Page',
  'Pro Max TV Player',
  'X2 Smart',
  'Android Media Box',
  'Crazy TV Max',
  'شاهد BeIN',
  'AIS PLAY',
  'MATADOR',
  'MB Sat OTT-Pro TV',
  'NEO TV PRO',
  'COMBO IPTV',
  'MY HD PREMIER',
  'Downloader',
  'MAX OTT',
  'YouTube',
  'ULTRA IPTV',
  'MTN OTT STORE',
  'SAM IPTV',
  'BUENO TV',
  'M TV',
  'AP-LIVE WORLD CHANNELS'
]
WHERE NOT EXISTS (SELECT 1 FROM admin_settings);

-- Insert default IPTV offers
INSERT INTO iptv_offers (name, description, download_url, app_name)
SELECT * FROM (VALUES
  ('MTNPlus', 'Premium IPTV streaming with HD quality', 'https://wa.me/21655338664', 'MTNPlus'),
  ('Orca Plus 4K', '4K Ultra HD streaming experience', 'https://wa.me/21655338664', 'Orca Plus 4K'),
  ('Orca Pro+', 'Professional streaming with advanced features', 'https://wa.me/21655338664', 'Orca Pro+'),
  ('ESPRO', 'Sports and entertainment channels', 'https://wa.me/21655338664', 'ESPRO'),
  ('ZEBRA', 'Multi-platform IPTV solution', 'https://wa.me/21655338664', 'ZEBRA'),
  ('OTT MTN EXTREAM', 'Extreme quality streaming service', 'https://wa.me/21655338664', 'OTT MTN EXTREAM'),
  ('Best IPTV HD', 'High definition streaming channels', 'https://wa.me/21655338664', 'Best IPTV HD'),
  ('STRONG 4K', 'Ultra HD 4K streaming experience', 'https://wa.me/21655338664', 'STRONG 4K'),
  ('BD TV', 'Bangladeshi and international content', 'https://wa.me/21655338664', 'BD TV'),
  ('24 Live IPTV Page', '24/7 live streaming channels', 'https://wa.me/21655338664', '24 Live IPTV Page'),
  ('Pro Max TV Player', 'Professional TV player with premium features', 'https://wa.me/21655338664', 'Pro Max TV Player'),
  ('X2 Smart', 'Smart TV streaming solution', 'https://wa.me/21655338664', 'X2 Smart'),
  ('Android Media Box', 'Complete Android media streaming box', 'https://wa.me/21655338664', 'Android Media Box'),
  ('Crazy TV Max', 'Maximum entertainment channels', 'https://wa.me/21655338664', 'Crazy TV Max'),
  ('شاهد BeIN', 'BeIN Sports and Arabic content', 'https://wa.me/21655338664', 'شاهد BeIN'),
  ('AIS PLAY', 'Asian content streaming service', 'https://wa.me/21655338664', 'AIS PLAY'),
  ('MATADOR', 'Premium sports and entertainment', 'https://wa.me/21655338664', 'MATADOR'),
  ('MB Sat OTT-Pro TV', 'Satellite and OTT streaming combo', 'https://wa.me/21655338664', 'MB Sat OTT-Pro TV'),
  ('NEO TV PRO', 'Next generation TV streaming', 'https://wa.me/21655338664', 'NEO TV PRO'),
  ('COMBO IPTV', 'Combined IPTV package deal', 'https://wa.me/21655338664', 'COMBO IPTV'),
  ('MY HD PREMIER', 'Premium HD streaming service', 'https://wa.me/21655338664', 'MY HD PREMIER')
) AS default_offers(name, description, download_url, app_name)
WHERE NOT EXISTS (SELECT 1 FROM iptv_offers);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_iptv_offers_updated_at
    BEFORE UPDATE ON iptv_offers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();