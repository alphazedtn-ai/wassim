import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Save, X, LogOut, AlertCircle, Monitor, RefreshCw, CheckCircle, Key, Satellite, Settings } from 'lucide-react'fer, AdminData, AndroidBox } from '../types';
import { 
  getOffers, 
  getAdminData, 
  getAndroidBoxes,
  saveOffer, 
  updateOffer, 
  deleteOffer, 
  saveAndroidBox,
  updateAndroidBox,
  deleteAndroidBox,
  saveAdminData,
  subscribeToOffers,
  subscribeToAdminSettings,
  subscribeToAndroidBoxes
} from '../utils/database';
import { supabase } from '../lib/supabase';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [offers, setOffers] = useState<IPTVOffer[]>([]);
  const [androidBoxes, setAndroidBoxes] = useState<AndroidBox[]>([]);
  const [adminData, setAdminData] = useState<AdminData>({
    service_name: 'TechnSat chez Wassim',
    available_apps: [
      'MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM',
      'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player',
      'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY',
      'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER',
      'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV',
      'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS'
    ]
  });
  const [activeTab, setActiveTab] = useState<'iptv' | 'boxes' | 'settings'>('iptv');
  
  // IPTV States
  const [editingOffer, setEditingOffer] = useState<IPTVOffer | null>(null);
  const [showAddOfferForm, setShowAddOfferForm] = useState(false);
  const [newOffer, setNewOffer] = useState<Partial<IPTVOffer>>({
    name: '',
    price: '',
    description: '',
    image_url: '',
    download_url: '',
    app_name: ''
  });

  // Android Box States
  const [editingBox, setEditingBox] = useState<AndroidBox | null>(null);
  const [showAddBoxForm, setShowAddBoxForm] = useState(false);
  const [newBox, setNewBox] = useState<Partial<AndroidBox>>({
    name: '',
    price: '',
    description: '',
    image_url: '',
    purchase_url: '',
    specifications: '',
    is_available: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true since AdminPanel is only shown after login

  useEffect(() => {
    let mounted = true;
    let subscriptions: any[] = [];

    const checkConnection = async () => {
      try {
        console.log('Checking Supabase connection...');
        const { data, error } = await supabase.from('iptv_offers').select('count').limit(1);
        if (error) {
          console.error('Connection check failed:', error);
          setConnectionStatus('disconnected');
          setError('Database connection failed. Please check your internet connection.');
          return false;
        } else {
          console.log('Connection successful');
          setConnectionStatus('connected');
          setError(''); // Clear any previous connection errors
          return true;
        }
      } catch (error) {
        console.error('Connection error:', error);
        setConnectionStatus('disconnected');
        setError('Unable to connect to database. Please check your internet connection.');
        return false;
      }
    };

    const initializeData = async () => {
      try {
        setLoading(true);
        console.log('Loading admin panel data...');
        
        // Check connection
        const connectionSuccess = await checkConnection();
        if (!connectionSuccess || !mounted) return;
        
        // Load all data with error handling
        const [offersData, adminDataResult, boxesData] = await Promise.all([
          getOffers().catch((err) => {
            console.error('Failed to load offers:', err);
            return [];
          }),
          getAdminData().catch((err) => {
            console.error('Failed to load admin data:', err);
            return {
              service_name: 'TechnSat chez Wassim',
              available_apps: [
                'MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM',
                'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player',
                'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY',
                'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER',
                'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV',
                'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS'
              ]
            };
          }),
          getAndroidBoxes().catch((err) => {
            console.error('Failed to load Android boxes:', err);
            return [];
          })
        ]);
        
        if (!mounted) return;
        
        console.log('Data loaded successfully:', { 
          offers: offersData?.length, 
          boxes: boxesData?.length, 
          adminData: adminDataResult 
        });
        
        setOffers(offersData || []);
        setAdminData(adminDataResult || {
          service_name: 'TechnSat chez Wassim',
          available_apps: [
            'MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM',
            'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player',
            'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY',
            'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER',
            'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV',
            'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS'
          ]
        });
        setAndroidBoxes(boxesData || []);
        
        // Set default app name for new offers
        setNewOffer(prev => ({ 
          ...prev, 
          app_name: (adminDataResult?.available_apps?.[0] || 'MTNPlus')
        }));
        
      } catch (error) {
        console.error('Error loading admin data:', error);
        if (mounted) {
          setError('Failed to load data. Please check your connection and refresh the page.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeData();

    // Set up real-time subscriptions with error handling
    const setupSubscriptions = () => {
      try {
        console.log('Setting up real-time subscriptions...');

        const offersSubscription = subscribeToOffers((updatedOffers) => {
          if (mounted) {
            console.log('Received offers update:', updatedOffers?.length);
            setOffers(updatedOffers || []);
          }
        });

        const adminSubscription = subscribeToAdminSettings((updatedAdminData) => {
          if (mounted && updatedAdminData) {
            console.log('Received admin data update:', updatedAdminData);
            setAdminData(updatedAdminData);
          }
        });

        const boxesSubscription = subscribeToAndroidBoxes((updatedBoxes) => {
          if (mounted) {
            console.log('Received boxes update:', updatedBoxes?.length);
            setAndroidBoxes(updatedBoxes || []);
          }
        });

        subscriptions = [offersSubscription, adminSubscription, boxesSubscription];
        console.log('Subscriptions set up successfully');
      } catch (error) {
        console.error('Error setting up subscriptions:', error);
      }
    };

    // Set up subscriptions after a short delay to ensure data is loaded
    setTimeout(setupSubscriptions, 1000);

    // Cleanup function
    return () => {
      mounted = false;
      console.log('Cleaning up admin panel subscriptions...');
      
      subscriptions.forEach((subscription) => {
        try {
          if (subscription && typeof subscription.unsubscribe === 'function') {
            subscription.unsubscribe();
          }
        } catch (error) {
          console.error('Error unsubscribing:', error);
        }
      });
    };
  }, []);

  const showMessage = (message: string, isError: boolean = false) => {
    if (isError) {
      setError(message);
      setSuccess('');
    } else {
      setSuccess(message);
      setError('');
    }
    
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      console.log('Refreshing all data...');
      const [offersData, adminDataResult, boxesData] = await Promise.all([
        getOffers(),
        getAdminData(),
        getAndroidBoxes()
      ]);
      
      setOffers(offersData || []);
      setAdminData(adminDataResult || adminData);
      setAndroidBoxes(boxesData || []);
      
      showMessage('Data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      showMessage('Failed to refresh data. Please try again.', true);
    } finally {
      setRefreshing(false);
    }
  };

  // IPTV Functions
  const handleSaveOffer = async () => {
    // Enhanced validation
    if (!newOffer.name?.trim()) {
      showMessage('Please enter an app name', true);
      return;
    }

    if (!newOffer.app_name?.trim()) {
      showMessage('Please select a category', true);
      return;
    }

    if (!newOffer.download_url?.trim()) {
      showMessage('Please provide a download URL', true);
      return;
    }

    // Check connection before saving
    if (connectionStatus === 'disconnected') {
      showMessage('No database connection. Please check your internet connection.', true);
      return;
    }

    setSaving(true);
    try {
      console.log('Attempting to save offer:', newOffer);

      const offerData = {
        name: newOffer.name.trim(),
        price: newOffer.price?.trim() || '',
        description: newOffer.description?.trim() || '',
        image_url: newOffer.image_url?.trim() || 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400',
        download_url: newOffer.download_url.trim(),
        app_name: newOffer.app_name.trim()
      };

      let result;
      if (editingOffer) {
        console.log('Updating existing offer with ID:', editingOffer.id);
        result = await updateOffer(editingOffer.id, offerData);
        if (result) {
          showMessage('IPTV offer updated successfully!');
          // Force refresh to ensure UI reflects changes
          setTimeout(refreshData, 500);
        }
      } else {
        console.log('Creating new offer');
        result = await saveOffer(offerData);
        if (result) {
          showMessage('IPTV offer added successfully!');
          // Force refresh to ensure UI reflects changes
          setTimeout(refreshData, 500);
        }
      }

      if (result) {
        resetOfferForm();
      } else {
        showMessage('Failed to save offer. Please check your connection and try again.', true);
      }
    } catch (error) {
      console.error('Error saving offer:', error);
      showMessage('Failed to save offer. Please check your connection and try again.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleEditOffer = (offer: IPTVOffer) => {
    console.log('Editing offer:', offer);
    setEditingOffer(offer);
    setNewOffer({
      name: offer.name,
      price: offer.price,
      description: offer.description,
      image_url: offer.image_url,
      download_url: offer.download_url,
      app_name: offer.app_name
    });
    setShowAddOfferForm(true);
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    try {
      console.log('Deleting offer with ID:', id);
      const success = await deleteOffer(id);
      if (success) {
        showMessage('IPTV offer deleted successfully!');
        // Force refresh to ensure UI reflects changes
        setTimeout(refreshData, 500);
      } else {
        showMessage('Failed to delete offer. Please try again.', true);
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      showMessage('Failed to delete offer. Please try again.', true);
    } finally {
      setSaving(false);
    }
  };

  const resetOfferForm = () => {
    setShowAddOfferForm(false);
    setEditingOffer(null);
    setNewOffer({
      name: '',
      price: '',
      description: '',
      image_url: '',
      download_url: '',
      app_name: adminData.available_apps[0] || ''
    });
  };

  // Android Box Functions
  const handleSaveBox = async () => {
    if (!newBox.name?.trim() || !newBox.price?.trim() || !newBox.purchase_url?.trim()) {
      showMessage('Please fill in all required fields', true);
      return;
    }

    setSaving(true);
    try {
      console.log('Attempting to save Android box:', newBox);

      const boxData = {
        name: newBox.name!,
        price: newBox.price!,
        description: newBox.description || '',
        image_url: newBox.image_url || 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400',
        purchase_url: newBox.purchase_url!,
        specifications: newBox.specifications || '',
        is_available: newBox.is_available ?? true
      };

      let result;
      if (editingBox) {
        console.log('Updating existing box with ID:', editingBox.id);
        result = await updateAndroidBox(editingBox.id, boxData);
        if (result) {
          showMessage('Android box updated successfully!');
          setTimeout(refreshData, 500);
        }
      } else {
        console.log('Creating new box');
        result = await saveAndroidBox(boxData);
        if (result) {
          showMessage('Android box added successfully!');
          setTimeout(refreshData, 500);
        }
      }

      if (result) {
        resetBoxForm();
      } else {
        showMessage('Failed to save Android box. Please try again.', true);
      }
    } catch (error) {
      console.error('Error saving Android box:', error);
      showMessage('Failed to save Android box. Please try again.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleEditBox = (box: AndroidBox) => {
    console.log('Editing box:', box);
    setEditingBox(box);
    setNewBox({
      name: box.name,
      price: box.price,
      description: box.description,
      image_url: box.image_url,
      purchase_url: box.purchase_url,
      specifications: box.specifications,
      is_available: box.is_available
    });
    setShowAddBoxForm(true);
  };

  const handleDeleteBox = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Android box? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    try {
      console.log('Deleting box with ID:', id);
      const success = await deleteAndroidBox(id);
      if (success) {
        showMessage('Android box deleted successfully!');
        setTimeout(refreshData, 500);
      } else {
        showMessage('Failed to delete Android box. Please try again.', true);
      }
    } catch (error) {
      console.error('Error deleting Android box:', error);
      showMessage('Failed to delete Android box. Please try again.', true);
    } finally {
      setSaving(false);
    }
  };

  const resetBoxForm = () => {
    setShowAddBoxForm(false);
    setEditingBox(null);
    setNewBox({
      name: '',
      price: '',
      description: '',
      image_url: '',
      purchase_url: '',
      specifications: '',
      is_available: true
    });
  };

  const handleSaveServiceName = async () => {
    setSaving(true);
    try {
      console.log('Saving service name:', adminData.service_name);
      const result = await saveAdminData(adminData);
      if (result) {
        showMessage('Service name updated successfully!');
        setTimeout(refreshData, 500);
      } else {
        showMessage('Failed to save service name. Please try again.', true);
      }
    } catch (error) {
      console.error('Error saving service name:', error);
      showMessage('Failed to save service name. Please try again.', true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Loading admin panel...</p>
          {connectionStatus === 'checking' && (
            <p className="text-gray-400 text-sm mt-2">Checking database connection...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                {/* Connection Status Indicator */}
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
                  connectionStatus === 'connected' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : connectionStatus === 'disconnected'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-400' :
                    connectionStatus === 'disconnected' ? 'bg-red-400' : 'bg-yellow-400'
                  }`}></div>
                  <span>
                    {connectionStatus === 'connected' ? 'Connected' :
                     connectionStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
                  </span>
                </div>
                {/* Authentication Status */}
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
                  isAuthenticated 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  <Key className="w-3 h-3" />
                  <span>{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</span>
                </div>
                {/* Refresh Button */}
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 disabled:opacity-50 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full transition-all duration-200 backdrop-blur-sm text-xs"
                >
                  <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-2 mb-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('iptv')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  activeTab === 'iptv'
                    ? 'bg-blue-600/30 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>IPTV Apps ({offers.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('boxes')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  activeTab === 'boxes'
                    ? 'bg-orange-600/30 text-orange-400 border border-orange-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Android Boxes ({androidBoxes.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'bg-purple-600/30 text-purple-400 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Service Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={adminData.service_name}
                    onChange={(e) => setAdminData({...adminData, service_name: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSaveServiceName}
                    disabled={saving}
                    className="bg-green-600/20 hover:bg-green-600/30 disabled:opacity-50 text-green-400 border border-green-500/30 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* IPTV Tab */}
          {activeTab === 'iptv' && (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">IPTV Applications ({offers.length})</h2>
                <button
                  onClick={() => setShowAddOfferForm(true)}
                  disabled={connectionStatus === 'disconnected'}
                  className="bg-blue-600/20 hover:bg-blue-600/30 disabled:opacity-50 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add App</span>
                </button>
              </div>

              {/* Add/Edit IPTV Form */}
              {showAddOfferForm && (
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {editingOffer ? 'Edit IPTV App' : 'Add New IPTV App'}
                    </h3>
                    <button
                      onClick={resetOfferForm}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        App Name *
                      </label>
                      <input
                        type="text"
                        value={newOffer.name || ''}
                        onChange={(e) => setNewOffer({...newOffer, name: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="Enter app name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        value={newOffer.app_name || ''}
                        onChange={(e) => setNewOffer({...newOffer, app_name: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white backdrop-blur-sm"
                        required
                      >
                        <option value="" className="bg-gray-800">Select category</option>
                        {adminData.available_apps.map(app => (
                          <option key={app} value={app} className="bg-gray-800">{app}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price
                      </label>
                      <input
                        type="text"
                        value={newOffer.price || ''}
                        onChange={(e) => setNewOffer({...newOffer, price: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="e.g., Free, 10 TND/month"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Download URL *
                      </label>
                      <input
                        type="url"
                        value={newOffer.download_url || ''}
                        onChange={(e) => setNewOffer({...newOffer, download_url: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="https://example.com/app-download or WhatsApp link"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newOffer.description || ''}
                        onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        rows={3}
                        placeholder="Short description of the app"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={newOffer.image_url || ''}
                        onChange={(e) => setNewOffer({...newOffer, image_url: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="https://example.com/image.jpg (optional)"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSaveOffer}
                      disabled={saving || !newOffer.name?.trim() || !newOffer.app_name?.trim() || !newOffer.download_url?.trim() || connectionStatus === 'disconnected'}
                      className="bg-green-600/20 hover:bg-green-600/30 disabled:opacity-50 text-green-400 border border-green-500/30 px-6 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : (editingOffer ? 'Update App' : 'Save App')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* IPTV List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map(offer => (
                      <tr key={offer.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">{offer.name}</td>
                        <td className="py-3 px-4 text-blue-400">{offer.app_name}</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${offer.price && offer.price.trim() !== '' ? 'text-blue-400' : 'text-gray-500'}`}>
                            {offer.price && offer.price.trim() !== '' ? offer.price : 'Not set'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditOffer(offer)}
                              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                              title="Edit app"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOffer(offer.id)}
                              disabled={saving}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              title="Delete app"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {offers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No IPTV apps available. Add your first app above!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Android Boxes Tab */}
          {activeTab === 'boxes' && (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Android TV Boxes ({androidBoxes.length})</h2>
                <button
                  onClick={() => setShowAddBoxForm(true)}
                  className="bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Box</span>
                </button>
              </div>

              {/* Add/Edit Android Box Form */}
              {showAddBoxForm && (
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {editingBox ? 'Edit Android Box' : 'Add New Android Box'}
                    </h3>
                    <button
                      onClick={resetBoxForm}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Box Name *
                      </label>
                      <input
                        type="text"
                        value={newBox.name || ''}
                        onChange={(e) => setNewBox({...newBox, name: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="Enter box name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price *
                      </label>
                      <input
                        type="text"
                        value={newBox.price || ''}
                        onChange={(e) => setNewBox({...newBox, price: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="e.g., 120 TND"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newBox.description || ''}
                        onChange={(e) => setNewBox({...newBox, description: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        rows={3}
                        placeholder="Short description of the Android box"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Purchase URL *
                      </label>
                      <input
                        type="url"
                        value={newBox.purchase_url || ''}
                        onChange={(e) => setNewBox({...newBox, purchase_url: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="https://wa.me/21655338664 or purchase link"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={newBox.image_url || ''}
                        onChange={(e) => setNewBox({...newBox, image_url: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="https://example.com/image.jpg (optional)"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Specifications
                      </label>
                      <textarea
                        value={newBox.specifications || ''}
                        onChange={(e) => setNewBox({...newBox, specifications: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        rows={2}
                        placeholder="e.g., 4GB RAM, 64GB Storage, Android 11, 4K HDR, WiFi 6"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newBox.is_available ?? true}
                          onChange={(e) => setNewBox({...newBox, is_available: e.target.checked})}
                          className="rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-300">Available for purchase</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSaveBox}
                      disabled={saving || !newBox.name || !newBox.price || !newBox.purchase_url}
                      className="bg-green-600/20 hover:bg-green-600/30 disabled:opacity-50 text-green-400 border border-green-500/30 px-6 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : (editingBox ? 'Update Box' : 'Save Box')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Android Boxes List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Available</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {androidBoxes.map(box => (
                      <tr key={box.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">{box.name}</td>
                        <td className="py-3 px-4 text-orange-400 font-semibold">{box.price}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            box.is_available 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {box.is_available ? 'Available' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditBox(box)}
                              className="p-2 text-orange-400 hover:bg-orange-500/20 rounded-lg transition-colors duration-200"
                              title="Edit box"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBox(box.id)}
                              disabled={saving}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              title="Delete box"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {androidBoxes.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No Android boxes available. Add your first box above!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;