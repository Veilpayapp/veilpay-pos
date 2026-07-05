import { useCallback, useEffect, useState } from 'react';
import { usePOS } from '../context/POSContext';
import { useTranslation } from '../context/LanguageContext';
import { AUTO_RETURN_SECONDS, TIMER_INTERVAL_MS } from '../types';

const SuccessScreen = () => {
  const { state, dispatch } = usePOS();
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(AUTO_RETURN_SECONDS);

  useEffect(() => {
    if (countdown <= 0) {
      dispatch({ type: 'RESET' });
      dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
      return;
    }
    const id = setInterval(() => setCountdown(c => c - 1), TIMER_INTERVAL_MS);
    return () => clearInterval(id);
  }, [countdown, dispatch]);

  const invoiceLabel = state.invoiceId ? `${state.invoiceId.slice(0, 8)}...` : '';

  const handleReceipt = useCallback(() => {
    // Placeholder — will be wired to receipt printer or PDF export
  }, []);

  const handleNew = useCallback(() => {
    dispatch({ type: 'RESET' });
    dispatch({ type: 'GO_TO_SCREEN', screen: 'amount' });
  }, [dispatch]);

  return (
    <div className="success" role="status" aria-live="polite">
      <div className="success-flash" aria-hidden="true" />
      <svg className="success-check" viewBox="0 0 52 52" role="img" aria-label={t('payment_successful')}>
        <circle className="success-check-circle" cx="26" cy="26" r="25" fill="none" stroke="var(--color-success)" strokeWidth="2"
          strokeDasharray="166" strokeDashoffset="166" />
        <path className="success-check-mark" fill="none" stroke="var(--color-success)" strokeWidth="4" d="M14.1 27.2l7.1 7.2 16.7-16.8"
          strokeDasharray="48" strokeDashoffset="48" />
      </svg>
      <div className="success-amount">$ {state.amountUSD.toFixed(2)}</div>
      <h2 className="success-title">{t('payment_successful')}</h2>
      <div className="success-invoice">{invoiceLabel}</div>
      <div className="success-actions">
        <button type="button" className="success-secondary min-tap" aria-label={t('print_receipt')} onClick={handleReceipt}>{t('print_receipt')}</button>
        <button type="button" className="success-primary min-tap" aria-label={t('new_sale')} onClick={handleNew}>{t('new_sale')}</button>
      </div>
    </div>
  );
};

export default SuccessScreen;
