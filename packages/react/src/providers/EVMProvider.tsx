import { ReactNode, useState } from 'react';
import { Chain, Transport, http } from 'viem';
import { CreateConnectorFn, WagmiProvider, createConfig } from 'wagmi';
import * as defaultConnectors from '../connectors/connectors.js';
import { CHAINS_DATA } from '../constants/index.js';
import { ChainData, ChainId } from '../types/index.js';

const connectors: CreateConnectorFn[] = [
  defaultConnectors.bitget,
  defaultConnectors.exodus,
  defaultConnectors.binance,
  defaultConnectors.frontier,
  defaultConnectors.okx,
  defaultConnectors.trust,
  defaultConnectors.brave,
  defaultConnectors.dcent,
  defaultConnectors.frame,
  defaultConnectors.oneinch,
  defaultConnectors.safepal,
];

const EVMProvider = ({
  children,
  ...props
}: {
  children: ReactNode;
  chains: ChainData[];
  connectors: CreateConnectorFn[] | undefined;
}) => {
  const [wagmiConfig] = useState(() => {
    return createConfig({
      chains: props.chains.map((chain) => ({ ...CHAINS_DATA[chain.id as unknown as ChainId], ...chain }) as Chain) as [
        Chain,
        ...Chain[],
      ],
      transports: props.chains.reduce(
        (acc, chain) => {
          acc[chain.id] = http();
          return acc;
        },
        {} as Record<string, Transport>,
      ),
      connectors: [...(props.connectors ?? []), ...connectors],
    });
  });

  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

export default EVMProvider;
