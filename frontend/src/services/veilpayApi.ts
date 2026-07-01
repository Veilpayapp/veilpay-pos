import axios from 'axios';
import { InvoiceResponse, InvoiceStatusResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_VEILPAY_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_MERCHANT_API_KEY || '',
  },
  timeout: 10000,
});

export const createInvoice = async (
  amountUSD: number,
  chainKey: string,
  tokenSymbol: string,
  memo: string
): Promise<InvoiceResponse> => {
  try {
    const merchantId = import.meta.env.VITE_MERCHANT_ID || '';
    const expiresInMinutes = import.meta.env.VITE_INVOICE_EXPIRY_MINUTES ? parseInt(import.meta.env.VITE_INVOICE_EXPIRY_MINUTES, 10) : 15;

    const response = await api.post('/api/v1/invoice/create', {
      merchantId,
      chainKey,
      tokenSymbol,
      amount: amountUSD,
      expiresInMinutes,
      memo,
      privacyLevel: 'public',
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create invoice');
  }
};

export const getInvoiceStatus = async (invoiceId: string): Promise<InvoiceStatusResponse> => {
  try {
    const response = await api.get(`/api/v1/invoice/${invoiceId}/status`);
    return response.data;
  } catch (error) {
    return { invoiceId, status: 'pending', expiresAt: '' } as InvoiceStatusResponse;
  }
};

export { api as veilpayApi };
