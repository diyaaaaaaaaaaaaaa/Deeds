export type ParcelStatus = 'pending' | 'approved' | 'rejected' | 'disputed';

export interface Parcel {
  id: number;
  khasraNumber: string;
  ownerName: string;
  ownerWallet: string;
  district: string;
  tehsil: string;
  village: string;
  area: number; // in sqm
  status: ParcelStatus;
  createdDate: string;
  documentCID?: string;
  notes?: string;
  mapLink?: string;
  approvals?: any[];
}

export interface Approval {
  councilMemberName: string;
  councilMemberRole: string;
  approvalDate: string;
  signature: string;
}

export interface CouncilMember {
  name: string;
  role: string;
  phone: string;
  office: string;
  walletAddress: string;
}
