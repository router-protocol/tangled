import { MainWalletBase } from '@cosmos-kit/core';
import { createContext } from 'react';
import { BitcoinContextValues } from './BitcoinProvider.js';
import { CosmosContextValues } from './CosmosProvider.js';
import { NearContextValues } from './NearProvider.js';

export const BitcoinContext = createContext<BitcoinContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,

  bitcoinProvider: undefined,
});

export const CosmosContext = createContext<CosmosContextValues>({
  connect: async () => ({ chainWallets: [], mainWallet: {} as MainWalletBase, walletId: '', chainId: '' }),
  disconnect: async () => {},
  store: null,
});

export const NearContext = createContext<NearContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,

  wallets: [],
  nearSelector: {},
});
