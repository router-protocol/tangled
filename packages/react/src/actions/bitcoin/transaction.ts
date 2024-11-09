import {
  BitcoinTransactionStatus,
  BitcoinTransferRequest,
  BlockchainInfoTransactionResponse,
  BlockcypherTransactionResponse,
  BlockstreamGasFeeResponse,
  BtcScanTransactionResponse,
  MempoolSpaceBitcoinGasFeeResponse,
  XfiBitcoinConnector,
} from '../../types/bitcoin.js';
import { ConnectionOrConfig, OtherChainData, OtherChainTypes } from '../../types/index.js';
import { removeHexPrefix } from '../../utils/index.js';
import { tryAPI } from './balance.js';
import { APIs, BitcoinApiConfigResult, getBitcoinApiConfig } from './bitcoinApiConfig.js';

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

/**
 * Fetches the transaction status for a given transaction hash.
 *
 * @param {string} txHash - The transaction hash to fetch the status for.
 * @returns {Promise<BitcoinTransactionStatus>} A promise that resolves to the transaction status.
 * @throws {Error} If all APIs fail to fetch the transaction status.
 */
export const getTransactionStatus = async (txHash: string): Promise<BitcoinTransactionStatus> => {
  for (const api of APIs) {
    try {
      switch (api.name) {
        case 'btcscan': {
          const response = await tryAPI<BtcScanTransactionResponse>(api.name, api.url.transaction(txHash));
          return {
            confirmed: response.data.confirmed,
            block_height: response.data.block_height,
            block_hash: response.data.block_hash,
            block_time: response.data.block_time,
          };
        }
        case 'blockchain.info': {
          const response = await tryAPI<BlockchainInfoTransactionResponse>(api.name, api.url.transaction(txHash));
          return {
            confirmed: response.data.block?.height !== undefined,
            block_height: response.data.block?.height ?? 0,
            block_hash: 'unknown',
            block_time: response.data.time * 1000,
          };
        }
        case 'blockcypher': {
          const response = await tryAPI<BlockcypherTransactionResponse>(api.name, api.url.transaction(txHash));
          return {
            confirmed: response.data.confirmations > 0,
            block_height: response.data.block_height,
            block_hash: response.data.block_hash,
            block_time: new Date(response.data.received).getTime(),
          };
        }
      }
    } catch (error) {
      continue;
    }
  }

  throw new Error(`All APIs failed to fetch transaction status for ${txHash}`);
};
