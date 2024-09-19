import { useMutation } from '@tanstack/react-query';
import { SendTransactionParams, sendTransactionToChain } from '../actions/sendTransaction.js';
import { ChainId } from '../types/index.js';
import { useChains } from './useChains.js';
import { useConnectionOrConfig } from './useConnectionOrConfig.js';
import { useCurrentAccount } from './useCurrentAccount.js';
import { useCurrentWallet } from './useCurrentWallet.js';
import { useNetwork } from './useNetwork.js';
import { useWallet } from './useWallet.js';

type UseSendTransactionParams = Omit<SendTransactionParams, 'chain' | 'config'> & {
  chainId: ChainId;
};

/**
 * Send transaction Hook
 * @returns Mutation object
 */
export const useSendTransaction = () => {
  const chains = useChains();
  const connectionOrConfig = useConnectionOrConfig();
  const currentWallet = useCurrentWallet();
  const currentAccount = useCurrentAccount();
  const walletInstance = useWallet(currentWallet?.type, currentWallet?.id);
  const { network, switchNetworkAsync } = useNetwork();

  return useMutation({
    mutationKey: ['sendTransaction'],
    mutationFn: async ({ chainId, to, from, value, args, overrides }: UseSendTransactionParams) => {
      if (!to || !from) {
        throw new Error('Missing required parameters');
      }
      const chain = chains.find((chain) => chain.id === chainId);
      if (!chain) {
        throw new Error('Chain not found');
      }
      if (!connectionOrConfig) {
        throw new Error('Connection or config not found');
      }

      // check if chain type wallet is connected to chain
      if (!currentAccount || walletInstance?.type !== chain.type || !walletInstance?.connector) {
        throw new Error(`${chain.type} wallet is not connected`);
      }

      // check if from address matches currentAccount
      if (from !== currentAccount.address) {
        throw new Error('From address does not match current account');
      }

      // check chain id of wallet
      if (network !== chainId) {
        console.log('Switching network to', chainId);
        const switchedChain = await switchNetworkAsync(chainId).catch((e) => {
          console.error(e);
          throw e;
        });
        if (!switchedChain || switchedChain.id !== chainId) {
          throw new Error('Failed to switch network');
        }
        // temp fix for sui
        if (switchedChain.type == 'sui') {
          throw new Error('Failed to switch network on wallet, please switch manually');
        }
      }

      return sendTransactionToChain({
        chain,
        to,
        from,
        value,
        args,
        config: { ...connectionOrConfig, connector: walletInstance.connector },
        overrides,
      });
    },
  });
};
