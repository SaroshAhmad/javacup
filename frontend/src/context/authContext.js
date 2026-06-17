import { createContext } from 'react';

/** Auth context object. Provider in AuthProvider.jsx, hook in useAuth.js — split so each
 *  file satisfies react-refresh/only-export-components. */
export const AuthContext = createContext(null);
