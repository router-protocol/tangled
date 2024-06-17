import { useMemo } from 'react';
import { useWalletsStore } from '../store/Wallet.js';
import { ChainType } from '../types/index.js';
import { Account } from '../types/wallet.js';

/**
 * A hook that returns an array of connected accounts for a {@link ChainType}.
 * If no type is provided, it returns all connected accounts.
 * @param type The type of chain to return
 * @returns An array of `Account[]`
 */
export const useAccounts = (type?: ChainType): Account[] => {
  const connectedAccounts = useWalletsStore((store) => store.connectedAccounts);

  return useMemo(() => {
    if (type) {
      return Object.values(connectedAccounts).filter((account) => account?.chainType === type) as Account[];
    }

    return Object.values(connectedAccounts).filter((a) => a !== undefined) as Account[];
  }, [connectedAccounts, type]);
};
