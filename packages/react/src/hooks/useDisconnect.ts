import { useDisconnectWallet as useSuiDisconnectWallet } from '@mysten/dapp-kit';
import { useWallet as useSolanaWallet } from '@tangled3/solana-react';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDisconnect as useEVMDisconnect } from 'wagmi';
import { ChainType } from '../types/index.js';
import { DefaultConnector, Wallet, WalletInstance } from '../types/wallet.js';
import { useBitcoinContext } from './useBitcoinContext.js';
import { useCosmosContext } from './useCosmosContext.js';
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
  const { mutate: disconnectSuiWallet } = useSuiDisconnectWallet();
  const { disconnect: disconnectTonWallet } = useTonContext();
  const { disconnect: disconnectCosmosWallet } = useCosmosContext();
  const { disconnect: disconnectBitcoinWallet } = useBitcoinContext();

  const disconnectWallet = useCallback(
    async (params: DisconnectParams) => {
      let walletInstance: Wallet | undefined = wallets[params.chainType].find(
        (wallet) => wallet.id === params.walletId,
      );

      // cosmos wallets have chain ids appended to the wallet id
      // eg: 'keplr:cosmoshub-4'
      if (params.chainType === 'cosmos') {
        const walletId = params.walletId.split(':')[0];
        walletInstance = wallets[params.chainType].find((wallet) => walletId === wallet.id);
      }

      if (!walletInstance) {
        console.log(wallets, params.walletId);

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
      } else if (params.chainType === 'sui') {
        disconnectSuiWallet();
      } else if (params.chainType === 'cosmos') {
        disconnectCosmosWallet();
      } else if (params.chainType === 'ton') {
        await disconnectTonWallet();
      } else if (params.chainType === 'bitcoin') {
        await disconnectBitcoinWallet();
      } else {
        const connector = walletInstance.connector as DefaultConnector;
        await connector.disconnect();
      }
    },
    [
      disconnectEVM,
      disconnectSolanaWallet,
      disconnectSuiWallet,
      disconnectTronWallet,
      disconnectTonWallet,
      disconnectCosmosWallet,
      disconnectBitcoinWallet,
      wallets,
    ],
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
