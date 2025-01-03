import { useMutation } from '@tanstack/react-query';
import { Adapter, AdapterState } from '@tronweb3/tronwallet-abstract-adapter';
import { createContext, useCallback, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { tronMainnet } from '../chains/tron.js';
import { TronStore, createTronStore } from '../store/Tron.js';
import { ChainId, TronChain } from '../types/index.js';

export interface TronContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
  store: TronStore | null;
}

export const TronContext = createContext<TronContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: createTronStore({ adapters: [], chain: tronMainnet }),
});

/**
 * @notice This provider is used to connect to the Tron network.
 * @param adapters - Supported adapters for the Tron network.
 * @returns The Tron provider context with the connect and disconnect functions.
 */
export const TronProvider = ({
  children,
  adapters,
  chain,
}: {
  children: React.ReactNode;
  chain: TronChain;
  adapters: Adapter[];
}) => {
  const tronStore = useRef(createTronStore({ adapters, chain: chain })).current;
  const connectedAdapter = useStore(tronStore, (state) => state.connectedAdapter);
  const setConnectedAdapter = useStore(tronStore, (state) => state.setConnectedAdapter);
  const setConnector = useStore(tronStore, (state) => state.setConnector);
  const setAddress = useStore(tronStore, (state) => state.setAddress);
  // const tronWeb = useStore(tronStore, (state) => state.tronweb);
  const setTronWeb = useStore(tronStore, (state) => state.setTronWeb);

  ///////////////////
  ///// Handlers ////
  ///////////////////
  const handleConnect = useCallback(
    function (this: Adapter, address: string) {
      if (tronStore.getState().connectedAdapter?.name === this.name) setAddress(address);
      const connector = tronStore.getState().connectors[this.name];
      setConnector({ adapter: this, account: address, network: connector.network, readyState: this.state });
    },
    [setAddress, setConnector, tronStore],
  );

  const handleError = useCallback((error: Error) => {
    console.error('[TRON] Error', error);
  }, []);

  const handleAccountChange = useCallback(
    function (this: Adapter, address: string) {
      if (tronStore.getState().connectedAdapter?.name === this.name) setAddress(address);
      const connector = tronStore.getState().connectors[this.name];
      setConnector({ adapter: this, account: address, network: connector.network, readyState: this.state });
    },
    [setAddress, setConnector, tronStore],
  );

  const handleDisconnect = useCallback(() => {
    setConnectedAdapter(undefined);
  }, [setConnectedAdapter]);

  const handleChainChanged = useCallback(
    function (this: Adapter, { chainId }: any) {
      if (!this) return;

      setConnector({
        adapter: this,
        account: this?.address,
        network: chainId,
        readyState: this?.state,
      });
    },
    [setConnector],
  );

  ///////////////////
  ///// Effects /////
  ///////////////////
  useEffect(() => {
    function handleStateChange(this: Adapter) {
      setConnector({ adapter: this, account: this.address, network: undefined, readyState: this.state });
    }

    adapters.forEach((adapter) => {
      adapter.on('stateChanged', handleStateChange, adapter);
      adapter.on('connect', handleConnect, adapter);
      adapter.on('accountsChanged', handleAccountChange, adapter);
      adapter.on('chainChanged', handleChainChanged, adapter);
      adapter.on('error', handleError);
      adapter.on('disconnect', handleDisconnect);
    });

    return () => {
      adapters.forEach((adapter) => {
        adapter.off('stateChanged', handleStateChange, adapter);
        adapter.off('connect', handleConnect, adapter);
        adapter.off('accountsChanged', handleAccountChange, adapter);
        adapter.off('chainChanged', handleChainChanged, adapter);
        adapter.off('error', handleError);
        adapter.off('disconnect', handleDisconnect);
      });
    };
  }, [
    adapters,
    handleAccountChange,
    handleChainChanged,
    handleConnect,
    handleDisconnect,
    handleError,
    setConnector,
    tronStore,
  ]);

  // autoconnect
  useEffect(() => {
    if (!connectedAdapter || connectedAdapter.state !== AdapterState.Disconnect) {
      return;
    }
    (async function autoConnect() {
      try {
        await connectedAdapter.connect();
      } catch (error) {
        console.error('[TRON] Auto connect failed', error);
      }
    })();
  }, [connectedAdapter]);

  ///////////////////
  ///// Mutations ///
  ///////////////////
  const { mutateAsync: connect } = useMutation({
    mutationKey: ['tron connect'],
    mutationFn: async (adapterId: string) => {
      const adapter = adapters.find((adapter) => adapter.name === adapterId);
      if (!adapter) {
        throw new Error('Adapter not found');
      }

      await adapter.connect();
      const tronWeb = window.tron?.tronWeb;
      if (!tronWeb) {
        throw new Error('TronWeb not found');
      }

      return { account: adapter.address, chainId: undefined, adapter, tronWeb };
    },
    onSuccess: (data) => {
      setConnectedAdapter(data.adapter);
      setTronWeb(data.tronWeb);
    },
  });

  const { mutateAsync: disconnect } = useMutation({
    mutationKey: ['tron disconnect'],
    mutationFn: async () => {
      if (!connectedAdapter) return;
      await connectedAdapter.disconnect();
      // TODO: Implement shims for disconnecting some adapters like TronLink
    },
  });

  return <TronContext.Provider value={{ store: tronStore, connect, disconnect }}>{children}</TronContext.Provider>;
};
