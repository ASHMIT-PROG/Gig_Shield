import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [riderProfile, setRiderProfile] = useState(null);
  const [loading] = useState(false);

  const isAdmin = riderProfile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, riderProfile, setRiderProfile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
