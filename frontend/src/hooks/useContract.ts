import {
  approve,
  reject,
  dispute,
  submitLand,
  transferOwnership,
  view_getParcel,
  view_getNextId,
  view_getCouncil,
} from "../lib/contract";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function useContract() {
  const { account } = useWallet();

  const sender = account?.address || "";

  return {
    submit: (data: any) => submitLand(sender, data),
    approve: (id: number) => approve(sender, id),
    reject: (id: number) => reject(sender, id),
    dispute: (id: number) => dispute(sender, id),
    transfer: (id: number, to: string) => transferOwnership(sender, id, to),

    getParcel: (id: number) => view_getParcel(id),
    getNextId: () => view_getNextId(),
    getCouncil: () => view_getCouncil(),
  };
}
