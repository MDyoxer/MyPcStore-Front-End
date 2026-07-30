"use client";
import {Zap, Shield, Microscope} from "lucide-react";
import Image from "next/image";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const STATS = [
  { num: "12+", label: "Años de experiencia" },
  { num: "50K", label: "Clientes satisfechos" },
  { num: "99%", label: "Tasa de satisfacción" },
  { num: "24/7", label: "Soporte técnico" },
];

const VALORES = [
  { icon: <Zap />, title: "Rendimiento Extremo", desc: "Solo trabajamos con hardware que supera los estándares de la industria. Cada componente es evaluado bajo condiciones de carga real antes de llegar a ti." },
  { icon: <Shield />, title: "Garantía Real", desc: "Respaldamos cada producto con garantía extendida y soporte post-venta. Si algo falla, lo resolvemos sin burocracia ni letras pequeñas." },
  { icon: <Microscope />, title: "Curación Técnica", desc: "Nuestro equipo de ingenieros selecciona cada pieza del catálogo. No vendemos cualquier cosa; vendemos lo que nosotros mismos usaríamos." },
];

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
export default function About() {
  return (
    <div className="w-full bg-black min-h-screen relative overflow-hidden">

      {/* Grid de fondo */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,255,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)",
        }}
      />

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-4 pt-20 pb-16 relative">
        <div
          className="flex items-center gap-3 mb-4 text-[#c8ff00]"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase" }}
        >
          <span className="w-8 h-px bg-[#c8ff00]" />
          Quiénes somos
        </div>

        <h1
          className="leading-none mb-6"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3.5rem, 9vw, 8rem)", letterSpacing: "0.02em" }}
        >
          <span className="text-white">TECNOLOGÍA </span>
          <span style={{ color: "transparent", WebkitTextStroke: "2px #c8ff00" }}>SIN</span>
          <br />
          <span className="text-white">COMPROMISOS</span>
        </h1>

        <p
          className="text-zinc-400 max-w-2xl leading-relaxed"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", lineHeight: "1.9", letterSpacing: "0.03em" }}
        >
          Somos una empresa especializada en hardware de alto rendimiento. Desde 2012 llevamos a gamers,
          creadores y profesionales las piezas que realmente marcan la diferencia. No vendemos productos,
          entregamos ventaja competitiva.
        </p>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-zinc-800/50 bg-zinc-950/60">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-zinc-800/50">
          {STATS.map((s) => (
            <div key={s.num} className="flex flex-col items-center justify-center gap-1 py-10 px-6 text-center">
              <span
                className="text-[#c8ff00]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1 }}
              >
                {s.num}
              </span>
              <span
                className="text-zinc-600"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── RYZEN — imagen izquierda ── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-800/30">

          {/* Imagen */}
          <div
            className="relative bg-zinc-950 overflow-hidden group min-h-[340px]"
            style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
          >
            <Image
              src="/ryzen9800.png"
              alt="AMD Ryzen 9 9950X"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Overlay morado profundo */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.25) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.85) 100%)" }}
            />
            {/* Scanlines */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(168,85,247,0.04) 3px, rgba(168,85,247,0.04) 4px)",
              }}
            />
            {/* Badge flotante */}
            <div
              className="absolute top-5 left-5 border border-[#c8ff00]/40 bg-black/60 backdrop-blur-sm px-3 py-1.5"
              style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
            >
              <span
                className="text-[#c8ff00]"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}
              >
                AMD Platform
              </span>
            </div>
            {/* Línea neon bottom */}
            <div
              aria-hidden
              className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-[#c8ff00] transition-all duration-700"
              style={{ boxShadow: "0 0 8px #c8ff00" }}
            />
          </div>

          {/* Info */}
          <div className="bg-zinc-950 p-8 lg:p-12 flex flex-col justify-center gap-6">
            <div
              className="flex items-center gap-3 text-[#c8ff00]"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase" }}
            >
              <span className="w-6 h-px bg-[#c8ff00]" />
              Nuestra elección AMD
            </div>

            <h2
              className="text-white leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "0.03em" }}
            >
              RYZEN 9{" "}
              <span className="text-[#c8ff00]">9950X</span>
            </h2>

            <p
              className="text-zinc-400 leading-relaxed"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", lineHeight: "1.9", letterSpacing: "0.02em" }}
            >
              Elegimos la arquitectura Zen 5 de AMD porque redefine lo que un procesador de consumo puede hacer.
              Con <span className="text-zinc-200">16 núcleos y 32 hilos</span>, el Ryzen 9 9950X domina tanto
              cargas de trabajo creativas como sesiones de juego más exigentes, sin comprometer eficiencia energética.
            </p>

            <p
              className="text-zinc-500 leading-relaxed"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", lineHeight: "1.9", letterSpacing: "0.02em" }}
            >
              Su compatibilidad con plataformas AM5 garantiza una vida útil extendida de la inversión, mientras que
              el soporte nativo para DDR5 y PCIe 5.0 lo posiciona como el núcleo ideal de cualquier build orientado al futuro.
            </p>

            {/* Specs rápidas */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                ["Núcleos", "16C / 32T"],
                ["Boost Clock", "5.7 GHz"],
                ["Caché L3", "64 MB"],
                ["TDP", "170W"],
              ].map(([k, v]) => (
                <div key={k} className="border border-zinc-800/60 bg-zinc-900/40 px-3 py-2 flex justify-between items-center">
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b" }}>{k}</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", color: "#c8ff00", letterSpacing: "0.05em" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTEL — imagen derecha ── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-800/30">

          {/* Info */}
          <div className="bg-zinc-950 p-8 lg:p-12 flex flex-col justify-center gap-6 order-2 lg:order-1">
            <div
              className="flex items-center gap-3 text-purple-400"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase" }}
            >
              <span className="w-6 h-px bg-purple-400" />
              Nuestra elección Intel
            </div>

            <h2
              className="text-white leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "0.03em" }}
            >
              CORE ULTRA{" "}
              <span className="text-purple-400">i9-14900K</span>
            </h2>

            <p
              className="text-zinc-400 leading-relaxed"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", lineHeight: "1.9", letterSpacing: "0.02em" }}
            >
              La arquitectura híbrida de Intel con núcleos P-Core y E-Core ofrece una versatilidad única.
              El i9-14900K alcanza <span className="text-zinc-200">6.0 GHz en boost</span>, siendo la opción
              más rápida en single-thread del mercado, crítico para gaming competitivo y aplicaciones legacy.
            </p>

            <p
              className="text-zinc-500 leading-relaxed"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", lineHeight: "1.9", letterSpacing: "0.02em" }}
            >
              Su ecosistema maduro con plataforma LGA1700, soporte DDR4/DDR5 dual-channel y compatibilidad
              con los mejores AIOs del mercado lo convierten en la elección natural para builders que priorizan
              frecuencias máximas y estabilidad probada.
            </p>

            {/* Specs rápidas */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                ["Núcleos", "24C / 32T"],
                ["Boost Clock", "6.0 GHz"],
                ["Caché L3", "36 MB"],
                ["TDP", "253W"],
              ].map(([k, v]) => (
                <div key={k} className="border border-zinc-800/60 bg-zinc-900/40 px-3 py-2 flex justify-between items-center">
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b" }}>{k}</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", color: "#a855f7", letterSpacing: "0.05em" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Imagen */}
          <div
            className="relative bg-zinc-950 overflow-hidden group min-h-[340px] order-1 lg:order-2"
            style={{ clipPath: "polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px)" }}
          >
            <Image
              src="/I9.png"
              alt="Intel Core i9-14900K"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Overlay azul/morado profundo */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(225deg, rgba(168,85,247,0.3) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.85) 100%)" }}
            />
            {/* Scanlines */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(168,85,247,0.04) 3px, rgba(168,85,247,0.04) 4px)",
              }}
            />
            {/* Badge flotante */}
            <div
              className="absolute top-5 right-5 border border-purple-400/40 bg-black/60 backdrop-blur-sm px-3 py-1.5"
              style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
            >
              <span
                className="text-purple-400"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}
              >
                Intel Platform
              </span>
            </div>
            {/* Línea neon bottom morado */}
            <div
              aria-hidden
              className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-purple-500 transition-all duration-700"
              style={{ boxShadow: "0 0 8px #a855f7" }}
            />
          </div>
        </div>
      </section>

      {/* ── VALORES ── */}
      <section className="border-t border-zinc-800/50 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex items-center gap-3 mb-3 text-[#c8ff00]"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase" }}
          >
            <span className="w-8 h-px bg-[#c8ff00]" />
            Lo que nos define
          </div>
          <h2
            className="text-white mb-12 leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.03em" }}
          >
            NUESTROS{" "}
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>VALORES</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800/30">
            {VALORES.map((v, i) => (
              <div
                key={v.title}
                className="bg-zinc-950 p-8 flex flex-col gap-4 group hover:bg-zinc-900/80 transition-colors duration-300 relative overflow-hidden"
              >
                {/* Número decorativo */}
                <span
                  aria-hidden
                  className="absolute top-4 right-6 text-zinc-800/40 leading-none pointer-events-none"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "5rem" }}
                >
                  0{i + 1}
                </span>
                {/* Línea neon inferior */}
                <div
                  aria-hidden
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: i % 2 === 0 ? "#c8ff00" : "#a855f7", boxShadow: `0 0 8px ${i % 2 === 0 ? "#c8ff00" : "#a855f7"}` }}
                />
                <span className="text-3xl">{v.icon}</span>
                <h3
                  className="text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.04em" }}
                >
                  {v.title}
                </h3>
                <p
                  className="text-zinc-500 leading-relaxed"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", lineHeight: "1.85", letterSpacing: "0.02em" }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      `}</style>
    </div>
  );
}