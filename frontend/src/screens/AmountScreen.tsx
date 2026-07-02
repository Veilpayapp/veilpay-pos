import { useState, useCallback, useEffect } from 'react';
import { usePOS } from '../context/POSContext';
import { useSupportedNetworks } from '../hooks/useSupportedNetworks';
import { useCreateInvoice } from '../hooks/useCreateInvoice';
import { MAX_AMOUNT_USD } from '../types';
import Header from '../components/Header';
import NetworkTokenSelector from '../components/NetworkTokenSelector';
import NumPad from '../components/NumPad';

const AmountScreen = () => {
  const { state, dispatch } = usePOS();
  const { networks, loading, error } = useSupportedNetworks();
  const { isSubmitting, submit } = useCreateInvoice();
  const [amountStr, setAmountStr] = useState('');

  useEffect(() => {
    if (loading || networks.length === 0 || state.selectedChain) return;
    const chain = networks.find(n => n.chainKey === 'polygon') ?? networks[0];
    const token = chain.tokens.find(t => t.symbol === 'USDC') ?? chain.tokens[0];
    dispatch({ type: 'SET_SELECTION', chainKey: chain.chainKey, tokenSymbol: token.symbol });
  }, [networks, loading, state.selectedChain, dispatch]);

  const amt = parseFloat(amountStr) || 0;
  const isValid = amt > 0 && amt <= MAX_AMOUNT_USD && !!state.selectedChain && !!state.selectedToken;

  const handleBack = useCallback(() => {
    dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
  }, [dispatch]);

  const handleSelectionChange = useCallback((chain: string, token: string) => {
    dispatch({ type: 'SET_SELECTION', chainKey: chain, tokenSymbol: token });
  }, [dispatch]);

  const handleConfirm = useCallback(async () => {
    if (!isValid) return;
    await submit(amt);
  }, [isValid, amt, submit]);

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
          <button type="button" className="amount-confirm min-tap" disabled={!isValid || isSubmitting} onClick={handleConfirm}>
            {isSubmitting ? <div className="amount-spinner" /> : 'Generate QR Code →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmountScreen;
