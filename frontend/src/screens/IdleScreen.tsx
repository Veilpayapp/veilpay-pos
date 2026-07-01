import { useEffect, useState } from 'react';
import { usePOS } from '../context/POSContext';

const IdleScreen = () => {
  const { dispatch } = usePOS();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: 600 }}>
        {time}
      </div>

      <div style={{ height: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
          <path d="M12 22S4 17.18 4 9V5l8-3 8 3v4c0 8.18-8 13-8 13z" fill="var(--accent-green)" />
        </svg>
        <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-green)' }}>VeilPay</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '48px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Ready for Payment</h2>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Enter the bill amount to begin</p>
      </div>

      <div style={{ height: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <button 
          onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'amount' })}
          className="min-tap"
          style={{
            width: '100%',
            height: '72px',
            background: 'var(--accent-green)',
            color: '#000',
            borderRadius: '12px',
            fontSize: '22px',
            fontWeight: 700
          }}
        >
          New Transaction
        </button>
      </div>
    </div>
  );
};

export default IdleScreen;
