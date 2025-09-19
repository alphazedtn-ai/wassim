import React from 'react';
import { Settings } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
  serviceName: string;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick, serviceName }) => {
  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
          </div>
          
          <button
            onClick={onAdminClick}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 group border border-white/20"
            title="Admin Panel"
          >
            <Settings className="w-6 h-6 text-gray-300 group-hover:text-blue-400 transition-colors duration-200" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;