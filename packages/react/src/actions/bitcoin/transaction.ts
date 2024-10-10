import { BitcoinGasFeeResponse } from '../../types/bitcoin.js';
import { ConnectionOrConfig, OtherChainData, OtherChainTypes } from '../../types/index.js';
import { removeHexPrefix } from '../../utils/index.js';

export async function getBitcoinGasFee(chain: OtherChainData<OtherChainTypes>) {
  try {
    const network = chain.id === 'bitcoin' ? '' : 'testnet/';
    const feeData: BitcoinGasFeeResponse = await fetch(`https://mempool.space/${network}api/v1/fees/recommended`).then(
      (res) => res.json(),
    );

    const fastestFeeRate = feeData.fastestFee;
    const feeRateSatPerByte = Math.floor(fastestFeeRate);
    return feeRateSatPerByte;
  } catch (error) {
    console.error('failed to fetch bitcoin gas - ', error);
    throw new Error('Failed to fetch bitcoin gas fee');
  }
}

export async function signBitcoinTx({
  config,
  chain,
  from,
  recipient,
  amount,
  memo,
  feeRate,
}: {
  config: ConnectionOrConfig;
  chain: OtherChainData<OtherChainTypes>;
  from: string;
  recipient: string;
  amount: number;
  memo: string;
  feeRate?: number;
}): Promise<string> {
  const fetchedFeeRate = await getBitcoinGasFee(chain);

  return new Promise((resolve, reject) => {
    config.bitcoinProvider.request(
      {
        method: 'transfer',
        params: [
          {
            feeRate: feeRate ?? fetchedFeeRate,
            from,
            recipient,
            amount: {
              amount,
              decimals: 8,
            },
            memo: `hex::${removeHexPrefix(memo)}`,
          },
        ],
      },
      async (error: unknown, result: string | string[]) => {
        if (error) {
          reject(error);
        }
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('[BITCOIN] Transfer request:: Expected a string result'));
        }
      },
    );
  });
}
