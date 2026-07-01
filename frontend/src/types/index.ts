// ─── Shared Prop Interfaces ─────────────────────────────────────────────────

export interface QRDisplayProps {
  value: string;
  size?: number;
}

export interface StatusBadgeProps {
  status: 'pending' | 'paid' | 'expired' | 'cancelled' | null;
}

export interface NumPadProps {
  value: string;
  onChange: (newValue: string) => void;
}

export interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export interface NetworkTokenSelectorProps {
  networks: NetworkConfig[];
  loading: boolean;
  selectedChain: string;
  selectedToken: string;
  onChange: (chainKey: string, tokenSymbol: string) => void;
}

// ─── Data Types ─────────────────────────────────────────────────────────────

export type TokenConfig = {
  symbol: string;
  label: string;
  decimals: number;
  contractAddress?: string;
};

export type NetworkConfig = {
  chainKey: string;
  label: string;
  shortLabel: string;
  logoUrl?: string;
  color?: string;
  tokens: TokenConfig[];
};

export type InvoiceResponse = {
  invoiceId: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  paymentAddress: string;
  expiresAt: string;
};

export type InvoiceStatusResponse = {
  invoiceId: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  expiresAt: string;
};

// ─── Constants ──────────────────────────────────────────────────────────────

export const POLL_INTERVAL_MS = 2500;
export const TIMER_INTERVAL_MS = 1000;
export const AUTO_RETURN_SECONDS = 8;
export const MAX_AMOUNT_CHARS = 7;
export const MAX_AMOUNT_USD = 99999;
export const API_TIMEOUT_MS = 10000;
export const DEFAULT_EXPIRY_MINUTES = 3;
export const DEFAULT_MEMO = 'POS Register 1';
