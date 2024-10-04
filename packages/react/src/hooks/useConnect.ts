import { useConnectWallet as useSuiConnectWallet } from '@mysten/dapp-kit';
import { WalletName } from '@solana/wallet-adapter-base';
import { useWallet as useSolanaWallet } from '@tangled3/solana-react';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useConnect as useWagmiConnect } from 'wagmi';
import { createTonWalletInstance } from '../connectors/ton/connector.js';
import { useWalletsStore } from '../store/Wallet.js';
import { ChainType } from '../types/index.js';
import { DefaultConnector, Wallet, WalletInstance } from '../types/wallet.js';
import { useAlephContext } from './useAlephContext.js';
import { useNearContext } from './useNearContext.js';
import { useTonContext } from './useTonContext.js';
import { useTronContext } from './useTronContext.js';
import { useWallets } from './useWallets.js';

export const useConnect = () => {
  const wallets = useWallets({
    onlyInstalled: true,
  });
  const { connectAsync: connectEVM } = useWagmiConnect();
  const { connect: connectSolanaWallet } = useSolanaWallet();
  const { connect: connectTronWallet } = useTronContext();
  const { connect: connectAlephWallet } = useAlephContext();
  const { mutate: connectSuiWallet } = useSuiConnectWallet();
  const { connect: connectTonWallet } = useTonContext();
  const { connect: connectNearWallet } = useNearContext();

  const connectedWallets = useWalletsStore((state) => state.connectedWalletsByChain);
  const setCurrentWallet = useWalletsStore((state) => state.setCurrentWallet);
  const setRecentWallet = useWalletsStore((state) => state.setRecentWallet);

  const connectWallet = useCallback(
    async (params: { walletId: string; chainType: ChainType; nearContractId?: string }) => {
      const walletInstance: Wallet | undefined = wallets[params.chainType].find(
        (wallet) => wallet.id === params.walletId,
      );

      if (!walletInstance) {
        throw new Error('Wallet not found');
      }

      if (!walletInstance.connector) {
        throw new Error('Wallet connector not found');
      }

      if (connectedWallets[params.chainType][walletInstance.id]) {
        return { walletInstance, name: walletInstance.name, id: params.walletId };
      }

      if (params.chainType === 'solana') {
        await connectSolanaWallet({ walletName: walletInstance.name as WalletName });
      } else if (params.chainType === 'tron') {
        await connectTronWallet(walletInstance.id);
      } else if (params.chainType === 'evm') {
        await connectEVM({ connector: walletInstance.connector as WalletInstance<'evm'> });
      } else if (params.chainType === 'alephZero') {
        await connectAlephWallet(walletInstance.name);
      } else if (params.chainType === 'sui') {
        connectSuiWallet({ wallet: walletInstance.connector as WalletInstance<'sui'> });
      } else if (params.chainType === 'ton') {
        const connectedTonWallet = await connectTonWallet(walletInstance.id);
        if (walletInstance.id === 'ton-connect') {
          const tonWalletInstance = createTonWalletInstance(connectedTonWallet, walletInstance);
          return { walletInstance: tonWalletInstance, name: tonWalletInstance.name, id: tonWalletInstance.id };
        }
      } else if (params.chainType === 'near') {
        await connectNearWallet({ adapterId: walletInstance.id, contractId: params.nearContractId });
      } else {
        const connector = walletInstance.connector as DefaultConnector;
        await connector.connect();
      }

      return { walletInstance, name: walletInstance.name, id: params.walletId };
    },
    [
      connectAlephWallet,
      connectEVM,
      connectSolanaWallet,
      connectSuiWallet,
      connectTronWallet,
      connectedWallets,
      wallets,
      connectTonWallet,
      connectNearWallet,
    ],
  );

  const mutation = useMutation({
    mutationKey: ['connect-wallet'],
    mutationFn: connectWallet,
    onError: (error) => {
      console.error(error);
    },
    onSuccess: ({ walletInstance }) => {
      setCurrentWallet({
        id: walletInstance.id,
        type: walletInstance.type,
      });
      setRecentWallet({
        id: walletInstance.id,
        type: walletInstance.type,
      });
    },
  });

  return {
    connect: mutation.mutate,
    connectAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
