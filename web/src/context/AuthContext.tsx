import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, tokens: AuthTokens) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_tokens';
const USER_KEY = 'user_data';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const storedTokens = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedTokens && storedUser) {
          const tokens: AuthTokens = JSON.parse(storedTokens);
          const userData: User = JSON.parse(storedUser);

          // Check if access token is expired
          if (Date.now() >= tokens.expiresIn) {
            // Try to refresh the token
            await refreshSession();
          } else {
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const refreshSession = async () => {
    try {
      const storedTokens = localStorage.getItem(TOKEN_KEY);
      if (!storedTokens) {
        throw new Error('No tokens found');
      }

      const tokens: AuthTokens = JSON.parse(storedTokens);
      
      // TODO: Implement actual token refresh with your backend
      // const response = await fetch('/api/auth/refresh', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      // });
      // const newTokens = await response.json();

      // For now, we'll just extend the current token
      const newTokens = {
        ...tokens,
        expiresIn: Date.now() + 3600000, // 1 hour from now
      };

      localStorage.setItem(TOKEN_KEY, JSON.stringify(newTokens));
    } catch (error) {
      console.error('Error refreshing session:', error);
      logout();
    }
  };

  const login = (userData: User, tokens: AuthTokens) => {
    // Store tokens and user data
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    setUser(null);
    setIsAuthenticated(false);
  };

  // Set up token refresh interval
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        refreshSession();
      }, 300000); // Refresh every 5 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, refreshSession }}>
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