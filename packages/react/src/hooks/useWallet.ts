import { ChainType } from '../types/index.js';
import { Wallet } from '../types/wallet.js';
import { useWallets } from './useWallets.js';

/**
 * A hook that returns a wallet for a given chain type and wallet id.
 * @param chainType ChainType
 * @param walletId The id of the wallet to return
 * @returns wallet {@link Wallet}
 */
export const useWallet = <C extends ChainType = ChainType>(chainType: C, walletId: string): Wallet<C> | undefined => {
  const wallets = useWallets();

  return wallets[chainType].find((wallet) => wallet.id === walletId);
};
