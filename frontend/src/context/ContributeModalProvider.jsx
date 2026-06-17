import { useState, useCallback } from 'react';
import { ContributeModalContext } from './contributeModalContext';

/**
 * ContributeModalProvider — supplies the contribute conversion modal's open/close state.
 *
 * Phase B seam: `open` should gain a logged-in check — logged-in users skip the modal
 * and go to the /contribute workflow; logged-out users get the modal.
 */
export function ContributeModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ContributeModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ContributeModalContext.Provider>
  );
}
