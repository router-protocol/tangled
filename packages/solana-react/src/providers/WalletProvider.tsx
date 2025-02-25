import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter,
  SolanaMobileWalletAdapterWalletName,
} from '@solana-mobile/wallet-adapter-mobile';
import { Adapter, WalletError, WalletName, WalletNotReadyError, WalletReadyState } from '@solana/wallet-adapter-base';
import { useStandardWalletAdapters } from '@solana/wallet-standard-wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { WalletNotSelectedError } from '../errors/errors.js';
import { useConnection } from '../hooks/useConnection.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { WalletContext } from '../hooks/useWallet.js';
import getEnvironment, { Environment } from '../utils/getEnvironment.js';
import getInferredClusterFromEndpoint from '../utils/getInferredClusterFromEndpoint.js';

export interface WalletProviderProps {
  children: ReactNode;
  wallets: Adapter[];
  autoConnect?: boolean | ((adapter: Adapter) => Promise<boolean>);
  localStorageKey?: string;
  onError?: (error: WalletError, adapter?: Adapter) => void;
}

let _userAgent: string | null;
function getUserAgent() {
  if (_userAgent === undefined) {
    _userAgent = globalThis.navigator?.userAgent ?? null;
  }
  return _userAgent;
}

function getIsMobile(adapters: Adapter[]) {
  const userAgentString = getUserAgent();
  return getEnvironment({ adapters, userAgentString }) === Environment.MOBILE_WEB;
}

function getUriForAppIdentity() {
  const location = globalThis.location;
  if (!location) return;
  return `${location.protocol}//${location.host}`;
}

export const WalletProvider = ({
  children,
  wallets: configAdapters,
  autoConnect,
  localStorageKey = 'solana-walletName',
  onError,
}: WalletProviderProps) => {
  const { connection } = useConnection();
  const adaptersWithStandardAdapters = useStandardWalletAdapters(configAdapters);

  const [walletName, setWalletName] = useLocalStorage<WalletName | null>(
    localStorageKey,
    getIsMobile(adaptersWithStandardAdapters) ? SolanaMobileWalletAdapterWalletName : null,
  );

  const mobileWalletAdapter = useMemo<SolanaMobileWalletAdapter | null>(() => {
    if (!getIsMobile(adaptersWithStandardAdapters)) {
      return null;
    }
    const existingMobileWalletAdapter = adaptersWithStandardAdapters.find(
      (adapter) => adapter.name === SolanaMobileWalletAdapterWalletName,
    );
    if (existingMobileWalletAdapter) {
      return existingMobileWalletAdapter as SolanaMobileWalletAdapter;
    }
    return new SolanaMobileWalletAdapter({
      addressSelector: createDefaultAddressSelector(),
      appIdentity: {
        uri: getUriForAppIdentity(),
      },
      authorizationResultCache: createDefaultAuthorizationResultCache(),
      chain: getInferredClusterFromEndpoint(connection?.rpcEndpoint),
      onWalletNotFound: createDefaultWalletNotFoundHandler(),
    });
  }, [adaptersWithStandardAdapters, connection?.rpcEndpoint]);

  const adaptersWithMobileWalletAdapter = useMemo(() => {
    if (mobileWalletAdapter == null || adaptersWithStandardAdapters.indexOf(mobileWalletAdapter) !== -1) {
      return adaptersWithStandardAdapters;
    }
    return [mobileWalletAdapter, ...adaptersWithStandardAdapters] as Adapter[];
  }, [adaptersWithStandardAdapters, mobileWalletAdapter]);

  /**
   * Last connected wallet adapter. Filtered from `adaptersWithMobileWalletAdapter` by `walletName`.
   */
  const connectedAdapter = useMemo(
    () => adaptersWithMobileWalletAdapter.find((a) => a.name === walletName) ?? null,
    [adaptersWithMobileWalletAdapter, walletName],
  );

  const [readyWallets, setReadyWallets] = useState(() =>
    adaptersWithMobileWalletAdapter
      .map((adapter) => ({
        adapter,
        readyState: adapter.readyState,
      }))
      .filter(({ readyState }) => readyState !== WalletReadyState.Unsupported),
  );

  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connectedAdapters, setConnectedAdapters] = useState<{ [key: string]: Adapter }>({});
  /** current connected wallet. filtered from `readyWallets` by `connectedWallets` */
  const connectedWallet = useMemo(
    () => readyWallets.find((wallet) => wallet.adapter === connectedAdapter) ?? null,
    [connectedAdapter, readyWallets],
  );
  // Boolean flag to indicate if the wallet is connected
  const [connected, setConnected] = useState(() => Boolean(connectedWallet?.adapter.connected));

  /////////////////////////////
  // Mutations
  /////////////////////////////
  const { mutateAsync: handleAutoConnectRequest, isPending: isAutoConnecting } = useMutation({
    mutationKey: ['autoConnectSolanaWallet'],
    mutationFn: async () => {
      if (!autoConnect || !connectedAdapter || connectedAdapter.readyState !== WalletReadyState.Installed) return;
      // If autoConnect is true or returns true, use the default autoConnect behavior.
      if (autoConnect === true || (await autoConnect(connectedAdapter))) {
        if (walletName) {
          await connectedAdapter.connect();
        } else {
          await connectedAdapter.autoConnect();
        }
      }
      return connectedAdapter;
    },
    onError: (error: WalletError) => {
      console.error('solana autoConnect error', error);
      onError?.(error);
    },
    onSuccess: (connectedAdapter) => {
      if (connectedAdapter?.name) {
        setWalletName(connectedAdapter.name);
      }
    },
  });

  // connect wallet mutation
  const {
    mutateAsync: connectWallet,
    isPending: isConnecting,
    // error: connectionError,
  } = useMutation({
    mutationKey: ['connectWallet'],
    mutationFn: async ({ walletName }: { walletName: WalletName }) => {
      const adapter = adaptersWithMobileWalletAdapter.find((adapter) => adapter.name === walletName);
      if (!adapter) {
        throw new WalletNotSelectedError();
      }

      if (!(adapter.readyState === WalletReadyState.Installed || adapter.readyState === WalletReadyState.Loadable))
        throw new WalletNotReadyError();

      await adapter.connect();
      return adapter;
    },
    onError: (error: WalletError) => {
      console.error('solana connectWallet error', error);
      onError?.(error);
    },
    onSuccess: (adapter) => {
      setWalletName(adapter.name);
    },
  });

  // disconnect wallet mutation
  const {
    mutateAsync: disconnect,
    isPending: disconnecting,
    // error: disconnectError,
  } = useMutation({
    mutationKey: ['disconnectWallet'],
    mutationFn: async () => {
      if (!connectedAdapter) {
        throw new WalletError('No wallet connected');
      }

      await connectedAdapter.disconnect();
    },
    onError: (error: WalletError) => {
      console.error('solana disconnectWallet error', error);
      onError?.(error);
    },
    onSuccess: () => {
      setWalletName(null);
    },
  });

  /////////////////////////////
  // Effects and event listeners
  /////////////////////////////

  // Setup and teardown event listeners when the adapter changes
  useEffect(() => {
    if (!connectedAdapter) return;

    const handleConnect = (publicKey: PublicKey) => {
      setPublicKey(publicKey);
      setConnected(true);
    };

    const handleDisconnect = () => {
      setPublicKey(null);
      setConnected(false);
      setWalletName((v) => (connectedAdapter.name === v ? null : v));
    };

    // const handleError = (error: WalletError) => {
    const handleError = () => {
      // handleErrorRef.current(error, connectedAdapter);
      // TODO: raise error
    };

    connectedAdapter.on('connect', handleConnect);
    connectedAdapter.on('disconnect', handleDisconnect);
    connectedAdapter.on('error', handleError);

    return () => {
      // connectedAdapter.removeAllListeners()
      connectedAdapter.off('connect', handleConnect);
      connectedAdapter.off('disconnect', handleDisconnect);
      connectedAdapter.off('error', handleError);

      // handleDisconnect();
    };
  }, [connectedAdapter, setWalletName]);

  // When the adapters change, start to listen for changes to their `readyState`
  useEffect(() => {
    // When the adapters change, wrap them to conform to the `Wallet` interface
    setReadyWallets((wallets) =>
      adaptersWithMobileWalletAdapter
        .map((adapter, index) => {
          const wallet = wallets[index];
          // If the wallet hasn't changed, return the same instance
          return wallet && wallet.adapter === adapter && wallet.readyState === adapter.readyState
            ? wallet
            : {
                adapter: adapter,
                readyState: adapter.readyState,
              };
        })
        .filter(({ readyState }) => readyState !== WalletReadyState.Unsupported),
    );

    function handleReadyStateChange(this: Adapter, readyState: WalletReadyState) {
      setReadyWallets((prevWallets) => {
        const index = prevWallets.findIndex(({ adapter }) => adapter === this);
        if (index === -1) return prevWallets;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { adapter } = prevWallets[index]!;
        return [...prevWallets.slice(0, index), { adapter, readyState }, ...prevWallets.slice(index + 1)].filter(
          ({ readyState }) => readyState !== WalletReadyState.Unsupported,
        );
      });
    }

    function handleOnConnect(this: Adapter) {
      setConnected(true);
      setPublicKey(this.publicKey);
      setConnectedAdapters((prevWallets) => {
        return {
          ...prevWallets,
          [this.name]: this,
        };
      });
    }

    function handleOnDisconnect(this: Adapter) {
      setConnected(false);
      setPublicKey(null);
      setConnectedAdapters((prevWallets) => {
        delete prevWallets[this.name];
        return { ...prevWallets };
      });
    }

    adaptersWithMobileWalletAdapter.forEach((_adapter) =>
      _adapter.on('readyStateChange', handleReadyStateChange, _adapter),
    );
    adaptersWithMobileWalletAdapter.forEach((_adapter) => _adapter.on('connect', handleOnConnect, _adapter));
    adaptersWithMobileWalletAdapter.forEach((_adapter) => _adapter.on('disconnect', handleOnDisconnect, _adapter));
    return () => {
      adaptersWithMobileWalletAdapter.forEach((_adapter) =>
        _adapter.off('readyStateChange', handleReadyStateChange, _adapter),
      );
    };
  }, [connectedAdapter, adaptersWithMobileWalletAdapter, configAdapters]);

  // Auto connect when the wallet is ready
  useEffect(() => {
    if (connected || !handleAutoConnectRequest) {
      return;
    }

    const shouldAutoConnect =
      connectedWallet?.readyState === WalletReadyState.Installed ||
      connectedWallet?.readyState === WalletReadyState.Loadable;

    if (!shouldAutoConnect) {
      return;
    }

    (async function () {
      try {
        await handleAutoConnectRequest();
      } catch {
        console.error('Auto connect failed');
      }
    })();
  }, [connected, connectedWallet?.readyState, handleAutoConnectRequest]);

  return (
    <WalletContext.Provider
      value={{
        autoConnect: typeof autoConnect === 'function' ? true : Boolean(autoConnect),
        connectedAdapter: connectedAdapter,
        wallets: readyWallets,
        connections: Object.values(connectedAdapters),
        wallet: connectedWallet,
        publicKey,
        connecting: isConnecting || isAutoConnecting,
        connected: connected,
        disconnecting,

        connect: connectWallet,
        disconnect: disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
