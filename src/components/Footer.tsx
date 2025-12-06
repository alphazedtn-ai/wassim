import React from 'react';
import { MessageCircle, Facebook, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/21655338664', '_blank');
  };

  const handleFacebookClick = () => {
    window.open('https://www.facebook.com/profile.php?id=61579941277703', '_blank');
  };

  const handleTikTokClick = () => {
    window.open('https://www.tiktok.com/@technsat.chez.was', '_blank');
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
              {t('footer.trustedProvider')}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">{t('footer.contactInfo')}</h4>
            <div className="space-y-3">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">+216 55 338 664</span>
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">{t('footer.availableWhatsApp')}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">{t('footer.getInTouch')}</h4>
            <div className="space-y-3">
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t('common.contactWhatsApp')}</span>
              </button>
              
              <button
                onClick={handleFacebookClick}
                className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-sm"
              >
                <Facebook className="w-5 h-5" />
                <span>{t('common.visitFacebook')}</span>
              </button>
              
              <button
                onClick={handleTikTokClick}
                className="w-full bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 border border-pink-500/30 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span>{t('common.visitTikTok')}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;