import { Adapter, NetworkType } from '@tronweb3/tronwallet-abstract-adapter';
import { createContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { TronStore, createTronStore } from '../store/Tron.js';
import { ChainData, ChainId } from '../types/index.js';
import { getTronNetwork } from '../utils/getTronNetwork.js';

interface TronContextValues {
  connect: (adapterId: string) => Promise<{ account: string; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
}

export const TronContext = createContext<TronContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
});

export const TronStoreContext = createContext<TronStore | null>(null);

/**
 * @notice This provider is used to connect to the Tron network.
 * @param connectors - The connectors to use.
 * @param network - The network to connect to.
 * @returns The Tron provider context with the connect and disconnect functions.
 */
const TronProvider = ({
  children,
  adapters,
  // chains,
}: {
  children: React.ReactNode;
  chains: ChainData<'tron'>[];
  adapters: Adapter[];
}) => {
  const tronStore = useRef(createTronStore({ adapters })).current;

  const tronConnectors = useStore(tronStore, (state) => state.connectors);
  const setConnector = useStore(tronStore, (state) => state.setConnector);

  useEffect(() => {
    const connectors = Object.values(tronConnectors);

    connectors.forEach((tronAdapter) => {
      if (tronAdapter.adapter.listeners('connect').length > 0) return;

      tronAdapter.adapter.on('connect', () => {
        // tronAdapter.account = tronAdapter.adapter.address!;
        setConnector({ ...tronAdapter, account: tronAdapter.adapter.address! });
      });

      tronAdapter.adapter.on('readyStateChanged', (state) => {
        setConnector({ ...tronAdapter, readyState: state });
      });

      tronAdapter.adapter.on('accountsChanged', (data) => {
        setConnector({ ...tronAdapter, account: data });
      });

      tronAdapter.adapter.on('chainChanged', (data) => {
        setConnector({ ...tronAdapter, network: data as NetworkType });
      });

      tronAdapter.adapter.on('disconnect', () => {
        setConnector({ ...tronAdapter, account: undefined, network: undefined });
      });
    });

    return () => {
      connectors.forEach((tronAdapter) => {
        tronAdapter.adapter.removeAllListeners();
      });
    };
  }, [setConnector, tronConnectors]);

  const connect = async (adapterId: string) => {
    const adapter = tronConnectors[adapterId];

    if (!adapter) throw new Error('Adapter not found');

    await adapter.adapter.connect();

    return { account: adapter.account!, chainId: getTronNetwork(adapter.network) };
  };

  const disconnect = async () => {};

  return (
    <TronStoreContext.Provider value={tronStore}>
      <TronContext.Provider value={{ connect, disconnect }}>{children}</TronContext.Provider>
    </TronStoreContext.Provider>
  );
};

export default TronProvider;
