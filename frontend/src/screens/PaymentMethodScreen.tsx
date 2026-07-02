import { useState, useCallback } from 'react';
import { usePOS } from '../context/POSContext';
import { useCreateInvoice } from '../hooks/useCreateInvoice';

type MethodKey = 'qr' | 'nfc' | 'cash';

const METHOD_NOTICE: Record<Exclude<MethodKey, 'qr'>, string> = {
  nfc: 'NFC tap payments coming soon.',
  cash: 'Cash recording coming soon.',
};

const PaymentMethodScreen = () => {
  const { state, dispatch } = usePOS();
  const { isSubmitting, submit } = useCreateInvoice();
  const [notice, setNotice] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    dispatch({ type: 'GO_TO_SCREEN', screen: 'amount' });
  }, [dispatch]);

  const handleSelect = useCallback(async (method: MethodKey) => {
    if (method === 'qr') {
      setNotice(null);
      await submit(state.amountUSD);
      return;
    }
    setNotice(METHOD_NOTICE[method]);
  }, [submit, state.amountUSD]);

  return (
    <div className="payment">
      <div className="payment-header">
        <button type="button" className="payment-back min-tap" aria-label="Back to amount entry" onClick={handleBack}>&#8592;</button>
        <h1 className="payment-title">Select Payment Method</h1>
      </div>

      <div className="payment-list" role="group" aria-label="Payment methods">
        <button
          type="button"
          className="payment-card min-tap"
          aria-label="Pay with QR code via VeilPay or Web3 wallet"
          disabled={isSubmitting}
          onClick={() => handleSelect('qr')}
        >
          <span className="payment-card-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <line x1="14" y1="14" x2="14" y2="21" />
              <line x1="18" y1="14" x2="18" y2="18" />
              <line x1="21" y1="14" x2="21" y2="21" />
              <line x1="14" y1="21" x2="21" y2="21" />
              <line x1="18" y1="18" x2="21" y2="18" />
            </svg>
          </span>
          <span className="payment-card-text">
            <span className="payment-card-title">QR Code</span>
            <span className="payment-card-sub">VeilPay / Web3 Wallet</span>
          </span>
        </button>

        <button
          type="button"
          className="payment-card min-tap"
          aria-label="Pay with NFC tap, fiat or cards"
          onClick={() => handleSelect('nfc')}
        >
          <span className="payment-card-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 8.5a11 11 0 0 1 0 7" />
              <path d="M9.5 5.5a16 16 0 0 1 0 13" />
              <path d="M13 3a21 21 0 0 1 0 18" />
            </svg>
          </span>
          <span className="payment-card-text">
            <span className="payment-card-title">NFC Tap</span>
            <span className="payment-card-sub">Fiat / Cards</span>
          </span>
        </button>

        <button
          type="button"
          className="payment-card min-tap"
          aria-label="Record a cash transaction"
          onClick={() => handleSelect('cash')}
        >
          <span className="payment-card-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="12" rx="1" />
              <circle cx="12" cy="12" r="3" />
              <line x1="6" y1="9" x2="6" y2="9" />
              <line x1="18" y1="15" x2="18" y2="15" />
            </svg>
          </span>
          <span className="payment-card-text">
            <span className="payment-card-title">Cash</span>
            <span className="payment-card-sub">Record transaction</span>
          </span>
        </button>
      </div>

      {notice && <p className="payment-notice" role="status">{notice}</p>}
      {isSubmitting && <p className="payment-notice" role="status">Creating invoice...</p>}
    </div>
  );
};

export default PaymentMethodScreen;
