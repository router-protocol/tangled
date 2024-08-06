import { useConnectWallet as useSuiConnectWallet } from '@mysten/dapp-kit';
import { WalletName } from '@solana/wallet-adapter-base';
import { useWallet as useSolanaWallet } from '@tangled3/solana-react';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useConnect as useWagmiConnect } from 'wagmi';
import { ChainType } from '../types/index.js';
import { Wallet, WalletInstance } from '../types/wallet.js';
import { useAlephContext } from './useAlephContext.js';
import useIsMobile from './useIsMobile.js';
import { useTronContext } from './useTronContext.js';
import { useWallets } from './useWallets.js';

export const useConnect = () => {
  const isMobile = useIsMobile();
  const wallets = useWallets();
  const { connectAsync: connectEVM } = useWagmiConnect();
  const { connect: connectSolanaWallet } = useSolanaWallet();
  const { connect: connectTronWallet } = useTronContext();
  const { connect: connectAlephWallet } = useAlephContext();
  const { mutate: connectSuiWallet } = useSuiConnectWallet();

  const connectWallet = useCallback(
    async (params: { walletId: string; chainType: ChainType }) => {
      const walletInstance: Wallet | undefined = wallets[params.chainType].find(
        (wallet) => wallet.id === params.walletId,
      );

      if (!walletInstance) {
        throw new Error('Wallet not found');
      }

      if (!walletInstance.connector) {
        throw new Error('Wallet connector not found');
      }

      if (params.chainType === 'solana') {
        await connectSolanaWallet({ walletName: walletInstance.name as WalletName });
      } else if (params.chainType === 'tron') {
        await connectTronWallet(walletInstance.id);
      } else if (params.chainType === 'evm') {
        console.log('isMobile', isMobile);

        await connectEVM({ connector: walletInstance.connector as WalletInstance<'evm'> });
      } else if (params.chainType === 'aleph_zero') {
        await connectAlephWallet(walletInstance.name);
      } else if (params.chainType === 'sui') {
        connectSuiWallet({ wallet: walletInstance.connector });
      } else {
        await walletInstance.connector.connect();
      }

      return { walletInstance, name: walletInstance.name, id: params.walletId };
    },
    [connectAlephWallet, connectEVM, connectSolanaWallet, connectSuiWallet, connectTronWallet, isMobile, wallets],
  );

  const mutation = useMutation({
    mutationKey: ['connect-wallet'],
    mutationFn: connectWallet,
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      console.log('useConnected Connected to', data.id);
    },
  });

  return {
    connect: connectWallet,
    isLoading: mutation.isPending,
    error: mutation.error,
    wallets,
  };
};
