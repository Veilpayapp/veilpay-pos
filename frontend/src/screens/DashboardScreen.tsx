import { useCallback } from 'react';
import { usePOS } from '../context/POSContext';
import { useTranslation } from '../context/LanguageContext';

const MOCK_TXS = [
  { id: '1', time: '14:23', txid: '0x3f...9a12', amount: '$ 45.00', status: 'settled' },
  { id: '2', time: '12:45', txid: '0x7e...2b99', amount: '$ 12.50', status: 'settled' },
  { id: '3', time: '09:12', txid: '0x1a...4c88', amount: '$ 89.99', status: 'pending' },
];

const DashboardScreen = () => {
  const { dispatch } = usePOS();
  const { t } = useTranslation();

  const handleClose = useCallback(() => {
    dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
  }, [dispatch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      dispatch({ type: 'GO_TO_SCREEN', screen: 'idle' });
    }
  }, [dispatch]);

  const handleSettings = useCallback(() => {
    dispatch({ type: 'GO_TO_SCREEN', screen: 'settings' });
  }, [dispatch]);

  const getStatusLabel = useCallback((status: string): string => {
    if (status === 'settled') return t('settled');
    if (status === 'pending') return t('pending');
    return status;
  }, [t]);

  return (
    <div
      className="dashboard-overlay"
      role="button"
      tabIndex={-1}
      aria-label={t('back_to_dashboard')}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
    >
      <div className="dashboard-panel" onClick={(e) => e.stopPropagation()}>
        <div className="dashboard-header">
          <h2 className="dashboard-title">{t('todays_sales')}</h2>
          <div className="dashboard-header-actions">
            <button type="button" className="dashboard-settings-btn min-tap" aria-label={t('settings')} onClick={handleSettings}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="dashboard-list">
          {MOCK_TXS.length === 0 ? (
            <div className="dashboard-empty">{t('no_transactions')}</div>
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
                    aria-label={getStatusLabel(tx.status)}
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
