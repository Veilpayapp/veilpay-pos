import { useCallback, useEffect, useState } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import IdleScreen from './screens/IdleScreen';
import AmountScreen from './screens/AmountScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import QRScreen from './screens/QRScreen';
import ProcessingScreen from './screens/ProcessingScreen';
import SuccessScreen from './screens/SuccessScreen';
import ErrorScreen from './screens/ErrorScreen';
import DashboardScreen from './screens/DashboardScreen';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/global.css';

const ScreenManager = () => {
  const { state } = usePOS();

  switch (state.screen) {
    case 'idle':
      return <IdleScreen />;
    case 'amount':
      return <AmountScreen />;
    case 'payment':
      return <PaymentMethodScreen />;
    case 'qr':
      return <QRScreen />;
    case 'processing':
      return <ProcessingScreen />;
    case 'success':
      return <SuccessScreen />;
    case 'error':
      return <ErrorScreen />;
    case 'dashboard':
      return <DashboardScreen />;
    default:
      return <IdleScreen />;
  }
};

const App = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('veilpay_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('veilpay_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  useEffect(() => {
    window.toggleTheme = toggleTheme;
  }, [toggleTheme]);

  return (
    <POSProvider>
      <ErrorBoundary>
        <ScreenManager />
      </ErrorBoundary>
    </POSProvider>
  );
};

export default App;
