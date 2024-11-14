import { ReactNode, useState } from 'react';
import { Transport, http } from 'viem';
import { CreateConnectorFn, WagmiProvider, createConfig } from 'wagmi';
import { ChainData, EVMChain } from '../types/index.js';

export const EVMProvider = ({
  children,
  ...props
}: {
  children: ReactNode;
  chains: ChainData[];
  connectors: CreateConnectorFn[];
}) => {
  const [wagmiConfig] = useState(() => {
    return createConfig({
      chains: props.chains as [EVMChain, ...EVMChain[]],
      transports: props.chains.reduce(
        (acc, chain) => {
          acc[chain.id] = http();
          return acc;
        },
        {} as Record<string, Transport>,
      ),
      connectors: props.connectors,
      multiInjectedProviderDiscovery: true,
      ssr: true,
      batch: {
        multicall: true,
      },
    });
  });

  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};
