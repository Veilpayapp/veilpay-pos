import { useCallback, useMemo } from 'react';
import { usePOS } from '../context/POSContext';
import { useTranslation } from '../context/LanguageContext';
import { useInvoicePoller } from '../hooks/useInvoicePoller';
import { InvoicePollerCallbacks } from '../types';
import QRDisplay from '../components/QRDisplay';

const QRScreen = () => {
  const { state, dispatch } = usePOS();
  const { t } = useTranslation();

  const handlePaid = useCallback(() => {
    dispatch({ type: 'STATUS_UPDATE', status: 'paid' });
    dispatch({ type: 'GO_TO_SCREEN', screen: 'processing' });
  }, [dispatch]);

  const handleExpired = useCallback(() => {
    dispatch({ type: 'STATUS_UPDATE', status: 'expired' });
    dispatch({ type: 'SET_ERROR', message: 'qr_expired' });
  }, [dispatch]);

  const callbacks = useMemo<InvoicePollerCallbacks>(
    () => ({ onPaid: handlePaid, onExpired: handleExpired }),
    [handlePaid, handleExpired]
  );

  useInvoicePoller(
    state.screen === 'qr' ? state.invoiceId : null,
    state.expiresAt,
    callbacks
  );

  const handleCancel = useCallback(() => {
    dispatch({ type: 'STATUS_UPDATE', status: 'cancelled' });
    dispatch({ type: 'GO_TO_SCREEN', screen: 'payment' });
  }, [dispatch]);

  return (
    <div className="qr">
      <div className="qr-left">
        <div className="qr-card">
          {state.paymentAddress && <QRDisplay value={state.paymentAddress} />}
        </div>
        <div className="qr-scan">{t('waiting_for_scan')}</div>
      </div>
      <div className="qr-actions">
        <button type="button" className="qr-cancel min-tap" aria-label={t('cancel_payment')} onClick={handleCancel}>{t('cancel')}</button>
      </div>
    </div>
  );
};

export default QRScreen;
