export type BitcoinConnector = typeof window.xfi.bitcoin;

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
