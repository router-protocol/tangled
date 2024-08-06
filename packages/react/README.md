# Router Protocol's Tangled SDK 🪢

## 1. @tangled3/react 🪢 ⚛️

React wrappers, hooks, components, and utilities for Router Protocol's Tangled SDK.
Enable crosschain interactions with your DApp with the Tangled SDK. Compatbile with Next.js 13 and React 18.

Built with @shadcn/ui and tailwind so you can paint it your way :D

### Installation

```sh
yarn add @tangled3/react
```

OR

```sh
pnpm i @tangled3/react
```

### Usage

```tsx
import { QueryClient, QueryClientProvider } from 'react-query';
import { TangledProvider } from '@tangled3/react';

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <TangledProvider
        config={{
          projectName: 'multi chain project',
          chainConfigs: {},
          // chains
        }}
      >
        <Component {...pageProps} />
      </TangledProvider>
    </QueryClientProvider>
  );
}
```

### Feat List

#### Supported Chain Types

1. EVM
2. Solana
3. Tron
4. Cosmos
5. Near
6. AlephZero
7. Sui
8. Bitcoin
9. Cosmos

#### Hooks

- [ ] `useChainsConfig` - config for all chains
- [ ] `useChains` - data for all chains
- [ ] `useChain` - data for a specific chain
- [ ] `useChainId` - current chain id
- [ ] `useWallet` - current wallet
- [ ] `useWallets` - all wallets
- [ ] `useAccount` - current account
- [ ] `useWallet` - current wallet
- [ ] `useWatchTransaction` - watch a transaction, return receipt and callback fns
- [ ] `useSendTransaction` - send a transaction, return receipt
- [ ] `useTransactionReceipt` - get a transaction receipt
- [ ] `useNitroTransactionReceipt` - get a transaction receipt from Nitro explorer
- [ ] `useReadContract` - read a contract
- [ ] `useSignMessage` - sign a message with current connected account
- [ ] `useToken` - get token data like name, symbol, decimals
- [ ] `useTokenAddressData` - get token data for an account to get balance, allowance and permit information
- [ ] `useTokens` - get token list for one/multiple chains
- [ ] `useTransactionHistory` - get transaction history for an account stored in local storage
