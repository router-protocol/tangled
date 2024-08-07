import { useMutation } from '@tanstack/react-query';
import { Adapter, AdapterState } from '@tronweb3/tronwallet-abstract-adapter';
import { createContext, useCallback, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { TronStore, createTronStore } from '../store/Tron.js';
import { ChainData, ChainId } from '../types/index.js';

export interface TronContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
  store: TronStore | null;
}

export const TronContext = createContext<TronContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,
});

/**
 * @notice This provider is used to connect to the Tron network.
 * @param adapters - Supported adapters for the Tron network.
 * @returns The Tron provider context with the connect and disconnect functions.
 */
export const TronProvider = ({
  children,
  adapters,
  // chains,
}: {
  children: React.ReactNode;
  chains: ChainData<'tron'>[];
  adapters: Adapter[];
}) => {
  const tronStore = useRef(createTronStore({ adapters })).current;
  const connectedAdapter = useStore(tronStore, (state) => state.connectedAdapter);
  const setConnectedAdapter = useStore(tronStore, (state) => state.setConnectedAdapter);
  const setConnector = useStore(tronStore, (state) => state.setConnector);
  const setAddress = useStore(tronStore, (state) => state.setAddress);

  ///////////////////
  ///// Handlers ////
  ///////////////////
  const handleConnect = useCallback(
    function (this: Adapter, address: string) {
      setAddress(address);
      setConnector({ adapter: this, account: address, network: undefined, readyState: this.state });
      setConnectedAdapter(this);
    },
    [setAddress, setConnectedAdapter, setConnector],
  );

  const handleError = useCallback((error: Error) => {
    console.error('[TRON] Error', error);
  }, []);

  const handleAccountChange = useCallback(
    function (this: Adapter, address: string) {
      setAddress(address);
      setConnector({ adapter: this, account: address, network: undefined, readyState: this.state });
      setConnectedAdapter(this);
    },
    [setAddress, setConnectedAdapter, setConnector],
  );

  const handleDisconnect = useCallback(() => {
    setConnectedAdapter(undefined);
  }, [setConnectedAdapter]);

  const handleChainChanged = useCallback(
    ({ chainId }: any) => {
      if (!connectedAdapter) return;
      console.log('Chain changed', chainId);
      setConnector({
        adapter: connectedAdapter,
        account: connectedAdapter?.address,
        network: chainId,
        readyState: connectedAdapter?.state,
      });
    },
    [connectedAdapter, setConnector],
  );

  ///////////////////
  ///// Effects /////
  ///////////////////
  useEffect(() => {
    function handleStateChange(this: Adapter) {
      setConnector({ adapter: this, account: this.address, network: undefined, readyState: this.state });
    }

    adapters.forEach((adapter) => adapter.on('stateChanged', handleStateChange, adapter));
    return () => adapters.forEach((adapter) => adapter.off('stateChanged', handleStateChange, adapter));
  }, [adapters, setConnector]);

  useEffect(() => {
    if (connectedAdapter) {
      connectedAdapter.on('connect', handleConnect, connectedAdapter);
      connectedAdapter.on('error', handleError);
      connectedAdapter.on('accountsChanged', handleAccountChange, connectedAdapter);
      connectedAdapter.on('disconnect', handleDisconnect);
      connectedAdapter.on('chainChanged', handleChainChanged);
      // connectedAdapter.on('readyStateChanged', handleReadyStateChanged);
      return () => {
        connectedAdapter.off('connect', handleConnect);
        connectedAdapter.off('error', handleError);
        connectedAdapter.off('accountsChanged', handleAccountChange);
        connectedAdapter.off('disconnect', handleDisconnect);
        connectedAdapter.off('chainChanged', handleChainChanged);
        // connectedAdapter.off('readyStateChanged', handleReadyStateChanged);
      };
    }
  }, [handleConnect, handleError, handleAccountChange, handleDisconnect, connectedAdapter, handleChainChanged]);

  useEffect(() => {
    return () => {
      connectedAdapter?.disconnect();
    };
  }, [connectedAdapter]);

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
      return { account: adapter.address, chainId: undefined, adapter };
    },
    onSuccess: (data) => {
      setConnectedAdapter(data.adapter);
      setConnector({
        adapter: data.adapter,
        account: data.account,
        network: undefined,
        readyState: data.adapter.state,
      });
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
