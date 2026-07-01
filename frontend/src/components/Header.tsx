import { useEffect, useState } from 'react';
import { HeaderProps } from '../types';

const Header = ({ title, showBack, onBack }: HeaderProps) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="header">
      <div className="header-left">
        {showBack && <button className="header-back min-tap" onClick={onBack}>←</button>}
      </div>
      <div className="header-title">{title}</div>
      <div className="header-clock">{time}</div>
    </div>
  );
};

export default Header;
