"use client";

import Link from "next/link";
import {  Mail, MapPin, Phone, ArrowUpRight, Cpu } from "lucide-react";

const LINKS = {
  tienda: [
    { label: "Catálogo", href: "/productos" },
    { label: "Procesadores", href: "/productos?cat=procesadores" },
    { label: "Tarjetas de video", href: "/productos?cat=gpu" },
    { label: "Memorias RAM", href: "/productos?cat=ram" },
    { label: "Almacenamiento", href: "/productos?cat=storage" },
  ],
  empresa: [
    { label: "Acerca de nosotros", href: "/about" },
    { label: "Testimonios", href: "/reviews" },
    { label: "Blog técnico", href: "/blog" },
    { label: "Trabaja con nosotros", href: "/careers" },
  ],
  soporte: [
    { label: "Centro de ayuda", href: "/help" },
    { label: "Política de envíos", href: "/shipping" },
    { label: "Garantías", href: "/warranty" },
    { label: "Devoluciones", href: "/returns" },
  ],
};



const CONTACT = [
  { icon: Mail,    text: "soporte@mypcstore.mx"  },
  { icon: Phone,   text: "+52 (844) 123-4567"    },
  { icon: MapPin,  text: "Saltillo, Coahuila, MX" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-zinc-800/60 relative overflow-hidden">

      {/* Grid fondo */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,255,0,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 100%, black 20%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 relative">

        {/* ── BANDA SUPERIOR ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-8 border-b border-zinc-800/50">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="flex items-center justify-center w-9 h-9 bg-[#c8ff00]"
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
            >
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <span
              className="text-white group-hover:text-[#c8ff00] transition-colors duration-200"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.1em" }}
            >
              MyPC<span className="text-[#c8ff00]">Store</span>
            </span>
          </Link>

          {/* Tagline */}
          <p
            className="text-zinc-600 max-w-xs"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", lineHeight: "1.7" }}
          >
            Hardware de alto rendimiento para gamers, creadores y profesionales.
          </p>

          
        </div>

        {/* ── COLUMNAS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14 border-b border-zinc-800/50">

          {/* Contacto */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            <span
              className="text-[#c8ff00] flex items-center gap-2"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase" }}
            >
              <span className="w-4 h-px bg-[#c8ff00]" />
              Contacto
            </span>
            <div className="flex flex-col gap-3">
              {CONTACT.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-[#c8ff00] flex-shrink-0" />
                  <span
                    className="text-zinc-500"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.05em" }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tienda */}
          <div className="flex flex-col gap-5">
            <span
              className="text-[#c8ff00] flex items-center gap-2"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase" }}
            >
              <span className="w-4 h-px bg-[#c8ff00]" />
              Tienda
            </span>
            <ul className="flex flex-col gap-2.5">
              {LINKS.tienda.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group flex items-center gap-1 text-zinc-600 hover:text-white transition-colors duration-200"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.08em" }}
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-[#c8ff00] transition-all duration-200 flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div className="flex flex-col gap-5">
            <span
              className="text-[#c8ff00] flex items-center gap-2"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase" }}
            >
              <span className="w-4 h-px bg-[#c8ff00]" />
              Empresa
            </span>
            <ul className="flex flex-col gap-2.5">
              {LINKS.empresa.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group flex items-center gap-1 text-zinc-600 hover:text-white transition-colors duration-200"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.08em" }}
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-[#c8ff00] transition-all duration-200 flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div className="flex flex-col gap-5">
            <span
              className="text-[#c8ff00] flex items-center gap-2"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase" }}
            >
              <span className="w-4 h-px bg-[#c8ff00]" />
              Soporte
            </span>
            <ul className="flex flex-col gap-2.5">
              {LINKS.soporte.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group flex items-center gap-1 text-zinc-600 hover:text-white transition-colors duration-200"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.08em" }}
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-[#c8ff00] transition-all duration-200 flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── BANDA INFERIOR ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
          <p
            className="text-zinc-700"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}
          >
            © {new Date().getFullYear()} MyPcStore — Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            {["Privacidad", "Términos", "Cookies"].map((t) => (
              <Link
                key={t}
                href="#"
                className="text-zinc-700 hover:text-zinc-400 transition-colors duration-200"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                {t}
              </Link>
            ))}
          </div>

          {/* Volver arriba */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 text-zinc-700 hover:text-[#c8ff00] transition-colors duration-200 group"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}
          >
            Volver arriba
            <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      `}</style>
    </footer>
  );
}