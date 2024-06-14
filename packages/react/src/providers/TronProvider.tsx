import { Adapter, NetworkType, WalletReadyState } from '@tronweb3/tronwallet-abstract-adapter';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';

interface TronContextValues {
  tronAdapter: Adapter | undefined;
  readyState: WalletReadyState | undefined;
  account: string | undefined;
  network: NetworkType | undefined;
  connect: () => Promise<{ account: string; chainId: string }>;
  disconnect: () => Promise<void>;
}

export const TronContext = createContext<TronContextValues>({
  tronAdapter: undefined,
  readyState: undefined,
  account: undefined,
  network: undefined,
  connect: async () => ({ account: '', chainId: '' }),
  disconnect: async () => {},
});

const TronProvider = ({ children }: { children: React.ReactNode }) => {
  const [tronAdapter, setTronAdapter] = useState<Adapter>();
  const [readyState, setReadyState] = useState<WalletReadyState>();
  const [account, setAccount] = useState<string>();
  const [network, setNetwork] = useState<NetworkType>();

  const connecting = useRef(false);

  const initialize = useCallback(async () => {
    // import adapter for walletId
    const adapters = await import('@tronweb3/tronwallet-adapters');

    const _adapter: Adapter = new adapters.TronLinkAdapter();

    // if(walletId === WALLET_ID.tronLink){
    // }

    setTronAdapter(_adapter);
    setReadyState(_adapter.readyState);
    setAccount(_adapter.address!);

    return _adapter;
  }, []);

  useEffect(() => {
    if (!tronAdapter) {
      return;
    }

    if (tronAdapter.address) setAccount(tronAdapter.address);

    tronAdapter.on('connect', () => {
      setAccount(tronAdapter.address!);
    });

    tronAdapter.on('readyStateChanged', (state) => {
      setReadyState(state);
    });

    tronAdapter.on('accountsChanged', (data) => {
      setAccount(data);
    });

    tronAdapter.on('chainChanged', (data) => {
      setNetwork(data as NetworkType);
    });

    tronAdapter.on('disconnect', () => {
      // when disconnect from wallet
      setAccount(undefined);
    });
    return () => {
      // remove all listeners when components is destroyed
      tronAdapter.removeAllListeners();
    };
  }, [initialize, tronAdapter]);

  const connect = useCallback(async () => {
    let adapter = tronAdapter;
    if (!adapter) {
      adapter = await initialize();
    }

    if (connecting.current) {
      return { account: '', chainId: '' };
    }

    let chainId: string = '';

    try {
      connecting.current = true;
      await adapter.connect({});
      // @ts-expect-error Type for network is not available
      chainId = await adapter.network().chainId;
    } catch (error) {
      console.error('Error connecting to wallet', error);
    }

    connecting.current = false;

    return { account: adapter.address || '', chainId };
  }, [initialize, tronAdapter]);

  const disconnect = useCallback(async () => {
    if (!tronAdapter) {
      return;
    }

    try {
      await tronAdapter.disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet', error);
    }
  }, [tronAdapter]);

  return (
    <TronContext.Provider value={{ tronAdapter, readyState, account, network, connect, disconnect }}>
      {children}
    </TronContext.Provider>
  );
};

export default TronProvider;
