import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'app.title': 'Land Registry DApp',
    'app.tagline': 'Search, Store, Secure Your Land',
    'app.subtitle': 'Blockchain Verified Records',
    
    // Navigation
    'nav.search': 'Search',
    'nav.addLand': 'Add Your Land',
    'nav.myLands': 'Know Your Land',
    'nav.council': 'Council',
    'nav.contact': 'Contact',
    'nav.about': 'About',
    'nav.connectWallet': 'Connect Wallet',
    
    // Search tabs
    'search.khasraId': 'Khasra ID',
    'search.khasraNumber': 'Khasra Number',
    'search.ownerName': 'Owner Name',
    'search.button': 'SEARCH',
    'search.reset': 'RESET',
    'search.district': 'District',
    'search.tehsil': 'Tehsil',
    'search.village': 'Village',
    
    // Status
    'status.pending': 'Pending',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.disputed': 'Disputed',
    
    // Common
    'common.area': 'Area',
    'common.owner': 'Owner',
    'common.view': 'VIEW',
    'common.contact': 'CONTACT',
    'common.dispute': 'DISPUTE',
    'common.submit': 'SUBMIT',
    'common.cancel': 'CANCEL',
  },
  hi: {
    // Header
    'app.title': 'भूमि रजिस्ट्री डैप',
    'app.tagline': 'खोजें, संरक्षित करें, स्वामित्व सुनिश्चित करें',
    'app.subtitle': 'ब्लॉकचेन सत्यापित रिकॉर्ड',
    
    // Navigation
    'nav.search': 'खोजें',
    'nav.addLand': 'अपनी भूमि जोड़ें',
    'nav.myLands': 'अपनी भूमि जानें',
    'nav.council': 'परिषद',
    'nav.contact': 'संपर्क',
    'nav.about': 'बारे में',
    'nav.connectWallet': 'वॉलेट कनेक्ट करें',
    
    // Search tabs
    'search.khasraId': 'खसरा आईडी',
    'search.khasraNumber': 'खसरा संख्या',
    'search.ownerName': 'मालिक का नाम',
    'search.button': 'खोजें',
    'search.reset': 'रीसेट',
    'search.district': 'जिला',
    'search.tehsil': 'तहसील',
    'search.village': 'गाँव',
    
    // Status
    'status.pending': 'लंबित',
    'status.approved': 'स्वीकृत',
    'status.rejected': 'अस्वीकृत',
    'status.disputed': 'विवादित',
    
    // Common
    'common.area': 'क्षेत्रफल',
    'common.owner': 'मालिक',
    'common.view': 'देखें',
    'common.contact': 'संपर्क करें',
    'common.dispute': 'विवाद',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
