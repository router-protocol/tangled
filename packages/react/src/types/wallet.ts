import { Adapter as SolanaAdapter } from '@solana/wallet-adapter-base';
import {
  Adapter as TronAdapter,
  NetworkType as TronNetworkType,
  WalletReadyState as TronWalletReadyState,
} from '@tronweb3/tronwallet-abstract-adapter';
import { Mutable } from '@wagmi/core/internal';
import { Connector as EVMConnector } from 'wagmi';
import { ChainType } from '../types/index.js';

export type Wallet<C extends ChainType = ChainType> = {
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

type DefaultConnector = {
  name: string;
  icon: string;
  url?: string;
  id?: string;
  connect: () => void;
  disconnect: () => void;
};

// TODO: Add accurate types for each chain wallet
export type WalletInstance<T extends ChainType = ChainType> = T extends 'evm'
  ? Mutable<EVMConnector>
  : T extends 'solana'
    ? SolanaAdapter
    : T extends 'tron'
      ? TronAdapter
      : DefaultConnector;

export type ConnectedWallet<T extends ChainType = ChainType> = {
  address: string;
  loading?: boolean;
  chainId: string | undefined;
  chainType: T;
  connector?: WalletInstance<T>;
};

export type ConnectedAccount = {
  address: string;
  chainId: string | undefined;
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
  readyState: TronWalletReadyState;
  account: string | undefined;
  network: TronNetworkType | undefined;
};
