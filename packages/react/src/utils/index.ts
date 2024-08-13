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
