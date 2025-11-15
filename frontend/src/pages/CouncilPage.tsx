// src/pages/CouncilPage.tsx
import { Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { useParcel } from "@/contexts/ParcelContext";
import { useToast } from "@/hooks/use-toast";
import { useContract } from "@/hooks/useContract";
import { useLanguage } from "@/contexts/LanguageContext";


const CouncilPage = () => {
  const { parcels, councilMembers, approveParcel, rejectParcel, disputeParcel } = useParcel();
  const { toast } = useToast();
  const { t } = useLanguage();

  const { approve: approveOnChain, reject: rejectOnChain, dispute: disputeOnChain } = useContract();

  const pendingParcels = parcels.filter(p => p.status === "pending");
  const approvedCount = parcels.filter(p => p.status === "approved").length;

  const handleApprove = async (parcelId: number) => {
    toast({ title: "Submitting...", description: `Approving parcel #${parcelId}` });

    try {
      await approveOnChain(parcelId);
    } catch (err) {
      console.warn("Approve on-chain failed:", err);
    }

    approveParcel(parcelId, councilMembers[0]);
    toast({ title: "Approved", description: `Parcel #${parcelId} approved` });
  };

  const handleReject = async (parcelId: number) => {
    toast({ title: "Submitting...", description: `Rejecting parcel #${parcelId}` });

    try {
      await rejectOnChain(parcelId);
    } catch (err) {
      console.warn("Reject on-chain failed:", err);
    }

    rejectParcel(parcelId);
    toast({ title: "Rejected", description: `Parcel #${parcelId} rejected` });
  };

  const handleDispute = async (parcelId: number) => {
    toast({ title: "Submitting...", description: `Disputing parcel #${parcelId}` });

    try {
      await disputeOnChain(parcelId);
    } catch (err) {
      console.warn("Dispute on-chain failed:", err);
    }

    disputeParcel(parcelId);
    toast({ title: "Disputed", description: `Parcel #${parcelId} marked disputed` });
  };

  return (
    <div className="min-h-screen tribal-pattern">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">🧑‍💼 {t("council.dashboard")} Dashboard</h1>

        {/* SUMMARY GRID */}
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
              <p className="text-3xl font-bold text-status-pending">{pendingParcels.length}</p>
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
                {parcels.filter(p => p.status === "rejected").length}
              </p>
            </CardContent>
          </Card>

          <Card className="vintage-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Disputed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-status-disputed">
                {parcels.filter(p => p.status === "disputed").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* PENDING LIST */}
        <Card className="mb-8 vintage-border">
          <CardHeader>
            <CardTitle>⏳ Pending Parcels Queue</CardTitle>
            <CardDescription>Review and approve land claims</CardDescription>
          </CardHeader>

          <CardContent>
            {pendingParcels.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending parcels</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Parcel")} #</TableHead>
                    <TableHead>{t("Khasra")} </TableHead>
                    <TableHead>{t("Owner")} </TableHead>
                    <TableHead>{t("Location")} </TableHead>
                    <TableHead>{t("Date.submitted")} </TableHead>
                    <TableHead>{t("Actions")} </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pendingParcels.map(parcel => (
                    <TableRow key={parcel.id}>
                      <TableCell className="font-bold">#{parcel.id}</TableCell>
                      <TableCell>{parcel.khasraNumber}</TableCell>
                      <TableCell>{parcel.ownerName}</TableCell>
                      <TableCell>{parcel.village}, {parcel.tehsil}</TableCell>
                      <TableCell>{parcel.createdDate}</TableCell>

                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button variant="default" size="sm" onClick={() => handleApprove(parcel.id)}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>

                          <Button variant="destructive" size="sm" onClick={() => handleReject(parcel.id)}>
                            <XCircle className="w-4 h-4" />
                          </Button>

                          <Button variant="secondary" size="sm" onClick={() => handleDispute(parcel.id)}>
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CouncilPage;