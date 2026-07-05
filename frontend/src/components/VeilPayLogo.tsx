import React from 'react';

const VeilPayLogo: React.FC<{ size?: number }> = ({ size = 72 }) => {
  return (
    <div className="vp-logo-wrap" aria-hidden="true">
      <img
        className="vp-logo-img"
        src="/src/assets/logo.png"
        alt="VeilPay"
        width={size}
        height={size}
        draggable={false}
      />
      <span className="vp-logo-text">VeilPay</span>
    </div>
  );
};

export default React.memo(VeilPayLogo);
