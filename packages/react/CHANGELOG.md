# @tangled3/react

## 1.4.3

### Patch Changes

- fix coinbase duplicate connectors

## 1.4.2

### Patch Changes

- fix: memoise hook returns

## 1.4.1

### Patch Changes

- Fixed aleph zero ws provider initialisation

## 1.4.0

### Minor Changes

- Added utility hooks to interact with chains, tokens, and transactions
  1. useSendTransaction
  2. useToken
  3. useTransactionReceipt
  4. useWaitForTransaction

## 1.3.0

### Minor Changes

- fix evm connection and add walletconnect, coinbase support

## 1.2.2

### Patch Changes

- fix tron and evm installed-only list

## 1.2.1

### Minor Changes

- add filters to useWallets options and bug fixes for server env

## 1.1.1

### Minor Changes

- remove react query provider from tangled context

## 1.0.1

### Patch Changes

- Updated dependencies
  - @tangled3/solana-react@1.1.1
- fix publishing directory

## 1.0.0

### Major Changes

- 29a1636: v1 basics

  Basic connections and wallet discovery for evm, solana, tron and aleph zero wallets.

  Added the following hooks:

  - useAccounts
  - useAlpehContext
  - useAlephStore
  - useChain
  - useChains
  - useConnect
  - useConnect
  - useConnectedWallets
  - useConnections
  - useDisconnect
  - useTangledConfig
  - useTronContext
  - useTronStore
  - useWallets

### Patch Changes

- Updated dependencies [29a1636]
  - @tangled3/solana-react@1.0.0
