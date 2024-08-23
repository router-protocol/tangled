import { useMemo } from 'react';
import { ChainType } from '../types/index.js';
import { Wallet } from '../types/wallet.js';
import { useWallets } from './useWallets.js';

/**
 * A hook that returns a wallet for a given chain type and wallet id.
 * @param chainType ChainType
 * @param walletId The id of the wallet to return
 * @returns wallet {@link Wallet}
 */
export const useWallet = <C extends ChainType = ChainType>(
  chainType: C | undefined,
  walletId: string | undefined,
): Wallet<C> | undefined => {
  const wallets = useWallets();

  const wallet = useMemo(() => {
    if (!chainType || !walletId || !wallets[chainType]) {
      return undefined;
    }
    return wallets[chainType].find((wallet) => wallet.id === walletId);
  }, [wallets, chainType, walletId]);

  return wallet;
};
