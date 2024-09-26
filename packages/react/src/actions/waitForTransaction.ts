import { Address } from '@ton/ton';
import { waitForTransactionReceipt } from '@wagmi/core';
import { ReplacementReturnType } from 'viem';
import { ChainData, ChainType, ConnectionOrConfig, TransactionReceipt } from '../types/index.js';
import { pollCallback } from '../utils/index.js';
import { getNearProvider } from './near/readCalls.js';

export type DefaultOverrides = {
  interval: number;
  retryDelay: number;
  timeout: number;
};

export type WatchTransactionOverrides<C extends ChainType> = DefaultOverrides &
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
        : C extends 'near'
          ? {
              accountAddress: string;
            }
          : any);

export type DefaultTransactionParams = {
  txHash: string;
};

export type TransactionParams<C extends ChainType> = C extends 'alephZero'
  ? {
      blockHash: string;
      extrinsicIndex: number;
    }
  : DefaultTransactionParams;

export type WatchTransactionParams<CData extends ChainData> = {
  transactionParams: TransactionParams<CData['type']>;
  chain: ChainData;
  config: ConnectionOrConfig;
  overrides: WatchTransactionOverrides<CData['type']> | undefined;
};

export type WatchTransactionFunction = <CData extends ChainData = ChainData>(
  params: WatchTransactionParams<CData>,
) => Promise<TransactionReceipt<CData['type']>>;

const DEFAULT_POLLING_INTERVAL = 2500; // 2.5 seconds

/**
 * Watch transaction
 * @param transactionParams - Transaction Parameters
 * @param chain - {@link ChainData}
 * @param config {@link ConnectionOrConfig}
 * @returns Transaction Receipt {@link TransactionReceipt}
 */
export const waitForTransaction = (async ({ chain, config, overrides, transactionParams }) => {
  if (chain.type === 'evm') {
    const { txHash } = transactionParams as TransactionParams<'evm'>;
    const evmOverrides = (overrides || {}) as WatchTransactionOverrides<'evm'>;

    const receipt = await waitForTransactionReceipt(config.wagmiConfig, {
      hash: txHash as `0x${string}`,
      chainId: chain.id,

      ...evmOverrides,
    });
    return receipt;
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
    return txInfo;
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
    return receipt;
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

    return receipt;
  }

  if (chain.type === 'sui') {
    const { txHash } = transactionParams as TransactionParams<'sui'>;

    const receipt = await pollCallback(
      async () => {
        return await config.suiClient.waitForTransaction({
          digest: txHash,
          options: {
            showEffects: true,
            showEvents: true,
            showBalanceChanges: true,
          },
        });
      },
      {
        interval: overrides?.interval || DEFAULT_POLLING_INTERVAL,
        timeout: overrides?.timeout,
      },
    );

    if (!receipt) {
      throw new Error('Transaction not found');
    }
    return receipt;
  }

  if (chain.type === 'ton') {
    const _overrides = (overrides || {}) as WatchTransactionOverrides<'ton'>;
    const { txHash } = transactionParams as TransactionParams<'ton'>;

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
    return receipt;
  }

  if (chain.type === 'near') {
    const _overrides = (overrides || {}) as WatchTransactionOverrides<'near'>;
    let { txHash } = transactionParams as TransactionParams<'near'>;

    const params = new URLSearchParams(window.location.search);
    const transactionHashes = params.get('transactionHashes');
    if (transactionHashes) {
      txHash = transactionHashes;
    }

    const receipt = await pollCallback(
      async () => {
        const provider = await getNearProvider(chain);
        return await provider.txStatus(txHash, _overrides.accountAddress);
      },
      {
        interval: overrides?.interval || DEFAULT_POLLING_INTERVAL,
        timeout: overrides?.timeout,
      },
    );

    if (!receipt) {
      throw new Error('Transaction not found');
    }

    return receipt;
  }

  throw new Error('Chain not supported');
}) as WatchTransactionFunction;
