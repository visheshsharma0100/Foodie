import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

const USER_KEY = "user";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return Number(payload.exp) * 1000;
  } catch {
    return 0;
  }
}

function readSession() {
  const token = localStorage.getItem("token");
  const user = readStoredUser();
  if (!token || !user || getTokenExpiry(token) <= Date.now()) {
    localStorage.removeItem("token");
    localStorage.removeItem(USER_KEY);
    return null;
  }
  return user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const persistSession = useCallback((token, nextUser) => {
    localStorage.setItem("token", token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    persistSession(data.token, data.user);
    return data.user;
  }, [persistSession]);

  const register = useCallback(async (name, email, password) => {
    const data = await authApi.register({ name, email, password });
    persistSession(data.token, data.user);
    return data.user;
  }, [persistSession]);

  const googleLogin = useCallback(async (payload) => {
    const data = await authApi.google(payload);
    persistSession(data.token, data.user);
    return data.user;
  }, [persistSession]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener("foodiehub:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("foodiehub:unauthorized", handleUnauthorized);
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const delay = getTokenExpiry(token) - Date.now();
    if (!user || delay <= 0) return undefined;
    const timeout = window.setTimeout(logout, delay);
    return () => window.clearTimeout(timeout);
  }, [user, logout]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      register,
      googleLogin,
      logout,
    }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
