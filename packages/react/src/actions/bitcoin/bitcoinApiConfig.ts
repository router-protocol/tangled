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
