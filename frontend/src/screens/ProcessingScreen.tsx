import { useEffect, useRef } from 'react';
import { usePOS } from '../context/POSContext';
import { PROCESSING_DURATION_MS } from '../types';

const ProcessingScreen = () => {
  const { dispatch } = usePOS();
  const dispatched = useRef(false);

  useEffect(() => {
    const id = setTimeout(() => {
      if (dispatched.current) return;
      dispatched.current = true;
      dispatch({ type: 'GO_TO_SCREEN', screen: 'success' });
    }, PROCESSING_DURATION_MS);

    return () => clearTimeout(id);
  }, [dispatch]);

  return (
    <div className="processing" role="status" aria-live="polite" aria-label="Processing payment">
      <div className="processing-bar-track" aria-hidden="true">
        <div className="processing-bar" />
      </div>
      <span className="processing-text">PROCESSING...</span>
    </div>
  );
};

export default ProcessingScreen;
