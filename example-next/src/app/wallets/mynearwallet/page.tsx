'use client';

import { useConnect, useWallets } from '@noble-assets/tangled-react';
import { useEffect } from 'react';

export default function NearPage() {
  const { connect, isLoading, error } = useConnect();
  const wallets = useWallets();

  const getNearContractId = (chainType: unknown) => {
    // TODO: add contractId for both 'testnet' & 'mainnet'
    if (chainType === 'near') {
      return 'usdt.tether-token.near'; // For testnet: 'routetoken.i-swap.testnet'
    }
  };

  useEffect(() => {
    if (wallets.near.length > 0) {
      connect(
        { walletId: 'my-near-wallet', chainType: 'near', nearContractId: getNearContractId('near') },
        {
          onSuccess: () => {
            window.location.href = '/';
          },
          onError: (err) => {
            console.error('Failed to connect:', err);
          },
        },
      );
    }
  }, [wallets]);

  if (isLoading) {
    return <div>Connecting to wallet...</div>;
  }

  if (error) {
    return <div>Error connecting to wallet: {error.message}</div>;
  }

  return (
    <div>
      <h1 className='text-lg font-semibold'>Oh, I see you're trying to connect to My Near Wallet.</h1>
      <h2 className='text-center text-neutral-300 mt-2'>Please wait...</h2>
    </div>
  );
}
