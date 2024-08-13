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

export const areTokensEqual = (tokenA: string | undefined, tokenB: string | undefined) => {
  if (!tokenA || !tokenB) return false;
  if (tokenA.length !== tokenB.length) return false;

  for (let i = 0; i < tokenA.length; i++) {
    if (tokenA.charCodeAt(i) !== tokenB.charCodeAt(i)) {
      return false;
    }
  }
  return true;
};
