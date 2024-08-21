import { detect } from 'detect-browser';

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
 * This function is used to compare two tokens. Not case sensitive.
 * @param tokenA - The first token to compare.
 * @param tokenB - The second token to compare.
 * @returns True if the tokens are equal, false otherwise.
 */
export const areTokensEqual = (tokenA: string | undefined, tokenB: string | undefined) => {
  if (!tokenA || !tokenB) return false;
  if (tokenA.length !== tokenB.length) return false;

  return tokenA.toLowerCase() === tokenB.toLowerCase();
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
  fn: (...args: TArgs) => T | undefined,
  options: { interval: number; timeout?: number },
  ...args: TArgs
): Promise<T> => {
  if (!options.interval) {
    throw new Error('Interval is required');
  }

  return new Promise((resolve, reject) => {
    const start = Date.now();
    let result = fn(...args);
    let intervalId: number;

    if (result) {
      resolve(result);
    }

    // eslint-disable-next-line prefer-const
    intervalId = window.setInterval(() => {
      try {
        result = fn(...args);

        // Resolve and clear the interval if result is valid
        if (result) {
          clearInterval(intervalId);
          resolve(result);
        }
        // Reject and clear the interval if timeout occurs
        if (options.timeout && Date.now() - start > options.timeout) {
          clearInterval(intervalId);
          reject('TimedOut');
        }
      } catch (e) {
        clearInterval(intervalId);
        reject(e);
      }
    }, options.interval);
  });
};
