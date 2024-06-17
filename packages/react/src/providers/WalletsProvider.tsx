import { ReactNode, useEffect } from 'react';
import { useConnections } from 'wagmi';
import { useWalletsStore } from '../store/Wallet.js';
import { ChainTypeWallets, ConnectedAccounts } from '../types/wallet.js';

const WalletsProvider = ({ children }: { children: ReactNode }) => {
  const wagmiConnections = useConnections();
  // const { wallet: solanaWallet } = useSolanaWallet();
  // const { connection: solanaConnection } = useSolanaConnection();
  // const tronConnection = useTronStore((state) => state.tronAdapter);

  const { setConnectedAccounts, setConnectedWallets } = useWalletsStore();

  // update wallet store states when connections change for individual providers
  // evm
  useEffect(() => {
    console.log(wagmiConnections);

    const evmAccounts: ConnectedAccounts = wagmiConnections.reduce((acc, connection) => {
      acc[connection.connector.id] = {
        address: connection.accounts?.[0],
        chainId: connection.chainId.toString(),
        chainType: 'evm',
        wallet: connection.connector.id,
      };
      return acc;
    }, {} as ConnectedAccounts);
    const evmWallets: ChainTypeWallets = wagmiConnections.reduce((acc, connection) => {
      acc[connection.connector.id] = {
        address: connection.accounts?.[0],
        loading: false,
        chainId: connection.chainId.toString(),
      };
      return acc;
    }, {} as ChainTypeWallets);

    setConnectedAccounts(evmAccounts);
    setConnectedWallets({
      evm: evmWallets,
    });
  }, [setConnectedAccounts, setConnectedWallets, wagmiConnections]);

  // solana
  // useEffect(() => {
  //   if (!solanaWallet?.adapter.publicKey || !solanaWallet?.adapter.publicKey || !solanaWallet.readyState) return;

  //   const pubKey = solanaWallet.adapter.publicKey;
  //   const solanaAccount: ConnectedAccounts = {
  //     [solanaWallet.adapter.name]: {
  //       address: pubKey.toString(),
  //       chainId: '',
  //       chainType: 'solana',
  //       wallet: solanaWallet.adapter.name,
  //     },
  //   };

  //   setConnectedAccounts(solanaAccount);
  // }, [solanaWallet, setConnectedAccounts]);

  return <>{children}</>;
};

export default WalletsProvider;
