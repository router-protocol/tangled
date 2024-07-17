import { NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';

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
  const DEFAULT_ALEPH_STATE: AlephState = {
    connectors: {},
    connectedAdapter: undefined,
    address: null,

    setAddress: () => {},
    // setConnector: () => {},
    setConnectors: () => {},
    setConnectedAdapter: () => {},
  };

  const nightlyConnect = props.adapter.buildLazy({
    appMetadata: {
      name: 'NC AlephZero nitro sdk',
      description: 'Nightly Connect Test',
      icon: 'https://docs.nightly.app/img/logo.png',
      additionalInfo: 'Courtesy of Nightly Connect team',
    },
    network: 'AlephZero',
  });

  const connectors: { [key in string]: NightlyConnectAdapter } = {};
  if (nightlyConnect.selectedWallet) {
    connectors[nightlyConnect.selectedWallet.name.toLowerCase()] = nightlyConnect;
  }

  return createStore<AlephState>()(
    devtools((set) => ({
      ...DEFAULT_ALEPH_STATE,
      connectors,
      connectedAdapter: nightlyConnect,

      setAddress: (address) => set(() => ({ address })),
      setConnectors: (connector) => {
        if (!connector.selectedWallet) return;
        const selectedWallet = connector.selectedWallet;
        const slug =
          connector.walletsList.find((wallet) => wallet.name === selectedWallet.name)?.slug ??
          selectedWallet.name.toLowerCase();
        set(() => ({ connectors: { [slug]: connector } }));
      },
    })),
  );
};
