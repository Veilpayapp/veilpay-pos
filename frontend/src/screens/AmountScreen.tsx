import { useState, useCallback, useEffect } from 'react';
import { usePOS } from '../context/POSContext';
import { useSupportedNetworks } from '../hooks/useSupportedNetworks';
import { MAX_AMOUNT_USD, DEFAULT_MEMO } from '../types';
import NetworkTokenSelector from '../components/NetworkTokenSelector';
import NumPad from '../components/NumPad';

const AmountScreen = () => {
  const { state, dispatch } = usePOS();
  const { networks, loading, error } = useSupportedNetworks();
  const [amountStr, setAmountStr] = useState('');

  useEffect(() => {
    if (loading || networks.length === 0 || state.selectedChain) return;
    const chain = networks.find(n => n.chainKey === 'polygon') ?? networks[0];
    const token = chain.tokens.find(t => t.symbol === 'USDC') ?? chain.tokens[0];
    dispatch({ type: 'SET_SELECTION', chainKey: chain.chainKey, tokenSymbol: token.symbol });
  }, [networks, loading, state.selectedChain, dispatch]);

  const amt = parseFloat(amountStr) || 0;
  const isValid = amt > 0 && amt <= MAX_AMOUNT_USD && !!state.selectedChain && !!state.selectedToken;
  const amountFontSize = amountStr.replace('.', '').length > 6 ? '56px' : '72px';

  const handleSelectionChange = useCallback((chain: string, token: string) => {
    dispatch({ type: 'SET_SELECTION', chainKey: chain, tokenSymbol: token });
  }, [dispatch]);

  const handleConfirm = useCallback(() => {
    if (!isValid) return;
    dispatch({ type: 'SET_AMOUNT', amountUSD: amt, memo: DEFAULT_MEMO });
    dispatch({ type: 'GO_TO_SCREEN', screen: 'payment' });
  }, [isValid, amt, dispatch]);

  const handleDashboard = useCallback(() => {
    dispatch({ type: 'GO_TO_SCREEN', screen: 'dashboard' });
  }, [dispatch]);

  return (
    <div className="amount">
      <button type="button" className="amount-dashboard min-tap" aria-label="Open merchant dashboard" onClick={handleDashboard}>&#9776;</button>
      <div className="amount-body">
        <div className="amount-display-area">
          <div className={`amount-value ${amt > 0 ? 'amount-value--active' : ''}`} style={{ fontSize: amountFontSize }}>
            <span className="amount-currency">$</span>
            {amountStr || '0.00'}
          </div>
          {error && <div className="amount-error" role="alert">{error}</div>}

          <div style={{ display: 'none' }}>
            {/* Hiding NetworkTokenSelector visually to match strict Screen 2 spec, since selection is auto-handled by useEffect anyway */}
            <NetworkTokenSelector
              networks={networks}
              loading={loading}
              selectedChain={state.selectedChain}
              selectedToken={state.selectedToken}
              onChange={handleSelectionChange}
            />
          </div>
        </div>

        <div className="amount-numpad-area">
          <NumPad value={amountStr} onChange={setAmountStr} />
        </div>
      </div>

      <button type="button" className="amount-confirm min-tap" disabled={!isValid} onClick={handleConfirm}>
        {`Charge $${amountStr || '0.00'}`}
      </button>
    </div>
  );
};

export default AmountScreen;
