import { NightlyConnectSuiAdapter } from '@nightlylabs/wallet-selector-sui';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface SuiState {
  connectors: {
    [key in string]: NightlyConnectSuiAdapter;
  };
  connectedAdapter: NightlyConnectSuiAdapter | undefined;
  address: string | null;

  setAddress: (address: string) => void;
  setConnectors: (connector: NightlyConnectSuiAdapter) => void;
  setConnectedAdapter: (adapter: NightlyConnectSuiAdapter | undefined) => void;
}

export type SuiStore = ReturnType<typeof createSuiStore>;

export const createSuiStore = () => {
  const DEFAULT_SUI_STATE: SuiState = {
    connectors: {},
    connectedAdapter: undefined,
    address: null,

    setAddress: () => {},
    setConnectors: () => {},
    setConnectedAdapter: () => {},
  };

  const connectors: { [key in string]: NightlyConnectSuiAdapter } = {};

  return createStore<SuiState>()(
    devtools((set) => ({
      ...DEFAULT_SUI_STATE,
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
