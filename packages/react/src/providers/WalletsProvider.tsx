import { useWallet as useSolanaWallet } from '@tangled/solana-react';
import { ReactNode, useEffect } from 'react';
import { useConnections } from 'wagmi';
import { useTronStore } from '../hooks/useTronStore.js';
import { useWalletsStore } from '../store/Wallet.js';
import { ConnectedAccount, ConnectedWallet } from '../types/wallet.js';

const WalletsProvider = ({ children }: { children: ReactNode }) => {
  const evmConnections = useConnections();
  const { connections: solanaWallets, wallet: solConnectedWallet } = useSolanaWallet();

  const tronStore = useTronStore((state) => state);

  const setChainConnectedAccounts = useWalletsStore((state) => state.setChainConnectedAccounts);
  const setConnectedWallets = useWalletsStore((state) => state.setConnectedWallets);

  // update wallet store states when connections change for individual providers
  // evm
  useEffect(() => {
    const _evmAccounts: { [x: string]: ConnectedAccount } = {};
    const _evmWallets: { [x: string]: ConnectedWallet } = {};

    for (const connection of evmConnections) {
      _evmAccounts[connection.connector.id] = {
        address: connection.accounts?.[0],
        chainId: connection.chainId.toString(),
        chainType: 'evm',
        wallet: connection.connector.id,
      };

      _evmWallets[connection.connector.id] = {
        address: connection.accounts?.[0],
        loading: false,
        chainId: connection.chainId.toString(),
        chainType: 'evm',
        connector: connection.connector,
      };
    }

    setChainConnectedAccounts({ evm: _evmAccounts });
    setConnectedWallets({
      evm: _evmWallets,
    });
  }, [setChainConnectedAccounts, setConnectedWallets, evmConnections]);

  // solana
  useEffect(() => {
    const _solanaAccounts: { [x: string]: ConnectedAccount } = {};
    const _solanaWallets: { [x: string]: ConnectedWallet } = {};

    // console.log(solConnectedWallet, solanaWallets);

    for (const wallet of solanaWallets) {
      // console.log('wallet', wallet.name, wallet.publicKey?.toString(), wallet.readyState);

      if (wallet.readyState === 'NotDetected' || wallet.readyState === 'Unsupported') continue;

      _solanaAccounts[wallet.name] = {
        address: wallet.publicKey?.toBase58() ?? '',
        chainId: undefined,
        chainType: 'solana',
        wallet: wallet.name,
      };

      _solanaWallets[wallet.name] = {
        address: wallet.publicKey?.toBase58() ?? '',
        chainId: undefined,
        chainType: 'solana',
      };
    }

    setChainConnectedAccounts({ solana: _solanaAccounts });
    setConnectedWallets({
      solana: _solanaWallets,
    });
  }, [setChainConnectedAccounts, setConnectedWallets, solanaWallets, solConnectedWallet]);

  // tron
  useEffect(() => {
    const connectors = tronStore.connectors;

    const _tronAccounts: { [x: string]: ConnectedAccount } = {};
    const _tronWallets: { [x: string]: ConnectedWallet<'tron'> } = {};

    for (const connector of Object.values(connectors)) {
      if (connector.readyState === 'NotFound' || connector.readyState === 'Loading' || !connector.adapter.address)
        continue;

      _tronAccounts[connector.adapter.name] = {
        address: connector.adapter.address,
        chainId: undefined,
        chainType: 'tron',
        wallet: connector.adapter.name,
      };

      _tronWallets[connector.adapter.name] = {
        address: connector.adapter.address,
        chainId: undefined,
        chainType: 'tron',
        connector: connector.adapter,
      };
    }

    setChainConnectedAccounts({ tron: _tronAccounts });
  }, [setChainConnectedAccounts, tronStore]);

  return <>{children}</>;
};

export default WalletsProvider;
