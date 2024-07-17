import { useMemo } from 'react';
import { useWalletsStore } from '../store/Wallet.js';
import { ChainType } from '../types/index.js';
import { ConnectedWallet } from '../types/wallet.js';

/**
 * A hook that returns an array of connected wallets for a {@link ChainType}.
 * If no type is provided, it returns all connected accounts.
 * @param type The type of chain to return
 * @returns An array of `Wallet[]`
 */
export const useConnections = (type?: ChainType): ConnectedWallet[] => {
  const connectedWalletsByChain = useWalletsStore((store) => store.connectedWalletsByChain);

  console.log('connectedWalletsByChain  - ', connectedWalletsByChain);

  return useMemo(() => {
    if (type) {
      return Object.values(connectedWalletsByChain[type]) ?? [];
    }

    return Object.values(connectedWalletsByChain).reduce(
      (acc, wallets) => acc.concat(Object.values(wallets)),
      [] as ConnectedWallet[],
    );
  }, [connectedWalletsByChain, type]);
};
