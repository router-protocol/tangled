import { useSuiClientContext, useCurrentWallet as useSuiCurrentWallet } from '@mysten/dapp-kit';
import { useWallet as useSolanaWallet } from '@tangled3/solana-react';
import { ReactNode, useEffect } from 'react';
import { useConnections as useEVMConnections } from 'wagmi';
import { BITCOIN_CHAIN_CONFIG } from '../connectors/bitcoin/connectors.js';
import { NEAR_NETWORK_CONFIG } from '../constants/index.js';
import { useBitcoinStore } from '../hooks/useBitcoinStore.js';
import { useConnectionOrConfig } from '../hooks/useConnectionOrConfig.js';
import { useCosmosStore } from '../hooks/useCosmosStore.js';
import { useNearContext } from '../hooks/useNearContext.js';
import { useNearStore } from '../hooks/useNearStore.js';
import { useTangledConfig } from '../hooks/useTangledConfig.js';
import { useTonStore } from '../hooks/useTonStore.js';
import { useTronStore } from '../hooks/useTronStore.js';
import { useWalletsStore } from '../store/Wallet.js';
import { ChainId } from '../types/index.js';
import { ConnectedAccount, ConnectedWallet } from '../types/wallet.js';

const WalletsProvider = ({ children }: { children: ReactNode }) => {
  const chains = useTangledConfig((config) => config.chains);
  const evmConnections = useEVMConnections();
  const { connections: solanaWallets, wallet: solConnectedWallet } = useSolanaWallet();
  const tronConnectors = useTronStore((state) => state.connectors);
  const tonConnectors = useTonStore((state) => state.connectors);
  const tonAddress = useTonStore((state) => state.address);

  // Cosmos store states
  const cosmosChainWallets = useCosmosStore((state) => state.chainWallets);

  const bitcoinConnectors = useBitcoinStore((state) => state.connectors);
  const bitcoinAddress = useBitcoinStore((state) => state.address);
  const config = useConnectionOrConfig();

  const nearConnectors = useNearStore((state) => state.connectors);
  const { nearSelector } = useNearContext();

  // Wallet store states
  const currentWallet = useWalletsStore((state) => state.currentWallet);
  const recentWallet = useWalletsStore((state) => state.recentWallet);
  const connectedAccountsByChain = useWalletsStore((state) => state.connectedAccountsByChain);
  const setChainConnectedAccounts = useWalletsStore((state) => state.setChainConnectedAccounts);
  const setConnectedWallets = useWalletsStore((state) => state.setConnectedWallets);
  const setCurrentAccount = useWalletsStore((state) => state.setCurrentAccount);
  const setCurrentWallet = useWalletsStore((state) => state.setCurrentWallet);
  const { network: currentSuiNetwork } = useSuiClientContext();

  const { currentWallet: currentSuiWallet, connectionStatus: suiWalletStatus } = useSuiCurrentWallet();

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
        chainId: adapter.wallet?.account.chain,
        chainType: 'ton',
        wallet: name,
      };

      _tonWallets[name] = {
        address: address,
        chainId: adapter.wallet?.account.chain,
        chainType: 'ton',
        connector: adapter,
      };
    }

    setChainConnectedAccounts({ ton: _tonAccounts });
    setConnectedWallets({
      ton: _tonWallets,
    });
  }, [setChainConnectedAccounts, setConnectedWallets, chains.ton, tonConnectors, tonAddress]);

  // cosmos
  useEffect(() => {
    const _cosmosAccounts: { [x: string]: ConnectedAccount } = {};
    const _cosmosWallets: { [x: string]: ConnectedWallet<'cosmos'> } = {};

    // Iterate over the Cosmos connectors
    for (const [name, chainWallet] of Object.entries(cosmosChainWallets)) {
      const address = chainWallet.address ?? '';

      if (!address) {
        console.log('No address found for wallet', name);
        continue;
      }

      _cosmosAccounts[name] = {
        address: address,
        chainId: chainWallet.chainId as ChainId,
        chainType: 'cosmos',
        wallet: name,
      };

      _cosmosWallets[name] = {
        address: address,
        chainId: chainWallet.chainId as ChainId,
        chainType: 'cosmos',
        connector: chainWallet.mainWallet,
      };
    }

    setChainConnectedAccounts({ cosmos: _cosmosAccounts });
    setConnectedWallets({
      cosmos: _cosmosWallets,
    });
  }, [setChainConnectedAccounts, setConnectedWallets, cosmosChainWallets]);

  //sui
  useEffect(() => {
    const _suiAccounts: { [x: string]: ConnectedAccount } = {};
    const _suiWallets: { [x: string]: ConnectedWallet<'sui'> } = {};

    if (suiWalletStatus === 'connected') {
      _suiAccounts[currentSuiWallet.name] = {
        address: currentSuiWallet.accounts[0].address,
        chainId: currentSuiNetwork as ChainId,
        chainType: 'sui',
        wallet: currentSuiWallet.name,
      };

      _suiWallets[currentSuiWallet.name] = {
        address: currentSuiWallet.accounts[0].address,
        chainId: currentSuiNetwork as ChainId,
        chainType: 'sui',
        connector: currentSuiWallet,
      };
    }

    setChainConnectedAccounts({ sui: _suiAccounts });
    setConnectedWallets({ sui: _suiWallets });
  }, [
    setChainConnectedAccounts,
    setConnectedWallets,
    chains.sui,
    suiWalletStatus,
    currentSuiWallet,
    currentSuiNetwork,
  ]);

  // bitcoin
  useEffect(() => {
    const _bitcoinAccounts: { [x: string]: ConnectedAccount } = {};
    const _bitcoinWallets: { [x: string]: ConnectedWallet<'bitcoin'> } = {};

    for (const connector of Object.values(bitcoinConnectors)) {
      const address = bitcoinAddress ?? '';

      if (address === '') {
        continue;
      }

      _bitcoinAccounts[connector.adapter.id] = {
        address: address,
        chainId: BITCOIN_CHAIN_CONFIG[config?.bitcoinProvider.chainId ?? ''] as ChainId,
        chainType: 'bitcoin',
        wallet: connector.adapter.id,
      };

      _bitcoinWallets[connector.adapter.id] = {
        address: address,
        chainId: BITCOIN_CHAIN_CONFIG[config?.bitcoinProvider.chainId ?? ''] as ChainId,
        chainType: 'bitcoin',
        connector: connector.adapter,
      };
    }

    setChainConnectedAccounts({ bitcoin: _bitcoinAccounts });
    setConnectedWallets({
      bitcoin: _bitcoinWallets,
    });
  }, [bitcoinAddress, bitcoinConnectors, setChainConnectedAccounts, setConnectedWallets, config]);

  // near
  useEffect(() => {
    const _nearAccounts: { [x: string]: ConnectedAccount } = {};
    const _nearWallets: { [x: string]: ConnectedWallet<'near'> } = {};

    for (const [name, adapter] of Object.entries(nearConnectors)) {
      const state = nearSelector.store.getState();
      const address = state.accounts[0]?.accountId ?? '';

      if (address === '') {
        continue;
      }

      _nearAccounts[name] = {
        address: address,
        chainId: NEAR_NETWORK_CONFIG[nearSelector.options.network.networkId] as ChainId,
        chainType: 'near',
        wallet: name,
      };

      _nearWallets[name] = {
        address: address,
        chainId: NEAR_NETWORK_CONFIG[nearSelector.options.network.networkId] as ChainId,
        chainType: 'near',
        connector: adapter,
      };
    }

    setChainConnectedAccounts({ near: _nearAccounts });
    setConnectedWallets({
      near: _nearWallets,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setChainConnectedAccounts, setConnectedWallets, chains.near, nearConnectors]);

  // ALL CHANGES ABOVE THIS BLOCK
  // when currentWallet changes, update currentAccount
  useEffect(() => {
    if (!currentWallet) {
      setCurrentAccount(undefined);
      return;
    }

    const [walletId, walletChainId] = currentWallet.id.split(':');

    const currentAccount = Object.values(connectedAccountsByChain[currentWallet.type]).find((account) => {
      if (account.chainType === 'cosmos') {
        const [_accountWalletId, _accountChainId] = account.wallet.split(':');
        return _accountWalletId === walletId && (walletChainId ? _accountChainId === walletChainId : true);
      }

      return account.wallet === walletId;
    });

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
