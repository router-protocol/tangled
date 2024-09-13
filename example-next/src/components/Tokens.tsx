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
    address: ETH_ADDRESS,
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
    chainId: '1',
  },
  {
    address: ETH_ADDRESS,
    decimals: 18,
    name: 'Polygon MATIC',
    symbol: 'MATIC',
    chainId: '137',
  },
  {
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
    chainId: '42161',
  },
  {
    address: SOL_ADDRESS,
    decimals: 9,
    name: 'Solana SOL',
    symbol: 'SOL',
    chainId: 'solana',
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
    chainId: 'solana',
  },
  {
    address: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    name: 'Wrapped SOL',
    symbol: 'WSOL',
    chainId: 'solana',
  },
  {
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
    name: 'USDT',
    symbol: 'USDT',
    chainId: 'solana',
  },
  {
    address: ETH_ADDRESS,
    decimals: 6,
    name: 'Tron TRX',
    symbol: 'TRX',
    chainId: 'tronMainnet',
  },
  {
    address: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8',
    decimals: 6,
    name: 'Tron USDC',
    symbol: 'USDC',
    chainId: 'tronMainnet',
  },
  {
    address: ETH_ADDRESS,
    decimals: 12,
    name: 'Aleph Zero AZERO',
    symbol: 'AZERO',
    chainId: 'alephZero',
  },
  {
    address: '5FYFojNCJVFR2bBNKfAePZCa72ZcVX5yeTv8K9bzeUo8D83Z',
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
    chainId: 'alephZero',
  },
  {
    address: '5CMdxZDuprVZKnw6tEWjhEtK17Z52PUJo2dj1JLdyKeuUcfH',
    decimals: 6,
    name: 'USDT',
    symbol: 'USDT',
    chainId: 'alephZero',
  },
];

export default Tokens;
