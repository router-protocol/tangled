import { getTransactionReceipt as getEVMTransactionReceipt } from '@wagmi/core';
import { ChainData, ChainType, ConnectionOrConfig, TransactionReceipt } from '../types/index.js';
import { TransactionParams } from './waitForTransaction.js';

export type GetTransactionReceiptOverrides<C extends ChainType = ChainType> = C extends 'solana'
  ? {
      maxSupportedTransactionVersion: number;
    }
  : any;

export type GetTransactionReceiptParams<C extends ChainType = ChainType> = {
  transactionParams: TransactionParams<C>;
  chain: ChainData<C>;
  config: ConnectionOrConfig;
  overrides: GetTransactionReceiptOverrides<C> | undefined;
};

/**
 * Get transaction receipt
 * @param transactionParams - Transaction Parameters {@link TransactionParams}
 * @param chain - {@link ChainData}
 * @param config {@link ConnectionOrConfig}
 * @returns Transaction Receipt {@link TransactionReceipt}
 */
export const getTransactionReceipt = async <C extends ChainType>({
  transactionParams,
  chain,
  config,
  overrides = {} as GetTransactionReceiptOverrides,
}: GetTransactionReceiptParams<C>): Promise<TransactionReceipt<C>> => {
  // evm chain
  if (chain.type === 'evm') {
    const { txHash } = transactionParams as TransactionParams<'evm'>;
    const receipt = await getEVMTransactionReceipt(config.wagmiConfig, {
      hash: txHash as `0x${string}`,
      chainId: chain.id,
    });
    return receipt as TransactionReceipt<C>;
  }

  if (chain.type === 'tron') {
    const { txHash } = transactionParams as TransactionParams<'tron'>;
    return (await config.tronWeb.trx.getTransactionInfo(txHash)) as TransactionReceipt<C>;
  }

  if (chain.type === 'solana') {
    const { txHash } = transactionParams as TransactionParams<'solana'>;
    const result = config.solanaConnection.getTransaction(txHash, {
      maxSupportedTransactionVersion: 0,
      ...overrides,
    });
    if (!result) {
      throw new Error('Transaction not found');
    }
    return result as TransactionReceipt<C>;
  }

  if (chain.type === 'alephZero') {
    const { blockHash, extrinsicIndex } = transactionParams as TransactionParams<'alephZero'>;
    const alephZero = config.alephZeroApi;

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

    if (!transactionData) {
      throw new Error('Transaction not found');
    }

    return transactionData as TransactionReceipt<C>;
  }

  throw new Error('Chain type not supported');
};
