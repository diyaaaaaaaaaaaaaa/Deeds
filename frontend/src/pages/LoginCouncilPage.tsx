// src/pages/LoginCouncilPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LoginCouncilPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const { loginCouncil } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const submit = () => {
    const ok = loginCouncil(password);
    if (ok) {
      toast({ title: "Welcome, Council", description: "You are signed in." });
      navigate("/council");
    } else {
      toast({ title: "Invalid password", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen tribal-pattern flex items-center justify-center">
      <Card className="w-full max-w-md vintage-border">
        <CardHeader>
          <CardTitle className="text-2xl">Council Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="password">Shared Council Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter council password" />
          </div>
          <Button onClick={submit} className="w-full">Sign In</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginCouncilPage;
