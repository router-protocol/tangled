import { sepolia as vSepolia } from 'viem/chains';

export const sepolia = { ...vSepolia, type: 'evm' } as const;
