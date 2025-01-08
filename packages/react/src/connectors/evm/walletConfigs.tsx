import { hasInjectedProvider } from '../../actions/evm/getInjectedConnector.js';
import { isAndroid, isIOS, isMobile } from '../../utils/index.js';

/**
 * EIP-6963: Multi Injected Provider Discovery
 * https://eips.ethereum.org/EIPS/eip-6963
 *
 */
export type WalletConfigProps = {
  // Wallets name
  name?: string;
  // Links to download the wallet
  url?: string;
  icon?: string;
  isInstalled: boolean | (() => boolean) | undefined;
  hide?: boolean;
  // Create URI for QR code, where uri is encoded data from WalletConnect
  getWalletConnectDeeplink?: (uri: string) => string;
};

// Organised in alphabetical order by key
export const walletConfigs: {
  [rdns: string]: WalletConfigProps; // for multiple cases seperate rdns by comma
} = {
  argent: {
    name: 'Argent',
    getWalletConnectDeeplink: (uri: string) => {
      return isAndroid() ? uri : `https://argent.link/app/wc?uri=${encodeURIComponent(uri)}`;
    },
    isInstalled: () =>
      isMobile() ? hasInjectedProvider({ flag: 'isTrust' }) : hasInjectedProvider({ flag: 'isTrustWallet' }),
  },
  'coinbaseWallet, com.coinbase.wallet': {
    name: 'Coinbase Injected Wallet',
    url: '',
    getWalletConnectDeeplink: (uri: string) => {
      return `${uri}`;
    },
    isInstalled: false,
    icon: '',
    hide: true,
  },
  coinbaseWalletSDK: {
    name: 'Coinbase Wallet',
    url: 'https://www.coinbase.com/wallet/getting-started-extension',
    getWalletConnectDeeplink: (uri: string) => {
      return `https://go.cb-w.com/wc?uri=${encodeURIComponent(uri)}`;
    },
    isInstalled: true,
    icon: 'data:image/jpeg;base64,UklGRqYDAABXRUJQVlA4TJoDAAAvP8APEOcGoZEkR1Keoff8ydxUnH0MDNu2DSPs513fWJp/ppFkxWokisLh0IRADOQfy/kPo23bwA45OyPQvwAFIEQQIQpQfN3Fe30JvihEbICimIgCkBfxl7ZBzgN8WQkRhZgUj8eOc0yIKMhkY+Mc5GX7yIUx2SgmGyQRoCgGghQTAhIxOVJcoBgUiQHI4zG5xKAoQDG4hBAiWRiAfELP8cmafHImBRCkOEchCCgmBZmIQhQEiFfod1bxzxcu8CkLf3jCHyYkAO4ooV4AeghhhABCvEDIf792+YC0a9sLSaqMbdvG2rZt27Z3Z23btm0j3dvvm+6x/s1MUklq8TWi/xNgGIazrNpho9rbHNXlTqOhq8pOLWqvdBmG4aqlFq51Gc4qaulKZ7ndWvbyGmrxaocs0MZhk6Wvjf7fAiACmAFtgMH7h9cvXb75+CMyENEV4c6Wsd2apMbGpbXoNWH3A0C98Mfp0fk+RNC3+cTLABrhjVHxxHT65HuoC/zc2oxIbXsI9IAPdeFEcuLqbzrAh0k+RHrIwh8a/KjzIQpD14IyLAknSlOOoCK83pQo7vQI1HwbQYRju46cPm1Yp0ghj9lq8FSsSPToM2+QMXh1YkiYAMm5ASp+jSCCLff/QtoofinJEXCbgwrgdq5Ay3OMCrKj2TzS7hnIYxu8eTEHGBXG9UG80GMoD0YS/phf1OSn/jwyl8l704UXexbNsP1BvIE/pcH9Al63t9QsPGlNPBolHV9Lw6tJvNFoiv7Yt3Rlo8u2fZB3IYY3k5mjyLhI5V0UmGGRa8m84WDu+8bpsxqdvuadNHhYzOv82hQ8KCbcjq+l0ffdeVEn0Qzb6ccb/EsejuORod9MwJvehL+AyWPbfXjhO5gYrvDlRZxEeXC3iEfyTjABwF1JhN/pJcijMF6A5Gz6zKABsLerkgnfcxFShXg+VYAEDzr89Cfit8d7+vgRwaZ3QAX9NUGEkJA2A0aP6tfKn4h6LUaqFO60EZLa8xmoobg3Vk3WGaSqYUmAipgSpOq/zAmUF7MOqIbwdXmCrMzNQPWEg+3cZXj1OI1UV7w/JdOUe+GCp0j1BbgytU2QSFiH+bcQqNaITw7X921XmJFV3H7AvOPPEaj2gOzbiwd37jx89ZMhUKsCANB/SrCcTJvVbA5ZoI2jWpa+1WV2a9nLnFXWqnQarlor1boMwyit+G0Ve5XLaOgsq3HY9LM5asqdhmEA',
  },
  'com.crypto.wallet': {
    name: 'Crypto.com',
    isInstalled: true,
  },
  'co.family.wallet': {
    name: 'Family',
    url: 'https://family.co',
    isInstalled: undefined,
    getWalletConnectDeeplink: (uri: string) => {
      return isAndroid() ? uri : `familywallet://wc?uri=${encodeURIComponent(uri)}`;
    },
  },
  frame: {
    name: 'Frame',
    url: 'https://frame.sh',
    isInstalled: hasInjectedProvider({ flag: 'isFrame' }),
    getWalletConnectDeeplink: (uri: string) => uri,
  },
  frontier: {
    name: 'Frontier Wallet',

    url: 'https://frontier.xyz/',

    getWalletConnectDeeplink: (uri: string) => {
      return isAndroid() ? uri : `frontier://wc?uri=${encodeURIComponent(uri)}`;
    },
    isInstalled: true,
  },
  injected: {
    name: window.ethereum?.isMetaMask ? 'MetaMask' : 'Browser Wallet',
    isInstalled: () => Boolean(window.ethereum),
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='35' height='33' fill='none'%3e %3cg stroke-linecap='round' stroke-linejoin='round' stroke-width='.25'%3e %3cpath fill='%23e17726' stroke='%23e17726' d='m32.958 1-13.134 9.718 2.442-5.727z'/%3e %3cg fill='%23e27625' stroke='%23e27625'%3e %3cpath d='m2.663 1 13.017 9.809-2.325-5.818zM28.23 23.534l-3.495 5.338 7.483 2.06 2.143-7.282zm-26.957.116 2.13 7.282 7.47-2.06-3.481-5.339z'/%3e %3cpath d='M10.47 14.515 8.393 17.65l7.405.337-.247-7.97zm14.68 0-5.157-4.587-.169 8.06 7.405-.337zM10.873 28.872l4.482-2.164-3.858-3.006zm9.393-2.164 4.469 2.164-.61-5.17z'/%3e %3c/g%3e %3cpath fill='%23d5bfb2' stroke='%23d5bfb2' d='m24.735 28.872-4.47-2.164.365 2.903-.04 1.23zm-13.862 0 4.157 1.97-.026-1.231.351-2.903z'/%3e %3cpath fill='%23233447' stroke='%23233447' d='m15.108 21.784-3.715-1.088 2.624-1.205zm5.405 0 1.09-2.293 2.638 1.205z'/%3e %3cpath fill='%23cc6228' stroke='%23cc6228' d='m10.873 28.872.65-5.338-4.131.116zm13.225-5.338.637 5.338 3.494-5.222zm3.132-5.884-7.406.338.689 3.796 1.09-2.293 2.638 1.205zm-15.837 3.046 2.624-1.205 1.091 2.293.689-3.796-7.405-.337z'/%3e %3cpath fill='%23e27525' stroke='%23e27525' d='m8.392 17.65 3.105 6.052-.104-3.006zm15.849 3.046-.117 3.006 3.105-6.051zm-8.444-2.708-.689 3.796.87 4.484.196-5.91zm4.027 0-.364 2.358.182 5.922.87-4.484z'/%3e %3cpath fill='%23f5841f' stroke='%23f5841f' d='m20.513 21.784-.87 4.484.623.44 3.858-3.006.117-3.006zm-9.12-1.088.104 3.006 3.858 3.006.624-.44-.87-4.484z'/%3e %3cpath fill='%23c0ac9d' stroke='%23c0ac9d' d='m20.59 30.842.04-1.231-.338-.285h-4.963l-.325.285.026 1.23-4.157-1.969 1.455 1.192 2.95 2.035h5.053l2.962-2.035 1.442-1.192z'/%3e %3cpath fill='%23161616' stroke='%23161616' d='m20.266 26.708-.624-.44H15.98l-.624.44-.35 2.903.324-.285h4.963l.338.285z'/%3e %3cpath fill='%23763e1a' stroke='%23763e1a' d='M33.517 11.353 34.62 5.99 32.958 1l-12.692 9.394 4.885 4.12 6.898 2.01 1.52-1.776-.663-.48 1.053-.958-.806-.622 1.052-.804zM1 5.989l1.117 5.364-.714.532 1.065.803-.805.622 1.052.959-.663.48 1.52 1.774 6.899-2.008 4.884-4.12L2.663 1z'/%3e %3cpath fill='%23f5841f' stroke='%23f5841f' d='m32.049 16.523-6.898-2.008 2.078 3.136-3.105 6.051 4.106-.052h6.131zM10.47 14.515l-6.898 2.008-2.3 7.127h6.12l4.105.052-3.105-6.051zm9.354 3.473.442-7.594 2-5.403h-8.911l2 5.403.442 7.594.169 2.384.013 5.896h3.663l.013-5.896z'/%3e %3c/g%3e %3c/svg%3e",
  },
  'metaMask, metaMask-io, io.metamask, io.metamask.mobile, metaMaskSDK': {
    name: 'MetaMask',
    url: 'https://metamask.io/download/',
    getWalletConnectDeeplink: (uri: string) => {
      return isAndroid()
        ? uri
        : isIOS()
          ? // currently broken in MetaMask v6.5.0 https://github.com/MetaMask/metamask-mobile/issues/6457
            `metamask://wc?uri=${encodeURIComponent(uri)}`
          : `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`;
    },
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='35' height='33' fill='none'%3e %3cg stroke-linecap='round' stroke-linejoin='round' stroke-width='.25'%3e %3cpath fill='%23e17726' stroke='%23e17726' d='m32.958 1-13.134 9.718 2.442-5.727z'/%3e %3cg fill='%23e27625' stroke='%23e27625'%3e %3cpath d='m2.663 1 13.017 9.809-2.325-5.818zM28.23 23.534l-3.495 5.338 7.483 2.06 2.143-7.282zm-26.957.116 2.13 7.282 7.47-2.06-3.481-5.339z'/%3e %3cpath d='M10.47 14.515 8.393 17.65l7.405.337-.247-7.97zm14.68 0-5.157-4.587-.169 8.06 7.405-.337zM10.873 28.872l4.482-2.164-3.858-3.006zm9.393-2.164 4.469 2.164-.61-5.17z'/%3e %3c/g%3e %3cpath fill='%23d5bfb2' stroke='%23d5bfb2' d='m24.735 28.872-4.47-2.164.365 2.903-.04 1.23zm-13.862 0 4.157 1.97-.026-1.231.351-2.903z'/%3e %3cpath fill='%23233447' stroke='%23233447' d='m15.108 21.784-3.715-1.088 2.624-1.205zm5.405 0 1.09-2.293 2.638 1.205z'/%3e %3cpath fill='%23cc6228' stroke='%23cc6228' d='m10.873 28.872.65-5.338-4.131.116zm13.225-5.338.637 5.338 3.494-5.222zm3.132-5.884-7.406.338.689 3.796 1.09-2.293 2.638 1.205zm-15.837 3.046 2.624-1.205 1.091 2.293.689-3.796-7.405-.337z'/%3e %3cpath fill='%23e27525' stroke='%23e27525' d='m8.392 17.65 3.105 6.052-.104-3.006zm15.849 3.046-.117 3.006 3.105-6.051zm-8.444-2.708-.689 3.796.87 4.484.196-5.91zm4.027 0-.364 2.358.182 5.922.87-4.484z'/%3e %3cpath fill='%23f5841f' stroke='%23f5841f' d='m20.513 21.784-.87 4.484.623.44 3.858-3.006.117-3.006zm-9.12-1.088.104 3.006 3.858 3.006.624-.44-.87-4.484z'/%3e %3cpath fill='%23c0ac9d' stroke='%23c0ac9d' d='m20.59 30.842.04-1.231-.338-.285h-4.963l-.325.285.026 1.23-4.157-1.969 1.455 1.192 2.95 2.035h5.053l2.962-2.035 1.442-1.192z'/%3e %3cpath fill='%23161616' stroke='%23161616' d='m20.266 26.708-.624-.44H15.98l-.624.44-.35 2.903.324-.285h4.963l.338.285z'/%3e %3cpath fill='%23763e1a' stroke='%23763e1a' d='M33.517 11.353 34.62 5.99 32.958 1l-12.692 9.394 4.885 4.12 6.898 2.01 1.52-1.776-.663-.48 1.053-.958-.806-.622 1.052-.804zM1 5.989l1.117 5.364-.714.532 1.065.803-.805.622 1.052.959-.663.48 1.52 1.774 6.899-2.008 4.884-4.12L2.663 1z'/%3e %3cpath fill='%23f5841f' stroke='%23f5841f' d='m32.049 16.523-6.898-2.008 2.078 3.136-3.105 6.051 4.106-.052h6.131zM10.47 14.515l-6.898 2.008-2.3 7.127h6.12l4.105.052-3.105-6.051zm9.354 3.473.442-7.594 2-5.403h-8.911l2 5.403.442 7.594.169 2.384.013 5.896h3.663l.013-5.896z'/%3e %3c/g%3e %3c/svg%3e",
    isInstalled: hasInjectedProvider({ flag: 'isMetaMask' }),
  },
  'app.phantom': {
    name: 'Phantom',
    isInstalled: hasInjectedProvider({ namespace: 'phantom.ethereum' }),
  },
  'me.rainbow': {
    name: 'Rainbow Wallet',

    url: 'https://rainbow.me/?utm_source=connectkit',

    getWalletConnectDeeplink: (uri: string) => {
      return isAndroid()
        ? uri
        : isIOS()
          ? `rainbow://wc?uri=${encodeURIComponent(uri)}&connector=rainbowkit`
          : `https://rnbwapp.com/wc?uri=${encodeURIComponent(uri)}&connector=rainbowkit`;
    },
    isInstalled: hasInjectedProvider({ flag: 'isRainbow' }),
  },
  'io.rabby': {
    name: 'Rabby Wallet',

    url: 'https://rabby.io',
    isInstalled: true,
  },
  safe: {
    name: 'Safe',

    url: 'https://safe.global/',

    getWalletConnectDeeplink: (uri: string) => {
      return isAndroid() ? uri : `https://gnosis-safe.io/wc?uri=${encodeURIComponent(uri)}`;
    },
    isInstalled: true,
  },
  'xyz.talisman': {
    name: 'Talisman',

    url: 'https://talisman.xyz',
    isInstalled: true,
  },
  'com.trustwallet.app': {
    name: 'Trust Wallet',

    getWalletConnectDeeplink(uri) {
      return isAndroid() ? uri : `https://link.trustwallet.com/wc?uri=${encodeURIComponent(uri)}`;
    },
    isInstalled: true,
  },
  infinityWallet: {
    name: 'Infinity Wallet',

    url: 'https://infinitywallet.io/download',
    isInstalled: true,
  },
  imToken: {
    name: 'imToken',

    //url: 'https://support.token.im/hc/en-us/categories/360000925393',

    getWalletConnectDeeplink: (uri: string) => {
      return `imtokenv2://wc?uri=${encodeURIComponent(uri)}`;
    },
    isInstalled: true,
  },
  unstoppable: {
    name: 'Unstoppable',

    getWalletConnectDeeplink: (uri: string) => {
      return isAndroid() ? uri : `https://unstoppable.money/wc?uri=${encodeURIComponent(uri)}`;
    },
    isInstalled: true,
  },
  onto: {
    name: 'ONTO',

    url: 'https://onto.app/en/download/',

    getWalletConnectDeeplink: (uri: string) => {
      return isAndroid() ? uri : `https://onto.app/wc?uri=${encodeURIComponent(uri)}`;
    },
    isInstalled: true,
  },
  steak: {
    name: 'Steak',

    url: 'https://steakwallet.fi/download',

    getWalletConnectDeeplink: (uri: string) => {
      return isAndroid() ? uri : `https://links.steakwallet.fi/wc?uri=${encodeURIComponent(uri)}`;
    },
    isInstalled: true,
  },
  ledger: {
    name: 'Ledger Live',

    url: 'https://www.ledger.com/ledger-live/download#download-device-2',

    getWalletConnectDeeplink: (uri: string) => {
      return isAndroid() ? uri : `ledgerlive://wc?uri=${encodeURIComponent(uri)}`;
    },
    isInstalled: true,
  },
  zerion: {
    name: 'Zerion',

    url: 'https://zerion.io/',

    getWalletConnectDeeplink: (uri: string) => {
      return isAndroid() ? uri : `https://app.zerion.io/wc?uri=${encodeURIComponent(uri)}`;
    },
    isInstalled: true,
  },
  slope: {
    name: 'Slope',

    url: 'https://slope.finance/',

    getWalletConnectDeeplink: (uri: string) => {
      return isAndroid() ? uri : `https://slope.finance/app/wc?uri=${encodeURIComponent(uri)}`;
    },
    isInstalled: true,
  },
  tokenPocket: {
    name: 'TokenPocket Wallet',

    url: 'https://www.tokenpocket.pro/en/download/app',
    isInstalled: true,
  },
  talisman: {
    name: 'Talisman',

    url: 'https://talisman.xyz',
    isInstalled: true,
  },
  walletConnect: {
    name: 'Wallet Connect',
    getWalletConnectDeeplink: (uri: string) => uri,
    isInstalled: true,
    icon: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAAAAAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCABAAEADASIAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAwIHCAUG/8QALRAAAQIEBAYCAgMBAQAAAAAAAQIDAAQFEQYHCDETITJBQmESURRxFSOBIjP/xAAaAQACAwEBAAAAAAAAAAAAAAABAwIFBwQI/8QALBEAAQMCBQMDAwUAAAAAAAAAAQIDBAARBQYhMUETUWESQsEUIzJxgbHw8f/aAAwDAQACEQMRAD8A5hNogpf1Bqc9wanPcezQms7vSKcg1OQanINS/cTCaFIpy+0GpcGpZiBcAhgTUb1NSzEFOWglOQal+4YE0K6ilwal+4NS49dQspMxMTYMqOP6HhqYmqLTCeK8nrcCetTSN3AjyKdue9jbjkSWIaQuQsJBIAJIGp2GvJpiUqcNkC9eiyd0/wCNs5HlTdO4dMobLnDfqkyglBUN0NIHN1Y72IA7kbRp+iaM8mKFJocxE9Vau4BZb83P/jNk+kt/ED9FRijMuNYFcwDlg5go0CXnajT2ksUSc5JZbbJN+OgWKym90lPVeytrmrEzOaGe+MmaY5P1LEdaqCz8EPPHhNJ8lW6Gm0jcgAAe7Xz7EYGZ8WlPKfkiJFbJsUnUga+okFJtbe5AG1tCatWXYbCEhKOos9+PHNbErujHJevya3MOvVakOEWQ/KT/AOS2D7S58gf0FCMsZ0ae8b5MvJnKjw6pQn3OGxVZVBCAo7IdQblpZ7XJSexO0eedms0ch8Zv0xqfqWG61T1grQy6eE6nxV8f/N5tQHIkEH93tZWaGsLEOYeWLOB00KXp87PtFqvTgspp5sEEBhBvw/lYFRPNNrJPcTwvD8z4VLYUxJEuK4RcqOoB19QJKjttYkE6Eag0H3YT7agpHTWO38cVQCnINTkewxFk/mRhfBVNzDruGJiVolVI4TyutsK6FOo6mgvxKt/VxfwynI0qJJjzUlcZYWASCQQdRuNORVO4hTZssWrrKc+jGttK2pqRlZWnZU49mGZRLATK0WpEBDdtky7x2BubJX32VzsTkFS4JawQQbEHe8U+P5diZjhmJKHlJG6T3HyORXRFlrhudRv/AGtoagdIE3X62jFeUcrKsu1CYSmo0tbgZZbUtXOYaJ5JTzutH7KRumLMwRgbLXSnlzOV2t1Fvj8NJqlVWj+6cd8WGUb2vcIbG/Urncii9P2sdnC1EXhPNp+dnJWQlyaZUmmy8+QkcpZ0bq+kOHbZRtZUUnnbnjijOvEn8pVyZOlyhUmmUtC7tyqDuonzdULfJf8AgsBaMyYyzmjF3E4DijhERo3Kxu4n2gHm3n8d1XISKuVTYUcfVMj7iuOx5/T545rb2OcCZaarsuJSu0Sot/kcNRpdVbR/dJu+bDyN7XsFtnbqTzsTV+nvR1N0CuLxbm/KSr71OmVJp1KQ4l5lxaFcpl0jkpJtdCD6KhsmM3ZKZ54oySxL/K0gmcpc2UpqdLWv4tzSB5A+DqRf4r/w3BtF0ah9ZjWKqEjCOUT87Jy1QlwanU3WyzMBKhzlmhuk9luDfZJtdUSeyzmnCXFYBhThMR43Czu2n3An238flumxKhQTNgvgSnx9xPHc8f3jniutq11RyM1KVLKXL6YZm0TAVK1upgBxu1/+pdk7KNxZa9hsnncjG6nLwZUALdhsBBqc+o1bLmXImW4QhxB5Uo7qPc/A4FUcuW5Mc6jn7eK6qnPcEpz3BqXBqci5Ca570inINTkGpfuDU59QwJoUil/cGpz6g1L+4NTnYQwJqN6RS/swanIgpcQJvDAmhX//2Q==',
  },
} as const;
