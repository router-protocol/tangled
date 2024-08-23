import { useWalletsStore } from '../store/Wallet.js';

export const useCurrentWallet = () => {
  return useWalletsStore((state) => state.currentWallet);
};
