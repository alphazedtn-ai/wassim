import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { SatelliteReceiver, AdminData } from '../types';
import { 
  Tv, 
  MessageCircle, 
  Filter, 
  Grid2x2 as Grid, 
  List, 
  Search, 
  CheckCircle, 
  XCircle, 
  Satellite,
  Wifi,
  Star,
  ArrowRight,
  ShoppingCart,
  ExternalLink
} from 'lucide-react';

interface SatelliteReceiversPageProps {
  receivers: SatelliteReceiver[];
  adminData: AdminData;
  onAdminClick: () => void;
}

const SatelliteReceiversPage: React.FC<SatelliteReceiversPageProps> = ({
  receivers,
  adminData,
  onAdminClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterAvailable, setFilterAvailable] = useState<'all' | 'available' | 'unavailable'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('newest');

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/21655338664', '_blank');
  };

  const handlePurchase = (receiver: SatelliteReceiver) => {
    if (receiver.purchase_url && receiver.purchase_url.trim() !== '') {
      try {
        const url = new URL(receiver.purchase_url);
        window.open(receiver.purchase_url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        window.open('https://wa.me/21655338664', '_blank', 'noopener,noreferrer');
      }
    } else {
      window.open('https://wa.me/21655338664', '_blank', 'noopener,noreferrer');
    }
  };

  // Filter and sort receivers
  const filteredReceivers = receivers
    .filter(receiver => {
      const matchesSearch = receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           receiver.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           receiver.specifications.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAvailability = filterAvailable === 'all' || 
                                 (filterAvailable === 'available' && receiver.is_available) ||
                                 (filterAvailable === 'unavailable' && !receiver.is_available);
      
      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          const priceA = parseInt(a.price.replace(/[^\d]/g, '')) || 0;
          const priceB = parseInt(b.price.replace(/[^\d]/g, '')) || 0;
          return priceA - priceB;
        case 'newest':
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <SEOHead 
        title={`Récepteurs Satellite - ${adminData.service_name} | Équipements Satellite en Tunisie`}
        description={`Découvrez notre collection de ${receivers.length} récepteurs satellite premium en Tunisie. HD, 4K, enregistrement PVR et support technique 24/7.`}
        keywords="récepteur satellite Tunisie, DVB-S2, HD satellite, 4K satellite, PVR, TechnSat récepteurs"
      />
      
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(29,78,216,0.1),transparent_50%)]"></div>
      </div>

      <Header onAdminClick={onAdminClick} serviceName={adminData.service_name} />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Satellite className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Récepteurs Satellite
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Découvrez notre gamme complète de récepteurs satellite haute performance pour une réception optimale 
            des chaînes HD et 4K en Tunisie.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>{receivers.filter(r => r.is_available).length} Disponibles</span>
            </div>
            <div className="flex items-center space-x-2">
              <Tv className="w-4 h-4 text-blue-400" />
              <span>{receivers.length} Modèles</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Qualité Premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="container mx-auto px-4 mb-8 relative z-10">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher des récepteurs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterAvailable}
                  onChange={(e) => setFilterAvailable(e.target.value as any)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm backdrop-blur-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all" className="bg-gray-800">Tous</option>
                  <option value="available" className="bg-gray-800">Disponibles</option>
                  <option value="unavailable" className="bg-gray-800">Rupture</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm backdrop-blur-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest" className="bg-gray-800">Plus Récent</option>
                <option value="name" className="bg-gray-800">Nom A-Z</option>
                <option value="price" className="bg-gray-800">Prix Croissant</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/10 rounded-lg p-1 border border-white/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500/30 text-blue-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-blue-500/30 text-blue-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 pb-12 relative z-10">
        {filteredReceivers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 max-w-md mx-auto">
              <Satellite className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Aucun Récepteur Trouvé</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm ? 'Essayez d\'ajuster vos termes de recherche.' : 'Aucun récepteur satellite disponible pour le moment.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterAvailable('all');
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">
                Affichage de {filteredReceivers.length} sur {receivers.length} récepteurs
              </p>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredReceivers.map((receiver) => (
                  <div
                    key={receiver.id}
                    className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 transform hover:scale-105 hover:bg-white/10 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden rounded-t-2xl">
                      <img 
                        src={receiver.image_url} 
                        alt={receiver.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400';
                        }}
                      />
                      
                      {/* Availability Badge */}
                      <div className="absolute top-3 right-3">
                        {receiver.is_available ? (
                          <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>En Stock</span>
                          </div>
                        ) : (
                          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                            <XCircle className="w-3 h-3" />
                            <span>Rupture</span>
                          </div>
                        )}
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-3 left-3">
                        <div className="bg-black/80 backdrop-blur-sm border-2 border-blue-400 text-white px-3 py-2 rounded-xl font-bold text-lg shadow-lg">
                          {receiver.price}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200 mb-2">
                        {receiver.name}
                      </h3>
                      {receiver.description && (
                        <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                          {receiver.description}
                        </p>
                      )}
                      
                      {/* Quick Specs */}
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <Satellite className="w-3 h-3" />
                          <span>DVB-S2</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Wifi className="w-3 h-3" />
                          <span>WiFi</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tv className="w-3 h-3" />
                          <span>HD/4K</span>
                        </div>
                      </div>

                      {/* Purchase Button */}
                      <button
                        onClick={() => handlePurchase(receiver)}
                        disabled={!receiver.is_available}
                        className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105 border ${
                          receiver.is_available
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white hover:shadow-blue-500/25 border-blue-500/30'
                            : 'bg-gray-600/20 text-gray-500 cursor-not-allowed border-gray-500/30'
                        }`}
                      >
                        {receiver.is_available ? (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>Acheter</span>
                            <ExternalLink className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>Rupture</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredReceivers.map((receiver) => (
                  <div
                    key={receiver.id}
                    className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:bg-white/10 p-6 flex items-center space-x-6"
                  >
                    {/* Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl">
                      <img 
                        src={receiver.image_url} 
                        alt={receiver.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                          {receiver.name}
                        </h3>
                        <div className="flex items-center space-x-3">
                          <div className="text-xl font-bold text-blue-400">{receiver.price}</div>
                          {receiver.is_available ? (
                            <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Disponible</span>
                            </div>
                          ) : (
                            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                              <XCircle className="w-3 h-3" />
                              <span>Rupture</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {receiver.description && (
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {receiver.description}
                        </p>
                      )}
                      
                      {receiver.specifications && (
                        <p className="text-gray-400 text-xs line-clamp-1">
                          {receiver.specifications}
                        </p>
                      )}
                    </div>

                    {/* Purchase Button */}
                    <button
                      onClick={() => handlePurchase(receiver)}
                      disabled={!receiver.is_available}
                      className={`flex-shrink-0 font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                        receiver.is_available
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white'
                          : 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {receiver.is_available ? (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>Acheter</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>Rupture</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default SatelliteReceiversPage;