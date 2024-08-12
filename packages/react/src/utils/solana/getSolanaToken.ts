import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';

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
  let allowance = BigInt(0);

  // Only USDC is an SPL token and others are in TOKEN22 format
  const TokenProgram =
    token.toString() === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID;

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
  if (spender) {
    const tokenAccountInfo = await connection.getParsedAccountInfo(associatedTokenAccountAddress, 'confirmed');
    if (!tokenAccountInfo.value) {
      throw new Error('Token account info not found');
    }
    const accountData = tokenAccountInfo.value.data;

    const spenderPublicKey = new PublicKey(spender);

    if ('parsed' in accountData) {
      const parsedInfo = accountData.parsed.info;
      allowance = parsedInfo.delegate === spenderPublicKey.toString() ? parsedInfo.delegatedAmount : 0n;
    }
  }

  return { balance, allowance };
};
