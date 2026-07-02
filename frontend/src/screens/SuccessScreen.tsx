import { useEffect, useState } from 'react';
import { usePOS } from '../context/POSContext';
import { AUTO_RETURN_SECONDS, TIMER_INTERVAL_MS } from '../types';

const handleReceipt = () => {
  // Placeholder — will be wired to receipt printer or PDF export
};

const SuccessScreen = () => {
  const { state, dispatch } = usePOS();
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
  const networkName = state.selectedChain.charAt(0).toUpperCase() + state.selectedChain.slice(1);
  const tokenName = state.selectedToken.toUpperCase();

  const handleNew = () => {
    dispatch({ type: 'RESET' });
    dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
  };

  return (
    <div className="success">
      <svg className="success-check" viewBox="0 0 52 52">
        <circle className="success-check-circle" cx="26" cy="26" r="25" fill="none" stroke="var(--color-green)" strokeWidth="2"
          strokeDasharray="166" strokeDashoffset="166" />
        <path className="success-check-mark" fill="none" stroke="var(--color-green)" strokeWidth="4" d="M14.1 27.2l7.1 7.2 16.7-16.8"
          strokeDasharray="48" strokeDashoffset="48" />
      </svg>
      <h2 className="success-title">Payment Confirmed!</h2>
      <div className="success-amount">$ {state.amountUSD.toFixed(2)} {tokenName}</div>
      <div className="success-invoice">Invoice: {invoiceLabel}</div>
      {state.memo && <div className="success-memo">{state.memo}</div>}
      <div className="success-pill">Settled on {networkName}</div>
      <div className="success-divider" />
      <div className="success-actions">
        <button type="button" className="success-primary min-tap" onClick={handleNew}>New Transaction</button>
        <button type="button" className="success-secondary min-tap" onClick={handleReceipt}>View Receipt</button>
      </div>
      <div className="success-countdown">Returning to home in {countdown}s...</div>
    </div>
  );
};

export default SuccessScreen;
