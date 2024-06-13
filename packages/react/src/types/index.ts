import { CreateConnectorFn } from '@wagmi/core';
import { Chain as ViemChain } from 'viem';
import { CHAIN_ID, CHAIN_TYPES } from '../constants/index.js';

export type ChainType = (typeof CHAIN_TYPES)[number];

export type Chain = keyof typeof CHAIN_ID;
export type ChainId = (typeof CHAIN_ID)[keyof typeof CHAIN_ID];

export type ChainData = Omit<ViemChain, 'id'> & { id: string | number; type?: ChainType };

export interface TangledConfig {
  // The name of the project.
  projectName: string;
  // Override default supported chains
  chains?: Chain[];
  // Override default chain configs. TODO: Add chain config type
  chainConfigs: Record<Chain, ChainConfig>;
  // Enable testnets. Defaults to false. If true, only testnet chains will be provided in the context.
  // testnet?: boolean;

  evmConnectors?: CreateConnectorFn[];
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
