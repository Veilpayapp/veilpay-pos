import { useEffect, useState } from 'react';
import { HeaderProps } from '../types';

const formatTime = (): string =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

const Header = ({ title, showBack, onBack }: HeaderProps) => {
  const [time, setTime] = useState(formatTime);

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="header">
      <div className="header-left">
        {showBack && <button type="button" className="header-back" onClick={onBack}>←</button>}
      </div>
      <div className="header-title">{title}</div>
      <div className="header-clock">{time}</div>
    </div>
  );
};

export default Header;
