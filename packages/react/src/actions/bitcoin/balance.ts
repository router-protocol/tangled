import {
  ApiConfig,
  ApiResponse,
  BlockchainInfoResponse,
  BlockcypherResponse,
  BtcScanResponse,
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

const tryAPI = async <T>(name: ApiConfig['name'], url: string): Promise<ApiResponse> => {
  try {
    const data = await fetchWithRetry<T>(url);
    return { source: name, data } as ApiResponse;
  } catch (error) {
    console.warn(`Failed to fetch from ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

export const getBalance = async (address: string): Promise<ApiResponse> => {
  const cachedBalance = getFromLocalStorage<ApiResponse>(`balance-${address}`);
  if (cachedBalance && cachedBalance.timestamp + CACHE_EXPIRATION_TIME > Date.now()) {
    return cachedBalance.data;
  }

  let lastError: Error | null = null;
  for (const api of APIs) {
    try {
      let response: ApiResponse;
      switch (api.name) {
        case 'btcscan':
          response = await tryAPI<BtcScanResponse>(api.name, api.url(address));
          break;
        case 'blockchain.info':
          response = await tryAPI<BlockchainInfoResponse>(api.name, api.url(address));
          break;
        case 'blockcypher':
          response = await tryAPI<BlockcypherResponse>(api.name, api.url(address));
          break;
      }
      setInLocalStorage<ApiResponse>(`balance-${address}`, {
        data: response,
        timestamp: Date.now(),
      });
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
      const confirmedBalance = response.data.chain_stats.funded_txo_sum - response.data.chain_stats.spent_txo_sum;
      const unconfirmedBalance = response.data.mempool_stats.funded_txo_sum - response.data.mempool_stats.spent_txo_sum;
      return confirmedBalance + unconfirmedBalance;
    }

    case 'blockchain.info': {
      return response.data.confirmed + response.data.unconfirmed;
    }

    case 'blockcypher': {
      return response.data.balance + response.data.unconfirmed_balance;
    }
  }
};
