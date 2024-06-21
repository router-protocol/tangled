import { Connection, ConnectionConfig } from '@solana/web3.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode, useMemo } from 'react';
import { ConnectionContext } from '../hooks/useConnection.js';

const queryClient = new QueryClient();

export interface ConnectionProviderProps {
  children: ReactNode;
  endpoint: string;
  config?: ConnectionConfig;
}

const ConnectionProvider: FC<ConnectionProviderProps> = ({ children, endpoint, config }) => {
  const connection = useMemo(() => new Connection(endpoint, config), [endpoint, config]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionContext.Provider value={{ connection }}>{children}</ConnectionContext.Provider>
    </QueryClientProvider>
  );
};

export default ConnectionProvider;
