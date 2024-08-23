import { getTransactionReceipt as getEVMTransactionReceipt } from '@wagmi/core';
import { ChainData, ChainType, ConnectionOrConfig, TransactionReceipt } from '../types/index.js';

export type GetTransactionReceiptOverrides<C extends ChainType = ChainType> = C extends 'solana'
  ? {
      maxSupportedTransactionVersion: number;
    }
  : any;

export type GetTransactionReceiptParams<C extends ChainType = ChainType> = {
  txHash: string;
  chain: ChainData<C>;
  config: ConnectionOrConfig;
  overrides: GetTransactionReceiptOverrides<C> | undefined;
};

/**
 * Get transaction receipt
 * @param txHash - Transaction hash
 * @param chain - {@link ChainData}
 * @param config {@link ConnectionOrConfig}
 * @returns Transaction Receipt {@link TransactionReceipt}
 */
export const getTransactionReceipt = async <C extends ChainType>({
  txHash,
  chain,
  config,
  overrides = {} as GetTransactionReceiptOverrides,
}: GetTransactionReceiptParams<C>): Promise<TransactionReceipt<C>> => {
  // evm chain
  if (chain.type === 'evm') {
    const receipt = await getEVMTransactionReceipt(config.wagmiConfig, {
      hash: txHash as `0x${string}`,
      chainId: chain.id,
    });
    return receipt as TransactionReceipt<C>;
  }

  if (chain.type === 'tron') {
    return (await config.tronWeb.trx.getTransactionInfo(txHash)) as TransactionReceipt<C>;
  }

  if (chain.type === 'solana') {
    const result = config.solanaConnection.getTransaction(txHash, {
      maxSupportedTransactionVersion: 0,
      ...overrides,
    });
    if (!result) {
      throw new Error('Transaction not found');
    }
    return result as TransactionReceipt<C>;
  }

  throw new Error('Chain type not supported');
};
