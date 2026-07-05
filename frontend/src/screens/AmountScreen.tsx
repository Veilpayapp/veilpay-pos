import { useState, useCallback, useEffect, useMemo } from 'react';
import { usePOS } from '../context/POSContext';
import { useTranslation } from '../context/LanguageContext';
import { useSupportedNetworks } from '../hooks/useSupportedNetworks';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { useSettings } from '../hooks/useSettings';
import { getCurrencyInfo } from '../data/currencies';
import { MAX_AMOUNT_USD, DEFAULT_MEMO } from '../types';
import NumPad from '../components/NumPad';
import WifiIndicator from '../components/WifiIndicator';

const AmountScreen = () => {
  const { state, dispatch } = usePOS();
  const { t } = useTranslation();
  const { networks, loading, error } = useSupportedNetworks();
  const { rate, loading: rateLoading } = useExchangeRate(state.selectedCurrency);
  const { settings } = useSettings();
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

  const currencyInfo = useMemo(() => getCurrencyInfo(state.selectedCurrency), [state.selectedCurrency]);
  const localAmount = useMemo(() => {
    if (rate && amt > 0) return (amt * rate).toLocaleString(undefined, { maximumFractionDigits: 2 });
    return null;
  }, [rate, amt]);

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
      <div className="amount-topbar">
        <WifiIndicator />
        {settings.shopName && <span className="amount-shop-name">{settings.shopName}</span>}
        <button type="button" className="amount-dashboard min-tap" aria-label="Open merchant dashboard" onClick={handleDashboard}>&#9776;</button>
      </div>
      <div className="amount-body">
        <div className="amount-display-area">
          <div className={`amount-value ${amt > 0 ? 'amount-value--active' : ''}`} style={{ fontSize: amountFontSize }}>
            <span className="amount-currency">$</span>
            {amountStr || '0.00'}
          </div>
          {error && <div className="amount-error" role="alert">{error}</div>}

          <div className="amount-rate" aria-live="polite">
            <span className="amount-rate-label">
              {t('usdt_rate')}
              <span className="amount-rate-flag">{currencyInfo.flag}</span>
            </span>
            {rateLoading ? (
              <span className="amount-rate-value amount-rate-value--loading">{t('rate_loading')}</span>
            ) : rate ? (
              <span className="amount-rate-value">
                {currencyInfo.symbol}{rate.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                <span className="amount-rate-code">{currencyInfo.code}</span>
              </span>
            ) : (
              <span className="amount-rate-value amount-rate-value--error">{t('rate_unavailable')}</span>
            )}
          </div>

          {localAmount && (
            <div className="amount-local" aria-live="polite">
              {t('local_equivalent', { amount: `${currencyInfo.symbol}${localAmount}`, code: currencyInfo.code })}
            </div>
          )}
        </div>

        <div className="amount-numpad-area">
          <NumPad value={amountStr} onChange={setAmountStr} />
        </div>
      </div>

      <button type="button" className="amount-confirm min-tap" disabled={!isValid} onClick={handleConfirm}>
        {t('charge', { amount: `$${amountStr || '0.00'}` })}
      </button>
    </div>
  );
};

export default AmountScreen;
