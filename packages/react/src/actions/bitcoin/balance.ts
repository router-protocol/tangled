import {
  ApiConfig,
  ApiResponse,
  BalanceApiResponse,
  BlockchainInfoBalanceResponse,
  BlockcypherBalanceResponse,
  BtcScanBalanceResponse,
  CachedBalanceData,
} from '../../types/bitcoin.js';
import { getFromLocalStorage, setInLocalStorage } from '../../utils/index.js';
import { APIs } from './bitcoinApiConfig.js';

const CACHE_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes
const REQUEST_TIMEOUT = 5000; // 5 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

class FetchError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly statusText?: string,
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

const fetchWithTimeout = async (url: string, timeout: number): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const fetchWithRetry = async <T>(
  url: string,
  attempt: number = 0,
  retryDelay: number = RETRY_DELAY,
  maxRetries: number = MAX_RETRIES,
  requestTimeout: number = REQUEST_TIMEOUT,
): Promise<T> => {
  try {
    const response = await fetchWithTimeout(url, requestTimeout);

    if (!response.ok) {
      // Avoiding retries on client errors except rate limits
      if (response.status !== 429 && response.status < 500) {
        throw new FetchError(`HTTP error! status: ${response.status}`, response.status, response.statusText);
      }
      throw new FetchError(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (attempt >= maxRetries) throw error;

    // If server error, retry
    if (error instanceof FetchError && error.status && error.status < 500 && error.status !== 429) {
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
    return fetchWithRetry<T>(url, attempt + 1, retryDelay, maxRetries, requestTimeout);
  }
};

export const tryAPI = async <T>(name: ApiConfig['name'], url: string): Promise<ApiResponse<T>> => {
  try {
    const data = await fetchWithRetry<T>(url);
    return { source: name, data };
  } catch (error) {
    console.warn(`Failed to fetch from ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

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
