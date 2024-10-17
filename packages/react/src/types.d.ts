import { XfiBitcoinConnector } from './types/bitcoin.ts';

export declare global {
  interface Window {
    xfi?: {
      bitcoin: XfiBitcoinConnector;
      ethereum: any;
    };
  }
}
