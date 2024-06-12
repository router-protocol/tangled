import { ReactNode, useState } from 'react';
import { Chain, Transport, http } from 'viem';
import { WagmiProvider, createConfig } from 'wagmi';
import { CHAINS_DATA } from '../constants';
import { ChainConfig } from '../types';

const EVMProvider = ({ children, chains }: { children: ReactNode; chains: ChainConfig[] }) => {
  const [evmChains] = useState(() => {
    return chains.filter((chain) => chain.type === 'evm');
  });
  const [wagmiConfig] = useState(() => {
    return createConfig({
      chains: evmChains.map((chain) => ({ ...CHAINS_DATA[chain.id], ...chains }) as Chain) as [Chain, ...Chain[]],
      transports: evmChains.reduce(
        (acc, chain) => {
          acc[chain.id] = http();
          return acc;
        },
        {} as Record<string, Transport>,
      ),
    });
  });

  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

export default EVMProvider;
