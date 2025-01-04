import { Transaction as SuiTransaction } from '@mysten/sui/transactions';
import type { Network as RouterChainNetwork } from '@routerprotocol/router-chain-sdk-ts';
import { VersionedTransaction as SolanaVersionedTransaction } from '@solana/web3.js';
import { sendTransaction as sendEVMTransaction } from '@wagmi/core';
import { Address as EVMAddress } from 'viem';
import { ChainData, ChainType, ConnectionOrConfig } from '../types/index.js';
import { WalletInstance } from '../types/wallet.js';
import { signBitcoinTransaction } from './bitcoin/transaction.js';

export type SendTransactionParams<CData extends ChainData> = {
  chain: CData;
  to: string;
  from: string;
  value: bigint;
  args: TransactionArgs<CData['type']>;
  overrides?: any;
  config: ConnectionOrConfig & {
    connector: WalletInstance<CData['type']>;
  };
};

export type TransactionArgs<CType extends ChainType> = CType extends 'evm' | 'tron'
  ? {
      calldata: string;
      routerChainArgs?: {
        executeMsg: object;
        funds: Array<{ denom: string; amount: string }>;
      };
    }
  : CType extends 'solana'
    ? {
        versionedTx: SolanaVersionedTransaction;
      }
    : CType extends 'sui'
      ? {
          tx: SuiTransaction;
        }
      : CType extends 'cosmos'
        ? {
            messages: Array<{
              readonly typeUrl: string;
              readonly value: any;
            }>;
            memo?: string;
            routerChainArgs?: {
              executeMsg: object;
              funds: Array<{ denom: string; amount: string }>;
            };
          }
        : CType extends 'bitcoin'
          ? { memo: string; feeRate?: number }
          : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type SendTransactionReturnType<C extends ChainType> = { txHash: string };

export type SendTransactionToChainFunction = <CData extends ChainData>(
  params: SendTransactionParams<CData>,
) => Promise<SendTransactionReturnType<CData['type']>>;

/**
 * Send transaction. Does not wait for the transaction to be mined.
 * @param chain - {@link ChainData}
 * @param to - Recipient address
 * @param from - Sender address
 * @param value - Value to send
 * @param args - Additional arguments
 * @param config - {@link ConnectionOrConfig}
 */
export const sendTransactionToChain = (async ({ chain, to, from, value, args, config, overrides = {} }) => {
  if (chain.type === 'evm') {
    if (overrides?.walletType === 'evm') {
      const { sendEthTxnToRouterChainPf, getNetworkInfo, MsgExecuteCwContract, getRouterSignerAddress } = await import(
        '@routerprotocol/router-chain-sdk-ts'
      );

      if (!chain.extra) {
        throw new Error('Environment data not found for Router Chain');
      }

      const network = getNetworkInfo(chain.extra.environment as RouterChainNetwork);

      const { routerChainArgs } = args as TransactionArgs<'evm'>;

      const { executeMsg, funds } = routerChainArgs!;

      const executeContractMsg = MsgExecuteCwContract.fromJSON({
        sender: getRouterSignerAddress(from),
        contractAddress: to,
        msg: executeMsg,
        funds,
      });

      const txResponse = await sendEthTxnToRouterChainPf({
        networkEnv: chain.extra.environment,
        txMsg: executeContractMsg,
        nodeUrl: network.lcdEndpoint,
        ethereumAddress: from,
        injectedSigner: window.ethereum,
        pfUrl: `${chain.extra.pathfinder}/v2/router-pubkey`,
      });

      return { txHash: txResponse.tx_response.txhash };
    }

    const { calldata } = args as TransactionArgs<'evm'>;

    // send transaction to EVM chain
    const txHash = await sendEVMTransaction(config.wagmiConfig, {
      account: from as EVMAddress,
      to: to as EVMAddress,
      value,
      chainId: chain.id,
      data: calldata as `0x${string}`,
      ...overrides,
    });

    return {
      txHash,
    };
  }

  if (chain.type === 'tron') {
    const { calldata } = args as TransactionArgs<'tron'>;

    const tronWeb = config.tronWeb;

    const signedTx = await tronWeb.trx.sign(calldata);
    const tx = await tronWeb.trx.sendHexTransaction(signedTx);

    return {
      txHash: tx.txid,
    };
  }

  if (chain.type === 'solana') {
    const { versionedTx } = args as TransactionArgs<'solana'>;
    // simulate transaction before sending
    const simulationResult = await config.solanaConnection.simulateTransaction(versionedTx, {
      commitment: 'confirmed',
    });
    if (simulationResult.value.err) {
      throw new Error(`Transaction simulation failed with error ${JSON.stringify(simulationResult.value.err)}`);
    }

    const walletConnector = config.connector as WalletInstance<'solana'>;
    // send transaction to Solana chain
    const txSignature = await walletConnector.sendTransaction(versionedTx, config.solanaConnection);

    return { txHash: txSignature };
  }

  if (chain.type === 'sui') {
    const { tx } = args as TransactionArgs<'sui'>;
    const walletConnector = config.connector as WalletInstance<'sui'>;

    if (!walletConnector.features['sui:signAndExecuteTransaction']) {
      throw new Error("Sui Conenctor don't support signAndExecuteTransaction");
    }

    const result = await walletConnector.features['sui:signAndExecuteTransaction'].signAndExecuteTransaction({
      transaction: tx,
      chain: `sui:${chain.suiNetwork}`,
      account: walletConnector.accounts[0],
    });

    return { txHash: result.digest };
  }

  if (chain.type === 'cosmos') {
    const chainWallet = config.getCosmosClient().getChainWallet(chain.id);

    if (!chainWallet) {
      throw new Error('Chain wallet not found for cosmos chain');
    }

    if (chain.id === 'router_9600-1') {
      if (overrides?.walletType === 'keplr') {
        if (!chain.extra) {
          throw new Error('Environment data not found for Router Chain');
        }

        const { MsgExecuteCwContract, sendEthTxnToRouterChainKeplrPf, getNetworkInfo } = await import(
          '@routerprotocol/router-chain-sdk-ts'
        );

        const { routerChainArgs } = args as TransactionArgs<'cosmos'>;

        const { executeMsg, funds } = routerChainArgs!;

        const executeContractMsg = MsgExecuteCwContract.fromJSON({
          sender: from,
          contractAddress: to,
          msg: executeMsg,
          funds: funds,
        });
        const network = getNetworkInfo(chain.extra.environment as RouterChainNetwork);

        const txResponse = await sendEthTxnToRouterChainKeplrPf({
          networkEnv: chain.extra.environment,
          txMsg: executeContractMsg,
          nodeUrl: network.lcdEndpoint,
          ethereumAddress: from,
          // @ts-expect-error: keplr is not defined in the global scope
          injectedSigner: window.keplr,
          pfUrl: `${chain.extra.pathfinder}/v2/router-pubkey`,
        });

        return { txHash: txResponse.tx_response.txhash };
      } else {
        throw new Error('Unsupported Wallet, please connect with Keplr wallet');
      }
    }

    const { messages, memo } = args as TransactionArgs<'cosmos'>;

    const cosmWasmClient = await chainWallet.getSigningCosmWasmClient();

    const fee = overrides?.gasFee || 'auto';

    const result = await cosmWasmClient.signAndBroadcast(from, messages, fee, memo);

    if (result.code !== 0) {
      throw new Error(`Transaction failed with code ${result.code}`);
    }

    return { txHash: result.transactionHash };
  }

  if (chain.type === 'bitcoin') {
    const { memo, feeRate } = args as TransactionArgs<'bitcoin'>;
    // send transaction to BITCOIN chain
    const txHash = await signBitcoinTransaction({
      config,
      chain,
      from,
      recipient: to,
      amount: Number(value),
      memo,
      feeRate,
    });

    return { txHash };
  }

  throw new Error('Chain not supported');
}) as SendTransactionToChainFunction;
