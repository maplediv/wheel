import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  user: { firstName: string; email: string; userId: string } | null;
  login: (userData: { firstName: string; email: string; userId: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ firstName: string; email: string; userId: string } | null>(null);
  const [palettes, setPalettes] = useState([]); // State for storing palettes

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log('User loaded from localStorage:', parsedUser);
    }
  }, []);

  const login = (userData: { firstName: string; email: string; userId: string }) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    fetchPalettes(userData.userId); // Fetch palettes when logging in
  };

  const logout = () => {
    setUser(null);
    setPalettes([]); // Clear palettes on logout
    localStorage.removeItem('user');
  };

  // Function to fetch palettes when a user logs in
  const fetchPalettes = async (userId: string) => {
    const response = await fetch(`/api/palettes/${userId}`);
    const data = await response.json();
    if (data) {
      setPalettes(data); // Set palettes in state
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, palettes }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
