import { useMutation } from '@tanstack/react-query';
import { toUserFriendlyAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { createContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { connectExternalWallet } from '../connectors/ton/connector.js';
import { TonStore, createTonStore } from '../store/Ton.js';
import { ChainId, OtherChainData } from '../types/index.js';

export interface TonContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => void;
  store: TonStore | null;
}

export const TonContext = createContext<TonContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,
});

/**
 * @notice This provider is used to connect to the Ton network.
 * @param adapters - Supported adapters for the Ton network.
 * @returns The Ton provider context with the connect and disconnect functions.
 */
export const TonProvider = ({ children, chain }: { children: React.ReactNode; chain: OtherChainData }) => {
  const tonStore = useRef(createTonStore({ chain: chain as OtherChainData<'ton'> })).current;
  const connectedAdapter = useStore(tonStore, (state) => state.connectedAdapter);
  const setConnectedAdapter = useStore(tonStore, (state) => state.setConnectedAdapter);
  const setConnectors = useStore(tonStore, (state) => state.setConnectors);
  const setAddress = useStore(tonStore, (state) => state.setAddress);

  const [tonConnectUI] = useTonConnectUI();

  /////////////////
  /// Mutations ///
  /////////////////
  const { mutateAsync: connect } = useMutation({
    mutationKey: ['ton connect'],
    mutationFn: async (adapterId: string) => {
      if (!tonConnectUI) {
        throw new Error('No ton adapter found');
      }

      if (tonConnectUI.connected) {
        return {
          account: toUserFriendlyAddress(tonConnectUI.connector.account!.address),
          chainId: undefined,
          adapter: tonConnectUI,
        };
      }

      const wallets = await tonConnectUI.getWallets();
      const tonWallet = wallets.find((wallet) => wallet.appName === adapterId);

      if (tonWallet) {
        tonConnectUI.connector.connect(tonWallet);
      } else {
        await connectExternalWallet(tonConnectUI);
      }

      return { account: '', chainId: undefined, adapter: tonConnectUI };
    },
  });

  const { mutateAsync: disconnect } = useMutation({
    mutationKey: ['ton disconnect'],
    mutationFn: async () => {
      if (!connectedAdapter) {
        throw new Error('No ton adapter found');
      }

      connectedAdapter.connector.disconnect();

      setAddress('');
      setConnectors(connectedAdapter);
      setConnectedAdapter(connectedAdapter);
    },
  });

  // subscribing to the wallet connection status change
  useEffect(() => {
    tonConnectUI.connector.onStatusChange((status) => {
      if (status) {
        setAddress(toUserFriendlyAddress(tonConnectUI.connector.account!.address));
        setConnectedAdapter(tonConnectUI);
        setConnectors(tonConnectUI);
      }
    });
  }, [tonConnectUI, setAddress, setConnectedAdapter, setConnectors, connect]);

  return <TonContext.Provider value={{ store: tonStore, connect, disconnect }}>{children}</TonContext.Provider>;
};
