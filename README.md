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

### Support Table

:small_orange_diamond: - In Progress
:white_check_mark: - Supported
:x: - Not Supported

| Chain     | Wallet Connection      | Token Fetch        | Transaction Handlers   | Tx Watch               | Tx Receipt             |
| --------- | ---------------------- | ------------------ | ---------------------- | ---------------------- | ---------------------- |
| EVM       | :white_check_mark:     | :white_check_mark: | :small_orange_diamond: | :small_orange_diamond: | :small_orange_diamond: |
| Solana    | :white_check_mark:     | :white_check_mark: | :small_orange_diamond: | :small_orange_diamond: | :small_orange_diamond: |
| Tron      | :white_check_mark:     | :white_check_mark: | :small_orange_diamond: | :small_orange_diamond: | :small_orange_diamond: |
| AlephZero | :white_check_mark:     | :white_check_mark: | :white_check_mark:     | :white_check_mark:     | :white_check_mark:     |
| Sui       | :small_orange_diamond: | :x:                | :x:                    | :x:                    | :x:                    |
| Cosmos    | :x:                    | :x:                | :x:                    | :x:                    | :x:                    |
| Near      | :white_check_mark:     | :white_check_mark: | :white_check_mark:     | :white_check_mark:     | :white_check_mark:     |
| Bitcoin   | :x:                    | :x:                | :x:                    | :x:                    | :x:                    |
| Casper    | :x:                    | :x:                | :x:                    | :x:                    | :x:                    |
| Ton       | :white_check_mark:     | :white_check_mark: | :white_check_mark:     | :white_check_mark:     | :white_check_mark:     |
| Algorand  | :x:                    | :x:                | :x:                    | :x:                    | :x:                    |

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

#### Components

- [x] `Connect Button`
- [ ] `Account Dialog`
- [ ] `Network Button`
- [ ] `Network Selector Dialog`
- [ ] `Crosschain Transaction Receipt`
- [ ] `Receipt Status`
- [ ] `Transaction Status`
- [ ] `Transaction Progress`

#### Utilities

- [ ] `SIWE and similar`
