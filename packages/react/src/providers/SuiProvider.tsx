import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { useMemo } from 'react';
import { ChainData } from '../types/index.js';

/**
 * @notice This provider is used to connect to the Sui Zero using Nightly Connector.
 * @param adapters - Supported wallet adapters for the Sui Zero.
 * @returns The Sui Zero provider context with the connect and disconnect functions.
 */
export const SuiProvider = ({ children, chains }: { children: React.ReactNode; chains: ChainData<'sui'>[] }) => {
  const { networkConfig } = useMemo(() => {
    const config = chains.reduce(
      (acc, chain) => {
        const networkType = chain.name.split('-')[1] as 'mainnet' | 'testnet';
        acc[chain.name] = { url: getFullnodeUrl(networkType) };
        return acc;
      },
      {} as Record<string, { url: string }>,
    );

    return createNetworkConfig(config);
  }, [chains]);

  return (
    <SuiClientProvider
      networks={networkConfig}
      defaultNetwork={chains[0].name}
    >
      <WalletProvider autoConnect>{children}</WalletProvider>
    </SuiClientProvider>
  );
};
