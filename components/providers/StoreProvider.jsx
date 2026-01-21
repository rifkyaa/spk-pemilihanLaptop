'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { useLaptopStore } from '@/store/laptopStore';

const StoreContext = createContext(null);

export default function StoreProvider({ children }) {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = useLaptopStore;
  }
  
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

export function useLaptopContext() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useLaptopContext must be used within StoreProvider');
  }
  return useStore(store);
}