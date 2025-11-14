// src/pages/ParcelDetailPage.tsx
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Download, Share2, Phone, Mail, MessageCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { useParcel } from "@/contexts/ParcelContext";
import { useToast } from "@/hooks/use-toast";
import { useContract } from "@/hooks/useContract";

const ParcelDetailPage = () => {
  const { id } = useParams();
  const { getParcelById, councilMembers, disputeParcel, transferParcelOwner } = useParcel();
  const parcel = getParcelById(Number(id));
  const { toast } = useToast();
  const { dispute: disputeOnChain, transfer: transferOnChain } = useContract();

  const handleDispute = async () => {
    if (!parcel) return;
    try {
      toast({ title: "Submitting dispute...", description: `Disputing parcel #${parcel.id}` });
      await disputeOnChain(parcel.id);
      disputeParcel(parcel.id);
      toast({ title: "⚠️ Parcel Disputed", description: `Parcel #${parcel.id} has been marked as disputed` });
    } catch (err) {
      toast({ title: "Dispute failed", description: (err as Error).message || "Could not dispute on-chain", variant: "destructive" });
    }
  };

  const handleTransfer = async () => {
    if (!parcel) return;
    const newOwner = prompt("Enter new owner's wallet address (hex)");
    if (!newOwner) return;

    try {
      toast({ title: "Submitting transfer...", description: `Transferring parcel #${parcel.id}` });
      await transferOnChain(parcel.id, newOwner);
      // update local store if your ParcelContext exposes such a function
      if (transferParcelOwner) transferParcelOwner(parcel.id, newOwner);
      toast({ title: "✅ Ownership Transferred", description: `Parcel #${parcel.id} ownership updated.` });
    } catch (err) {
      toast({ title: "Transfer failed", description: (err as Error).message || "Could not transfer on-chain", variant: "destructive" });
    }
  };

  if (!parcel) {
    return (
      <div className="min-h-screen tribal-pattern flex items-center justify-center">
        <Card className="max-w-md text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Parcel Not Found</h2>
          <Link to="/">
            <Button>Return to Search</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const tehsildar = councilMembers[0] || {
    name: "Not Assigned",
    role: "Tehsildar",
    phone: "N/A",
    office: "N/A",
    walletAddress: "",
  };

  return (
    <div className="min-h-screen tribal-pattern">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/results">
            <Button variant="outline" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Results
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                📍 PARCEL #{parcel.id} - KHASRA {parcel.khasraNumber}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={parcel.status} className="text-lg px-4 py-2" />
              {parcel.status === "approved" && (
                <span className="text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Blockchain Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="vintage-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">👤 OWNER DETAILS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-lg font-semibold">{parcel.ownerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wallet Address</p>
                  <p className="font-mono text-sm">{parcel.ownerWallet.substring(0, 10)}...</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Parcels Owned</p>
                  <p className="font-semibold">3 parcels</p>
                </div>
                <Button variant="outline" size="sm">View All Parcels by Owner</Button>
              </CardContent>
            </Card>

            <Card className="vintage-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">📍 LOCATION DETAILS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Village</p>
                    <p className="font-semibold">{parcel.village}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tehsil</p>
                    <p className="font-semibold">{parcel.tehsil}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">District</p>
                    <p className="font-semibold">{parcel.district}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Khasra Number</p>
                    <p className="font-semibold">{parcel.khasraNumber}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Area</p>
                  <p className="text-lg font-bold text-primary">{parcel.area.toLocaleString()} sqm ({(parcel.area / 10000).toFixed(2)} hectare)</p>
                </div>
                {parcel.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{parcel.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {parcel.documentCID && (
              <Card className="vintage-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">📄 DOCUMENT DETAILS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Document CID</p>
                    <p className="font-mono text-sm break-all">{parcel.documentCID}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      VIEW ON IPFS
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      DOWNLOAD
                    </Button>
                    <Button variant="default" size="sm" className="gap-2"> 
                      <CheckCircle className="w-4 h-4" /> VERIFY
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {parcel.approvals && parcel.approvals.length > 0 && (
              <Card className="vintage-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">✅ APPROVAL DETAILS</CardTitle>
                  <CardDescription>Status: Approved ({parcel.approvals.length}/2 Council Members)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {parcel.approvals.map((approval, index) => (
                      <div key={index} className="border-l-4 border-status-approved pl-4">
                        <p className="font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-status-approved" />
                          Approved by: {approval.councilMemberName}
                        </p>
                        <p className="text-sm text-muted-foreground">{approval.councilMemberRole}</p>
                        <p className="text-sm">Date: {approval.approvalDate}</p>
                        <p className="text-xs font-mono text-muted-foreground">Signature: {approval.signature}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" /> VIEW ON BLOCKCHAIN
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="vintage-border">
              <CardHeader>
                <CardTitle className="text-lg">📌 Know Your Revenue Minister</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Tehsildar Name</p>
                  <p className="font-semibold">{tehsildar.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">{tehsildar.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Office Address</p>
                  <p className="text-sm">{tehsildar.office}</p>
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  <Button variant="default" size="sm" className="gap-2 w-full"><Phone className="w-4 h-4" /> CALL</Button>
                  <Button variant="secondary" size="sm" className="gap-2 w-full"><MessageCircle className="w-4 h-4" /> WHATSAPP</Button>
                  <Button variant="outline" size="sm" className="gap-2 w-full"><Mail className="w-4 h-4" /> EMAIL</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="vintage-border">
              <CardHeader>
                <CardTitle className="text-lg">⚡ ACTIONS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {parcel.status === "approved" && (
                  <>
                    <Button variant="default" className="w-full" onClick={handleTransfer}>
                      ➡️ TRANSFER OWNERSHIP
                    </Button>
                    <Button variant="secondary" className="w-full">📑 PRINT CERTIFICATE</Button>
                  </>
                )}
                <Button variant="destructive" className="w-full" onClick={handleDispute}>⚖️ RAISE DISPUTE</Button>
                <Button variant="outline" className="w-full gap-2"><Share2 className="w-4 h-4" /> SHARE</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelDetailPage;
