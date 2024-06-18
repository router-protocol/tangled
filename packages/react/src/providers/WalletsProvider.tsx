import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@tronweb3/tronwallet-abstract-adapter';
import { ReactNode, useEffect } from 'react';
import { useConnections } from 'wagmi';
import { useTronStore } from '../hooks/useTronStore.js';
import { useWalletsStore } from '../store/Wallet.js';
import { ChainTypeWallets, ConnectedAccounts } from '../types/wallet.js';
import { getTronNetwork } from '../utils/getTronNetwork.js';

const WalletsProvider = ({ children }: { children: ReactNode }) => {
  const wagmiConnections = useConnections();
  const { wallet: solanaWallet } = useSolanaWallet();
  // const { connection: solanaConnection } = useSolanaConnection();
  const tronStore = useTronStore((state) => state);

  const { setConnectedAccounts, setConnectedWallets } = useWalletsStore();

  // update wallet store states when connections change for individual providers
  // evm
  useEffect(() => {
    const evmAccounts: ConnectedAccounts = {};
    const evmWallets: ChainTypeWallets = {};

    for (const connection of wagmiConnections) {
      evmAccounts[connection.connector.id] = {
        address: connection.accounts?.[0],
        chainId: connection.chainId.toString(),
        chainType: 'evm',
        wallet: connection.connector.id,
      };

      evmWallets[connection.connector.id] = {
        address: connection.accounts?.[0],
        loading: false,
        chainId: connection.chainId.toString(),
      };
    }

    setConnectedAccounts(evmAccounts);
    setConnectedWallets({
      evm: evmWallets,
    });
  }, [setConnectedAccounts, setConnectedWallets, wagmiConnections]);

  // solana
  useEffect(() => {
    if (!solanaWallet?.adapter.publicKey || !solanaWallet?.adapter.publicKey || !solanaWallet.readyState) return;

    const pubKey = solanaWallet.adapter.publicKey;
    const solanaAccount: ConnectedAccounts = {
      [solanaWallet.adapter.name]: {
        address: pubKey.toString(),
        chainId: undefined,
        chainType: 'solana',
        wallet: solanaWallet.adapter.name,
      },
    };

    setConnectedAccounts(solanaAccount);
  }, [solanaWallet, setConnectedAccounts]);

  useEffect(() => {
    const connectors = tronStore.connectors;

    const tronAccounts: ConnectedAccounts = {};

    for (const connector of Object.values(connectors)) {
      if (connector.readyState !== WalletReadyState.Found || !connector.account || !connector.network) return;

      tronAccounts[connector.adapter.name] = {
        address: connector.account,
        chainId: getTronNetwork(connector.network),
        chainType: 'tron',
        wallet: connector.adapter.name,
      };
    }

    setConnectedAccounts(tronAccounts);
  }, [setConnectedAccounts, tronStore]);

  return <>{children}</>;
};

export default WalletsProvider;
