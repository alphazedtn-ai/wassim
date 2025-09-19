# TechnSat chez Wassim - IPTV & Android TV Box Service

A modern, responsive web application for TechnSat chez Wassim's IPTV services and Android TV boxes in Tunisia.

## Features

- 🎥 **IPTV Applications Management** - Display and manage IPTV apps with pricing
- 📱 **Android TV Boxes** - Showcase Android boxes with specifications and availability
- 🔧 **Admin Panel** - Complete management system for content and settings
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 🌐 **SEO Optimized** - Meta tags, structured data, and sitemap included
- ⚡ **Real-time Updates** - Live data synchronization with Supabase
- 🎨 **Modern UI** - Beautiful gradient design with glassmorphism effects

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Netlify

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd technsat-iptv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL migrations in the `supabase/migrations` folder
   - Enable Row Level Security (RLS) policies

5. **Start development server**
   ```bash
   npm run dev
   ```

## Deployment

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

### Environment Variables for Production

Make sure to set these in your Netlify dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Database Schema

The application uses three main tables:

- **iptv_offers** - IPTV applications and services
- **android_boxes** - Android TV box products
- **admin_settings** - Service configuration and settings

## Admin Access

Default admin credentials:
- Username: `wassim1`
- Password: `zed18666`

**⚠️ Important**: Change these credentials in production by modifying the `AdminLogin.tsx` component.

## Features Overview

### Public Features
- Browse IPTV applications with pricing
- View Android TV boxes with specifications
- Contact via WhatsApp integration
- Responsive design for mobile and desktop

### Admin Features
- Add/edit/delete IPTV applications
- Manage Android TV box inventory
- Update service settings and branding
- Real-time content management

## SEO & Performance

- Optimized meta tags and Open Graph data
- Structured data for search engines
- Sitemap and robots.txt included
- Performance optimized with Vite
- Mobile-first responsive design

## Contact Information

- **Service**: TechnSat chez Wassim
- **Phone**: +216 55 338 664
- **WhatsApp**: Available
- **Location**: Tunisia

## License

This project is proprietary software for TechnSat chez Wassim.

## Support

For technical support or questions about the application, please contact the development team.