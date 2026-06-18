import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { LineItem } from '../types';
import data from '../data/products.json';

interface BundleState {
  lineItems: LineItem[];
  activeStep: number;
}

type Action =
  | { type: 'SET_QUANTITY'; productId: string; variantId?: string; quantity: number }
  | { type: 'SET_STEP'; step: number }
  | { type: 'LOAD_STATE'; state: BundleState };

function bundleReducer(state: BundleState, action: Action): BundleState {
  switch (action.type) {
    case 'SET_QUANTITY': {
      const { productId, variantId, quantity } = action;
      const existing = state.lineItems.find(
        li => li.productId === productId && li.variantId === variantId
      );

      let newItems: LineItem[];
      if (quantity <= 0) {
        newItems = state.lineItems.filter(
          li => !(li.productId === productId && li.variantId === variantId)
        );
      } else if (existing) {
        newItems = state.lineItems.map(li =>
          li.productId === productId && li.variantId === variantId
            ? { ...li, quantity }
            : li
        );
      } else {
        newItems = [...state.lineItems, { productId, variantId, quantity }];
      }
      return { ...state, lineItems: newItems };
    }
    case 'SET_STEP':
      return { ...state, activeStep: action.step };
    case 'LOAD_STATE':
      return action.state;
    default:
      return state;
  }
}

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

const defaultState: BundleState = {
  lineItems: data.initialLineItems as LineItem[],
  activeStep: isMobile ? -1 : 0,
};

interface BundleContextValue {
  state: BundleState;
  setQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  setStep: (step: number) => void;
  getQuantity: (productId: string, variantId?: string) => number;
  getProductTotalQuantity: (productId: string) => number;
  saveSystem: () => void;
  loadSystem: () => boolean;
}

const BundleContext = createContext<BundleContextValue | null>(null);

export function BundleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bundleReducer, defaultState, (initial) => {
    const saved = localStorage.getItem('wyze-bundle-saved');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { /* ignore */ }
    }
    return initial;
  });

  const setQuantity = useCallback((productId: string, variantId: string | undefined, quantity: number) => {
    dispatch({ type: 'SET_QUANTITY', productId, variantId, quantity });
  }, []);

  const setStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const getQuantity = useCallback((productId: string, variantId?: string) => {
    const item = state.lineItems.find(
      li => li.productId === productId && li.variantId === variantId
    );
    return item?.quantity ?? 0;
  }, [state.lineItems]);

  const getProductTotalQuantity = useCallback((productId: string) => {
    return state.lineItems
      .filter(li => li.productId === productId)
      .reduce((sum, li) => sum + li.quantity, 0);
  }, [state.lineItems]);

  const saveSystem = useCallback(() => {
    localStorage.setItem('wyze-bundle-saved', JSON.stringify(state));
  }, [state]);

  const loadSystem = useCallback(() => {
    const saved = localStorage.getItem('wyze-bundle-saved');
    if (saved) {
      try {
        dispatch({ type: 'LOAD_STATE', state: JSON.parse(saved) });
        return true;
      } catch { /* ignore */ }
    }
    return false;
  }, []);

  return (
    <BundleContext.Provider value={{ state, setQuantity, setStep, getQuantity, getProductTotalQuantity, saveSystem, loadSystem }}>
      {children}
    </BundleContext.Provider>
  );
}

export function useBundle() {
  const ctx = useContext(BundleContext);
  if (!ctx) throw new Error('useBundle must be used within BundleProvider');
  return ctx;
}
