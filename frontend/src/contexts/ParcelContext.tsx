// src/contexts/ParcelContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Parcel, CouncilMember } from '@/types/parcel';

interface SearchFilters {
  district?: string;
  tehsil?: string;
  village?: string;
  khasraNumber?: string;
  khasraId?: string;
  ownerName?: string;
  statuses?: string[];
}

interface ParcelContextType {
  parcels: Parcel[];
  councilMembers: CouncilMember[];
  districts: string[];
  addParcel: (parcel: Omit<Parcel, 'id' | 'createdDate'>) => number;
  updateParcel: (id: number, updates: Partial<Parcel>) => void;
  deleteParcel: (id: number) => void;
  getParcelById: (id: number) => Parcel | undefined;
  searchParcels: (filters: SearchFilters) => Parcel[];
  searchResults: Parcel[];
  setSearchResults: (parcels: Parcel[]) => void;
  approveParcel: (id: number, councilMember: CouncilMember) => void;
  rejectParcel: (id: number) => void;
  disputeParcel: (id: number) => void;
}

const ParcelContext = createContext<ParcelContextType | undefined>(undefined);

const STORAGE_KEY = 'land_registry_parcels';
const COUNCIL_STORAGE_KEY = 'land_registry_council';

const defaultDistricts = ['Raipur', 'Durg', 'Bilaspur', 'Korba', 'Rajnandgaon'];

const defaultCouncilMembers: CouncilMember[] = [
  { name: 'Ramkumar Sahu', role: 'Tehsildar', phone: '0771-123-4567', office: 'Raipur Tehsil', walletAddress: '0xCouncil1' },
  { name: 'Nisha Toppo', role: 'Revenue Officer', phone: '0771-234-5678', office: 'Raipur Block', walletAddress: '0xCouncil2' }
];

export const ParcelProvider = ({ children }: { children: ReactNode }) => {
  const [parcels, setParcels] = useState<Parcel[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [councilMembers] = useState<CouncilMember[]>(() => {
    const stored = localStorage.getItem(COUNCIL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultCouncilMembers;
  });

  const [searchResults, setSearchResults] = useState<Parcel[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parcels));
  }, [parcels]);

  const addParcel = (parcelData: Omit<Parcel, 'id' | 'createdDate'>): number => {
    const newId = parcels.length ? Math.max(...parcels.map(p => p.id)) + 1 : 1;
    const newParcel: Parcel = {
      ...parcelData,
      id: newId,
      createdDate: new Date().toISOString().split('T')[0],
      approvals: [],
      status: 'pending',
    };
    setParcels(prev => [...prev, newParcel]);
    return newId;
  };

  const updateParcel = (id: number, updates: Partial<Parcel>) => {
    setParcels(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteParcel = (id: number) => {
    setParcels(prev => prev.filter(p => p.id !== id));
  };

  const getParcelById = (id: number) => parcels.find(p => p.id === id);

  const searchParcels = (filters: SearchFilters) => {
    return parcels.filter(parcel => {
      if (filters.khasraId && parcel.id.toString() !== filters.khasraId) return false;
      if (filters.district && parcel.district !== filters.district) return false;
      if (filters.tehsil && !parcel.tehsil.toLowerCase().includes(filters.tehsil.toLowerCase())) return false;
      if (filters.village && !parcel.village.toLowerCase().includes(filters.village.toLowerCase())) return false;
      if (filters.khasraNumber && !parcel.khasraNumber.toLowerCase().includes(filters.khasraNumber.toLowerCase())) return false;
      if (filters.ownerName && !parcel.ownerName.toLowerCase().includes(filters.ownerName.toLowerCase())) return false;
      if (filters.statuses && filters.statuses.length && !filters.statuses.includes(parcel.status)) return false;
      return true;
    });
  };

  const approveParcel = (id: number, council: CouncilMember) => {
    setParcels(prev =>
      prev.map(p => {
        if (p.id !== id) return p;

        const newApproval = {
          councilMemberName: council.name,
          councilMemberRole: council.role ?? "",
          approvalDate: new Date().toISOString().split("T")[0],
          signature: `0x${Math.random().toString(16).slice(2, 10)}`,
        };

        const updatedApprovals = [...(p.approvals || []), newApproval];

        return {
          ...p,
          approvals: updatedApprovals,
          status: updatedApprovals.length >= 1 ? "approved" : "pending",
        };
      })
    );
  };

  const rejectParcel = (id: number) => updateParcel(id, { status: 'rejected' });

  const disputeParcel = (id: number) => updateParcel(id, { status: 'disputed' });

  return (
    <ParcelContext.Provider
      value={{
        parcels,
        councilMembers,
        districts: defaultDistricts,
        addParcel,
        updateParcel,
        deleteParcel,
        getParcelById,
        searchParcels,
        searchResults,
        setSearchResults,
        approveParcel,
        rejectParcel,
        disputeParcel,
      }}
    >
      {children}
    </ParcelContext.Provider>
  );
};

export const useParcel = () => {
  const context = useContext(ParcelContext);
  if (!context) throw new Error('useParcel must be used within ParcelProvider');
  return context;
};
