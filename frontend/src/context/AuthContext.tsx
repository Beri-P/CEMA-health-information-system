import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface User {
  id: string;
  username: string;
  role: string;
}

interface CustomJwtPayload extends JwtPayload {
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
      if (!token) {
        setLoading(false);
        return;
      }
  
      try {
        // decode the token into a JwtPayload
        const payload = jwtDecode<CustomJwtPayload>(token);
        const currentTime = Date.now() / 1000;
  
        // if there's no exp or it's in the past, logout
        if (!payload.exp || payload.exp < currentTime) {
          handleLogout();
        } else {
          // set the Authorization header for axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
          // build your User object from the payload
          const userInfo: User = {
            id: payload.id as string,          // or payload.sub if your token uses 'sub'
            username: payload.username as string,
            role: payload.role as string
          };
  
          setUser(userInfo);
          setIsAuthenticated(true);
        }
      } catch {
        handleLogout();
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