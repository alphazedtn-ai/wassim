import React from 'react';
import { MessageCircle, Facebook, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/21655338664', '_blank');
  };

  const handleFacebookClick = () => {
    window.open('https://www.facebook.com/profile.php?id=61577832911325', '_blank');
  };

  return (
    <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="https://i.postimg.cc/prMmry13/506597284-710079311885276-7394493161693276837-n.jpg" 
                alt="TechnSat Logo" 
                className="h-10 w-10 rounded-full object-cover border-2 border-blue-400/50"
              />
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TechnSat chez Wassim
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted provider for premium IPTV services with international content and reliable streaming.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">+216 55 338 664</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Available on WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Get in Touch</h4>
            <div className="space-y-3">
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Contact via WhatsApp</span>
              </button>
              
              <button
                onClick={handleFacebookClick}
                className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-sm"
              >
                <Facebook className="w-5 h-5" />
                <span>Visit Facebook Page</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 TechnSat chez Wassim. All rights reserved. | Premium IPTV Services
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;