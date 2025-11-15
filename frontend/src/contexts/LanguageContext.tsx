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

        // Login
    'login.userLogin': 'User Login',
    'login.councilLogin': 'Council Login',
    'login.enterName': 'Enter your name',
    'login.enterWallet': 'Enter your wallet address',

    // Council Dashboard
    'council.dashboard': 'Council Dashboard',
    'council.totalParcels': 'Total Parcels',
    'council.pending': 'Pending',
    'council.approved': 'Approved',
    'council.rejected': 'Rejected',
    'council.disputed': 'Disputed',
    'council.queue': 'Pending Parcels Queue',
    'council.review': 'Review and approve land claims',
    'council.actions': 'Actions',
    'council.approve': 'Approve',
    'council.reject': 'Reject',
    'council.dispute': 'Dispute',

    // Add Land
    'add.title': 'Add Land Details',
    'add.khasraNumber': 'Khasra Number',
    'add.ownerName': 'Owner Name',
    'add.area': 'Area (sq. meters)',
    'add.uploadDocs': 'Upload Land Documents',
    'add.submit': 'Submit Land',

    // Contact
    'contact.title': 'Contact Directory',

    // Transfer Ownership
    'transfer.title': 'Transfer Ownership',
    'transfer.newOwner': 'New Owner Wallet Address',
    'transfer.confirm': 'Transfer',

    
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

        // Login
    'login.userLogin': 'उपयोगकर्ता लॉगिन',
    'login.councilLogin': 'परिषद लॉगिन',
    'login.enterName': 'अपना नाम दर्ज करें',
    'login.enterWallet': 'अपना वॉलेट पता दर्ज करें',

    // Council Dashboard
    'council.dashboard': 'परिषद डैशबोर्ड',
    'council.totalParcels': 'कुल भूमि',
    'council.pending': 'लंबित',
    'council.approved': 'स्वीकृत',
    'council.rejected': 'अस्वीकृत',
    'council.disputed': 'विवादित',
    'council.queue': 'लंबित भूमि सूची',
    'council.review': 'भूमि दावों की समीक्षा और स्वीकृति करें',
    'council.actions': 'क्रियाएँ',
    'council.approve': 'स्वीकृत करें',
    'council.reject': 'अस्वीकृत करें',
    'council.dispute': 'विवादित करें',

    // Add Land
    'add.title': 'भूमि विवरण जोड़ें',
    'add.khasraNumber': 'खसरा नंबर',
    'add.ownerName': 'मालिक का नाम',
    'add.area': 'क्षेत्रफल (वर्ग मीटर)',
    'add.uploadDocs': 'भूमि दस्तावेज़ अपलोड करें',
    'add.submit': 'भूमि सबमिट करें',

    // Contact
    'contact.title': 'संपर्क निर्देशिका',

    // Transfer Ownership
    'transfer.title': 'स्वामित्व हस्तांतरण',
    'transfer.newOwner': 'नए मालिक का वॉलेट पता',
    'transfer.confirm': 'हस्तांतरण करें',

    
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
