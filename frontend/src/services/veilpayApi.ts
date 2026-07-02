import axios from 'axios';
import { InvoiceResponse, InvoiceStatusResponse, API_TIMEOUT_MS, DEFAULT_EXPIRY_MINUTES } from '../types';

/**
 * VeilPay API Service
 *
 * SECURITY NOTE: VITE_MERCHANT_API_KEY is bundled into the client-side JS.
 * This is acceptable for a local kiosk device (Raspberry Pi on a private network)
 * but must NEVER be used in a publicly-accessible web deployment. The backend
 * should restrict this key to the kiosk's IP address for defense-in-depth.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_VEILPAY_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_MERCHANT_API_KEY || '',
  },
  timeout: API_TIMEOUT_MS,
});

export const createInvoice = async (
  amountUSD: number,
  chainKey: string,
  tokenSymbol: string,
  memo: string
): Promise<InvoiceResponse> => {
  try {
    const merchantId = import.meta.env.VITE_MERCHANT_ID || '';
    const expiresInMinutes = import.meta.env.VITE_INVOICE_EXPIRY_MINUTES
      ? parseInt(import.meta.env.VITE_INVOICE_EXPIRY_MINUTES, 10)
      : DEFAULT_EXPIRY_MINUTES;

    const response = await api.post<InvoiceResponse>('/api/v1/invoice/create', {
      merchantId,
      chainKey,
      tokenSymbol,
      amount: amountUSD,
      expiresInMinutes,
      memo,
      privacyLevel: 'public',
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // No response means the request never reached the backend (offline / DNS / CORS).
      if (error.request && !error.response) {
        throw new Error('Network error');
      }
      throw new Error(error.response?.data?.message || 'Failed to create invoice');
    }
    throw new Error('Failed to create invoice');
  }
};

export const getInvoiceStatus = async (
  invoiceId: string,
  signal?: AbortSignal
): Promise<InvoiceStatusResponse> => {
  try {
    const response = await api.get<InvoiceStatusResponse>(
      `/api/v1/invoice/${invoiceId}/status`,
      { signal }
    );
    return response.data;
  } catch (_error: unknown) {
    return { invoiceId, status: 'pending', expiresAt: '' };
  }
};

export { api as veilpayApi };
