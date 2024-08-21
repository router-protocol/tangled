import { useQuery } from '@tanstack/react-query';
import { GetTransactionReceiptOverrides, getTransactionReceipt } from '../actions/getTransactionReceipt.js';
import { ChainId } from '../types/index.js';
import { useChain } from './useChain.js';
import { useConnectionOrConfig } from './useConnectionOrConfig.js';

export type UseTransactionReceiptParams = {
  /** Transaction hash */
  txHash: string | undefined;
  /** Chain ID of transaction */
  chainId: ChainId;
  /** Transaction overrides {@link GetTransactionReceiptOverrides} */
  overrides?: GetTransactionReceiptOverrides;
};

/**
 * Transaction Receipt Hook
 * @param txHash - Transaction hash
 * @param chainId - Chain ID of transaction
 * @param overrides - Transaction overrides {@link GetTransactionReceiptOverrides}
 * @returns Query object
 */
export const useTransactionReceipt = ({ txHash, chainId, overrides }: UseTransactionReceiptParams) => {
  const connectionOrConfig = useConnectionOrConfig();
  const chain = useChain(chainId);

  return useQuery({
    queryKey: ['transaction receipt', txHash, chainId],
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

      return await getTransactionReceipt({
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
