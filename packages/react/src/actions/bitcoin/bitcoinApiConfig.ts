import { ApiConfig, ApiResponse } from '../../types/bitcoin.js';

export const APIs: ApiConfig[] = [
  {
    name: 'btcscan',
    url: {
      balance: (address: string) => `https://btcscan.org/api/address/${address}`,
      transaction: (txHash: string) => `https://btcscan.org/api//tx/${txHash}/status`,
    },
  },
  {
    name: 'blockchain.info',
    url: {
      balance: (address: string) => `https://api.blockchain.info/haskoin-store/btc/address/${address}/balance`,
      transaction: (txHash: string) => `https://api.blockchain.info/haskoin-store/btc/transaction/${txHash}`,
    },
  },
  {
    name: 'blockcypher',
    url: {
      balance: (address: string) => `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`,
      transaction: (txHash: string) => `https://api.blockcypher.com/v1/btc/main/txs/${txHash}`,
    },
  },
];

export const CACHE_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes
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
