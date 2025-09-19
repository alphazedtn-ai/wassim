/*
  # Add Android Boxes Table

  1. New Tables
    - `android_boxes`
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

  2. Security
    - Enable RLS on `android_boxes` table
    - Add policies for public read access
    - Add policies for authenticated write access

  3. Sample Data
    - Insert default Android box products
*/

-- Create android_boxes table
CREATE TABLE IF NOT EXISTS android_boxes (
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

-- Enable Row Level Security
ALTER TABLE android_boxes ENABLE ROW LEVEL SECURITY;

-- Create policies for android_boxes
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
  USING (true);

CREATE POLICY "Authenticated users can delete Android boxes"
  ON android_boxes
  FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_android_boxes_updated_at
    BEFORE UPDATE ON android_boxes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default Android boxes
INSERT INTO android_boxes (name, price, description, purchase_url, specifications, is_available)
SELECT * FROM (VALUES
  ('X96 Max+ 4K Android Box', '120 TND', 'Premium 4K Android TV Box with 4GB RAM and 64GB storage', 'https://wa.me/21655338664', '4GB RAM, 64GB Storage, Android 11, 4K HDR, WiFi 6', true),
  ('H96 Max V58 Android Box', '95 TND', 'High-performance Android box with excellent streaming capabilities', 'https://wa.me/21655338664', '4GB RAM, 32GB Storage, Android 12, 4K Ultra HD, Dual WiFi', true),
  ('T95 Super Android TV Box', '85 TND', 'Affordable Android TV box with great performance', 'https://wa.me/21655338664', '2GB RAM, 16GB Storage, Android 10, 4K Support, WiFi', true),
  ('MXQ Pro 4K Android Box', '65 TND', 'Entry-level Android box perfect for IPTV streaming', 'https://wa.me/21655338664', '1GB RAM, 8GB Storage, Android 9, 4K Output, Ethernet + WiFi', true),
  ('X88 Pro 13 Android Box', '110 TND', 'Latest Android 13 box with premium features', 'https://wa.me/21655338664', '8GB RAM, 128GB Storage, Android 13, 8K Support, WiFi 6E', true)
) AS default_boxes(name, price, description, purchase_url, specifications, is_available)
WHERE NOT EXISTS (SELECT 1 FROM android_boxes);