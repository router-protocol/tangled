import { VersionedTransaction as SolanaVersionedTransaction } from '@solana/web3.js';
import { sendTransaction as sendEVMTransaction } from '@wagmi/core';
import { Address as EVMAddress } from 'viem';

import { CHAIN } from '@tonconnect/ui-react';
import { ChainData, ChainType, ConnectionOrConfig } from '../types/index.js';
import { WalletInstance } from '../types/wallet.js';

export type SendTransactionParams<C extends ChainType = ChainType> = {
  chain: ChainData<C>;
  to: string;
  from: string;
  value: bigint;
  args: TransactionArgs<C>;
  overrides: any;
  config: ConnectionOrConfig & {
    connector: WalletInstance<C>;
  };
};

type TransactionArgs<C extends ChainType> = C extends 'evm'
  ? {
      calldata: string;
    }
  : C extends 'tron'
    ? {
        calldata: string;
      }
    : C extends 'solana'
      ? {
          versionedTx: SolanaVersionedTransaction;
        }
      : C extends 'alephZero'
        ? {
            z: string;
          }
        : C extends 'ton'
          ? {
              tonArgs: {
                validUntil: number; // transaction deadline in unix epoch seconds.
                network?: CHAIN; // (MAINNET: "-239" & TESTNET: "-3")
                payload?: string;
                stateInit?: string;
              };
            }
          : never;

/**
 * Send transaction. Does not wait for the transaction to be mined.
 * @param chain - {@link ChainData}
 * @param to - Recipient address
 * @param from - Sender address
 * @param value - Value to send
 * @param args - Additional arguments
 * @param config - {@link ConnectionOrConfig}
 */
export const sendTransactionToChain = async <C extends ChainType>({
  chain,
  to,
  from,
  value,
  args,
  config,
  overrides,
}: SendTransactionParams<C>) => {
  if (chain.type === 'evm') {
    const { calldata } = args as TransactionArgs<'evm'>;
    // send transaction to EVM chain
    const tx = await sendEVMTransaction(config.wagmiConfig, {
      account: from as EVMAddress,
      to: to as EVMAddress,
      value,
      chainId: chain.id,
      data: calldata as `0x${string}`,
      ...overrides,
    });

    return tx;
  }

  if (chain.type === 'tron') {
    const { calldata } = args as TransactionArgs<'tron'>;
    // send transaction to Tron chain
    const signedTx = await config.tronWeb.trx.sign(calldata);
    const tx = await config.tronWeb.trx.sendHexTransaction(signedTx);
    return tx.txid;
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
    return txSignature;
  }

  if (chain.type === 'alephZero') {
    // send transaction to Aleph chain
  }

  if (chain.type === 'ton') {
    const { tonArgs } = args as TransactionArgs<'ton'>;
    const messages: Array<{
      address: string;
      amount: string;
      payload?: string;
      stateInit?: string;
    }> = [
      {
        address: to,
        amount: value.toString(),
        payload: tonArgs.payload,
        stateInit: tonArgs.stateInit,
      },
    ];
    const transaction = {
      from,
      messages,
      network: tonArgs.network,
      validUntil: tonArgs.validUntil,
    };

    const walletConnector = config.connector as WalletInstance<'ton'>;
    const tx = await walletConnector.sendTransaction(transaction);

    return tx.boc; // TON TODO: prepare txhash
  }

  throw new Error('Chain not supported');
};
