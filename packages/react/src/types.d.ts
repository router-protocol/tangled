import { CasperWallet } from 'casper-js-sdk';

export declare global {
  interface Window {
    CasperWalletProvider: () => CasperWallet;
  }
}
