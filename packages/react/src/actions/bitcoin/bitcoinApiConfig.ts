import { ApiConfig } from '../../types/bitcoin.js';

export interface BitcoinApiConfig {
  mainnet: string;
  testnet: string;
  name: string;
}

export const bitcoinApiConfig: Record<string, BitcoinApiConfig> = {
  blockstream: {
    mainnet: 'https://blockstream.info',
    testnet: 'https://blockstream.info/testnet',
    name: 'blockstream',
  },
  mempool: {
    mainnet: 'https://mempool.space',
    testnet: 'https://mempool.space/testnet',
    name: 'mempool',
  },
};

export interface BitcoinApiConfigResult {
  baseUrl: string;
  name: string;
}

export function getBitcoinApiConfig(isTestnet: boolean, apiName: string = 'blockstream'): BitcoinApiConfigResult {
  const config = bitcoinApiConfig[apiName] || bitcoinApiConfig.blockstream;
  return {
    baseUrl: isTestnet ? config.testnet : config.mainnet,
    name: config.name,
  };
}

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
