import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  onAdminClick: () => void;
  serviceName: string;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick, serviceName }) => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
              <img 
                src="https://i.postimg.cc/prMmry13/506597284-710079311885276-7394493161693276837-n.jpg" 
                alt="TechnSat Logo" 
                className="h-12 w-12 rounded-full object-cover border-2 border-blue-400/50 shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {serviceName}
                </h1>
                <p className="text-sm text-gray-300">Premium IPTV Services</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Navigation */}
            <nav className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === '/' 
                    ? 'text-blue-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/android-boxes" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname.startsWith('/android-boxes') 
                    ? 'text-orange-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {t('nav.androidBoxes')}
              </Link>
              <Link 
                to="/satellite-receivers" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname.startsWith('/satellite-receivers') 
                    ? 'text-blue-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Récepteurs Satellite
              </Link>
              <Link 
                to="/accessories" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname.startsWith('/accessories') 
                    ? 'text-purple-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Accessoires
              </Link>
            </nav>
            
            {/* Mobile Navigation */}
            <nav className={`md:hidden flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <Link 
                to="/" 
                className={`text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === '/' 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/android-boxes" 
                className={`text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname.startsWith('/android-boxes') 
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {t('nav.androidBoxes')}
              </Link>
              <Link 
                to="/satellite-receivers" 
                className={`text-xs font-medium px-2 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname.startsWith('/satellite-receivers') 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Satellite
              </Link>
              <Link 
                to="/accessories" 
                className={`text-xs font-medium px-2 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname.startsWith('/accessories') 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Access.
              </Link>
            </nav>
            
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Admin Button */}
            <button
              onClick={onAdminClick}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 group border border-white/20"
              title="Admin Panel"
            >
              <Settings className="w-6 h-6 text-gray-300 group-hover:text-blue-400 transition-colors duration-200" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;