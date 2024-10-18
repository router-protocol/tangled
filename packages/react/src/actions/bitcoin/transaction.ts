import {
  BitcoinBalanceResponse,
  BitcoinTransactionStatus,
  BitcoinTransferRequest,
  BlockstreamGasFeeResponse,
  MempoolSpaceBitcoinGasFeeResponse,
  XfiBitcoinConnector,
} from '../../types/bitcoin.js';
import { ConnectionOrConfig, OtherChainData, OtherChainTypes } from '../../types/index.js';
import { removeHexPrefix } from '../../utils/index.js';
import { BitcoinApiConfigResult, getBitcoinApiConfig } from './bitcoinApiConfig.js';

export async function getBitcoinGasFee(apiConfig: BitcoinApiConfigResult): Promise<number> {
  try {
    const endpoint = apiConfig.name === 'blockstream' ? '/api/fee-estimates' : '/api/v1/fees/recommended';
    const apiUrl = `${apiConfig.baseUrl}${endpoint}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch bitcoin gas fee from ${apiConfig.name}: ${response.status}`);
    }

    const rawData = await response.json();
    let fastestFeeRate: number;

    if (apiConfig.name === 'blockstream') {
      const blockstreamData = rawData as BlockstreamGasFeeResponse;
      fastestFeeRate = blockstreamData['1'];
    } else if (apiConfig.name === 'mempool') {
      const mempoolData = rawData as MempoolSpaceBitcoinGasFeeResponse;
      fastestFeeRate = mempoolData.fastestFee;
    } else {
      throw new Error(`Unsupported API: ${apiConfig.name}`);
    }

    if (isNaN(fastestFeeRate) || fastestFeeRate <= 0) {
      throw new Error(`Invalid fee rate received from ${apiConfig.name}`);
    }

    return Math.floor(fastestFeeRate);
  } catch (error) {
    console.error(`[BITCOIN] Failed to fetch bitcoin gas from ${apiConfig.name} - `, error);
    throw error;
  }
}

/**
 * Determines the fee rate to use for the transaction.
 * First tries using the provided fee rate, then falls back to Blockstream API,
 * then Mempool API, and finally defaults to 0.
 *
 * @param {string} chainId - The ID of the chain (bitcoin or testnet)
 * @param {number} [providedFeeRate] - Optional user-provided fee rate
 * @returns {Promise<number>} The determined fee rate
 */
async function determineFeeRate(chainId: string, providedFeeRate?: number): Promise<number> {
  if (providedFeeRate !== undefined) {
    return providedFeeRate;
  }

  const isTestnet = chainId !== 'bitcoin';

  // Trying Blockstream first, then fall back to Mempool
  const blockstreamFee = await getBitcoinGasFee(getBitcoinApiConfig(isTestnet, 'blockstream'));
  if (blockstreamFee) {
    return blockstreamFee;
  }

  const mempoolFee = await getBitcoinGasFee(getBitcoinApiConfig(isTestnet, 'mempool'));
  if (mempoolFee) {
    return mempoolFee;
  }

  return 0;
}

/**
 * Creates and executes a transfer request using the Bitcoin provider.
 *
 * @param {any} bitcoinProvider - The Bitcoin provider instance
 * @param {Object} params - The parameters for the transfer
 * @param {string} params.from - Sender's address
 * @param {string} params.recipient - Recipient's address
 * @param {number} params.amount - Transaction amount
 * @param {string} params.memo - Transaction memo
 * @param {number} params.feeRate - Fee rate to use
 * @returns {Promise<string>} A promise that resolves to the transaction hash
 * @throws {BitcoinTransactionError} If the transfer request fails or returns invalid result
 */
function executeTransferRequest(
  bitcoinProvider: XfiBitcoinConnector,
  { from, recipient, amount, memo, feeRate }: Omit<BitcoinTransferRequest, 'amount'> & { amount: number },
): Promise<string> {
  const transferRequest: BitcoinTransferRequest = {
    feeRate,
    from,
    recipient,
    amount: {
      amount,
      decimals: 8,
    },
    memo: `hex::${removeHexPrefix(memo)}`,
  };

  return new Promise((resolve, reject) => {
    bitcoinProvider.request(
      {
        method: 'transfer',
        params: [transferRequest],
      },
      (error: unknown, result: string | string[]) => {
        if (error) {
          reject(new Error('Transfer request failed', error));
          return;
        }

        if (typeof result !== 'string') {
          reject(new Error('Expected a string result'));
          return;
        }

        resolve(result);
      },
    );
  });
}

/**
 * Signs a Bitcoin transaction with the provided parameters.
 *
 * @param {BitcoinTransferParams} params - The parameters for the transaction
 * @param {ConnectionOrConfig} params.config - Connection configuration
 * @param {OtherChainData<OtherChainTypes>} params.chain - Chain information
 * @param {string} params.from - Sender's address
 * @param {string} params.recipient - Recipient's address
 * @param {number} params.amount - Transaction amount
 * @param {string} params.memo - Transaction memo
 * @param {number} [params.feeRate] - Optional fee rate override
 * @returns {Promise<string>} The signed transaction hash
 * @throws {BitcoinTransactionError} If the transaction signing fails
 */
export async function signBitcoinTransaction({
  config,
  chain,
  from,
  recipient,
  amount,
  memo,
  feeRate,
}: {
  config: ConnectionOrConfig;
  chain: OtherChainData<OtherChainTypes>;
  from: string;
  recipient: string;
  amount: number;
  memo: string;
  feeRate?: number;
}): Promise<string> {
  try {
    const actualFeeRate = await determineFeeRate(chain.id, feeRate);
    return await executeTransferRequest(config.bitcoinProvider, {
      from,
      recipient,
      amount,
      memo,
      feeRate: actualFeeRate,
    });
  } catch (error) {
    throw new Error('[BITCOIN] Transfer request:: Expected a string result');
  }
}

export const fetchBalance = async (apiConfig: BitcoinApiConfigResult, account: string): Promise<bigint> => {
  try {
    const apiUrl = `${apiConfig.baseUrl}/api/address/${account}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch balance from ${apiConfig.name}: ${response.status}`);
    }

    const rawData = await response.json();
    const totalBalanceSatoshis = calculateTotalBalance(rawData);

    return BigInt(totalBalanceSatoshis);
  } catch (error) {
    console.error(`Failed to fetch bitcoin balance from ${apiConfig.name} - `, error);
    throw error;
  }
};

const calculateTotalBalance = (rawData: BitcoinBalanceResponse): number => {
  const confirmedBalance = rawData.chain_stats.funded_txo_sum - rawData.chain_stats.spent_txo_sum;
  const mempoolBalance = rawData.mempool_stats.funded_txo_sum - rawData.mempool_stats.spent_txo_sum;

  return confirmedBalance + mempoolBalance;
};

export const fetchTransaction = async (
  txHash: string,
  apiConfig: BitcoinApiConfigResult,
): Promise<BitcoinTransactionStatus | undefined> => {
  const apiUrl = `${apiConfig.baseUrl}/api/tx/${txHash}/status`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`Failed to fetch transaction status from ${apiConfig.name}: ${response.status}`);
      return undefined;
    }

    const rawData = await response.json();
    const transactionStatus: BitcoinTransactionStatus = {
      confirmed: rawData.confirmed,
      block_height: rawData.block_height,
      block_hash: rawData.block_hash,
      block_time: rawData.block_time,
    };

    return transactionStatus.confirmed ? transactionStatus : undefined;
  } catch (error) {
    console.error(`Error fetching Bitcoin transaction status from ${apiConfig.name}: ${error}`);
    return undefined;
  }
};
