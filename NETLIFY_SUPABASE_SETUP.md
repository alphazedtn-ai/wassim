# 🚀 Complete Netlify + Supabase Setup Guide

## Step 1: Create Supabase Project (2 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your account
3. Click **"New Project"**
4. Fill in:
   - **Name:** `technsat-iptv`
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Europe West (closest to Tunisia)
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup to complete

## Step 2: Get Your Supabase Credentials (30 seconds)

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

## Step 3: Add Environment Variables to Netlify (1 minute)

1. Go to your Netlify dashboard
2. Click on your site name
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"** and add:

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: Your Project URL from Step 2

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: Your anon public key from Step 2

5. Click **"Save"**

## Step 4: Create Database Tables (2 minutes)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste this SQL code:

```sql
-- Create IPTV offers table
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

-- Create Android boxes table
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

-- Create admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL DEFAULT 'TechnSat chez Wassim',
  available_apps text[] NOT NULL DEFAULT ARRAY[
    'MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM',
    'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player',
    'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY',
    'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER',
    'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV',
    'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS'
  ],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE iptv_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE android_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since you don't have user authentication)
CREATE POLICY "Public read access for IPTV offers" ON iptv_offers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can insert IPTV offers" ON iptv_offers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin can update IPTV offers" ON iptv_offers FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Admin can delete IPTV offers" ON iptv_offers FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Public read access for Android boxes" ON android_boxes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can insert Android boxes" ON android_boxes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin can update Android boxes" ON android_boxes FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Admin can delete Android boxes" ON android_boxes FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Public read access for admin settings" ON admin_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can insert admin settings" ON admin_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin can update admin settings" ON admin_settings FOR UPDATE TO anon, authenticated USING (true);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_iptv_offers_updated_at BEFORE UPDATE ON iptv_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_android_boxes_updated_at BEFORE UPDATE ON android_boxes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO iptv_offers (name, price, description, download_url, app_name) VALUES
('MTN Plus Premium', '15 TND/month', 'Premium IPTV with international channels and 4K quality', 'https://wa.me/21655338664', 'MTNPlus'),
('ZEBRA IPTV', '12 TND/month', 'High-quality streaming with sports and entertainment channels', 'https://wa.me/21655338664', 'ZEBRA'),
('Orca Plus 4K', '18 TND/month', 'Ultra HD streaming with premium content and VOD', 'https://wa.me/21655338664', 'Orca Plus 4K'),
('Best IPTV HD', '10 TND/month', 'Reliable HD streaming with local and international content', 'https://wa.me/21655338664', 'Best IPTV HD'),
('STRONG 4K', '20 TND/month', 'Professional 4K streaming solution with premium features', 'https://wa.me/21655338664', 'STRONG 4K');

INSERT INTO android_boxes (name, price, description, purchase_url, specifications, is_available) VALUES
('Android TV Box Pro 4K', '180 TND', 'High-performance Android TV box with 4K HDR support', 'https://wa.me/21655338664', '4GB RAM, 64GB Storage, Android 11, WiFi 6, Bluetooth 5.0', true),
('Smart Box Ultra', '150 TND', 'Affordable Android box with excellent performance', 'https://wa.me/21655338664', '2GB RAM, 32GB Storage, Android 10, WiFi, Bluetooth', true),
('Premium Streaming Box', '220 TND', 'Top-tier Android TV box for professional use', 'https://wa.me/21655338664', '6GB RAM, 128GB Storage, Android 12, WiFi 6E, 4K@60fps', false),
('Basic Android Box', '120 TND', 'Entry-level Android box for basic streaming needs', 'https://wa.me/21655338664', '1GB RAM, 16GB Storage, Android 9, WiFi, HDMI', true);

INSERT INTO admin_settings (service_name) VALUES ('TechnSat chez Wassim');
```

4. Click **"Run"** to execute the SQL
5. You should see "Success. No rows returned" message

## Step 5: Redeploy Your Site (30 seconds)

1. Go back to Netlify dashboard
2. Go to **Deploys** tab
3. Click **"Trigger deploy"** → **"Deploy site"**
4. Wait 2-3 minutes for deployment to complete

## Step 6: Test Everything! 🎉

1. Visit your Netlify site
2. You should see:
   - ✅ No more "Supabase configuration missing" warning
   - ✅ IPTV applications showing (5 sample apps)
   - ✅ Android TV boxes showing (4 sample boxes)
   - ✅ Admin panel working (login: `wassim1` / `zed18666`)

## 🔧 Admin Panel Features:
- Add/edit/delete IPTV apps
- Add/edit/delete Android boxes  
- Change service name
- All changes are live and saved to database
- Real-time updates

## 📱 Contact Integration:
- All WhatsApp buttons point to: +216 55 338 664
- Download buttons work for each app
- Purchase buttons work for each box

---

**Need Help?** If you get stuck on any step, let me know which step and I'll help you troubleshoot!