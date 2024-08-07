import { WalletProviderFlags, WindowProvider } from '../../types/evm.js';

/*
 * Checks if the explict provider or window ethereum exists
 */
export function hasInjectedProvider({ flag, namespace }: { flag?: WalletProviderFlags; namespace?: string }): boolean {
  if (namespace && typeof getWindowProviderNamespace(namespace) !== 'undefined') return true;
  if (flag && typeof getExplicitInjectedProvider(flag) !== 'undefined') return true;
  return false;
}

/*
 * Returns the explicit window provider that matches the flag and the flag is true
 */
function getExplicitInjectedProvider(flag: WalletProviderFlags) {
  const _window = typeof window !== 'undefined' ? (window as WindowProvider) : undefined;
  if (typeof _window === 'undefined' || typeof _window.ethereum === 'undefined') return;
  const providers = _window.ethereum.providers;
  return providers
    ? providers.find((provider: any) => provider[flag])
    : _window.ethereum[flag]
      ? _window.ethereum
      : undefined;
}

/*
 * Gets the `window.namespace` window provider if it exists
 */
function getWindowProviderNamespace(namespace: string) {
  const providerSearch = (provider: any, namespace: string): any => {
    const [property, ...path] = namespace.split('.');
    const _provider = provider[property];
    if (_provider) {
      if (path.length === 0) return _provider;
      return providerSearch(_provider, path.join('.'));
    }
  };
  if (typeof window !== 'undefined') return providerSearch(window, namespace);
}
