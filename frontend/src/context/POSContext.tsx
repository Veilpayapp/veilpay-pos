import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type POSState = {
  screen: 'idle' | 'amount' | 'qr' | 'success' | 'error';
  amountUSD: number;
  invoiceId: string | null;
  paymentAddress: string | null;
  expiresAt: string | null;
  txStatus: 'pending' | 'paid' | 'expired' | 'cancelled' | null;
  errorMessage: string | null;
  memo: string;
  selectedChain: string;
  selectedToken: string;
};

type Action =
  | { type: 'SET_AMOUNT'; amountUSD: number; memo: string }
  | { type: 'INVOICE_CREATED'; payload: { invoiceId: string; paymentAddress: string; expiresAt: string } }
  | { type: 'STATUS_UPDATE'; status: 'pending' | 'paid' | 'expired' | 'cancelled' }
  | { type: 'GO_TO_SCREEN'; screen: POSState['screen'] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'SET_SELECTION'; chainKey: string; tokenSymbol: string }
  | { type: 'RESET' };

const initialState: POSState = {
  screen: 'idle',
  amountUSD: 0,
  invoiceId: null,
  paymentAddress: null,
  expiresAt: null,
  txStatus: null,
  errorMessage: null,
  memo: '',
  selectedChain: '',
  selectedToken: '',
};

const posReducer = (state: POSState, action: Action): POSState => {
  switch (action.type) {
    case 'SET_AMOUNT':
      return { ...state, amountUSD: action.amountUSD, memo: action.memo };
    case 'INVOICE_CREATED':
      return {
        ...state,
        invoiceId: action.payload.invoiceId,
        paymentAddress: action.payload.paymentAddress,
        expiresAt: action.payload.expiresAt,
        screen: 'qr',
      };
    case 'STATUS_UPDATE':
      return { ...state, txStatus: action.status };
    case 'GO_TO_SCREEN':
      return { ...state, screen: action.screen };
    case 'SET_ERROR':
      return { ...state, errorMessage: action.message, screen: 'error' };
    case 'SET_SELECTION':
      return { ...state, selectedChain: action.chainKey, selectedToken: action.tokenSymbol };
    case 'RESET':
      return { ...initialState, selectedChain: state.selectedChain, selectedToken: state.selectedToken };
    default:
      return state;
  }
};

interface POSContextType {
  state: POSState;
  dispatch: React.Dispatch<Action>;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(posReducer, initialState);

  return (
    <POSContext.Provider value={{ state, dispatch }}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
