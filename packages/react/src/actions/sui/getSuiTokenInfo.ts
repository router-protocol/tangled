import { ChainData } from '../../types/index.js';

export const getSuiTokenInfo = async ({
  chain,
  method,
  params,
}: {
  chain: ChainData;
  method: string;
  params: Array<string>;
}) => {
  const SUI_RPC_URL = chain.rpcUrls.default.http[0];
  const payload = {
    jsonrpc: '2.0',
    id: 1,
    method,
    params,
  };

  try {
    const response = await fetch(SUI_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`Failed to query Sui RPC with ${method} method:: ${data.error.message}`);
    }

    return data.result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to query Sui RPC with ${method} method : ${error.message}`);
    } else {
      throw new Error(`Failed to query Sui RPC with ${method} method `);
    }
  }
};
