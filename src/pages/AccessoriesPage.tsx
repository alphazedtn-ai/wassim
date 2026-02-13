import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { Accessory, AdminData } from '../types';
import { 
  Settings, 
  MessageCircle, 
  Filter, 
  Grid2x2 as Grid, 
  List, 
  Search, 
  CheckCircle, 
  XCircle, 
  Cable,
  Wifi,
  Star,
  ArrowRight,
  ShoppingCart,
  ExternalLink,
  Zap
} from 'lucide-react';

interface AccessoriesPageProps {
  accessories: Accessory[];
  adminData: AdminData;
  onAdminClick: () => void;
}

const AccessoriesPage: React.FC<AccessoriesPageProps> = ({
  accessories,
  adminData,
  onAdminClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterAvailable, setFilterAvailable] = useState<'all' | 'available' | 'unavailable'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('newest');

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/21655338664', '_blank');
  };

  const handlePurchase = (accessory: Accessory) => {
    if (accessory.purchase_url && accessory.purchase_url.trim() !== '') {
      try {
        const url = new URL(accessory.purchase_url);
        window.open(accessory.purchase_url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        window.open('https://wa.me/21655338664', '_blank', 'noopener,noreferrer');
      }
    } else {
      window.open('https://wa.me/21655338664', '_blank', 'noopener,noreferrer');
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(accessories.map(acc => acc.category)));

  // Filter and sort accessories
  const filteredAccessories = accessories
    .filter(accessory => {
      const matchesSearch = accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           accessory.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           accessory.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAvailability = filterAvailable === 'all' || 
                                 (filterAvailable === 'available' && accessory.is_available) ||
                                 (filterAvailable === 'unavailable' && !accessory.is_available);
      
      const matchesCategory = filterCategory === 'all' || accessory.category === filterCategory;
      
      return matchesSearch && matchesAvailability && matchesCategory;
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cables':
        return <Cable className="w-3 h-3" />;
      case 'remotes':
        return <Zap className="w-3 h-3" />;
      case 'antennas':
        return <Wifi className="w-3 h-3" />;
      case 'mounts':
        return <Settings className="w-3 h-3" />;
      default:
        return <Settings className="w-3 h-3" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cables':
        return 'Câbles';
      case 'remotes':
        return 'Télécommandes';
      case 'antennas':
        return 'Antennes';
      case 'mounts':
        return 'Supports';
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <SEOHead 
        title={`Accessoires - ${adminData.service_name} | Accessoires TV et Satellite en Tunisie`}
        description={`Découvrez notre collection de ${accessories.length} accessoires TV et satellite en Tunisie. Câbles HDMI, télécommandes, antennes, supports muraux et plus.`}
        keywords="accessoires TV Tunisie, câbles HDMI, télécommandes, antennes satellite, supports muraux, TechnSat accessoires"
      />
      
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(109,40,217,0.1),transparent_50%)]"></div>
      </div>

      <Header onAdminClick={onAdminClick} serviceName={adminData.service_name} />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Settings className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Accessoires
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Complétez votre installation avec nos accessoires de qualité professionnelle. 
            Câbles, télécommandes, antennes et supports pour une expérience optimale.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>{accessories.filter(acc => acc.is_available).length} Disponibles</span>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-purple-400" />
              <span>{accessories.length} Produits</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Qualité Pro</span>
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
                placeholder="Rechercher des accessoires..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 backdrop-blur-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm backdrop-blur-sm focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all" className="bg-gray-800">Toutes Catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">
                      {getCategoryName(category)}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm backdrop-blur-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="all" className="bg-gray-800">Tous</option>
                <option value="available" className="bg-gray-800">Disponibles</option>
                <option value="unavailable" className="bg-gray-800">Rupture</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm backdrop-blur-sm focus:ring-2 focus:ring-purple-500"
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
                      ? 'bg-purple-500/30 text-purple-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-purple-500/30 text-purple-400' 
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
        {filteredAccessories.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 max-w-md mx-auto">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Aucun Accessoire Trouvé</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm ? 'Essayez d\'ajuster vos termes de recherche.' : 'Aucun accessoire disponible pour le moment.'}
              </p>
              {(searchTerm || filterCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                    setFilterAvailable('all');
                  }}
                  className="text-purple-400 hover:text-purple-300 text-sm"
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
                Affichage de {filteredAccessories.length} sur {accessories.length} accessoires
              </p>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAccessories.map((accessory) => (
                  <div
                    key={accessory.id}
                    className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-purple-400/30 transition-all duration-300 transform hover:scale-105 hover:bg-white/10 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden rounded-t-2xl">
                      <img 
                        src={accessory.image_url} 
                        alt={accessory.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=400';
                        }}
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                          {getCategoryIcon(accessory.category)}
                          <span>{getCategoryName(accessory.category)}</span>
                        </div>
                      </div>

                      {/* Availability Badge */}
                      <div className="absolute top-3 right-3">
                        {accessory.is_available ? (
                          <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Stock</span>
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
                        <div className="bg-black/80 backdrop-blur-sm border-2 border-purple-400 text-white px-3 py-2 rounded-xl font-bold text-lg shadow-lg">
                          {accessory.price}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-200 mb-2">
                        {accessory.name}
                      </h3>
                      {accessory.description && (
                        <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                          {accessory.description}
                        </p>
                      )}

                      {/* Purchase Button */}
                      <button
                        onClick={() => handlePurchase(accessory)}
                        disabled={!accessory.is_available}
                        className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105 border ${
                          accessory.is_available
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white hover:shadow-purple-500/25 border-purple-500/30'
                            : 'bg-gray-600/20 text-gray-500 cursor-not-allowed border-gray-500/30'
                        }`}
                      >
                        {accessory.is_available ? (
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
                {filteredAccessories.map((accessory) => (
                  <div
                    key={accessory.id}
                    className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:bg-white/10 p-6 flex items-center space-x-6"
                  >
                    {/* Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl">
                      <img 
                        src={accessory.image_url} 
                        alt={accessory.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=400';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-200">
                            {accessory.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="bg-purple-500/20 border border-purple-500/30 text-purple-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                              {getCategoryIcon(accessory.category)}
                              <span>{getCategoryName(accessory.category)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-xl font-bold text-purple-400">{accessory.price}</div>
                          {accessory.is_available ? (
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
                      
                      {accessory.description && (
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {accessory.description}
                        </p>
                      )}
                    </div>

                    {/* Purchase Button */}
                    <button
                      onClick={() => handlePurchase(accessory)}
                      disabled={!accessory.is_available}
                      className={`flex-shrink-0 font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                        accessory.is_available
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white'
                          : 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {accessory.is_available ? (
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

export default AccessoriesPage;