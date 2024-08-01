import { useWallet as useSolanaWallet } from '@tangled/solana-react';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDisconnect as useEVMDisconnect } from 'wagmi';
import { ChainType } from '../types/index.js';
import { Wallet, WalletInstance } from '../types/wallet.js';
import { useAlephContext } from './useAlephContext.js';
import { useSuiContext } from './useSuiContext.js';
import { useTronContext } from './useTronContext.js';
import { useWallets } from './useWallets.js';

export const useDisConnect = () => {
  const wallets = useWallets();
  const { disconnectAsync: disconnectEVM } = useEVMDisconnect();
  const { disconnect: disconnectSolanaWallet } = useSolanaWallet();
  const { disconnect: disconnectTronWallet } = useTronContext();
  const { disconnect: disconnectAlephWallet } = useAlephContext();
  const { disconnect: disconnectSuiWallet } = useSuiContext();

  const disconnectWallet = useCallback(
    async (params: { walletId: string; chainType: ChainType }) => {
      const walletInstance: Wallet | undefined = wallets[params.chainType].find((wallet) => {
        console.log(wallet, params);
        return wallet.id.toLowerCase() === params.walletId.toLowerCase();
      });

      if (!walletInstance) {
        throw new Error('Wallet not found');
      }

      if (!walletInstance.connector) {
        throw new Error('Wallet connector not found');
      }

      if (params.chainType === 'solana') {
        await disconnectSolanaWallet();
      } else if (params.chainType === 'tron') {
        await disconnectTronWallet();
      } else if (params.chainType === 'evm') {
        await disconnectEVM({ connector: walletInstance.connector as WalletInstance<'evm'> });
      } else if (params.chainType === 'aleph_zero') {
        await disconnectAlephWallet();
      } else if (params.chainType === 'sui') {
        console.log('sui disconnect');
        await disconnectSuiWallet();
      } else {
        await walletInstance.connector.connect();
      }

      return { walletInstance, name: walletInstance.name, id: params.walletId };
    },
    [disconnectAlephWallet, disconnectEVM, disconnectSolanaWallet, disconnectSuiWallet, disconnectTronWallet, wallets],
  );

  const mutation = useMutation({
    mutationKey: ['disconnect-wallet'],
    mutationFn: disconnectWallet,
    onError: (error) => {
      console.error(error);
    },
    // onSuccess: (p) => {
    //   // console.log('Connected', p.id);
    // },
  });

  return {
    disconnect: disconnectWallet,
    isLoading: mutation.isPending,
    error: mutation.error,
    wallets,
  };
};
