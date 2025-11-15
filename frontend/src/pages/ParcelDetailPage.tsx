// src/pages/ParcelDetailPage.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Download,
  Share2,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { useParcel } from "@/contexts/ParcelContext";
import { useToast } from "@/hooks/use-toast";
import { useContract } from "@/hooks/useContract";

const ParcelDetailPage: React.FC = () => {
  const { id } = useParams();
  const pid = Number(id);
  const { getParcelById, disputeParcel, updateParcel } = useParcel();
  const parcel = getParcelById(pid);
  const { toast } = useToast();
  const { getParcel: getParcelOnChain } = useContract();

  const handleDispute = () => {
    if (!parcel) return;
    disputeParcel(parcel.id);
    toast({
      title: "Dispute raised",
      description: `Parcel #${parcel.id} marked disputed locally`,
    });
  };

  const syncFromChain = async () => {
    if (!parcel) return;
    toast({ title: "Syncing", description: "Fetching on-chain data..." });
    try {
      const onChain = await getParcelOnChain(parcel.id);
      const data = onChain?.data ?? onChain;

      const statusOnChain =
        data?.status ??
        data?.status_enum ??
        undefined;

      let newStatus: any = undefined;
      const n = Number(statusOnChain);

      if (!Number.isNaN(n)) {
        newStatus =
          n === 1
            ? "approved"
            : n === 2
            ? "rejected"
            : n === 3
            ? "disputed"
            : "pending";
      } else if (typeof statusOnChain === "string") {
        if (statusOnChain.toLowerCase().includes("approved")) newStatus = "approved";
        else if (statusOnChain.toLowerCase().includes("rejected")) newStatus = "rejected";
        else if (statusOnChain.toLowerCase().includes("disputed")) newStatus = "disputed";
        else newStatus = "pending";
      }

      if (newStatus) {
        updateParcel(parcel.id, { status: newStatus });
        toast({ title: "Synced", description: `Local status updated to ${newStatus}` });
      } else {
        toast({ title: "No status found", description: "Couldn't infer on-chain status." });
      }
    } catch (err) {
      toast({
        title: "Sync failed",
        description: (err as Error).message || "Could not fetch on-chain parcel",
        variant: "destructive",
      });
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

  const tehsildar = {
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
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* OWNER DETAILS */}
            <Card className="vintage-border">
              <CardHeader>
                <CardTitle>👤 OWNER DETAILS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-lg font-semibold">{parcel.ownerName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Wallet Address</p>
                  <p className="font-mono text-sm">{parcel.ownerWallet}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Total Parcels Owned</p>
                  <p className="font-semibold">—</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View All Parcels by Owner
                  </Button>
                  <Button size="sm" onClick={syncFromChain}>
                    🔁 Sync from chain
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* LOCATION DETAILS */}
            <Card className="vintage-border">
              <CardHeader>
                <CardTitle>📍 LOCATION DETAILS</CardTitle>
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
                  <p className="text-lg font-bold text-primary">
                    {parcel.area.toLocaleString()} sqm
                  </p>
                </div>

                {parcel.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{parcel.notes}</p>
                  </div>
                )}

                {/* 🌍 MAP BUTTON */}
                {parcel.mapLink && (
                  <div className="mt-4">
                    <a
                      href={parcel.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="default" className="gap-2 w-full">
                        🌍 View on Map
                      </Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* DOCUMENT DETAILS */}
            {parcel.documentCID && (
              <Card className="vintage-border">
                <CardHeader>
                  <CardTitle>📄 DOCUMENT DETAILS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Document CID</p>
                    <p className="font-mono text-sm break-all">{parcel.documentCID}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" /> VIEW ON IPFS
                    </Button>

                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" /> DOWNLOAD
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* TEHSILDAR */}
            <Card className="vintage-border">
              <CardHeader>
                <CardTitle>📌 Know Your Revenue Minister</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Tehsildar Name</p>
                  <p className="font-semibold">{tehsildar.name}</p>
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
                  <Button variant="default" size="sm" className="gap-2 w-full">
                    <Phone className="w-4 h-4" /> CALL
                  </Button>

                  <Button variant="secondary" size="sm" className="gap-2 w-full">
                    <MessageCircle className="w-4 h-4" /> WHATSAPP
                  </Button>

                  <Button variant="outline" size="sm" className="gap-2 w-full">
                    <Mail className="w-4 h-4" /> EMAIL
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ACTIONS */}
            <Card className="vintage-border">
              <CardHeader>
                <CardTitle>⚡ ACTIONS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {parcel.status === "approved" && (
                  <>
                    <Button variant="default" className="w-full">
                      ➡️ TRANSFER OWNERSHIP
                    </Button>

                    <Button variant="secondary" className="w-full">
                      📑 PRINT CERTIFICATE
                    </Button>
                  </>
                )}

                <Button variant="destructive" className="w-full" onClick={handleDispute}>
                  ⚖️ RAISE DISPUTE
                </Button>

                <Button variant="outline" className="w-full gap-2">
                  <Share2 className="w-4 h-4" /> SHARE
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelDetailPage;
