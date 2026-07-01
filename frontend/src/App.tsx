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
    <POSProvider>
      <ScreenManager />
    </POSProvider>
  );
};

export default App;
