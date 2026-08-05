"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GetOrderUserItems, orderItems } from "@/src/actions/orders/get-orders-user";
import { useAuth } from "@/src/context/AuthContext";
import { formatDateTime } from "@/src/utils/formatDateTime";
import { formatMoney } from "@/src/utils/formatMoney";
import { ShoppingBag, ChevronRight, Clock, CheckCircle2, XCircle, Truck, Package, Search, X, ArrowUpDown } from "lucide-react";
import Loading from "../ui/loading";

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
type StatusKey = "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado" | string;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  pendiente:   { label: "Pendiente",   color: "#c8ff00", bg: "rgba(200,255,0,0.06)",   border: "rgba(200,255,0,0.25)",   icon: Clock         },
  procesando:  { label: "Procesando",  color: "#a855f7", bg: "rgba(168,85,247,0.06)",  border: "rgba(168,85,247,0.25)",  icon: Package       },
  enviado:     { label: "Enviado",     color: "#00e5ff", bg: "rgba(0,229,255,0.06)",   border: "rgba(0,229,255,0.25)",   icon: Truck         },
  entregado:   { label: "Entregado",   color: "#c8ff00", bg: "rgba(200,255,0,0.06)",   border: "rgba(200,255,0,0.25)",   icon: CheckCircle2  },
  cancelado:   { label: "Cancelado",   color: "#ef4444", bg: "rgba(239,68,68,0.06)",   border: "rgba(239,68,68,0.25)",   icon: XCircle       },
};

const getStatus = (s: string) => STATUS_CONFIG[s?.toLowerCase()] ?? {
  label: s, color: "#52525b", bg: "rgba(82,82,91,0.06)", border: "rgba(82,82,91,0.2)", icon: Clock,
};

type SortKey = "date-desc" | "date-asc" | "total-desc" | "total-asc";

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = getStatus(status);
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1"
      style={{
        fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase",
        color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
        clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
      }}>
      <Icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  );
}

// ─── ORDER ROW ────────────────────────────────────────────────────────────────
function OrderRow({ order, index }: { order: orderItems; index: number }) {
  const cfg = getStatus(order.status);

  return (
    <motion.li
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index, 10) * 0.055, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      {/* Barra lateral de color según status */}
      <div className="absolute left-0 top-0 bottom-0 w-0.75 transition-all duration-300"
        style={{ background: cfg.color, opacity: 0.5, boxShadow: `0 0 8px ${cfg.color}` }} />

      <div className="relative ml-0.75 flex flex-col sm:flex-row sm:items-center gap-4 bg-zinc-950 border border-zinc-800/60
                      px-5 py-4 group-hover:border-zinc-700/60 transition-colors duration-300"
        style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>

        {/* Acento esquina */}
        <span aria-hidden className="absolute top-0 right-0 w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: cfg.color, clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />

        {/* Número de orden */}
        <div className="shrink-0 flex flex-col gap-0.5">
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3f3f46" }}>
            Orden
          </span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.05em", color: cfg.color, lineHeight: 1 }}>
            #{String(order.idOrden).padStart(4, "0")}
          </span>
        </div>

        <div className="w-px h-10 bg-zinc-800/60 hidden sm:block shrink-0" />

        {/* Fecha */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3f3f46" }}>
            Fecha pedido
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#71717a" }}>
            {formatDateTime(order.fechaOrden)}
          </span>
        </div>

        <div className="w-px h-10 bg-zinc-800/60 hidden sm:block shrink-0" />

        {/* Status */}
        <div className="shrink-0">
          <StatusBadge status={order.status} />
        </div>

        {/* Total */}
        <div className="flex flex-col gap-0.5 sm:ml-auto">
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3f3f46" }}>
            Total
          </span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.02em", color: "#a855f7", lineHeight: 1 }}>
            {formatMoney(order.total)}
          </span>
        </div>

        {/* Botón detalles */}
        <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.96 }} className="shrink-0">
          <Link href={`/orders/${order.idOrden}`}
            className="flex items-center gap-2 border border-zinc-700 text-zinc-500 px-4 py-2
                       hover:border-[#c8ff00]/50 hover:text-[#c8ff00] transition-all duration-200"
            style={{
              fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase",
              clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
            }}>
            Detalles
            <ChevronRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    </motion.li>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function ClientOrders() {
  const [orders, setOrders]   = useState<orderItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [sort, setSort]       = useState<SortKey>("date-desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { getIdToken } = useAuth();

  useEffect(() => {
    (async () => {
      const idToken = await getIdToken();
      if (!idToken) { setLoading(false); return; }
      try {
        const data = await GetOrderUserItems(idToken);
        setOrders(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [getIdToken]);

  // Statuses únicos para filtro
  const statuses = ["all", ...Array.from(new Set(orders.map((o) => o.status?.toLowerCase()).filter(Boolean)))];

  const filtered = orders
    .filter((o) => {
      const q = search.toLowerCase();
      const matchSearch = !q || String(o.idOrden).includes(q) || o.status?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status?.toLowerCase() === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sort === "date-desc")  return new Date(b.fechaOrden).getTime() - new Date(a.fechaOrden).getTime();
      if (sort === "date-asc")   return new Date(a.fechaOrden).getTime() - new Date(b.fechaOrden).getTime();
      if (sort === "total-desc") return b.total - a.total;
      if (sort === "total-asc")  return a.total - b.total;
      return 0;
    });

  const totalGastado = orders.reduce((acc, o) => acc + o.total, 0);

  if (loading) return <Loading />;

  return (
    <div className="w-full bg-black min-h-screen relative overflow-hidden">

      {/* Grid fondo */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(200,255,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)",
        }} />

      <div className="max-w-4xl mx-auto px-4 pt-12 pb-24 relative">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3 text-[#c8ff00]"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase" }}>
            <span className="w-8 h-px bg-[#c8ff00]" />
            Historial
          </div>

          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 7vw, 5rem)", letterSpacing: "0.02em" }}>
              <span className="text-white">MIS </span>
              <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>ÓRDENES</span>
            </h1>

            {/* Resumen rápido */}
            {orders.length > 0 && (
              <div className="flex items-center gap-4 mb-1">
                <div className="flex items-center gap-2 border border-[#c8ff00]/30 bg-[#c8ff00]/5 px-3 py-1.5"
                  style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#c8ff00]" />
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", lineHeight: 1, color: "#c8ff00" }}>
                    {orders.length}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b" }}>
                    órdenes
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── CONTROLES ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col gap-3 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Búsqueda */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por # de orden o estado..."
                className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-700
                           pl-9 pr-9 py-2.5 outline-none focus:border-[#c8ff00]/40 transition-colors"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.05em",
                  clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative flex items-center">
              <ArrowUpDown className="absolute left-3 w-3 h-3 text-zinc-600 pointer-events-none" />
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-400 pl-8 pr-4 py-2.5 outline-none
                           focus:border-zinc-600 transition-colors cursor-pointer appearance-none"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.05em",
                  clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
                <option value="date-desc">Más reciente</option>
                <option value="date-asc">Más antigua</option>
                <option value="total-desc">Mayor total</option>
                <option value="total-asc">Menor total</option>
              </select>
            </div>
          </div>

          {/* Filtros de status */}
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => {
              const cfg = s === "all" ? null : getStatus(s);
              const isActive = statusFilter === s;
              return (
                <motion.button key={s} onClick={() => setStatusFilter(s)}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 text-[8px] tracking-widest uppercase transition-all duration-200"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    color: isActive ? (cfg?.color ?? "#FFFFF") : "#FFFFFF",
                    background: isActive ? (cfg?.bg ?? "rgba(200,255,0,0.1)") : "transparent",
                    border: `1px solid ${isActive ? (cfg?.border ?? "rgba(200,255,0,0.3)") : "rgba(63,63,70,0.5)"}`,
                    clipPath: isActive ? "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))" : "none",
                  }}>
                  {s === "all" ? "Todos" : (getStatus(s).label)}
                </motion.button>
              );
            })}
          </div>

          {/* Contador */}
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3f3f46" }}>
            {filtered.length === 0 ? "Sin resultados" : `${filtered.length} ${filtered.length === 1 ? "orden" : "órdenes"}`}
          </div>
        </motion.div>

        {/* ── LISTA ── */}
        <AnimatePresence mode="wait">
          {orders.length === 0 ? (
            <motion.div key="empty"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 gap-6 border border-zinc-800/40"
            >
              <ShoppingBag className="w-12 h-12 text-zinc-800" />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 10vw, 7rem)", color: "transparent", WebkitTextStroke: "1px rgba(200,255,0,0.12)" }}>
                VACÍO
              </span>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b" }}>
                No tienes órdenes registradas aún.
              </p>
              <motion.a href="/productos" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-[#c8ff00] text-black px-6 py-3"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
                Explorar productos →
              </motion.a>
            </motion.div>

          ) : filtered.length === 0 ? (
            <motion.div key="no-results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4 border border-zinc-800/40"
            >
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "transparent", WebkitTextStroke: "1px rgba(200,255,0,0.12)" }}>
                SIN RESULTADOS
              </span>
              <button onClick={() => { setSearch(""); setStatusFilter("all"); }}
                className="border border-zinc-700 text-zinc-500 px-4 py-2 hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-all"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Limpiar filtros
              </button>
            </motion.div>

          ) : (
            <motion.ul key="list" className="flex flex-col gap-2">
              {filtered.map((order, i) => (
                <OrderRow key={order.idOrden} order={order} index={i} />
              ))}

              {/* Fin de lista */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex flex-col items-start gap-1 pt-3 pl-1"
              >
                <span className="h-px bg-[#c8ff00] w-16 opacity-80" />
                <span className="h-px bg-[#c8ff00] w-10 opacity-50" />
                <span className="h-px bg-[#c8ff00] w-5  opacity-25" />
              </motion.div>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      `}</style>
    </div>
  );
}