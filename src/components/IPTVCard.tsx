import React from 'react';
import { Download, Smartphone, ExternalLink } from 'lucide-react';
import { IPTVOffer } from '../types';

interface IPTVCardProps {
  offer: IPTVOffer;
}

const IPTVCard: React.FC<IPTVCardProps> = ({ offer }) => {
  const handleDownload = () => {
    if (offer.download_url && offer.download_url.trim() !== '') {
      // Check if it's a valid URL
      try {
        const url = new URL(offer.download_url);
        window.open(offer.download_url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        // If not a valid URL, treat as WhatsApp fallback
        window.open('https://wa.me/21655338664', '_blank', 'noopener,noreferrer');
      }
    } else {
      // Fallback to WhatsApp if no download URL is set
      window.open('https://wa.me/21655338664', '_blank', 'noopener,noreferrer');
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getButtonText = () => {
    if (offer.download_url && offer.download_url.trim() !== '' && isValidUrl(offer.download_url)) {
      if (offer.download_url.includes('wa.me') || offer.download_url.includes('whatsapp')) {
        return 'Contact on WhatsApp';
      }
      return 'Download App';
    }
    return 'Contact for Download';
  };

  const getButtonIcon = () => {
    if (offer.download_url && offer.download_url.includes('wa.me')) {
      return <ExternalLink className="w-5 h-5" />;
    }
    return <Download className="w-5 h-5" />;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:bg-white/10 group overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
              <Smartphone className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                {offer.name}
              </h3>
              <p className="text-sm text-gray-400">IPTV App</p>
            </div>
          </div>
          {offer.price && offer.price.trim() !== '' && (
            <div className="text-right">
              <div className="text-xl font-bold text-blue-400">{offer.price}</div>
            </div>
          )}
        </div>
        
        {offer.description && (
          <p className="text-gray-300 mb-3 text-sm line-clamp-2">{offer.description}</p>
        )}
        
        <button
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-500/25 transform hover:scale-105 border border-red-500/30"
        >
          {getButtonIcon()}
          <span>{getButtonText()}</span>
        </button>
      </div>
    </div>
  );
};

export default IPTVCard;