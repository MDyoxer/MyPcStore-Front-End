"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Cpu, Zap, Shield, Users, Globe, Award } from "lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const STATS = [
  { num: "2012", label: "Año de fundación" },
  { num: "48K+", label: "Clientes activos" },
  { num: "120+", label: "Marcas aliadas" },
  { num: "99.4%", label: "Satisfacción" },
];

const TIMELINE = [
  { year: "2012", title: "El origen", desc: "Tres ingenieros de sistemas fundan MyPcStore en un garaje en Saltillo. Primer mes: 12 órdenes. Primera lección: el hardware no se improvisa." },
  { year: "2015", title: "Primera bodega", desc: "Apertura del primer centro de distribución de 800 m². Se suman AMD e Intel como socios de distribución directa en México." },
  { year: "2018", title: "Plataforma digital", desc: "Lanzamiento de la tienda en línea. En 90 días superamos las ventas físicas del año anterior. El mercado habló." },
  { year: "2021", title: "Expansión nacional", desc: "Presencia en 18 estados. Implementación del sistema de envío exprés 24h a zonas metropolitanas principales." },
  { year: "2024", title: "MyPcStore", desc: "Rediseño total de plataforma, sistema de notificaciones en tiempo real y catálogo de más de 3,000 SKUs activos." },
];

const VALORES = [
  { icon: Cpu,    title: "Ingeniería primero",  desc: "No vendemos lo que no usaríamos. Cada producto pasa por evaluación técnica antes de entrar al catálogo.", color: "#c8ff00" },
  { icon: Shield, title: "Garantía sin letra pequeña", desc: "Respaldo real, sin formularios interminables. Si falla, lo resolvemos en menos de 72 horas.", color: "#a855f7" },
  { icon: Zap,    title: "Velocidad de entrega", desc: "Red logística propia. El 87% de nuestros pedidos llegan antes del tiempo estimado.", color: "#c8ff00" },
  { icon: Users,  title: "Comunidad técnica", desc: "Más que una tienda: un ecosistema de builders, gamers y creadores que se ayudan entre sí.", color: "#a855f7" },
  { icon: Globe,  title: "Cobertura nacional", desc: "Enviamos a los 32 estados. Sin excepción. Sin zonas de exclusión ocultas.", color: "#c8ff00" },
  { icon: Award,  title: "Distribuidor autorizado", desc: "Único distribuidor certificado Tier-1 de AMD, Intel y ASUS en el norte de México.", color: "#a855f7" },
];

// ─── COMPONENTE PARALLAX HERO ─────────────────────────────────────────────────
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* BG text parallax */}
      <motion.div style={{ y, opacity }} aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(8rem, 22vw, 22rem)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(200,255,0,0.06)",
          letterSpacing: "0.02em",
          lineHeight: 1,
        }}>
          MYPC
        </span>
      </motion.div>

      {/* Grid fondo */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(200,255,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      {/* Orbs */}
      <div aria-hidden className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div aria-hidden className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,255,0,0.05) 0%, transparent 70%)", filter: "blur(40px)" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-3 text-[#c8ff00]"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase" }}
        >
          <span className="w-10 h-px bg-[#c8ff00]" />
          Fundada en Saltillo — 2012
          <span className="w-10 h-px bg-[#c8ff00]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 12vw, 10rem)", letterSpacing: "0.02em" }}
        >
          <span className="text-white">HARDWARE </span>
          <span style={{ color: "transparent", WebkitTextStroke: "2px #c8ff00" }}>SIN</span>
          <br />
          <span className="text-white">COMPROMISOS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-xl text-zinc-500"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", lineHeight: "1.9", letterSpacing: "0.04em" }}
        >
          Más de una década conectando a gamers, creadores y profesionales
          con el hardware que realmente necesitan. Sin intermediarios. Sin relleno.
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#3f3f46" }}
        >
          Scroll
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-[#c8ff00] to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────
function StatsSection() {
  return (
    <section className="border-y border-zinc-800/50">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-zinc-800/50">
        {STATS.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex flex-col items-center justify-center gap-1 py-12 px-6 text-center"
          >
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1, color: "#c8ff00" }}>
              {s.num}
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b" }}>
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── MISIÓN ───────────────────────────────────────────────────────────────────
function MissionSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-4 text-[#c8ff00]"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase" }}>
            <span className="w-6 h-px bg-[#c8ff00]" /> Nuestra misión
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 6vw, 5.5rem)", letterSpacing: "0.02em", lineHeight: 0.95 }}>
            <span className="text-white">DEMOCRATIZAR</span><br />
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px #a855f7" }}>EL ACCESO</span><br />
            <span className="text-white">AL PODER</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6"
        >
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", lineHeight: "1.95", letterSpacing: "0.03em", color: "#71717a" }}>
            MyPcStore nació de una frustración real: conseguir hardware de calidad en México era caro, lento y lleno de engaños. Decidimos construir la alternativa que queríamos que existiera.
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", lineHeight: "1.95", letterSpacing: "0.03em", color: "#52525b" }}>
            Hoy operamos como distribuidor directo, eliminando intermediarios y pasando ese ahorro a quienes importa: tú. Cada peso que no gastamos en márgenes innecesarios es un peso que inviertes en rendimiento real.
          </p>

          {/* Firma */}
          <div className="flex items-center gap-4 pt-4 border-t border-zinc-800/50">
            <div className="w-12 h-12 flex items-center justify-center border border-[#c8ff00]/30 bg-[#c8ff00]/5"
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: "#c8ff00" }}>
              G.E
            </div>
            <div>
              <span className="block text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.05em" }}>
                Giovani Estrada
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b" }}>
                CEO & Co-fundador
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
function TimelineSection() {
  return (
    <section className="border-t border-zinc-800/50 bg-zinc-950/40 py-28">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-3 text-[#c8ff00]"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase" }}>
            <span className="w-6 h-px bg-[#c8ff00]" /> Historia
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "0.02em", lineHeight: 0.95 }}>
            <span className="text-white">UNA DÉCADA </span>
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>EN CÓDIGO</span>
          </h2>
        </motion.div>

        <div className="relative flex flex-col gap-0">
          {/* Línea vertical */}
          <div className="absolute left-[60px] sm:left-[72px] top-0 bottom-0 w-px bg-zinc-800/60" />

          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex gap-6 sm:gap-10 pb-12 last:pb-0 group p-4"
            >
              {/* Año */}
              <div className="flex-shrink-0 w-[60px] sm:w-[72px] flex flex-col items-end pt-1">
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", color: "#c8ff00", letterSpacing: "0.05em" }}>
                  {item.year}
                </span>
              </div>

              {/* Dot en la línea */}
              <div className="absolute left-[56px] sm:left-[68px] top-2 w-[9px] h-[9px] bg-black border-2 border-[#c8ff00] rotate-45
                              group-hover:bg-[#c8ff00] transition-colors duration-300" />

              {/* Contenido */}
              <div className="flex-1 bg-zinc-950 border border-zinc-800/50 p-5 group-hover:border-zinc-700/60 transition-colors duration-300"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
                <span aria-hidden className="absolute top-0 right-0 w-[10px] h-[10px] bg-[#c8ff00] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />
                <h3 className="text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.04em" }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", lineHeight: "1.85", letterSpacing: "0.02em", color: "#52525b" }}>
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── VALORES ──────────────────────────────────────────────────────────────────
function ValoresSection() {
  return (
    <section className="py-28 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3 text-[#c8ff00]"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase" }}>
            <span className="w-6 h-px bg-[#c8ff00]" /> Lo que nos define
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "0.02em", lineHeight: 0.95 }}>
            <span className="text-white">NUESTROS </span>
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>PRINCIPIOS</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800/30">
          {VALORES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ backgroundColor: "rgba(9,9,11,0.9)" }}
              className="relative bg-zinc-950 p-8 flex flex-col gap-4 group overflow-hidden cursor-default"
            >
              {/* Número decorativo */}
              <span aria-hidden className="absolute top-4 right-6 leading-none pointer-events-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "5rem", color: "rgba(255,255,255,0.03)" }}>
                0{i + 1}
              </span>

              {/* Línea neon inferior */}
              <motion.div aria-hidden
                className="absolute bottom-0 left-0 h-[2px]"
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.4 }}
                style={{ background: v.color, boxShadow: `0 0 8px ${v.color}` }}
              />

              {/* Ícono */}
              <div className="w-10 h-10 flex items-center justify-center border"
                style={{
                  borderColor: `${v.color}30`,
                  background: `${v.color}08`,
                  clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                }}>
                <v.icon className="w-4 h-4" style={{ color: v.color }} />
              </div>

              <h3 className="text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.04em" }}>
                {v.title}
              </h3>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", lineHeight: "1.85", letterSpacing: "0.02em", color: "#52525b" }}>
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA FINAL ───────────────────────────────────────────────────────────────
function CtaSection() {
  return (
    <section className="border-t border-zinc-800/50 py-32 relative overflow-hidden">
      {/* Grid animado */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
        }} />

      <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-8 relative">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#c8ff00" }}
        >
          — Únete a más de 48,000 clientes —
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3.5rem, 10vw, 8rem)", letterSpacing: "0.02em", lineHeight: 0.9 }}
        >
          <span className="text-white">¿LISTO PARA</span><br />
          <span style={{ color: "transparent", WebkitTextStroke: "2px #c8ff00" }}>UPGRADEAR</span><br />
          <span className="text-white">TU SETUP?</span>
        </motion.h2>

        <motion.a
          href="/allProducts"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03, boxShadow: "0 0 40px -8px rgba(200,255,0,0.6)" }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 bg-[#c8ff00] text-black px-10 py-4"
          style={{
            fontFamily: "'Space Mono', monospace", fontSize: "12px", fontWeight: 700,
            letterSpacing: "0.15em", textTransform: "uppercase",
            clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
          }}
        >
          Ver catálogo completo →
        </motion.a>
      </div>
    </section>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function FullAbout() {
  return (
    <section className="w-full bg-black overflow-hidden relative">
      <HeroSection />
      <StatsSection />
      <MissionSection />
      <TimelineSection />
      <ValoresSection />
      <CtaSection />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      `}</style>
    </section>
  );
}