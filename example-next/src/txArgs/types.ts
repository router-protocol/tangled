export type PathfinderQuote = {
  flowType: FlowType;
  isTransfer: string;
  isWrappedToken: boolean;
  allowanceTo: string;
  bridgeFee?: BridgeFee;
  fuelTransfer: {
    amount: string;
    decimals: number;
    symbol: string;
  } | null;
  fromTokenAddress: string;
  toTokenAddress: string;
  source: ChainQuote;
  destination: ChainQuote;
  partnerId: string;
  slippageTolerance: string;
  estimatedTime: number;
};

export type PathfinderQuoteError = {
  error: string;
  errorCode: string;
};

export type PathfinderQuoteResponse = PathfinderQuote | PathfinderQuoteError;

export type ChainQuote = {
  chainId: string;
  chainType: ChainType;
  asset: Asset;
  stableReserveAsset: Asset;
  tokenAmount: string;
  stableReserveAmount: string;
  path?: string[];
  flags: string[];
  priceImpact: string;
  tokenPath: string;
  dataTx: string[];
};

export type BridgeFee = {
  amount: string;
  decimals: number;
  symbol: string;
  address: string;
};

export type ChainType = 'evm' | 'solana' | 'cosmos' | 'tron' | 'substrate' | 'router' | 'bitcoin';

export type FlowType = 'trustless' | 'circle' | 'gateway' | 'mint-burn';

export type Asset = {
  symbol: string;
  name: string;
  decimals: number;
  chainId: string;
  address: string;
  resourceID: string;
  isMintable: boolean;
  isWrappedAsset: boolean;
};

export type TxnDataOsmosis = {
  swap_and_apply_action: {
    after_swap_action: {
      transfer: object;
    };
    local_fallback_address: string;
    swap_msg: {
      token_out_min_amount: string;
      path: [
        {
          pool_id: string;
          token_out_denom: string;
        },
        {
          pool_id: string;
          token_out_denom: string;
        },
      ];
    };
  };
};

export type TxnDataSelf = {
  srcPort: string;
  srcChannel: string;
  memo: string;
};

export type TxnDataRouter = {
  transfer_route_cross_chain: {
    dest_chain_id: string;
    recipient: string;
  };
};

export type CosmosCoin = {
  denom: string;
  amount: string;
};

export type TxnDataBitcoin = {
  method: string; // TODO: check if method type can be "transfer" only
  params: [
    {
      feeRate: number | null;
      from: string;
      recipient: string;
      amount: {
        amount: string;
        decimals: number;
      };
      memo: string;
    },
  ];
};

export type PfTronTransaction = {
  raw_data_hex: string;
  txID: string;
  visible: boolean;
  raw_data: {
    contract: {
      parameter: {
        value: {
          data: string;
          owner_address: string;
          contract_address: string;
        };
        type_url: string;
      };
      type: string;
    }[];
    ref_block_bytes: string;
    ref_block_hash: string;
    expiration: number;
    fee_limit: number;
    timestamp: number;
  };
};
export type TransactionData = {
  from: string;
  to: string;
  data: string | TxnDataOsmosis | TxnDataSelf | TxnDataRouter | TxnDataBitcoin;
  value?: string | CosmosCoin[] | CosmosCoin;
  gasPrice: string;
  gasLimit: string;
  raw_data_hex?: string;
};
export type PathfinderTransaction = PathfinderQuote & {
  txn: TransactionData | PfTronTransaction;
  senderAddress: string;
  receiverAddress: string;
};
export type RouterPayTxResponse = {
  success: boolean;
  error?: string;
  depositInfo: {
    depositAddress: string;
    uid: string;
    refundAddress: string;
  };
  bestRoute: PathfinderTransaction;
};

export type RouterPayExplorerResponse = {
  relayTxn: string;
  status: string;
  depositAddress: string;
  refundAddress: string;
  uid: string;
  amount: string;
  currentBalance: string;
  chainId: string;
  createdAt: string;
  expirationAt: string;
};

export type RouterPayApiResponse = {
  results: RouterPayExplorerResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type QrCallbackData = {
  calldata: string;
  address: string;
  uid: string;
  status: string;
  routerPayAddress: string;
};

export type PathfinderSolanaTransaction = Omit<PathfinderTransaction, 'txn'> & {
  txn: Omit<PathfinderTransaction['txn'], 'data'> & {
    from: string;
    data: {
      txMessages: string[];
      blockhash: string;
      lastValidBlockHeight: number;
      packetMessages: string[];
      keypair?: { secretKey: string };
    };
  };
};
