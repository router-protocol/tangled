export const trc20Abi = [
  { outputs: [{ type: 'string' }], name: 'currency', stateMutability: 'View', type: 'Function' },
  { outputs: [{ type: 'uint8' }], name: 'decimals', stateMutability: 'View', type: 'Function' },
  { outputs: [{ type: 'string' }], name: 'name', stateMutability: 'View', type: 'Function' },
  { outputs: [{ type: 'string' }], name: 'symbol', stateMutability: 'View', type: 'Function' },
  {
    outputs: [{ type: 'uint256' }],
    name: 'totalSupply',
    stateMutability: 'View',
    type: 'Function',
  },
  {
    outputs: [{ type: 'uint256' }],
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    stateMutability: 'View',
    type: 'Function',
  },
  {
    outputs: [{ type: 'bool' }],
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    stateMutability: 'Nonpayable',
    type: 'Function',
  },
  {
    outputs: [{ type: 'bool' }],
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    stateMutability: 'Nonpayable',
    type: 'Function',
  },
  {
    outputs: [{ type: 'bool' }],
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    stateMutability: 'Nonpayable',
    type: 'Function',
  },
  {
    outputs: [{ type: 'uint256' }],
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    stateMutability: 'View',
    type: 'Function',
  },

  {
    inputs: [
      { indexed: true, name: '_from', type: 'address' },
      { indexed: true, name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'Event',
  },
  {
    inputs: [
      { indexed: true, name: '_owner', type: 'address' },
      { indexed: true, name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'Event',
  },
] as const;
