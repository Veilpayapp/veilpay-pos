import { useEffect, useState } from 'react';

const Header = ({ title, showBack, onBack }: { title: string; showBack?: boolean; onBack?: () => void }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100%', height: '56px', background: '#13131F', borderBottom: '1px solid #1E1E30', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
      <div style={{ width: '60px', display: 'flex', alignItems: 'center' }}>
        {showBack && (
          <button 
            onClick={onBack} 
            className="min-tap"
            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#FFF', fontSize: '24px' }}
          >
            ←
          </button>
        )}
      </div>
      <div style={{ flex: 1, textAlign: 'center', fontSize: '17px', color: '#FFF', fontWeight: 600 }}>
        {title}
      </div>
      <div style={{ width: '60px', textAlign: 'right', fontSize: '15px', color: '#FFF', fontWeight: 600 }}>
        {time}
      </div>
    </div>
  );
};

export default Header;
