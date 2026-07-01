import { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { useSupportedNetworks } from '../hooks/useSupportedNetworks';
import { createInvoice } from '../services/veilpayApi';
import { InvoiceResponse, MAX_AMOUNT_USD, DEFAULT_MEMO } from '../types';
import Header from '../components/Header';
import NetworkTokenSelector from '../components/NetworkTokenSelector';
import NumPad from '../components/NumPad';

const AmountScreen = () => {
  const { state, dispatch } = usePOS();
  const { networks, loading, error } = useSupportedNetworks();
  const [amountStr, setAmountStr] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amt = parseFloat(amountStr) || 0;
  const isValid = amt > 0 && amt <= MAX_AMOUNT_USD && !!state.selectedChain && !!state.selectedToken;

  const handleBack = () => {
    dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
  };

  const handleSelectionChange = (chain: string, token: string) => {
    dispatch({ type: 'SET_SELECTION', chainKey: chain, tokenSymbol: token });
  };

  const handleConfirm = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      dispatch({ type: 'SET_AMOUNT', amountUSD: amt, memo: DEFAULT_MEMO });
      const invoice: InvoiceResponse = await createInvoice(amt, state.selectedChain, state.selectedToken, DEFAULT_MEMO);
      dispatch({
        type: 'INVOICE_CREATED',
        payload: { invoiceId: invoice.invoiceId, paymentAddress: invoice.paymentAddress, expiresAt: invoice.expiresAt },
      });
      dispatch({ type: 'STATUS_UPDATE', status: invoice.status });
      dispatch({ type: 'GO_TO_SCREEN', screen: 'qr' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create invoice';
      dispatch({ type: 'SET_ERROR', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="amount">
      <Header title="Enter Bill Amount" showBack onBack={handleBack} />
      <div className="amount-body">
        <div className="amount-left">
          <div className="amount-display">
            <div className={`amount-value ${amt > 0 ? 'amount-value--active' : ''}`}>
              $ {amountStr || '0.00'}
            </div>
          </div>
          {error && <div className="amount-error">{error}</div>}
          <NetworkTokenSelector
            networks={networks}
            loading={loading}
            selectedChain={state.selectedChain}
            selectedToken={state.selectedToken}
            onChange={handleSelectionChange}
          />
        </div>
        <div className="amount-right">
          <NumPad value={amountStr} onChange={setAmountStr} />
          <button className="amount-confirm min-tap" disabled={!isValid || isSubmitting} onClick={handleConfirm}>
            {isSubmitting ? <div className="amount-spinner" /> : 'Generate QR Code →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmountScreen;
