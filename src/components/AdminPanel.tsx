import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Save, X, LogOut, AlertCircle, Monitor, RefreshCw, CheckCircle, Key, Satellite, Settings, Tv } from 'lucide-react';
import { IPTVOffer, AdminData, AndroidBox, SatelliteReceiver, Accessory } from '../types';
import { 
  getOffers, 
  getAdminData, 
  getAndroidBoxes,
  getSatelliteReceivers,
  getAccessories,
  saveOffer, 
  updateOffer, 
  deleteOffer, 
  saveAndroidBox,
  updateAndroidBox,
  deleteAndroidBox,
  saveSatelliteReceiver,
  updateSatelliteReceiver,
  deleteSatelliteReceiver,
  saveAccessory,
  updateAccessory,
  deleteAccessory,
  saveAdminData,
  subscribeToOffers,
  subscribeToAdminSettings,
  subscribeToAndroidBoxes,
  subscribeToSatelliteReceivers,
  subscribeToAccessories
} from '../utils/database';
import { supabase } from '../lib/supabase';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [offers, setOffers] = useState<IPTVOffer[]>([]);
  const [androidBoxes, setAndroidBoxes] = useState<AndroidBox[]>([]);
  const [satelliteReceivers, setSatelliteReceivers] = useState<SatelliteReceiver[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
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
  const [activeTab, setActiveTab] = useState<'boxes' | 'satellites' | 'accessories' | 'settings'>('boxes');
  
  // Product Type Selection
  const [selectedProductType, setSelectedProductType] = useState<'android_box' | 'satellite_receiver' | 'accessory'>('android_box');

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

  // Satellite Receiver States
  const [editingSatellite, setEditingSatellite] = useState<SatelliteReceiver | null>(null);
  const [showAddSatelliteForm, setShowAddSatelliteForm] = useState(false);
  const [newSatellite, setNewSatellite] = useState<Partial<SatelliteReceiver>>({
    name: '',
    price: '',
    description: '',
    image_url: '',
    purchase_url: '',
    specifications: '',
    is_available: true
  });

  // Accessory States
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const [showAddAccessoryForm, setShowAddAccessoryForm] = useState(false);
  const [newAccessory, setNewAccessory] = useState<Partial<Accessory>>({
    name: '',
    price: '',
    description: '',
    image_url: '',
    purchase_url: '',
    category: 'cables',
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
        const [offersData, adminDataResult, boxesData, satellitesData, accessoriesData] = await Promise.all([
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
          }),
          getSatelliteReceivers().catch((err) => {
            console.error('Failed to load satellite receivers:', err);
            return [];
          }),
          getAccessories().catch((err) => {
            console.error('Failed to load accessories:', err);
            return [];
          })
        ]);
        
        if (!mounted) return;
        
        console.log('Data loaded successfully:', { 
          offers: offersData?.length, 
          boxes: boxesData?.length,
          satellites: satellitesData?.length,
          accessories: accessoriesData?.length,
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
        setSatelliteReceivers(satellitesData || []);
        setAccessories(accessoriesData || []);
        
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

        const satelliteSubscription = subscribeToSatelliteReceivers((updatedSatellites) => {
          if (mounted) {
            console.log('Received satellites update:', updatedSatellites?.length);
            setSatelliteReceivers(updatedSatellites || []);
          }
        });

        const accessoriesSubscription = subscribeToAccessories((updatedAccessories) => {
          if (mounted) {
            console.log('Received accessories update:', updatedAccessories?.length);
            setAccessories(updatedAccessories || []);
          }
        });

        subscriptions = [offersSubscription, adminSubscription, boxesSubscription, satelliteSubscription, accessoriesSubscription];
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
      // Check if we're editing or creating new
      let result;
      if (editingSatelliteReceiver) {
        result = await updateSatelliteReceiver(editingSatelliteReceiver.id, newSatelliteReceiver);
        if (result) {
          setSatelliteReceivers(prev => prev.map(receiver => 
            receiver.id === editingSatelliteReceiver.id ? result : receiver
          ));
          setSuccess('Récepteur satellite mis à jour avec succès!');
        } else {
          setError('Erreur lors de la mise à jour du récepteur satellite');
        }
      } else {
        result = await saveSatelliteReceiver(newSatelliteReceiver);
        if (result) {
          setSatelliteReceivers(prev => [result, ...prev]);
          setSuccess('Récepteur satellite ajouté avec succès!');
        } else {
          setError('Erreur lors de l\'ajout du récepteur satellite. Vérifiez que les tables de base de données existent.');
        }
      }
      
      if (result) {
        // Reset form
        setNewSatelliteReceiver({
          name: '',
          price: '',
          description: '',
          image_url: '',
          purchase_url: '',
          specifications: '',
          is_available: true
        });
        setEditingSatelliteReceiver(null);
      }
      const [offersData, adminDataResult, boxesData, satellitesData, accessoriesData] = await Promise.all([
        getOffers(),
        getAdminData(),
        getAndroidBoxes(),
        getSatelliteReceivers(),
        getAccessories()
      ]);
      
      setOffers(offersData || []);
      setAdminData(adminDataResult || adminData);
      setAndroidBoxes(boxesData || []);
      setSatelliteReceivers(satellitesData || []);
      setAccessories(accessoriesData || []);
      
      showMessage('Data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      showMessage('Failed to refresh data. Please try again.', true);
    } finally {
      setRefreshing(false);
    }
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

  // Satellite Receiver Functions
  const handleSaveSatellite = async () => {
    if (!newSatellite.name?.trim() || !newSatellite.price?.trim() || !newSatellite.purchase_url?.trim()) {
      showMessage('Veuillez remplir tous les champs obligatoires', true);
      return;
    }

    setSaving(true);
    try {
      const satelliteData = {
        name: newSatellite.name!,
        price: newSatellite.price!,
        description: newSatellite.description || '',
        image_url: newSatellite.image_url || 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400',
        purchase_url: newSatellite.purchase_url!,
        specifications: newSatellite.specifications || '',
        is_available: newSatellite.is_available ?? true
      };

      let result;
      if (editingSatellite) {
        result = await updateSatelliteReceiver(editingSatellite.id, satelliteData);
        if (result) {
          showMessage('Récepteur satellite modifié avec succès!');
          setTimeout(refreshData, 500);
        }
      } else {
        result = await saveSatelliteReceiver(satelliteData);
        if (result) {
          showMessage('Récepteur satellite ajouté avec succès!');
          setTimeout(refreshData, 500);
        }
      }

      if (result) {
        resetSatelliteForm();
      } else {
        showMessage('Échec de l\'enregistrement du récepteur satellite. Veuillez réessayer.', true);
      }
    } catch (error) {
      console.error('Error saving satellite receiver:', error);
      setError('Erreur lors de l\'enregistrement du récepteur satellite. Les tables de base de données n\'existent peut-être pas encore.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSatellite = (satellite: SatelliteReceiver) => {
    setEditingSatellite(satellite);
    setNewSatellite({
      name: satellite.name,
      price: satellite.price,
      description: satellite.description,
      image_url: satellite.image_url,
      purchase_url: satellite.purchase_url,
      specifications: satellite.specifications,
      is_available: satellite.is_available
    });
    setShowAddSatelliteForm(true);
  };

  const handleDeleteSatellite = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce récepteur satellite? Cette action ne peut pas être annulée.')) {
      return;
    }

    setSaving(true);
    try {
      const success = await deleteSatelliteReceiver(id);
      if (success) {
        showMessage('Récepteur satellite supprimé avec succès!');
        setTimeout(refreshData, 500);
      } else {
        showMessage('Échec de la suppression du récepteur satellite. Veuillez réessayer.', true);
      }
    } catch (error) {
      console.error('Error deleting satellite receiver:', error);
      showMessage('Échec de la suppression du récepteur satellite. Veuillez réessayer.', true);
    } finally {
      setSaving(false);
    }
  };

  const resetSatelliteForm = () => {
    setShowAddSatelliteForm(false);
    setEditingSatellite(null);
    setNewSatellite({
      name: '',
      price: '',
      description: '',
      image_url: '',
      purchase_url: '',
      specifications: '',
      is_available: true
    });
  };

  // Accessory Functions
  const handleSaveAccessory = async () => {
    if (!newAccessory.name?.trim() || !newAccessory.price?.trim() || !newAccessory.purchase_url?.trim() || !newAccessory.category?.trim()) {
      showMessage('Veuillez remplir tous les champs obligatoires', true);
      return;
    }

    setSaving(true);
    try {
      const accessoryData = {
        name: newAccessory.name!,
        price: newAccessory.price!,
        description: newAccessory.description || '',
        image_url: newAccessory.image_url || 'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=400',
        purchase_url: newAccessory.purchase_url!,
        category: newAccessory.category!,
        is_available: newAccessory.is_available ?? true
      };

      let result;
      if (editingAccessory) {
        result = await updateAccessory(editingAccessory.id, accessoryData);
        if (result) {
          showMessage('Accessoire modifié avec succès!');
          setTimeout(refreshData, 500);
        }
      } else {
        result = await saveAccessory(accessoryData);
        if (result) {
          showMessage('Accessoire ajouté avec succès!');
          setTimeout(refreshData, 500);
        }
      }

      if (result) {
        resetAccessoryForm();
      } else {
        showMessage('Échec de l\'enregistrement de l\'accessoire. Veuillez réessayer.', true);
      }
    } catch (error) {
      console.error('Error saving accessory:', error);
      showMessage('Échec de l\'enregistrement de l\'accessoire. Veuillez réessayer.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleEditAccessory = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setNewAccessory({
      name: accessory.name,
      price: accessory.price,
      description: accessory.description,
      image_url: accessory.image_url,
      purchase_url: accessory.purchase_url,
      category: accessory.category,
      is_available: accessory.is_available
    });
    setShowAddAccessoryForm(true);
  };

  const handleDeleteAccessory = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet accessoire? Cette action ne peut pas être annulée.')) {
      return;
    }

    setSaving(true);
    try {
      const success = await deleteAccessory(id);
      if (success) {
        showMessage('Accessoire supprimé avec succès!');
        setTimeout(refreshData, 500);
      } else {
        showMessage('Échec de la suppression de l\'accessoire. Veuillez réessayer.', true);
      }
    } catch (error) {
      console.error('Error deleting accessory:', error);
      showMessage('Échec de la suppression de l\'accessoire. Veuillez réessayer.', true);
    } finally {
      setSaving(false);
    }
  };

  const resetAccessoryForm = () => {
    setShowAddAccessoryForm(false);
    setEditingAccessory(null);
    setNewAccessory({
      name: '',
      price: '',
      description: '',
      image_url: '',
      purchase_url: '',
      category: 'cables',
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
                onClick={() => setActiveTab('satellites')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  activeTab === 'satellites'
                    ? 'bg-blue-600/30 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Satellite className="w-4 h-4" />
                <span>Récepteurs Satellite ({satelliteReceivers.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('accessories')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  activeTab === 'accessories'
                    ? 'bg-purple-600/30 text-purple-400 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Accessoires ({accessories.length})</span>
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
              <h2 className="text-xl font-bold text-white mb-4">Paramètres du Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom du Service
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
                    <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Android Boxes Tab */}
          {activeTab === 'boxes' && (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Boîtiers Android TV ({androidBoxes.length})</h2>
                <button
                  onClick={() => setShowAddBoxForm(true)}
                  disabled={connectionStatus === 'disconnected'}
                  className="bg-orange-600/20 hover:bg-orange-600/30 disabled:opacity-50 text-orange-400 border border-orange-500/30 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter Boîtier</span>
                </button>
              </div>

              {/* Add/Edit Android Box Form */}
              {showAddBoxForm && (
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {editingBox ? 'Modifier Boîtier Android' : 'Ajouter Nouveau Boîtier Android'}
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
                        Nom du Boîtier *
                      </label>
                      <input
                        type="text"
                        value={newBox.name || ''}
                        onChange={(e) => setNewBox({...newBox, name: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="Entrez le nom du boîtier"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Prix *
                      </label>
                      <input
                        type="text"
                        value={newBox.price || ''}
                        onChange={(e) => setNewBox({...newBox, price: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="ex: 120 TND"
                        required
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
                        placeholder="Description courte du boîtier Android"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL d'Achat *
                      </label>
                      <input
                        type="url"
                        value={newBox.purchase_url || ''}
                        onChange={(e) => setNewBox({...newBox, purchase_url: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="https://wa.me/21655338664 ou lien d'achat"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL de l'Image
                      </label>
                      <input
                        type="url"
                        value={newBox.image_url || ''}
                        onChange={(e) => setNewBox({...newBox, image_url: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="https://example.com/image.jpg (optionnel)"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Spécifications
                      </label>
                      <textarea
                        value={newBox.specifications || ''}
                        onChange={(e) => setNewBox({...newBox, specifications: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        rows={2}
                        placeholder="ex: 4GB RAM, 64GB Storage, Android 11, 4K HDR, WiFi 6"
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
                        <span className="text-sm text-gray-300">Disponible à l'achat</span>
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
                      <span>{saving ? 'Enregistrement...' : (editingBox ? 'Modifier Boîtier' : 'Enregistrer Boîtier')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Android Boxes List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Nom</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Prix</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Disponible</th>
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
                            {box.is_available ? 'Disponible' : 'Rupture'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditBox(box)}
                              className="p-2 text-orange-400 hover:bg-orange-500/20 rounded-lg transition-colors duration-200"
                              title="Modifier boîtier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBox(box.id)}
                              disabled={saving}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              title="Supprimer boîtier"
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
                    <p className="text-gray-400">Aucun boîtier Android disponible. Ajoutez votre premier boîtier ci-dessus!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Satellite Receivers Tab */}
          {activeTab === 'satellites' && (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Récepteurs Satellite ({satelliteReceivers.length})</h2>
                <button
                  onClick={() => setShowAddSatelliteForm(true)}
                  className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter Récepteur</span>
                </button>
              </div>

              {/* Add/Edit Satellite Form */}
              {showAddSatelliteForm && (
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {editingSatellite ? 'Modifier Récepteur Satellite' : 'Ajouter Nouveau Récepteur Satellite'}
                    </h3>
                    <button
                      onClick={resetSatelliteForm}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nom du Récepteur *
                      </label>
                      <input
                        type="text"
                        value={newSatellite.name || ''}
                        onChange={(e) => setNewSatellite({...newSatellite, name: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="Entrez le nom du récepteur"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Prix *
                      </label>
                      <input
                        type="text"
                        value={newSatellite.price || ''}
                        onChange={(e) => setNewSatellite({...newSatellite, price: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="ex: 80 TND"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newSatellite.description || ''}
                        onChange={(e) => setNewSatellite({...newSatellite, description: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        rows={3}
                        placeholder="Description courte du récepteur satellite"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL d'Achat *
                      </label>
                      <input
                        type="url"
                        value={newSatellite.purchase_url || ''}
                        onChange={(e) => setNewSatellite({...newSatellite, purchase_url: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="https://wa.me/21655338664 ou lien d'achat"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL de l'Image
                      </label>
                      <input
                        type="url"
                        value={newSatellite.image_url || ''}
                        onChange={(e) => setNewSatellite({...newSatellite, image_url: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="https://example.com/image.jpg (optionnel)"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Spécifications
                      </label>
                      <textarea
                        value={newSatellite.specifications || ''}
                        onChange={(e) => setNewSatellite({...newSatellite, specifications: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        rows={2}
                        placeholder="ex: HD 1080p, DVB-S2, HDMI, USB, Ethernet"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newSatellite.is_available ?? true}
                          onChange={(e) => setNewSatellite({...newSatellite, is_available: e.target.checked})}
                          className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-300">Disponible à l'achat</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSaveSatellite}
                      disabled={saving || !newSatellite.name || !newSatellite.price || !newSatellite.purchase_url}
                      className="bg-green-600/20 hover:bg-green-600/30 disabled:opacity-50 text-green-400 border border-green-500/30 px-6 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Enregistrement...' : (editingSatellite ? 'Modifier Récepteur' : 'Enregistrer Récepteur')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Satellite Receivers List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Nom</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Prix</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Disponible</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {satelliteReceivers.map(satellite => (
                      <tr key={satellite.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">{satellite.name}</td>
                        <td className="py-3 px-4 text-blue-400 font-semibold">{satellite.price}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            satellite.is_available 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {satellite.is_available ? 'Disponible' : 'Rupture'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditSatellite(satellite)}
                              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                              title="Modifier récepteur"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSatellite(satellite.id)}
                              disabled={saving}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              title="Supprimer récepteur"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {satelliteReceivers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Aucun récepteur satellite disponible. Ajoutez votre premier récepteur ci-dessus!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Accessories Tab */}
          {activeTab === 'accessories' && (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Accessoires ({accessories.length})</h2>
                <button
                  onClick={() => setShowAddAccessoryForm(true)}
                  className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter Accessoire</span>
                </button>
              </div>

              {/* Add/Edit Accessory Form */}
              {showAddAccessoryForm && (
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {editingAccessory ? 'Modifier Accessoire' : 'Ajouter Nouvel Accessoire'}
                    </h3>
                    <button
                      onClick={resetAccessoryForm}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nom de l'Accessoire *
                      </label>
                      <input
                        type="text"
                        value={newAccessory.name || ''}
                        onChange={(e) => setNewAccessory({...newAccessory, name: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="Entrez le nom de l'accessoire"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Prix *
                      </label>
                      <input
                        type="text"
                        value={newAccessory.price || ''}
                        onChange={(e) => setNewAccessory({...newAccessory, price: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="ex: 25 TND"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Catégorie *
                      </label>
                      <select
                        value={newAccessory.category || 'cables'}
                        onChange={(e) => setNewAccessory({...newAccessory, category: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white backdrop-blur-sm"
                      >
                        <option value="cables" className="bg-gray-800">Câbles</option>
                        <option value="remotes" className="bg-gray-800">Télécommandes</option>
                        <option value="antennas" className="bg-gray-800">Antennes</option>
                        <option value="mounts" className="bg-gray-800">Supports</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL d'Achat *
                      </label>
                      <input
                        type="url"
                        value={newAccessory.purchase_url || ''}
                        onChange={(e) => setNewAccessory({...newAccessory, purchase_url: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="https://wa.me/21655338664 ou lien d'achat"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newAccessory.description || ''}
                        onChange={(e) => setNewAccessory({...newAccessory, description: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        rows={3}
                        placeholder="Description de l'accessoire"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL de l'Image
                      </label>
                      <input
                        type="url"
                        value={newAccessory.image_url || ''}
                        onChange={(e) => setNewAccessory({...newAccessory, image_url: e.target.value})}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="https://example.com/image.jpg (optionnel)"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 mt-6">
                        <input
                          type="checkbox"
                          checked={newAccessory.is_available ?? true}
                          onChange={(e) => setNewAccessory({...newAccessory, is_available: e.target.checked})}
                          className="rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-300">Disponible à l'achat</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSaveAccessory}
                      disabled={saving || !newAccessory.name || !newAccessory.price || !newAccessory.purchase_url || !newAccessory.category}
                      className="bg-green-600/20 hover:bg-green-600/30 disabled:opacity-50 text-green-400 border border-green-500/30 px-6 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Enregistrement...' : (editingAccessory ? 'Modifier Accessoire' : 'Enregistrer Accessoire')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Accessories List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Nom</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Catégorie</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Prix</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Disponible</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessories.map(accessory => (
                      <tr key={accessory.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">{accessory.name}</td>
                        <td className="py-3 px-4 text-purple-400 capitalize">{accessory.category}</td>
                        <td className="py-3 px-4 text-purple-400 font-semibold">{accessory.price}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            accessory.is_available 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {accessory.is_available ? 'Disponible' : 'Rupture'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditAccessory(accessory)}
                              className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors duration-200"
                              title="Modifier accessoire"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAccessory(accessory.id)}
                              disabled={saving}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              title="Supprimer accessoire"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {accessories.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Aucun accessoire disponible. Ajoutez votre premier accessoire ci-dessus!</p>
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