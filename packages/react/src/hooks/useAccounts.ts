import { useMemo } from 'react';
import { useWalletsStore } from '../store/Wallet.js';
import { ChainType } from '../types/index.js';
import { ConnectedAccount } from '../types/wallet.js';

/**
 * A hook that returns an array of connected accounts for a {@link ChainType}.
 * If no type is provided, it returns all connected accounts.
 * @param type The type of chain to return
 * @returns An array of `Account[]`
 */
export const useAccounts = (type?: ChainType): ConnectedAccount[] => {
  const connectedAccountsByChain = useWalletsStore((store) => store.connectedAccountsByChain);

  return useMemo(() => {
    if (type) {
      return connectedAccountsByChain[type] ? Object.values(connectedAccountsByChain[type]) : [];
    }

    return Object.values(connectedAccountsByChain).reduce(
      (acc, accountMap) => acc.concat(Object.values(accountMap)),
      [] as ConnectedAccount[],
    );
  }, [connectedAccountsByChain, type]);
};
