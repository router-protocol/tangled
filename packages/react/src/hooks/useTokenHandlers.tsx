import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Address, encodeFunctionData, erc20Abi } from 'viem';
import { getProgramId } from '../actions/solana/getProgramId.js';
import { ChainData, ChainId, OtherChainData, TronChain } from '../types/index.js';
import { useChain } from './useChain.js';
import { useConnectionOrConfig } from './useConnectionOrConfig.js';
import { useCurrentAccount } from './useCurrentAccount.js';
import { useSendTransaction } from './useSendTransaction.js';
import { getTronWeb } from '../actions/tron/getTronweb.js';

export type UseTokenHandlersParams = {
  /** Chain ID of token */
  chainId: ChainId | undefined;
  /** Token Address */
  token: string | undefined;
  /** Spender Address */
  spender: string | undefined;
  /** Owner Address */
  owner: string | undefined;
  /** Amount to approve */
  amount: bigint;
};

// export type UseTokenHandlersReturnType = {};

const useTokenHandlers = ({ chainId, token, spender, owner, amount }: UseTokenHandlersParams) => {
  const chain = useChain(chainId);
  const connectionOrConfig = useConnectionOrConfig();
  const account = useCurrentAccount();

  const { mutateAsync: sendTransaction } = useSendTransaction();

  const increaseErc20Allowance = useCallback(
    async (spender: string, owner: string, amount: bigint, tokenAddress: string, chain: ChainData) => {
      const calldata = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [spender, amount] as [Address, bigint],
      });

      return await sendTransaction({
        args: {
          calldata,
        },
        chain,
        from: owner,
        overrides: {},
        to: tokenAddress,
        value: 0n,
      });
    },
    [sendTransaction],
  );

  const createAssociatedTokenAccount = useCallback(
    async (owner: string, tokenAddress: string, chain: OtherChainData<'solana'>) => {
      if (!chain || !tokenAddress || !owner || !account) {
        throw new Error('Missing required parameters');
      }
      if (!connectionOrConfig?.solanaConnection) {
        throw new Error('Solana connection not found');
      }
      if (owner !== account.address) {
        throw new Error('Owner address does not match connected account');
      }

      const tokenMintAddressPubKey = new PublicKey(tokenAddress);

      const ownerPubKey = new PublicKey(owner);

      const tokenProgramId = getProgramId(tokenAddress);

      const ataPublicKey = await getAssociatedTokenAddress(
        new PublicKey(tokenAddress),
        new PublicKey(owner),
        true,
        tokenProgramId,
      );

      const instruction = createAssociatedTokenAccountInstruction(
        ownerPubKey,
        ataPublicKey,
        new PublicKey(owner),
        tokenMintAddressPubKey,
      );

      const { blockhash } = await connectionOrConfig.solanaConnection.getLatestBlockhash();

      const versionedMessage = new TransactionMessage({
        instructions: [instruction],
        payerKey: ownerPubKey,
        recentBlockhash: blockhash,
      }).compileToV0Message();

      const versionedTx = new VersionedTransaction(versionedMessage);

      return await sendTransaction({
        args: {
          versionedTx,
        },
        chain,
        from: owner,
        overrides: {},
        to: tokenAddress,
        value: 0n,
      });
    },
    [account, connectionOrConfig, sendTransaction],
  );

  const increaseTronAllowance = useCallback(
    async (spender: string, owner: string, amount: bigint, token: string, chain: TronChain) => {
      // const calldata = encodeFunctionData({
      //   abi: trc20Abi,
      //   functionName: 'approve',
      //   args: [spender, amount] as [Address, bigint],
      // });

      console.log('spender - ', spender);
      console.log('amount - ', amount);
      console.log('owner - ', owner);

      const tronWeb = getTronWeb(chain);
      tronWeb?.setAddress(owner);

      const functionSelector = 'approve(address,uint256)';
      const parameter = [
        { type: 'address', value: tronWeb?.address?.fromHex(spender) },
        {
          type: 'uint256',
          value: amount.toString(),
        },
      ];

      const tx = await tronWeb?.transactionBuilder.triggerSmartContract(
        tronWeb?.address?.fromHex(token),
        functionSelector,
        {},
        parameter,
      );

      console.log('tx - ', tx);
      return await sendTransaction({
        args: {
          calldata: JSON.stringify(tx?.transaction),
        },
        chain,
        from: owner,
        overrides: {},
        to: token,
        value: 0n,
      });
    },
    [sendTransaction],
  );

  return useMutation({
    mutationKey: ['approve', chain?.id, token],
    mutationFn: async () => {
      if (!chain || !token || !connectionOrConfig || !spender || !owner || !amount) {
        throw new Error('Missing required parameters');
      }
      if (chain.type === 'evm') {
        return increaseErc20Allowance(spender, owner, amount, token, chain);
      }
      if (chain.type === 'solana') {
        return createAssociatedTokenAccount(owner, token, chain as OtherChainData<'solana'>);
      }
      if (chain.type === 'tron') {
        return increaseTronAllowance(spender, owner, amount, token, chain);
      }

      throw new Error('Chain type not supported');
    },
  });
};

export { useTokenHandlers };
