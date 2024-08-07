import { Adapter, WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@tangled3/solana-react';
import { useState, type FC, type PropsWithChildren } from 'react';
import { ChainData } from '../types/index.js';

/**
 * Wallets that implement either of these standards will be available automatically.
 *
 *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
 *     (https://github.com/solana-mobile/mobile-wallet-adapter)
 *   - Solana Wallet Standard
 *     (https://github.com/solana-labs/wallet-standard)
 *
 * If you wish to support a wallet that supports neither of those standards,
 * instantiate its legacy wallet adapter here. Common legacy adapters can be found
 * in the npm package `@solana/wallet-adapter-wallets`.
 */
const wallets: Adapter[] = [];

interface SolanaProviderProps {
  /**
   * @notice Only one network is used since Solana connection
   * provider can not be initialised with multiple networks
   */
  network: ChainData<'solana'>;
}

export const SolanaProvider: FC<PropsWithChildren & SolanaProviderProps> = ({ children, network }) => {
  const [endpoint] = useState(() => {
    if (!network) throw new Error('Network not provided');

    if (network.id === 'solana') {
      return clusterApiUrl(WalletAdapterNetwork.Mainnet);
    }
    if (network.id === 'solanaTestnet') {
      return clusterApiUrl(WalletAdapterNetwork.Testnet);
    }
    if (network.id === 'solanaDevnet') {
      return clusterApiUrl(WalletAdapterNetwork.Devnet);
    }
    return clusterApiUrl(WalletAdapterNetwork.Testnet);
  });

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect={true}
      >
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
