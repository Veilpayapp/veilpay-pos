import { QRCodeSVG } from 'qrcode.react';

const QRDisplay = ({ value, size = 260 }: { value: string; size?: number }) => {
  const truncated = value ? `${value.slice(0, 8)}...${value.slice(-6)}` : '';
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '10px', display: 'inline-block' }}>
        <QRCodeSVG 
          value={value} 
          size={size} 
          bgColor="#FFFFFF" 
          fgColor="#0D0D14" 
          level="H" 
          includeMargin={false} 
        />
      </div>
      <p style={{ marginTop: '12px', fontFamily: 'monospace', fontSize: '11px', color: '#555577' }}>
        {truncated}
      </p>
    </div>
  );
};

export default QRDisplay;
