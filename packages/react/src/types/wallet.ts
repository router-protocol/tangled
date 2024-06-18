import {
  Adapter as TronAdapter,
  NetworkType as TronNetworkType,
  WalletReadyState as TronWalletReadyState,
} from '@tronweb3/tronwallet-abstract-adapter';
import { ChainType } from './index.js';

export type Wallet = {
  id: string;
  name: string;
  type: ChainType;
  icon: string;
  installed?: boolean;
  downloadUrl?: string;
  disabled?: boolean;
  hidden?: boolean;
  connector?: any;
};

export type WalletData = {
  address: string;
  loading?: boolean;
  chainId: string | undefined;
};

export type Account = {
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
 * ChainTypeWallets is a map of `walletId` to its connected {@link WalletData}
 */
export type ChainTypeWallets = {
  [walletId in string]?: WalletData;
};

/**
 * ConnectedWallets is a map of `ChainType` to a map of `walletId` to its connected {@link WalletData}
 */
export type ConnectedWallets = {
  [key in ChainType]: ChainTypeWallets;
};

/**
 * ConnectedAccounts is a map of `walletId` to its connected {@link Account}
 */
export type ConnectedAccounts = {
  [walletId in string]?: Account;
};

export type TronAdapter = {
  adapter: TronAdapter;
  readyState: TronWalletReadyState;
  account: string | undefined;
  network: TronNetworkType | undefined;
};
