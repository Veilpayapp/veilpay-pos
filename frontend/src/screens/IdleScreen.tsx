import { usePOS } from '../context/POSContext';

const IdleScreen = () => {
  const { dispatch } = usePOS();

  const handleStart = () => {
    dispatch({ type: 'GO_TO_SCREEN', screen: 'amount' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStart();
    }
  };

  return (
    <div
      className="idle min-tap"
      role="button"
      tabIndex={0}
      aria-label="Tap to start payment"
      onClick={handleStart}
      onKeyDown={handleKeyDown}
      style={{ cursor: 'pointer' }}
    >
      <div className="idle-center">
        <div className="idle-logo">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 22S4 17.18 4 9V5l8-3 8 3v4c0 8.18-8 13-8 13z" fill="var(--color-accent)" />
          </svg>
          <span className="idle-logo-text">VeilPay</span>
        </div>
        <p className="idle-subtitle">Ready to Pay</p>
      </div>
    </div>
  );
};

export default IdleScreen;
