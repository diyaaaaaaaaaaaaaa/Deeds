// src/pages/LoginUserPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LoginUserPage: React.FC = () => {
  const { loginCitizenStart, verifyCitizenOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [aadhaar, setAadhaar] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [simOtp, setSimOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  const handleStart = () => {
    if (!aadhaar || aadhaar.length < 10) {
      toast({ title: "Invalid Aadhaar", description: "Please enter a valid Aadhaar number." });
      return;
    }
    const otp = loginCitizenStart(aadhaar, name || undefined, phone || undefined);
    setSimOtp(otp);
    setStep(2);
    toast({ title: "OTP Sent (demo)", description: "OTP shown on screen for demo purposes." });
  };

  const handleVerify = async () => {
    if (!enteredOtp) {
      toast({ title: "Enter OTP", description: "Please enter the OTP." });
      return;
    }
    const ok = verifyCitizenOtp(aadhaar, enteredOtp);
    if (ok) {
      toast({ title: "Logged in", description: "Welcome back!" });
      navigate("/my-lands");
    } else {
      toast({ title: "OTP Invalid", description: "The OTP is invalid or expired." });
    }
  };

  return (
    <div className="min-h-screen tribal-pattern flex items-center justify-center">
      <Card className="w-full max-w-md vintage-border">
        <CardHeader>
          <CardTitle className="text-2xl">Citizen Login (Aadhaar)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input id="aadhaar" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} placeholder="1234 5678 9012" />
              </div>
              <div>
                <Label htmlFor="name">Name (optional)</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXXXXXXX" />
              </div>
              <Button onClick={handleStart} className="w-full">Send OTP</Button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <p className="text-sm text-muted-foreground">Demo OTP (for testing): <strong className="font-mono">{simOtp}</strong></p>
              </div>
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input id="otp" value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} placeholder="123456" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
                <Button onClick={handleVerify} className="flex-1">Verify & Login</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginUserPage;
