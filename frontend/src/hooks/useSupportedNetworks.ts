import { useState, useEffect } from 'react';
import { NetworkConfig } from '../types';
import { veilpayApi } from '../services/veilpayApi';

const FALLBACK_NETWORKS: NetworkConfig[] = [
  // ── Ethereum (ERC-20) ───────────────────────────────────────────────────
  {
    chainKey: 'ethereum',
    label: 'Ethereum',
    shortLabel: 'ETH',
    color: '#627EEA',
    logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
  // ── Tron (TRC-20) — largest USDT volume globally ─────────────────────
  {
    chainKey: 'tron',
    label: 'Tron',
    shortLabel: 'TRX',
    color: '#FF060A',
    logoUrl: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
    tokens: [
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
  // ── BNB Smart Chain (BEP-20) ────────────────────────────────────────────
  {
    chainKey: 'bsc',
    label: 'BNB Chain',
    shortLabel: 'BSC',
    color: '#F3BA2F',
    logoUrl: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 18 },
      { symbol: 'USDT', label: 'Tether', decimals: 18 },
    ],
  },
  // ── Polygon PoS ─────────────────────────────────────────────────────────
  {
    chainKey: 'polygon',
    label: 'Polygon',
    shortLabel: 'POL',
    color: '#8247E5',
    logoUrl: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
  // ── Solana (SPL) ────────────────────────────────────────────────────────
  {
    chainKey: 'solana',
    label: 'Solana',
    shortLabel: 'SOL',
    color: '#14F195',
    logoUrl: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
  // ── Arbitrum One (L2) ───────────────────────────────────────────────────
  {
    chainKey: 'arbitrum',
    label: 'Arbitrum One',
    shortLabel: 'ARB',
    color: '#2D374B',
    logoUrl: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
  // ── Base (L2, Coinbase) ─────────────────────────────────────────────────
  {
    chainKey: 'base',
    label: 'Base',
    shortLabel: 'BASE',
    color: '#0052FF',
    logoUrl: 'https://assets.coingecko.com/asset_platforms/images/131/small/base-network.png',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
  // ── Optimism (L2) ───────────────────────────────────────────────────────
  {
    chainKey: 'optimism',
    label: 'Optimism',
    shortLabel: 'OP',
    color: '#FF0420',
    logoUrl: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
  // ── Avalanche C-Chain ───────────────────────────────────────────────────
  {
    chainKey: 'avalanche',
    label: 'Avalanche',
    shortLabel: 'AVAX',
    color: '#E84142',
    logoUrl: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
  // ── zkSync Era (L2 ZK-rollup) ───────────────────────────────────────────
  {
    chainKey: 'zksync',
    label: 'zkSync Era',
    shortLabel: 'ZKS',
    color: '#4E529A',
    logoUrl: 'https://assets.coingecko.com/coins/images/38043/small/ZKTokenBlack.png',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
  // ── NEAR Protocol ───────────────────────────────────────────────────────
  {
    chainKey: 'near',
    label: 'NEAR Protocol',
    shortLabel: 'NEAR',
    color: '#00C08B',
    logoUrl: 'https://assets.coingecko.com/coins/images/10365/small/near.jpg',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
      { symbol: 'USDT', label: 'Tether', decimals: 6 },
    ],
  },
  // ── Stellar (native Circle USDC) ────────────────────────────────────────
  {
    chainKey: 'stellar',
    label: 'Stellar',
    shortLabel: 'XLM',
    color: '#7D00FF',
    logoUrl: 'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 7 },
    ],
  },
  // ── Hedera (native Circle USDC) ─────────────────────────────────────────
  {
    chainKey: 'hedera',
    label: 'Hedera',
    shortLabel: 'HBAR',
    color: '#222222',
    logoUrl: 'https://assets.coingecko.com/coins/images/3688/small/hbar.png',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
    ],
  },
  // ── Celo ────────────────────────────────────────────────────────────────
  {
    chainKey: 'celo',
    label: 'Celo',
    shortLabel: 'CELO',
    color: '#35D07F',
    logoUrl: 'https://assets.coingecko.com/coins/images/11090/small/InjXBNx9_400x400.jpg',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
    ],
  },
  // ── Fantom / Sonic ──────────────────────────────────────────────────────
  {
    chainKey: 'fantom',
    label: 'Fantom',
    shortLabel: 'FTM',
    color: '#1969FF',
    logoUrl: 'https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
    ],
  },
  // ── Algorand (native Circle USDC; USDT ended Sep 2025) ──────────────────
  {
    chainKey: 'algorand',
    label: 'Algorand',
    shortLabel: 'ALGO',
    color: '#000000',
    logoUrl: 'https://assets.coingecko.com/coins/images/4380/small/download.png',
    tokens: [
      { symbol: 'USDC', label: 'USD Coin', decimals: 6 },
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
