import { useWallet as useSolanaWallet } from '@tangled3/solana-react';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDisconnect as useEVMDisconnect } from 'wagmi';
import { ChainType } from '../types/index.js';
import { Wallet, WalletInstance } from '../types/wallet.js';
import { useAlephContext } from './useAlephContext.js';
import { useTonContext } from './useTonContext.js';
import { useTronContext } from './useTronContext.js';
import { useWallets } from './useWallets.js';

export interface DisconnectParams {
  walletId: string;
  chainType: ChainType;
}
export const useDisconnect = () => {
  const wallets = useWallets();
  const { disconnectAsync: disconnectEVM } = useEVMDisconnect();
  const { disconnect: disconnectSolanaWallet } = useSolanaWallet();
  const { disconnect: disconnectTronWallet } = useTronContext();
  const { disconnect: disconnectAlephWallet } = useAlephContext();
  const { disconnect: disconnectTonWallet } = useTonContext();

  const disconnectWallet = useCallback(
    async (params: DisconnectParams) => {
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
        await disconnectSolanaWallet();
      } else if (params.chainType === 'tron') {
        await disconnectTronWallet();
      } else if (params.chainType === 'evm') {
        await disconnectEVM({ connector: walletInstance.connector as WalletInstance<'evm'> });
      } else if (params.chainType === 'alephZero') {
        await disconnectAlephWallet();
      } else if (params.chainType === 'ton') {
        disconnectTonWallet();
      } else {
        await walletInstance.connector.disconnect();
      }
    },
    [disconnectAlephWallet, disconnectEVM, disconnectSolanaWallet, disconnectTronWallet, disconnectTonWallet, wallets],
  );

  const mutation = useMutation({
    mutationKey: ['disconnect-wallet'],
    mutationFn: disconnectWallet,
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    disconnect: disconnectWallet,
    isLoading: mutation.isPending,
    error: mutation.error,
    wallets,
  };
};
