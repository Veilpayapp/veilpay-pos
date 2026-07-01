import React, { useEffect, useRef } from 'react';
import { NetworkTokenSelectorProps } from '../types';

const TOKEN_COLORS: Record<string, string> = {
  USDC: '#2775CA',
  USDT: '#26A17B',
};

const NetworkTokenSelector: React.FC<NetworkTokenSelectorProps> = ({
  networks, loading, selectedChain, selectedToken, onChange,
}) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (loading || networks.length === 0 || isInitialized.current) return;
    const chain = networks.find(n => n.chainKey === 'polygon') ?? networks[0];
    const token = chain.tokens.find(t => t.symbol === 'USDC') ?? chain.tokens[0];
    onChange(chain.chainKey, token.symbol);
    isInitialized.current = true;
  }, [networks, loading, onChange]);

  const handleChain = (key: string) => {
    const chain = networks.find(n => n.chainKey === key);
    if (!chain) return;
    const valid = chain.tokens.some(t => t.symbol === selectedToken);
    onChange(key, valid ? selectedToken : chain.tokens[0]?.symbol ?? '');
  };

  const current = networks.find(n => n.chainKey === selectedChain);

  if (loading) {
    return (
      <div className="nts">
        <div><div className="nts-label">Network</div>
          <div className="nts-scroll">{[1,2,3,4].map(i => <div key={i} className="nts-skeleton" />)}</div>
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
            const c = n.color ?? '#888899';
            return (
              <button key={n.chainKey} className={`nts-pill ${sel ? 'nts-pill--selected' : ''} min-tap`}
                style={sel ? { '--pill-color': c, '--pill-bg': `${c}26` } as React.CSSProperties : undefined}
                onClick={() => handleChain(n.chainKey)}>
                {n.logoUrl ? <img className="nts-img" src={n.logoUrl} alt="" width={16} height={16} /> : <span className="nts-dot" style={{ '--pill-color': c } as React.CSSProperties} />}
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
            const c = TOKEN_COLORS[t.symbol] ?? '#888899';
            return (
              <button key={t.symbol} className={`nts-pill ${sel ? 'nts-pill--selected' : ''} min-tap`}
                style={sel ? { '--pill-color': c, '--pill-bg': `${c}26` } as React.CSSProperties : undefined}
                onClick={() => onChange(selectedChain, t.symbol)}>
                <span className="nts-dot" style={{ '--pill-color': c } as React.CSSProperties} />
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
