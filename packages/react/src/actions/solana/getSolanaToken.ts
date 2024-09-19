import { getAssociatedTokenAddress } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { getProgramId } from './getProgramId.js';

export const getSolanaTokenBalanceAndAllowance = async ({
  connection,
  account,
  token,
  spender,
}: {
  connection: Connection;
  token: PublicKey;
  account: PublicKey;
  spender: PublicKey | undefined;
}) => {
  let balance = BigInt(0);
  let delegatedAmount = BigInt(0);
  let isAtaDeployed = false;

  const TokenProgram = getProgramId(token.toString());

  // Get associated token account address
  const associatedTokenAccountAddress = await getAssociatedTokenAddress(token, account, true, TokenProgram);

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(new PublicKey(account), {
    mint: token,
  });

  if (tokenAccounts.value.length > 0) {
    balance = BigInt(tokenAccounts.value[0].account.data.parsed.info.tokenAmount.amount);
  } else {
    balance = BigInt(0);
  }

  //   if spender, fetch allowance
  const tokenAccountInfo = await connection.getParsedAccountInfo(associatedTokenAccountAddress, 'confirmed');
  if (tokenAccountInfo.value) {
    isAtaDeployed = true;

    // Check delegated amount
    if (spender) {
      const accountData = tokenAccountInfo.value.data;

      const spenderPublicKey = new PublicKey(spender);

      if ('parsed' in accountData) {
        const parsedInfo = accountData.parsed.info;
        delegatedAmount = parsedInfo.delegate === spenderPublicKey.toString() ? parsedInfo.delegatedAmount : 0n;
      }
    }
  }

  return { balance, delegatedAmount, associatedTokenAccountAddress, isAtaDeployed };
};
