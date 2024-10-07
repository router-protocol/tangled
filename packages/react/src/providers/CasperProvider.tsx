import { createContext, useRef } from 'react';
import { CasperStore, createCasperStore } from '../store/Casper.js';
import { ChainId } from '../types/index.js';
import { Wallet } from '../types/wallet.js';

export interface CasperContextValues {
  connect: (adapterId: string) => Promise<{ account: string | null; chainId: ChainId | undefined }>;
  disconnect: () => Promise<void>;
  store: CasperStore | null;
}

export const CasperContext = createContext<CasperContextValues>({
  connect: async () => ({ account: '', chainId: undefined }),
  disconnect: async () => {},
  store: null,
});

/**
 * @notice This provider is used to connect to the Tron network.
 * @param adapters - Supported adapters for the Tron network.
 * @returns The Tron provider context with the connect and disconnect functions.
 */
export const CasperProvider = ({ children, adapters }: { children: React.ReactNode; adapters: Wallet<'casper'>[] }) => {
  const casperStore = useRef(createCasperStore({ adapters })).current;
  return (
    <CasperContext.Provider
      value={{
        store: casperStore,
        connect: async () => ({ account: '', chainId: undefined }),
        disconnect: async () => {},
      }}
    >
      {children}
    </CasperContext.Provider>
  );
};
