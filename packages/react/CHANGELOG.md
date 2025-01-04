# @tangled3/react

## 1.16.9

### Patch Changes

- refactor tron autoconnect and listener handlers

## 1.16.8

### Patch Changes

- fix tron autoconnect

## 1.16.7

### Patch Changes

- fix tron switch network handler

## 1.16.6

### Patch Changes

- fix tron send tx

## 1.16.5

### Patch Changes

- fix switch network tron

## 1.16.4

### Patch Changes

- hyperliquid and tron

## 1.16.3

### Patch Changes

- fix trc20 abi

## 1.16.2

### Patch Changes

- fix tron multicall abi

## 1.16.1

### Patch Changes

- fix: add tron token handler

## 1.16.0

### Minor Changes

- feat: add hyperliquid

## 1.15.15

### Patch Changes

- fix tron switch network call

## 1.15.14

### Patch Changes

- chore: added more evm chains, removed near and ton providers

## 1.15.13

### Patch Changes

- fix sui native token address

## 1.15.12

### Patch Changes

- fix token struct, add isNative flag

## 1.15.11

### Patch Changes

- refactor xdefi to ctrl

## 1.15.10

### Patch Changes

- fix solana native address

## 1.15.9

### Patch Changes

- update solana native token address

## 1.15.8

### Patch Changes

- fix solana native balance fetch

## 1.15.7

### Patch Changes

- fix solana native balance fetch

## 1.15.6

### Patch Changes

- fix solana token program id and send transaction checks for cosmos

## 1.15.5

### Patch Changes

- fix cosmos token balance fetching

## 1.15.4

### Patch Changes

- fix chain configuration

## 1.15.3

### Patch Changes

- chore: add router evm to default chains

## 1.15.2

### Patch Changes

- chore: added vanar and matchain

## 1.15.1

### Patch Changes

- fix new chain configs

## 1.15.0

### Minor Changes

- added additional evm chains

## 1.14.4

### Patch Changes

- fix sui rpc queries

## 1.14.3

### Patch Changes

- fix sui token fetching

## 1.14.2

### Patch Changes

- fix query options

## 1.14.1

### Patch Changes

- fix xdefi id

## 1.14.0

### Minor Changes

- bitcoin amount fixes

## 1.13.0

### Minor Changes

- feat bitcoin balance fetch

## 1.12.0

### Minor Changes

- stable routerchain release

## 1.12.0-routerchain-beta-0.2

### Patch Changes

- fix routerchain balance fetch

## 1.12.0-routerchain-beta-0.1

### Minor Changes

- update cosmos integrations

## 1.10.0-routerchain-beta-0.1

### Minor Changes

- feat router chain integration

## 1.9.11-cosmos-beta

### Patch Changes

- fix cosmos balance queries

## 1.9.10

### Patch Changes

- fix cosmos connections

## 1.9.9

### Patch Changes

- chore: remove console log

## 1.9.8

### Patch Changes

- fix tron store initial value

## 1.9.7

### Patch Changes

- fix tron store initial value

## 1.9.6

### Patch Changes

- fix tron store error

## 1.9.5

### Patch Changes

- fix cosmos gas prices

## 1.9.4

### Patch Changes

- add fee params to cosmos tx overrides

## 1.9.3

### Patch Changes

- fix cosmos chain wallet values

## 1.9.2

### Patch Changes

- fix cosmos integrations

## 1.9.1

### Patch Changes

- fix near deps

## 1.9.0

### Minor Changes

- add bitcoin and near support

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
