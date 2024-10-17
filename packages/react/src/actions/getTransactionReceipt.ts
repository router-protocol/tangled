import { getTransactionReceipt as getEVMTransactionReceipt } from '@wagmi/core';
import { ChainData, ChainType, ConnectionOrConfig, OtherChainData, TransactionReceipt } from '../types/index.js';
import { getBitcoinApiConfig } from './bitcoin/bitcoinApiConfig.js';
import { fetchTransaction } from './bitcoin/transaction.js';
import { getNearProvider } from './near/readCalls.js';
import { TransactionParams } from './waitForTransaction.js';

export type GetTransactionReceiptOverrides<C extends ChainType = ChainType> = C extends 'solana'
  ? {
      maxSupportedTransactionVersion: number;
    }
  : C extends 'near'
    ? { accountAddress: string }
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

    return transactionData;
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
    const chainWallet = config.getCosmosClient().chainWallets[chain.id];

    const cosmosClient = await chainWallet.getStargateClient();

    // Fetch transaction details using the `getTx` method
    const result = await cosmosClient.getTx(txHash);

    if (!result) {
      throw new Error('Transaction not found');
    }

    return result;
  }

  if (chain.type === 'bitcoin') {
    const { txHash } = transactionParams as TransactionParams<'bitcoin'>;

    const result =
      (await fetchTransaction(txHash, getBitcoinApiConfig(chain.id !== 'bitcoin', 'blockstream'))) ||
      (await fetchTransaction(txHash, getBitcoinApiConfig(chain.id !== 'bitcoin', 'mempool')));
    return result;
  }

  if (chain.type === 'near') {
    const { txHash } = transactionParams as TransactionParams<'near'>;

    const provider = await getNearProvider(chain as OtherChainData<'near'>);
    return await provider.txStatus(txHash, overrides.accountAddress);
  }

  throw new Error('Chain type not supported');
}) as GetTransactionReceiptFunction;
