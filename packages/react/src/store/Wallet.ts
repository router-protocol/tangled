import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { CHAIN_TYPES } from '../types/index.js';
import { ConnectedAccount, ConnectedAccountsByChain, CurrentWallet, WalletsByChain } from '../types/wallet.js';

interface WalletState {
  currentWallet: CurrentWallet | undefined;
  currentAccount: ConnectedAccount | undefined;
  recentWallet: CurrentWallet | undefined;
  matchWallet: string | undefined;

  connectedWalletsByChain: WalletsByChain;
  connectedAccountsByChain: ConnectedAccountsByChain;

  setCurrentWallet: (wallet: CurrentWallet | undefined) => void;
  setCurrentAccount: (account: ConnectedAccount | undefined) => void;

  setRecentWallet: (wallet: CurrentWallet | undefined) => void;
  setMatchWallet: (walletType: string | undefined) => void;

  setConnectedWallets: (chainWallets: Partial<WalletsByChain>) => void;

  setChainConnectedAccounts: (accounts: Partial<ConnectedAccountsByChain>) => void;
  setConnectedAccounts: (connectedAccountsByChain: ConnectedAccountsByChain) => void;
}

export const useWalletsStore = create<WalletState>()(
  devtools(
    persist(
      (set) => ({
        currentWallet: undefined,
        currentAccount: undefined,
        recentWallet: undefined,
        matchWallet: undefined,

        connectedWalletsByChain: CHAIN_TYPES.reduce((acc, chain) => ({ ...acc, [chain]: {} }), {}) as WalletsByChain,

        connectedAccountsByChain: CHAIN_TYPES.reduce(
          (acc, chain) => ({ ...acc, [chain]: {} }),
          {},
        ) as ConnectedAccountsByChain,

        setCurrentWallet: (wallet) => set(() => ({ currentWallet: wallet })),
        setCurrentAccount: (account) => set(() => ({ currentAccount: account })),
        setRecentWallet: (wallet) => set(() => ({ recentWallet: wallet })),
        setMatchWallet: (walletType) => set(() => ({ matchWallet: walletType })),
        setConnectedWallets: (chainWallets) =>
          set((state) => ({ connectedWalletsByChain: { ...state.connectedWalletsByChain, ...chainWallets } })),

        setChainConnectedAccounts: (accounts) =>
          set((state) => ({ connectedAccountsByChain: { ...state.connectedAccountsByChain, ...accounts } })),
        setConnectedAccounts: (accounts) => set(() => ({ connectedAccountsByChain: accounts })),
      }),
      {
        name: 'tangled-wallets', // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        partialize: (state) => ({
          currentWallet: state.currentWallet,
          currentAccount: state.currentAccount,
          recentWallet: state.recentWallet,
          matchWallet: state.matchWallet,
        }),
      },
    ),
  ),
);
