import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem("jwt_token");
    }
    return false;
  });

  const login = (token: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem("jwt_token", token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to save authentication token:', error);
    }
  };

  const logout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("jwt_token");
      }
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Failed to remove authentication token:', error);
      setIsAuthenticated(false); // Still set to false even if localStorage fails
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
