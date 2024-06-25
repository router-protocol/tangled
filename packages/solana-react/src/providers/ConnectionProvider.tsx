import { Connection, ConnectionConfig } from '@solana/web3.js';
import { FC, ReactNode, useMemo } from 'react';
import { ConnectionContext } from '../hooks/useConnection.js';

export interface ConnectionProviderProps {
  children: ReactNode;
  endpoint: string;
  config?: ConnectionConfig;
}

export const ConnectionProvider: FC<ConnectionProviderProps> = ({ children, endpoint, config }) => {
  const connection = useMemo(() => new Connection(endpoint, config), [endpoint, config]);

  return <ConnectionContext.Provider value={{ connection }}>{children}</ConnectionContext.Provider>;
};
