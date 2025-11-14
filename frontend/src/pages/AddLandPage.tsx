import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useParcel } from '@/contexts/ParcelContext';

const AddLandPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { districts, addParcel } = useParcel();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    district: '',
    tehsil: '',
    village: '',
    khasraNumber: '',
    area: '',
    notes: '',
    documentCID: '',
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    const newParcelId = addParcel({
      khasraNumber: formData.khasraNumber,
      ownerName: formData.fullName,
      ownerWallet: '0x' + Math.random().toString(16).substring(2, 20), // Mock wallet
      district: formData.district,
      tehsil: formData.tehsil,
      village: formData.village,
      area: Number(formData.area),
      status: 'pending',
      documentCID: formData.documentCID || undefined,
      notes: formData.notes || undefined,
    });

    toast({
      title: '✅ Success!',
      description: `Your land claim has been submitted! Parcel ID: #${newParcelId}. Status: ⏳ PENDING`,
    });
    navigate('/my-lands');
  };

  return (
    <div className="min-h-screen tribal-pattern">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto vintage-border">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              ➕ Add Your Land
            </CardTitle>
            <CardDescription>Step {step} of 5</CardDescription>
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
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

            {/* Step 2: Land Location */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Land Location</h3>
                <div>
                  <Label htmlFor="district">District *</Label>
                  <Select value={formData.district} onValueChange={(value) => setFormData({ ...formData, district: value })}>
                    <SelectTrigger id="district">
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
                  <Label htmlFor="tehsil">Tehsil *</Label>
                  <Input
                    id="tehsil"
                    value={formData.tehsil}
                    onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                    placeholder="Enter tehsil name"
                  />
                </div>
                <div>
                  <Label htmlFor="village">Village *</Label>
                  <Input
                    id="village"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder="Enter village name"
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

            {/* Step 3: Land Details */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Land Details</h3>
                <div>
                  <Label htmlFor="khasraNumber">Khasra Number *</Label>
                  <Input
                    id="khasraNumber"
                    value={formData.khasraNumber}
                    onChange={(e) => setFormData({ ...formData, khasraNumber: e.target.value })}
                    placeholder="e.g., 315/2A"
                  />
                </div>
                <div>
                  <Label htmlFor="area">Area (sqm) *</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g., 5000"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes/Description</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g., Agricultural land with well"
                    rows={4}
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

            {/* Step 4: Document Upload */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Document Upload</h3>
                <div>
                  <Label htmlFor="documentUpload">Upload Document *</Label>
                  <Input id="documentUpload" type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <p className="text-sm text-muted-foreground mt-1">PDF or Image files only</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">OR</p>
                </div>
                <div>
                  <Label htmlFor="documentCID">IPFS CID (if already uploaded)</Label>
                  <Input
                    id="documentCID"
                    value={formData.documentCID}
                    onChange={(e) => setFormData({ ...formData, documentCID: e.target.value })}
                    placeholder="QmXxxx..."
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

            {/* Step 5: Review & Submit */}
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
