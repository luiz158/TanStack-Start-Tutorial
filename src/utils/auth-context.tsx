import * as React from "react";
import { loginUser, logoutUser, getCurrentUser } from "./auth.server";

type AuthState = {
  user: { id: string; email: string; name: string } | null;
  token: string | null;
};

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

function getStoredToken(): string | null {
  try {
    return localStorage.getItem("sessionToken");
  } catch {
    return null;
  }
}

function setStoredToken(token: string | null) {
  try {
    if (token) localStorage.setItem("sessionToken", token);
    else localStorage.removeItem("sessionToken");
  } catch {}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthState["user"]>(null);
  const [token, setToken] = React.useState<string | null>(getStoredToken());

  const refresh = React.useCallback(async () => {
    const t = getStoredToken();
    if (!t) {
      setUser(null);
      setToken(null);
      return;
    }
    try {
      const u = await getCurrentUser({ data: { token: t } });
      setUser(u);
      setToken(t);
    } catch {
      setUser(null);
      setToken(null);
      setStoredToken(null);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const login = React.useCallback(async (email: string, password: string) => {
    const session = await loginUser({ data: { email, password } });
    setStoredToken(session.token);
    setToken(session.token);
    setUser(session.user);
  }, []);

  const logout = React.useCallback(async () => {
    const t = getStoredToken();
    if (t) {
      await logoutUser({ data: { token: t } });
    }
    setStoredToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
