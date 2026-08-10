"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { buildApiUrl } from "@/src/utils/baseApiUrl";

type Status = "loading" | "admin" | "denied";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { getIdToken } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getIdToken();
      if (!token) { if (!cancelled) setStatus("denied"); return; }
      try {
        const res = await fetch(buildApiUrl("/auth/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) setStatus(res.ok ? "admin" : "denied");
      } catch {
        if (!cancelled) setStatus("denied");
      }
    })();
    return () => { cancelled = true; };
  }, [getIdToken]);

  useEffect(() => { if (status === "denied") router.replace("/"); }, [status, router]);

  if (status === "loading")
    return <div className="flex items-center justify-center min-h-screen text-zinc-400">Verificando acceso...</div>;
  if (status === "denied") return null;
  return <>{children}</>;
}