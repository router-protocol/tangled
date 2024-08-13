import { type ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { polkadotTokenAbi } from '../../constants/abi/polkadotToken.js';

export const getAlephZeroTokenBalanceAndAllowance = async ({
  api,
  account,
  token,
  spender,
}: {
  api: ApiPromise;
  token: string;
  account: string;
  spender: string | undefined;
}) => {
  let balance = 0n;
  let allowance = 0n;

  const contract = new ContractPromise(api, polkadotTokenAbi, token);

  const MAX_CALL_WEIGHT = 5_000_000_000n - 1n;
  const PROOFSIZE = 1_000_000n;

  const gasLimit = api.registry.createType('WeightV2', {
    refTime: MAX_CALL_WEIGHT,
    proofSize: PROOFSIZE,
  });

  const { output: balanceOutput, result: balanceResult } = await contract.query['psp22::balance_of'](
    account,
    {
      value: 0,
      gasLimit: gasLimit as any,
    },
    account,
  );
  if (balanceResult.isOk && balanceOutput) {
    balance = BigInt(balanceOutput.toPrimitive()?.toString() || '0');
  }

  const { output: allowanceOutput, result: allowanceResult } = await contract.query['psp22::allowance'](
    account, // The address performing the query
    {
      storageDepositLimit: null,
      gasLimit: gasLimit as any,
    },
    account,
    spender, // The spender address
  );
  if (allowanceResult.isOk && allowanceOutput) {
    allowance = BigInt(allowanceOutput.toPrimitive()?.toString() || '0');
  }

  return { balance, allowance };
};

export const getAlephZeroTokenMetadata = async ({ api, token }: { api: ApiPromise; token: string }) => {
  const contract = new ContractPromise(api, polkadotTokenAbi, token);
  const queryAccount = '';

  const MAX_CALL_WEIGHT = 5_000_000_000n - 1n;
  const PROOFSIZE = 1_000_000n;

  const gasLimit = api.registry.createType('WeightV2', {
    refTime: MAX_CALL_WEIGHT,
    proofSize: PROOFSIZE,
  });

  const { output: symbolOutput, result: symbolResult } = await contract.query['PSP22Metadata::token_symbol'](
    queryAccount,
    {
      value: 0,
      gasLimit: gasLimit as any,
    },
    token,
  );

  const { output: nameOutput, result: nameResult } = await contract.query['PSP22Metadata::token_name'](
    queryAccount,
    {
      value: 0,
      gasLimit: gasLimit as any,
    },
    token,
  );

  const { output: decimalsOutput, result: decimalsResult } = await contract.query['PSP22Metadata::token_decimals'](
    queryAccount,
    {
      value: 0,
      gasLimit: gasLimit as any,
    },
    token,
  );

  return {
    symbol: symbolResult.isOk ? symbolOutput?.toHuman()?.toString() ?? '' : '',
    name: nameResult.isOk ? nameOutput?.toHuman()?.toString() ?? '' : '',
    decimals: decimalsResult.isOk ? Number(decimalsOutput?.toHuman()) ?? '' : 0,
    address: token,
  };
};
