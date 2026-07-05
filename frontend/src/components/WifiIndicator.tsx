import React, { useMemo } from 'react';
import { useNetworkStatus, type SignalStrength } from '../hooks/useNetworkStatus';
import { useTranslation } from '../context/LanguageContext';
import type { TranslationKey } from '../data/translations';

const STRENGTH_BARS: Record<SignalStrength, number> = {
  healthy: 3,
  mid: 2,
  poor: 1,
  offline: 0,
};

const STRENGTH_COLOR: Record<SignalStrength, string> = {
  healthy: 'var(--color-success)',
  mid: 'var(--color-accent)',
  poor: 'var(--color-error)',
  offline: 'var(--color-textSecondary)',
};

const STRENGTH_KEY: Record<SignalStrength, TranslationKey> = {
  healthy: 'healthy',
  mid: 'mid',
  poor: 'poor',
  offline: 'offline',
};

/** Color the latency number by quality tier */
const latencyColor = (ms: number): string => {
  if (ms <= 600)  return 'var(--color-success)';
  if (ms <= 1800) return 'var(--color-accent)';
  return 'var(--color-error)';
};

const WifiIndicator: React.FC = () => {
  const { strength, latencyMs, checking } = useNetworkStatus();
  const { t } = useTranslation();

  const color   = STRENGTH_COLOR[strength];
  const bars    = STRENGTH_BARS[strength];
  const label   = t(STRENGTH_KEY[strength]);
  const isOffline = strength === 'offline';

  const latencyText = useMemo(() => {
    if (latencyMs === null) return null;
    return `${latencyMs}ms`;
  }, [latencyMs]);

  const pingColor = latencyMs !== null ? latencyColor(latencyMs) : 'var(--color-textSecondary)';

  return (
    <div
      className={`wifi-indicator${isOffline ? ' wifi-indicator--offline' : ''}`}
      aria-label={`Network: ${label}${latencyText ? `, ${latencyText} ping` : ''}`}
      role="status"
    >
      {/* Signal bars (or offline dot) */}
      {isOffline ? (
        <span className="wifi-offline-dot" aria-hidden="true" />
      ) : (
        <div className="wifi-bars" aria-hidden="true">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`wifi-bar${checking ? ' wifi-bar--checking' : ''}`}
              style={{
                background: i < bars ? color : 'var(--color-bgTertiary)',
                opacity:    i < bars ? 1 : 0.35,
                animationDelay: checking ? `${i * 120}ms` : '0ms',
              }}
            />
          ))}
        </div>
      )}

      {/* Label + latency ping */}
      <div className="wifi-info">
        <span className="wifi-label" style={{ color }}>{label}</span>
        {latencyText && (
          <span className="wifi-ping" style={{ color: pingColor }}>
            {latencyText}
          </span>
        )}
        {isOffline && !latencyText && (
          <span className="wifi-ping wifi-ping--offline">—ms</span>
        )}
      </div>
    </div>
  );
};

export default React.memo(WifiIndicator);
