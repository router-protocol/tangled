import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { ChainData } from '../types/index.js';

/**
 * @notice This provider is used to connect to the Sui Zero using Nightly Connector.
 * @param adapters - Supported wallet adapters for the Sui Zero.
 * @returns The Sui Zero provider context with the connect and disconnect functions.
 */
export const SuiProvider = ({ children, chains }: { children: React.ReactNode; chains: ChainData<'sui'>[] }) => {
  const { networkConfig } = createNetworkConfig({
    suiNetwork: { url: getFullnodeUrl(chains[0].name.split('-')[1] as 'mainnet' | 'testnet') },
  });

  return (
    <SuiClientProvider
      networks={networkConfig}
      network='suiNetwork'
    >
      <WalletProvider autoConnect>{children}</WalletProvider>
    </SuiClientProvider>
  );
};
