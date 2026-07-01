import { useEffect, useState } from 'react';
import { usePOS } from '../context/POSContext';

const IdleScreen = () => {
  const { dispatch } = usePOS();
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleStart = () => {
    dispatch({ type: 'GO_TO_SCREEN', screen: 'amount' });
  };

  return (
    <div className="idle">
      <div className="idle-clock">{time}</div>
      <div className="idle-logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22S4 17.18 4 9V5l8-3 8 3v4c0 8.18-8 13-8 13z" fill="var(--color-green)" />
        </svg>
        <span className="idle-logo-text">VeilPay</span>
      </div>
      <div className="idle-center">
        <h2 className="idle-title">Ready for Payment</h2>
        <p className="idle-subtitle">Enter the bill amount to begin</p>
      </div>
      <div className="idle-bottom">
        <button className="idle-start min-tap" onClick={handleStart}>New Transaction</button>
      </div>
    </div>
  );
};

export default IdleScreen;
