import { Asset } from '../types/cosmos.js';
import { ChainId } from '../types/index.js';

export const overrideMap: Record<string, ChainId> = {
  injectivetestnet: 'injective-888',
  // more mappings here as needed
};

const specialAssetOverrides: {
  [chainId: string]: { [token: string]: Asset };
} = {
  'router_9600-1': {
    'ibc/B9E4FD154C92D3A23BEA029906C4C5FF2FE74CB7E3A058290B77197A263CF88B': {
      description:
        'USDC is a fully collateralized US Dollar stablecoin developed by CENTRE, the open source project with Circle being the first of several forthcoming issuers.',
      denom_units: [
        {
          denom: 'ibc/B9E4FD154C92D3A23BEA029906C4C5FF2FE74CB7E3A058290B77197A263CF88B',
          exponent: 0,
          aliases: ['microusdc', 'uusdc'],
        },
        {
          denom: 'usdc',
          exponent: 6,
        },
      ],
      type_asset: 'ics20',
      base: 'ibc/B9E4FD154C92D3A23BEA029906C4C5FF2FE74CB7E3A058290B77197A263CF88B',
      name: 'USDC',
      display: 'usdc',
      symbol: 'USDC',
      traces: [
        {
          type: 'synthetic',
          counterparty: {
            chain_name: 'forex',
            base_denom: 'USD',
          },
          provider: 'Circle',
        },
        {
          type: 'additional-mintage',
          counterparty: {
            chain_name: 'ethereum',
            base_denom: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          },
          provider: 'Circle',
        },
        {
          type: 'ibc',
          counterparty: {
            chain_name: 'noble',
            base_denom: 'uusdc',
            channel_id: 'channel-119',
          },
          chain: {
            channel_id: 'channel-13',
            path: 'transfer/channel-13/uusdc',
          },
        },
      ],
      logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdc.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdc.svg',
      },
    },
  },
  'injective-888': {
    'factory/inj17vytdwqczqz72j65saukplrktd4gyfme5agf6c/usdc': {
      description: 'USDC is a USD-pegged stablecoin available on the Injective testnet.',
      denom_units: [
        {
          denom: 'factory/inj17vytdwqczqz72j65saukplrktd4gyfme5agf6c/usdc',
          exponent: 0,
        },
        {
          denom: 'USDC',
          exponent: 6,
        },
      ],
      base: 'factory/inj17vytdwqczqz72j65saukplrktd4gyfme5agf6c/usdc',
      name: 'USD Coin',
      display: 'USDC',
      symbol: 'USDC',
      logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdc.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdc.svg',
      },
      coingecko_id: 'usd-coin',
      images: [
        {
          png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdc.png',
          svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdc.svg',
        },
      ],
      type_asset: 'sdk.coin',
    },
    'ibc/2CD6478D5AFA173C86448E008B760934166AED04C3968874EA6E44D2ECEA236D': {
      description: 'OSMO is the native token of the Osmosis blockchain, bridged over to the Injective testnet.',
      denom_units: [
        {
          denom: 'ibc/2CD6478D5AFA173C86448E008B760934166AED04C3968874EA6E44D2ECEA236D',
          exponent: 0,
        },
        {
          denom: 'UOSMO',
          exponent: 6,
        },
      ],
      base: 'ibc/2CD6478D5AFA173C86448E008B760934166AED04C3968874EA6E44D2ECEA236D',
      name: 'Osmosis',
      display: 'UOSMO',
      symbol: 'UOSMO',
      logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png',
      },
      coingecko_id: 'osmosis',
      images: [
        {
          png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png',
        },
      ],
      type_asset: 'ics20',
    },
    peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5: {
      description: 'USDT is a USD-pegged stablecoin available on the Injective testnet.',
      denom_units: [
        {
          denom: 'peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5',
          exponent: 0,
        },
        {
          denom: 'USDT',
          exponent: 6,
        },
      ],
      base: 'peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5',
      name: 'Tether',
      display: 'USDT',
      symbol: 'USDT',
      logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdt.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdt.svg',
      },
      coingecko_id: 'tether',
      images: [
        {
          png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdt.png',
          svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdt.svg',
        },
      ],
      type_asset: 'sdk.coin',
    },
  },
};

export const getAssetsToOverride = (chainId: ChainId) => {
  const overriddenAssets = specialAssetOverrides[chainId];
  const moreAssets = Object.entries(overriddenAssets).map(([, value]) => value);
  return moreAssets;
};
