import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// 1. Define your User shape (matches what you save in Cosmos DB)
export type UserRole = "guest" | "student" | "parent" | "teacher" | "principal" | "admin" | "moderator";

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

// 2. Define what the Context provides to the rest of the app
interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean; // <--- This fixes your Navbar logic
  isLoading: boolean;
  login: (userData: UserProfile) => void;
  logout: () => void;
  hasRole: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 3. On startup, check if we have a user saved in LocalStorage (so refreshing doesn't log you out)
  useEffect(() => {
    const storedUser = localStorage.getItem("eco_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("eco_user");
      }
    }
    setIsLoading(false);
  }, []);

  // 4. The Login Function (Called by Login.tsx after API success)
  const login = (userData: UserProfile) => {
    setUser(userData);
    // Save to browser storage so they stay logged in
    localStorage.setItem("eco_user", JSON.stringify(userData));
    // Redirect to profile
    navigate("/profile"); 
  };

  // 5. The Logout Function (Called by Navbar)
  const logout = () => {
    setUser(null);
    localStorage.removeItem("eco_user");
    navigate("/login");
  };

  // Helper: Check if user has specific permission
  const hasRole = (requiredRoles: UserRole[]) => {
    if (!user) return false;
    if (user.role === "moderator" || user.role === "admin") return true;
    return requiredRoles.includes(user.role);
  };

  // Calculated property for Navbar
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, hasRole }}>
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