import { Adapter, WalletReadyState } from '@tronweb3/tronwallet-abstract-adapter';
import { createStore } from 'zustand';
import { TronAdapterData } from '../types/wallet.js';

interface TronProps {
  adapters: Adapter[];
}

export interface TronState {
  connectors: {
    [key in string]: TronAdapterData;
  };

  setConnector: (connector: TronAdapterData) => void;
  setConnectors: (connectors: TronState['connectors']) => void;
}

export type TronStore = ReturnType<typeof createTronStore>;

export const createTronStore = (props: TronProps) => {
  const DEFAULT_TRON_STATE: TronState = {
    connectors: {},
    setConnector: () => {},
    setConnectors: () => {},
  };

  return createStore<TronState>((set) => ({
    ...DEFAULT_TRON_STATE,
    connectors: props?.adapters.reduce(
      (acc, adapter) => {
        acc[adapter.name] = { adapter, account: '', network: undefined, readyState: WalletReadyState.NotFound };
        return acc;
      },
      {} as TronState['connectors'],
    ),

    setConnector: (connector) =>
      set((state) => ({ connectors: { ...state.connectors, [connector.adapter.name]: connector } })),
    setConnectors: (connectors) => set(() => ({ connectors })),
  }));
};
