import { useCallback, useMemo } from 'react';
import { usePOS } from '../context/POSContext';
import { useInvoicePoller } from '../hooks/useInvoicePoller';
import { QR_EXPIRY_URGENT_SECONDS, InvoicePollerCallbacks } from '../types';
import QRDisplay from '../components/QRDisplay';
import StatusBadge from '../components/StatusBadge';

const QRScreen = () => {
  const { state, dispatch } = usePOS();

  const handlePaid = useCallback(() => {
    dispatch({ type: 'STATUS_UPDATE', status: 'paid' });
    dispatch({ type: 'GO_TO_SCREEN', screen: 'success' });
  }, [dispatch]);

  const handleExpired = useCallback(() => {
    dispatch({ type: 'STATUS_UPDATE', status: 'expired' });
    dispatch({ type: 'SET_ERROR', message: 'Invoice expired after 15 minutes' });
  }, [dispatch]);

  const callbacks = useMemo<InvoicePollerCallbacks>(
    () => ({ onPaid: handlePaid, onExpired: handleExpired }),
    [handlePaid, handleExpired]
  );

  const { secondsRemaining } = useInvoicePoller(
    state.screen === 'qr' ? state.invoiceId : null,
    state.expiresAt,
    callbacks
  );

  const m = Math.floor(Math.max(0, secondsRemaining) / 60).toString().padStart(2, '0');
  const s = (Math.max(0, secondsRemaining) % 60).toString().padStart(2, '0');
  const timeLeft = `${m}:${s}`;
  const isExpiring = secondsRemaining < QR_EXPIRY_URGENT_SECONDS;
  const networkLabel = state.selectedChain.charAt(0).toUpperCase() + state.selectedChain.slice(1);
  const tokenLabel = state.selectedToken.toUpperCase();

  const handleCancel = useCallback(() => {
    dispatch({ type: 'STATUS_UPDATE', status: 'cancelled' });
    dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
  }, [dispatch]);

  return (
    <div className="qr">
      <div className="qr-left">
        <div className="qr-card">
          <div className="qr-scan">Scan to Pay</div>
          {state.paymentAddress && <QRDisplay value={state.paymentAddress} />}
        </div>
      </div>
      <div className="qr-right">
        <div className="qr-amount-area">
          <div className="qr-amount">$ {state.amountUSD.toFixed(2)}</div>
          <div className="qr-token-label">{tokenLabel} on {networkLabel}</div>
          {state.memo && <div className="qr-memo">{state.memo}</div>}
        </div>
        <div className="divider divider--mb" />
        <div className="qr-info">
          <StatusBadge status={state.txStatus ?? 'pending'} />
          <div className={`qr-expiry ${isExpiring ? 'qr-expiry--urgent' : ''}`}>
            Expires in {timeLeft}
          </div>
        </div>
        <div className="divider divider--mb-auto" />
        <div className="qr-actions">
          <button type="button" className="qr-cancel min-tap" onClick={handleCancel}>Cancel Transaction</button>
          <div className="qr-network">Network: {networkLabel} · {tokenLabel}</div>
        </div>
      </div>
    </div>
  );
};

export default QRScreen;
