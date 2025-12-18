import React, { createContext, useContext, useMemo, useState } from "react";

type AuthUser = { email: string; roles: string[] } | null;

type AuthContextValue = {
  user: AuthUser;
  token: string | null;
  setAuth: (token: string, email: string, roles: string[]) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function parseJwt(token: string): any {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<AuthUser>(() => {
    const t = localStorage.getItem("token");
    if (!t) return null;

    const p = parseJwt(t);
    const email =
      p?.email ||
      p?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
      "";
    const roles = ([] as string[]).concat(
      p?.role ??
        p?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
        []
    );
    return { email, roles };
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      setAuth: (t, email, roles) => {
        localStorage.setItem("token", t);
        setToken(t);
        setUser({ email, roles });
      },
      logout: () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      },
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
