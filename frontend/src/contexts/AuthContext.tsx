// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type CitizenUser = {
  role: "citizen";
  aadhaar: string;
  name?: string;
  phone?: string;
};

type CouncilUser = {
  role: "council";
  id?: string;
  name?: string;
};

type AuthUser = CitizenUser | CouncilUser | null;

type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  loginCitizenStart: (aadhaar: string, name?: string, phone?: string) => string; // returns OTP (demo)
  verifyCitizenOtp: (aadhaar: string, otp: string) => boolean;
  loginCouncil: (password: string) => boolean;
  logout: () => void;
};

const STORAGE_KEY = "deeds_auth_v1";
const COUNCIL_PASSWORD = "council123"; // demo password. Change for production.

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  // In-memory OTP store for demo (simple)
  const otpStore = useMemo(() => new Map<string, { otp: string; expiresAt: number }>(), []);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw) as AuthUser);
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  // Start citizen login flow: generate OTP and return it (demo).
  function loginCitizenStart(aadhaar: string, name?: string, phone?: string) {
    // generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore.set(aadhaar, { otp, expiresAt });

    // In a real app you'd send via SMS / email; here we return it so UI can show it (simulated).
    // Save temporary partial info in sessionStorage to verify later
    sessionStorage.setItem(`deeds_otp_pending_${aadhaar}`, JSON.stringify({ name, phone }));
    return otp;
  }

  function verifyCitizenOtp(aadhaar: string, otp: string) {
    const record = otpStore.get(aadhaar);
    if (!record) return false;
    if (Date.now() > record.expiresAt) {
      otpStore.delete(aadhaar);
      sessionStorage.removeItem(`deeds_otp_pending_${aadhaar}`);
      return false;
    }
    if (record.otp !== otp) return false;

    // success -> create citizen user
    const pendingRaw = sessionStorage.getItem(`deeds_otp_pending_${aadhaar}`);
    let pending;
    try {
      pending = pendingRaw ? JSON.parse(pendingRaw) : {};
    } catch {
      pending = {};
    }
    const logged: CitizenUser = {
      role: "citizen",
      aadhaar,
      name: pending?.name,
      phone: pending?.phone,
    };

    setUser(logged);
    otpStore.delete(aadhaar);
    sessionStorage.removeItem(`deeds_otp_pending_${aadhaar}`);
    return true;
  }

  function loginCouncil(password: string) {
    if (password === COUNCIL_PASSWORD) {
      const logged: CouncilUser = { role: "council", name: "Council Member" };
      setUser(logged);
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginCitizenStart,
        verifyCitizenOtp,
        loginCouncil,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
