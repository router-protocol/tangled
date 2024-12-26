import { ETH_ADDRESS, SOL_ADDRESS, TokenMetadata, useChain, useToken } from '@tangled3/react';

export const Tokens = () => {
  return (
    <div className='bg-neutral-900'>
      <h3 className='text-lg font-bold'>Onchain Token Fetching</h3>
      <table className='w-full'>
        <thead>
          <tr className='bg-gray-900'>
            <th className='text-left w-[5ch] px-4 py-2'>Address</th>
            <th className='text-left w-[10ch] px-4 py-2'>Chain</th>
            <th className='text-left w-[10ch] px-4 py-2'>Chain Type</th>
            <th className='text-left w-[10ch] px-4 py-2'>Name</th>
            <th className='text-left w-[10ch] px-4 py-2'>Symbol</th>
            <th className='text-left w-[10ch] px-4 py-2'>Decimals</th>
            <th className='text-left w-[10ch] px-4 py-2'>Status</th>
            <th className='text-left w-[10ch] px-4 py-2'>DATA OK</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <Token
              key={`${token.chainId}-${token.address}`}
              {...token}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// fetch token data and display and check the data side by side with given data
export const Token = (token: TokenMetadata) => {
  const {
    data: fetchedToken,
    error,
    isLoading,
  } = useToken({
    chainId: token.chainId,
    token: token.address,
  });
  const chain = useChain(token.chainId);
  const dataOK = fetchedToken?.symbol === token.symbol && fetchedToken.decimals === token.decimals;
  return (
    <tr className='border-b border-gray-700'>
      <td className='px-4 py-2 max-w-[10ch] overflow-hidden text-ellipsis'>{token.address}</td>
      <td className='px-4 py-2'>{chain?.name}</td>
      <td className='px-4 py-2'>{chain?.type}</td>
      <td className='px-4 py-2'>{fetchedToken?.name}</td>
      <td className='px-4 py-2'>{fetchedToken?.symbol}</td>
      <td className='px-4 py-2'>{fetchedToken?.decimals}</td>
      <td className='px-4 py-2'>{isLoading ? 'Loading...' : error ? error.message : 'Fetched'}</td>
      <td className='px-4 py-2'>{isLoading ? '' : dataOK && !error ? '✅' : '❌'}</td>
    </tr>
  );
};

const tokens: TokenMetadata[] = [
  {
    address: 'uosmo',
    decimals: 6,
    name: 'OSMO',
    symbol: 'OSMO',
    chainId: 'osmosis-1',
    isNative: true,
  },
  {
    address: ETH_ADDRESS,
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
    chainId: '1',
    isNative: true,
  },
  {
    address: '',
    decimals: 18,
    name: 'Polygon MATIC',
    symbol: 'MATIC',
    chainId: '137',
    isNative: true,
  },
  {
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
    chainId: '42161',
    isNative: false,
  },
  {
    address: SOL_ADDRESS,
    decimals: 9,
    name: 'Solana SOL',
    symbol: 'SOL',
    chainId: 'solana',
    isNative: true,
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
    chainId: 'solana',
    isNative: false,
  },
  {
    address: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    name: 'Wrapped SOL',
    symbol: 'WSOL',
    chainId: 'solana',
    isNative: false,
  },
  {
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
    name: 'USDT',
    symbol: 'USDT',
    chainId: 'solana',
    isNative: false,
  },
  {
    address: ETH_ADDRESS,
    decimals: 6,
    name: 'Tron TRX',
    symbol: 'TRX',
    chainId: '728126428',
    isNative: true,
  },
  {
    address: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8',
    decimals: 6,
    name: 'Tron USDC',
    symbol: 'USDC',
    chainId: '728126428',
    isNative: false,
  },
  {
    address: ETH_ADDRESS,
    decimals: 9,
    name: 'Toncoin',
    symbol: 'TON',
    chainId: '-239',
    isNative: true,
  },
  {
    address: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
    decimals: 6,
    name: 'Tether USD',
    symbol: 'USDT',
    chainId: '-239',
    isNative: false,
  },
  {
    address: ETH_ADDRESS,
    decimals: 8,
    name: 'Bitcoin',
    symbol: 'BTC',
    chainId: 'bitcoin',
    isNative: true,
  },

  {
    address: '0x2::sui::SUI',
    decimals: 9,
    name: 'Sui Token',
    symbol: 'SUI',
    chainId: 'sui',
    isNative: true,
  },
  {
    address: '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
    decimals: 6,
    name: 'Tether USD',
    symbol: 'USDT',
    chainId: 'sui',
    isNative: false,
  },
  {
    address: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
    chainId: 'sui',
    isNative: false,
  },
];

export default Tokens;
