import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRDisplayProps } from '../types';

const QRDisplay: React.FC<QRDisplayProps> = ({ value, size = 260 }) => {
  const truncated = value ? `${value.slice(0, 8)}...${value.slice(-6)}` : '';

  return (
    <div className="qr-display">
      <div className="qr-display-bg">
        <QRCodeSVG value={value} size={size} bgColor="#FFFFFF" fgColor="#0D0D14" level="H" includeMargin={false} />
      </div>
      <p className="qr-display-addr">{truncated}</p>
    </div>
  );
};

export default React.memo(QRDisplay);
