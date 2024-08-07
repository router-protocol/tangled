import { useWalletsStore } from '../store/Wallet.js';

const useCurrentAccount = () => {
  return useWalletsStore((state) => state.currentAccount);
};

export default useCurrentAccount;
