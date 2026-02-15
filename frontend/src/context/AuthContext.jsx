import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    if (token && userId && email && role) {
      setUser({ token, userId: Number(userId), email, role });
    }
    setLoading(false);
  }, []);

  const login = (authResponse) => {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('userId', String(authResponse.userId));
    localStorage.setItem('email', authResponse.email);
    localStorage.setItem('role', authResponse.role);
    setUser({
      token: authResponse.token,
      userId: authResponse.userId,
      email: authResponse.email,
      role: authResponse.role,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'USER';

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
