import { ChainData, ChainId, ConnectionOrConfig } from '../../types/index.js';
import { areTokensEqual } from '../../utils/index.js';

export const getCosmosTokenMetadata = async ({
  token,
  chainId,
  getCosmosClient,
}: {
  token: string;
  chainId: ChainId;
  getCosmosClient: ConnectionOrConfig['getCosmosClient'];
}) => {
  const registryClient = await getCosmosClient().getChainRegistry();

  const assetList = registryClient.getChainAssetList(chainId).assets;

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
    const cosmosClient = config.getCosmosClient().chainWallets[chain.id];

    const stargateClient = await cosmosClient.getStargateClient();
    const tokenBalance = await stargateClient.getBalance(account, token);

    if (token.toLowerCase().startsWith('ibc') || token.toLowerCase().startsWith('factory')) {
      return {
        balance: BigInt(tokenBalance.amount),
        allowance: 10000n,
      };
    }

    const client = await cosmosClient.getCosmWasmClient();

    const balanceQuery = client.queryContractSmart(token, {
      balance: {
        address: account,
      },
    });
    const allowanceQuery = client.queryContractSmart(token, {
      allowance: {
        owner: account,
        spender: spender,
      },
    });

    const [balanceResult, allowanceResult] = await Promise.all([balanceQuery, allowanceQuery]);

    balance = BigInt(balanceResult.balance.amount);
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
