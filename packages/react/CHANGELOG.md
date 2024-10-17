# @tangled3/react

## 1.8.0

### Minor Changes

- added cosmos support

## 1.7.4

### Patch Changes

- make tron handlers hex compliant

## 1.7.3

### Patch Changes

- chore: update tron chain ids

## 1.7.2

### Patch Changes

- export hook types

## 1.7.1

### Patch Changes

- fix poll callback

## 1.7.0

### Minor Changes

- add sui and ton support

## 1.6.11

### Patch Changes

- fix polling callback util

## 1.6.10

### Patch Changes

- export abi constants

## 1.6.9

### Patch Changes

- fix useNetwork chain search

## 1.6.8

### Patch Changes

- fix: chain id comparison

## 1.6.7

### Patch Changes

- fix undefined allowance conversion to bigint

## 1.6.6

### Patch Changes

- fix: multicall allowance fetching condition

## 1.6.5

### Patch Changes

- fix: return transaction hash for evm token handler

## 1.6.4

### Patch Changes

- fix exports... again

## 1.6.3

### Patch Changes

- fix exports

## 1.6.2

### Patch Changes

- export token handler hook

## 1.6.1

### Patch Changes

- fix: return ata results on useTokenForAccount

## 1.6.0

### Minor Changes

- refactor chain types and add token handler hooks

## 1.5.3

### Patch Changes

- fix send transaction mutation arguments

## 1.5.2

### Patch Changes

- export useConnectionOrConfig hook

## 1.5.1

### Patch Changes

- export actions

## 1.5.0

### Minor Changes

- feat: token balances multicall action

## 1.4.8

### Patch Changes

- fix get token balance return

## 1.4.7

### Patch Changes

- fix solana autoconnect conditions
- Updated dependencies
  - @tangled3/solana-react@1.1.2

## 1.4.6

### Patch Changes

- fix: fresh build

## 1.4.5

### Patch Changes

- fix: added async connect

## 1.4.4

### Patch Changes

- fix: hide coinbase injected connector

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
