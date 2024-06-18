import { useWalletsStore } from '../store/Wallet.js';

const useWallets = () => {
  const connectedAccounts = useWalletsStore((store) => store.connectedWallets);
  return connectedAccounts;
};

export default useWallets;
