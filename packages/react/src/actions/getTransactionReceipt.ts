import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getTransactionReceipt as getEVMTransactionReceipt } from '@wagmi/core';
import { ChainData, ChainType, ConnectionOrConfig, TransactionReceipt } from '../types/index.js';
import { getTransactionStatus as getBitcoinTransactionStatus } from './bitcoin/transaction.js';
import { TransactionParams } from './waitForTransaction.js';

export type GetTransactionReceiptOverrides<C extends ChainType = ChainType> = C extends 'solana'
  ? {
      maxSupportedTransactionVersion: number;
    }
  : any;

export type GetTransactionReceiptParams<CData extends ChainData> = {
  transactionParams: TransactionParams<CData['type']>;
  chain: CData;
  config: ConnectionOrConfig;
  overrides: GetTransactionReceiptOverrides<CData['type']> | undefined;
};

export type GetTransactionReceiptFunction = <CData extends ChainData = ChainData>(
  params: GetTransactionReceiptParams<CData>,
) => Promise<TransactionReceipt<CData['type']>>;

/**
 * Get transaction receipt
 * @param transactionParams - Transaction Parameters {@link TransactionParams}
 * @param chain - {@link ChainData}
 * @param config {@link ConnectionOrConfig}
 * @returns Transaction Receipt {@link TransactionReceipt}
 */
export const getTransactionReceipt = (async ({
  transactionParams,
  chain,
  config,
  overrides = {} as GetTransactionReceiptOverrides,
}) => {
  // evm chain
  if (chain.type === 'evm') {
    const { txHash } = transactionParams as TransactionParams<'evm'>;
    const receipt = await getEVMTransactionReceipt(config.wagmiConfig, {
      hash: txHash as `0x${string}`,
      chainId: chain.id,
    });
    return receipt;
  }

  if (chain.type === 'tron') {
    const { txHash } = transactionParams as TransactionParams<'tron'>;
    return await config.tronWeb.trx.getTransactionInfo(txHash);
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
    return result;
  }

  if (chain.type === 'sui') {
    const { txHash } = transactionParams as TransactionParams<'sui'>;

    return await config.suiClient.waitForTransaction({
      digest: txHash,
      options: {
        showEffects: false,
        showEvents: false,
        showBalanceChanges: true,
      },
    });
  }

  // cosmos chain (Stargate and CosmWasm clients)
  if (chain.type === 'cosmos') {
    const { txHash } = transactionParams as TransactionParams<'cosmos'>;

    // Use StargateClient or CosmWasmClient depending on the chain
    const cosmwasmClient = await SigningCosmWasmClient.connect(chain.rpcUrls.default.http[0]);

    // Fetch transaction details using the `getTx` method
    const result = await cosmwasmClient.getTx(txHash);

    if (!result) {
      throw new Error('Transaction not found');
    }

    return result;
  }

  if (chain.type === 'bitcoin') {
    const { txHash } = transactionParams as TransactionParams<'bitcoin'>;

    const result = await getBitcoinTransactionStatus(txHash);
    return result;
  }

  throw new Error('Chain type not supported');
}) as GetTransactionReceiptFunction;
