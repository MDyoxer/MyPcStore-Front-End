"use client";

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { motion, AnimatePresence } from "motion/react";
import { stripePromise } from "@/src/lib/stripe/stripe";
import { CreateCheckout, type checkoutResponse } from "@/src/actions/orders/create-checkout";
import { useAuth } from "@/src/context/AuthContext";
import CheckoutForm from "./checkoutForm";
import Loading from "../ui/loading";
import { ShieldCheck, Lock, CreditCard, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";

// ─── TRUST BADGES ─────────────────────────────────────────────────────────────
const BADGES = [
  { icon: Lock,        label: "Pago cifrado SSL" },
  { icon: ShieldCheck, label: "Powered by Stripe" },
  { icon: CreditCard,  label: "Visa / MC / AMEX"  },
];

// ─── ESTADO DE ERROR ──────────────────────────────────────────────────────────
function ErrorState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-black flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md flex flex-col items-center gap-6 text-center">

        {/* Ícono */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
          className="flex items-center justify-center w-20 h-20 border-2 border-red-500/30 bg-red-500/05"
          style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}
        >
          <AlertTriangle className="w-9 h-9 text-red-500" />
        </motion.div>

        <div className="flex flex-col gap-2">
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", letterSpacing: "0.04em", color: "#ef4444" }}>
            ERROR AL INICIAR PAGO
          </h2>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", lineHeight: "1.85", letterSpacing: "0.04em", color: "#52525b" }}>
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex-1">
            <Link href="/cart"
              className="flex items-center justify-center gap-2 border border-zinc-700 text-zinc-400 py-3 w-full
                         hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-all duration-200"
              style={{
                fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              }}>
              <ArrowLeft className="w-3.5 h-3.5" />
              Ver carrito
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex-1">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 bg-[#c8ff00] text-black py-3 w-full
                         hover:bg-yellow-300 transition-colors duration-200"
              style={{
                fontFamily: "'Space Mono', monospace", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              }}>
              Reintentar →
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function CheckoutClient() {
  const { getIdToken }                              = useAuth();
  const [checkout, setCheckout]                     = useState<checkoutResponse | null>(null);
  const [error, setError]                           = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const idToken = await getIdToken();
      if (!idToken) {
        if (mounted) setError("Debes iniciar sesión para continuar con el pago.");
        return;
      }
      try {
        const data = await CreateCheckout(idToken);
        if (mounted) setCheckout(data);
      } catch {
        if (mounted) setError("No se pudo iniciar el checkout. Verifica tu carrito e inténtalo de nuevo.");
      }
    })();
    return () => { mounted = false; };
  }, [getIdToken]);

  if (error)    return <ErrorState message={error} />;
  if (!checkout) return <Loading />;

  const options: StripeElementsOptions = {
    clientSecret: checkout.clientSecret,
    appearance: {
      theme: "night",
      variables: {
        colorPrimary:         "#c8ff00",
        colorBackground:      "#09090b",
        colorText:            "#f4f4f5",
        colorTextSecondary:   "#71717a",
        colorTextPlaceholder: "#3f3f46",
        colorDanger:          "#ef4444",
        fontFamily:           "'Space Mono', monospace",
        borderRadius:         "0px",
        spacingUnit:          "4px",
      },
      rules: {
        ".Input": {
          border:          "1px solid #27272a",
          backgroundColor: "#09090b",
          color:           "#f4f4f5",
          boxShadow:       "none",
          padding:         "12px 14px",
          fontSize:        "11px",
          letterSpacing:   "0.04em",
        },
        ".Input:focus": {
          border:    "1px solid rgba(200,255,0,0.4)",
          boxShadow: "0 0 0 1px rgba(200,255,0,0.12)",
          outline:   "none",
        },
        ".Input--invalid": {
          border:    "1px solid rgba(239,68,68,0.4)",
          boxShadow: "none",
        },
        ".Label": {
          color:         "#52525b",
          fontSize:      "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontWeight:    "400",
        },
        ".Error": {
          color:         "#ef4444",
          fontSize:      "11px",
          letterSpacing: "0.1em",
        },
        ".Tab": {
          border:          "1px solid #27272a",
          backgroundColor: "#09090b",
          color:           "#52525b",
          boxShadow:       "none",
        },
        ".Tab:hover": {
          color:  "#f4f4f5",
          border: "1px solid #3f3f46",
        },
        ".Tab--selected": {
          border:          "1px solid rgba(200,255,0,0.35)",
          backgroundColor: "rgba(200,255,0,0.04)",
          color:           "#c8ff00",
          boxShadow:       "0 0 16px -6px rgba(200,255,0,0.3)",
        },
        ".TabIcon--selected": { fill: "#c8ff00" },
      },
    },
  };

  return (
    <div className="w-full bg-black min-h-screen relative overflow-hidden">

      {/* Grid fondo */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(200,255,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)",
        }} />

      {/* Orb morado */}
      <div aria-hidden className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="max-w-2xl mx-auto px-4 pt-10 pb-24 relative">

        {/* ── BREADCRUMB ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/cart"
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-[#c8ff00] transition-colors duration-200 group mb-10"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            Volver al carrito
          </Link>
        </motion.div>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3 text-[#c8ff00]"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.35em", textTransform: "uppercase" }}>
            <span className="w-8 h-px bg-[#c8ff00]" />
            Pago seguro
          </div>
          <h1 className="leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 7vw, 4.5rem)", letterSpacing: "0.02em" }}>
            <span className="text-white">FINALIZAR </span>
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>COMPRA</span>
          </h1>
        </motion.div>

        {/* ── TRUST BADGES ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-3 gap-2 mb-8"
        >
          {BADGES.map((b, i) => (
            <motion.div key={b.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
              className="flex flex-col items-center gap-1.5 border border-zinc-800/60 bg-zinc-950 py-3 px-2 text-center"
              style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
            >
              <b.icon className="w-4 h-4 text-[#c8ff00]" />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525b" }}>
                {b.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── WRAPPER STRIPE ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-zinc-950 border border-zinc-800/60 p-6 sm:p-8"
          style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
        >
          {/* Acento esquina */}
          <span aria-hidden className="absolute top-0 right-0 w-4 h-4 bg-[#c8ff00]"
            style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />
          <span aria-hidden className="absolute bottom-0 left-0 w-4 h-4 bg-purple-500"
            style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />

          {/* Label orden */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/50">
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#3f3f46" }}>
              ID de orden
            </span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.06em", color: "#c8ff00" }}>
              #{String(checkout.orderId).padStart(4, "0")}
            </span>
          </div>

          {/* Stripe Elements */}
          <AnimatePresence>
            <motion.div
              key="stripe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm orderId={checkout.orderId} />
              </Elements>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Nota de seguridad */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-4"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.12em", color: "#FFFFFF" }}
        >
          Tu información de pago es cifrada y procesada de forma segura por Stripe. MyPcStore nunca almacena datos de tarjetas.
        </motion.p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      `}</style>
    </div>
  );
}