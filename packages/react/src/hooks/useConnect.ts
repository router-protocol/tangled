import { WalletName } from '@solana/wallet-adapter-base';
import { useWallet as useSolanaWallet } from '@tangled/solana-react';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ChainType } from '../types/index.js';
import { Wallet } from '../types/wallet.js';
import { useTronContext } from './useTronContext.js';
import { useWallets } from './useWallets.js';

export const useConnect = () => {
  const wallets = useWallets();
  const { connect: connectSolanaWallet } = useSolanaWallet();
  const { connect: connectTronWallet } = useTronContext();

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
      } else {
        await walletInstance.connector.connect();
      }

      return { walletInstance, name: walletInstance.name, id: params.walletId };
    },
    [connectSolanaWallet, connectTronWallet, wallets],
  );

  const mutation = useMutation({
    mutationKey: ['connect-wallet'],
    mutationFn: connectWallet,
    onError: (error) => {
      console.error(error);
    },
    // onSuccess: (p) => {
    //   // console.log('Connected', p.id);
    // },
  });

  return {
    connect: connectWallet,
    isLoading: mutation.isPending,
    error: mutation.error,
    wallets,
  };
};
