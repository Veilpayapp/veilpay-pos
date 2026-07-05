import { useState, useEffect, useRef, useCallback } from 'react';

export type SignalStrength = 'healthy' | 'mid' | 'poor' | 'offline';

export interface NetworkStatus {
  strength: SignalStrength;
  online: boolean;
  latencyMs: number | null;
  checking: boolean;
}

const PING_ENDPOINTS = [
  'https://www.google.com/favicon.ico',
  'https://cloudflare.com/cdn-cgi/trace',
  'https://open.er-api.com/v6/latest/USD',
];

const PING_INTERVAL_MS = 5000;
const PING_TIMEOUT_MS = 4000;
const FAST_INTERVAL_MS = 2000;
const HEALTHY_THRESHOLD = 600;
const MID_THRESHOLD = 1800;

interface PingResult {
  reachable: boolean;
  latency: number;
}

const pingEndpoint = async (url: string): Promise<PingResult> => {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
    await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return { reachable: true, latency: Math.round(performance.now() - start) };
  } catch {
    return { reachable: false, latency: -1 };
  }
};

const measureNetwork = async (): Promise<{ strength: SignalStrength; latency: number | null }> => {
  let bestLatency = -1;

  for (const url of PING_ENDPOINTS) {
    const result = await pingEndpoint(url);
    if (result.reachable) {
      bestLatency = bestLatency < 0 ? result.latency : Math.min(bestLatency, result.latency);
      if (bestLatency <= HEALTHY_THRESHOLD) break;
    }
  }

  if (bestLatency < 0) {
    return { strength: 'offline', latency: null };
  }
  if (bestLatency <= HEALTHY_THRESHOLD) {
    return { strength: 'healthy', latency: bestLatency };
  }
  if (bestLatency <= MID_THRESHOLD) {
    return { strength: 'mid', latency: bestLatency };
  }
  return { strength: 'poor', latency: bestLatency };
};

export const useNetworkStatus = (): NetworkStatus => {
  const [status, setStatus] = useState<NetworkStatus>({
    strength: 'offline',
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    latencyMs: null,
    checking: true,
  });

  const isMountedRef = useRef(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const consecutiveFailuresRef = useRef(0);

  const runCheck = useCallback(async () => {
    if (!isMountedRef.current) return;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      consecutiveFailuresRef.current = 0;
      setStatus({ strength: 'offline', online: false, latencyMs: null, checking: false });
      return;
    }

    setStatus(prev => ({ ...prev, checking: true }));

    const { strength, latency } = await measureNetwork();
    if (!isMountedRef.current) return;

    if (strength === 'offline') {
      consecutiveFailuresRef.current += 1;
      if (consecutiveFailuresRef.current >= 1) {
        setStatus({ strength: 'offline', online: false, latencyMs: null, checking: false });
      }
    } else {
      consecutiveFailuresRef.current = 0;
      setStatus({ strength, online: true, latencyMs: latency, checking: false });
    }
  }, []);

  const startPolling = useCallback((intervalMs: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(runCheck, intervalMs);
  }, [runCheck]);

  useEffect(() => {
    isMountedRef.current = true;
    runCheck();
    startPolling(PING_INTERVAL_MS);

    const handleOnline = () => {
      consecutiveFailuresRef.current = 0;
      setStatus({ strength: 'healthy', online: true, latencyMs: null, checking: true });
      runCheck();
      startPolling(PING_INTERVAL_MS);
    };

    const handleOffline = () => {
      consecutiveFailuresRef.current = 5;
      setStatus({ strength: 'offline', online: false, latencyMs: null, checking: false });
      startPolling(FAST_INTERVAL_MS);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        runCheck();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [runCheck, startPolling]);

  useEffect(() => {
    if (status.strength === 'offline' || status.strength === 'poor') {
      startPolling(FAST_INTERVAL_MS);
    } else if (status.strength === 'mid') {
      startPolling(PING_INTERVAL_MS);
    } else {
      startPolling(PING_INTERVAL_MS);
    }
  }, [status.strength, startPolling]);

  return status;
};
