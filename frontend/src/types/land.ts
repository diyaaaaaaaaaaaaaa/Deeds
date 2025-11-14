export interface LandParcel {
  parcel_id: string;
  owner: string;
  khasra_number: string;
  document_cid: string;
  area_sqm: string;
  notes: string;
  village: string;
  tehsil: string;
  district: string;
  approvers: string[];
  status: number;
  created_at: string;
}
