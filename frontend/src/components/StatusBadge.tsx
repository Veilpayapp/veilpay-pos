import { StatusBadgeProps } from '../types';

const LABELS: Record<string, string> = {
  pending:   '⏳ Waiting for Payment',
  paid:      '✅ Payment Received',
  expired:   '⏰ Expired',
  cancelled: '✖ Cancelled',
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (!status) return null;
  const label = LABELS[status];
  if (!label) return null;

  return <span className={`status-badge status-badge--${status}`}>{label}</span>;
};

export default StatusBadge;
