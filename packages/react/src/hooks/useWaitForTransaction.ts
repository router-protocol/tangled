import { useQuery } from '@tanstack/react-query';
import { TransactionParams, WatchTransactionOverrides, waitForTransaction } from '../actions/waitForTransaction.js';
import { ChainId, ChainType } from '../types/index.js';
import { QueryParameter } from '../types/properties.js';
import { useChain } from './useChain.js';
import { useConnectionOrConfig } from './useConnectionOrConfig.js';

export type UseWaitForTransactionParams = {
  /** Transaction Parameters {@link TransactionParams} */
  transactionParams: TransactionParams<ChainType>;
  /** Chain ID of transaction */
  chainId: ChainId | undefined;
  /** Transaction overrides {@link WatchTransactionOverrides} */
  overrides?: WatchTransactionOverrides<ChainType>;
  queryOptions?: QueryParameter;
};

/**
 * Watch transaction Hook
 * @param transactionParams - Transaction Parameters
 * @param chainId - Chain ID of transaction
 */
export const useWaitForTransaction = ({
  transactionParams,
  chainId,
  overrides,
  queryOptions = {},
}: UseWaitForTransactionParams) => {
  const connectionOrConfig = useConnectionOrConfig();
  const chain = useChain(chainId);

  return useQuery({
    queryKey: ['watch transaction', transactionParams, chainId],
    queryFn: async () => {
      if (!connectionOrConfig) {
        throw new Error('Connections or config not found');
      }
      if (!chain) {
        throw new Error('Chain is not supported');
      }
      if (!transactionParams) {
        throw new Error('Transaction Parameters are required');
      }

      return await waitForTransaction({
        transactionParams,
        chain,
        config: connectionOrConfig,
        overrides,
      });
    },
    enabled: Boolean(connectionOrConfig && chain && transactionParams),
    retry: false,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
};
