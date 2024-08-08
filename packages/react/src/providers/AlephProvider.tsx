import { NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';
import { useMutation } from '@tanstack/react-query';
import { createContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { AlephStore, createAlephStore } from '../store/Aleph.js';
import { ChainData, ChainId } from '../types/index.js';

export interface AlephContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
  store: AlephStore | null;
}

export const AlephContext = createContext<AlephContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,
});

/**
 * @notice This provider is used to connect to the Aleph Zero using Nightly Connector.
 * @param adapters - Supported wallet adapters for the Aleph Zero.
 * @returns The Aleph Zero provider context with the connect and disconnect functions.
 */
export const AlephProvider = ({
  children,
  // chains
}: {
  children: React.ReactNode;
  chains: ChainData<'alephZero'>[];
}) => {
  const alephStore = useRef(createAlephStore()).current;
  const connectedAdapter = useStore(alephStore, (state) => state.connectedAdapter);
  const setConnectedAdapter = useStore(alephStore, (state) => state.setConnectedAdapter);
  const setConnectors = useStore(alephStore, (state) => state.setConnectors);
  const setAddress = useStore(alephStore, (state) => state.setAddress);

  // Build and set Nightly Adapter
  // Used build instead of buildLazy to fix nightlyAdapter loading issue while fetching supported nigthly wallet list(walletsFromRegistry)
  useEffect(() => {
    (async () => {
      try {
        const connectedAdapter = await NightlyConnectAdapter.build({
          appMetadata: {
            name: 'NC AlephZero nitro sdk',
            description: 'Nightly Connect Test',
            icon: 'https://docs.nightly.app/img/logo.png',
            additionalInfo: 'Courtesy of Nightly Connect team',
          },
          network: 'AlephZero',
          persistent: true,
        });

        setConnectedAdapter(connectedAdapter);
      } catch (error) {
        console.error('Error Connecting with Nightly:', error);
      }
    })();
  }, [setConnectedAdapter]);

  /////////////////
  /// Mutations ///
  /////////////////
  const { mutateAsync: connect } = useMutation({
    mutationKey: ['aleph connect'],
    mutationFn: async (walletSlug: string) => {
      if (!connectedAdapter) {
        throw new Error('No nightly adapter found');
      }

      const walletAdaters = connectedAdapter.walletsFromRegistry;
      const connector = walletAdaters.find((adapter) => adapter.name.toLowerCase() === walletSlug.toLowerCase());

      if (!connector) {
        throw new Error('Wallet connector not found');
      }

      await connectedAdapter.connectToWallet(connector.name);
      const accounts = await connectedAdapter.accounts.get();

      return { account: accounts[0].address, chainId: undefined, adapter: connectedAdapter, acc: accounts };
    },
    onSuccess: (data) => {
      setAddress(data.account);
      setConnectors(data.adapter);
      setConnectedAdapter(data.adapter);
    },
  });

  const { mutateAsync: disconnect } = useMutation({
    mutationKey: ['aleph disconnect'],
    mutationFn: async () => {
      if (!connectedAdapter) return;

      await connectedAdapter.disconnect();

      setConnectors(connectedAdapter);
      setConnectedAdapter(connectedAdapter);
      setAddress('');
    },
  });

  // Change Account subscription, runs when user changes account
  useEffect(() => {
    if (!connectedAdapter) {
      return;
    }

    const handleAccountsUpdate = (acc: { address: string }[]) => {
      if (!acc[0]) return;
      setConnectors(connectedAdapter);
      setAddress(acc[0].address);
    };

    const unsubscribe = connectedAdapter.accounts.subscribe(handleAccountsUpdate);
    return () => {
      unsubscribe();
    };
  }, [connectedAdapter, setConnectors, setAddress]);

  // Eager connect when the page reloads
  useEffect(() => {
    const recentWalletItem = localStorage.getItem('NIGHTLY_CONNECT_RECENT_WALLET_AlephZero');

    if (connectedAdapter && !connectedAdapter?.connected && recentWalletItem !== null) {
      const recentWalletName = JSON.parse(recentWalletItem)?.walletName;
      if (!recentWalletName) return;

      connect(recentWalletName);
    }
  }, [connect, connectedAdapter]);

  return <AlephContext.Provider value={{ store: alephStore, connect, disconnect }}>{children}</AlephContext.Provider>;
};
