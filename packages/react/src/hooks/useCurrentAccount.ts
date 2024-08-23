import { useWalletsStore } from '../store/Wallet.js';

export const useCurrentAccount = () => {
  return useWalletsStore((state) => state.currentAccount);
};
