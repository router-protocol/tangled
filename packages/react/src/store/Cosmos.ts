import { ChainWalletBase, MainWalletBase, WalletManager } from '@cosmos-kit/core';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface CosmosState {
  connectedMainWallet: MainWalletBase | undefined;
  chainWallets: Record<string, ChainWalletBase>;
  walletManager: WalletManager | undefined;

  // Actions
  setConnectedMainWallet: (wallet: MainWalletBase | undefined) => void;
  setChainWallets: (chainWallets: ChainWalletBase[]) => void;
  setWalletManager: (adapter: WalletManager | undefined) => void;

  getCosmosClient: () => {
    walletManaer: WalletManager | undefined;
    chainWallets: Record<string, ChainWalletBase>;
  };
  reset: () => void;
}

export type CosmosStore = ReturnType<typeof createCosmosStore>;

export const createCosmosStore = () => {
  return createStore<CosmosState>()(
    devtools((set, get) => ({
      connectedMainWallet: undefined,
      chainWallets: {},
      walletManager: undefined,
      address: null,

      getCosmosClient: () => ({
        walletManaer: get().walletManager,
        chainWallets: get().chainWallets,
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

      // Sets the current connected adapter
      setWalletManager: (walletManager) => set(() => ({ walletManager })),

      // Resets the store to its default state
      reset: () =>
        set(() => ({
          connectors: {},
          walletManager: undefined,
          address: null,
        })),
    })),
  );
};
