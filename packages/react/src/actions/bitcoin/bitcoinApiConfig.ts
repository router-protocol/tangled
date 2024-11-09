import { ApiConfig } from '../../types/bitcoin.js';

export const APIs: ApiConfig[] = [
  {
    name: 'btcscan',
    url: {
      balance: (address: string) => `https://btcscan.org/api/address/${address}`,
      transaction: (txHash: string) => `https://btcscan.org/api//tx/${txHash}/status`,
    },
  },
  {
    name: 'blockchain.info',
    url: {
      balance: (address: string) => `https://api.blockchain.info/haskoin-store/btc/address/${address}/balance`,
      transaction: (txHash: string) => `https://api.blockchain.info/haskoin-store/btc/transaction/${txHash}`,
    },
  },
  {
    name: 'blockcypher',
    url: {
      balance: (address: string) => `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`,
      transaction: (txHash: string) => `https://api.blockcypher.com/v1/btc/main/txs/${txHash}`,
    },
  },
];
