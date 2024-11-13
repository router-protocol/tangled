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

export type MempoolSpaceBitcoinGasFeeResponse = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
};

export type BitcoinTransactionStatus = {
  confirmed: boolean;
  block_height: number | null;
  block_hash: string | null;
  block_time: number | null;
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

export interface BtcScanBalanceResponse {
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

export interface BlockchainInfoBalanceResponse {
  address: string;
  confirmed: number;
  unconfirmed: number;
  utxo: number;
  txs: number;
  received: number;
}

export interface BlockcypherBalanceResponse {
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

export type BalanceApiResponse =
  | {
      source: 'btcscan';
      data: BtcScanBalanceResponse;
    }
  | {
      source: 'blockchain.info';
      data: BlockchainInfoBalanceResponse;
    }
  | {
      source: 'blockcypher';
      data: BlockcypherBalanceResponse;
    };

export type ApiResponse<T> = {
  source: ApiConfig['name'];
  data: T;
};

export interface ApiConfig {
  name: 'btcscan' | 'blockchain.info' | 'blockcypher';
  url: {
    balance: (address: string) => string;
    transaction: (txHash: string) => string;
  };
}

export type BtcScanTransactionResponse = {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
};

export type BlockcypherTransactionResponse = {
  block_hash: string;
  block_height: number;
  block_index: number;
  hash: string;
  addresses: string[];
  total: number;
  fees: number;
  size: number;
  vsize: number;
  preference: string;
  relayed_by: string;
  confirmed: string;
  received: string;
  ver: number;
  double_spend: boolean;
  vin_sz: number;
  vout_sz: number;
  data_protocol: string;
  confirmations: number;
  confidence: number;
  inputs: Array<{
    prev_hash: string;
    output_index: number;
    output_value: number;
    sequence: number;
    addresses: string[];
    script_type: string;
    age: number;
    witness: string[];
  }>;
  outputs: Array<{
    value: number;
    script: string;
    addresses: string[] | null;
    script_type: string;
    data_hex?: string;
  }>;
};

export type BlockchainInfoTransactionResponse = {
  txid: string;
  size: number;
  version: number;
  locktime: number;
  fee: number;
  inputs: Array<{
    coinbase: boolean;
    txid: string;
    output: number;
    sigscript: string;
    sequence: number;
    pkscript: string;
    value: number;
    address: string;
    witness: string[];
  }>;
  outputs: Array<{
    address: string | null;
    pkscript: string;
    value: number;
    spent: boolean;
    spender: string | null;
  }>;
  block: {
    height: number;
    position: number;
  };
  deleted: boolean;
  time: number;
  rbf: boolean;
  weight: number;
};
