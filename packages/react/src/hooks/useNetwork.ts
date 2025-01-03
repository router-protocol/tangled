import { useSuiClientContext } from '@mysten/dapp-kit';
import { useMutation } from '@tanstack/react-query';
import { WalletSwitchChainError } from '@tronweb3/tronwallet-abstract-adapter';
import { useCallback } from 'react';
import { useSwitchChain as useEVMSwitchChain } from 'wagmi';
import { ChainData, ChainId } from '../types/index.js';
import { WalletInstance } from '../types/wallet.js';
import { useChains } from './useChains.js';
import { useConnect } from './useConnect.js';
import { useCurrentAccount } from './useCurrentAccount.js';
import { useWallet } from './useWallet.js';

export const useNetwork = () => {
  const currentAccount = useCurrentAccount();
  const currentWalletInstance = useWallet(currentAccount?.chainType, currentAccount?.wallet);
  const chains = useChains(currentAccount?.chainType);
  const { selectNetwork: selectSuiNetwork } = useSuiClientContext();
  const { switchChainAsync } = useEVMSwitchChain();
  const { connectAsync } = useConnect();

  const switchNetwork = useCallback(
    async (chainId: ChainId): Promise<ChainData | undefined> => {
      const connector = currentWalletInstance?.connector;
      if (!connector) {
        throw new Error('No wallet connector found');
      }
      if (!currentAccount) {
        throw new Error('No current account found to switch network');
      }

      const chain = chains.find((chain) => chain.id.toString() === chainId);

      if (!chain) {
        throw new Error('Chain not found');
      }

      if (chain.type === 'evm') {
        const switchedChain = await switchChainAsync({
          chainId: Number(chainId),
          connector: connector as WalletInstance<'evm'>,
        });

        return chains.find((chain) => chain.id === switchedChain.id);
      }
      if (chain.type === 'tron') {
        // convert chain id
        try {
          await (connector as WalletInstance<'tron'>).switchChain(chain.trxId);
        } catch (e) {
          if (e instanceof WalletSwitchChainError) {
            console.error('Switch chain is not supported');
          } else {
            console.error(e);
            throw e;
          }
        }

        return chains.find((chain) => chain.id === chain.id.toString());
      }

      if (chain.type === 'sui') {
        try {
          selectSuiNetwork(chain.id);

          // temp fix
          throw new Error('Failed to switch network on wallet, please switch manually');
        } catch (e) {
          console.error(e);
          throw e;
        }
      }

      if (chain.type === 'cosmos') {
        const newWalletId = `${currentAccount.wallet.split(':')[0]}:${chain.id}`;
        const connectedWalletData = await connectAsync({
          chainType: 'cosmos',
          walletId: newWalletId,
        });
        const connectedChainId = connectedWalletData.walletId.split(':')[1];

        return chains.find((chain) => chain.id === connectedChainId);
      }

      throw new Error('Chain type not supported');
    },
    [currentWalletInstance?.connector, currentAccount, chains, switchChainAsync, selectSuiNetwork, connectAsync],
  );

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationKey: ['switch-network', currentAccount?.wallet],
    mutationFn: switchNetwork,
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      // do something
    },
  });

  return {
    network: currentAccount?.chainId,
    switchNetwork: mutate,
    switchNetworkAsync: mutateAsync,
    isPending,
  };
};
