import { usePOS } from '../context/POSContext';

const ErrorScreen = () => {
  const { state, dispatch } = usePOS();

  let displayMessage = state.errorMessage || 'An unknown error occurred.';
  if (displayMessage.includes('expired after 15 minutes')) {
    displayMessage = 'The QR code expired. Please try again.';
  } else if (displayMessage.toLowerCase().includes('network') || displayMessage.toLowerCase().includes('failed to fetch')) {
    displayMessage = 'Connection issue. Check your internet and retry.';
  }

  return (
    <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle, #1F0A0A 0%, #0D0D14 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
      <svg viewBox="0 0 100 100" style={{ width: '100px', height: '100px', marginBottom: '24px', animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' }}>
        <circle cx="50" cy="50" r="45" fill="rgba(239, 68, 68, 0.2)" />
        <path d="M35 35 L65 65 M65 35 L35 65" stroke="var(--error-color)" strokeWidth="8" strokeLinecap="round" />
      </svg>
      
      <h2 style={{ fontSize: '40px', fontWeight: 700, color: '#FFF', marginBottom: '16px' }}>Transaction Failed</h2>
      
      <p style={{ fontSize: '18px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '480px', marginBottom: '48px', lineHeight: 1.5 }}>
        {displayMessage}
      </p>
      
      <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '480px' }}>
        <button 
          onClick={() => {
            dispatch({ type: 'RESET' });
            dispatch({ type: 'GO_TO_SCREEN', screen: 'amount' });
          }}
          className="min-tap"
          style={{ flex: 1, height: '56px', background: 'var(--surface-color)', color: 'var(--text-primary)', borderRadius: '12px', fontSize: '18px', fontWeight: 600 }}
        >
          Try Again
        </button>
        <button 
          onClick={() => {
            dispatch({ type: 'RESET' });
            dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
          }}
          className="min-tap"
          style={{ flex: 1, height: '56px', background: 'transparent', border: '1px solid var(--surface-border)', color: 'var(--text-muted)', borderRadius: '12px', fontSize: '18px', fontWeight: 600 }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen;
