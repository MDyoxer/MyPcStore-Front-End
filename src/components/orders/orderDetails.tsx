"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { GetOrderUserItems, orderDetailsItems } from "@/src/actions/orders/get-order-details";
import { useAuth } from "@/src/context/AuthContext";
import { formatMoney } from "@/src/utils/formatMoney";
import { formatDateTime } from "@/src/utils/formatDateTime";
import { getStatus, STATUS_CONFIG, type StatusKey } from "@/src/utils/orderStatus";
import { ArrowLeft, CheckCircle2, ImageOff, Package } from "lucide-react";
import Loading from "../ui/loading";
import { slugify } from "@/src/utils/slugify";

// ─── ITEM ROW ─────────────────────────────────────────────────────────────────
function ItemRow({ item, index }: { item: orderDetailsItems; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex items-center gap-4 bg-zinc-950 border border-zinc-800/60 p-4
                 hover:border-zinc-700/60 transition-colors duration-300"
      style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
    >
      {/* Acento esquina */}
      <span aria-hidden className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#c8ff00] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />

      {/* Índice */}
      <span className="hidden sm:flex shrink-0 w-6 items-center justify-center"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", color: "#27272a" }}>
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Imagen */}
        <Link href={`/products/${slugify(item.producto)}`}>
        <div className="relative shrink-0 w-16 h-16 bg-zinc-900 overflow-hidden"
          style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
          {item.imgProducto ? (
            <Image src={item.imgProducto} alt={item.producto} fill
              className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-5 h-5 text-zinc-700" />
          </div>
        )}
      </div>
    </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-white leading-tight line-clamp-1 group-hover:text-[#c8ff00] transition-colors duration-200"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.05rem", letterSpacing: "0.04em" }}>
          {item.producto}
        </p>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", color: "#52525b" }}>
          {formatMoney(item.precioGuardado)} c/u
        </p>
      </div>

      {/* Cantidad */}
      <div className="shrink-0 flex flex-col items-center gap-0.5">
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3f3f46" }}>
          Cant.
        </span>
        <span className="border border-[#c8ff00]/25 bg-[#c8ff00]/05 px-2 py-0.5"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: "#c8ff00", lineHeight: 1 }}>
          ×{item.cantidad}
        </span>
      </div>

      {/* Subtotal */}
      <div className="shrink-0 flex flex-col items-end gap-0.5">
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3f3f46" }}>
          Subtotal
        </span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.02em", color: "#a855f7", lineHeight: 1 }}>
          {formatMoney(item.precioGuardado * item.cantidad)}
        </span>
      </div>
    </motion.li>
  );
}

// ─── LÍNEA DE TIEMPO ──────────────────────────────────────────────────────────
const TIMELINE_STEPS: StatusKey[] = ["pendiente", "procesando", "enviado", "entregado"];

function ShipmentTimeline({ status, detalle }: { status: string; detalle: string }) {
  const currentIdx = TIMELINE_STEPS.indexOf(status as StatusKey);

  if (currentIdx === -1) {
    const cfg = getStatus(status);
    const Icon = cfg.icon;
    return (
      <ol className="flex flex-col">
        <li className="relative flex gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full border shrink-0"
            style={{ borderColor: cfg.border, background: cfg.bg, boxShadow: `0 0 12px -2px ${cfg.color}` }}>
            <Icon className="w-3 h-3" style={{ color: cfg.color }} />
          </span>
          <div className="flex flex-col gap-0.5">
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: cfg.color }}>
              {cfg.label}
            </span>
            {detalle && (
              <p className="text-zinc-500 leading-relaxed" style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>
                {detalle}
              </p>
            )}
          </div>
        </li>
      </ol>
    );
  }

  return (
    <ol className="flex flex-col">
      {TIMELINE_STEPS.map((key, idx) => {
        const stepCfg = STATUS_CONFIG[key];
        const StepIcon = stepCfg.icon;
        const state = idx < currentIdx ? "done" : idx === currentIdx ? "active" : "pending";
        const isLast = idx === TIMELINE_STEPS.length - 1;
        const lineColor = idx < currentIdx ? STATUS_CONFIG[TIMELINE_STEPS[idx + 1]].color : "rgba(63,63,70,0.4)";
        const dotColor = state === "pending" ? "#3f3f46" : stepCfg.color;
        const labelColor = state === "pending" ? "#52525b" : stepCfg.color;

        return (
          <li key={key} className="relative flex gap-3">
            <div className="flex flex-col items-center shrink-0">
              <span className="flex items-center justify-center w-6 h-6 rounded-full border shrink-0"
                style={{
                  borderColor: state === "pending" ? "rgba(63,63,70,0.6)" : stepCfg.border,
                  background: state === "pending" ? "#18181b" : stepCfg.bg,
                  boxShadow: state === "active" ? `0 0 12px -2px ${stepCfg.color}` : undefined,
                }}>
                <StepIcon className="w-3 h-3" style={{ color: dotColor }} />
              </span>
              {!isLast && <span className="w-px flex-1 min-h-4 my-1" style={{ background: lineColor }} />}
            </div>

            <div className="flex flex-col gap-0.5 pb-4 min-w-0">
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: labelColor }}>
                {stepCfg.label}
              </span>
              {state === "active" && detalle && (
                <p className="text-zinc-500 leading-relaxed" style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>
                  {detalle}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// ─── ENVÍO ────────────────────────────────────────────────────────────────────
function ShippingStatusCard({ envio }: { envio: orderDetailsItems }) {
  const cfg = getStatus(envio.statusEnvio);
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-zinc-950 border border-zinc-800/60 p-6 flex flex-col gap-5 relative"
      style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}
    >
      <span aria-hidden className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#c8ff00]"
        style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />
      <span aria-hidden className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-purple-500"
        style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />

      {/* Eyebrow */}
      <div className="flex items-center gap-3"
        style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#c8ff00" }}>
        <span className="w-8 h-px bg-[#c8ff00]" />
        Estado del envío
      </div>

      {/* Badge status */}
      <span className="inline-flex items-center gap-2 self-start px-3.5 py-1.5"
        style={{
          fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase",
          color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
          clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
        }}>
        <Icon className="w-3 h-3" />
        {cfg.label}
      </span>

      <div className="h-px bg-zinc-800" />

      {/* Detalles envío */}
      <div className="flex flex-col gap-3">
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3f3f46" }}>
          Detalles del envío
        </span>
        <ShipmentTimeline status={envio.statusEnvio} detalle={envio.detallesEnvio} />
      </div>

      {/* Entrega estimada */}
      <div className="flex items-center justify-between gap-3">
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3f3f46" }}>
          Entrega estimada
        </span>
        <span className="text-right" style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#a855f7" }}>
          {envio.fechaEntregaEstimada ? formatDateTime(envio.fechaEntregaEstimada) : "Por confirmar"}
        </span>
      </div>
    </motion.div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function OrderDetails({ orderId }: { orderId: number }) {
  const [items, setItems]     = useState<orderDetailsItems[]>([]);
  const [loading, setLoading] = useState(true);
  const { getIdToken }        = useAuth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const idToken = await getIdToken();
      if (!idToken) { if (mounted) setLoading(false); return; }
      try {
        const data = await GetOrderUserItems(idToken, orderId);
        if (mounted) setItems(data);
      } catch (e) { console.error(e); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [getIdToken, orderId]);

  if (loading) return <Loading />;

  const total      = items.reduce((acc, i) => acc + i.precioGuardado * i.cantidad, 0);
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <div className="w-full bg-black min-h-screen relative overflow-hidden">

      {/* Grid fondo */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(200,255,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)",
        }} />

      {/* Orb morado top */}
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="max-w-6xl mx-auto px-4 pt-10 pb-24 relative">

        {/* ── BREADCRUMB ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/orders"
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-[#c8ff00] transition-colors duration-200 group mb-10"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            Mis ordenes
          </Link>
        </motion.div>

        {/* ── HEADER PAGO EXITOSO ── */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-4 mb-12 text-center"
        >
          {/* Ícono animado */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center justify-center w-16 h-16 border-2 border-[#c8ff00]/40 bg-[#c8ff00]/05"
            style={{
              clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
              boxShadow: "0 0 40px -10px rgba(200,255,0,0.5)",
            }}
          >
            <CheckCircle2 className="w-8 h-8 text-[#c8ff00]" />
          </motion.div>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#c8ff00" }}>
            ✦ Pago exitoso ✦
          </div>

          <h1 className="leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 8vw, 5rem)", letterSpacing: "0.02em" }}>
            <span className="text-white">ORDEN </span>
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>
              #{String(orderId).padStart(4, "0")}
            </span>
          </h1>

          {/* Línea neon */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="h-px bg-[#c8ff00]"
            style={{ boxShadow: "0 0 8px #c8ff00" }}
          />
        </motion.div>

        {/* ── CONTENIDO ── */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-4 border border-zinc-800/40"
          >
            <Package className="w-10 h-10 text-zinc-800" />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b" }}>
              No se encontraron productos en esta orden.
            </span>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-8 items-start">

            {/* Card de envío */}
            <aside className="lg:sticky lg:top-6">
              <ShippingStatusCard envio={items[0]} />
            </aside>

            {/* Items + resumen */}
            <div className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {items.map((item, i) => (
                  <ItemRow key={item.idProducto} item={item} index={i} />
                ))}
              </ul>

              {/* ── RESUMEN TOTAL ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: items.length * 0.06 + 0.1 }}
              >
                {/* Fin de lista */}
                <div className="flex flex-col items-start gap-1 pt-3 pl-1 mb-6">
                  <span className="h-px bg-[#c8ff00] w-16 opacity-80" />
                  <span className="h-px bg-[#c8ff00] w-10 opacity-50" />
                  <span className="h-px bg-[#c8ff00] w-5  opacity-25" />
                </div>

                {/* Panel resumen */}
                <div className="bg-zinc-950 border border-zinc-800/60 p-6 flex flex-col gap-4 relative"
                  style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}>

                  <span aria-hidden className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#c8ff00]"
                    style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />
                  <span aria-hidden className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-purple-500"
                    style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />

                  {/* Desglose */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b" }}>
                        Productos
                      </span>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: "#71717a" }}>
                        {items.length} {items.length === 1 ? "artículo" : "artículos"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b" }}>
                        Unidades totales
                      </span>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: "#71717a" }}>
                        {totalItems}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-zinc-800" />

                  {/* Total */}
                  <div className="flex items-baseline justify-between">
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b" }}>
                      Total pagado
                    </span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", letterSpacing: "0.02em", color: "#c8ff00", lineHeight: 1 }}>
                      {formatMoney(total)}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex-1">
                    <Link href="/orders"
                      className="w-full flex items-center justify-center gap-2 border border-zinc-700 text-zinc-400 py-3
                                 hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-all duration-200"
                      style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase",
                        clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Mis pedidos
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02, boxShadow: "0 0 30px -8px rgba(200,255,0,0.5)" }} whileTap={{ scale: 0.97 }} className="flex-1">
                    <Link href="/productos"
                      className="w-full flex items-center justify-center gap-2 bg-[#c8ff00] text-black py-3
                                 hover:bg-yellow-300 transition-colors duration-200"
                      style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                        clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
                      Seguir comprando →
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      `}</style>
    </div>
  );
}