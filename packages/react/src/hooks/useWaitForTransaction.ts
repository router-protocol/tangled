import { useQuery } from '@tanstack/react-query';
import { WatchTransactionOverrides, waitForTransaction } from '../actions/waitForTransaction.js';
import { ChainId, TransactionReceipt } from '../types/index.js';
import { useChain } from './useChain.js';
import { useConnectionOrConfig } from './useConnectionOrConfig.js';

export type UseWaitForTransactionParams = {
  /** Transaction hash */
  txHash: string | undefined;
  /** Chain ID of transaction */
  chainId: ChainId;
  /** Transaction overrides {@link WatchTransactionOverrides} */
  overrides?: WatchTransactionOverrides;
};

/**
 * Watch transaction Hook
 * @param txHash - Transaction hash
 * @param chainId - Chain ID of transaction
 */
export const useWaitForTransaction = ({ txHash, chainId, overrides }: UseWaitForTransactionParams) => {
  const connectionOrConfig = useConnectionOrConfig();
  const chain = useChain(chainId);

  return useQuery<TransactionReceipt>({
    queryKey: ['watch transaction', txHash, chainId],
    queryFn: async () => {
      if (!connectionOrConfig) {
        throw new Error('Connections or config not found');
      }
      if (!chain) {
        throw new Error('Chain is not supported');
      }
      if (!txHash) {
        throw new Error('Transaction hash is required');
      }

      return await waitForTransaction({
        txHash,
        chain,
        config: connectionOrConfig,
        overrides,
      });
    },
    enabled: Boolean(connectionOrConfig && chain && txHash),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
