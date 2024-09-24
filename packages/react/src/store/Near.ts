import { ModuleState, Wallet } from '@near-wallet-selector/core';
// @ts-expect-error - SignMessageMethod has no exports
import { SignMessageMethod } from '@near-wallet-selector/core/src/lib/wallet/index.js';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface NearState {
  connectors: {
    [key in string]: ModuleState<Wallet>;
  };
  connectedAdapter: Wallet & SignMessageMethod;
  address: string | null;

  setAddress: (address: string) => void;
  setConnectors: (connector: ModuleState<Wallet>) => void;
  setConnectedAdapter: (adapter: (Wallet & SignMessageMethod) | undefined) => void;
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
      setConnectors: (connector) => {
        if (!connector) return;

        set(() => ({ connectors: { [connector.id]: connector } }));
      },
    })),
  );
};
