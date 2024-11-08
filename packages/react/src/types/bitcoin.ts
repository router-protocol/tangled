export type XfiBitcoinConnector = {
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

export type BitcoinBalanceResponse = {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
};

export type MempoolSpaceBitcoinGasFeeResponse = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
};

export type BlockstreamGasFeeResponse = {
  [blocks: string]: number;
};

export type BitcoinTransactionStatus = {
  confirmed: boolean;
  block_height: number | null;
  block_hash: string | null;
  block_time: number | null;
};

export type BitcoinTransactionData = {
  txid: string;
  status: BitcoinTransactionStatus;
  fee: number;
  vin: Array<{
    txid: string;
    vout: number;
    prevout: {
      scriptpubkey: string;
      scriptpubkey_asm: string;
      scriptpubkey_type: string;
      value: number;
    };
    scriptsig: string;
    scriptsig_asm: string;
    is_coinbase: boolean;
    sequence: number;
  }>;
  vout: Array<{
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    value: number;
  }>;
};

export type BitcoinTransferRequest = {
  feeRate: number;
  from: string;
  recipient: string;
  amount: {
    amount: number;
    decimals: number;
  };
  memo: string;
};

export interface BtcScanResponse {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
}

export interface BlockchainInfoResponse {
  address: string;
  confirmed: number;
  unconfirmed: number;
  utxo: number;
  txs: number;
  received: number;
}

export interface BlockcypherResponse {
  address: string;
  total_received: number;
  total_sent: number;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  n_tx: number;
  unconfirmed_n_tx: number;
  final_n_tx: number;
}

export type ApiResponse =
  | {
      source: 'btcscan';
      data: BtcScanResponse;
    }
  | {
      source: 'blockchain.info';
      data: BlockchainInfoResponse;
    }
  | {
      source: 'blockcypher';
      data: BlockcypherResponse;
    };

export type CachedData<T> = {
  data: T;
  timestamp: number;
};

export interface ApiConfig {
  name: 'btcscan' | 'blockchain.info' | 'blockcypher';
  url: (address: string) => string;
}
