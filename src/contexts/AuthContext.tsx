import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

export type UserRole =
  | "guest"
  | "student"
  | "parent"
  | "teacher"
  | "principal"
  | "admin"
  | "moderator";

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginResponse: { user: UserProfile; token: string }) => void;
  logout: () => void;
  hasRole: (requiredRoles: UserRole[]) => boolean;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("eco_user");
    const storedToken = localStorage.getItem("eco_token");
    if (storedUser && storedToken) {
      try {
        // Basic JWT expiry check (decode payload without verification - verification happens server-side)
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          setUser(JSON.parse(storedUser));
        } else {
          // Token expired
          localStorage.removeItem("eco_user");
          localStorage.removeItem("eco_token");
        }
      } catch (e) {
        console.error("Failed to parse stored auth data", e);
        localStorage.removeItem("eco_user");
        localStorage.removeItem("eco_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (loginResponse: { user: UserProfile; token: string }) => {
    setUser(loginResponse.user);
    localStorage.setItem("eco_user", JSON.stringify(loginResponse.user));
    localStorage.setItem("eco_token", loginResponse.token);
    navigate("/profile");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eco_user");
    localStorage.removeItem("eco_token");
    navigate("/login");
  };

  const getToken = () => localStorage.getItem("eco_token");

  const hasRole = (requiredRoles: UserRole[]) => {
    if (!user) return false;
    if (user.role === "moderator" || user.role === "admin") return true;
    return requiredRoles.includes(user.role);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, hasRole, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
