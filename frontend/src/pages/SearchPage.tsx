import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParcel } from '@/contexts/ParcelContext';
import { useToast } from '@/hooks/use-toast';

const SearchPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { districts, searchParcels, setSearchResults } = useParcel();
  const { toast } = useToast();

  const [khasraIdSearch, setKhasraIdSearch] = useState({ id: '', district: '' });
  const [khasraNumberSearch, setKhasraNumberSearch] = useState({
    district: '',
    tehsil: '',
    village: '',
    number: '',
  });
  const [ownerSearch, setOwnerSearch] = useState({
    district: '',
    tehsil: '',
    name: '',
    statuses: [] as string[],
  });

  const handleSearch = () => {
    let results;

    // Determine which tab is active and search accordingly
    if (khasraIdSearch.id || khasraIdSearch.district) {
      results = searchParcels({
        khasraId: khasraIdSearch.id,
        district: khasraIdSearch.district,
      });
    } else if (khasraNumberSearch.district || khasraNumberSearch.number) {
      results = searchParcels({
        district: khasraNumberSearch.district,
        tehsil: khasraNumberSearch.tehsil,
        village: khasraNumberSearch.village,
        khasraNumber: khasraNumberSearch.number,
      });
    } else if (ownerSearch.name || ownerSearch.district) {
      results = searchParcels({
        district: ownerSearch.district,
        tehsil: ownerSearch.tehsil,
        ownerName: ownerSearch.name,
        statuses: ownerSearch.statuses,
      });
    } else {
      results = searchParcels({});
    }

    setSearchResults(results);
    
    toast({
      title: `${results.length} Records Found`,
      description: results.length === 0 ? 'Try adjusting your search criteria' : 'Showing search results',
    });
    
    navigate('/results');
  };

  const resetForm = (formType: string) => {
    if (formType === 'id') {
      setKhasraIdSearch({ id: '', district: '' });
    } else if (formType === 'number') {
      setKhasraNumberSearch({ district: '', tehsil: '', village: '', number: '' });
    } else {
      setOwnerSearch({ district: '', tehsil: '', name: '', statuses: [] });
    }
  };

  return (
    <div className="min-h-screen tribal-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 parchment rounded-lg p-8 vintage-border">
          <h1 className="text-5xl font-bold text-primary mb-4">
            🏛️ {t('app.title')}
          </h1>
          <p className="text-2xl text-secondary mb-2">{t('app.tagline')}</p>
          <p className="text-sm text-muted-foreground">[{t('app.subtitle')}]</p>
        </div>

        {/* Search Interface */}
        <Card className="max-w-4xl mx-auto vintage-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Search className="w-6 h-6" />
              {t('nav.search')} Land Records
            </CardTitle>
            <CardDescription>
              Search by Khasra ID, Khasra Number, or Owner Name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="id" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="id">🔢 {t('search.khasraId')}</TabsTrigger>
                <TabsTrigger value="number">📍 {t('search.khasraNumber')}</TabsTrigger>
                <TabsTrigger value="owner">👤 {t('search.ownerName')}</TabsTrigger>
              </TabsList>

              {/* Tab 1: Khasra ID Search */}
              <TabsContent value="id" className="space-y-4">
                <div>
                  <Label htmlFor="khasra-id">{t('search.khasraId')}</Label>
                  <Input
                    id="khasra-id"
                    placeholder="e.g., 42"
                    value={khasraIdSearch.id}
                    onChange={(e) => setKhasraIdSearch({ ...khasraIdSearch, id: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="district-id">{t('search.district')}</Label>
                  <Select
                    value={khasraIdSearch.district}
                    onValueChange={(value) => setKhasraIdSearch({ ...khasraIdSearch, district: value })}
                  >
                    <SelectTrigger id="district-id">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSearch} className="flex-1 gap-2">
                    <Search className="w-4 h-4" />
                    {t('search.button')}
                  </Button>
                  <Button variant="outline" onClick={() => resetForm('id')} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    {t('search.reset')}
                  </Button>
                </div>
              </TabsContent>

              {/* Tab 2: Khasra Number Search */}
              <TabsContent value="number" className="space-y-4">
                <div>
                  <Label htmlFor="district-num">{t('search.district')} *</Label>
                  <Select
                    value={khasraNumberSearch.district}
                    onValueChange={(value) =>
                      setKhasraNumberSearch({ ...khasraNumberSearch, district: value })
                    }
                  >
                    <SelectTrigger id="district-num">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tehsil-num">{t('search.tehsil')}</Label>
                  <Input
                    id="tehsil-num"
                    placeholder="Enter at least 3 characters"
                    value={khasraNumberSearch.tehsil}
                    onChange={(e) =>
                      setKhasraNumberSearch({ ...khasraNumberSearch, tehsil: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="village-num">{t('search.village')}</Label>
                  <Input
                    id="village-num"
                    placeholder="Enter at least 3 characters"
                    value={khasraNumberSearch.village}
                    onChange={(e) =>
                      setKhasraNumberSearch({ ...khasraNumberSearch, village: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="khasra-num">{t('search.khasraNumber')}</Label>
                  <Input
                    id="khasra-num"
                    placeholder="e.g., 315/2A"
                    value={khasraNumberSearch.number}
                    onChange={(e) =>
                      setKhasraNumberSearch({ ...khasraNumberSearch, number: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSearch} className="flex-1 gap-2">
                    <Search className="w-4 h-4" />
                    {t('search.button')}
                  </Button>
                  <Button variant="outline" onClick={() => resetForm('number')} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    {t('search.reset')}
                  </Button>
                </div>
              </TabsContent>

              {/* Tab 3: Owner Name Search */}
              <TabsContent value="owner" className="space-y-4">
                <div>
                  <Label htmlFor="district-owner">{t('search.district')} *</Label>
                  <Select
                    value={ownerSearch.district}
                    onValueChange={(value) => setOwnerSearch({ ...ownerSearch, district: value })}
                  >
                    <SelectTrigger id="district-owner">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tehsil-owner">{t('search.tehsil')} (Optional)</Label>
                  <Input
                    id="tehsil-owner"
                    placeholder="Enter at least 3 characters"
                    value={ownerSearch.tehsil}
                    onChange={(e) => setOwnerSearch({ ...ownerSearch, tehsil: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="owner-name">{t('search.ownerName')}</Label>
                  <Input
                    id="owner-name"
                    placeholder="e.g., Ramesh Kumar"
                    value={ownerSearch.name}
                    onChange={(e) => setOwnerSearch({ ...ownerSearch, name: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSearch} className="flex-1 gap-2">
                    <Search className="w-4 h-4" />
                    {t('search.button')}
                  </Button>
                  <Button variant="outline" onClick={() => resetForm('owner')} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    {t('search.reset')}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchPage;
