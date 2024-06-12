import { CHAIN_ID, CHAIN_TYPES } from '../constants';

export type ChainType = (typeof CHAIN_TYPES)[number];

export type Chains = keyof typeof CHAIN_ID;
export type ChainIds = (typeof CHAIN_ID)[keyof typeof CHAIN_ID];

export interface TangledConfig {
  // The name of the project.
  projectName: string;
  // Override default supported chains
  chains?: Chains[];
  // Override default chain configs. TODO: Add chain config type
  chainConfigs: Record<Chains, ChainConfig>;
  // Enable testnets. Defaults to false. If true, only testnet chains will be provided in the context.
  testnet?: boolean;
}

type ChainRpcUrls = {
  http: readonly string[];
  webSocket?: readonly string[] | undefined;
};

export interface ChainConfig {
  name: string;
  id: ChainIds;
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
