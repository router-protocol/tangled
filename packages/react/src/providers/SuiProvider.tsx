import { NightlyConnectSuiAdapter } from '@nightlylabs/wallet-selector-sui';
import { useMutation } from '@tanstack/react-query';
import { createContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { SuiStore, createSuiStore } from '../store/Sui.js';
import { ChainData, ChainId } from '../types/index.js';

export interface SuiContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
  store: SuiStore | null;
}

export const SuiContext = createContext<SuiContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,
});

/**
 * @notice This provider is used to connect to the Sui Zero using Nightly Connector.
 * @param adapters - Supported wallet adapters for the Sui Zero.
 * @returns The Sui Zero provider context with the connect and disconnect functions.
 */
export const SuiProvider = ({
  children,
  // chains
}: {
  children: React.ReactNode;
  chains: ChainData<'sui'>[];
}) => {
  const suiStore = useRef(createSuiStore()).current;
  const connectedAdapter = useStore(suiStore, (state) => state.connectedAdapter);
  const setConnectedAdapter = useStore(suiStore, (state) => state.setConnectedAdapter);
  const setConnectors = useStore(suiStore, (state) => state.setConnectors);
  const setAddress = useStore(suiStore, (state) => state.setAddress);

  // Build and set Nightly Adapter
  // Used build instead of buildLazy to fix nightlyAdapter loading issue while fetching supported nigthly wallet list(walletsFromRegistry)
  useEffect(() => {
    (async () => {
      try {
        const connectedAdapter = await NightlyConnectSuiAdapter.build({
          appMetadata: {
            name: 'NCTestSui',
            description: 'Nightly Connect Test',
            icon: 'https://docs.nightly.app/img/logo.png',
            additionalInfo: 'Courtesy of Nightly Connect team',
          },
          persistent: true,
        });

        setConnectedAdapter(connectedAdapter);
        connectedAdapter;
        console.log('sui connected - ', await connectedAdapter.fetchWalletsFromRegistry(), connectedAdapter);
      } catch (error) {
        console.error('Error Connecting with Nightly:', error);
      }
    })();
  }, [setConnectedAdapter]);

  /////////////////
  /// Mutations ///
  /////////////////
  const { mutateAsync: connect } = useMutation({
    mutationKey: ['sui connect'],
    mutationFn: async (walletSlug: string) => {
      if (!connectedAdapter) {
        throw new Error('No nightly adapter found');
      }

      const walletAdaters = await connectedAdapter.fetchAllWallets();
      const connector = walletAdaters.find((adapter) => adapter.name.toLowerCase() === walletSlug.toLowerCase());

      if (!connector) {
        throw new Error('Wallet connector not found');
      }

      await connectedAdapter.connectToWallet(connector.name);
      const accounts = await connectedAdapter.getAccounts();

      return { account: accounts[0].address, chainId: undefined, adapter: connectedAdapter, acc: accounts };
    },
    onSuccess: (data) => {
      setAddress(data.account);
      setConnectors(data.adapter);
      setConnectedAdapter(data.adapter);
    },
  });

  const { mutateAsync: disconnect } = useMutation({
    mutationKey: ['sui disconnect'],
    mutationFn: async () => {
      if (!connectedAdapter) return;

      await connectedAdapter.disconnect();
      console.log('finally disconneted');
      // setConnectors(connectedAdapter);
    },
  });

  // Change Account subscription, runs when user changes account
  // useEffect(() => {
  //   if (!connectedAdapter) {
  //     return;
  //   }

  //   const handleAccountsUpdate = async () => {
  //     setConnectors(connectedAdapter);
  //   };

  //   connectedAdapter.accounts.subscribe(handleAccountsUpdate);
  //   const unsubscribe = connectedAdapter.accounts.subscribe(handleAccountsUpdate);
  //   return () => {
  //     unsubscribe();
  //   };
  // });

  // Eager connect when the page reloads
  useEffect(() => {
    const recentWalletItem = localStorage.getItem('NIGHTLY_CONNECT_RECENT_WALLET_Sui');

    if (connectedAdapter && !connectedAdapter?.connected && recentWalletItem !== null) {
      const recentWalletName = JSON.parse(recentWalletItem)?.walletName;
      if (!recentWalletName) return;

      connect(recentWalletName);
    }
  }, [connect, connectedAdapter]);

  return <SuiContext.Provider value={{ store: suiStore, connect, disconnect }}>{children}</SuiContext.Provider>;
};
