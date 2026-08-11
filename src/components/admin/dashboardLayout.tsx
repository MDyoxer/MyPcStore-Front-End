"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { buildApiUrl } from "@/src/utils/baseApiUrl";

type Status = "loading" | "admin" | "denied";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, getIdToken } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    (async () => {
      if (!user) { if (!cancelled) setStatus("denied"); return; }
      const token = await getIdToken();
      if (!token) { if (!cancelled) setStatus("denied"); return; }
      try {
        const res = await fetch(buildApiUrl("/auth/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) {
          if (res.ok) {
            setStatus("admin");
          } else {
            const body = await res.text().catch(() => "");
            console.error(`/auth/me responded ${res.status}: ${body}`);
            setStatus("denied");
          }
        }
      } catch (error) {
        console.error("/auth/me fetch failed:", error);
        if (!cancelled) setStatus("denied");
      }
    })();
    return () => { cancelled = true; };
  }, [loading, user, getIdToken]);

  useEffect(() => { if (status === "denied") router.replace("/"); }, [status, router]);

  if (status === "loading")
    return <div className="flex items-center justify-center min-h-screen text-zinc-400">Verificando acceso...</div>;
  if (status === "denied") return null;
  return <>{children}</>;
}