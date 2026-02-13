/*
  # Create Satellite Receivers and Accessories Tables

  1. New Tables
    - `satellite_receivers`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `price` (text, required)
      - `description` (text)
      - `image_url` (text, with default)
      - `purchase_url` (text, required)
      - `specifications` (text)
      - `is_available` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `accessories`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `price` (text, required)
      - `description` (text)
      - `image_url` (text, with default)
      - `purchase_url` (text, required)
      - `category` (text, required)
      - `is_available` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for admin write access

  3. Sample Data
    - Insert default satellite receivers
    - Insert default accessories
*/

-- Create satellite_receivers table
CREATE TABLE IF NOT EXISTS satellite_receivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400',
  purchase_url text NOT NULL,
  specifications text DEFAULT '',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create accessories table
CREATE TABLE IF NOT EXISTS accessories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT 'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=400',
  purchase_url text NOT NULL,
  category text NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE satellite_receivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

-- Create policies for satellite_receivers
CREATE POLICY "Public read access for satellite receivers"
  ON satellite_receivers
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anonymous admin can insert satellite receivers"
  ON satellite_receivers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anonymous admin can update satellite receivers"
  ON satellite_receivers
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous admin can delete satellite receivers"
  ON satellite_receivers
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create policies for accessories
CREATE POLICY "Public read access for accessories"
  ON accessories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anonymous admin can insert accessories"
  ON accessories
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anonymous admin can update accessories"
  ON accessories
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous admin can delete accessories"
  ON accessories
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_satellite_receivers_updated_at
    BEFORE UPDATE ON satellite_receivers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accessories_updated_at
    BEFORE UPDATE ON accessories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON satellite_receivers TO anon;
GRANT ALL PRIVILEGES ON accessories TO anon;

-- Insert default satellite receivers
INSERT INTO satellite_receivers (name, price, description, purchase_url, specifications, is_available)
SELECT * FROM (VALUES
  ('Récepteur HD Premium', '85 TND', 'Récepteur satellite HD avec décodage numérique et interface utilisateur intuitive.', 'https://wa.me/21655338664', 'HD 1080p, DVB-S2, HDMI, USB, Ethernet, Télécommande incluse', true),
  ('Récepteur 4K Ultra HD', '150 TND', 'Récepteur satellite 4K avec support HDR et connectivité WiFi intégrée.', 'https://wa.me/21655338664', '4K Ultra HD, HDR, DVB-S2X, WiFi, Bluetooth, 2x USB 3.0', true),
  ('Récepteur Professionnel', '220 TND', 'Récepteur satellite professionnel avec enregistrement et fonctions avancées.', 'https://wa.me/21655338664', '4K, Enregistrement PVR, 1TB HDD, WiFi 6, CI+ Slot, Multi-room', true)
) AS default_receivers(name, price, description, purchase_url, specifications, is_available)
WHERE NOT EXISTS (SELECT 1 FROM satellite_receivers);

-- Insert default accessories
INSERT INTO accessories (name, price, description, purchase_url, category, is_available)
SELECT * FROM (VALUES
  ('Câbles HDMI 4K', '15 TND', 'Câbles HDMI haute qualité pour transmission 4K Ultra HD avec support HDR.', 'https://wa.me/21655338664', 'cables', true),
  ('Télécommandes Universelles', '25 TND', 'Télécommandes universelles compatibles avec la plupart des récepteurs satellite.', 'https://wa.me/21655338664', 'remotes', true),
  ('Antennes Paraboliques', '120 TND', 'Antennes paraboliques haute performance pour réception satellite optimale.', 'https://wa.me/21655338664', 'antennas', true),
  ('Supports Muraux TV', '35 TND', 'Supports muraux ajustables pour TV de 32" à 75" avec rotation complète.', 'https://wa.me/21655338664', 'mounts', true),
  ('Splitters Satellite', '18 TND', 'Splitters haute qualité pour distribution du signal satellite.', 'https://wa.me/21655338664', 'cables', true),
  ('LNB Universel', '45 TND', 'LNB universel haute performance pour antennes paraboliques.', 'https://wa.me/21655338664', 'antennas', true)
) AS default_accessories(name, price, description, purchase_url, category, is_available)
WHERE NOT EXISTS (SELECT 1 FROM accessories);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_satellite_receivers_created_at ON satellite_receivers(created_at);
CREATE INDEX IF NOT EXISTS idx_satellite_receivers_is_available ON satellite_receivers(is_available);
CREATE INDEX IF NOT EXISTS idx_accessories_created_at ON accessories(created_at);
CREATE INDEX IF NOT EXISTS idx_accessories_category ON accessories(category);
CREATE INDEX IF NOT EXISTS idx_accessories_is_available ON accessories(is_available);