import { Link } from 'react-router-dom';
import { Globe, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

export const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleWalletConnect = () => {
    // Mock wallet connection
    if (!walletConnected) {
      setWalletAddress('0x1a2b...3c4d');
      setWalletConnected(true);
    } else {
      setWalletAddress('');
      setWalletConnected(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-card parchment shadow-md">
      <div className="container mx-auto px-4 py-4">
        {/* Top bar with title and utilities */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="text-4xl">🏛️</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                {t('app.title')}
              </h1>
              <p className="text-sm text-muted-foreground hidden md:block">
                {t('app.tagline')}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'हिंदी' : 'English'}
            </Button>

            {/* Wallet Connect */}
            <Button
              variant={walletConnected ? 'secondary' : 'default'}
              size="sm"
              onClick={handleWalletConnect}
              className="gap-2"
            >
              <Wallet className="w-4 h-4" />
              {walletConnected ? walletAddress : t('nav.connectWallet')}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-2 justify-center md:justify-start">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              🔍 {t('nav.search')}
            </Button>
          </Link>
          <Link to="/add-land">
            <Button variant="ghost" size="sm" className="gap-2">
              ➕ {t('nav.addLand')}
            </Button>
          </Link>
          <Link to="/my-lands">
            <Button variant="ghost" size="sm" className="gap-2">
              📋 {t('nav.myLands')}
            </Button>
          </Link>
          <Link to="/council">
            <Button variant="ghost" size="sm" className="gap-2">
              🧑‍💼 {t('nav.council')}
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" size="sm" className="gap-2">
              📞 {t('nav.contact')}
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost" size="sm" className="gap-2">
              ℹ️ {t('nav.about')}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
