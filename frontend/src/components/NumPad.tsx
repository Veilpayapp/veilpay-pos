import React from 'react';
import { NumPadProps, MAX_AMOUNT_CHARS } from '../types';

const KEYS = ['1','2','3','4','5','6','7','8','9','.','0','⌫'] as const;

const NumPad: React.FC<NumPadProps> = ({ value, onChange }) => {
  const handlePress = (k: string) => {
    if (k === '⌫') {
      const next = value.slice(0, -1);
      onChange(next === '' ? '0' : next);
    } else if (k === '.') {
      if (!value.includes('.')) onChange(value + '.');
    } else if (value === '0') {
      onChange(k);
    } else if (value.length < MAX_AMOUNT_CHARS) {
      onChange(value + k);
    }
  };

  return (
    <div className="numpad">
      {KEYS.map(k => (
        <button key={k} className="numpad-key" onClick={() => handlePress(k)}>{k}</button>
      ))}
    </div>
  );
};

export default React.memo(NumPad);
