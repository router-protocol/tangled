import { Adapter } from '@tronweb3/tronwallet-abstract-adapter';
import { createStore } from 'zustand';
import { TronAdapterData } from '../types/wallet.js';

interface TronProps {
  adapters: Adapter[];
}

export interface TronState {
  connectors: {
    [key in string]: TronAdapterData;
  };
  connectedAdapter: Adapter | undefined;
  address: string | null;

  setAddress: (address: string) => void;
  setConnector: (connector: TronAdapterData) => void;
  setConnectors: (connectors: TronState['connectors']) => void;
  setConnectedAdapter: (adapter: Adapter | undefined) => void;
}

export type TronStore = ReturnType<typeof createTronStore>;

export const createTronStore = (props: TronProps) => {
  const DEFAULT_TRON_STATE: TronState = {
    connectors: {},
    connectedAdapter: undefined,
    address: null,

    setAddress: () => {},
    setConnector: () => {},
    setConnectors: () => {},
    setConnectedAdapter: () => {},
  };

  return createStore<TronState>((set) => ({
    ...DEFAULT_TRON_STATE,
    connectors: props?.adapters.reduce(
      (acc, adapter) => {
        acc[adapter.name] = { adapter, account: adapter.address, network: undefined, readyState: adapter.state };
        return acc;
      },
      {} as TronState['connectors'],
    ),
    connectedAdapter: props.adapters.find((adapter) => adapter.connected),

    setAddress: (address) => set(() => ({ address })),
    setConnectedAdapter: (adapter) => set(() => ({ connectedAdapter: adapter })),
    setConnector: (connector) =>
      set((state) => ({ connectors: { ...state.connectors, [connector.adapter.name]: connector } })),
    setConnectors: (connectors) => set(() => ({ connectors })),
  }));
};
