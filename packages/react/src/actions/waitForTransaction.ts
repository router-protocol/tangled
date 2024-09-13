import { Address } from '@ton/ton';
import { waitForTransactionReceipt } from '@wagmi/core';
import { ReplacementReturnType } from 'viem';
import { ChainData, ChainType, ConnectionOrConfig, TransactionReceipt } from '../types/index.js';
import { pollCallback } from '../utils/index.js';

export type DefaultOverrides = {
  interval: number;
  retryDelay: number;
  timeout: number;
};

export type WatchTransactionOverrides<C extends ChainType = ChainType> = DefaultOverrides &
  (C extends 'evm'
    ? {
        onReplaced: (replacement: ReplacementReturnType) => void;
        confirmations: number;
      }
    : C extends 'solana'
      ? {
          maxSupportedTransactionVersion: number;
        }
      : C extends 'ton'
        ? {
            accountAddress: string;
            lt: string;
          }
        : any);

export type WatchTransactionParams<C extends ChainType = ChainType> = {
  txHash: string;
  chain: ChainData<C>;
  config: ConnectionOrConfig;
  overrides: WatchTransactionOverrides<C> | undefined;
};

const DEFAULT_POLLING_INTERVAL = 2500; // 2.5 seconds

/**
 * Watch transaction
 * @param txHash - Transaction hash
 * @param chain - {@link ChainData}
 * @param config {@link ConnectionOrConfig}
 * @returns Transaction Receipt {@link TransactionReceipt}
 */
export const waitForTransaction = async <C extends ChainType>({
  chain,
  config,
  overrides,
  txHash,
}: WatchTransactionParams<C>): Promise<TransactionReceipt<C>> => {
  if (chain.type === 'evm') {
    const evmOverrides = (overrides || {}) as WatchTransactionOverrides<'evm'>;
    const receipt = await waitForTransactionReceipt(config.wagmiConfig, {
      hash: txHash as `0x${string}`,
      chainId: chain.id,

      ...evmOverrides,
    });
    return receipt as TransactionReceipt<C>;
  }

  if (chain.type === 'tron') {
    const txInfo = await pollCallback(
      async () => {
        const tx = await config.tronWeb.trx.getConfirmedTransaction(txHash);

        // If transaction is not found, return undefined. This will trigger the next poll
        if (!tx) return undefined;

        return await config.tronWeb.trx.getTransactionInfo(txHash);
      },
      {
        interval: overrides?.retryDelay || DEFAULT_POLLING_INTERVAL,
        timeout: overrides?.timeout,
      },
    );
    if (!txInfo) throw new Error('Transaction not found');
    return txInfo as TransactionReceipt<C>;
  }

  if (chain.type === 'solana') {
    const _overrides = (overrides || {}) as WatchTransactionOverrides<'solana'>;

    const receipt = await pollCallback(
      async () => {
        return await config.solanaConnection.getTransaction(txHash, {
          maxSupportedTransactionVersion: _overrides.maxSupportedTransactionVersion,
          commitment: 'confirmed',
        });
      },
      {
        interval: _overrides?.interval || DEFAULT_POLLING_INTERVAL,
        timeout: _overrides?.timeout,
      },
    );

    if (!receipt) {
      throw new Error('Transaction not found');
    }
    return receipt as TransactionReceipt<C>;
  }

  if (chain.type === 'ton') {
    const _overrides = (overrides || {}) as WatchTransactionOverrides<'ton'>;

    const receipt = await pollCallback(
      async () => {
        return await config.tonClient.getTransaction(Address.parse(_overrides.accountAddress), _overrides.lt, txHash);
      },
      {
        interval: overrides?.interval || DEFAULT_POLLING_INTERVAL,
        timeout: overrides?.timeout,
      },
    );

    if (!receipt) {
      throw new Error('Transaction not found');
    }
    return receipt as TransactionReceipt<C>;
  }

  throw new Error('Chain not supported');
};
