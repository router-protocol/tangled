import {
  BalanceApiResponse,
  BlockchainInfoBalanceResponse,
  BlockcypherBalanceResponse,
  BtcScanBalanceResponse,
} from '../../types/bitcoin.js';
import { APIs, CACHE_EXPIRATION_TIME, tryAPI } from './bitcoinApiConfig.js';

export const getBalance = async (address: string): Promise<BalanceApiResponse> => {
  const lastUsedApiData = localStorage.getItem('lastUsedApi-bitcoin');
  if (lastUsedApiData) {
    const { apiName, apiUrl, timestamp } = JSON.parse(lastUsedApiData);

    if (timestamp + CACHE_EXPIRATION_TIME > Date.now()) {
      try {
        let response: BalanceApiResponse;
        switch (apiName) {
          case 'btcscan': {
            const apiResponse = await tryAPI<BtcScanBalanceResponse>(apiName, apiUrl);
            response = { source: 'btcscan', data: apiResponse.data };
            break;
          }
          case 'blockchain.info': {
            const apiResponse = await tryAPI<BlockchainInfoBalanceResponse>(apiName, apiUrl);
            response = { source: 'blockchain.info', data: apiResponse.data };
            break;
          }
          case 'blockcypher': {
            const apiResponse = await tryAPI<BlockcypherBalanceResponse>(apiName, apiUrl);
            response = { source: 'blockcypher', data: apiResponse.data };
            break;
          }
          default: {
            throw new Error(`Unknown API: ${apiName}`);
          }
        }
        return response;
      } catch (error) {
        console.warn(`Last used API ${apiName} failed, trying all APIs...`);
      }
    }
  }

  let lastError: Error | null = null;
  for (const api of APIs) {
    const apiUrl = api.url.balance(address);
    try {
      let response: BalanceApiResponse;
      switch (api.name) {
        case 'btcscan': {
          const apiResponse = await tryAPI<BtcScanBalanceResponse>(api.name, apiUrl);
          response = { source: 'btcscan', data: apiResponse.data };
          break;
        }
        case 'blockchain.info': {
          const apiResponse = await tryAPI<BlockchainInfoBalanceResponse>(api.name, apiUrl);
          response = { source: 'blockchain.info', data: apiResponse.data };
          break;
        }
        case 'blockcypher': {
          const apiResponse = await tryAPI<BlockcypherBalanceResponse>(api.name, apiUrl);
          response = { source: 'blockcypher', data: apiResponse.data };
          break;
        }
      }

      localStorage.setItem(
        'lastUsedApi-bitcoin',
        JSON.stringify({
          apiName: api.name,
          apiUrl,
          timestamp: Date.now(),
        }),
      );

      return response;
    } catch (error) {
      lastError = error as Error;
      continue;
    }
  }

  throw new Error(`All APIs failed to fetch balance. Last error: ${lastError?.message}`);
};

export const getFormattedBalance = async (address: string): Promise<number> => {
  const response = await getBalance(address);

  switch (response.source) {
    case 'btcscan': {
      const data = response.data as BtcScanBalanceResponse;
      const confirmedBalance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
      const unconfirmedBalance = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
      return confirmedBalance + unconfirmedBalance;
    }

    case 'blockchain.info': {
      const data = response.data as BlockchainInfoBalanceResponse;
      return data.confirmed + data.unconfirmed;
    }

    case 'blockcypher': {
      const data = response.data as BlockcypherBalanceResponse;
      return data.balance + data.unconfirmed_balance;
    }
  }
};
