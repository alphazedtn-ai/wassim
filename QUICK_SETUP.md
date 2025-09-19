# ⚡ Quick Setup Guide

## 🚨 URGENT: Complete These Steps Now

Your website is deployed but needs database configuration to show content.

### 1. Create Supabase Account (2 minutes)
1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create new project: "technsat-iptv"
3. Choose Europe West region
4. Set database password

### 2. Get Your Keys (1 minute)
In Supabase dashboard → Settings → API:
- Copy **Project URL**
- Copy **anon public key**

### 3. Add to Netlify (1 minute)
In your Netlify dashboard → Site settings → Environment variables:
- Add `VITE_SUPABASE_URL` = your project URL
- Add `VITE_SUPABASE_ANON_KEY` = your anon key

### 4. Create Database (2 minutes)
In Supabase → SQL Editor → paste and run:

```sql
-- Quick setup script
CREATE TABLE admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text DEFAULT 'TechnSat chez Wassim',
  available_apps text[] DEFAULT ARRAY['MTNPlus', 'Orca Plus 4K', 'ZEBRA'],
  created_at timestamptz DEFAULT now()
);

CREATE TABLE iptv_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text DEFAULT '',
  description text DEFAULT '',
  download_url text NOT NULL,
  app_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE android_boxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL,
  description text DEFAULT '',
  purchase_url text NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable public access
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE iptv_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE android_boxes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON admin_settings FOR ALL USING (true);
CREATE POLICY "public_read" ON iptv_offers FOR ALL USING (true);
CREATE POLICY "public_read" ON android_boxes FOR ALL USING (true);

-- Add sample data
INSERT INTO iptv_offers (name, price, description, download_url, app_name) VALUES
('MTN Plus', '15 TND/month', 'Premium IPTV service', 'https://wa.me/21655338664', 'MTNPlus'),
('ZEBRA IPTV', '12 TND/month', 'Reliable streaming', 'https://wa.me/21655338664', 'ZEBRA');

INSERT INTO android_boxes (name, price, description, purchase_url) VALUES
('Android TV Box 4K', '120 TND', 'High-performance streaming', 'https://wa.me/21655338664'),
('Smart Player X1', '95 TND', 'Compact streaming device', 'https://wa.me/21655338664');
```

### 5. Redeploy (30 seconds)
In Netlify → Deploys → Trigger deploy

**Total time: ~6 minutes** ⏱️

Your site will then show all content! 🎉