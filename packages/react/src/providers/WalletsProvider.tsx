import { useWallet as useSolanaWallet } from '@tangled3/solana-react';
import { ReactNode, useEffect } from 'react';
import { useConnections as useEVMConnections } from 'wagmi';
import { useAlephStore } from '../hooks/useAlephStore.js';
import { useTangledConfig } from '../hooks/useTangledConfig.js';
import { useTonStore } from '../hooks/useTonStore.js';
import { useTronStore } from '../hooks/useTronStore.js';
import { useWalletsStore } from '../store/Wallet.js';
import { ChainId } from '../types/index.js';
import { ConnectedAccount, ConnectedWallet } from '../types/wallet.js';

const WalletsProvider = ({ children }: { children: ReactNode }) => {
  const { chains } = useTangledConfig();
  const evmConnections = useEVMConnections();
  const { connections: solanaWallets, wallet: solConnectedWallet } = useSolanaWallet();
  const tronConnectors = useTronStore((state) => state.connectors);
  const alephConnectors = useAlephStore((state) => state.connectors);
  const alephAccounts = useAlephStore((state) => state.connectedAdapter);
  const alephAddress = useAlephStore((state) => state.address);
  const tonConnectors = useTonStore((state) => state.connectors);
  const tonAddress = useTonStore((state) => state.address);

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
  }, [setChainConnectedAccounts, setConnectedWallets, tronConnectors]);

  useEffect(() => {
    const _alephAccounts: { [x: string]: ConnectedAccount } = {};
    const _alephWallets: { [x: string]: ConnectedWallet<'alephZero'> } = {};

    for (const [name, adapter] of Object.entries(alephConnectors)) {
      const address = alephAddress ?? '';

      if (address === '') {
        continue;
      }

      _alephAccounts[name] = {
        address: address,
        chainId: undefined,
        chainType: 'alephZero',
        wallet: name,
      };

      _alephWallets[name] = {
        address: address,
        chainId: undefined,
        chainType: 'alephZero',
        connector: adapter,
      };
    }

    setChainConnectedAccounts({ alephZero: _alephAccounts });
    setConnectedWallets({
      alephZero: _alephWallets,
    });
  }, [setChainConnectedAccounts, setConnectedWallets, alephAccounts, chains.alephZero, alephConnectors, alephAddress]);

  // ton
  useEffect(() => {
    const _tonAccounts: { [x: string]: ConnectedAccount } = {};
    const _tonWallets: { [x: string]: ConnectedWallet<'ton'> } = {};

    for (const [name, adapter] of Object.entries(tonConnectors)) {
      const address = tonAddress ?? '';

      if (address === '') {
        continue;
      }

      _tonAccounts[name] = {
        address: address,
        chainId: undefined,
        chainType: 'ton',
        wallet: name,
      };

      _tonWallets[name] = {
        address: address,
        chainId: undefined,
        chainType: 'ton',
        connector: adapter,
      };
    }

    setChainConnectedAccounts({ ton: _tonAccounts });
    setConnectedWallets({
      ton: _tonWallets,
    });
  }, [setChainConnectedAccounts, setConnectedWallets, alephAccounts, chains.ton, tonConnectors, tonAddress]);

  // when currentWallet changes, update currentAccount
  useEffect(() => {
    if (!currentWallet) {
      setCurrentAccount(undefined);
      return;
    }

    const currentAccount = Object.values(connectedAccountsByChain[currentWallet.type]).find(
      (account) => account.wallet === currentWallet.id,
    );

    if (currentAccount) {
      setCurrentAccount(currentAccount);
    } else {
      setCurrentAccount(undefined);
      setCurrentWallet(undefined);
    }
  }, [currentWallet, setCurrentAccount, setCurrentWallet, connectedAccountsByChain]);

  // when connectedAccounts change, try connecting to recent wallet
  useEffect(() => {
    if (!recentWallet) return;

    const connectedAccounts = connectedAccountsByChain[recentWallet.type];
    if (!connectedAccounts) return;

    const recentAccount = Object.values(connectedAccounts).find((account) => account.wallet === recentWallet.id);

    if (recentAccount) {
      setCurrentWallet(recentWallet);
      setCurrentAccount(recentAccount);
    }
  }, [recentWallet, setCurrentAccount, setCurrentWallet, connectedAccountsByChain]);

  return <>{children}</>;
};

export default WalletsProvider;
