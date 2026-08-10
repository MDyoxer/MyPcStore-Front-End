"use client";

import { motion } from "motion/react";
import {
  TrendingUp, TrendingDown, ShoppingBag, Users, DollarSign,
  Package, Star, Truck, AlertTriangle, ArrowUpRight, Activity,
  Clock, CheckCircle2, XCircle,
  LucideIcon,
} from "lucide-react";

// ─── DATA FALSA ───────────────────────────────────────────────────────────────
const KPI = [
  { label: "Ventas del mes",    value: "$284,390",  delta: "+18.4%", up: true,  icon: DollarSign, color: "#c8ff00" },
  { label: "Órdenes totales",   value: "1,284",     delta: "+9.2%",  up: true,  icon: ShoppingBag,color: "#a855f7" },
  { label: "Clientes nuevos",   value: "342",       delta: "+24.1%", up: true,  icon: Users,      color: "#c8ff00" },
  { label: "Tasa de devolución",value: "2.3%",      delta: "-0.8%",  up: false, icon: TrendingDown,color: "#a855f7" },
];

const WEEKLY_SALES = [42, 68, 55, 91, 73, 110, 98, 134, 112, 155, 143, 178];
const WEEKLY_LABELS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const TOP_PRODUCTS = [
  { nombre: "Laptop ASUS ROG Strix G16",  ventas: 84, monto: "$2,151,916", stock: 12, color: "#c8ff00" },
  { nombre: "GPU RTX 4090 ASUS TUF",      ventas: 61, monto: "$1,098,000", stock: 5,  color: "#a855f7" },
  { nombre: "Ryzen 9 9950X",              ventas: 55, monto: "$687,500",   stock: 28, color: "#c8ff00" },
  { nombre: "Monitor Samsung Odyssey G5", ventas: 48, monto: "$574,000",   stock: 19, color: "#a855f7" },
  { nombre: "RAM DDR5 Corsair 32GB",      ventas: 39, monto: "$312,000",   stock: 43, color: "#c8ff00" },
];

const RECENT_ORDERS = [
  { id: "0041", cliente: "Marco Reyes",    monto: "$25,599", status: "entregado",  hora: "hace 8 min"  },
  { id: "0040", cliente: "Valeria Ríos",   monto: "$3,349",  status: "enviado",    hora: "hace 22 min" },
  { id: "0039", cliente: "Diego Herrera",  monto: "$12,800", status: "procesando", hora: "hace 1h"     },
  { id: "0038", cliente: "Lucía Paredes",  monto: "$1,999",  status: "pendiente",  hora: "hace 2h"     },
  { id: "0037", cliente: "Andrés Torres",  monto: "$8,450",  status: "cancelado",  hora: "hace 3h"     },
  { id: "0036", cliente: "Claudia Ríos",   monto: "$529",    status: "entregado",  hora: "hace 4h"     },
];

const ALERTS = [
  { text: "Stock crítico: GPU RTX 4090 — 5 unidades",  color: "#ef4444", icon: AlertTriangle },
  { text: "5 mensajes de contacto sin responder",       color: "#f59e0b", icon: Clock         },
  { text: "Reseña negativa nueva en Teclado Razer",    color: "#f59e0b", icon: Star          },
  { text: "Pedido #0035 lleva 48h sin actualizar",     color: "#ef4444", icon: Truck         },
];

const STATUS_CFG: Record<string, { color: string; icon: LucideIcon }> = {
  entregado:  { color: "#c8ff00", icon: CheckCircle2 },
  enviado:    { color: "#00e5ff", icon: Truck        },
  procesando: { color: "#a855f7", icon: Activity     },
  pendiente:  { color: "#f59e0b", icon: Clock        },
  cancelado:  { color: "#ef4444", icon: XCircle      },
};

// ─── MINI BARCHART ────────────────────────────────────────────────────────────
function BarChart() {
  const max = Math.max(...WEEKLY_SALES);
  return (
    <div className="flex items-end gap-1.5 h-28">
      {WEEKLY_SALES.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 100}%` }}
            transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="w-full rounded-sm relative group"
            style={{ background: i % 2 === 0 ? "#c8ff00" : "#a855f7", opacity: 0.8, minHeight: 4 }}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.7rem", color: "#fff", whiteSpace: "nowrap",
                background: "#18181b", border: "1px solid #27272a", padding: "2px 5px" }}>
              {v}K
            </div>
          </motion.div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", letterSpacing: "0.1em", color: "#3f3f46" }}>
            {WEEKLY_LABELS[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── DONUT CHART SIMPLE ───────────────────────────────────────────────────────
function DonutChart() {
  const data = [
    { label: "Laptops",      pct: 34, color: "#c8ff00" },
    { label: "GPU",          pct: 24, color: "#a855f7" },
    { label: "Procesadores", pct: 18, color: "#00e5ff" },
    { label: "Monitores",    pct: 14, color: "#f59e0b" },
    { label: "Periféricos",  pct: 10, color: "#ef4444" },
  ];

  let cumulativeAngle = -90;
  const r = 42, cx = 60, cy = 60;

  const slices = data.map((d) => {
    const angle = (d.pct / 100) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    const endAngle = cumulativeAngle;
    const start = {
      x: cx + r * Math.cos((startAngle * Math.PI) / 180),
      y: cy + r * Math.sin((startAngle * Math.PI) / 180),
    };
    const end = {
      x: cx + r * Math.cos((endAngle * Math.PI) / 180),
      y: cy + r * Math.sin((endAngle * Math.PI) / 180),
    };
    const large = angle > 180 ? 1 : 0;
    return { ...d, path: `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z` };
  });

  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {slices.map((s, i) => (
          <motion.path key={i} d={s.path} fill={s.color} opacity={0.85}
            initial={{ opacity: 0 }} animate={{ opacity: 0.85 }}
            transition={{ delay: i * 0.1, duration: 0.4 }} />
        ))}
        {/* Hueco central */}
        <circle cx={cx} cy={cy} r={24} fill="#09090b" />
        <text x={cx} y={cy + 5} textAnchor="middle" fill="#c8ff00"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "13px" }}>
          100%
        </text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="w-2 h-2 shrink-0 rounded-sm" style={{ background: d.color }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.08em", color: "#71717a" }}>
              {d.label}
            </span>
            <span className="ml-auto" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.95rem", color: d.color }}>
              {d.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
function KpiCard({ kpi, index }: { kpi: typeof KPI[0]; index: number }) {
  const Icon = kpi.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, boxShadow: `0 0 30px -10px ${kpi.color}` }}
      className="relative bg-zinc-950 border border-zinc-800/60 p-5 flex flex-col gap-3 overflow-hidden"
      style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
    >
      {/* Acento esquina */}
      <span aria-hidden className="absolute top-0 right-0 w-3 h-3"
        style={{ background: kpi.color, clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />

      {/* Glow fondo */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${kpi.color}06, transparent 70%)` }} />

      <div className="flex items-start justify-between relative">
        <div className="flex items-center justify-center w-9 h-9"
          style={{
            background: `${kpi.color}12`, border: `1px solid ${kpi.color}25`,
            clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
          }}>
          <Icon className="w-4 h-4" style={{ color: kpi.color }} />
        </div>
        <span
          className="flex items-center gap-1 px-2 py-0.5"
          style={{
            fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em",
            color: kpi.up ? "#c8ff00" : "#ef4444",
            background: kpi.up ? "rgba(200,255,0,0.08)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${kpi.up ? "rgba(200,255,0,0.2)" : "rgba(239,68,68,0.2)"}`,
          }}>
          {kpi.up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {kpi.delta}
        </span>
      </div>

      <div className="relative">
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.02em", color: kpi.color, lineHeight: 1 }}>
          {kpi.value}
        </p>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#52525b", marginTop: "4px" }}>
          {kpi.label}
        </p>
      </div>
    </motion.div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <div className="w-full bg-black min-h-screen relative overflow-x-hidden">

      {/* Grid fondo */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(200,255,0,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)",
        }} />

      <div className="max-w-7xl mx-auto px-4 pt-10 pb-20 relative">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-10 flex-wrap gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2 text-[#c8ff00]"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.35em", textTransform: "uppercase" }}>
              <span className="w-6 h-px bg-[#c8ff00]" />
              Panel de control
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.02em", lineHeight: 0.95 }}>
              <span className="text-white">ADMIN </span>
              <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>DASHBOARD</span>
            </h1>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 border border-zinc-800/60 bg-zinc-950 px-3 py-1.5"
            style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="w-1.5 h-1.5 rounded-full bg-[#c8ff00]"
              style={{ boxShadow: "0 0 6px #c8ff00" }}
            />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b" }}>
              En vivo — {new Date().toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })}
            </span>
          </div>
        </motion.div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
          {KPI.map((kpi, i) => <KpiCard key={kpi.label} kpi={kpi} index={i} />)}
        </div>

        {/* ── FILA 2: Gráfica ventas + donut ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3 mb-3">

          {/* Ventas anuales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-zinc-950 border border-zinc-800/60 p-6 relative overflow-hidden"
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
          >
            <span aria-hidden className="absolute top-0 right-0 w-3 h-3 bg-[#c8ff00]"
              style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />
            <div className="flex items-center justify-between mb-4">
              <div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#3f3f46" }}>
                  Ventas mensuales
                </p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#c8ff00", lineHeight: 1 }}>
                  2025
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-[#c8ff00]" />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", letterSpacing: "0.1em", color: "#52525b" }}>Pares</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-[#a855f7]" />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", letterSpacing: "0.1em", color: "#52525b" }}>Impares</span>
                </div>
              </div>
            </div>
            <BarChart />
          </motion.div>

          {/* Donut categorías */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.38 }}
            className="bg-zinc-950 border border-zinc-800/60 p-6 relative"
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
          >
            <span aria-hidden className="absolute top-0 right-0 w-3 h-3 bg-[#a855f7]"
              style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#3f3f46", marginBottom: "16px" }}>
              Ventas por categoría
            </p>
            <DonutChart />
          </motion.div>
        </div>

        {/* ── FILA 3: Top productos + Órdenes recientes ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-3 mb-3">

          {/* Top productos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.44 }}
            className="bg-zinc-950 border border-zinc-800/60 p-6 relative"
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
          >
            <span aria-hidden className="absolute top-0 right-0 w-3 h-3 bg-[#c8ff00]"
              style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />
            <div className="flex items-center justify-between mb-5">
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "#fff" }}>
                Top Productos
              </p>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3f3f46" }}>
                Este mes
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {TOP_PRODUCTS.map((p, i) => (
                <motion.div key={p.nombre}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: "#27272a", width: "20px", flexShrink: 0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate" style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.05em", color: "#a1a1aa" }}>
                      {p.nombre}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(p.ventas / 84) * 100}%` }}
                          transition={{ duration: 0.7, delay: 0.6 + i * 0.06 }}
                          className="h-full rounded-full"
                          style={{ background: p.color }}
                        />
                      </div>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#52525b", flexShrink: 0 }}>
                        {p.ventas} uds
                      </span>
                    </div>
                  </div>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.95rem", color: p.color, flexShrink: 0 }}>
                    {p.monto}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Órdenes recientes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-zinc-950 border border-zinc-800/60 p-6 relative"
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
          >
            <span aria-hidden className="absolute top-0 right-0 w-3 h-3 bg-[#a855f7]"
              style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />
            <div className="flex items-center justify-between mb-5">
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "#fff" }}>
                Órdenes Recientes
              </p>
              <button className="flex items-center gap-1 text-zinc-600 hover:text-[#c8ff00] transition-colors"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Ver todas <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {RECENT_ORDERS.map((o, i) => {
                const cfg = STATUS_CFG[o.status] ?? { color: "#52525b", icon: Clock };
                const Icon = cfg.icon;
                return (
                  <motion.div key={o.id}
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.055 }}
                    className="flex items-center gap-3 py-2 border-b border-zinc-800/40 last:border-b-0"
                  >
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", color: cfg.color, flexShrink: 0 }}>
                      #{o.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate" style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.05em", color: "#a1a1aa" }}>
                        {o.cliente}
                      </p>
                      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", letterSpacing: "0.1em", color: "#3f3f46" }}>
                        {o.hora}
                      </p>
                    </div>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", color: "#fff", flexShrink: 0 }}>
                      {o.monto}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 shrink-0"
                      style={{
                        fontFamily: "'Space Mono', monospace", fontSize: "7px", letterSpacing: "0.1em", textTransform: "uppercase",
                        color: cfg.color, background: `${cfg.color}10`, border: `1px solid ${cfg.color}25`,
                        clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                      }}>
                      <Icon className="w-2.5 h-2.5" />
                      {o.status}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── FILA 4: Alertas + Stats rápidas ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-3">

          {/* Alertas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.58 }}
            className="bg-zinc-950 border border-zinc-800/60 p-6 relative"
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
          >
            <span aria-hidden className="absolute top-0 right-0 w-3 h-3 bg-[#ef4444]"
              style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />
            <p className="mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "#fff" }}>
              Alertas del sistema
            </p>
            <div className="flex flex-col gap-2">
              {ALERTS.map((a, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.62 + i * 0.06 }}
                  className="flex items-center gap-3 border-l-2 pl-3 py-1"
                  style={{ borderColor: a.color }}
                >
                  <a.icon className="w-3.5 h-3.5 shrink-0" style={{ color: a.color }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.06em", color: "#71717a" }}>
                    {a.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats rápidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.64 }}
            className="bg-zinc-950 border border-zinc-800/60 p-6 relative flex flex-col gap-4"
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
          >
            <span aria-hidden className="absolute top-0 right-0 w-3 h-3 bg-[#c8ff00]"
              style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "#fff" }}>
              Métricas rápidas
            </p>
            {[
              { label: "Ticket promedio", value: "$2,215", color: "#c8ff00" },
              { label: "Productos activos", value: "3,142", color: "#a855f7" },
              { label: "Stock bajo",  value: "14",    color: "#ef4444"  },
              { label: "Reseñas hoy", value: "8",     color: "#c8ff00" },
              { label: "Conversión",  value: "3.8%",  color: "#a855f7" },
            ].map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.68 + i * 0.05 }}
                className="flex items-center justify-between border-b border-zinc-800/40 pb-3 last:border-b-0 last:pb-0"
              >
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b" }}>
                  {s.label}
                </span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: s.color }}>
                  {s.value}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      `}</style>
    </div>
  );
}