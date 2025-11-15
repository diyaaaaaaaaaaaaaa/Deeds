// src/pages/AddLandPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useParcel } from "@/contexts/ParcelContext";
import { useContract } from "@/hooks/useContract";

const AddLandPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { districts, addParcel } = useParcel();
  const { submit: submitOnChain } = useContract();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    district: "",
    tehsil: "",
    village: "",
    khasraNumber: "",
    area: "",
    notes: "",
    documentCID: "",
    mapLink: "",    // ⭐ NEW MAP FIELD
  });

  const handleNext = () => setStep((s) => Math.min(5, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.khasraNumber || !formData.district) {
      toast({ title: "Missing fields", description: "Please fill required fields." });
      return;
    }

    // --- WALLET CHECK ---
    const wallet =
      (window as any).aptos ||
      (window as any).petra ||
      (window as any).martian ||
      null;

    if (!wallet) {
      toast({
        title: "Wallet not found",
        description: "Install Petra or Martian wallet to submit on-chain.",
        variant: "destructive",
      });
      return;
    }

    try {
      await wallet.connect();
    } catch {
      toast({
        title: "Wallet connection failed",
        description: "Please unlock your wallet or approve the request.",
        variant: "destructive",
      });
      return;
    }

    // --- ON-CHAIN SUBMIT ---
    try {
      toast({ title: "Submitting", description: "Sending transaction to blockchain..." });

      await submitOnChain({
        khasra_number: formData.khasraNumber,
        document_cid: formData.documentCID,
        area_sqm: Number(formData.area) || 0,
        notes: formData.notes,
        village: formData.village,
        tehsil: formData.tehsil,
        district: formData.district,
      });

      toast({
        title: "Submitted on-chain",
        description: "Transaction sent successfully.",
      });
    } catch (err) {
      toast({
        title: "Blockchain error",
        description: (err as Error).message,
        variant: "destructive",
      });
    }

    // --- ALWAYS ADD LOCALLY ---
    const newParcelId = addParcel({
      khasraNumber: formData.khasraNumber,
      ownerName: formData.fullName,
      ownerWallet: wallet.address || "0x",
      district: formData.district,
      tehsil: formData.tehsil,
      village: formData.village,
      area: Number(formData.area) || 0,
      status: "pending",
      documentCID: formData.documentCID,
      notes: formData.notes,
      mapLink: formData.mapLink, // ⭐ SAVED HERE
    });

    toast({
      title: "Success",
      description: `Parcel submitted! ID: ${newParcelId}`,
    });

    navigate("/my-lands");
  };

  return (
    <div className="min-h-screen tribal-pattern">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto vintage-border">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">➕ Add Your Land</CardTitle>
            <CardDescription>Step {step} of 5</CardDescription>
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ---------- STEP 1 ---------- */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Basic Information</h3>

                <div>
                  <Label htmlFor="fullName">Your Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Your Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Your Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>

                <Button onClick={handleNext} className="w-full">
                  NEXT →
                </Button>
              </div>
            )}

            {/* ---------- STEP 2 ---------- */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Land Location</h3>

                <div>
                  <Label>District *</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => setFormData({ ...formData, district: value })}
                  >
                    <SelectTrigger>
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
                  <Label>Tehsil *</Label>
                  <Input
                    value={formData.tehsil}
                    onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                    placeholder="Enter tehsil"
                  />
                </div>

                <div>
                  <Label>Village *</Label>
                  <Input
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder="Enter village"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleBack} variant="outline" className="flex-1">
                    ← BACK
                  </Button>
                  <Button onClick={handleNext} className="flex-1">
                    NEXT →
                  </Button>
                </div>
              </div>
            )}

            {/* ---------- STEP 3 ---------- */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Land Details</h3>

                <div>
                  <Label>Khasra Number *</Label>
                  <Input
                    value={formData.khasraNumber}
                    onChange={(e) => setFormData({ ...formData, khasraNumber: e.target.value })}
                    placeholder="e.g., 315/2A"
                  />
                </div>

                <div>
                  <Label>Area (sqm) *</Label>
                  <Input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g., 5000"
                  />
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g., Agricultural land with well"
                    rows={4}
                  />
                </div>

                {/* ⭐ GOOGLE MAPS / OPENSTREETMAP LINK */}
                <div>
                  <Label>Map Link (Optional)</Label>
                  <Input
                    value={formData.mapLink}
                    onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                    placeholder="Paste OpenStreetMap / Google Maps link"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleBack} variant="outline" className="flex-1">
                    ← BACK
                  </Button>
                  <Button onClick={handleNext} className="flex-1">
                    NEXT →
                  </Button>
                </div>
              </div>
            )}

            {/* ---------- STEP 4 ---------- */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Document Upload</h3>

                <div>
                  <Label>Upload Document *</Label>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                </div>

                <div className="text-center text-muted-foreground">OR</div>

                <div>
                  <Label>IPFS CID</Label>
                  <Input
                    value={formData.documentCID}
                    onChange={(e) => setFormData({ ...formData, documentCID: e.target.value })}
                    placeholder="Qm..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleBack} variant="outline" className="flex-1">
                    ← BACK
                  </Button>
                  <Button onClick={handleNext} className="flex-1">
                    NEXT →
                  </Button>
                </div>
              </div>
            )}

            {/* ---------- STEP 5 ---------- */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Review & Submit</h3>

                <Card className="bg-muted/30">
                  <CardContent className="pt-6 space-y-2">
                    <p><strong>Name:</strong> {formData.fullName}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    {formData.email && <p><strong>Email:</strong> {formData.email}</p>}
                    <p><strong>Location:</strong> {formData.village}, {formData.tehsil}, {formData.district}</p>
                    <p><strong>Khasra:</strong> {formData.khasraNumber}</p>
                    <p><strong>Area:</strong> {formData.area} sqm</p>
                    {formData.notes && <p><strong>Notes:</strong> {formData.notes}</p>}
                    {formData.documentCID && <p><strong>Document CID:</strong> {formData.documentCID}</p>}
                    {formData.mapLink && <p><strong>Map Link:</strong> {formData.mapLink}</p>}
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button onClick={handleBack} variant="outline" className="flex-1">
                    ✏️ EDIT
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1">
                    📤 SUBMIT FOR APPROVAL
                  </Button>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddLandPage;
