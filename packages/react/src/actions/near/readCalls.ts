import { providers } from 'near-api-js';
import { OtherChainData, OtherChainTypes } from '../../types/index.js';

export const THIRTY_TGAS = '30000000000000';
export const NO_DEPOSIT = '0';

export async function viewMethodOnNear(
  chain: OtherChainData<OtherChainTypes>,
  token: string,
  method: string,
  args = {},
) {
  const url = chain.rpcUrls.default.http[0];
  const provider = new providers.JsonRpcProvider({ url });

  let res = await provider.query({
    request_type: 'call_function',
    account_id: token,
    method_name: method,
    args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
    finality: 'optimistic',
  });
  res = JSON.parse(Buffer.from(res.result).toString());
  return res;
}
