import { usePOS } from '../context/POSContext';
import { useTranslation } from '../context/LanguageContext';
import VeilPayLogo from '../components/VeilPayLogo';

const IdleScreen = () => {
  const { dispatch } = usePOS();
  const { t } = useTranslation();

  const handleStart = () => {
    dispatch({ type: 'GO_TO_SCREEN', screen: 'amount' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStart();
    }
  };

  return (
    <div
      className="idle min-tap"
      role="button"
      tabIndex={0}
      aria-label={t('tap_to_start')}
      onClick={handleStart}
      onKeyDown={handleKeyDown}
      style={{ cursor: 'pointer' }}
    >
      <div className="idle-center">
        <VeilPayLogo size={72} />
        <p className="idle-subtitle">{t('ready_to_pay')}</p>
      </div>
    </div>
  );
};

export default IdleScreen;
