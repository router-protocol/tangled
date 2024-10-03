import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BITCOIN_CHAIN_CONFIG } from '../connectors/bitcoin/connectors.js';

interface BitcoinProps {
  adapters: any[]; // BITCOIN TODO: update 'any' type
}

export interface BitcoinState {
  connectors: {
    [key in string]: any; // BITCOIN TODO: update 'any' type
  };
  connectedAdapter: any; // BITCOIN TODO: update 'any' type
  address: string | null;

  setAddress: (address: string) => void;
  setConnectors: (connector: any) => void; // BITCOIN TODO: update 'any' type
  setConnectedAdapter: (adapter: any) => void; // BITCOIN TODO: update 'any' type
}

export type BitcoinStore = ReturnType<typeof createBitcoinStore>;

export const createBitcoinStore = (props: BitcoinProps) => {
  const DEFAULT_BITCOIN_STATE: BitcoinState = {
    connectors: {},
    connectedAdapter: undefined,
    address: null,

    setAddress: () => {},
    setConnectors: () => {},
    setConnectedAdapter: () => {},
  };

  return createStore<BitcoinState>()(
    devtools((set) => ({
      ...DEFAULT_BITCOIN_STATE,
      connectors: props?.adapters.reduce(
        (acc, adapter) => {
          acc[adapter.name] = { adapter, account: '', chainId: BITCOIN_CHAIN_CONFIG[adapter.chainId] };
          return acc;
        },
        {} as BitcoinState['connectors'],
      ),
      connectedAdapter: props.adapters[0],

      setAddress: (address) => set(() => ({ address })),
      setConnectedAdapter: (adapter) => set(() => ({ connectedAdapter: adapter })),
      setConnectors: (connectors) => set(() => ({ connectors })),
    })),
  );
};
