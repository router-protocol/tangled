// import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useWalletsStore } from '../store/Wallet.js';
import { WalletsByChain } from '../types/wallet.js';

/**
 * A hook that returns the connectors for a given chain type.
 * If no type is provided, it returns all connectors.
 * @returns An array of supported connectors
 */
export const useConnectedWallets = (): WalletsByChain => {
  const connectedWalletsByChain = useWalletsStore((store) => store.connectedWalletsByChain);

  return connectedWalletsByChain;
};
