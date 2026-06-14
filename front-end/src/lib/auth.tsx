import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Role } from "./mock-data";
import { apiFetch, toApiRole, fromApiRole } from "./api";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  area?: string;
  avatar?: string;
  address?: string;
  wilayah_id?: string;
  no_telepon?: string;
  lat?: number;
  lng?: number;
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string, email: string, password: string, role: Role,
    address?: string, no_telepon?: string, wilayah_id?: string,
    lat?: number, lng?: number
  ) => Promise<User>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);
const USER_KEY = "route_user";
const TOKEN_KEY = "route_token";

function mapUser(raw: any): User {
  return {
    id: raw.id,
    name: raw.nama,
    email: raw.email,
    role: fromApiRole(raw.role),
    address: raw.alamat,
    wilayah_id: raw.wilayah_id,
    no_telepon: raw.no_telepon,
    lat: raw.lat,
    lng: raw.lng,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const restoreSession = async () => {
    if (typeof window === "undefined") { setLoading(false); return; }

    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);

    if (!token || !raw) { setLoading(false); return; }

    try {
      const profile = await apiFetch<any>("/auth/me");
      setUser(mapUser(profile));
      localStorage.setItem(USER_KEY, JSON.stringify(mapUser(profile)));
    } catch {
      // Access token expired, coba refresh via Supabase
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) throw new Error("No session");

        localStorage.setItem(TOKEN_KEY, data.session.access_token);

        const profile = await apiFetch<any>("/auth/me");
        const u = mapUser(profile);
        setUser(u);
        localStorage.setItem(USER_KEY, JSON.stringify(u));
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  restoreSession();
}, []);

  const persist = (u: User | null, token?: string) => {
    setUser(u);
    if (typeof window === "undefined") return;
    if (u) {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      if (token) localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    const data = await apiFetch<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const u = mapUser(data.user);
    persist(u, data.token);
    return u;
  };

  const register = async (
    name: string, email: string, password: string, role: Role,
    address?: string, no_telepon?: string, wilayah_id?: string,
    lat?: number, lng?: number
  ): Promise<User> => {
    await apiFetch<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        nama: name, email, password,
        role: toApiRole(role),
        no_telepon, alamat: address, wilayah_id,
        lat, lng,
      }),
    });
    return login(email, password);
  };

  const logout = async () => {
    try { await apiFetch("/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    await supabase.auth.signOut();
    persist(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
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