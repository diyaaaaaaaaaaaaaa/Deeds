import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/StatusBadge';
import { useParcel } from '@/contexts/ParcelContext';
import type { ParcelStatus } from '@/types/parcel';
import { useToast } from '@/hooks/use-toast';

const MyLandsPage = () => {
  const [filter, setFilter] = useState<ParcelStatus | 'all'>('all');
  const { parcels, deleteParcel } = useParcel();
  const { toast } = useToast();

  const filteredParcels = filter === 'all' 
    ? parcels 
    : parcels.filter((p) => p.status === filter);

  const handleDelete = (id: number) => {
    deleteParcel(id);
    toast({
      title: 'Parcel Deleted',
      description: `Parcel #${id} has been removed`,
    });
  };

  return (
    <div className="min-h-screen tribal-pattern">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          📋 Your Land Claims
        </h1>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as ParcelStatus | 'all')} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">⏳ Pending</TabsTrigger>
            <TabsTrigger value="approved">✅ Approved</TabsTrigger>
            <TabsTrigger value="rejected">❌ Rejected</TabsTrigger>
            <TabsTrigger value="disputed">⚠️ Disputed</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Results */}
        <div className="space-y-4">
          {filteredParcels.map((parcel) => (
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
                        VIEW
                      </Button>
                    </Link>
                    {parcel.status === 'pending' && (
                      <>
                        <Button variant="outline" size="sm">
                          ✏️ EDIT
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(parcel.id)}
                        >
                          🗑️ DELETE
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredParcels.length === 0 && (
            <Card className="p-12 text-center vintage-border">
              <p className="text-lg text-muted-foreground">No parcels found with the selected filter.</p>
              <Link to="/add-land" className="mt-4 inline-block">
                <Button>➕ Add Your First Land</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLandsPage;
