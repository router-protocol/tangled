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
