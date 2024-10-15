import {
  BitcoinBalanceResponse,
  BlockstreamGasFeeResponse,
  MempoolSpaceBitcoinGasFeeResponse,
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

export async function signBitcoinTx({
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
  const fetchedFeeRate =
    (await getBitcoinGasFee(getBitcoinApiConfig(chain.id !== 'bitcoin', 'blockstream'))) ||
    (await getBitcoinGasFee(getBitcoinApiConfig(chain.id !== 'bitcoin', 'mempool')));

  return new Promise((resolve, reject) => {
    config.bitcoinProvider.request(
      {
        method: 'transfer',
        params: [
          {
            feeRate: feeRate ?? fetchedFeeRate,
            from,
            recipient,
            amount: {
              amount,
              decimals: 8,
            },
            memo: `hex::${removeHexPrefix(memo)}`,
          },
        ],
      },
      async (error: unknown, result: string | string[]) => {
        if (error) {
          reject(error);
        }
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('[BITCOIN] Transfer request:: Expected a string result'));
        }
      },
    );
  });
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
