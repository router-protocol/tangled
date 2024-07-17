import { useMutation } from '@tanstack/react-query';
import { createContext, useCallback, useEffect, useRef } from 'react';
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
  // walletList: IPolkadotWalletListItem[]
}) => {
  // const [nightlyAdapter, setNightlyAdapter] = useState<connectedAdapterAdapter>();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const connectedAdapter = connectedAdapterAdapter.buildLazy({
  //         appMetadata: {
  //           name: 'NC AlephZero nitro sdk',
  //           description: 'Nightly Connect Test',
  //           icon: 'https://docs.nightly.app/img/logo.png',
  //           additionalInfo: 'Courtesy of Nightly Connect team'
  //         },
  //         network: 'AlephZero',
  //       }));
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const alephStore = useRef(createAlephStore({ adapter: NightlyConnectAdapter })).current;
  // console.log("aleph store- ", alephStore)
  const connectedAdapter = useStore(alephStore, (state) => state.connectedAdapter);
  const setConnectedAdapter = useStore(alephStore, (state) => state.setConnectedAdapter);
  const setConnectors = useStore(alephStore, (state) => state.setConnectors);
  const setAddress = useStore(alephStore, (state) => state.setAddress);
  const connectorss = useStore(alephStore, (state) => state.connectors);

  ///////////////////
  ///// Handlers ////
  ///////////////////
  const handleConnect = useCallback(
    function (this: IPolkadotWalletListItem, address: string) {
      console.log('this ', this);
      setAddress(address);
      // setConnector({ ...this });
      // setConnectedAdapter(connectedAdapter);
    },
    [setAddress],
  );

  const handleError = useCallback((error: Error) => {
    console.error('[aleph] Error', error);
  }, []);

  const handleAccountChange = useCallback(
    function (this: IPolkadotWalletListItem, adapter: typeof connectedAdapter, address: string) {
      setAddress(address);
      // setConnector({ name: this, account: this.accounts.get(), network: undefined, readyState: this.connected });
      // setConnector({ ...this });
      // setConnectedAdapter(adapter);
      console.log('account change - ', this, adapter, address);
    },
    [setAddress, setConnectedAdapter],
  );

  const handleDisconnect = useCallback(() => {
    setConnectedAdapter(undefined);
  }, [setConnectedAdapter]);

  /////////////////
  /// Effects /////
  /////////////////

  /////////////////
  /// Mutations ///
  /////////////////
  const { mutateAsync: connect } = useMutation({
    mutationKey: ['aleph connect'],
    mutationFn: async (walletName: string) => {
      // const adapter = nightlyAdapter;

      if (!connectedAdapter) {
        throw new Error('no nightly adapter connected');
      }

      const walletAdaters = connectedAdapter.walletsList;
      const connector = walletAdaters.find((adapter) => adapter.slug === walletName);

      if (!connector) {
        throw new Error('Adapter not found');
      }

      await connectedAdapter.connectToWallet(connector.name);
      const accounts = await connectedAdapter.accounts.get();

      return { account: accounts[0].address, chainId: undefined, adapter: connectedAdapter };
    },
    onSuccess: (data) => {
      setAddress(data.account);
      setConnectors(data.adapter);
      console.log('data.adapter - ', data.adapter);
      setConnectedAdapter(data.adapter);

      // setConnector({...data.adapter.walletsList[0]});
      // setConnector({ name: "sd" });
    },
  });

  useEffect(() => {
    console.log('aleph store - ', connectorss);
  }, [connectorss]);

  useEffect(() => {
    console.log('[[[aleph state]]] - ', alephStore.getState());
  });

  const { mutateAsync: disconnect } = useMutation({
    mutationKey: ['aleph disconnect'],
    mutationFn: async () => {
      if (!connectedAdapter) return;
      console.log('disconnect required');
      // TODO: Implement shims for disconnecting some adapters like TronLink
    },
  });

  // console.log("connect aleph ddd ", connect, disconnect)

  return <AlephContext.Provider value={{ store: alephStore, connect, disconnect }}>{children}</AlephContext.Provider>;
};
