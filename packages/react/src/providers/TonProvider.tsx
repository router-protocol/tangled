import { useMutation } from '@tanstack/react-query';
import { TonConnectUI, toUserFriendlyAddress, useTonConnectUI, WalletInfo } from '@tonconnect/ui-react';
import { createContext, useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { connectExternalWallet } from '../connectors/ton/connector.js';
import { createTonStore, TonStore } from '../store/Ton.js';
import { ChainId, OtherChainData } from '../types/index.js';

export interface TonContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => void;
  store: TonStore | null;
  tonAdapter: TonConnectUI | undefined;
  wallets: WalletInfo[];
}

export const TonContext = createContext<TonContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,
  tonAdapter: undefined,
  wallets: [],
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
  const [tonWallets, setTonWallets] = useState<WalletInfo[]>([]);

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
        const connectedWalletId = tonConnectUI.wallet?.device.appName.toLowerCase();
        if (adapterId !== connectedWalletId) {
          disconnect();
        } else {
          return {
            account: toUserFriendlyAddress(tonConnectUI.connector.account!.address),
            chainId: undefined,
            adapter: tonConnectUI,
          };
        }
      }

      const tonWallet = tonWallets.find((wallet) => wallet.appName === adapterId);

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

  // fetching supported ton wallets
  useEffect(() => {
    tonConnectUI
      .getWallets()
      .then((wallets) => {
        setTonWallets(wallets);
      })
      .catch((error) => {
        console.error('Failed to fetch ton wallets', error);
      });
  }, [tonConnectUI]);

  return (
    <TonContext.Provider
      value={{ store: tonStore, connect, disconnect, wallets: tonWallets, tonAdapter: tonConnectUI }}
    >
      {children}
    </TonContext.Provider>
  );
};
