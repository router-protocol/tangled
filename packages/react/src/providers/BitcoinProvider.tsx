import { useMutation } from '@tanstack/react-query';
import { createContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { BITCOIN_CHAIN_CONFIG, connectToBitcoin, getBitcoinProvider } from '../connectors/bitcoin/connectors.js';
import { BitcoinStore, createBitcoinStore } from '../store/Bitcoin.js';
import { ChainId } from '../types/index.js';

export interface BitcoinContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
  store: BitcoinStore | null;
}

export const BitcoinContext = createContext<BitcoinContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,
});

/**
 * @notice This provider is used to connect to the Bitcoin network.
 * @param adapters - Supported adapters for the Bitcoin network.
 * @returns The Bitcoin provider context with the connect and disconnect functions.
 */
export const BitcoinProvider = ({ children, adapters }: { children: React.ReactNode; adapters: any[] }) => {
  const bitcoinStore = useRef(createBitcoinStore({ adapters })).current;
  const connectedAdapter = useStore(bitcoinStore, (state) => state.connectedAdapter);
  //   const address = useStore(bitcoinStore, (state) => state.address);
  //   const connectors = useStore(bitcoinStore, (state) => state.connectors);
  const setAddress = useStore(bitcoinStore, (state) => state.setAddress);
  const setConnectedAdapter = useStore(bitcoinStore, (state) => state.setConnectedAdapter);
  // const setConnectors = useStore(bitcoinStore, (state) => state.setConnectors);

  ///////////////////
  ///// Mutations ///
  ///////////////////
  const { mutateAsync: connect } = useMutation({
    mutationKey: ['bitcoin connect'],
    mutationFn: async (adapterId: string) => {
      const adapter = adapters.find((adapter) => adapter.id === adapterId);
      if (!adapter) {
        throw new Error('[BITCOIN] Adapter not found');
      }

      const provider = getBitcoinProvider();
      const accounts = await connectToBitcoin();

      if (accounts.length > 0) {
        return { account: accounts[0], chainId: BITCOIN_CHAIN_CONFIG[provider.chainId], adapter: provider };
      }

      return { account: '', chainId: provider.chainId, adapter: provider };
    },
    onSuccess: (data) => {
      setAddress(data.account);
      setConnectedAdapter(data.adapter);
    },
  });

  const { mutateAsync: disconnect } = useMutation({
    mutationKey: ['bitcoin disconnect'],
    mutationFn: async () => {
      if (!connectedAdapter) return;

      // no disconnect method available
      setAddress('');
      setConnectedAdapter(undefined);
    },
  });

  // auto-connect
  useEffect(() => {
    (async function autoConnect() {
      try {
        await connect('xdefi'); // BITCOIN TODO: figure out another way
      } catch (error) {
        console.error('[BITCOIN] Auto connect failed', error);
      }
    })();
  }, [connect]);

  return (
    <BitcoinContext.Provider
      value={{
        store: bitcoinStore,
        connect,
        disconnect: disconnect,
      }}
    >
      {children}
    </BitcoinContext.Provider>
  );
};
