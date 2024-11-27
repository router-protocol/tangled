import { sepolia as vSepolia } from 'viem/chains';
import { EVMChain } from '../../types/index.js';

export const sepolia: EVMChain = { ...vSepolia, type: 'evm' } as const;
