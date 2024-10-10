import { SuiClient, SuiTransactionBlockResponse } from '@mysten/sui/client';
import { type ApiPromise } from '@polkadot/api';
import { Connection as SolanaConnection } from '@solana/web3.js';
import { TonClient } from '@ton/ton';
import { GetTransactionReceiptReturnType as EVMTxReceipt } from '@wagmi/core';
import { Types as TronWebTypes, type TronWeb } from 'tronweb';
import { Chain as ViemChain } from 'viem';
import { Config as WagmiConfig } from 'wagmi';
import { CHAIN_ID } from '../constants/index.js';
import { AlephTransactionData } from './aleph.js';
import { BitcoinConnector } from './bitcoin.js';
import { TonTransactionInfo } from './ton.js';
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
  'ton',
] as const;

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
}

export interface EVMChain extends ViemChain {
  type: Extract<'evm', ChainType>;
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

// Exclude chains with custom types
export type OtherChainTypes = Exclude<ChainType, 'evm' | 'tron' | 'sui'>;
export type OtherChainData<T extends ChainType = OtherChainTypes> = ChainDataGeneric & {
  type: T;
};

// Chain data discriminated union for all supported chains
export type ChainData = EVMChain | TronChain | SuiChainType | OtherChainData;

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
  twaReturnUrl?: `${string}://${string}`;
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
  alephZeroApi: ApiPromise;
  suiClient: SuiClient;
  tonClient: TonClient;
  bitcoinProvider: BitcoinConnector;
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
    : C extends 'alephZero'
      ? AlephTransactionData
      : C extends 'sui'
        ? SuiTransactionBlockResponse
        : C extends 'ton'
          ? TonTransactionInfo
          : unknown;
