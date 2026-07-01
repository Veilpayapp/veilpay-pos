import { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { useSupportedNetworks } from '../hooks/useSupportedNetworks';
import { createInvoice } from '../services/veilpayApi';
import NetworkTokenSelector from '../components/NetworkTokenSelector';
import NumPad from '../components/NumPad';

const AmountScreen = () => {
  const { state, dispatch } = usePOS();
  const { networks, loading } = useSupportedNetworks();
  const [amountStr, setAmountStr] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amt = parseFloat(amountStr) || 0;

  const handleConfirm = async () => {
    if (amt <= 0 || !state.selectedChain || !state.selectedToken) return;

    setIsSubmitting(true);
    try {
      dispatch({ type: 'SET_AMOUNT', amountUSD: amt });
      const invoice = await createInvoice(amt, state.selectedChain, state.selectedToken, 'POS Register 1');
      dispatch({ 
        type: 'INVOICE_CREATED', 
        payload: { 
          invoiceId: invoice.invoiceId, 
          paymentAddress: invoice.paymentAddress, 
          expiresAt: invoice.expiresAt 
        } 
      });
      dispatch({ type: 'STATUS_UPDATE', status: invoice.status as any });
      dispatch({ type: 'GO_TO_SCREEN', screen: 'qr' });
    } catch (error: any) {
      console.error(error);
      dispatch({ type: 'SET_ERROR', message: error.message || 'Failed to create invoice' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '56px', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid var(--surface-border)' }}>
        <button onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' })} style={{ fontSize: '24px', padding: '8px' }}>←</button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: 600 }}>Enter Bill Amount</div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22S4 17.18 4 9V5l8-3 8 3v4c0 8.18-8 13-8 13z" fill="var(--accent-green)" />
        </svg>
      </div>

      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', padding: '24px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '64px', fontFamily: 'monospace', color: amt > 0 ? 'var(--accent-green)' : '#FFF', textAlign: 'center', borderBottom: '2px solid', paddingBottom: '8px' }}>
              $ {amountStr || '0.00'}
            </div>
          </div>
          <NetworkTokenSelector 
            networks={networks}
            loading={loading}
            selectedChain={state.selectedChain}
            selectedToken={state.selectedToken}
            onChange={(chain, token) => dispatch({ type: 'SET_SELECTION', chainKey: chain, tokenSymbol: token })}
          />
        </div>

        <div style={{ flex: '0 0 55%', display: 'flex', flexDirection: 'column', padding: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
          <NumPad value={amountStr} onChange={setAmountStr} />
          <button 
            onClick={handleConfirm}
            disabled={amt <= 0 || isSubmitting}
            className="min-tap"
            style={{
              width: '100%',
              maxWidth: '340px',
              height: '72px',
              background: amt > 0 && !isSubmitting ? 'var(--accent-green)' : '#333',
              color: amt > 0 && !isSubmitting ? '#000' : '#888',
              borderRadius: '12px',
              fontSize: '20px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            {isSubmitting ? (
              <div style={{ width: '24px', height: '24px', border: '3px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            ) : (
              'Generate QR Code →'
            )}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AmountScreen;
