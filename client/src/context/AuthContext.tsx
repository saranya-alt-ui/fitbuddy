import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { apiService } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasProfile: boolean;
  isDemoAiMode: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; confirmPassword: string }) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  setHasProfile: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("fitbuddy_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("fitbuddy_token"));
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [isDemoAiMode, setIsDemoAiMode] = useState(false);

  // Check health and demo AI mode
  useEffect(() => {
    apiService
      .getHealth()
      .then((res) => {
        if (res.data?.aiMode === "demo-mode") {
          setIsDemoAiMode(true);
        }
      })
      .catch(() => {});
  }, []);

  const checkAuthStatus = async () => {
    const storedToken = localStorage.getItem("fitbuddy_token");
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.getMe();
      if (response.data.success) {
        setUser(response.data.user);
        setHasProfile(response.data.hasProfile);
        localStorage.setItem("fitbuddy_user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      localStorage.removeItem("fitbuddy_token");
      localStorage.removeItem("fitbuddy_user");
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await apiService.login(credentials);
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem("fitbuddy_token", receivedToken);
      localStorage.setItem("fitbuddy_user", JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      // Check if profile exists
      try {
        const profileRes = await apiService.getProfile();
        setHasProfile(!!profileRes.data?.profile);
      } catch (e) {
        setHasProfile(false);
      }
    }
  };

  const register = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
    const res = await apiService.register(data);
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem("fitbuddy_token", receivedToken);
      localStorage.setItem("fitbuddy_user", JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      setHasProfile(false);
    }
  };

  const logout = () => {
    apiService.logout().catch(() => {});
    localStorage.removeItem("fitbuddy_token");
    localStorage.removeItem("fitbuddy_user");
    setUser(null);
    setToken(null);
    setHasProfile(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        hasProfile,
        isDemoAiMode,
        login,
        register,
        logout,
        checkAuthStatus,
        setHasProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
