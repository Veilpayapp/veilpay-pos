import { useEffect, useRef } from 'react';
import { NetworkConfig } from '../types';

interface Props {
  networks: NetworkConfig[];
  loading: boolean;
  selectedChain: string;
  selectedToken: string;
  onChange: (chainKey: string, tokenSymbol: string) => void;
}

const NetworkTokenSelector: React.FC<Props> = ({
  networks,
  loading,
  selectedChain,
  selectedToken,
  onChange,
}) => {
  const isInitialized = useRef(false);

  // Initialize selection once networks are loaded
  useEffect(() => {
    if (loading || networks.length === 0 || isInitialized.current) return;
    
    let defaultChain = networks.find(n => n.chainKey === 'polygon');
    if (!defaultChain) defaultChain = networks[0];

    let defaultToken = defaultChain.tokens.find(t => t.symbol === 'USDC');
    if (!defaultToken) defaultToken = defaultChain.tokens[0];

    onChange(defaultChain.chainKey, defaultToken.symbol);
    isInitialized.current = true;
  }, [networks, loading, onChange]);

  // If chain changes, validate token
  const handleChainChange = (newChainKey: string) => {
    const chain = networks.find(n => n.chainKey === newChainKey);
    if (!chain) return;
    
    let newTokenSymbol = selectedToken;
    const hasToken = chain.tokens.some(t => t.symbol === selectedToken);
    
    if (!hasToken) {
      newTokenSymbol = chain.tokens[0]?.symbol || '';
    }
    
    onChange(newChainKey, newTokenSymbol);
  };

  const handleTokenChange = (newTokenSymbol: string) => {
    onChange(selectedChain, newTokenSymbol);
  };

  const currentChain = networks.find(n => n.chainKey === selectedChain);
  const currentTokens = currentChain?.tokens || [];

  const getPillStyle = (isSelected: boolean, color: string = '#888899') => ({
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    padding: '0 14px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 600,
    gap: '6px',
    marginRight: '8px',
    border: isSelected ? `1.5px solid ${color}` : '1px solid #2A2A3E',
    backgroundColor: isSelected ? `${color}26` : '#1A1A2E', // 26 hex is ~15% opacity
    color: isSelected ? '#FFFFFF' : '#888899',
    whiteSpace: 'nowrap' as const,
  });

  const rowStyle = {
    display: 'flex',
    overflowX: 'auto' as const,
    WebkitOverflowScrolling: 'touch' as any,
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    paddingBottom: '8px',
  };

  const labelStyle = {
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    color: 'var(--text-muted)',
    marginBottom: '8px',
    textAlign: 'left' as const,
  };

  const getTokenColor = (symbol: string) => {
    if (symbol === 'USDC') return '#2775CA';
    if (symbol === 'USDT') return '#26A17B';
    return '#888899';
  };

  if (loading) {
    return (
      <div style={{ background: 'var(--surface-color)', padding: '16px', borderRadius: '12px' }}>
        <div style={labelStyle}>Network</div>
        <div style={rowStyle}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: '40px', width: '100px', borderRadius: '999px', background: '#2A2A3E', marginRight: '8px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--surface-color)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div style={labelStyle}>Network</div>
        <div style={rowStyle} className="hide-scroll">
          {networks.map(n => {
            const isSelected = selectedChain === n.chainKey;
            const chainColor = n.color || '#888899';
            return (
              <button 
                key={n.chainKey} 
                onClick={() => handleChainChange(n.chainKey)}
                style={getPillStyle(isSelected, chainColor)}
                className="min-tap"
              >
                {n.logoUrl ? (
                  <img src={n.logoUrl} alt="" width="16" height="16" style={{ borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: chainColor }} />
                )}
                {n.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={labelStyle}>Token</div>
        <div style={rowStyle} className="hide-scroll">
          {currentTokens.map(t => {
            const isSelected = selectedToken === t.symbol;
            const tokenColor = getTokenColor(t.symbol);
            return (
              <button 
                key={t.symbol} 
                onClick={() => handleTokenChange(t.symbol)}
                style={getPillStyle(isSelected, tokenColor)}
                className="min-tap"
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: tokenColor }} />
                {t.symbol}
              </button>
            );
          })}
        </div>
      </div>
      <style>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default NetworkTokenSelector;
