import { useWallet as useSolanaWallet } from '@tangled3/solana-react';
import { ReactNode, useEffect } from 'react';
import { useConnections } from 'wagmi';
import { useAlephStore } from '../hooks/useAlephStore.js';
import { useTangledConfig } from '../hooks/useTangledConfig.js';
import { useTronStore } from '../hooks/useTronStore.js';
import { useWalletsStore } from '../store/Wallet.js';
import { ChainId } from '../types/index.js';
import { ConnectedAccount, ConnectedWallet } from '../types/wallet.js';

const WalletsProvider = ({ children }: { children: ReactNode }) => {
  const { chains } = useTangledConfig();
  const evmConnections = useConnections();
  const { connections: solanaWallets, wallet: solConnectedWallet } = useSolanaWallet();
  const tronConnectors = useTronStore((state) => state.connectors);
  const alephConnectors = useAlephStore((state) => state.connectors);
  const alephAccounts = useAlephStore((state) => state.connectedAdapter);
  const alephAddress = useAlephStore((state) => state.address);

  // Wallet store states
  const currentWallet = useWalletsStore((state) => state.currentWallet);
  const recentWallet = useWalletsStore((state) => state.recentWallet);
  const connectedAccountsByChain = useWalletsStore((state) => state.connectedAccountsByChain);
  const setChainConnectedAccounts = useWalletsStore((state) => state.setChainConnectedAccounts);
  const setConnectedWallets = useWalletsStore((state) => state.setConnectedWallets);
  const setCurrentAccount = useWalletsStore((state) => state.setCurrentAccount);
  const setCurrentWallet = useWalletsStore((state) => state.setCurrentWallet);

  // update wallet store states when connections change for individual providers
  // evm
  useEffect(() => {
    const _evmAccounts: { [x: string]: ConnectedAccount } = {};
    const _evmWallets: { [x: string]: ConnectedWallet } = {};

    for (const connection of evmConnections) {
      _evmAccounts[connection.connector.id] = {
        address: connection.accounts?.[0],
        chainId: connection.chainId.toString() as ChainId,
        chainType: 'evm',
        wallet: connection.connector.id,
      };

      _evmWallets[connection.connector.id] = {
        address: connection.accounts?.[0],
        loading: false,
        chainId: connection.chainId.toString() as ChainId,
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

    for (const wallet of solanaWallets) {
      if (wallet.readyState === 'NotDetected' || wallet.readyState === 'Unsupported' || !wallet.publicKey) continue;

      _solanaAccounts[wallet.name] = {
        address: wallet.publicKey.toBase58(),
        chainId: chains.solana[0].id as ChainId,
        chainType: 'solana',
        wallet: wallet.name,
      };

      _solanaWallets[wallet.name] = {
        address: wallet.publicKey.toBase58(),
        chainId: chains.solana[0].id as ChainId,
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
        chainId: connector.network as ChainId,
        chainType: 'tron',
        wallet: connector.adapter.name,
      };

      _tronWallets[connector.adapter.name] = {
        address: connector.account,
        chainId: connector.network as ChainId,
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
  }, [setChainConnectedAccounts, setConnectedWallets, alephAccounts, chains.aleph_zero, alephConnectors]);
  // when currentWallet changes, update currentAccount
  useEffect(() => {
    if (!currentWallet) {
      setCurrentAccount(undefined);
      return;
    }
    const connectedAccountsByChain = useWalletsStore.getState().connectedAccountsByChain;

    const currentAccount = Object.values(connectedAccountsByChain[currentWallet.type]).find(
      (account) => account.wallet === currentWallet.id,
    );

    if (currentAccount) {
      setCurrentAccount(currentAccount);
    } else {
      setCurrentAccount(undefined);
      setCurrentWallet(undefined);
    }
  }, [currentWallet, setCurrentAccount, setCurrentWallet]);

  // when connectedAccounts change, try connecting to recent wallet
  useEffect(() => {
    if (!recentWallet) return;

    const recentAccount = Object.values(connectedAccountsByChain[recentWallet.type]).find(
      (account) => account.wallet === recentWallet.id,
    );

    if (recentAccount) {
      setCurrentWallet(recentWallet);
      setCurrentAccount(recentAccount);
    }
  }, [recentWallet, setCurrentAccount, setCurrentWallet, connectedAccountsByChain]);

  return <>{children}</>;
};

export default WalletsProvider;
