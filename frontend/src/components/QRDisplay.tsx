import React, { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRDisplayProps, QR_SIZE } from '../types';

const QRDisplay: React.FC<QRDisplayProps> = ({ value, size = QR_SIZE }) => {
  // QRCodeSVG requires literal color strings (it cannot resolve var() refs).
  // QR is always black-on-white per spec (both themes) — read once, memoized.
  const { bgColor, fgColor } = useMemo(() => {
    const rootStyle = typeof document !== 'undefined'
      ? getComputedStyle(document.documentElement)
      : null;
    return {
      bgColor: rootStyle?.getPropertyValue('--color-qr-bg').trim() || '#FFFFFF',
      fgColor: rootStyle?.getPropertyValue('--color-qr-fg').trim() || '#000000',
    };
  }, []);

  const truncated = useMemo(
    () => value ? `${value.slice(0, 8)}...${value.slice(-6)}` : '',
    [value]
  );

  return (
    <div className="qr-display">
      <div className="qr-display-bg">
        <QRCodeSVG value={value} size={size} bgColor={bgColor} fgColor={fgColor} level="H" includeMargin={false} />
      </div>
      <p className="qr-display-addr">{truncated}</p>
    </div>
  );
};

export default React.memo(QRDisplay);
