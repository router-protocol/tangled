import { ReactNode, useState } from 'react';
import { Transport, http } from 'viem';
import { CreateConnectorFn, WagmiProvider, createConfig } from 'wagmi';
import { ChainData } from '../types/index.js';

const EVMProvider = ({
  children,
  ...props
}: {
  children: ReactNode;
  chains: ChainData[];
  connectors: CreateConnectorFn[];
}) => {
  const [wagmiConfig] = useState(() => {
    return createConfig({
      chains: props.chains as [ChainData<'evm'>, ...ChainData<'evm'>[]],
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
    });
  });

  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

export default EVMProvider;
