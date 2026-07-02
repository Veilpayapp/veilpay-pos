import { useState, useEffect } from 'react';
import { NetworkConfig } from '../types';
import { veilpayApi } from '../services/veilpayApi';

const FALLBACK_NETWORKS: NetworkConfig[] = [
  {
    chainKey: 'ethereum',
    label: 'Ethereum Mainnet',
    shortLabel: 'ETH',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
  {
    chainKey: 'polygon',
    label: 'Polygon',
    shortLabel: 'MATIC',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
  {
    chainKey: 'bsc',
    label: 'BNB Smart Chain',
    shortLabel: 'BSC',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 18 },
      { symbol: 'USDT', label: 'Tether', decimals: 18 },
    ],
  },
  {
    chainKey: 'tron',
    label: 'Tron Network',
    shortLabel: 'TRX',
    tokens: [
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
  {
    chainKey: 'solana',
    label: 'Solana',
    shortLabel: 'SOL',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
];

const CACHE_KEY = 'veilpay_networks';
const RETRY_DELAY_MS = 3000;

const isNetworkConfigArray = (value: unknown): value is NetworkConfig[] => {
  return Array.isArray(value) && value.every(
    (n): n is NetworkConfig =>
      typeof n === 'object' && n !== null &&
      typeof (n as NetworkConfig).chainKey === 'string' &&
      Array.isArray((n as NetworkConfig).tokens)
  );
};

const safeSessionGet = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSessionSet = (key: string, value: string): void => {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // sessionStorage unavailable (e.g. kiosk privacy mode)
  }
};

export const useSupportedNetworks = () => {
  const [networks, setNetworks] = useState<NetworkConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: ReturnType<typeof setTimeout>;
    const controller = new AbortController();

    const fetchNetworks = async (isRetry = false) => {
      try {
        const cached = safeSessionGet(CACHE_KEY);
        if (cached && !isRetry) {
          const parsed: unknown = JSON.parse(cached);
          if (isNetworkConfigArray(parsed) && parsed.length > 0) {
            setNetworks(parsed);
            setLoading(false);
            return;
          }
        }

        const response = await veilpayApi.get('/api/v1/networks/supported', { signal: controller.signal });
        const data = (response.data as { networks?: NetworkConfig[] } | undefined)?.networks;
        
        if (Array.isArray(data) && data.length > 0) {
          if (isMounted) {
            setNetworks(data);
            safeSessionSet(CACHE_KEY, JSON.stringify(data));
            setLoading(false);
          }
        } else {
          throw new Error('Empty networks returned');
        }
      } catch {
        if (controller.signal.aborted) return;
        if (!isRetry && isMounted) {
          retryTimeout = setTimeout(() => {
            fetchNetworks(true);
          }, RETRY_DELAY_MS);
        } else if (isMounted) {
          setNetworks(FALLBACK_NETWORKS);
          setError('Failed to fetch from backend, using fallbacks');
          setLoading(false);
        }
      }
    };

    fetchNetworks();

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(retryTimeout);
    };
  }, []);

  return { networks, loading, error };
};
