import { useState } from 'react';
import { Link } from 'react-router-dom';
import { List, LayoutGrid, MapPin, Eye, Phone, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParcel } from '@/contexts/ParcelContext';

type ViewMode = 'list' | 'card' | 'map';

const ResultsPage = () => {
  const { t } = useLanguage();
  const { searchResults, disputeParcel } = useParcel();
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  const handleDispute = (id: number) => {
    disputeParcel(id);
  };

  return (
    <div className="min-h-screen tribal-pattern">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Search Results</h1>
          
          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg text-muted-foreground">
              <span className="font-bold text-primary">{searchResults.length}</span> Records Found
            </p>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                LIST
              </Button>
              <Button
                variant={viewMode === 'card' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('card')}
                className="gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                CARD
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                MAP
              </Button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {searchResults.length === 0 ? (
          <Card className="vintage-border p-12 text-center">
            <h3 className="text-2xl font-bold mb-2">No Results Found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
            <Link to="/">
              <Button>← Back to Search</Button>
            </Link>
          </Card>
        ) : (
          <>
            {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((parcel) => (
              <Card key={parcel.id} className="vintage-border hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-bold text-primary">
                      #{parcel.id}
                    </CardTitle>
                    <StatusBadge status={parcel.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">📍</span>
                    <div>
                      <p className="font-semibold">Khasra: {parcel.khasraNumber}</p>
                      <p className="text-sm text-muted-foreground">{parcel.village}, {parcel.tehsil}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    <p className="font-medium">{parcel.ownerName}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📏</span>
                    <p className="text-sm">{parcel.area.toLocaleString()} sqm</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <p className="text-sm text-muted-foreground">{parcel.createdDate}</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Link to={`/parcel/${parcel.id}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full gap-2">
                        <Eye className="w-4 h-4" />
                        {t('common.view')}
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Phone className="w-4 h-4" />
                      {t('common.contact')}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleDispute(parcel.id)}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {searchResults.map((parcel) => (
              <Card key={parcel.id} className="vintage-border">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-primary">#{parcel.id}</h3>
                        <StatusBadge status={parcel.status} />
                      </div>
                      <p className="font-semibold">📍 Khasra {parcel.khasraNumber} | 👤 {parcel.ownerName}</p>
                      <p className="text-sm text-muted-foreground">
                        🏘️ {parcel.village}, {parcel.tehsil}, {parcel.district} | 📏 {parcel.area.toLocaleString()} sqm | 📅 {parcel.createdDate}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/parcel/${parcel.id}`}>
                        <Button variant="default" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          {t('common.view')}
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleDispute(parcel.id)}
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Map View Placeholder */}
        {viewMode === 'map' && (
          <Card className="vintage-border p-12 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-bold mb-2">Map View Coming Soon</h3>
            <p className="text-muted-foreground">Interactive map visualization will be available in the next update</p>
          </Card>
        )}
        </>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <Button variant="outline" size="sm">← PREV</Button>
          <Button variant="default" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">NEXT →</Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
