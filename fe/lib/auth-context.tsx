"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  handleOAuthCallback: (params: URLSearchParams) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      setAccessToken(token);
      setRefreshToken(refresh);
      setUser(JSON.parse(userStr));
    }
  }, []);



  const login = (user: User, accessToken: string, refreshToken: string) => {
    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.push("/");
  };

  // Xử lý callback OAuth: lấy token, user từ URL, lưu vào context
  const handleOAuthCallback = (params: URLSearchParams) => {
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const userBase64 = params.get("user");
    if (access_token && userBase64) {
      try {
        const user = JSON.parse(atob(userBase64));
        login(user, access_token, refresh_token || "");
        router.push("/dashboard");
      } catch {
        // ignore
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, refreshToken, login, logout, isAuthenticated: !!user, handleOAuthCallback }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}; 