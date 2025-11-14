import {
  AptosWalletAdapterProvider,
  PetraWallet,
  PontemWallet,
  MartianWallet,
} from "@aptos-labs/wallet-adapter-react";
import { ReactNode } from "react";

const wallets = [new PetraWallet(), new PontemWallet(), new MartianWallet()];

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      {children}
    </AptosWalletAdapterProvider>
  );
}
