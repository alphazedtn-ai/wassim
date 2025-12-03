import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { isSupabaseConfigured } from './lib/supabase';
import HomePage from './pages/HomePage';
import AndroidBoxesPage from './pages/AndroidBoxesPage';
import AndroidBoxDetailPage from './pages/AndroidBoxDetailPage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { IPTVOffer, AdminData, AndroidBox } from './types';
import { 
  getOffers, 
  getAdminData, 
  getAndroidBoxes,
  subscribeToOffers, 
  subscribeToAdminSettings,
  subscribeToAndroidBoxes
} from './utils/database';

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

  if (showAdminPanel) {
    return <AdminPanel onLogout={handleLogout} />;
  }

  return (












    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              offers={offers}
              androidBoxes={androidBoxes}
              adminData={adminData}
              loading={loading}
              showSupabaseWarning={showSupabaseWarning}
              onAdminClick={handleAdminClick}
              onCloseSupabaseWarning={() => setShowSupabaseWarning(false)}
            />
          } 
        />
        <Route 
          path="/android-boxes" 
          element={
            <AndroidBoxesPage 
              boxes={androidBoxes}
              adminData={adminData}
              onAdminClick={handleAdminClick}
            />
          } 
        />
        <Route 
          path="/android-boxes/:id" 
          element={
            <AndroidBoxDetailPage 
              boxes={androidBoxes}
              adminData={adminData}
              onAdminClick={handleAdminClick}
            />
          } 
        />
      </Routes>
      
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin 
          onLogin={handleLogin} 
          onClose={() => setShowAdminLogin(false)} 
        />
      )}
    </Router>
  );
}

export default App;