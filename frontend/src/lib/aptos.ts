import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const APTOS_NETWORK = Network.TESTNET;

const config = new AptosConfig({ network: APTOS_NETWORK });
export const aptos = new Aptos(config);

export const MODULE_ADDRESS =
  "0x5238fbcf073759f549491d62b4a8fe35207189073e5f0eb492d6e86df77dcfac";

export const MODULE =
  `${MODULE_ADDRESS}::land_registry`;
