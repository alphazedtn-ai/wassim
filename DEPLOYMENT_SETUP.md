# 🚀 Netlify Deployment Setup Guide

Your TechnSat IPTV website is now deployed! Follow these steps to complete the setup:

## 1. 🗄️ Set Up Supabase Database

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a project name (e.g., "technsat-iptv")
4. Set a strong database password
5. Choose a region close to Tunisia (Europe West recommended)

### Step 2: Get Your Credentials
After project creation, go to **Settings > API**:
- Copy your **Project URL** (looks like: `https://your-project.supabase.co`)
- Copy your **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 3: Run Database Migrations
1. Go to **SQL Editor** in your Supabase dashboard
2. Run this SQL to create your tables:

```sql
-- Create admin_settings table
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
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE iptv_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE android_boxes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access and admin write access
CREATE POLICY "Public read access for admin settings" ON admin_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anonymous admin can insert admin settings" ON admin_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anonymous admin can update admin settings" ON admin_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read access for IPTV offers" ON iptv_offers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anonymous admin can insert IPTV offers" ON iptv_offers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anonymous admin can update IPTV offers" ON iptv_offers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anonymous admin can delete IPTV offers" ON iptv_offers FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Public read access for Android boxes" ON android_boxes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anonymous admin can insert Android boxes" ON android_boxes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anonymous admin can update Android boxes" ON android_boxes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anonymous admin can delete Android boxes" ON android_boxes FOR DELETE TO anon, authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_iptv_offers_name ON iptv_offers (name);
CREATE INDEX IF NOT EXISTS idx_iptv_offers_app_name ON iptv_offers (app_name);
CREATE INDEX IF NOT EXISTS idx_iptv_offers_created_at ON iptv_offers (created_at);
CREATE INDEX IF NOT EXISTS idx_android_boxes_name ON android_boxes (name);
CREATE INDEX IF NOT EXISTS idx_android_boxes_is_available ON android_boxes (is_available);
CREATE INDEX IF NOT EXISTS idx_android_boxes_created_at ON android_boxes (created_at);

-- Insert default admin settings
INSERT INTO admin_settings (service_name, available_apps) 
VALUES (
  'TechnSat chez Wassim',
  ARRAY[
    'MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM',
    'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player',
    'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY',
    'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER',
    'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV',
    'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS'
  ]
) ON CONFLICT DO NOTHING;

-- Insert sample IPTV offers
INSERT INTO iptv_offers (name, price, description, download_url, app_name) VALUES
('MTN Plus Premium', '15 TND/month', 'Premium IPTV with international channels and 4K streaming', 'https://wa.me/21655338664', 'MTNPlus'),
('Orca Plus 4K', '20 TND/month', 'Ultra HD streaming with sports and entertainment channels', 'https://wa.me/21655338664', 'Orca Plus 4K'),
('ZEBRA IPTV', '12 TND/month', 'Reliable streaming service with Arabic and international content', 'https://wa.me/21655338664', 'ZEBRA'),
('Best IPTV HD', '18 TND/month', 'High definition streaming with premium channels', 'https://wa.me/21655338664', 'Best IPTV HD'),
('STRONG 4K', '25 TND/month', 'Professional 4K streaming solution', 'https://wa.me/21655338664', 'STRONG 4K')
ON CONFLICT DO NOTHING;

-- Insert sample Android boxes
INSERT INTO android_boxes (name, price, description, purchase_url, specifications, is_available) VALUES
('Android TV Box Pro 4K', '120 TND', 'High-performance Android TV box with 4K HDR support', 'https://wa.me/21655338664', '4GB RAM, 64GB Storage, Android 11, 4K HDR, WiFi 6', true),
('Smart Media Player X1', '95 TND', 'Compact and powerful streaming device', 'https://wa.me/21655338664', '2GB RAM, 32GB Storage, Android 10, Full HD, WiFi 5', true),
('Ultra Stream Box', '150 TND', 'Premium streaming solution with advanced features', 'https://wa.me/21655338664', '6GB RAM, 128GB Storage, Android 12, 4K HDR10+, WiFi 6E', true)
ON CONFLICT DO NOTHING;
```

## 2. 🔧 Configure Netlify Environment Variables

### In Your Netlify Dashboard:
1. Go to your site dashboard on Netlify
2. Click **Site settings** → **Environment variables**
3. Add these variables:

| Variable Name | Value |
|---------------|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

### Example:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. 🔄 Redeploy Your Site

After adding environment variables:
1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete

## 4. 🎉 Test Your Site

Your site should now show:
- ✅ IPTV applications with sample data
- ✅ Android TV boxes with sample data
- ✅ Working admin panel (login: `wassim1` / `zed18666`)
- ✅ WhatsApp integration
- ✅ Responsive design

## 5. 🛠️ Admin Panel Usage

### Login Credentials:
- **Username:** `wassim1`
- **Password:** `zed18666`

### Admin Features:
- Add/edit/delete IPTV applications
- Manage Android TV boxes
- Update service settings
- Real-time updates

## 6. 🔒 Security Notes

**Important:** Change the admin credentials in production by modifying `src/components/AdminLogin.tsx`

## 7. 📞 Support

If you need help:
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure Supabase database is accessible
- Contact support if issues persist

---

**Your TechnSat IPTV website is now ready for business! 🚀**