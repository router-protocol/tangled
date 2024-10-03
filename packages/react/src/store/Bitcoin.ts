import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BitcoinConnector } from '../types/bitcoin.js';
import { Wallet } from '../types/wallet.js';

interface BitcoinProps {
  adapters: Wallet<'bitcoin'>[];
}

export interface BitcoinState {
  connectors: {
    [key in string]: { account: string; chainId: string | undefined; adapter: Wallet<'bitcoin'> };
  };
  connectedAdapter: BitcoinConnector | Wallet<'bitcoin'> | undefined;
  address: string | null;

  setAddress: (address: string) => void;
  setConnectors: (connector: BitcoinState['connectors']) => void;
  setConnectedAdapter: (adapter: BitcoinConnector | undefined) => void;
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
          acc[adapter.name] = {
            adapter,
            account: '',
            chainId: undefined,
          };
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
