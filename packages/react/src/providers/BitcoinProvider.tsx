import { createContext, useRef } from 'react';
// import { useStore } from 'zustand';
import { BitcoinStore, createBitcoinStore } from '../store/Bitcoin.js';
import { ChainId } from '../types/index.js';

export interface BitcoinContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
  store: BitcoinStore | null;
}

export const BitcoinContext = createContext<BitcoinContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,
});

/**
 * @notice This provider is used to connect to the Bitcoin network.
 * @param adapters - Supported adapters for the Bitcoin network.
 * @returns The Bitcoin provider context with the connect and disconnect functions.
 */
export const BitcoinProvider = ({ children, adapters }: { children: React.ReactNode; adapters: any[] }) => {
  const bitcoinStore = useRef(createBitcoinStore({ adapters })).current;
  //   const connectedAdapter = useStore(bitcoinStore, (state) => state.connectedAdapter);
  //   const address = useStore(bitcoinStore, (state) => state.address);
  //   const connectors = useStore(bitcoinStore, (state) => state.connectors);
  //   const setAddress = useStore(bitcoinStore, (state) => state.setAddress);
  //   const setConnectedAdapter = useStore(bitcoinStore, (state) => state.setConnectedAdapter);
  //   const setConnectors = useStore(bitcoinStore, (state) => state.setConnectors);

  return (
    <BitcoinContext.Provider
      value={{
        store: bitcoinStore,
        connect: async () => ({ account: '', chainId: undefined }),
        disconnect: async () => {},
      }}
    >
      {children}
    </BitcoinContext.Provider>
  );
};
