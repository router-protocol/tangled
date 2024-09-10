import { TonConnectUI } from '@tonconnect/ui-react';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface TonState {
  connectors: {
    [key in string]: TonConnectUI;
  };
  connectedAdapter: TonConnectUI | undefined;
  address: string | null;

  setAddress: (address: string) => void;
  setConnectors: (connector: TonConnectUI) => void;
  setConnectedAdapter: (adapter: TonConnectUI | undefined) => void;
}

export type TonStore = ReturnType<typeof createTonStore>;

export const createTonStore = () => {
  const DEFAULT_TON_STATE: TonState = {
    connectors: {},
    connectedAdapter: undefined,
    address: null,

    setAddress: () => {},
    setConnectors: () => {},
    setConnectedAdapter: () => {},
  };

  const connectors: Record<string, TonConnectUI> = {};

  return createStore<TonState>()(
    devtools((set) => ({
      ...DEFAULT_TON_STATE,
      connectors,
      setConnectedAdapter: (connectedAdapter) => set(() => ({ connectedAdapter })),
      setAddress: (address) => set(() => ({ address })),
      setConnectors: (connector) => {
        if (!connector.wallet) {
          console.error('no ton connector.wallet found');
        }

        const slug = connector.connector.wallet?.device.appName.toLowerCase(); // converting to lowercase to match the ton wallet id
        if (!slug) {
          console.error('no ton wallet slug found');
          return;
        }
        set(() => ({ connectors: { [slug as string]: connector } }));
      },
    })),
  );
};
