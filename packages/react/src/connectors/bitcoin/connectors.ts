import { Wallet } from '../../types/wallet.js';

export const BITCOIN_CHAIN_CONFIG: Record<string, string> = {
  'Bitcoin_bitcoin-testnet': 'bitcoin-testnet',
  'Bitcoin_bitcoin-mainnet': 'bitcoin',
};

export const ctrlWallet: Wallet<'bitcoin'> = {
  id: 'ctrl-wallet',
  name: 'Ctrl Wallet',
  icon: '',
  type: 'bitcoin',
  url: 'https://ctrl.xyz',
};

export const isCtrlWalletInstalled = () => {
  // @ts-expect-error - by default xfi doesn't exist on window  // BITCOIN TODO: fix 'xfi' type
  return !!window?.xfi?.bitcoin;
};
