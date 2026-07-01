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

export type PaymentSelection = {
  chainKey: string;
  tokenSymbol: string;
};

export type InvoiceResponse = {
  invoiceId: string;
  status: "pending" | "paid" | "expired" | "cancelled";
  paymentAddress: string;
  expiresAt: string;
};

export type InvoiceStatusResponse = {
  invoiceId: string;
  status: "pending" | "paid" | "expired" | "cancelled";
  expiresAt: string;
};

