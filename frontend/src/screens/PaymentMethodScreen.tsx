import { useState, useCallback } from 'react';
import { usePOS } from '../context/POSContext';
import { useTranslation } from '../context/LanguageContext';
import { useCreateInvoice } from '../hooks/useCreateInvoice';
import { useSupportedNetworks } from '../hooks/useSupportedNetworks';
import NetworkTokenSelector from '../components/NetworkTokenSelector';

const PaymentMethodScreen = () => {
  const { state, dispatch } = usePOS();
  const { t } = useTranslation();
  const { isSubmitting, submit } = useCreateInvoice();
  const { networks, loading } = useSupportedNetworks();
  const [toast, setToast] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    dispatch({ type: 'GO_TO_SCREEN', screen: 'amount' });
  }, [dispatch]);

  const handleSelectionChange = useCallback((chain: string, token: string) => {
    dispatch({ type: 'SET_SELECTION', chainKey: chain, tokenSymbol: token });
  }, [dispatch]);

  const handleSelectQr = useCallback(() => {
    setToast(null);
    submit(state.amountUSD);
  }, [submit, state.amountUSD]);

  const handleSelectNfc = useCallback(() => {
    setToast(t('nfc_coming_soon'));
  }, [t]);

  const handleSelectCash = useCallback(() => {
    setToast(t('cash_coming_soon'));
  }, [t]);

  const handleDismissToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <div className="payment">
      <div className="payment-header">
        <button type="button" className="payment-back min-tap" aria-label={t('cancel')} onClick={handleBack}>&#8592;</button>
        <h1 className="payment-title">{t('select_payment_method')}</h1>
      </div>

      <div className="payment-selector">
        <NetworkTokenSelector
          networks={networks}
          loading={loading}
          selectedChain={state.selectedChain}
          selectedToken={state.selectedToken}
          onChange={handleSelectionChange}
        />
      </div>

      <div className="payment-list" role="group" aria-label={t('select_payment_method')}>
        <button type="button" className="payment-card min-tap" aria-label={t('qr_code')} disabled={isSubmitting} onClick={handleSelectQr}>
          <span className="payment-card-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><line x1="14" y1="14" x2="14" y2="21" /><line x1="18" y1="14" x2="18" y2="18" /><line x1="21" y1="14" x2="21" y2="21" /><line x1="14" y1="21" x2="21" y2="21" /><line x1="18" y1="18" x2="21" y2="18" /></svg>
          </span>
          <span className="payment-card-text"><span className="payment-card-title">{t('qr_code')}</span><span className="payment-card-sub">{t('web3_wallet')}</span></span>
        </button>

        <button type="button" className="payment-card min-tap" aria-label={t('nfc_tap')} onClick={handleSelectNfc}>
          <span className="payment-card-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 8.5a11 11 0 0 1 0 7" /><path d="M9.5 5.5a16 16 0 0 1 0 13" /><path d="M13 3a21 21 0 0 1 0 18" /></svg>
          </span>
          <span className="payment-card-text"><span className="payment-card-title">{t('nfc_tap')}</span><span className="payment-card-sub">{t('fiat_cards')}</span></span>
        </button>

        <button type="button" className="payment-card min-tap" aria-label={t('cash')} onClick={handleSelectCash}>
          <span className="payment-card-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="1" /><circle cx="12" cy="12" r="3" /><line x1="6" y1="9" x2="6" y2="9" /><line x1="18" y1="15" x2="18" y2="15" /></svg>
          </span>
          <span className="payment-card-text"><span className="payment-card-title">{t('cash')}</span><span className="payment-card-sub">{t('record_transaction')}</span></span>
        </button>
      </div>

      {isSubmitting && <p className="payment-notice" role="status">{t('creating_invoice')}</p>}

      {toast && (
        <div className="payment-toast-overlay" role="dialog" aria-modal="true" aria-label={t('ok')} onClick={handleDismissToast}>
          <div className="payment-toast" onClick={(e) => e.stopPropagation()}>
            <div className="payment-toast-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12" y2="16" /></svg>
            </div>
            <p className="payment-toast-text">{toast}</p>
            <button type="button" className="payment-toast-btn min-tap" aria-label={t('ok')} onClick={handleDismissToast}>{t('ok')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodScreen;
