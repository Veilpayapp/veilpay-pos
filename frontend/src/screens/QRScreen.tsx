import { usePOS } from '../context/POSContext';
import { useInvoicePoller } from '../hooks/useInvoicePoller';
import QRDisplay from '../components/QRDisplay';
import StatusBadge from '../components/StatusBadge';



const QRScreen = () => {
  const { state, dispatch } = usePOS();
  
  const { secondsRemaining } = useInvoicePoller(
    state.screen === 'qr' ? state.invoiceId : null,
    state.expiresAt,
    {
      onPaid: () => {
        dispatch({ type: 'STATUS_UPDATE', status: 'paid' });
        dispatch({ type: 'GO_TO_SCREEN', screen: 'success' });
      },
      onExpired: () => {
        dispatch({ type: 'STATUS_UPDATE', status: 'expired' });
        dispatch({ type: 'SET_ERROR', message: 'Invoice expired after 15 minutes' });
      }
    }
  );

  const m = Math.floor(Math.max(0, secondsRemaining) / 60).toString().padStart(2, '0');
  const s = (Math.max(0, secondsRemaining) % 60).toString().padStart(2, '0');
  const timeLeft = `${m}:${s}`;
  const isExpiring = secondsRemaining < 60;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#13131F', padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          <div style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '24px' }}>Scan to Pay</div>
          {state.paymentAddress && <QRDisplay value={state.paymentAddress} />}
        </div>
      </div>

      <div style={{ width: '400px', padding: '48px 32px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '52px', fontWeight: 700, color: 'var(--accent-green)', marginBottom: '8px' }}>
            $ {state.amountUSD.toFixed(2)}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {state.selectedToken.toUpperCase()} on {state.selectedChain.charAt(0).toUpperCase() + state.selectedChain.slice(1)}
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--surface-border)', marginBottom: '32px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <StatusBadge status={state.txStatus || 'pending'} />
          <div style={{ fontSize: '16px', color: isExpiring ? 'var(--error-color)' : 'var(--text-primary)' }}>
            Expires in {timeLeft}
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--surface-border)', marginBottom: 'auto' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={() => {
              dispatch({ type: 'STATUS_UPDATE', status: 'cancelled' });
              dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
            }}
            className="min-tap"
            style={{ height: '56px', border: '1px solid var(--error-color)', color: 'var(--error-color)', borderRadius: '12px', fontSize: '16px', fontWeight: 600 }}
          >
            Cancel Transaction
          </button>
          <div style={{ height: '56px', background: 'var(--surface-color)', color: 'var(--text-muted)', borderRadius: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Network: {state.selectedChain.charAt(0).toUpperCase() + state.selectedChain.slice(1)} · {state.selectedToken.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScreen;
