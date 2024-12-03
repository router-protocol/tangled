import { XfiBitcoinConnector } from '../../types/bitcoin.js';
import { ChainId } from '../../types/index.js';
import { Wallet } from '../../types/wallet.js';

export const BITCOIN_CHAIN_CONFIG: Record<string, ChainId> = {
  'Bitcoin_bitcoin-testnet': 'bitcoin-testnet',
  'Bitcoin_bitcoin-mainnet': 'bitcoin',
};

export const ctrlWallet: Wallet<'bitcoin'> = {
  id: 'io.xdefi',
  name: 'Ctrl Wallet',
  icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8yMTkxXzQyOTApIj4KPHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHJ4PSIxMDQiIGZpbGw9IiMzMzVERTUiLz4KPHBhdGggZD0iTTQ2My40MzggMjQxLjI0N0M0NjAuNzY1IDIwNS4xMzUgNDQ4LjU4IDE3MC4zMzggNDI4LjA4NyAxNDAuMjcxQzQwNy41OTkgMTEwLjIwOSAzNzkuNTA5IDg1LjkxODIgMzQ2LjU3OSA2OS43OTZDMzEzLjY1MyA1My42NzggMjc3LjAzMiA0Ni4yODA0IDI0MC4zMiA0OC4zMzYzQzIwMy42MDUgNTAuMzkyMSAxNjguMDY5IDYxLjgyNTUgMTM3LjIxMiA4MS41MjAxQzEwNi4zNTQgMTAxLjIxIDgxLjIzOTQgMTI4LjQ4IDY0LjMzODYgMTYwLjYzNkw2My41MzYgMTYyLjI1N0M1OC4xOTcxIDE3My4xMjYgNTQuNTg3OCAxODQuNzQ1IDUyLjg0MTEgMTk2LjY5N0M0Ny44NDU1IDIzMi4wMjEgNTUuNTkyIDI2My40NiA3NS44Mjc1IDI4Ny42NjdDOTcuOTU5OSAzMTQuMTM2IDEzMy45OTMgMzI5Ljg3OSAxNzcuMjE1IDMzMS45NDdDMjI5LjgzMiAzMzQuNTU1IDI4Mi4xNDggMzIwLjQzNCAzMTkuMjc1IDI5NC40NThMMzQxLjI4NyAzMDcuMzUzQzMyMC4yNTggMzI1LjI5MSAyNzEuNjM3IDM1Ny41OTQgMTkxLjExMiAzNjIuMDA5QzEwMC43MTkgMzY2LjkzIDYzLjA0MjUgMzM4LjAwMSA2Mi42OTA1IDMzNy43MDZMNTYuMzUxNyAzNDUuNDAzTDQ4IDM1NS4yNzNDNDkuNjAwOCAzNTYuNiA4NS43Mjg1IDM4NS4zMzUgMTcwLjU3NiAzODUuMzM1QzE3Ny41MiAzODUuMzM1IDE4NC44MTYgMzg1LjMzNSAxOTIuNDEyIDM4NC43NDZDMjg5Ljg3MyAzNzkuMzkxIDM0My40NzYgMzM3LjU3NSAzNjIuMjMxIDMxOS42MjlMMzgwLjY0MiAzMzAuNjM3QzM2OC4yNjEgMzQ2LjY1OCAzNTMuMDI1IDM2MC4zMzMgMzM1LjY3IDM3MC45ODJDMjc0LjUwNCA0MDkuODQ5IDE5Ni43MDggNDE0Ljg2NyAxNDIuMjQyIDQxMi4xNjJMMTQxLjA5NiA0MzQuODMxQzE1MC4yNDIgNDM1LjI3MyAxNTkuMDM1IDQzNS40NzEgMTY3LjU4IDQzNS40NzFDMzIxLjA0OCA0MzUuNDcxIDM4My4xMzIgMzY2LjcxOSA0MDAuNTM5IDM0Mi4wNjJMNDE0LjkyNSAzNTAuNDg3QzQwMS4xMzUgMzczLjYwMyAzODIuMzkzIDM5My41NjcgMzU5LjkzMSA0MDguOTM5QzMzMy4wMzQgNDI3LjM0NSAzMDEuNzM1IDQzOC41MzggMjY5LjExNCA0NDEuNDE1TDI3MS4xMTQgNDY0QzMwNy43MzkgNDYwLjc4NiAzNDIuODg4IDQ0OC4yMzYgMzczLjA4OSA0MjcuNTgxQzQwMy4yOSA0MDYuOTI2IDQyNy41MDggMzc4Ljg4MSA0NDMuMzQ5IDM0Ni4yMDdDNDU5LjE4NSAzMTMuNTI5IDQ2Ni4xMTYgMjc3LjM1OCA0NjMuNDM4IDI0MS4yNDdaTTM3NC44MSAyNDQuNzM5QzM2NC42MjYgMjQ0LjczOSAzNTYuMzY4IDIzNi42MTMgMzU2LjM2OCAyMjYuNTg2QzM1Ni4zNjggMjE2LjU2IDM2NC42MjEgMjA4LjQzMyAzNzQuODEgMjA4LjQzM0MzODQuOTkgMjA4LjQzMyAzOTMuMjQ3IDIxNi41NiAzOTMuMjQ3IDIyNi41ODZDMzkzLjI0NyAyMzYuNjEzIDM4NC45OTQgMjQ0LjczOSAzNzQuODEgMjQ0LjczOVoiIGZpbGw9IiNFQ0VDRUMiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8yMTkxXzQyOTAiPgo8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K',
  type: 'bitcoin',
  url: 'https://ctrl.xyz/',
};

export const isCtrlWalletInstalled = () => {
  if (typeof window !== 'undefined' && window.xfi?.bitcoin) {
    return !!window.xfi.bitcoin;
  }
  return false;
};

// TODO: Update the config for multiple wallets similar to evm
export const getBitcoinProvider = (): XfiBitcoinConnector | undefined => {
  if (typeof window !== 'undefined' && window.xfi?.bitcoin) {
    return window.xfi.bitcoin;
  }
};

export const connectToBitcoin = (): Promise<string[]> => {
  const btcProvider = getBitcoinProvider();

  if (!btcProvider) {
    throw new Error('[BITCOIN] provider not found');
  }

  return new Promise((resolve, reject) => {
    btcProvider.request({ method: 'request_accounts', params: [] }, (error: Error | null, accounts) => {
      if (error) {
        reject(error);
      }

      resolve(Array.isArray(accounts) ? accounts : [accounts]);
    });
  });
};

export class FallbackBitcoinProvider implements XfiBitcoinConnector {
  chainId: string = '';

  constructor(message: string = 'Bitcoin extension is not installed') {
    this.notInstalledError = new Error(message);
  }

  private notInstalledError: Error;

  async changeNetwork(): Promise<void> {
    throw this.notInstalledError;
  }

  request(
    options: {
      method: 'request_accounts' | 'transfer';
      params: unknown[];
    },
    callback: (error: Error | null, result: string | string[]) => void,
  ): void {
    callback(this.notInstalledError, []);
  }
}
