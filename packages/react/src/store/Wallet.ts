import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { Account, ConnectedAccounts, ConnectedWallets, CurrentWallet } from '../types/wallet.js';

interface WalletState {
  currentWallet: CurrentWallet;
  currentAccount: Account;
  connectedWallets: ConnectedWallets;
  connectedAccounts: ConnectedAccounts;

  setCurrentWallet: (wallet: CurrentWallet) => void;
  setCurrentAccount: (account: Account) => void;
  setConnectedWallets: (wallets: Partial<ConnectedWallets>) => void;
  setConnectedAccounts: (accounts: ConnectedAccounts) => void;
}

export const useWalletsStore = create<WalletState>()(
  devtools(
    persist(
      (set) => ({
        currentWallet: { id: '', type: 'evm' },
        currentAccount: { address: '', chainId: '', chainType: 'evm', wallet: '' },
        connectedWallets: {
          evm: {},
          aleph_zero: {},
          bitcoin: {},
          casper: {},
          cosmos: {},
          near: {},
          solana: {},
          sui: {},
          tron: {},
        },
        connectedAccounts: {},

        setCurrentWallet: (wallet) => set(() => ({ currentWallet: wallet })),
        setCurrentAccount: (account) => set(() => ({ currentAccount: account })),
        setConnectedWallets: (wallets) =>
          set((state) => ({ connectedWallets: { ...state.connectedWallets, ...wallets } })),
        setConnectedAccounts: (accounts) => set(() => ({ connectedAccounts: accounts })),
      }),
      {
        name: 'tangled-wallets', // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      },
    ),
  ),
);
