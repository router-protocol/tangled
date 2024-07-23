import { useMutation } from '@tanstack/react-query';
import { createContext, useEffect, useRef } from 'react';
// import { Adapter, AdapterState } from '@tronweb3/tronwallet-abstract-adapter';
import { IPolkadotWalletListItem, NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';
import { useStore } from 'zustand';
import { AlephStore, createAlephStore } from '../store/Aleph.js';
import { ChainData, ChainId } from '../types/index.js';

export interface AlephContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
  store: AlephStore | null;
}

export const AlephContext = createContext<AlephContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,
});

/**
 * @notice This provider is used to connect to the Tron network.
 * @param adapters - Supported adapters for the Tron network.
 * @returns The Tron provider context with the connect and disconnect functions.
 */
export const AlephProvider = ({
  children,
  adapters,
  // chains,
}: {
  children: React.ReactNode;
  chains: ChainData<'aleph_zero'>[];
  adapters: IPolkadotWalletListItem[];
}) => {
  // const [nightlyAdapter, setNightlyAdapter] = useState<NightlyConnectAdapter>();

  const alephStore = useRef(createAlephStore()).current;
  // console.log("aleph store- ", alephStore)
  const connectedAdapter = useStore(alephStore, (state) => state.connectedAdapter);
  const setConnectedAdapter = useStore(alephStore, (state) => state.setConnectedAdapter);
  const setConnectors = useStore(alephStore, (state) => state.setConnectors);
  const setAddress = useStore(alephStore, (state) => state.setAddress);
  const currentAddress = useStore(alephStore, (state) => state.address);

  useEffect(() => {
    (async () => {
      try {
        const connectedAdapter = await NightlyConnectAdapter.build({
          appMetadata: {
            name: 'NC AlephZero nitro sdk',
            description: 'Nightly Connect Test',
            icon: 'https://docs.nightly.app/img/logo.png',
            additionalInfo: 'Courtesy of Nightly Connect team',
          },
          network: 'AlephZero',
          persistent: true,
        });

        console.log('nightly adapter conencted- ', connectedAdapter);
        setConnectedAdapter(connectedAdapter);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, [setConnectedAdapter]);

  /////////////////
  /// Mutations ///
  /////////////////
  const { mutateAsync: connect } = useMutation({
    mutationKey: ['aleph connect'],
    mutationFn: async (walletSlug: string) => {
      if (!connectedAdapter) {
        throw new Error('no nightly adapter found');
      }

      const walletAdaters = connectedAdapter.walletsFromRegistry;
      const connector = walletAdaters.find((adapter) => adapter.name.toLowerCase() === walletSlug.toLowerCase());

      console.log('walletAdaters ', connectedAdapter.walletsList, connectedAdapter.walletsFromRegistry);

      if (!connector) {
        throw new Error('Wallet connector not found');
      }

      await connectedAdapter.connectToWallet(connector.name);
      const accounts = await connectedAdapter.accounts.get();

      console.log('Conencted to ', connector.name, accounts);

      return { account: accounts[0].address, chainId: undefined, adapter: connectedAdapter, acc: accounts };
    },
    onSuccess: (data) => {
      setAddress(data.account);
      setConnectors(data.adapter);
      console.log('data.adapter - ', data.adapter);
      setConnectedAdapter(data.adapter);
    },
  });

  // useEffect(() => {
  //   console.log('[[[aleph state]]] - ', alephStore.getState());
  // }, [alephStore]);

  useEffect(() => {
    if (!connectedAdapter) {
      return;
    }

    const handleAccountsUpdate = async () => {
      const account = await connectedAdapter?.accounts.get();
      setConnectors(connectedAdapter);
      console.log('account --', account);
      // if(accout && accout[0].address !== currentAddress)
      // setConnectedAdapter(connectedAdapter)
    };

    return () => {
      connectedAdapter.accounts.subscribe(handleAccountsUpdate)();
    };
  }, [connectedAdapter, connectedAdapter?.accounts, currentAddress, setConnectedAdapter, setConnectors]);

  const { mutateAsync: disconnect } = useMutation({
    mutationKey: ['aleph disconnect'],
    mutationFn: async () => {
      if (!connectedAdapter) return;

      await connectedAdapter.disconnect();
      setConnectors(connectedAdapter);

      console.log('aleph zero disconnected');
    },
  });

  useEffect(() => {
    if (
      connectedAdapter &&
      !connectedAdapter?.connected &&
      localStorage.getItem('NIGHTLY_CONNECT_RECENT_WALLET_AlephZero') !== null
    ) {
      console.log('eager connect for aleph zero ...');
      JSON.parse(localStorage.getItem('NIGHTLY_CONNECT_RECENT_WALLET_AlephZero')!)?.walletName ??
        connect(JSON.parse(localStorage.getItem('NIGHTLY_CONNECT_RECENT_WALLET_AlephZero')!)?.walletName);
    }
  }, [connect, connectedAdapter]);

  return <AlephContext.Provider value={{ store: alephStore, connect, disconnect }}>{children}</AlephContext.Provider>;
};
