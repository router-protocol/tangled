import { NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ChainData } from '../types/index.js';

export interface AlephState {
  connectors: {
    [key in string]: NightlyConnectAdapter;
  };
  connectedAdapter: NightlyConnectAdapter | undefined;
  address: string | null;

  wsProvider: WsProvider;
  api: ApiPromise | undefined;

  setAddress: (address: string) => void;
  setConnectors: (connector: NightlyConnectAdapter) => void;
  setConnectedAdapter: (adapter: NightlyConnectAdapter | undefined) => void;
  setApi: (api: ApiPromise) => void;
}

export type AlephStore = ReturnType<typeof createAlephStore>;

type AlephProps = {
  chain: ChainData<'alephZero'>;
};

export const createAlephStore = (props: AlephProps) => {
  const DEFAULT_ALEPH_STATE: AlephState = {
    connectors: {},
    connectedAdapter: undefined,
    address: null,

    wsProvider: new WsProvider(props.chain.rpcUrls.default.webSocket?.[0]),
    api: undefined,

    setAddress: () => {},
    setConnectors: () => {},
    setConnectedAdapter: () => {},
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
      setApi: (api) => set(() => ({ api })),
    })),
  );
};
