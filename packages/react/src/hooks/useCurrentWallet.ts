import { useWalletsStore } from '../store/Wallet.js';

const useCurrentWallet = () => {
  return useWalletsStore((state) => state.currentWallet);
};

export default useCurrentWallet;
