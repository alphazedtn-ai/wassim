import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'ar' as Language, name: 'العربية', flag: '🇹🇳' },
    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-2 md:px-3 py-2 transition-all duration-200 backdrop-blur-sm">
        <Languages className="w-4 h-4 text-gray-300" />
        <span className="text-sm text-gray-300 hidden sm:inline">
          {languages.find(lang => lang.code === language)?.flag}
        </span>
        <span className="text-lg sm:hidden">
          {languages.find(lang => lang.code === language)?.flag}
        </span>
      </button>
      
      <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[140px] max-w-[200px]">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 text-left hover:bg-white/10 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl ${
              language === lang.code ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300'
            }`}
          >
            <span className="text-base md:text-lg">{lang.flag}</span>
            <span className="text-xs md:text-sm font-medium truncate">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;