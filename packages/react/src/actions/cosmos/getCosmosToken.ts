import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { maxInt256 } from 'viem';
import { ChainData, ConnectionOrConfig, CosmsosChainType } from '../../types/index.js';
import { areTokensEqual } from '../../utils/index.js';

export const getCosmosTokenMetadata = async ({
  token,
  chain,
  getCosmosClient,
}: {
  token: string;
  chain: CosmsosChainType;
  getCosmosClient: ConnectionOrConfig['getCosmosClient'];
}) => {
  const registryClient = await getCosmosClient().getChainRegistry();

  console.log('registryClient', registryClient);

  const assetList = registryClient.getChainAssetList(chain.chainName).assets;

  console.log('assetlist', assetList);

  const asset = assetList.find((asset) => areTokensEqual(asset.base, token));

  if (!asset) {
    throw new Error('Token not found');
  }

  return {
    symbol: asset.symbol,
    name: asset.name,
    decimals: asset.denom_units[1].exponent,
    address: token,
  };
};

export const getCosmosTokenBalanceAndAllowance = async ({
  account,
  token,
  spender,
  config,
  chain,
}: {
  account: string;
  token: string;
  spender: string | undefined;
  config: ConnectionOrConfig;
  chain: ChainData;
}) => {
  let balance = 0n;
  let allowance = 0n;
  try {
    const stclient = await SigningCosmWasmClient.connect(chain.rpcUrls.default.http[0]);

    const tokenBalance = await stclient.getBalance(account, token);

    if (token.toLowerCase().startsWith('ibc') || token.toLowerCase().startsWith('factory')) {
      return {
        balance: BigInt(tokenBalance.amount),
        allowance: maxInt256,
      };
    }

    const balanceQuery = stclient.getBalance(account, token);
    const allowanceQuery = stclient.queryContractSmart(token, {
      allowance: {
        owner: account,
        spender: spender,
      },
    });

    const [balanceResult, allowanceResult] = await Promise.all([balanceQuery, allowanceQuery]);

    balance = BigInt(balanceResult.amount);
    allowance = BigInt(allowanceResult.allowance.amount);
  } catch (error) {
    console.error('Failed to fetch allowance:', error);
    throw error;
  }

  return {
    balance,
    allowance,
  };
};
