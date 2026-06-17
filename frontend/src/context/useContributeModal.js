import { useContext } from 'react';
import { ContributeModalContext } from './contributeModalContext';

/** Access the contribute modal controls (isOpen, open, close). */
export function useContributeModal() {
  const ctx = useContext(ContributeModalContext);
  if (!ctx) throw new Error('useContributeModal must be used within ContributeModalProvider');
  return ctx;
}
