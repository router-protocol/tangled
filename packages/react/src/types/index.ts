import { Chain as ViemChain } from 'viem';
import { CHAIN_ID } from '../constants/index.js';
import { ChainConnectors } from './wallet.js';

export const CHAIN_TYPES = [
  'evm',
  'tron',
  'near',
  'cosmos',
  'solana',
  'sui',
  'casper',
  'alephZero',
  'bitcoin',
] as const;

export type ChainType = (typeof CHAIN_TYPES)[number];

export type Chain = keyof typeof CHAIN_ID;
export type ChainId = (typeof CHAIN_ID)[keyof typeof CHAIN_ID];

export type ChainDataGeneric = {
  type: ChainType;
  id: ChainId;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    [key: string]: ChainRpcUrls;
    default: ChainRpcUrls;
  };
  blockExplorers: {
    default: {
      name: string;
      url: string;
      apiUrl?: string;
    };
  };
};

export type ChainData<T extends ChainType = ChainType> = T extends 'evm'
  ? { type: 'evm' } & ViemChain
  : T extends 'tron'
    ? { type: 'tron'; tronName: 'Mainnet' | 'Shasta' | 'Nile' } & ChainDataGeneric
    : { type: T } & ChainDataGeneric;

// use generic to type ChainData according to ChainType
export type SupportedChainsByType = { [key in ChainType]: ChainData<key>[] };

export interface TangledConfig {
  // The name of the project.
  projectName: string;
  // Override default supported chains
  chains?: SupportedChainsByType;
  // Override default chain configs. TODO: Add chain config type
  chainConfigs: Partial<Record<Chain, ChainConfig>>;
  // Enable testnets. Defaults to false. If true, only testnet chains will be provided in the context.
  // testnet?: boolean;

  /** Walletconnect project ID */
  projectId: string;

  chainConnectors?: Partial<ChainConnectors>;
}

type ChainRpcUrls = {
  http: readonly string[];
  webSocket?: readonly string[] | undefined;
};

export interface ChainConfig {
  name: string;
  id: ChainId;
  type: ChainType;
  testnet?: boolean;
  blockExplorer?: {
    name: string;
    url: string;
    apiUrl?: string;
  };
  rpcUrls?: {
    [key: string]: ChainRpcUrls;
    default: ChainRpcUrls;
  };
}
