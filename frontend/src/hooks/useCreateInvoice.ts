import { useState, useCallback } from 'react';
import { usePOS } from '../context/POSContext';
import { createInvoice as createInvoiceApi } from '../services/veilpayApi';
import { InvoiceResponse, MAX_AMOUNT_USD, DEFAULT_MEMO } from '../types';

export const useCreateInvoice = () => {
  const { state, dispatch } = usePOS();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(async (amountUSD: number): Promise<boolean> => {
    const hasSelection = !!state.selectedChain && !!state.selectedToken;
    if (amountUSD <= 0 || amountUSD > MAX_AMOUNT_USD || !hasSelection) {
      return false;
    }
    setIsSubmitting(true);
    try {
      dispatch({ type: 'SET_AMOUNT', amountUSD, memo: DEFAULT_MEMO });
      const invoice: InvoiceResponse = await createInvoiceApi(
        amountUSD,
        state.selectedChain,
        state.selectedToken,
        DEFAULT_MEMO
      );
      dispatch({
        type: 'INVOICE_CREATED',
        payload: {
          invoiceId: invoice.invoiceId,
          paymentAddress: invoice.paymentAddress,
          expiresAt: invoice.expiresAt,
        },
      });
      dispatch({ type: 'STATUS_UPDATE', status: invoice.status });
      dispatch({ type: 'GO_TO_SCREEN', screen: 'qr' });
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create invoice';
      dispatch({ type: 'SET_ERROR', message });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [state.selectedChain, state.selectedToken, dispatch]);

  return { isSubmitting, submit };
};
