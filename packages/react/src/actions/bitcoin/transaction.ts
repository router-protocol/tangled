import { getBitcoinProvider } from '../../connectors/bitcoin/connectors.js';
import { BitcoinGasFeeResponse } from '../../types/bitcoin.js';
import { OtherChainData, OtherChainTypes } from '../../types/index.js';

export function removeHexPrefix(hexString: string) {
  if (hexString.startsWith('0x')) {
    return hexString.slice(2);
  }
  return hexString;
}

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
  chain,
  from,
  recipient,
  amount,
  memo,
  feeRate,
}: {
  chain: OtherChainData<OtherChainTypes>;
  from: string;
  recipient: string;
  amount: number;
  memo: string;
  feeRate?: number;
}): Promise<string> {
  const fetchedFeeRate = await getBitcoinGasFee(chain);
  const btcProvider = getBitcoinProvider();

  return new Promise((resolve, reject) => {
    btcProvider.request(
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
      async (error: unknown, result: string) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      },
    );
  });
}
