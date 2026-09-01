import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { authApi, type LoginData, type SignupData, type User } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isClient: boolean;
  isArtisan: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fidus_token'));
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('fidus_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    return null;
  });

  useEffect(() => {
    const syncState = () => {
      const storedToken = localStorage.getItem('fidus_token');
      const storedUser = localStorage.getItem('fidus_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('fidus_token');
          localStorage.removeItem('fidus_user');
          setToken(null);
          setUser(null);
        }
      } else {
        setToken(null);
        setUser(null);
      }
    };

    // Initial sync
    syncState();

    // Listen for cross-tab changes
    window.addEventListener('storage', syncState);
    return () => window.removeEventListener('storage', syncState);
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await authApi.login(data);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('fidus_token', newToken);
      localStorage.setItem('fidus_user', JSON.stringify(newUser));
      
      setToken(newToken);
      setUser(newUser);
      
      toast.success('Logged in successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      await authApi.signup(data);
      toast.success('Account created successfully! Please log in.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('fidus_token');
    localStorage.removeItem('fidus_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('fidus_user', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!token;
  const isClient = user?.role === 'Client';
  const isArtisan = user?.role === 'Artisan';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isClient,
        isArtisan,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
