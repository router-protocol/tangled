import { Adapter } from '@tronweb3/tronwallet-abstract-adapter';
import { createStore } from 'zustand';
import { TronAdapter } from '../types/wallet.js';

interface TronProps {
  adapters: Adapter[];
}

export interface TronState {
  connectors: {
    [key in string]: TronAdapter;
  };

  setConnector: (connector: TronAdapter) => void;
  setConnectors: (connectors: TronState['connectors']) => void;
}

export type TronStore = ReturnType<typeof createTronStore>;

export const createTronStore = (props?: TronProps) => {
  const DEFAULT_TRON_STATE: TronState = {
    connectors: {},
    setConnector: () => {},
    setConnectors: () => {},
  };

  return createStore<TronState>((set) => ({
    ...DEFAULT_TRON_STATE,
    ...props,

    setConnector: (connector) =>
      set((state) => ({ connectors: { ...state.connectors, [connector.adapter.name]: connector } })),
    setConnectors: (connectors) => set(() => ({ connectors })),
  }));
};
