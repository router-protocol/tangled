import {
  BitcoinTransactionStatus,
  BitcoinTransferRequest,
  BlockchainInfoTransactionResponse,
  BlockcypherTransactionResponse,
  BtcScanTransactionResponse,
  MempoolSpaceBitcoinGasFeeResponse,
  XfiBitcoinConnector,
} from '../../types/bitcoin.js';
import { ConnectionOrConfig, OtherChainData, OtherChainTypes } from '../../types/index.js';
import { removeHexPrefix } from '../../utils/index.js';
import { APIs, CACHE_EXPIRATION_TIME, tryAPI } from './bitcoinApiConfig.js';

export async function getBitcoinGasFee(): Promise<number> {
  try {
    const feeData: MempoolSpaceBitcoinGasFeeResponse = await (
      await fetch('https://mempool.space/api/v1/fees/recommended')
    ).json();
    const fastestFeeRate = feeData.fastestFee;
    return Math.floor(fastestFeeRate);
  } catch (error) {
    console.error(`[BITCOIN] Failed to fetch bitcoin gas from mempool.space - `, error);
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

  const gasFees = await getBitcoinGasFee();
  if (gasFees) {
    return gasFees;
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
      decimals: 8, // BTC decimals
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
  const lastUsedApiData = localStorage.getItem('lastUsedApi-bitcoin');
  if (lastUsedApiData) {
    const { apiName, timestamp } = JSON.parse(lastUsedApiData);

    if (timestamp + CACHE_EXPIRATION_TIME > Date.now()) {
      try {
        const api = APIs.find((api) => api.name === apiName);
        if (api) {
          const apiUrl = api.url.transaction(txHash);
          const response = await tryAPI<BtcScanTransactionResponse>(apiName, apiUrl);
          return {
            confirmed: response.data.confirmed,
            block_height: response.data.block_height,
            block_hash: response.data.block_hash,
            block_time: response.data.block_time,
          };
        }
      } catch (error) {
        console.warn(`Last used API ${apiName} failed, trying all APIs...`);
      }
    }
  }

  let lastError: Error | null = null;
  for (const api of APIs) {
    const apiUrl = api.url.transaction(txHash);
    try {
      let response: BitcoinTransactionStatus;
      switch (api.name) {
        case 'btcscan': {
          const apiResponse = await tryAPI<BtcScanTransactionResponse>(api.name, apiUrl);
          response = {
            confirmed: apiResponse.data.confirmed,
            block_height: apiResponse.data.block_height,
            block_hash: apiResponse.data.block_hash,
            block_time: apiResponse.data.block_time,
          };
          break;
        }
        case 'blockchain.info': {
          const apiResponse = await tryAPI<BlockchainInfoTransactionResponse>(api.name, apiUrl);
          response = {
            confirmed: apiResponse.data.block?.height !== undefined,
            block_height: apiResponse.data.block?.height ?? 0,
            block_hash: 'unknown',
            block_time: apiResponse.data.time * 1000,
          };
          break;
        }
        case 'blockcypher': {
          const apiResponse = await tryAPI<BlockcypherTransactionResponse>(api.name, apiUrl);
          response = {
            confirmed: apiResponse.data.confirmations > 0,
            block_height: apiResponse.data.block_height,
            block_hash: apiResponse.data.block_hash,
            block_time: new Date(apiResponse.data.received).getTime(),
          };
          break;
        }
      }

      localStorage.setItem(
        'lastUsedApi-bitcoin',
        JSON.stringify({
          apiName: api.name,
          timestamp: Date.now(),
        }),
      );

      return response;
    } catch (error) {
      lastError = error as Error;
      continue;
    }
  }

  throw new Error(`All APIs failed to fetch transaction status for ${txHash}. Last error: ${lastError?.message}`);
};
