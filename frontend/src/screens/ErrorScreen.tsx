import { usePOS } from '../context/POSContext';

const ErrorScreen = () => {
  const { state, dispatch } = usePOS();

  let displayMessage = state.errorMessage ?? 'An unknown error occurred.';
  if (displayMessage.includes('expired after 15 minutes')) {
    displayMessage = 'The QR code expired. Please try again.';
  } else if (displayMessage.toLowerCase().includes('network') || displayMessage.toLowerCase().includes('failed to fetch')) {
    displayMessage = 'Connection issue. Check your internet and retry.';
  }

  const handleRetry = () => {
    dispatch({ type: 'RESET' });
    dispatch({ type: 'GO_TO_SCREEN', screen: 'amount' });
  };

  const handleCancel = () => {
    dispatch({ type: 'RESET' });
    dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
  };

  return (
    <div className="error">
      <svg className="error-icon" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="rgba(239,68,68,0.2)" />
        <path d="M35 35 L65 65 M65 35 L35 65" stroke="var(--color-red)" strokeWidth="8" strokeLinecap="round" />
      </svg>
      <h2 className="error-title">Transaction Failed</h2>
      <p className="error-message">{displayMessage}</p>
      <div className="error-actions">
        <button className="error-retry min-tap" onClick={handleRetry}>Try Again</button>
        <button className="error-cancel min-tap" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ErrorScreen;
