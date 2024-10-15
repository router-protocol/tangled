export declare global {
  interface Window {
    xfi: {
      bitcoin: {
        chainId: string;

        changeNetwork: (network: 'mainnet' | 'testnet') => Promise<void>;
        request: (
          options:
            | { method: 'request_accounts'; params: [] }
            | {
                method: 'transfer';
                params: [
                  {
                    feeRate: number;
                    from: string;
                    recipient: string;
                    amount: { amount: number; decimals: number };
                    memo: string;
                  },
                ];
              },
          callback: (error: Error | null, result: string | string[]) => void,
        ) => void;
      };
      ethereum: any;
    };
  }
}
