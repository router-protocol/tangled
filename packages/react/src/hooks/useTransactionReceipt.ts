import { useQuery } from '@tanstack/react-query';
import { GetTransactionReceiptOverrides, getTransactionReceipt } from '../actions/getTransactionReceipt.js';
import { TransactionParams } from '../actions/waitForTransaction.js';
import { ChainId } from '../types/index.js';
import { useChain } from './useChain.js';
import { useConnectionOrConfig } from './useConnectionOrConfig.js';

export type UseTransactionReceiptParams = {
  /** Transaction Params {@link TransactionParams} */
  transactionParams: TransactionParams | undefined;
  /** Chain ID of transaction */
  chainId: ChainId;
  /** Transaction overrides {@link GetTransactionReceiptOverrides} */
  overrides?: GetTransactionReceiptOverrides;
};

/**
 * Transaction Receipt Hook
 * @param transactionParams - Transaction Parameters
 * @param chainId - Chain ID of transaction
 * @param overrides - Transaction overrides {@link GetTransactionReceiptOverrides}
 * @returns Query object
 */
export const useTransactionReceipt = ({ transactionParams, chainId, overrides }: UseTransactionReceiptParams) => {
  const connectionOrConfig = useConnectionOrConfig();
  const chain = useChain(chainId);

  return useQuery({
    queryKey: ['transaction receipt', transactionParams, chainId],
    queryFn: async () => {
      if (!connectionOrConfig) {
        throw new Error('Connections or config not found');
      }
      if (!chain) {
        throw new Error('Chain is not supported');
      }
      if (!transactionParams) {
        throw new Error('Transaction Params are required');
      }

      return await getTransactionReceipt({
        transactionParams,
        chain,
        config: connectionOrConfig,
        overrides,
      });
    },
    enabled: Boolean(connectionOrConfig && chain && transactionParams),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
