type ExtrinsicArg = {
  toHuman: () => string;
};

type Extrinsic = {
  hash: {
    toHuman: () => string;
  };
  method: {
    toHuman: () => string;
  };
  args: ExtrinsicArg[];
};

type ExtrinsicEvent = {
  phase: { applyExtrinsic: number };
  event: { index: string; data: any[] };
  topics: string[];
};

export type AlephTransactionData = {
  blockHash: string;
  extrinsicIndex: number;
  extrinsic: Extrinsic;
  extrinsicHash: string;
  method: string;
  args: string[];
  events: ExtrinsicEvent[];
};
