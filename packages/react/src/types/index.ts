import type { IndexedTx as CosmosIndexedTx } from '@cosmjs/stargate';
import type { SuiClient, SuiTransactionBlockResponse } from '@mysten/sui/client';
import type { Connection as SolanaConnection } from '@solana/web3.js';
import type { TonClient } from '@ton/ton';
import type { GetTransactionReceiptReturnType as EVMTxReceipt } from '@wagmi/core';
import type { TronWeb, Types as TronWebTypes } from 'tronweb';
import type { Chain as ViemChain } from 'viem';
import type { Config as WagmiConfig } from 'wagmi';
import { CHAIN_ID } from '../constants/index.js';
import { GetCosmosClient } from '../store/Cosmos.js';
import { XfiBitcoinConnector } from './bitcoin.js';
import { TonTransactionInfo } from './ton.js';
import { ChainConnectors } from './wallet.js';
export const CHAIN_TYPES = ['evm', 'tron', 'near', 'cosmos', 'solana', 'sui', 'casper', 'bitcoin', 'ton'] as const;

export type ChainType = (typeof CHAIN_TYPES)[number];

export type Chain = keyof typeof CHAIN_ID;
export type ChainId = (typeof CHAIN_ID)[keyof typeof CHAIN_ID];

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

export interface TronChain extends ChainDataGeneric {
  type: Extract<'tron', ChainType>;
  tronName: 'Mainnet' | 'Shasta' | 'Nile';
  trxId: string;
}

export interface SuiChainType extends ChainDataGeneric {
  type: Extract<'sui', ChainType>;
  suiNetwork: 'mainnet' | 'testnet' | 'devnet' | 'localnet';
}
export interface CosmsosChainType extends ChainDataGeneric {
  type: Extract<'cosmos', ChainType>;
  chainName: string;
  evmId?: string;
}

// Exclude chains with custom types
export type OtherChainTypes = Exclude<ChainType, 'evm' | 'tron' | 'sui' | 'cosmos'>;
export type OtherChainData<T extends ChainType = OtherChainTypes> = ChainDataGeneric & {
  type: T;
};

// Chain data discriminated union for all supported chains
export type ChainData = EVMChain | TronChain | SuiChainType | CosmsosChainType | OtherChainData;

export type SupportedChainsByType = {
  [K in ChainData as K['type']]: K[];
};

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

  /** Bitcoin network configuration */
  bitcoinNetwork: 'mainnet' | 'testnet';

  chainConnectors?: Partial<ChainConnectors>;

  /** Manifest url for ton connect */
  tonconnectManifestUrl: string;
  /** Telegram mini app url */
  twaReturnUrl: `${string}://${string}`;
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
  tronWeb: TronWeb;
  suiClient: SuiClient;
  tonClient: TonClient;
  getCosmosClient: GetCosmosClient;
  bitcoinProvider: XfiBitcoinConnector;
};

export type GetTokenMetadataParams = {
  token: string;
  chain: ChainData;
  config: ConnectionOrConfig;
};

export type TransactionReceipt<C extends ChainType> = C extends 'evm'
  ? EVMTxReceipt
  : C extends 'tron'
    ? TronWebTypes.TransactionInfo
    : C extends 'sui'
      ? SuiTransactionBlockResponse
      : C extends 'ton'
        ? TonTransactionInfo
        : C extends 'cosmos'
          ? CosmosIndexedTx
          : unknown;
