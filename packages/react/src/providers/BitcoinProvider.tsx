import { useMutation } from '@tanstack/react-query';
import { createContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import {
  BITCOIN_CHAIN_CONFIG,
  connectToBitcoin,
  getBitcoinProvider,
  xdefiWallet,
} from '../connectors/bitcoin/connectors.js';
import { useTangledConfig } from '../hooks/useTangledConfig.js';
import { BitcoinStore, createBitcoinStore } from '../store/Bitcoin.js';
import { BitcoinConnector } from '../types/bitcoin.js';
import { ChainId } from '../types/index.js';
import { Wallet } from '../types/wallet.js';

export interface BitcoinContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
  store: BitcoinStore | null;

  bitcoinProvider: BitcoinConnector | undefined;
}

export const BitcoinContext = createContext<BitcoinContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,

  bitcoinProvider: undefined,
});

/**
 * @notice This provider is used to connect to the Bitcoin network.
 * @param adapters - Supported adapters for the Bitcoin network.
 * @returns The Bitcoin provider context with the connect and disconnect functions.
 */
export const BitcoinProvider = ({
  children,
  adapters,
}: {
  children: React.ReactNode;
  adapters: Wallet<'bitcoin'>[];
}) => {
  const bitcoinStore = useRef(createBitcoinStore({ adapters })).current;
  const connectedAdapter = useStore(bitcoinStore, (state) => state.connectedAdapter);
  const setAddress = useStore(bitcoinStore, (state) => state.setAddress);
  const setConnectedAdapter = useStore(bitcoinStore, (state) => state.setConnectedAdapter);

  const { config } = useTangledConfig();

  const bitcoinProvider = useRef(getBitcoinProvider()).current;

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

      await bitcoinProvider?.changeNetwork(config.bitcoinNetwork);
      const accounts = await connectToBitcoin();

      if (accounts.length > 0) {
        // setting localStorage for handling autoconnect
        localStorage.setItem('xdefiConnection', 'true');
        return {
          account: accounts[0],
          chainId: BITCOIN_CHAIN_CONFIG[bitcoinProvider.chainId],
          adapter: bitcoinProvider,
        };
      }

      return { account: '', chainId: bitcoinProvider.chainId as ChainId, adapter: bitcoinProvider };
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

      localStorage.removeItem('xdefiConnection');
      // no disconnect method available
      setAddress('');
      setConnectedAdapter(undefined);
    },
  });

  // NOTE: unconventional way to listen to `accountsChange` events - window.xfi.bitcoin event listeners don't work as expected
  useEffect(() => {
    window.xfi.ethereum.on('accountsChanged', () => {
      connect(xdefiWallet.id);
    });
  }, [connect]);

  // auto-connect
  useEffect(() => {
    (async function autoConnect() {
      const isXdefiConnected = JSON.parse(localStorage.getItem('xdefiConnection') || 'null');
      if (isXdefiConnected) {
        try {
          await connect(xdefiWallet.id);
        } catch (error) {
          console.error('[BITCOIN] Auto connect failed', error);
        }
      }
    })();
  }, [connect]);

  return (
    <BitcoinContext.Provider
      value={{
        store: bitcoinStore,
        connect,
        disconnect: disconnect,
        bitcoinProvider,
      }}
    >
      {children}
    </BitcoinContext.Provider>
  );
};
