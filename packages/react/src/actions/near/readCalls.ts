import { providers } from 'near-api-js';
import { OtherChainData } from '../../types/index.js';

export const THIRTY_TGAS = '30000000000000';
export const NO_DEPOSIT = '0';

export function getNearProvider(chain: OtherChainData<'near'>) {
  return new providers.JsonRpcProvider({ url: chain.rpcUrls.defualt.http[0] });
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

    if (typeof res === 'string') {
      return BigInt(res);
    }

    return res;
  } catch (error) {
    console.error('Error calling viewMethodOnNear:', error);
    throw error;
  }
}
