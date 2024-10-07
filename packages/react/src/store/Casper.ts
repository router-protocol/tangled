import { CasperWallet } from 'casper-js-sdk';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Wallet } from '../types/wallet.js';

interface CasperProps {
  adapters: Wallet<'casper'>[]; // CASPER TODO: reconsider the types
}

export interface CasperState {
  connectors: {
    [key in string]: { account: string; chainId: string | undefined; adapter: Wallet<'casper'> }; // CASPER TODO: reconsider the types
  };
  connectedAdapter: CasperWallet | undefined;
  address: string | null;

  setAddress: (address: string) => void;
  setConnectors: (connectors: CasperState['connectors']) => void;
  setConnectedAdapter: (adapter: CasperWallet) => void;
}

export type CasperStore = ReturnType<typeof createCasperStore>;

export const createCasperStore = (props: CasperProps) => {
  const DEFAULT_CASPER_STATE: CasperState = {
    connectors: {},
    connectedAdapter: undefined,
    address: null,

    setAddress: () => {},
    setConnectors: () => {},
    setConnectedAdapter: () => {},
  };

  return createStore<CasperState>()(
    devtools((set) => ({
      ...DEFAULT_CASPER_STATE,
      connectors: props?.adapters.reduce(
        (acc, adapter) => {
          acc[adapter.name] = { adapter, account: '', chainId: undefined };
          return acc;
        },
        {} as CasperState['connectors'],
      ),

      setAddress: (address) => set(() => ({ address })),
      setConnectedAdapter: (adapter) => set(() => ({ connectedAdapter: adapter })),
      setConnectors: (connectors) => set(() => ({ connectors })),
    })),
  );
};
