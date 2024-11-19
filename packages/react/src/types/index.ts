import type { IndexedTx as CosmosIndexedTx } from '@cosmjs/stargate';
import type { SuiClient, SuiTransactionBlockResponse } from '@mysten/sui/client';
import type { WalletSelector as NearWalletSelector } from '@near-wallet-selector/core';
import type { Connection as SolanaConnection } from '@solana/web3.js';
import type { GetTransactionReceiptReturnType as EVMTxReceipt } from '@wagmi/core';
import type { providers } from 'near-api-js';
import type { Chain as ViemChain } from 'viem';
import type { Config as WagmiConfig } from 'wagmi';
import { CHAIN_ID } from '../constants/index.js';
import { GetCosmosClient } from '../store/Cosmos.js';
import { XfiBitcoinConnector } from './bitcoin.js';
import { ChainConnectors } from './wallet.js';
export const CHAIN_TYPES = ['evm', 'near', 'cosmos', 'solana', 'sui', 'bitcoin'] as const;

export type ChainType = (typeof CHAIN_TYPES)[number];

export type Chain = keyof typeof CHAIN_ID;
export type ChainId = (typeof CHAIN_ID)[keyof typeof CHAIN_ID] | `${string}-${number}`;

export interface ChainDataGeneric {
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
  contracts?: {
    [key: string]: string;
  };
  extra?: Record<string, any>;
}

export interface EVMChain extends ViemChain {
  type: Extract<'evm', ChainType>;
  extra?: Record<string, any>;
}

export interface SuiChainType extends ChainDataGeneric {
  type: Extract<'sui', ChainType>;
  suiNetwork: 'mainnet' | 'testnet' | 'devnet' | 'localnet';
}
export interface CosmosChainType extends ChainDataGeneric {
  type: Extract<'cosmos', ChainType>;
  chainName: string;
  evmId?: string;
}

// Exclude chains with custom types
export type OtherChainTypes = Exclude<ChainType, 'evm' | 'sui' | 'cosmos'>;
export type OtherChainData<T extends ChainType = OtherChainTypes> = ChainDataGeneric & {
  type: T;
};

// Chain data discriminated union for all supported chains
export type ChainData = EVMChain | SuiChainType | CosmosChainType | OtherChainData;

export type SupportedChainsByType = {
  [K in ChainData as K['type']]: K[];
};

export interface TangledConfig {
  // The name of the project.
  projectName: string;
  // Override default supported chains
  chains?: Partial<SupportedChainsByType>;
  // Override default chain configs. TODO: Add chain config type
  chainConfigs?: Partial<Record<Chain, ChainConfig>>;
  // Enable testnets. Defaults to false. If true, only testnet chains will be provided in the context.
  // testnet?: boolean;

  /** Walletconnect project ID */
  projectId?: string;

  /** Bitcoin network configuration */
  bitcoinNetwork?: 'mainnet' | 'testnet';

  chainConnectors?: Partial<ChainConnectors>;

  // Configure network environment of near-wallet-selector
  nearNetwork?: 'testnet' | 'mainnet';
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

export type ConnectionOrConfig = {
  wagmiConfig: WagmiConfig;
  solanaConnection: SolanaConnection;
  suiClient: SuiClient;
  getCosmosClient: GetCosmosClient;
  bitcoinProvider: XfiBitcoinConnector;
  nearSelector: NearWalletSelector;
};

export type GetTokenMetadataParams = {
  token: string;
  chain: ChainData;
  config: ConnectionOrConfig;
};

export type TransactionReceipt<C extends ChainType> = C extends 'evm'
  ? EVMTxReceipt
  : C extends 'sui'
    ? SuiTransactionBlockResponse
    : C extends 'cosmos'
      ? CosmosIndexedTx
      : C extends 'near'
        ? providers.FinalExecutionOutcome
        : unknown;
