import { ModuleState } from '@near-wallet-selector/core';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface NearState {
  connectors: {
    [key in string]: ModuleState;
  };
  connectedAdapter: ModuleState;
  address: string | null;

  setAddress: (address: string) => void;
  setConnectors: (connector: ModuleState) => void;
  setConnectedAdapter: (adapter: ModuleState | undefined) => void;
}

export type NearStore = ReturnType<typeof createNearStore>;

export const createNearStore = () => {
  const DEFAULT_NEAR_STATE: NearState = {
    connectors: {},
    connectedAdapter: undefined,
    address: null,

    setAddress: () => {},
    setConnectors: () => {},
    setConnectedAdapter: () => {},
  };

  return createStore<NearState>()(
    devtools((set) => ({
      ...DEFAULT_NEAR_STATE,
      connectors: {},
      setConnectedAdapter: (connectedAdapter) => set(() => ({ connectedAdapter })),
      setAddress: (address) => set(() => ({ address })),
      setConnectors: (connectors) => set(() => ({ connectors })),
    })),
  );
};
