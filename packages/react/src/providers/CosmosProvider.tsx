import { ChainWalletBase, MainWalletBase } from '@cosmos-kit/core';
import { walletContext } from '@cosmos-kit/react-lite';
import { useMutation } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { CosmosStore, createCosmosStore } from '../store/Cosmos.js';

export interface CosmosContextValues {
  // account: string | undefined;
  connect: (adapterId: string) => Promise<{
    chainWallets: ChainWalletBase[];
    mainWallet: MainWalletBase;
  }>;
  disconnect: () => Promise<void>;
  // wallets: MainWalletBase[];
  store: CosmosStore | null;
}

export const CosmosContext = createContext<CosmosContextValues>({
  // account: undefined,
  connect: async () => ({ chainWallets: [], mainWallet: {} as MainWalletBase }),
  disconnect: async () => {},
  store: null,
});

const CosmosContextProvider = ({ children }: { children: React.ReactNode }) => {
  const cosmosStore = useRef(createCosmosStore()).current;

  const connectedMainWallet = useStore(cosmosStore, (state) => state.connectedMainWallet);

  const setConnectedMainWallet = useStore(cosmosStore, (state) => state.setConnectedMainWallet);
  const setChainWallets = useStore(cosmosStore, (state) => state.setChainWallets);
  const setWalletManager = useStore(cosmosStore, (state) => state.setWalletManager);

  const reset = useStore(cosmosStore, (state) => state.reset);

  const { walletManager } = useContext(walletContext);

  useEffect(() => {
    setWalletManager(walletManager);
    console.log(walletManager);

    // if chainWallets are already connected, set them
    console.log('WALLET MANAGER', walletManager.walletRepos);
  }, [walletManager, setWalletManager]);

  const { mutateAsync: connect } = useMutation({
    mutationKey: ['cosmos connect'],
    mutationFn: async (adapterId: string) => {
      const mainWallet = walletManager.mainWallets.find((wallet) => wallet.walletName === adapterId);

      if (!mainWallet) {
        throw new Error('Failed to connect to Cosmos wallet: wallet not found');
      }

      const client = mainWallet.clientMutable.data;

      if (!client) {
        throw new Error('Failed to connect to Cosmos wallet: main wallet client not found');
      }

      await client.enable?.(['osmosis-1', 'cosmoshub-4', 'injective-1']);

      await mainWallet.connectAll(false);

      const chainWallets = mainWallet.getChainWalletList(false);

      return { chainWallets, mainWallet };
    },
    onSuccess: (data) => {
      console.log(data);

      setConnectedMainWallet(data.mainWallet);
      setChainWallets(data.chainWallets);
    },
  });

  const { mutateAsync: disconnect } = useMutation({
    mutationKey: ['cosmos disconnect'],
    mutationFn: async () => {
      connectedMainWallet?.disconnectAll();
      reset();
      console.log('Successfully disconnected from Cosmos wallet');
    },
  });

  return (
    <CosmosContext.Provider
      value={{
        store: cosmosStore,
        connect,
        disconnect,
      }}
    >
      {children}
    </CosmosContext.Provider>
  );
};

export default CosmosContextProvider;
