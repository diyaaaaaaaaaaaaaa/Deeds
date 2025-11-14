import { Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { useParcel } from '@/contexts/ParcelContext';
import { useToast } from '@/hooks/use-toast';

const CouncilPage = () => {
  const { parcels, councilMembers, approveParcel, rejectParcel, disputeParcel } = useParcel();
  const { toast } = useToast();

  const pendingParcels = parcels.filter((p) => p.status === 'pending');
  const approvedCount = parcels.filter((p) => p.status === 'approved').length;

  const handleApprove = (parcelId: number) => {
    approveParcel(parcelId, councilMembers[0]);
    toast({
      title: '✅ Parcel Approved',
      description: `Parcel #${parcelId} has been approved`,
    });
  };

  const handleReject = (parcelId: number) => {
    rejectParcel(parcelId);
    toast({
      title: '❌ Parcel Rejected',
      description: `Parcel #${parcelId} has been rejected`,
      variant: 'destructive',
    });
  };

  const handleDispute = (parcelId: number) => {
    disputeParcel(parcelId);
    toast({
      title: '⚠️ Parcel Disputed',
      description: `Parcel #${parcelId} has been marked as disputed`,
    });
  };

  return (
    <div className="min-h-screen tribal-pattern">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          🧑‍💼 Council Dashboard
        </h1>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="vintage-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Total Parcels</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{parcels.length}</p>
            </CardContent>
          </Card>
          <Card className="vintage-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-status-pending">
                {parcels.filter((p) => p.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
          <Card className="vintage-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-status-approved">{approvedCount}</p>
            </CardContent>
          </Card>
          <Card className="vintage-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-status-rejected">
                {parcels.filter((p) => p.status === 'rejected').length}
              </p>
            </CardContent>
          </Card>
          <Card className="vintage-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Disputed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-status-disputed">
                {parcels.filter((p) => p.status === 'disputed').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Parcels Queue */}
        <Card className="mb-8 vintage-border">
          <CardHeader>
            <CardTitle>⏳ Pending Parcels Queue</CardTitle>
            <CardDescription>Review and approve land claims</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingParcels.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parcel #</TableHead>
                    <TableHead>Khasra</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingParcels.map((parcel) => (
                    <TableRow key={parcel.id}>
                      <TableCell className="font-bold">#{parcel.id}</TableCell>
                      <TableCell>{parcel.khasraNumber}</TableCell>
                      <TableCell>{parcel.ownerName}</TableCell>
                      <TableCell className="text-sm">{parcel.village}, {parcel.tehsil}</TableCell>
                      <TableCell>{parcel.createdDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleApprove(parcel.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleReject(parcel.id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleDispute(parcel.id)}
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">No pending parcels</p>
            )}
          </CardContent>
        </Card>

        {/* My Approvals */}
        <Card className="vintage-border">
          <CardHeader>
            <CardTitle>✅ My Approvals</CardTitle>
            <CardDescription>You have approved {approvedCount} parcels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {parcels
                .filter((p) => p.status === 'approved')
                .slice(0, 5)
                .map((parcel) => (
                  <div key={parcel.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">Parcel #{parcel.id} - {parcel.khasraNumber}</p>
                      <p className="text-sm text-muted-foreground">{parcel.ownerName}</p>
                    </div>
                    <StatusBadge status={parcel.status} />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CouncilPage;
