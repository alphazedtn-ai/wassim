import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.androidBoxes': 'Android TV Boxes',
    'nav.adminPanel': 'Admin Panel',
    
    // Hero Section
    'hero.title': 'Premium IPTV & Android Boxes in Tunisia',
    'hero.subtitle': 'Experience high-quality streaming with our carefully curated IPTV packages and premium Android TV boxes. Serving Tunisia with reliable 4K streaming and international content.',
    'hero.getStarted': 'Get Started on WhatsApp',
    
    // Stats
    'stats.iptvApps': 'IPTV Apps',
    'stats.androidBoxes': 'Android Boxes',
    'stats.support': 'Support',
    'stats.ultraHD': 'Ultra HD',
    
    // Sections
    'section.iptvApps': 'IPTV Applications',
    'section.iptvAppsDesc': 'Premium IPTV apps with international content and reliable streaming quality for Tunisia.',
    'section.featuredBoxes': 'Featured Android TV Boxes',
    'section.featuredBoxesDesc': 'High-performance Android boxes for the ultimate streaming experience in Tunisia.',
    'section.whyChoose': 'Why Choose TechnSat?',
    'section.whyChooseDesc': 'Premium features that set us apart in Tunisia',
    
    // Features
    'feature.lightningFast': 'Lightning Fast',
    'feature.lightningFastDesc': 'High-speed streaming with minimal buffering and maximum uptime.',
    'feature.globalContent': 'Global Content',
    'feature.globalContentDesc': 'Access international channels and premium content worldwide.',
    'feature.secureReliable': 'Secure & Reliable',
    'feature.secureReliableDesc': 'Protected streaming with enterprise-grade security measures.',
    'feature.support247': '24/7 Support',
    'feature.support247Desc': 'Round-the-clock customer support via WhatsApp assistance.',
    
    // Android Boxes
    'boxes.title': 'Android TV Boxes',
    'boxes.subtitle': 'Transform your TV into a smart entertainment hub with our premium Android TV boxes. High-performance streaming devices for the ultimate viewing experience in Tunisia.',
    'boxes.available': 'Available',
    'boxes.totalModels': 'Total Models',
    'boxes.premiumQuality': 'Premium Quality',
    'boxes.search': 'Search Android boxes...',
    'boxes.allBoxes': 'All Boxes',
    'boxes.outOfStock': 'Out of Stock',
    'boxes.newestFirst': 'Newest First',
    'boxes.nameAZ': 'Name A-Z',
    'boxes.priceLowHigh': 'Price Low-High',
    'boxes.showing': 'Showing',
    'boxes.of': 'of',
    'boxes.androidBoxes': 'Android boxes',
    'boxes.noBoxesFound': 'No Boxes Found',
    'boxes.tryAdjusting': 'Try adjusting your search terms or filters.',
    'boxes.noBoxesAvailable': 'No Android boxes available at the moment.',
    'boxes.clearFilters': 'Clear filters',
    'boxes.inStock': 'In Stock',
    'boxes.viewDetails': 'View Details',
    'boxes.viewAll': 'View All',
    
    // Box Detail
    'boxDetail.specifications': 'Technical Specifications',
    'boxDetail.whyChoose': 'Why Choose This Box?',
    'boxDetail.highPerformance': 'High Performance',
    'boxDetail.highPerformanceDesc': 'Smooth 4K streaming with minimal buffering',
    'boxDetail.reliableSecure': 'Reliable & Secure',
    'boxDetail.reliableSecureDesc': 'Enterprise-grade security and stability',
    'boxDetail.support247': '24/7 Support',
    'boxDetail.support247Desc': 'Round-the-clock customer assistance',
    'boxDetail.readyToOrder': 'Ready to Order?',
    'boxDetail.getToday': 'Get your premium Android TV box today',
    'boxDetail.buyNow': 'Buy Now',
    'boxDetail.currentlyOutOfStock': 'Currently Out of Stock',
    'boxDetail.askQuestions': 'Ask Questions on WhatsApp',
    'boxDetail.youMightLike': 'You Might Also Like',
    'boxDetail.backToAll': 'Back to All Android Boxes',
    
    // Common
    'common.contactWhatsApp': 'Contact via WhatsApp',
    'common.visitFacebook': 'Visit Facebook Page',
    'common.visitTikTok': 'Visit TikTok Page',
    'common.downloadApp': 'Download App',
    'common.contactForDownload': 'Contact for Download',
    'common.contactOnWhatsApp': 'Contact on WhatsApp',
    'common.noAppsAvailable': 'No Apps Available',
    'common.checkBackSoon': 'Check back soon for new IPTV applications!',
    'common.noBoxesAvailable': 'No Boxes Available',
    'common.checkBackSoonBoxes': 'Check back soon for new Android TV boxes!',
    
    // Footer
    'footer.trustedProvider': 'Your trusted provider for premium IPTV services with international content and reliable streaming.',
    'footer.contactInfo': 'Contact Information',
    'footer.availableWhatsApp': 'Available on WhatsApp',
    'footer.getInTouch': 'Get in Touch',
    'footer.copyright': '© 2024 TechnSat chez Wassim. All rights reserved. | Premium IPTV Services',
    
    // Admin
    'admin.login': 'Admin Login',
    'admin.enterCredentials': 'Enter your credentials to access the admin panel',
    'admin.username': 'Username',
    'admin.password': 'Password',
    'admin.enterUsername': 'Enter username',
    'admin.enterPassword': 'Enter password',
    'admin.loggingIn': 'Logging in...',
    'admin.invalidCredentials': 'Invalid username or password',
  },
  
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.androidBoxes': 'أجهزة الأندرويد التلفزيونية',
    'nav.adminPanel': 'لوحة الإدارة',
    
    // Hero Section
    'hero.title': 'خدمات IPTV المميزة وأجهزة الأندرويد في تونس',
    'hero.subtitle': 'استمتع بالبث عالي الجودة مع باقات IPTV المختارة بعناية وأجهزة الأندرويد التلفزيونية المميزة. نخدم تونس ببث 4K موثوق ومحتوى عالمي.',
    'hero.getStarted': 'ابدأ عبر الواتساب',
    
    // Stats
    'stats.iptvApps': 'تطبيقات IPTV',
    'stats.androidBoxes': 'أجهزة الأندرويد',
    'stats.support': 'الدعم',
    'stats.ultraHD': 'فائق الوضوح',
    
    // Sections
    'section.iptvApps': 'تطبيقات IPTV',
    'section.iptvAppsDesc': 'تطبيقات IPTV مميزة مع محتوى عالمي وجودة بث موثوقة لتونس.',
    'section.featuredBoxes': 'أجهزة الأندرويد التلفزيونية المميزة',
    'section.featuredBoxesDesc': 'أجهزة أندرويد عالية الأداء لتجربة البث المثلى في تونس.',
    'section.whyChoose': 'لماذا تختار TechnSat؟',
    'section.whyChooseDesc': 'ميزات مميزة تميزنا في تونس',
    
    // Features
    'feature.lightningFast': 'سرعة البرق',
    'feature.lightningFastDesc': 'بث عالي السرعة مع أقل تقطيع وأقصى وقت تشغيل.',
    'feature.globalContent': 'محتوى عالمي',
    'feature.globalContentDesc': 'الوصول إلى القنوات العالمية والمحتوى المميز في جميع أنحاء العالم.',
    'feature.secureReliable': 'آمن وموثوق',
    'feature.secureReliableDesc': 'بث محمي مع تدابير أمنية على مستوى المؤسسات.',
    'feature.support247': 'دعم 24/7',
    'feature.support247Desc': 'دعم العملاء على مدار الساعة عبر مساعدة الواتساب.',
    
    // Android Boxes
    'boxes.title': 'أجهزة الأندرويد التلفزيونية',
    'boxes.subtitle': 'حول تلفزيونك إلى مركز ترفيه ذكي مع أجهزة الأندرويد التلفزيونية المميزة. أجهزة بث عالية الأداء لتجربة المشاهدة المثلى في تونس.',
    'boxes.available': 'متوفر',
    'boxes.totalModels': 'إجمالي الموديلات',
    'boxes.premiumQuality': 'جودة مميزة',
    'boxes.search': 'البحث في أجهزة الأندرويد...',
    'boxes.allBoxes': 'جميع الأجهزة',
    'boxes.outOfStock': 'نفد المخزون',
    'boxes.newestFirst': 'الأحدث أولاً',
    'boxes.nameAZ': 'الاسم أ-ي',
    'boxes.priceLowHigh': 'السعر من الأقل للأعلى',
    'boxes.showing': 'عرض',
    'boxes.of': 'من',
    'boxes.androidBoxes': 'أجهزة أندرويد',
    'boxes.noBoxesFound': 'لم يتم العثور على أجهزة',
    'boxes.tryAdjusting': 'حاول تعديل مصطلحات البحث أو المرشحات.',
    'boxes.noBoxesAvailable': 'لا توجد أجهزة أندرويد متاحة في الوقت الحالي.',
    'boxes.clearFilters': 'مسح المرشحات',
    'boxes.inStock': 'متوفر',
    'boxes.viewDetails': 'عرض التفاصيل',
    'boxes.viewAll': 'عرض الكل',
    
    // Box Detail
    'boxDetail.specifications': 'المواصفات التقنية',
    'boxDetail.whyChoose': 'لماذا تختار هذا الجهاز؟',
    'boxDetail.highPerformance': 'أداء عالي',
    'boxDetail.highPerformanceDesc': 'بث 4K سلس مع أقل تقطيع',
    'boxDetail.reliableSecure': 'موثوق وآمن',
    'boxDetail.reliableSecureDesc': 'أمان واستقرار على مستوى المؤسسات',
    'boxDetail.support247': 'دعم 24/7',
    'boxDetail.support247Desc': 'مساعدة العملاء على مدار الساعة',
    'boxDetail.readyToOrder': 'جاهز للطلب؟',
    'boxDetail.getToday': 'احصل على جهاز الأندرويد التلفزيوني المميز اليوم',
    'boxDetail.buyNow': 'اشتري الآن',
    'boxDetail.currentlyOutOfStock': 'نفد المخزون حالياً',
    'boxDetail.askQuestions': 'اسأل أسئلة على الواتساب',
    'boxDetail.youMightLike': 'قد يعجبك أيضاً',
    'boxDetail.backToAll': 'العودة إلى جميع أجهزة الأندرويد',
    
    // Common
    'common.contactWhatsApp': 'تواصل عبر الواتساب',
    'common.visitFacebook': 'زيارة صفحة الفيسبوك',
    'common.visitTikTok': 'زيارة صفحة التيك توك',
    'common.downloadApp': 'تحميل التطبيق',
    'common.contactForDownload': 'تواصل للتحميل',
    'common.contactOnWhatsApp': 'تواصل على الواتساب',
    'common.noAppsAvailable': 'لا توجد تطبيقات متاحة',
    'common.checkBackSoon': 'تحقق مرة أخرى قريباً للحصول على تطبيقات IPTV جديدة!',
    'common.noBoxesAvailable': 'لا توجد أجهزة متاحة',
    'common.checkBackSoonBoxes': 'تحقق مرة أخرى قريباً للحصول على أجهزة أندرويد جديدة!',
    
    // Footer
    'footer.trustedProvider': 'مزودك الموثوق لخدمات IPTV المميزة مع المحتوى العالمي والبث الموثوق.',
    'footer.contactInfo': 'معلومات الاتصال',
    'footer.availableWhatsApp': 'متاح على الواتساب',
    'footer.getInTouch': 'تواصل معنا',
    'footer.copyright': '© 2024 TechnSat chez Wassim. جميع الحقوق محفوظة. | خدمات IPTV المميزة',
    
    // Admin
    'admin.login': 'تسجيل دخول الإدارة',
    'admin.enterCredentials': 'أدخل بيانات الاعتماد للوصول إلى لوحة الإدارة',
    'admin.username': 'اسم المستخدم',
    'admin.password': 'كلمة المرور',
    'admin.enterUsername': 'أدخل اسم المستخدم',
    'admin.enterPassword': 'أدخل كلمة المرور',
    'admin.loggingIn': 'جاري تسجيل الدخول...',
    'admin.invalidCredentials': 'اسم المستخدم أو كلمة المرور غير صحيحة',
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.androidBoxes': 'Boîtiers Android TV',
    'nav.adminPanel': 'Panneau Admin',
    
    // Hero Section
    'hero.title': 'Services IPTV Premium et Boîtiers Android en Tunisie',
    'hero.subtitle': 'Découvrez le streaming haute qualité avec nos packages IPTV soigneusement sélectionnés et nos boîtiers Android TV premium. Nous servons la Tunisie avec un streaming 4K fiable et du contenu international.',
    'hero.getStarted': 'Commencer sur WhatsApp',
    
    // Stats
    'stats.iptvApps': 'Apps IPTV',
    'stats.androidBoxes': 'Boîtiers Android',
    'stats.support': 'Support',
    'stats.ultraHD': 'Ultra HD',
    
    // Sections
    'section.iptvApps': 'Applications IPTV',
    'section.iptvAppsDesc': 'Applications IPTV premium avec contenu international et qualité de streaming fiable pour la Tunisie.',
    'section.featuredBoxes': 'Boîtiers Android TV en Vedette',
    'section.featuredBoxesDesc': 'Boîtiers Android haute performance pour l\'expérience de streaming ultime en Tunisie.',
    'section.whyChoose': 'Pourquoi Choisir TechnSat?',
    'section.whyChooseDesc': 'Fonctionnalités premium qui nous distinguent en Tunisie',
    
    // Features
    'feature.lightningFast': 'Rapide comme l\'Éclair',
    'feature.lightningFastDesc': 'Streaming haute vitesse avec mise en mémoire tampon minimale et temps de fonctionnement maximal.',
    'feature.globalContent': 'Contenu Global',
    'feature.globalContentDesc': 'Accédez aux chaînes internationales et au contenu premium dans le monde entier.',
    'feature.secureReliable': 'Sécurisé et Fiable',
    'feature.secureReliableDesc': 'Streaming protégé avec des mesures de sécurité de niveau entreprise.',
    'feature.support247': 'Support 24/7',
    'feature.support247Desc': 'Support client 24h/24 via assistance WhatsApp.',
    
    // Android Boxes
    'boxes.title': 'Boîtiers Android TV',
    'boxes.subtitle': 'Transformez votre TV en centre de divertissement intelligent avec nos boîtiers Android TV premium. Appareils de streaming haute performance pour l\'expérience de visionnage ultime en Tunisie.',
    'boxes.available': 'Disponible',
    'boxes.totalModels': 'Modèles Totaux',
    'boxes.premiumQuality': 'Qualité Premium',
    'boxes.search': 'Rechercher des boîtiers Android...',
    'boxes.allBoxes': 'Tous les Boîtiers',
    'boxes.outOfStock': 'Rupture de Stock',
    'boxes.newestFirst': 'Plus Récent d\'Abord',
    'boxes.nameAZ': 'Nom A-Z',
    'boxes.priceLowHigh': 'Prix Bas-Haut',
    'boxes.showing': 'Affichage',
    'boxes.of': 'de',
    'boxes.androidBoxes': 'boîtiers Android',
    'boxes.noBoxesFound': 'Aucun Boîtier Trouvé',
    'boxes.tryAdjusting': 'Essayez d\'ajuster vos termes de recherche ou filtres.',
    'boxes.noBoxesAvailable': 'Aucun boîtier Android disponible pour le moment.',
    'boxes.clearFilters': 'Effacer les filtres',
    'boxes.inStock': 'En Stock',
    'boxes.viewDetails': 'Voir Détails',
    'boxes.viewAll': 'Voir Tout',
    
    // Box Detail
    'boxDetail.specifications': 'Spécifications Techniques',
    'boxDetail.whyChoose': 'Pourquoi Choisir ce Boîtier?',
    'boxDetail.highPerformance': 'Haute Performance',
    'boxDetail.highPerformanceDesc': 'Streaming 4K fluide avec mise en mémoire tampon minimale',
    'boxDetail.reliableSecure': 'Fiable et Sécurisé',
    'boxDetail.reliableSecureDesc': 'Sécurité et stabilité de niveau entreprise',
    'boxDetail.support247': 'Support 24/7',
    'boxDetail.support247Desc': 'Assistance client 24h/24',
    'boxDetail.readyToOrder': 'Prêt à Commander?',
    'boxDetail.getToday': 'Obtenez votre boîtier Android TV premium aujourd\'hui',
    'boxDetail.buyNow': 'Acheter Maintenant',
    'boxDetail.currentlyOutOfStock': 'Actuellement en Rupture de Stock',
    'boxDetail.askQuestions': 'Poser des Questions sur WhatsApp',
    'boxDetail.youMightLike': 'Vous Pourriez Aussi Aimer',
    'boxDetail.backToAll': 'Retour à Tous les Boîtiers Android',
    
    // Common
    'common.contactWhatsApp': 'Contacter via WhatsApp',
    'common.visitFacebook': 'Visiter la Page Facebook',
    'common.visitTikTok': 'Visiter la Page TikTok',
    'common.downloadApp': 'Télécharger l\'App',
    'common.contactForDownload': 'Contacter pour Télécharger',
    'common.contactOnWhatsApp': 'Contacter sur WhatsApp',
    'common.noAppsAvailable': 'Aucune App Disponible',
    'common.checkBackSoon': 'Revenez bientôt pour de nouvelles applications IPTV!',
    'common.noBoxesAvailable': 'Aucun Boîtier Disponible',
    'common.checkBackSoonBoxes': 'Revenez bientôt pour de nouveaux boîtiers Android!',
    
    // Footer
    'footer.trustedProvider': 'Votre fournisseur de confiance pour les services IPTV premium avec contenu international et streaming fiable.',
    'footer.contactInfo': 'Informations de Contact',
    'footer.availableWhatsApp': 'Disponible sur WhatsApp',
    'footer.getInTouch': 'Entrer en Contact',
    'footer.copyright': '© 2024 TechnSat chez Wassim. Tous droits réservés. | Services IPTV Premium',
    
    // Admin
    'admin.login': 'Connexion Admin',
    'admin.enterCredentials': 'Entrez vos identifiants pour accéder au panneau d\'administration',
    'admin.username': 'Nom d\'utilisateur',
    'admin.password': 'Mot de passe',
    'admin.enterUsername': 'Entrez le nom d\'utilisateur',
    'admin.enterPassword': 'Entrez le mot de passe',
    'admin.loggingIn': 'Connexion en cours...',
    'admin.invalidCredentials': 'Nom d\'utilisateur ou mot de passe invalide',
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'ar', 'fr'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem('language', language);
    
    // Update document direction for RTL languages
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};