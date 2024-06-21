import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter,
  SolanaMobileWalletAdapterWalletName,
} from '@solana-mobile/wallet-adapter-mobile';
import { Adapter, WalletError, WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { useStandardWalletAdapters } from '@solana/wallet-standard-wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { ReactNode, useEffect, useMemo, useState } from 'react';
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
  wallets: adapters,
  autoConnect,
  localStorageKey = 'solana-walletName',
  onError,
}: WalletProviderProps) => {
  const { connection } = useConnection();
  const adaptersWithStandardAdapters = useStandardWalletAdapters(adapters);
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
      cluster: getInferredClusterFromEndpoint(connection?.rpcEndpoint),
      onWalletNotFound: createDefaultWalletNotFoundHandler(),
    });
  }, [adaptersWithStandardAdapters, connection?.rpcEndpoint]);

  const adaptersWithMobileWalletAdapter = useMemo(() => {
    if (mobileWalletAdapter == null || adaptersWithStandardAdapters.indexOf(mobileWalletAdapter) !== -1) {
      return adaptersWithStandardAdapters;
    }
    return [mobileWalletAdapter, ...adaptersWithStandardAdapters] as Adapter[];
  }, [adaptersWithStandardAdapters, mobileWalletAdapter]);

  const [connectedWalletName, setConnectedWalletName] = useLocalStorage<WalletName | null>(
    localStorageKey,
    getIsMobile(adaptersWithStandardAdapters) ? SolanaMobileWalletAdapterWalletName : null,
  );

  const connectedAdapter = useMemo(
    () => adaptersWithMobileWalletAdapter.find((a) => a.name === connectedWalletName) ?? null,
    [adaptersWithMobileWalletAdapter, connectedWalletName],
  );

  const [readyWallets, setReadyWallets] = useState(() =>
    adapters
      .map((adapter) => ({
        adapter,
        readyState: adapter.readyState,
      }))
      .filter(({ readyState }) => readyState !== WalletReadyState.Unsupported),
  );

  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  // When the adapters change, start to listen for changes to their `readyState`
  useEffect(() => {
    // When the adapters change, wrap them to conform to the `Wallet` interface
    setReadyWallets((wallets) =>
      adapters
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
    adapters.forEach((adapter) => adapter.on('readyStateChange', handleReadyStateChange, adapter));
    return () => {
      adapters.forEach((adapter) => adapter.off('readyStateChange', handleReadyStateChange, adapter));
    };
  }, [connectedAdapter, adapters]);

  const connectedWallet = useMemo(
    () => readyWallets.find((wallet) => wallet.adapter === connectedAdapter) ?? null,
    [connectedAdapter, readyWallets],
  );

  // Setup and teardown event listeners when the adapter changes
  useEffect(() => {
    if (!connectedAdapter) return;

    const handleConnect = (publicKey: PublicKey) => {
      setPublicKey(publicKey);
    };

    const handleDisconnect = () => {
      setPublicKey(null);
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
      connectedAdapter.off('connect', handleConnect);
      connectedAdapter.off('disconnect', handleDisconnect);
      connectedAdapter.off('error', handleError);

      handleDisconnect();
    };
  }, [connectedAdapter]);

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
        throw new WalletError('Wallet not found');
      }

      await adapter.connect();
      return adapter;
    },
    onError: (error: WalletError) => {
      console.log('connectWallet error', error);
      onError?.(error);
    },
    onSuccess: (adapter) => {
      setConnectedWalletName(adapter.name);
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
      console.log('disconnectWallet error', error);
      onError?.(error);
    },
    onSuccess: () => {
      setConnectedWalletName(null);
    },
  });

  return (
    <WalletContext.Provider
      value={{
        autoConnect: typeof autoConnect === 'function' ? true : Boolean(autoConnect),
        wallets: readyWallets,
        wallet: connectedWallet,
        publicKey,
        connecting: isConnecting,
        connected: connectedWallet !== null,
        disconnecting,

        connect: connectWallet,
        disconnect: disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
