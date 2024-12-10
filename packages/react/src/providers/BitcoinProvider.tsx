import { useMutation } from '@tanstack/react-query';
import { createContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import {
  BITCOIN_CHAIN_CONFIG,
  connectToBitcoin,
  ctrlWallet,
  getBitcoinProvider,
} from '../connectors/bitcoin/connectors.js';
import { useTangledConfig } from '../hooks/useTangledConfig.js';
import { BitcoinStore, createBitcoinStore } from '../store/Bitcoin.js';
import { XfiBitcoinConnector } from '../types/bitcoin.js';
import { ChainId } from '../types/index.js';
import { Wallet } from '../types/wallet.js';

export interface BitcoinContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
  store: BitcoinStore | null;

  bitcoinProvider: XfiBitcoinConnector | undefined;
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

  const config = useTangledConfig((state) => state.config);

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

      if (bitcoinProvider && accounts.length > 0) {
        // setting localStorage for handling autoconnect
        localStorage.setItem('ctrlConnection', 'true');
        return {
          account: accounts[0],
          chainId: BITCOIN_CHAIN_CONFIG[bitcoinProvider.chainId],
          adapter: bitcoinProvider,
        };
      }

      return { account: '', chainId: bitcoinProvider?.chainId as ChainId, adapter: bitcoinProvider };
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

      localStorage.removeItem('ctrlConnection');
      // no disconnect method available
      setAddress('');
      setConnectedAdapter(undefined);
    },
  });

  // NOTE: This is an unconventional way to listen for `accountsChange` events since window.xfi.bitcoin event listeners don't work as expected
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.xfi?.ethereum.on('accountsChanged', (account: unknown) => {
      // Checking if account is an array and has valid addresses
      if (Array.isArray(account) && account.length > 0) {
        const validAccount = account[0];
        if (validAccount) {
          connect(ctrlWallet.id);
        }
      } else {
        localStorage.removeItem('ctrlConnection');
      }
    });
  }, [connect]);

  // auto-connect
  useEffect(() => {
    (async function autoConnect() {
      const isctrlConnected = JSON.parse(localStorage.getItem('ctrlConnection') || 'null');
      if (isctrlConnected) {
        try {
          await connect(ctrlWallet.id);
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
