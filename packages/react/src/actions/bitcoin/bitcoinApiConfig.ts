import { ApiConfig } from '../../types/bitcoin.js';

export const APIs: Record<string, ApiConfig> = {
  btcscan: {
    name: 'btcscan',
    url: {
      balance: (address: string) => `https://btcscan.org/api/address/${address}`,
      transaction: (txHash: string) => `https://btcscan.org/api/tx/${txHash}/status`,
    },
  },
  blockchain: {
    name: 'blockchain.info',
    url: {
      balance: (address: string) => `https://api.blockchain.info/haskoin-store/btc/address/${address}/balance`,
      transaction: (txHash: string) => `https://api.blockchain.info/haskoin-store/btc/transaction/${txHash}`,
    },
  },
  blockcypher: {
    name: 'blockcypher',
    url: {
      balance: (address: string) => `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`,
      transaction: (txHash: string) => `https://api.blockcypher.com/v1/btc/main/txs/${txHash}`,
    },
  },
};

export const CACHE_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes
export const REQUEST_TIMEOUT = 5000; // 5 seconds
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000;

export class FetchError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly statusText?: string,
  ) {
    super(message);
    this.name = 'FetchError';
  }
}
