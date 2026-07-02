/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VEILPAY_BASE_URL: string;
  readonly VITE_MERCHANT_ID: string;
  readonly VITE_MERCHANT_API_KEY: string;
  readonly VITE_INVOICE_EXPIRY_MINUTES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  toggleTheme?: () => void;
}
