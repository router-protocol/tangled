import {
  BalanceApiResponse,
  BlockchainInfoBalanceResponse,
  BlockcypherBalanceResponse,
  BtcScanBalanceResponse,
  CachedBalanceData,
} from '../../types/bitcoin.js';
import { getFromLocalStorage, setInLocalStorage } from '../../utils/index.js';
import { APIs, CACHE_EXPIRATION_TIME, tryAPI } from './bitcoinApiConfig.js';

export const getBalance = async (address: string): Promise<BalanceApiResponse> => {
  const cachedBalance = getFromLocalStorage<CachedBalanceData>(`balance-${address}`);
  if (cachedBalance && cachedBalance.timestamp + CACHE_EXPIRATION_TIME > Date.now()) {
    return cachedBalance.data;
  }

  let lastError: Error | null = null;
  for (const api of APIs) {
    try {
      let response: BalanceApiResponse;
      switch (api.name) {
        case 'btcscan': {
          const apiResponse = await tryAPI<BtcScanBalanceResponse>(api.name, api.url.balance(address));
          response = { source: 'btcscan', data: apiResponse.data };
          break;
        }
        case 'blockchain.info': {
          const apiResponse = await tryAPI<BlockchainInfoBalanceResponse>(api.name, api.url.balance(address));
          response = { source: 'blockchain.info', data: apiResponse.data };
          break;
        }
        case 'blockcypher': {
          const apiResponse = await tryAPI<BlockcypherBalanceResponse>(api.name, api.url.balance(address));
          response = { source: 'blockcypher', data: apiResponse.data };
          break;
        }
      }

      const cacheData: CachedBalanceData = {
        data: response,
        timestamp: Date.now(),
      };

      setInLocalStorage(`balance-${address}`, cacheData);
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
