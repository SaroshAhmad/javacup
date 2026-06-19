import { createContext } from 'react';

/** Context object for the contribute modal. Provider lives in ContributeModalProvider.jsx,
 *  hook in useContributeModal.js — kept separate so each file satisfies react-refresh. */
export const ContributeModalContext = createContext(null);
