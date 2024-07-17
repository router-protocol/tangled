import { useMutation } from '@tanstack/react-query';
import { createContext, useCallback, useEffect } from 'react';
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

  const alephStore = createAlephStore({ adapter: NightlyConnectAdapter });
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
  // useEffect(() => {
  //   function handleStateChange(wallet: IPolkadotWalletListItem) {
  //       if (connectedAdapter) {
  //       console.log("state change - ", wallet, connectedAdapter.selectedWallet)
  //       // setConnector({  });
  //       // setConnector({ ...this});
  //     }
  //     }

  //     adapters.forEach((wallet) => connectedAdapter.selectedWallet?.name == wallet.name && handleStateChange(wallet));
  //     // adapters.forEach((adapter) => adapter.on('stateChanged', handleStateChange, adapter));
  //     // return () => adapters.forEach((adapter) => adapter.off('stateChanged', handleStateChange, adapter));
  // }, [connectedAdapter.selectedWallet, adapters, setConnector]);

  useEffect(() => {
    if (connectedAdapter) {
      // connectedAdapter.on('connect', handleConnect, connectedAdapter);
      // connectedAdapter.on('error', handleError);
      // connectedAdapter.on('accountsChanged', handleAccountChange, connectedAdapter);
      // connectedAdapter.on('disconnect', handleDisconnect);
      // connectedAdapter.on('chainChanged', handleChainChanged);
      // connectedAdapter.on('readyStateChanged', handleReadyStateChanged);
      // const acc = connectedAdapter.accounts.get()

      const fetchAccounts = async () => {
        try {
          console.log('acc connectedAdapter', connectedAdapter);
          const acc = await connectedAdapter.accounts.get();
          console.log('acc in useeffect', acc);
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      };

      fetchAccounts();

      // return () =>
      // {
      // connectedAdapter.off('connect', handleConnect);
      // connectedAdapter.off('error', handleError);
      // connectedAdapter.off('accountsChanged', handleAccountChange);
      // connectedAdapter.off('disconnect', handleDisconnect);
      // connectedAdapter.off('chainChanged', handleChainChanged);
      // connectedAdapter.off('readyStateChanged', handleReadyStateChanged);
      // };
    }
  }, [handleConnect, handleError, handleAccountChange, handleDisconnect, connectedAdapter]);

  // useEffect(() => {
  //   return () => {
  //     connectedAdapter?.disconnect();
  //   };
  // }, [connectedAdapter]);

  // autoconnect
  // useEffect(() => {
  //   if (!connectedAdapter || connectedAdapter.state !== AdapterState.Disconnect) {
  //     return;
  //   }
  //   (async function autoConnect() {
  //     try {
  //       await connectedAdapter.connect();
  //     } catch (error) {
  //       console.error('[TRON] Auto connect failed', error);
  //     }
  //   })();
  // }, [connectedAdapter]);

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
      console.log('adapter in mutate ', adapters, walletAdaters, walletName, connector);
      if (!connector) {
        throw new Error('Adapter not found');
      }
      console.log('adapter connector aleph ', connector, connectedAdapter);

      await connectedAdapter.connectToWallet(connector.name);
      const accounts = await connectedAdapter.accounts.get();
      console.log('adapter connected - ', connectedAdapter, await connectedAdapter.accounts.get(), accounts);
      // setAddress(accounts[0].address);
      // handleAccountChange(adapter, accounts[0].address);

      console.log('selected wallet', connectedAdapter.selectedWallet);
      return { account: accounts[0].address, chainId: undefined, adapter: connectedAdapter };
    },
    onSuccess: (data) => {
      setAddress(data.account);
      console.log('data.adapter ', data.adapter);
      setConnectors(data.adapter);
      setConnectedAdapter(data.adapter);
      // setConnector({...data.adapter.walletsList[0]});
      // setConnector({ name: "sd" });
    },
  });

  console.log('connect aleph connectorss ', connectorss);

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
