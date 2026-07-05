import { useCallback, useMemo } from 'react';
import { usePOS } from '../context/POSContext';
import { useTranslation } from '../context/LanguageContext';

const ErrorScreen = () => {
  const { state, dispatch } = usePOS();
  const { t } = useTranslation();

  const displayMessage = useMemo(() => {
    const msg = state.errorMessage ?? '';
    if (msg === 'qr_expired' || msg.includes('expired after 15 minutes')) {
      return t('qr_expired');
    }
    if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('failed to create invoice')) {
      return t('connection_issue');
    }
    if (!msg) return t('unknown_error');
    return msg;
  }, [state.errorMessage, t]);

  const handleRetry = useCallback(() => {
    dispatch({ type: 'RESET' });
    dispatch({ type: 'GO_TO_SCREEN', screen: 'amount' });
  }, [dispatch]);

  const handleCancel = useCallback(() => {
    dispatch({ type: 'RESET' });
    dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
  }, [dispatch]);

  return (
    <div className="error">
      <svg className="error-icon" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="45" fill="var(--color-error)" fillOpacity="0.2" />
        <path d="M35 35 L65 65 M65 35 L35 65" stroke="var(--color-error)" strokeWidth="8" strokeLinecap="round" />
      </svg>
      <h2 className="error-title">{t('transaction_failed')}</h2>
      <p className="error-message">{displayMessage}</p>
      <div className="error-actions">
        <button type="button" className="error-retry min-tap" aria-label={t('try_again')} onClick={handleRetry}>{t('try_again')}</button>
        <button type="button" className="error-cancel min-tap" aria-label={t('cancel_return_idle')} onClick={handleCancel}>{t('cancel')}</button>
      </div>
    </div>
  );
};

export default ErrorScreen;
