const StatusBadge = ({ status }: { status: "pending" | "paid" | "expired" | "cancelled" | null }) => {
  if (!status) return null;

  let config = { bg: '', text: '', border: '', label: '' };
  
  if (status === 'pending') {
    config = { bg: '#2A2200', text: '#FFD700', border: '#FFD70044', label: '⏳ Waiting for Payment' };
  } else if (status === 'paid') {
    config = { bg: '#0A2918', text: '#00C896', border: '#00C89644', label: '✅ Payment Received' };
  } else if (status === 'expired') {
    config = { bg: '#1F0A0A', text: '#FF4444', border: '#FF444444', label: '⏰ Expired' };
  } else if (status === 'cancelled') {
    config = { bg: '#1A1A1A', text: '#888899', border: '#88889944', label: '✖ Cancelled' };
  }

  return (
    <span style={{
      background: config.bg,
      color: config.text,
      border: `1px solid ${config.border}`,
      borderRadius: '999px',
      padding: '8px 20px',
      fontSize: '15px',
      fontWeight: 600,
      letterSpacing: '0.3px',
      display: 'inline-flex',
      alignItems: 'center'
    }}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
