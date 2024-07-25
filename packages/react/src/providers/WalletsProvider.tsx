import { useWallet as useSolanaWallet } from '@tangled/solana-react';
import { ReactNode, useEffect } from 'react';
import { useConnections } from 'wagmi';
import { useAlephStore } from '../hooks/useAlephStore.js';
import { useTangledConfig } from '../hooks/useTangledConfig.js';
import { useTronStore } from '../hooks/useTronStore.js';
import { useWalletsStore } from '../store/Wallet.js';
import { ConnectedAccount, ConnectedWallet } from '../types/wallet.js';

const WalletsProvider = ({ children }: { children: ReactNode }) => {
  const { chains } = useTangledConfig();
  const evmConnections = useConnections();
  const { connections: solanaWallets, wallet: solConnectedWallet } = useSolanaWallet();
  const tronConnectors = useTronStore((state) => state.connectors);
  const alephConnectors = useAlephStore((state) => state.connectors);
  const alephAccounts = useAlephStore((state) => state.connectedAdapter);

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
      if (wallet.readyState === 'NotDetected' || wallet.readyState === 'Unsupported' || !wallet.publicKey) continue;

      _solanaAccounts[wallet.name] = {
        address: wallet.publicKey.toBase58(),
        chainId: chains.solana[0].id,
        chainType: 'solana',
        wallet: wallet.name,
      };

      _solanaWallets[wallet.name] = {
        address: wallet.publicKey.toBase58(),
        chainId: chains.solana[0].id,
        chainType: 'solana',
      };
    }

    setChainConnectedAccounts({ solana: _solanaAccounts });
    setConnectedWallets({
      solana: _solanaWallets,
    });
  }, [setChainConnectedAccounts, setConnectedWallets, solanaWallets, solConnectedWallet, chains.solana]);

  // tron
  useEffect(() => {
    const _tronAccounts: { [x: string]: ConnectedAccount } = {};
    const _tronWallets: { [x: string]: ConnectedWallet<'tron'> } = {};

    for (const connector of Object.values(tronConnectors)) {
      if (connector.readyState === 'NotFound' || connector.readyState === 'Loading' || !connector.account) {
        continue;
      }

      _tronAccounts[connector.adapter.name] = {
        address: connector.account,
        chainId: chains.tron[0].id,
        chainType: 'tron',
        wallet: connector.adapter.name,
      };

      _tronWallets[connector.adapter.name] = {
        address: connector.account,
        chainId: chains.tron[0].id,
        chainType: 'tron',
        connector: connector.adapter,
      };
    }

    setChainConnectedAccounts({ tron: _tronAccounts });
    setConnectedWallets({
      tron: _tronWallets,
    });
  }, [chains.tron, setChainConnectedAccounts, setConnectedWallets, tronConnectors]);

  useEffect(() => {
    (async () => {
      const _alephAccounts: { [x: string]: ConnectedAccount } = {};
      const _alephWallets: { [x: string]: ConnectedWallet<'aleph_zero'> } = {};

      if (!alephConnectors) return;

      for (const [name, adapter] of Object.entries(alephConnectors)) {
        const accounts = await adapter.accounts.get();
        const address = accounts[0]?.address ?? '';

        if (address === '') {
          continue;
        }

        _alephAccounts[name] = {
          address: address,
          chainId: chains.aleph_zero[0].id,
          chainType: 'aleph_zero',
          wallet: name,
        };

        _alephWallets[name] = {
          address: address,
          chainId: chains.aleph_zero[0].id,
          chainType: 'aleph_zero',
          connector: adapter,
        };
      }

      setChainConnectedAccounts({ aleph_zero: _alephAccounts });
      setConnectedWallets({
        aleph_zero: _alephWallets,
      });
    })();
    console.log('alephConnectors ', alephConnectors);
  }, [setChainConnectedAccounts, setConnectedWallets, alephAccounts, chains.aleph_zero, alephConnectors]);

  return <>{children}</>;
};

export default WalletsProvider;
