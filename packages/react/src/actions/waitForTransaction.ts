import { waitForTransactionReceipt } from '@wagmi/core';
import { ReplacementReturnType } from 'viem';
import { ChainData, ChainType, ConnectionOrConfig, OtherChainData, TransactionReceipt } from '../types/index.js';
import { pollCallback } from '../utils/index.js';
import { getTransactionStatus as getBitcoinTransactionStatus } from './bitcoin/transaction.js';
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
      : C extends 'near'
        ? {
            accountAddress: string;
          }
        : any);

export type DefaultTransactionParams = {
  txHash: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type TransactionParams<C extends ChainType> = DefaultTransactionParams;

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

  if (chain.type === 'cosmos') {
    const { txHash } = transactionParams as TransactionParams<'cosmos'>;

    // Use Cosmos client's RPC or LCD to fetch the transaction details
    const cosmosClient = config.getCosmosClient().chainWallets[chain.id];
    const stargateClient = await cosmosClient.getStargateClient();

    const receipt = await pollCallback(
      async () => {
        const result = await stargateClient.getTx(txHash);

        if (!result || result.code !== 0) {
          return undefined; // Transaction not found or failed, continue polling
        }

        return result;
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

  if (chain.type === 'bitcoin') {
    const { txHash } = transactionParams as TransactionParams<'bitcoin'>;

    const receipt = await pollCallback(
      async () => {
        const result = getBitcoinTransactionStatus(txHash);
        return result;
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
        const provider = await getNearProvider(chain as OtherChainData<'near'>);
        const txDetails = await provider.txStatus(txHash, _overrides.accountAddress);
        if (txDetails.final_execution_status === 'FINAL') {
          return txDetails;
        }
        return undefined;
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
