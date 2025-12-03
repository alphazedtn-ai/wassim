import React from 'react';
import { Monitor, Cpu, Wifi, Star, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { AndroidBox } from '../types';

interface AndroidBoxesShowcaseProps {
  boxes: AndroidBox[];
}

const AndroidBoxesShowcase: React.FC<AndroidBoxesShowcaseProps> = ({ boxes }) => {
  const handlePurchase = (box: AndroidBox) => {
    if (box.purchase_url && box.purchase_url.trim() !== '') {
      try {
        const url = new URL(box.purchase_url);
        window.open(box.purchase_url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        window.open('https://wa.me/21655338664', '_blank', 'noopener,noreferrer');
      }
    } else {
      window.open('https://wa.me/21655338664', '_blank', 'noopener,noreferrer');
    }
  };

  if (boxes.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-8 md:py-12 relative z-10">
      <div className="text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Monitor className="w-8 h-8 text-orange-400" />
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Premium Android TV Boxes
          </h2>
        </div>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Transform your TV into a smart entertainment hub with our high-performance Android boxes
        </p>
      </div>

      {/* Featured Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {boxes.slice(0, 4).map((box) => (
          <div
            key={box.id}
            className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-orange-400/30 transition-all duration-300 transform hover:scale-105 hover:bg-white/10 overflow-hidden"
          >
            {/* Image Section */}
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
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>In Stock</span>
                  </div>
                ) : (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                    <XCircle className="w-3 h-3" />
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Price Badge */}
              <div className="absolute bottom-3 left-3">
                <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-400 px-3 py-2 rounded-xl font-bold text-lg">
                  {box.price}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200 mb-2">
                  {box.name}
                </h3>
                {box.description && (
                  <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                    {box.description}
                  </p>
                )}
              </div>

              {/* Specifications */}
              {box.specifications && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Key Features</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {box.specifications}
                    </p>
                  </div>
                </div>
              )}

              {/* Features Icons */}
              <div className="flex items-center justify-center space-x-4 mb-4 py-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-1">
                  <Monitor className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-300">4K HDR</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-300">WiFi</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-gray-300">Premium</span>
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={() => handlePurchase(box)}
                disabled={!box.is_available}
                className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105 border ${
                  box.is_available
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white hover:shadow-orange-500/25 border-orange-500/30'
                    : 'bg-gray-600/20 text-gray-500 cursor-not-allowed border-gray-500/30'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{box.is_available ? 'Buy Now' : 'Out of Stock'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      {boxes.length > 4 && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              const androidBoxesSection = document.querySelector('[data-section="android-boxes"]');
              if (androidBoxesSection) {
                androidBoxesSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 text-orange-400 border border-orange-500/30 px-8 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto backdrop-blur-sm"
          >
            <Monitor className="w-5 h-5" />
            <span>View All {boxes.length} Android Boxes</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default AndroidBoxesShowcase;