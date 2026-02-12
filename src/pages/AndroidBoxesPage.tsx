import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { AndroidBox, AdminData } from '../types';
import { Monitor, MessageCircle, Filter, Grid2x2 as Grid, List, Search, CheckCircle, XCircle, Cpu, Wifi, Star, ArrowRight } from 'lucide-react';

interface AndroidBoxesPageProps {
  boxes: AndroidBox[];
  adminData: AdminData;
  onAdminClick: () => void;
}

const AndroidBoxesPage: React.FC<AndroidBoxesPageProps> = ({
  boxes,
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

  // Filter and sort boxes
  const filteredBoxes = boxes
    .filter(box => {
      const matchesSearch = box.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           box.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           box.specifications.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAvailability = filterAvailable === 'all' || 
                                 (filterAvailable === 'available' && box.is_available) ||
                                 (filterAvailable === 'unavailable' && !box.is_available);
      
      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          // Extract numeric value from price for sorting
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
        title={`Android TV Boxes - ${adminData.service_name} | Premium Streaming Devices in Tunisia`}
        description={`Discover our collection of ${boxes.length} premium Android TV boxes in Tunisia. 4K streaming, high performance, and reliable support. Find the perfect streaming device for your needs.`}
        keywords="Android TV Box Tunisia, 4K streaming device, Android box Tunisia, TV streaming, media player, TechnSat boxes, premium Android TV"
      />
      
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,69,0,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,140,0,0.1),transparent_50%)]"></div>
      </div>

      <Header onAdminClick={onAdminClick} serviceName={adminData.service_name} />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Monitor className="w-8 h-8 md:w-10 md:h-10 text-orange-400" />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Android TV Boxes
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Transform your TV into a smart entertainment hub with our premium Android TV boxes. 
            High-performance streaming devices for the ultimate viewing experience in Tunisia.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>{boxes.filter(box => box.is_available).length} Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-orange-400" />
              <span>{boxes.length} Total Models</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Premium Quality</span>
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
                placeholder="Search Android boxes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 backdrop-blur-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterAvailable}
                  onChange={(e) => setFilterAvailable(e.target.value as any)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm backdrop-blur-sm focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all" className="bg-gray-800">All Boxes</option>
                  <option value="available" className="bg-gray-800">Available</option>
                  <option value="unavailable" className="bg-gray-800">Out of Stock</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm backdrop-blur-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="newest" className="bg-gray-800">Newest First</option>
                <option value="name" className="bg-gray-800">Name A-Z</option>
                <option value="price" className="bg-gray-800">Price Low-High</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/10 rounded-lg p-1 border border-white/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-orange-500/30 text-orange-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-orange-500/30 text-orange-400' 
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
        {filteredBoxes.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 max-w-md mx-auto">
              <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Boxes Found</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm ? 'Try adjusting your search terms or filters.' : 'No Android boxes available at the moment.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterAvailable('all');
                  }}
                  className="text-orange-400 hover:text-orange-300 text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">
                Showing {filteredBoxes.length} of {boxes.length} Android boxes
              </p>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBoxes.map((box) => (
                  <Link
                    key={box.id}
                    to={`/android-boxes/${box.id}`}
                    className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-orange-400/30 transition-all duration-300 transform hover:scale-105 hover:bg-white/10 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden rounded-t-2xl">
                      <img 
                        src={box.image_url} 
                        alt={box.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400';
                        }}
                      />
                      
                      {/* Availability Badge */}
                      <div className="absolute top-3 right-3">
                        {box.is_available ? (
                          <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>In Stock</span>
                          </div>
                        ) : (
                          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                            <XCircle className="w-3 h-3" />
                            <span>Out of Stock</span>
                          </div>
                        )}
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-3 left-3">
                        <div className="bg-black/80 backdrop-blur-sm border-2 border-orange-400 text-white px-3 py-2 rounded-xl font-bold text-lg shadow-lg">
                          {box.price}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200 mb-2">
                        {box.name}
                      </h3>
                      {box.description && (
                        <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                          {box.description}
                        </p>
                      )}
                      
                      {/* Quick Specs */}
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <Cpu className="w-3 h-3" />
                          <span>Android</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Wifi className="w-3 h-3" />
                          <span>WiFi</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Monitor className="w-3 h-3" />
                          <span>4K</span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <div className="flex items-center justify-between">
                        <span className="text-orange-400 text-sm font-medium group-hover:text-orange-300">
                          View Details
                        </span>
                        <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredBoxes.map((box) => (
                  <Link
                    key={box.id}
                    to={`/android-boxes/${box.id}`}
                    className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-orange-400/30 transition-all duration-300 hover:bg-white/10 p-6 flex items-center space-x-6"
                  >
                    {/* Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl">
                      <img 
                        src={box.image_url} 
                        alt={box.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
                          {box.name}
                        </h3>
                        <div className="flex items-center space-x-3">
                          <div className="text-xl font-bold text-orange-400">{box.price}</div>
                          {box.is_available ? (
                            <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Available</span>
                            </div>
                          ) : (
                            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                              <XCircle className="w-3 h-3" />
                              <span>Out of Stock</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {box.description && (
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {box.description}
                        </p>
                      )}
                      
                      {box.specifications && (
                        <p className="text-gray-400 text-xs line-clamp-1">
                          {box.specifications}
                        </p>
                      )}
                    </div>

                    <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0" />
                  </Link>
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

export default AndroidBoxesPage;