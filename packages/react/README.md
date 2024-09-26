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
| AlephZero | :white_check_mark:     | :white_check_mark: | :x:                    | :x:                    | :x:                    |
| Sui       | :small_orange_diamond: | :x:                | :x:                    | :x:                    | :x:                    |
| Cosmos    | :x:                    | :x:                | :x:                    | :x:                    | :x:                    |
| Near      | :white_check_mark:     | :white_check_mark: | :white_check_mark:     | :white_check_mark:     | :white_check_mark:     |
| Bitcoin   | :x:                    | :x:                | :x:                    | :x:                    | :x:                    |
| Casper    | :x:                    | :x:                | :x:                    | :x:                    | :x:                    |
| Ton       | :white_check_mark:     | :white_check_mark: | :white_check_mark:     | :white_check_mark:     | :white_check_mark:     |
| Algorand  | :x:                    | :x:                | :x:                    | :x:                    | :x:                    |

#### Hooks

- [-] `useAccounts` - get all accounts for a chain type or all chain types
- [-] `useChain` - get chain data for a specific chain
- [-] `useChains` - get all chain data
- [-] `useConnect` - connect to a wallet
- [-] `useConnectedWallets` - get all connected wallets
- [-] `useConnections` - get all connections
- [-] `useCurrentAccount` - get the current account
- [-] `useCurrentWallet` - get the current wallet
- [-] `useDisconnect` - disconnect from a wallet
- [-] `useIsMobile` - check if the user is on a mobile device
- [-] `useNetwork` - get the current network
- [-] `useSendTransaction` - send a transaction
- [-] `useTangledConfig` - get the Tangled config
- [-] `useToken` - get token data
- [-] `useTokenForAccount` - get token data for an account
- [-] `useTransactionReceipt` - get a transaction receipt
- [-] `useWaitForTransaction` - wait for a transaction
- [-] `useWallet` - get the current wallet
- [-] `useWallets` - get all wallets
<!-- todo -->
- [ ] `useSignMessage` - sign a message with the current connected account
- [ ] `useReadContract` - read from a contract
