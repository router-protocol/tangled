import {
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
