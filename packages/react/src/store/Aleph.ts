import { NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';
import type { ApiPromise, WsProvider } from '@polkadot/api';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface AlephState {
  connectors: {
    [key in string]: NightlyConnectAdapter;
  };
  connectedAdapter: NightlyConnectAdapter | undefined;
  address: string | null;

  wsProvider: WsProvider | undefined;
  api: ApiPromise | undefined;

  setAddress: (address: string) => void;
  setConnectors: (connector: NightlyConnectAdapter) => void;
  setConnectedAdapter: (adapter: NightlyConnectAdapter | undefined) => void;
  setWsProvider: (wsProvider: WsProvider) => void;
  setApi: (api: ApiPromise) => void;
}

export type AlephStore = ReturnType<typeof createAlephStore>;

export const createAlephStore = () => {
  const DEFAULT_ALEPH_STATE: AlephState = {
    connectors: {},
    connectedAdapter: undefined,
    address: null,

    wsProvider: undefined,
    api: undefined,

    setAddress: () => {},
    setConnectors: () => {},
    setConnectedAdapter: () => {},
    setWsProvider: () => {},
    setApi: () => {},
  };

  const connectors: { [key in string]: NightlyConnectAdapter } = {};

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
      setWsProvider: (wsProvider) => set(() => ({ wsProvider })),
      setApi: (api) => set(() => ({ api })),
    })),
  );
};
