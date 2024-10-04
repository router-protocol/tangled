import { providers } from 'near-api-js';
import { CHAIN_ID } from '../../constants/index.js';
import { OtherChainData } from '../../types/index.js';

export const THIRTY_TGAS = '30000000000000';
export const NO_DEPOSIT = '0';

export const NEAR_NETWORK_CONFIG: Record<string, string> = {
  testnet: CHAIN_ID.nearTestnet,
  mainnet: CHAIN_ID.near,
};

export function getNearProvider(chain: OtherChainData<'near'>) {
  const url = chain.rpcUrls.default.http[0];
  return new providers.JsonRpcProvider({ url });
}

export async function viewMethodOnNear(chain: OtherChainData<'near'>, token: string, method: string, args = {}) {
  const provider = getNearProvider(chain);

  try {
    let res = await provider.query({
      request_type: 'call_function',
      account_id: token,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
      finality: 'optimistic',
    });
    res = JSON.parse(Buffer.from(res.result).toString());
    return res;
  } catch (error) {
    console.error('Error calling viewMethodOnNear:', error);
    throw error;
  }
}
