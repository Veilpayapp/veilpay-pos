import { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { getInvoiceStatus } from '../services/veilpayApi';

interface Callbacks {
  onPaid: () => void;
  onExpired: () => void;
}

export const useInvoicePoller = (
  invoiceId: string | null,
  expiresAt: string | null,
  callbacks: Callbacks
) => {
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const callbacksRef = useRef(callbacks);

  // Keep callbacks ref updated so we don't need to add them to dependencies
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    if (!invoiceId || !expiresAt) {
      setSecondsRemaining(0);
      return;
    }

    let isPolling = true;
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let timerInterval: ReturnType<typeof setInterval> | null = null;

    const cleanup = () => {
      isPolling = false;
      if (pollInterval) clearInterval(pollInterval);
      if (timerInterval) clearInterval(timerInterval);
    };

    const updateTimer = () => {
      if (!isPolling) return;
      const diff = dayjs(expiresAt).diff(dayjs(), 'second');
      if (diff <= 0) {
        setSecondsRemaining(0);
        cleanup();
        callbacksRef.current.onExpired();
      } else {
        setSecondsRemaining(diff);
      }
    };

    const initialDiff = dayjs(expiresAt).diff(dayjs(), 'second');
    if (initialDiff <= 0) {
      setSecondsRemaining(0);
      callbacksRef.current.onExpired();
      return;
    }

    setSecondsRemaining(initialDiff);
    timerInterval = setInterval(updateTimer, 1000);

    const doPoll = async () => {
      if (!isPolling) return;
      try {
        const result = await getInvoiceStatus(invoiceId);
        // Important: check isPolling again because it might have changed during the await!
        if (!isPolling) return;

        if (result.status === 'paid') {
          cleanup();
          callbacksRef.current.onPaid();
        } else if (result.status === 'expired' || result.status === 'cancelled') {
          cleanup();
          callbacksRef.current.onExpired();
        }
      } catch (error) {
        console.error('Poll network error:', error);
      }
    };

    pollInterval = setInterval(doPoll, 2500);

    return cleanup;
  }, [invoiceId, expiresAt]);

  return { secondsRemaining };
};
