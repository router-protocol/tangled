import { MainWalletBase as CosmosMainWalletBase } from '@cosmos-kit/core';
import { WalletWithRequiredFeatures } from '@mysten/wallet-standard';
import { Adapter as SolanaAdapter } from '@solana/wallet-adapter-base';
import { TonConnectUI } from '@tonconnect/ui-react';
import { Adapter as TronAdapter, AdapterState as TronAdapterReadyState } from '@tronweb3/tronwallet-abstract-adapter';
import { Mutable } from '@wagmi/core/internal';
import { CreateConnectorFn, Connector as EVMConnector } from 'wagmi';
import { ChainId, ChainType } from '../types/index.js';
import { XfiBitcoinConnector } from './bitcoin.js';

export type ChainConnectors = {
  evm: CreateConnectorFn[];
  tron: TronAdapter[];
  solana: Wallet<'solana'>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  near: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cosmos: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sui: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  casper: any[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bitcoin: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ton: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any[];
};

export type WalletBase<C extends ChainType = ChainType> = {
  id: string;
  name: string;
  type: C;
  icon: string;
  installed?: boolean;
  url?: string;
  disabled?: boolean;
  hidden?: boolean;
  connector?: WalletInstance<C>;
};

export type Wallet<C extends ChainType = ChainType> = C extends 'evm'
  ? {
      getWalletConnectDeeplink?: (uri: string) => string;
    } & WalletBase<C>
  : WalletBase<C>;

export type DefaultConnector = {
  name: string;
  icon: string;
  url?: string;
  id?: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

// TODO: Add accurate types for each chain wallet
export type WalletInstance<T extends ChainType = ChainType> = T extends 'evm'
  ? Mutable<EVMConnector>
  : T extends 'solana'
    ? SolanaAdapter
    : T extends 'tron'
      ? TronAdapter
      : T extends 'sui'
        ? WalletWithRequiredFeatures
        : T extends 'cosmos'
          ? CosmosMainWalletBase // Example, use Keplr wallet for Cosmos
          : T extends 'ton'
            ? TonConnectUI
            : T extends 'bitcoin'
              ? XfiBitcoinConnector | Wallet<'bitcoin'>
              : DefaultConnector;

export type ConnectedWallet<T extends ChainType = ChainType> = {
  address: string;
  loading?: boolean;
  chainId: ChainId | undefined;
  chainType: T;
  connector?: WalletInstance<T>;
};

export type ConnectedAccount = {
  address: string;
  chainId: ChainId | undefined;
  chainType: ChainType;
  wallet: string;
};

export type CurrentWallet = {
  id: string;
  type: ChainType;
};

/**
 * ChainTypeWallets is a map of `ChainType` to a map of `walletId` to its connected {@link WalletData}
 */
export type WalletsByChain = {
  [key in ChainType]: { [walletId in string]: ConnectedWallet };
};

/**
 * ConnectedAccounts is a map of `walletId` to its connected {@link Account}
 */
export type ConnectedAccountsByChain = {
  [key in ChainType]: { [walletId in string]: ConnectedAccount };
};

export type TronAdapterData = {
  adapter: TronAdapter;
  readyState: TronAdapterReadyState;
  account: string | null;
  network: string | undefined;
};
