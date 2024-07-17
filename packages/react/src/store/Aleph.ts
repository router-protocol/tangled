import { NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';
import { createStore } from 'zustand';

interface AlephProps {
  adapter: typeof NightlyConnectAdapter;
}

export interface AlephState {
  connectors: {
    [key in string]: NightlyConnectAdapter;
  };
  connectedAdapter: NightlyConnectAdapter | undefined;
  address: string | null;

  setAddress: (address: string) => void;
  // setConnector: (connector: IPolkadotWalletListItem) => void;
  setConnectors: (connector: NightlyConnectAdapter) => void;
  setConnectedAdapter: (adapter: NightlyConnectAdapter | undefined) => void;
}

export type AlephStore = ReturnType<typeof createAlephStore>;

export const createAlephStore = (props: AlephProps) => {
  // props.adapters[0]
  // console.log("props alephts - ", await props.adapters[0])

  const DEFAULT_ALEPH_STATE: AlephState = {
    connectors: {},
    connectedAdapter: undefined,
    address: null,

    setAddress: () => {},
    // setConnector: () => {},
    setConnectors: () => {},
    setConnectedAdapter: () => {},
  };
  // DEFAULT_ALEPH_STATE.connectors[0].injectedWallet?.connect("dw")

  // props.walletList[0].connect("kden")

  // const nightlyAdapter = await NightlyConnectAdapter.build({
  //   appMetadata: {
  //     name: 'NC AlephZero nitro sdk',
  //     description: 'Nightly Connect Test',
  //     icon: 'https://docs.nightly.app/img/logo.png',
  //     additionalInfo: 'Courtesy of Nightly Connect team'
  //   },
  //   network: 'AlephZero',
  // })
  // console.log("nightly - ", nightlyAdapter.network, nightlyAdapter.walletsList, nightlyAdapter.fetchWalletList())

  const nightlyConnect = props.adapter.buildLazy({
    appMetadata: {
      name: 'NC AlephZero nitro sdk',
      description: 'Nightly Connect Test',
      icon: 'https://docs.nightly.app/img/logo.png',
      additionalInfo: 'Courtesy of Nightly Connect team',
    },
    network: 'AlephZero',
  });

  const connectors = nightlyConnect.selectedWallet
    ? {
        [nightlyConnect.selectedWallet?.name]: nightlyConnect,
      }
    : {};

  return createStore<AlephState>((set) => ({
    ...DEFAULT_ALEPH_STATE,
    connectors,
    connectedAdapter: nightlyConnect,

    setAddress: (address) => set(() => ({ address })),
    // setConnectedAdapter: (adapter) => set(() => ({ connectedAdapter: adapter })),
    // setConnector: (connector) =>
    //   set((state) => ({ connectors: { ...state.connectors, [connector.name]: connector } })),
    setConnectors: (connector) => set(() => ({ [connector.selectedWallet!.name]: connector })),
  }));
};
