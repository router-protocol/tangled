import { StargateClient } from '@cosmjs/stargate';
import { MainWalletBase } from '@cosmos-kit/core';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface CosmosState {
  address: string | null; // The connected wallet's address
  client: StargateClient | undefined;
  connectors: {
    [key: string]: MainWalletBase | undefined; // Stores wallet adapter by connector id
  };
  connectedAdapter: MainWalletBase | undefined; // The current connected wallet adapter

  // Actions
  setAddress: (address: string | null) => void;
  setClient: (client: StargateClient) => void;
  setConnectors: (connector: string, walletClient: MainWalletBase | undefined) => void;
  setConnectedAdapter: (adapter: MainWalletBase | undefined) => void;
  reset: () => void; // To reset the store state (for example, after disconnect)
}

export type CosmosStore = ReturnType<typeof createCosmosStore>;

export const createCosmosStore = () => {
  return createStore<CosmosState>()(
    devtools((set) => ({
      connectors: {},
      connectedAdapter: undefined,
      address: null,
      client: undefined,

      setClient: (client) => set(() => ({ client })),
      // Sets the wallet address
      setAddress: (address) => set(() => ({ address })),

      // Updates the wallet client for a specific connector
      setConnectors: (connector, walletClient) =>
        set((state) => ({
          connectors: { ...state.connectors, [connector]: walletClient },
        })),

      // Sets the current connected adapter
      setConnectedAdapter: (adapter) => set(() => ({ connectedAdapter: adapter })),

      // Resets the store to its default state
      reset: () =>
        set(() => ({
          connectors: {},
          connectedAdapter: undefined,
          address: null,
        })),
    })),
  );
};
