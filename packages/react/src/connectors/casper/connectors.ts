import { Wallet } from '../../types/wallet.js';

export const casperWallet: Wallet<'casper'> = {
  id: 'casper-wallet',
  name: 'Caspser Wallet',
  icon: 'https://pbs.twimg.com/profile_images/1670917562216124417/kAM83Poh_400x400.jpg',
  type: 'casper',
  url: 'https://www.casperwallet.io',
};

export const getCasperWallet = () => {
  if (typeof window.CasperWalletProvider === 'function') {
    return window.CasperWalletProvider();
  } else {
    console.error('[CASPER] Please install the Casper Wallet extension.');
  }
};

export const isCasperWalletInstalled = (): boolean => {
  return typeof window.CasperWalletProvider === 'function';
};
