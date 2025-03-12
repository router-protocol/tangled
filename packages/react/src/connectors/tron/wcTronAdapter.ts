import type { AdapterName, SignedTransaction, Transaction } from '@tronweb3/tronwallet-abstract-adapter';
import {
  Adapter,
  AdapterState,
  ChainNetwork,
  WalletConnectionError,
  WalletDisconnectedError,
  WalletDisconnectionError,
  WalletNotFoundError,
  WalletReadyState,
  WalletSignMessageError,
  WalletWindowClosedError,
} from '@tronweb3/tronwallet-abstract-adapter';
import { WalletConnectModal } from '@walletconnect/modal';
import UniversalProvider, {
  IUniversalProvider,
  UniversalProvider as UniversalTronProvider,
} from '@walletconnect/universal-provider';
import { getTronWeb } from '../../actions/tron/getTronweb.js';
import { tronMainnet } from '../../chains/tron.js';

const UniversalProviderType = UniversalProvider;
export enum TronChains {
  Mainnet = '0x2b6653dc',
  Devnet = '0xcd8690dc',
}

export const WalletConnectWalletName = 'WalletConnect' as AdapterName<'WalletConnect'>;
const NETWORK = Object.keys(ChainNetwork);

export interface WalletConnectAdapterConfig {
  network: `${ChainNetwork}` | string;
  options: {
    projectId: string;
    metadata: {
      name: string;
      description: string;
      url: string;
      icons: string[];
    };
  };
}

export class WalletConnectAdapter extends Adapter {
  name = WalletConnectWalletName;
  url = 'https://walletconnect.org';
  icon =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNjEuNDM4NTQsOTQuMDAzOGM0OC45MTEyMywtNDcuODg4MTcgMTI4LjIxMTk5LC00Ny44ODgxNyAxNzcuMTIzMjEsMGw1Ljg4NjU1LDUuNzYzNDJjMi40NDU1NiwyLjM5NDQxIDIuNDQ1NTYsNi4yNzY1MSAwLDguNjcwOTJsLTIwLjEzNjcsMTkuNzE1NWMtMS4yMjI3OCwxLjE5NzIxIC0zLjIwNTMsMS4xOTcyMSAtNC40MjgwOCwwbC04LjEwMDU4LC03LjkzMTE1Yy0zNC4xMjE2OSwtMzMuNDA3OTggLTg5LjQ0Mzg5LC0zMy40MDc5OCAtMTIzLjU2NTU4LDBsLTguNjc1MDYsOC40OTM2MWMtMS4yMjI3OCwxLjE5NzIgLTMuMjA1MywxLjE5NzIgLTQuNDI4MDgsMGwtMjAuMTM2NjksLTE5LjcxNTVjLTIuNDQ1NTYsLTIuMzk0NDEgLTIuNDQ1NTYsLTYuMjc2NTIgMCwtOC42NzA5Mmw2LjQ2MTAxLC02LjMyNTg4em0yMTguNzY3OCw0MC43NzM3NWwxNy45MjE3LDE3LjU0Njg5YzIuNDQ1NTQsMi4zOTQ0IDIuNDQ1NTYsNi4yNzY0OCAwLjAwMDAzLDguNjcwODlsLTgwLjgxMDE3LDc5LjEyMTE0Yy0yLjQ0NTU1LDIuMzk0NDIgLTYuNDEwNTksMi4zOTQ0NSAtOC44NTYxNiwwLjAwMDA2Yy0wLjAwMDAxLC0wLjAwMDAxIC0wLjAwMDAzLC0wLjAwMDAyIC0wLjAwMDA0LC0wLjAwMDAzbC01Ny4zNTQxNCwtNTYuMTU0NThjLTAuNjExMzksLTAuNTk4NiAtMS42MDI2NSwtMC41OTg2IC0yLjIxNDA0LDBjMCwwLjAwMDAxIC0wLjAwMDAxLDAuMDAwMDEgLTAuMDAwMDEsMC4wMDAwMmwtNTcuMzUyOTIsNTYuMTU0NTNjLTIuNDQ1NTQsMi4zOTQ0MyAtNi40MTA1OCwyLjM5NDQ3IC04Ljg1NjE2LDAuMDAwMDhjLTAuMDAwMDIsLTAuMDAwMDEgLTAuMDAwMDMsLTAuMDAwMDIgLTAuMDAwMDUsLTAuMDAwMDRsLTgwLjgxMjQyLC03OS4xMjIxOWMtMi40NDU1NiwtMi4zOTQ0IC0yLjQ0NTU2LC02LjI3NjUxIDAsLTguNjcwOTFsMTcuOTIxNzMsLTE3LjU0Njg3YzIuNDQ1NTYsLTIuMzk0NDEgNi40MTA2LC0yLjM5NDQxIDguODU2MTYsMGw1Ny4zNTQ5OCw1Ni4xNTUzNWMwLjYxMTM5LDAuNTk4NjEgMS42MDI2NSwwLjU5ODYxIDIuMjE0MDQsMGMwLjAwMDAxLDAgMC4wMDAwMiwtMC4wMDAwMSAwLjAwMDAzLC0wLjAwMDAybDU3LjM1MjEsLTU2LjE1NTMzYzIuNDQ1NSwtMi4zOTQ0NyA2LjQxMDU0LC0yLjM5NDU2IDguODU2MTYsLTAuMDAwMmMwLjAwMDAzLDAuMDAwMDMgMC4wMDAwNywwLjAwMDA3IDAuMDAwMSwwLjAwMDFsNTcuMzU0OSw1Ni4xNTU0M2MwLjYxMTM5LDAuNTk4NiAxLjYwMjY1LDAuNTk4NiAyLjIxNDA0LDBsNTcuMzUzOTgsLTU2LjE1NDMyYzIuNDQ1NTYsLTIuMzk0NDEgNi40MTA2LC0yLjM5NDQxIDguODU2MTYsMHoiIGZpbGw9IiMzYjk5ZmMiIGlkPSJzdmdfMSIvPjwvc3ZnPg==';

  private _readyState: WalletReadyState = WalletReadyState.Found;
  private _state: AdapterState = AdapterState.Disconnect;
  private _connecting: boolean;
  private _provider: IUniversalProvider | null;
  private _config: WalletConnectAdapterConfig;
  private _address: string | null;
  private _modal: WalletConnectModal;

  constructor(config: WalletConnectAdapterConfig) {
    super();
    if (!config || typeof config !== 'object') {
      throw new Error(`[WalletconnectAdapter] config is required.`);
    }
    if (!config.network) {
      console.error(
        `[WalletconnectAdapter] config.network must be one of ${NETWORK.join()} or a chainID such as 0x2b6653dc. Use Nile network instead.`,
      );
      config.network = '0x2b6653dc';
    }
    if (!config.options?.projectId) {
      throw new Error(`[WalletconnectAdapter] config.options.projectId is required.`);
    }

    this._connecting = false;
    this._provider = null;
    this._address = null;
    this._config = config;

    // Initialize modal
    this._modal = new WalletConnectModal({
      projectId: config.options.projectId,
      chains: [`tron:${this._config.network}`],
    });
  }

  get address() {
    return this._address;
  }

  get readyState() {
    return this._readyState;
  }

  get state() {
    return this._state;
  }

  get connecting() {
    return this._connecting;
  }

  async connect(): Promise<void> {
    try {
      if (this.connected || this.connecting) return;
      if (this.state === AdapterState.NotFound) throw new WalletNotFoundError();
      this._connecting = true;

      try {
        // Initialize provider if not already initialized
        console.log('start connecting werd');

        if (!this._provider) {
          this._provider = await UniversalTronProvider.init({
            logger: 'error',
            projectId: this._config.options.projectId,
            metadata: this._config.options.metadata,
          });

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          this._provider.on('display_uri', async (uri: string) => {
            await this._modal.openModal({ uri });
          });

          console.log('start connecting in1 ');
        }

        console.log('start connecting in2 ', this._config.network);

        // Connect to provider
        await this._provider.connect({
          optionalNamespaces: {
            tron: {
              methods: ['tron_signMessage', 'tron_signTransaction'],
              chains: [`tron:${this._config.network}`],
              events: [],
            },
          },
        });

        // Get address from session
        this._address = this._provider.session?.namespaces.tron?.accounts[0].split(':')[2] || null;

        if (!this._address) throw new WalletConnectionError();

        this._state = AdapterState.Connected;
        this.emit('stateChanged', this._state);
        this.emit('connect', this._address);
      } catch (error: any) {
        console.log('error', error);
        if (error.constructor.name === 'Web3ModalError') throw new WalletWindowClosedError();
        throw new WalletConnectionError(error?.message, error);
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    } finally {
      this._connecting = false;
      this._modal.closeModal();
    }
  }

  async disconnect(): Promise<void> {
    if (this.state === AdapterState.NotFound) {
      return;
    }

    if (this._provider) {
      try {
        await this._provider.disconnect();
      } catch (error: any) {
        this.emit('error', new WalletDisconnectionError(error?.message, error));
      }

      this._provider = null;
      this._address = null;
    }

    this._state = AdapterState.Disconnect;
    this.emit('disconnect');
    this.emit('stateChanged', this._state);
  }

  async signTransaction(transaction: Transaction): Promise<SignedTransaction> {
    if (this.state !== AdapterState.Connected) throw new WalletDisconnectedError();

    if (!this._provider) {
      throw new Error('Provider is required to sign a transaction.');
    }

    const address = 'TWnvMKB3zukqx8QsoJgDEhJfstbWi98rup';
    try {
      const tronWeb = getTronWeb(tronMainnet);
      const ethStyleAddress = tronWeb.address.toHex(address).replace(/^41/, '0x');

      // Step 1: Get quote from Router Protocol
      const quoteResponse = await fetch(
        'https://api-beta.pathfinder.routerprotocol.com/api/v2/quote?fromTokenAddress=0xa614f803b6fd780986a42c78ec9c7f77e6ded13c&toTokenAddress=0xc2132d05d31c914a87c6611c10748aeb04b58e8f&amount=5000000&fromTokenChainId=728126428&toTokenChainId=137&slippageTolerance=2&destFuel=0&partnerId=1',
        {
          headers: {
            accept: '*/*',
            origin: 'https://routernitro.com',
            referer: 'https://routernitro.com/',
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
          },
        },
      );

      const quoteData = await quoteResponse.json();
      console.log('Quote data received:', JSON.stringify(quoteData, null, 2));

      const requestBody = JSON.stringify({
        ...quoteData,
        senderAddress: ethStyleAddress,
        receiverAddress: "0x67Ae61317122F081e640AA979056d406b93FbBA9",
      });
      console.log('Request body:', requestBody);
      // Step 2: Get transaction data from Router Protocol
      const transactionResponse = await fetch('https://api-beta.pathfinder.routerprotocol.com/api/v2/transaction', {
        method: 'POST',
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          origin: 'https://routernitro.com',
          referer: 'https://routernitro.com/',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        },
        body: requestBody,
      });

      const transactionData = await transactionResponse.json();
      console.log('Transaction data received:', JSON.stringify(transactionData, null, 2));

      // Step 3: Extract the transaction object from the response
      const transaction = { result: { result: true }, transaction: transactionData.txn };
      console.log('transaction: ', transaction);
      // if (!transaction || !transaction.transaction || !transaction.transaction.raw_data || !transaction.transaction.raw_data.contract) {
      //   throw new Error("Invalid transaction format received from Router Protocol");
      // }

      console.log('Transaction to sign:', JSON.stringify(transaction, null, 2));

      // Step 4: Request the signature via WalletConnect
      const signedTransaction = await this._provider!.request<{ result: unknown }>(
        {
          method: 'tron_signTransaction',
          params: { address, transaction },
        },
        `tron:${TronChains.Mainnet}`,
      );

      console.log('Signed transaction res:', JSON.stringify(signedTransaction, null, 2));

      const tx = signedTransaction.result;

      // Step 5: Send the transaction to the network

      //       const signedTx: any = signedTransaction.result;
      // const tx = {
      //   visible: signedTx.visible,
      //   txID: signedTx.txID,
      //   raw_data: signedTx.raw_data,
      //   raw_data_hex: signedTx.raw_data_hex,
      //   signature: signedTx.signature
      // };

      // const result = await tronWeb.trx.sendRawTransaction(tx);

      return tx;
    } catch (error: any) {
      console.error('Transaction error:', error);
      throw new Error(`Transaction failed: ${error.message || 'Unknown error'}`);
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      if (!this._provider) throw new WalletDisconnectedError();

      try {
        const signature = await this._provider.request({
          method: 'tron_signMessage',
          params: [message],
        });
        return signature as string;
      } catch (error: any) {
        throw new WalletSignMessageError(error?.message, error);
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }
}
