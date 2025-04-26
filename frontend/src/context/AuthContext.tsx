import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Verify token expiration
          const decoded: any = jwt_decode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            handleLogout();
          } else {
            // Set authorization header for all API requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Get user info
            const userInfo: User = {
              id: decoded.id,
              username: decoded.username,
              role: decoded.role
            };
            
            setUser(userInfo);
            setIsAuthenticated(true);
          }
        } catch (error) {
          handleLogout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        username,
        password
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login: handleLogin,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;