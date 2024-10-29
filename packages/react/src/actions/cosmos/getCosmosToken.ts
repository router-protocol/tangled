import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { maxInt256 } from 'viem';
import { ChainData, ConnectionOrConfig, CosmsosChainType } from '../../types/index.js';
import { areTokensEqual, formatTokenAddress, isNativeOrFactoryToken } from '../../utils/index.js';

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
  chain,
}: {
  account: string;
  token: string;
  spender: string | undefined;
  chain: ChainData;
}): Promise<{
  balance: bigint;
  allowance: bigint;
}> => {
  try {
    const cosmwasmClient = await SigningCosmWasmClient.connect(chain.rpcUrls.default.http[0]);
    const formattedToken = formatTokenAddress(token);

    // Getting initial token balance
    const tokenBalance = await cosmwasmClient.getBalance(account, formattedToken);

    //  For native/factory tokens
    if (isNativeOrFactoryToken(token)) {
      return {
        balance: BigInt(tokenBalance.amount),
        allowance: maxInt256,
      };
    }

    // Querying both balance and allowance
    const [balanceResult, allowanceResult] = await Promise.all([
      cosmwasmClient.queryContractSmart(token, {
        balance: { address: account },
      }),
      cosmwasmClient.queryContractSmart(token, {
        allowance: {
          owner: account,
          spender: spender,
        },
      }),
    ]);

    return {
      balance: BigInt(balanceResult.amount),
      allowance: BigInt(allowanceResult.allowance.amount),
    };
  } catch (error) {
    console.error('Failed to fetch allowance:', error);
    throw error;
  }
};
