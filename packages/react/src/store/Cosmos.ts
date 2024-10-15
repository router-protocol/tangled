import { type ChainRegistryClient as CosmosChainRegistryClient } from '@chain-registry/client';
import { ChainWalletBase, MainWalletBase, WalletManager } from '@cosmos-kit/core';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getCosmosChainRegistryClient } from '../actions/cosmos/getCosmosChainRegistryClient.js';
import { ChainData } from '../types/index.js';

export interface CosmosState {
  connectedMainWallet: MainWalletBase | undefined;
  chainWallets: Record<string, ChainWalletBase>;
  walletManager: WalletManager | undefined;

  chainRegistry: CosmosChainRegistryClient | undefined;
  wallets: MainWalletBase[];

  // Actions
  setConnectedMainWallet: (wallet: MainWalletBase | undefined) => void;
  setChainWallets: (chainWallets: ChainWalletBase[]) => void;
  setWalletManager: (adapter: WalletManager | undefined) => void;
  setWallets: (wallets: MainWalletBase[]) => void;

  getCosmosClient: () => {
    walletManaer: WalletManager | undefined;
    chainWallets: Record<string, ChainWalletBase>;
    getChainRegistry: () => Promise<CosmosChainRegistryClient>;
  };
  reset: () => void;
}

export type CosmosStore = ReturnType<typeof createCosmosStore>;

export const createCosmosStore = (chains: ChainData[]) => {
  return createStore<CosmosState>()(
    devtools((set, get) => ({
      connectedMainWallet: undefined,
      chainWallets: {},
      walletManager: undefined,
      address: null,

      chainRegistry: undefined,
      wallets: [],

      getCosmosClient: () => ({
        // walletManaer: get().walletManager,
        // chainWallets: get().chainWallets,
        walletManaer: undefined,
        chainWallets: {},
        getChainRegistry: async () => {
          if (get().chainRegistry) return get().chainRegistry!;

          const client = await getCosmosChainRegistryClient(chains.map((chain) => chain.id.toString()));

          set(() => ({ chainRegistry: client }));
          return client;
        },
      }),

      // Updates the wallet client for a specific connector
      setConnectedMainWallet: (wallet) => set(() => ({ connectedMainWallet: wallet })),
      setChainWallets: (chainWalletsArray) => {
        const chainWallets = chainWalletsArray.reduce(
          (acc, wallet) => {
            const key = `${wallet.walletName}:${wallet.chainId}`;
            acc[key] = wallet;
            return acc;
          },
          {} as Record<string, ChainWalletBase>,
        );

        set(() => ({ chainWallets }));
      },

      setWallets: (wallets) => set(() => ({ wallets })),
      // Sets the current connected adapter
      setWalletManager: (walletManager) => set(() => ({ walletManager })),

      // Resets the store to its default state
      reset: () =>
        set(() => ({
          connectors: {},
          walletManager: undefined,
          address: null,
          connectedMainWallet: undefined,
          chainWallets: {},
        })),
    })),
  );
};
