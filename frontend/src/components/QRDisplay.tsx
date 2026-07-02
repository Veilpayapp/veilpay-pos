import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRDisplayProps, QR_SIZE } from '../types';

// QRCodeSVG requires literal color strings (it cannot resolve var() refs).
// Colors are defined as CSS variables in global.css and read here at module
// load time so no hex values live inside this TSX file. Fallbacks use CSS
// named colors which are QR-spec-safe (black-on-white) if CSS hasn't loaded.
const rootStyle = getComputedStyle(document.documentElement);
const QR_BG_COLOR = rootStyle.getPropertyValue('--color-qr-bg').trim() || 'white';
const QR_FG_COLOR = rootStyle.getPropertyValue('--color-qr-fg').trim() || 'black';

const QRDisplay: React.FC<QRDisplayProps> = ({ value, size = QR_SIZE }) => {
  const truncated = value ? `${value.slice(0, 8)}...${value.slice(-6)}` : '';

  return (
    <div className="qr-display">
      <div className="qr-display-bg">
        <QRCodeSVG value={value} size={size} bgColor={QR_BG_COLOR} fgColor={QR_FG_COLOR} level="H" includeMargin={false} />
      </div>
      <p className="qr-display-addr">{truncated}</p>
    </div>
  );
};

export default React.memo(QRDisplay);
