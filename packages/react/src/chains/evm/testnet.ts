import {
  polygonAmoy as vAmoy,
  arbitrumSepolia as vArbitrumSepolia,
  avalancheFuji as vAvalancheFuji,
  holesky as vHolesky,
  sepolia as vSepolia,
} from 'viem/chains';
import { EVMChain } from '../../types/index.js';

export const sepolia: EVMChain = { ...vSepolia, type: 'evm' } as const;
export const holesky: EVMChain = { ...vHolesky, type: 'evm' } as const;
export const arbitrumSepolia: EVMChain = { ...vArbitrumSepolia, type: 'evm' } as const;
export const avalancheFuji: EVMChain = { ...vAvalancheFuji, type: 'evm' } as const;
export const amoy: EVMChain = { ...vAmoy, type: 'evm' } as const;

export * from './testnets/beraChain.testnet.js';
export * from './testnets/firechain.testnet.js';
export * from './testnets/movement.testnet.js';
export * from './testnets/oasisSapphire.testnet.js';
export * from './testnets/pentagon.testnet.js';
export * from './testnets/soneium.testnet.js';
