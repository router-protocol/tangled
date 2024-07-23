import { NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';

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

export const createAlephStore = () => {
  const DEFAULT_ALEPH_STATE: AlephState = {
    connectors: {},
    connectedAdapter: undefined,
    address: null,

    setAddress: () => {},
    // setConnector: () => {},
    setConnectors: () => {},
    setConnectedAdapter: () => {},
  };

  const connectors: { [key in string]: NightlyConnectAdapter } = {};

  // console.log('nightly walletlist - ', nightlyConnect.walletsList)
  return createStore<AlephState>()(
    devtools((set) => ({
      ...DEFAULT_ALEPH_STATE,
      connectors,

      setConnectedAdapter: (connectedAdapter) => set(() => ({ connectedAdapter })),

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
