import { detect } from 'detect-browser';
import { FetchError, MAX_RETRIES, REQUEST_TIMEOUT, RETRY_DELAY } from '../actions/bitcoin/bitcoinApiConfig.js';
import { ApiConfig as BitcoinApiConfig, ApiResponse as BitcoinApiResponse } from '../types/bitcoin.js';
import { ChainData } from '../types/index.js';

/**
 * This is a workaround for the issue with BigInt serialization in JSON.stringify
 */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const detectBrowser = () => {
  const browser = detect();
  return browser?.name ?? '';
};
export const detectOS = () => {
  const browser = detect();
  return browser?.os ?? '';
};

export const isIOS = () => {
  const os = detectOS();
  return os.toLowerCase().includes('ios');
};
export const isAndroid = () => {
  const os = detectOS();
  return os.toLowerCase().includes('android');
};
export const isMobile = () => {
  return isAndroid() || isIOS();
};

/**
 * Returns true if the two tokens are equal.
 * @param tokenA The first token.
 * @param tokenB The second token.
 * @returns True if the two tokens are equal.
 */
export const areTokensEqual = (tokenA: string | undefined, tokenB: string | undefined): boolean => {
  // Early return if either token is undefined
  if (!tokenA || !tokenB) return false;

  // Early return if lengths are different
  if (tokenA.length !== tokenB.length) return false;

  // Case-insensitive comparison without creating new strings
  for (let i = 0; i < tokenA.length; i++) {
    const charA = tokenA.charAt(i).toLowerCase();
    const charB = tokenB.charAt(i).toLowerCase();

    if (charA !== charB) return false;
  }

  return true;
};

/**
 * Generic polling function for any callback.
 * Stops polling when the callback returns a valid result.
 * If timeout is provided, rejects with 'Timeout' after timeout.
 * In case of an error, rejects with the error.
 *
 * @param fn - Callback function
 * @param args - Arguments for callback
 * @param interval - Polling interval
 * @param timeout - Timeout
 * @returns Promise of callback result, never undefined if resolved
 */
export const pollCallback = async <T, TArgs extends any[]>(
  fn: (...args: TArgs) => Promise<T | undefined>,
  options: { interval: number; timeout?: number },
  ...args: TArgs
): Promise<T> => {
  if (!options.interval) {
    throw new Error('Interval is required');
  }

  const start = Date.now();

  let result: T | undefined;

  // eslint-disable-next-line no-constant-condition
  while (!result) {
    result = await fn(...args);

    await new Promise((resolve) => setTimeout(resolve, options.interval));

    if (options.timeout && Date.now() - start > options.timeout) {
      throw new Error('Timeout');
    }
  }

  return result;
};

/**
 * Removes the '0x' prefix from a hexadecimal string if present.
 * @param hexString - The hexadecimal string to process
 * @returns The hexadecimal string without the '0x' prefix
 */
export function removeHexPrefix(hexString: string) {
  if (hexString.startsWith('0x')) {
    return hexString.slice(2);
  }
  return hexString;
}

/**
 * Formats a cosmos token address based on its prefix
 * @param token - The token address to format
 * @returns Formatted token address
 */
export function formatTokenAddress(token: string): string {
  if (!token.toLowerCase().startsWith('ibc')) return token;

  const prefix = token.substring(0, 3);
  const remainder = token.substring(3).toUpperCase();
  return `${prefix}${remainder}`;
}

/**
 * Checks if a cosmos token is a native or factory token
 * @param token - The token address to check
 * @returns Boolean indicating if token is native/factory
 */
export function isNativeOrFactoryToken(token: string, chainData: ChainData): boolean {
  token = token.toLowerCase();
  return chainData.extra?.nativeAddress === token || token.startsWith('ibc') || token.startsWith('factory');
}

/**
 * Fetches data from a given URL using the specified API name.
 * @param name - The name of the Bitcoin API.
 * @param url - The URL to fetch data from.
 * @returns A promise that resolves to a BitcoinApiResponse containing the fetched data.
 */
export const tryAPI = async <T>(name: BitcoinApiConfig['name'], url: string): Promise<BitcoinApiResponse<T>> => {
  try {
    const data = await fetchWithRetry<T>(url);
    return { source: name, data };
  } catch (error) {
    console.warn(`Failed to fetch from ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

/**
 * Fetches data from a URL with retry logic.
 * Retries the request if it fails due to server errors, with exponential delay.
 * @param url - The URL to fetch data from.
 * @param attempt - The current attempt number (default is 0).
 * @param retryDelay - The delay between retries (default is RETRY_DELAY).
 * @param maxRetries - The maximum number of retry attempts (default is MAX_RETRIES).
 * @param requestTimeout - The timeout for the request (default is REQUEST_TIMEOUT).
 * @returns A promise that resolves to the fetched data.
 */
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

/**
 * Fetches a resource from a URL with a specified timeout.
 * If the request takes longer than the timeout, it will be aborted.
 * @param url - The URL to fetch data from.
 * @param timeout - The timeout duration in milliseconds.
 * @returns A promise that resolves to the Response object.
 */
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
