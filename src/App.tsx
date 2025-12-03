import React, { useState, useEffect } from 'react';
import { isSupabaseConfigured } from './lib/supabase';
import Header from './components/Header';
import IPTVCard from './components/IPTVCard';
import AndroidBoxCard from './components/AndroidBoxCard';
import AndroidBoxesShowcase from './components/AndroidBoxesShowcase';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import { IPTVOffer, AdminData, AndroidBox } from './types';
import { 
  getOffers, 
  getAdminData, 
  getAndroidBoxes,
  subscribeToOffers, 
  subscribeToAdminSettings,
  subscribeToAndroidBoxes
} from './utils/database';
import { MessageCircle, Tv, Smartphone, Monitor, Wifi, Zap, Shield, Headphones } from 'lucide-react';

function App() {
  const [offers, setOffers] = useState<IPTVOffer[]>([]);
  const [androidBoxes, setAndroidBoxes] = useState<AndroidBox[]>([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminData, setAdminData] = useState<AdminData>({
    service_name: 'TechnSat chez Wassim',
    available_apps: []
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSupabaseWarning, setShowSupabaseWarning] = useState(!isSupabaseConfigured);

  useEffect(() => {
    loadInitialData();
    
    // Set up real-time subscriptions
    const offersSubscription = subscribeToOffers((updatedOffers) => {
      setOffers(updatedOffers);
    });

    const adminSubscription = subscribeToAdminSettings((updatedAdminData) => {
      setAdminData(updatedAdminData);
    });

    const boxesSubscription = subscribeToAndroidBoxes((updatedBoxes) => {
      setAndroidBoxes(updatedBoxes);
    });

    // Cleanup subscriptions on unmount
    return () => {
      offersSubscription.unsubscribe();
      adminSubscription.unsubscribe();
      boxesSubscription.unsubscribe();
    };
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [offersData, adminDataResult, boxesData] = await Promise.all([
        getOffers(),
        getAdminData(),
        getAndroidBoxes()
      ]);
      
      setOffers(offersData);
      setAdminData(adminDataResult);
      setAndroidBoxes(boxesData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminClick = () => {
    setShowAdminLogin(true);
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      setShowAdminLogin(false);
      setShowAdminPanel(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAdminPanel(false);
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/21655338664', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-6"></div>
          <p className="text-white text-lg">Loading TechnSat...</p>
        </div>
      </div>
    );
  }

  if (showAdminPanel) {
    return <AdminPanel onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <SEOHead 
        title={`${adminData.service_name} - Premium IPTV Services & Android TV Boxes in Tunisia`}
        description={`${adminData.service_name} offers premium IPTV streaming services with ${offers.length}+ apps and ${androidBoxes.length}+ Android TV boxes. 4K quality, international channels, 24/7 support. Contact +216 55 338 664`}
        keywords="IPTV Tunisia, Android TV Box Tunisia, TechnSat, Wassim, streaming services, 4K IPTV, premium IPTV, international channels, MTNPlus, Orca Plus 4K, ZEBRA IPTV, Tunisia streaming, satellite TV"
      />
      
      {/* Optimized Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.1),transparent_50%)]"></div>
      </div>

      {/* Supabase Configuration Warning */}
      {showSupabaseWarning && (
        <div className="bg-yellow-500/20 border-b border-yellow-500/30 text-yellow-400 px-4 py-3 text-center relative">
          <p className="text-sm">
            ⚠️ Supabase configuration missing. Please set up environment variables for full functionality.
          </p>
          <button
            onClick={() => setShowSupabaseWarning(false)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300"
          >
            ✕
          </button>
        </div>
      )}

      <Header onAdminClick={handleAdminClick} serviceName={adminData.service_name} />
      
      {/* Android Boxes Showcase Section */}
      <AndroidBoxesShowcase boxes={androidBoxes} />
      
      {/* Hero Section - Optimized for Mobile */}
      <section className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight">
            Premium IPTV & Android Boxes in Tunisia
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
            Experience high-quality streaming with our carefully curated IPTV packages and premium Android TV boxes. Serving Tunisia with reliable 4K streaming and international content.
          </p>
          <button
            onClick={handleWhatsAppClick}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-200 flex items-center space-x-3 mx-auto border border-green-500/30"
            aria-label="Contact TechnSat on WhatsApp"
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-base">Get Started on WhatsApp</span>
          </button>
        </div>

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16">
          <div className="bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
            <Tv className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-xl md:text-2xl font-bold text-blue-400">{offers.length}+</div>
            <div className="text-xs md:text-sm text-gray-300">IPTV Apps</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
            <Monitor className="w-6 h-6 md:w-8 md:h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-xl md:text-2xl font-bold text-orange-400">{androidBoxes.length}+</div>
            <div className="text-xs md:text-sm text-gray-300">Android Boxes</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
            <Smartphone className="w-6 h-6 md:w-8 md:h-8 text-green-400 mx-auto mb-2" />
            <div className="text-xl md:text-2xl font-bold text-green-400">24/7</div>
            <div className="text-xs md:text-sm text-gray-300">Support</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
            <Wifi className="w-6 h-6 md:w-8 md:h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-xl md:text-2xl font-bold text-purple-400">4K</div>
            <div className="text-xs md:text-sm text-gray-300">Ultra HD</div>
          </div>
        </div>
      </section>

      {/* IPTV Offers Section */}
      <section className="container mx-auto px-4 py-6 md:py-8 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3 md:mb-4">
            IPTV Applications
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base px-2">
            Premium IPTV apps with international content and reliable streaming quality for Tunisia.
          </p>
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 max-w-md mx-auto">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No Apps Available</h3>
              <p className="text-gray-400 text-sm md:text-base">Check back soon for new IPTV applications!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {offers.map(offer => (
              <IPTVCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </section>

      {/* Android Boxes Section */}
      <section className="container mx-auto px-4 py-6 md:py-8 relative z-10" data-section="android-boxes">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-3 md:mb-4">
            Android TV Boxes
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base px-2">
            High-performance Android boxes for the ultimate streaming experience in Tunisia.
          </p>
        </div>

        {androidBoxes.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 max-w-md mx-auto">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No Boxes Available</h3>
              <p className="text-gray-400 text-sm md:text-base">Check back soon for new Android TV boxes!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {androidBoxes.map(box => (
              <AndroidBoxCard key={box.id} box={box} />
            ))}
          </div>
        )}
      </section>

      {/* Modern Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/10 p-6 md:p-12">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3 md:mb-4">
              Why Choose TechnSat?
            </h2>
            <p className="text-gray-400 text-sm md:text-base">Premium features that set us apart in Tunisia</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="bg-blue-500/20 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 border border-blue-500/30">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400 text-sm md:text-base">High-speed streaming with minimal buffering and maximum uptime.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500/20 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 border border-green-500/30">
                <Tv className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Global Content</h3>
              <p className="text-gray-400 text-sm md:text-base">Access international channels and premium content worldwide.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500/20 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 border border-purple-500/30">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Secure & Reliable</h3>
              <p className="text-gray-400 text-sm md:text-base">Protected streaming with enterprise-grade security measures.</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500/20 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 border border-orange-500/30">
                <Headphones className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">24/7 Support</h3>
              <p className="text-gray-400 text-sm md:text-base">Round-the-clock customer support via WhatsApp assistance.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin 
          onLogin={handleLogin} 
          onClose={() => setShowAdminLogin(false)} 
        />
      )}

      {/* Floating WhatsApp Button - Mobile Optimized */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-500 hover:bg-green-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-green-500/25 transform hover:scale-110 transition-all duration-200 z-40 border border-green-500/30"
        title="Contact TechnSat on WhatsApp"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
}

export default App;