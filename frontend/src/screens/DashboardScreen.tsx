import { usePOS } from '../context/POSContext';

const MOCK_TXS = [
  { id: '1', time: '14:23', txid: '0x3f...9a12', amount: '$ 45.00', status: 'settled' },
  { id: '2', time: '12:45', txid: '0x7e...2b99', amount: '$ 12.50', status: 'settled' },
  { id: '3', time: '09:12', txid: '0x1a...4c88', amount: '$ 89.99', status: 'pending' },
];

const STATUS_LABEL: Record<string, string> = {
  settled: 'Settled',
  pending: 'Pending',
};

const DashboardScreen = () => {
  const { dispatch } = usePOS();

  const handleClose = () => {
    dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleClose();
  };

  const toggleTheme = () => {
    const fn = window.toggleTheme;
    if (typeof fn === 'function') fn();
  };

  return (
    <div
      className="dashboard-overlay"
      role="button"
      tabIndex={-1}
      aria-label="Close dashboard"
      onClick={handleClose}
      onKeyDown={handleKeyDown}
    >
      <div className="dashboard-panel" onClick={(e) => e.stopPropagation()}>
        <div className="dashboard-header">
          <h2 className="dashboard-title">Today's Sales</h2>
          <button type="button" className="dashboard-theme-toggle min-tap" aria-label="Toggle light or dark theme" onClick={toggleTheme}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </button>
        </div>

        <div className="dashboard-list">
          {MOCK_TXS.length === 0 ? (
            <div className="dashboard-empty">No transactions yet today</div>
          ) : (
            MOCK_TXS.map(tx => (
              <div key={tx.id} className="dashboard-row">
                <div className="dashboard-time">{tx.time}</div>
                <div className="dashboard-txid">{tx.txid}</div>
                <div className="dashboard-amount">
                  {tx.amount}
                  <span
                    className={`dashboard-dot dashboard-dot--${tx.status}`}
                    role="status"
                    aria-label={STATUS_LABEL[tx.status] ?? tx.status}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
