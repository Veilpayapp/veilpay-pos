import React, { useCallback } from 'react';
import { NetworkTokenSelectorProps, SKELETON_PILL_COUNT } from '../types';

const NetworkTokenSelector: React.FC<NetworkTokenSelectorProps> = ({
  networks, loading, selectedChain, selectedToken, onChange,
}) => {
  const handleChain = useCallback((key: string) => {
    const chain = networks.find(n => n.chainKey === key);
    if (!chain) return;
    const valid = chain.tokens.some(t => t.symbol === selectedToken);
    onChange(key, valid ? selectedToken : chain.tokens[0]?.symbol ?? '');
  }, [networks, selectedToken, onChange]);

  const handleToken = useCallback((symbol: string) => {
    onChange(selectedChain, symbol);
  }, [selectedChain, onChange]);

  const current = networks.find(n => n.chainKey === selectedChain);

  if (loading) {
    return (
      <div className="nts">
        <div className="nts-label">Network</div>
        <div className="nts-scroll">
          {Array.from({ length: SKELETON_PILL_COUNT }, (_, i) => <div key={i} className="nts-skeleton" />)}
        </div>
      </div>
    );
  }

  if (networks.length === 0) {
    return <div className="nts"><div className="nts-empty">No networks available</div></div>;
  }

  return (
    <div className="nts">
      <div>
        <div className="nts-label">Network</div>
        <div className="nts-scroll">
          {networks.map(n => {
            const sel = selectedChain === n.chainKey;
            return (
              <button
                type="button"
                key={n.chainKey}
                className={`nts-pill ${sel ? 'nts-pill--selected' : ''} min-tap`}
                aria-label={`Select ${n.label} network${sel ? ', selected' : ''}`}
                aria-pressed={sel}
                onClick={() => handleChain(n.chainKey)}
              >
                {n.logoUrl
                  ? <img className="nts-img" src={n.logoUrl} alt="" width={16} height={16} />
                  : <span className="nts-dot" style={n.color ? { background: n.color } : undefined} />}
                {n.shortLabel}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <div className="nts-label">Token</div>
        <div className="nts-scroll">
          {(current?.tokens ?? []).map(t => {
            const sel = selectedToken === t.symbol;
            return (
              <button
                type="button"
                key={t.symbol}
                className={`nts-pill ${sel ? 'nts-pill--selected' : ''} min-tap`}
                aria-label={`Select ${t.label} token${sel ? ', selected' : ''}`}
                aria-pressed={sel}
                onClick={() => handleToken(t.symbol)}
              >
                <span className="nts-dot" style={current?.color ? { background: current.color } : undefined} />
                {t.symbol}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(NetworkTokenSelector);
