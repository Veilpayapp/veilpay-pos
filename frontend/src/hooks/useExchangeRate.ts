import { useState, useEffect, useCallback } from 'react';
import { EXCHANGE_RATE_REFRESH_MS } from '../data/currencies';

interface ExchangeRateState {
  rate: number | null;
  lastUpdated: number | null;
  loading: boolean;
  error: string | null;
}

const CACHE_KEY = 'veilpay_exchange_rates';
const CACHE_TTL_MS = 300000;

interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
}

const readCache = (): CachedRates | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedRates;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeCache = (rates: Record<string, number>): void => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ rates, timestamp: Date.now() }));
  } catch {
    // sessionStorage unavailable
  }
};

export const useExchangeRate = (currencyCode: string) => {
  const [state, setState] = useState<ExchangeRateState>({
    rate: null,
    lastUpdated: null,
    loading: true,
    error: null,
  });

  const fetchRate = useCallback(async (code: string): Promise<void> => {
    if (code === 'USD') {
      setState({ rate: 1, lastUpdated: Date.now(), loading: false, error: null });
      return;
    }

    const cached = readCache();
    if (cached && cached.rates[code]) {
      setState({ rate: cached.rates[code], lastUpdated: cached.timestamp, loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch('https://open.er-api.com/v6/latest/USD', { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) throw new Error('Failed to fetch rates');
      const data = await response.json() as { rates?: Record<string, number> };
      const rates = data.rates ?? {};
      const rate = rates[code];
      if (!rate) throw new Error(`No rate for ${code}`);

      writeCache(rates);
      setState({ rate, lastUpdated: Date.now(), loading: false, error: null });
    } catch {
      setState(prev => ({ ...prev, loading: false, error: 'Live rate unavailable' }));
    }
  }, []);

  useEffect(() => {
    fetchRate(currencyCode);
    const id = setInterval(() => fetchRate(currencyCode), EXCHANGE_RATE_REFRESH_MS);
    return () => clearInterval(id);
  }, [currencyCode, fetchRate]);

  return state;
};
