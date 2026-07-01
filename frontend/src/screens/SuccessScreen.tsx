import { useEffect, useState } from 'react';
import { usePOS } from '../context/POSContext';

const SuccessScreen = () => {
  const { state, dispatch } = usePOS();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (countdown <= 0) {
      dispatch({ type: 'RESET' });
      dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
      return;
    }
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, dispatch]);

  const invoiceLabel = state.invoiceId ? `${state.invoiceId.slice(0, 8)}...` : '';
  const networkName = state.selectedChain.charAt(0).toUpperCase() + state.selectedChain.slice(1);
  const tokenName = state.selectedToken.toUpperCase();

  return (
    <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle, #0A2918 0%, #0D0D14 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
      <svg className="success-check" viewBox="0 0 52 52" style={{ width: '120px', height: '120px', marginBottom: '24px' }}>
        <circle cx="26" cy="26" r="25" fill="none" stroke="var(--accent-green)" strokeWidth="2" strokeDasharray="166" strokeDashoffset="166" style={{ animation: 'stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards' }} />
        <path fill="none" stroke="var(--accent-green)" strokeWidth="4" d="M14.1 27.2l7.1 7.2 16.7-16.8" strokeDasharray="48" strokeDashoffset="48" style={{ animation: 'stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards' }} />
      </svg>
      
      <h2 style={{ fontSize: '44px', fontWeight: 700, color: '#FFF', marginBottom: '12px' }}>Payment Confirmed!</h2>
      <div style={{ fontSize: '28px', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '24px' }}>
        $ {state.amountUSD.toFixed(2)} {tokenName}
      </div>
      
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '16px' }}>
        Invoice: {invoiceLabel}
      </div>
      
      <div style={{ background: 'var(--accent-violet)', color: '#FFF', padding: '4px 12px', borderRadius: '999px', fontSize: '14px', fontWeight: 600, marginBottom: '32px' }}>
        Settled on {networkName}
      </div>
      
      <div style={{ width: '100%', maxWidth: '480px', height: '1px', background: 'var(--surface-border)', marginBottom: '32px' }} />
      
      <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '480px', marginBottom: '24px' }}>
        <button 
          onClick={() => {
            dispatch({ type: 'RESET' });
            dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
          }}
          className="min-tap"
          style={{ flex: 1, height: '56px', background: 'var(--accent-green)', color: '#000', borderRadius: '12px', fontSize: '18px', fontWeight: 600 }}
        >
          New Transaction
        </button>
        <button 
          onClick={() => console.log('receipt')}
          className="min-tap"
          style={{ flex: 1, height: '56px', background: 'transparent', border: '1px solid var(--surface-border)', color: 'var(--text-primary)', borderRadius: '12px', fontSize: '18px', fontWeight: 600 }}
        >
          View Receipt
        </button>
      </div>

      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
        Returning to home in {countdown}s...
      </div>
    </div>
  );
};

export default SuccessScreen;
