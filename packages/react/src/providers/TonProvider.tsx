import { useMutation } from '@tanstack/react-query';
import { TonConnectUIProvider, toUserFriendlyAddress, useTonConnectUI, WalletInfo } from '@tonconnect/ui-react';
import { createContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { createTonStore, TonStore } from '../store/Ton.js';
import { ChainData, ChainId } from '../types/index.js';

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
export const TonProvider = ({ children }: { children: React.ReactNode; chain: ChainData<'ton'> }) => {
  const tonStore = useRef(createTonStore()).current;
  const connectedAdapter = useStore(tonStore, (state) => state.connectedAdapter);
  const setConnectedAdapter = useStore(tonStore, (state) => state.setConnectedAdapter);
  const setConnectors = useStore(tonStore, (state) => state.setConnectors);
  const setAddress = useStore(tonStore, (state) => state.setAddress);

  const [tonConnectUI] = useTonConnectUI();

  // subscribing to the wallet connection status change
  useEffect(() => {
    tonConnectUI.connector.onStatusChange((status) => {
      if (status) {
        console.log('tonconnectui status - ', status);
        setAddress(toUserFriendlyAddress(tonConnectUI.connector.account!.address));
        setConnectedAdapter(tonConnectUI);
        setConnectors(tonConnectUI);
      }
    });
  }, [tonConnectUI, setAddress, setConnectedAdapter, setConnectors]);

  /////////////////
  /// Mutations ///
  /////////////////
  const { mutateAsync: connect } = useMutation({
    mutationKey: ['ton connect'],
    mutationFn: async (adapterId: string) => {
      if (!tonConnectUI) {
        throw new Error('No ton adapter found');
      }

      let tonWallet: WalletInfo | undefined;
      try {
        const wallets = await tonConnectUI.getWallets();
        tonWallet = wallets.find((wallet) => wallet.name === adapterId);

        if (!tonWallet) {
          throw new Error(`Wallet with adapterId ${adapterId} not found`);
        }
      } catch (error) {
        throw new Error('Error fetching ton wallets');
      }

      tonConnectUI.connector.connect(tonWallet);
      // const address = toUserFriendlyAddress(tonConnectUI.connector.account?.address as string);

      return { account: '', chainId: undefined, adapter: tonConnectUI };
    },
    onSuccess: (data) => {
      console.log('data - ', data);
      // setAddress(toUserFriendlyAddress(data.adapter.account?.address as string));
      // setConnectedAdapter(data.adapter);
      // setConnectors(data.adapter);
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

  return (
    <TonConnectUIProvider manifestUrl='http://localhost:3000/manifest.json'>
      <TonContext.Provider value={{ store: tonStore, connect, disconnect }}>{children}</TonContext.Provider>
    </TonConnectUIProvider>
  );
};
