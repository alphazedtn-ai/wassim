import React from 'react';
import { ShoppingCart, Monitor, CheckCircle, XCircle, Cpu } from 'lucide-react';
import { AndroidBox } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AndroidBoxCardProps {
  box: AndroidBox;
}

const AndroidBoxCard: React.FC<AndroidBoxCardProps> = ({ box }) => {
  const { t } = useLanguage();

  const handlePurchase = () => {
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

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:bg-white/10 group overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        <img 
          src={box.image_url} 
          alt={box.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
        <div className="absolute top-3 right-3">
          {box.is_available ? (
            <div className="bg-black/80 backdrop-blur-sm border border-green-400 text-green-300 px-2 py-1 rounded-full text-xs flex items-center space-x-1 shadow-lg">
              <CheckCircle className="w-3 h-3" />
              <span>Available</span>
            </div>
          ) : (
            <div className="bg-black/80 backdrop-blur-sm border border-red-400 text-red-300 px-2 py-1 rounded-full text-xs flex items-center space-x-1 shadow-lg">
              <XCircle className="w-3 h-3" />
              <span>Out of Stock</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-white/10">
              <Monitor className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
                {box.name}
              </h3>
              <p className="text-sm text-gray-400">{t('boxes.androidBoxes')}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-orange-400">{box.price}</div>
          </div>
        </div>
        
        {/* Description */}
        {box.description && (
          <p className="text-gray-300 mb-3 text-sm line-clamp-2">{box.description}</p>
        )}

        {/* Specifications */}
        {box.specifications && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">{t('boxDetail.specifications')}</span>
            </div>
            <p className="text-xs text-gray-300 line-clamp-3 break-words">{box.specifications}</p>
          </div>
        )}
        
        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={!box.is_available}
          className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105 border ${
            box.is_available
              ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white hover:shadow-orange-500/25 border-orange-500/30'
              : 'bg-gray-600/20 text-gray-500 cursor-not-allowed border-gray-500/30'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{box.is_available ? t('boxDetail.buyNow') : t('boxes.outOfStock')}</span>
        </button>
      </div>
    </div>
  );
};

export default AndroidBoxCard;