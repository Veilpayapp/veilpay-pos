import { POSProvider, usePOS } from './context/POSContext';
import IdleScreen from './screens/IdleScreen';
import AmountScreen from './screens/AmountScreen';
import QRScreen from './screens/QRScreen';
import SuccessScreen from './screens/SuccessScreen';
import ErrorScreen from './screens/ErrorScreen';
import './styles/global.css';

const ScreenManager = () => {
  const { state } = usePOS();
  
  switch (state.screen) {
    case 'idle':
      return <IdleScreen />;
    case 'amount':
      return <AmountScreen />;
    case 'qr':
      return <QRScreen />;
    case 'success':
      return <SuccessScreen />;
    case 'error':
      return <ErrorScreen />;
    default:
      return <IdleScreen />;
  }
};

const App = () => {
  return (
    <div style={{ width: '800px', height: '480px', overflow: 'hidden', background: 'var(--color-bg)' }}>
      <POSProvider>
        <ScreenManager />
      </POSProvider>
    </div>
  );
};

export default App;
