import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { NearStore, createNearStore } from '../store/Near.js';
import { ChainId } from '../types/index.js';
// import { useStore } from "zustand";
import {
  ModuleState,
  Wallet,
  WalletSelector,
  WalletSelectorState,
  setupWalletSelector,
} from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNightly } from '@near-wallet-selector/nightly';
import { setupWalletConnect } from '@near-wallet-selector/wallet-connect';

export interface NearContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
  store: NearStore | null;

  wallets: ModuleState[];
}

export const NearContext = createContext<NearContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,

  wallets: [],
});

/**
 * @notice This provider is used to connect to the Near network.
 * @param adapters - Supported adapters for the Near network.
 * @returns The Near provider context with the connect and disconnect functions.
 */
export const NearProvider = ({ children }: { children: React.ReactNode }) => {
  const nearStore = useRef(createNearStore()).current;
  // const connectedAdapter = useStore(nearStore, (state) => state.connectedAdapter)
  // const setConnectors = useStore(nearStore, (state) => state.connectors)
  // const address = useStore(nearStore, (state) => state.address)

  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [wallets, setWallets] = useState<ModuleState[]>([]);

  const getWalletsWithSignMethods = async (state: WalletSelectorState) => {
    return await Promise.all(
      state.modules.map(async (wallet: ModuleState<Wallet>) => {
        return await wallet.wallet();
      }),
    );
  };

  // Initializing the near wallet selector
  const init = useCallback(async () => {
    const _selector: WalletSelector = await setupWalletSelector({
      network: 'testnet',
      modules: [
        setupMyNearWallet(),
        setupNightly(),
        setupWalletConnect({
          projectId: '41980758771052df3f01be0a46f172a5',
          metadata: {
            name: 'Tangled Next Example',
            description: 'Example dapp for multiple wallets integration',
            url: '',
            icons: [''],
          },
        }),
      ],
    });

    setSelector(_selector);
  }, []);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
      throw new Error('Failed to initialize NEAR wallet selector');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscription for setting available near wallets
  useEffect(() => {
    if (!selector) return;

    const subscription = selector.store.observable.subscribe(async (state: WalletSelectorState) => {
      const nearWallets = await getWalletsWithSignMethods(state);
      setWallets(nearWallets);
    });

    return () => subscription.unsubscribe();
  }, [selector]);

  // useEffect(() => {
  //   if (!selector || wallets.length === 0) return;

  //   const getWallets = async () => {
  //     const walletsWithSignMethods = await Promise.all(
  //       wallets.map(async (wallet) => {
  //         const walletWithMethods = await wallet.wallet();
  //         return walletWithMethods;
  //       }),
  //     );
  //     console.log('walletWithSignMethods - ', walletsWithSignMethods);
  //   };

  //   getWallets();
  // }, [selector, wallets]);

  return (
    <NearContext.Provider
      value={{
        store: nearStore,
        connect: async () => ({ account: '', chainId: undefined }),
        disconnect: async () => {},
        wallets,
      }}
    >
      {children}
    </NearContext.Provider>
  );
};
