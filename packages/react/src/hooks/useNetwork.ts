import { useSuiClientContext } from '@mysten/dapp-kit';
import { useMutation } from '@tanstack/react-query';
import { WalletSwitchChainError } from '@tronweb3/tronwallet-abstract-adapter';
import { useCallback } from 'react';
import { useSwitchChain } from 'wagmi';
import { ChainData, ChainId } from '../types/index.js';
import { WalletInstance } from '../types/wallet.js';
import { useChains } from './useChains.js';
import { useCurrentAccount } from './useCurrentAccount.js';
import { useWallet } from './useWallet.js';

export const useNetwork = () => {
  const currentAccount = useCurrentAccount();
  const currentWalletInstance = useWallet(currentAccount?.chainType, currentAccount?.wallet);
  const chains = useChains(currentAccount?.chainType);
  const { selectNetwork: selectSuiNetwork } = useSuiClientContext();

  const { switchChainAsync } = useSwitchChain();

  const switchNetwork = useCallback(
    async (chainId: ChainId): Promise<ChainData | undefined> => {
      const connector = currentWalletInstance?.connector;
      if (!connector) {
        throw new Error('No wallet connector found');
      }

      const chain = chains.find((chain) => chain.id.toString() === chainId);

      if (chain?.type === 'evm') {
        const switchedChain = await switchChainAsync({
          chainId: Number(chainId),
          connector: connector as WalletInstance<'evm'>,
        });

        return chains.find((chain) => chain.id === switchedChain.id.toString());
      }
      if (chain?.type === 'tron') {
        try {
          await (connector as WalletInstance<'tron'>).switchChain(chain.tronName);
        } catch (e) {
          if (e === WalletSwitchChainError) {
            console.error('Switch chain is not supported');
          } else {
            console.error(e);
            throw e;
          }
        }

        return;
      }

      if (chain?.type === 'sui') {
        try {
          selectSuiNetwork(chain.id);
        } catch (e) {
          console.error(e);
          throw e;
        }

        return;
      }
    },
    [chains, currentWalletInstance, switchChainAsync, selectSuiNetwork],
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
