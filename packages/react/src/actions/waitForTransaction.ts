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

export type DefaultTransactionParams = {
  txHash: string;
};

export type TransactionParams<C extends ChainType = ChainType> = C extends 'alephZero'
  ? {
      blockHash: string;
      extrinsicIndex: number;
    }
  : DefaultTransactionParams;

export type WatchTransactionParams<C extends ChainType = ChainType> = {
  transactionParams: TransactionParams<C>;
  chain: ChainData<C>;
  config: ConnectionOrConfig;
  overrides: WatchTransactionOverrides<C> | undefined;
};

const DEFAULT_POLLING_INTERVAL = 2500; // 2.5 seconds

/**
 * Watch transaction
 * @param transactionParams - Transaction Parameters
 * @param chain - {@link ChainData}
 * @param config {@link ConnectionOrConfig}
 * @returns Transaction Receipt {@link TransactionReceipt}
 */
export const waitForTransaction = async <C extends ChainType>({
  chain,
  config,
  overrides,
  transactionParams,
}: WatchTransactionParams<C>): Promise<TransactionReceipt<C>> => {
  if (chain.type === 'evm') {
    const { txHash } = transactionParams as TransactionParams<'evm'>;
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
        const { txHash } = transactionParams as TransactionParams<'tron'>;
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
    const { txHash } = transactionParams as TransactionParams<'solana'>;
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

  if (chain.type === 'alephZero') {
    const { blockHash, extrinsicIndex } = transactionParams as TransactionParams<'alephZero'>;
    const alephZero = config.alephZeroApi;

    const receipt = await pollCallback(
      async () => {
        const signedBlock = await alephZero.rpc.chain.getBlock(blockHash);

        // Get the specific extrinsic
        const extrinsic = signedBlock.block.extrinsics[extrinsicIndex];

        if (!extrinsic) {
          throw new Error('Extrinsic not found');
        }

        // Get the events for this block
        const apiAt = await alephZero.at(blockHash);
        const allRecords = (await apiAt.query.system.events()).toPrimitive() as any[];

        const extrinsicEvents = allRecords.filter(
          (event) => event.phase.applyExtrinsic && event.phase.applyExtrinsic === extrinsicIndex,
        );

        const transactionData = {
          blockHash,
          extrinsicIndex,
          extrinsic: extrinsic,
          extrinsicHash: extrinsic.hash.toHuman(),
          method: extrinsic.method.toHuman(),
          args: extrinsic.args.map((arg) => arg.toHuman()),
          events: extrinsicEvents,
        };

        return transactionData;
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
