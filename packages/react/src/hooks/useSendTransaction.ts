import { Hooks } from '@matchain/matchid-sdk-react'; // Import Hooks properly
import { useMutation } from '@tanstack/react-query';
import { http } from 'viem'; // Import http for transport
import { SendTransactionParams, sendTransactionToChain } from '../actions/sendTransaction.js';
import { ChainData, ChainId } from '../types/index.js';
import { compareStrings } from '../utils/index.js';
import { useConnectionOrConfig } from './useConnectionOrConfig.js';
import { useCurrentAccount } from './useCurrentAccount.js';
import { useCurrentWallet } from './useCurrentWallet.js';
import { useNetwork } from './useNetwork.js';
import { useWallet } from './useWallet.js';

export type SendTransactionMutationParams = Omit<SendTransactionParams<ChainData>, 'config' | 'walletClient'>;

/**
 * Send transaction Hook
 * @returns Mutation object
 */
export const useSendTransaction = () => {
  const connectionOrConfig = useConnectionOrConfig();
  const currentWallet = useCurrentWallet();
  const currentAccount = useCurrentAccount();
  const walletInstance = useWallet(currentWallet?.type, currentWallet?.id);
  const { network, switchNetworkAsync } = useNetwork();
  const { createWalletClient } = Hooks.useWallet();

  return useMutation({
    mutationKey: ['sendTransaction'],
    mutationFn: async ({ chain, to, from, value, args, overrides }: SendTransactionMutationParams) => {
      if (!to || !from) {
        throw new Error('Missing required parameters');
      }
      if (!chain) {
        throw new Error('Chain not found');
      }
      if (!connectionOrConfig) {
        throw new Error('Connection or config not found');
      }

      // Check if wallet is connected
      if (!currentAccount || walletInstance?.type !== chain.type || !walletInstance?.connector) {
        throw new Error(`${chain.type} wallet is not connected`);
      }

      if (overrides?.walletType === 'matchId') {
        console.log('Inside overrides MatchID wallet', overrides);
      } else {
        if (!network || network?.toString() !== chain.id.toString()) {
          console.log('Switching network to', chain.id.toString());
          const switchedChain = await switchNetworkAsync(chain.id.toString() as ChainId).catch((e) => {
            console.error(e);
            throw e;
          });
          if (!switchedChain || switchedChain.id.toString() !== chain.id.toString()) {
            throw new Error('Failed to switch network');
          }
        }
      }

      // Check if from address matches currentAccount
      if (!compareStrings(from, currentAccount.address)) {
        throw new Error('From address does not match current account');
      }

      const walletClient = createWalletClient({
        // @ts-expect-error match id types are not updated
        transport: http(chain.rpcUrls.default.http[0]), // Set RPC dynamically
      });

      return sendTransactionToChain({
        chain,
        to,
        from,
        value,
        args,
        config: { ...connectionOrConfig, connector: walletInstance.connector },
        overrides,
        walletClient, // Pass initialized walletClient here
      });
    },
  });
};
