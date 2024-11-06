import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Since we're not using authentication, we'll just provide a dummy user object
  const user = { name: 'Guest', isAdmin: true };

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}