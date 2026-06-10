const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("route_token");
}

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      const { data } = await supabase.auth.refreshSession();
      if (data.session) {
        localStorage.setItem("route_token", data.session.access_token);
        return apiFetch(path, options);
      }
    } catch {
      // refresh gagal
    }
    localStorage.removeItem("route_token");
    localStorage.removeItem("route_user");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  const json = await res.json();
  if (!res.ok || json.status === "error") throw new Error(json.message ?? "Request failed");
  return json.data as T;
}

// ─── Role mapping ────────────────────────────────────────────────
import type { Role } from "./mock-data";

export const toApiRole = (r: Role) =>
  r === "resident" ? "warga" : r === "transporter" ? "petugas" : "admin";

export const fromApiRole = (r: string): Role =>
  r === "warga" ? "resident" : r === "petugas" ? "transporter" : "admin";

// ─── Status mapping ───────────────────────────────────────────────
export type ApiPickupStatus = "terjadwal" | "dalam_perjalanan" | "sudah_diambil" | "dibatalkan";
export type ApiRequestStatus = "menunggu" | "diterima" | "dijadwalkan" | "selesai" | "ditolak";

export const fromApiStatus = (s: ApiPickupStatus): string => {
  const m: Record<ApiPickupStatus, string> = {
    terjadwal: "scheduled",
    dalam_perjalanan: "on_the_way",
    sudah_diambil: "picked_up",
    dibatalkan: "failed",
  };
  return m[s] ?? s;
};

export const toApiStatus = (s: string): ApiPickupStatus => {
  const m: Record<string, ApiPickupStatus> = {
    scheduled: "terjadwal",
    on_the_way: "dalam_perjalanan",
    picked_up: "sudah_diambil",
    failed: "dibatalkan",
  };
  return m[s] ?? "terjadwal";
};

export const fromApiRequestStatus = (s: string): string => {
  const m: Record<string, string> = {
    menunggu: "Pending",
    diterima: "Accepted",
    dijadwalkan: "Scheduled",
    selesai: "Completed",
    ditolak: "Rejected",
  };
  return m[s] ?? s;
};

export const toApiRequestStatus = (s: string): string => {
  const m: Record<string, string> = {
    Pending: "menunggu",
    Accepted: "diterima",
    Scheduled: "dijadwalkan",
    Completed: "selesai",
    Rejected: "ditolak",
  };
  return m[s] ?? s;
};

// ─── API helpers ─────────────────────────────────────────────────
export interface ApiUser {
  id: string; nama: string; email: string; role: string;
  no_telepon?: string; alamat?: string; wilayah_id?: string; created_at?: string; lat?: number; lng?: number;  
}

export interface ApiWilayah {
  id: string; nama_wilayah: string; kecamatan: string; kota: string;
  lat?: number; lng?: number;
}

export interface ApiJadwalTetap {
  id: string; hari: string; jam_mulai: string; jam_selesai: string;
  is_active: boolean;
  wilayah?: ApiWilayah;
  users?: ApiUser;
}

export interface ApiJadwalHarian {
  id: string; tanggal: string; status: ApiPickupStatus; catatan?: string;
  jadwal_tetap?: ApiJadwalTetap;
  users?: ApiUser;
}

export interface ApiRequest {
  id: string; jenis_sampah: string; estimasi_jumlah: string;
  catatan?: string; status: string; created_at: string;
  users?: ApiUser;
  wilayah?: ApiWilayah;
  jadwal_harian?: { id: string; tanggal: string; status: string };
}
