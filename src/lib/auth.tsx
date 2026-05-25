import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { mockUsers, type User, type Role } from "./mock-data";

interface AuthCtx {
  user: User | null;
  login: (email: string, _password: string, role?: Role) => User;
  register: (name: string, email: string, role: Role) => User;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "route_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem(KEY, JSON.stringify(u));
      else localStorage.removeItem(KEY);
    }
  };

  const login = (email: string, _pw: string, role?: Role) => {
    let r: Role = role ?? "resident";
    if (email.includes("admin")) r = "admin";
    else if (email.includes("petugas") || email.includes("transport")) r = "transporter";
    const u = { ...mockUsers[r], email };
    persist(u);
    return u;
  };

  const register = (name: string, email: string, role: Role) => {
    const u: User = { ...mockUsers[role], id: "new-" + Date.now(), name, email, role };
    persist(u);
    return u;
  };

  const logout = () => persist(null);

  return <Ctx.Provider value={{ user, login, register, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function dashboardPath(role: Role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "transporter") return "/petugas/dashboard";
  return "/app/dashboard";
}
