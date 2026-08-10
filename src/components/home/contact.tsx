"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Mail, MessageSquare, Phone, MapPin, Clock, CheckCircle2, X } from "lucide-react";

// ─── INFO DE CONTACTO ─────────────────────────────────────────────────────────
const CONTACT_INFO = [
  { icon: Mail,    label: "Email",    value: "soporte@mypcstore.mx",     color: "#c8ff00" },
  { icon: Phone,   label: "Teléfono", value: "+52 (844) 123-4567",       color: "#a855f7" },
  { icon: MapPin,  label: "Dirección",value: "Saltillo, Coahuila, MX",   color: "#c8ff00" },
  { icon: Clock,   label: "Horario",  value: "Lun–Vie 9:00–18:00",   color: "#a855f7" },
];

const SUBJECTS = [
  "Soporte técnico",
  "Estado de mi orden",
  "Devoluciones y garantías",
  "Información de producto",
  "Ventas corporativas",
  "Otro",
];

// ─── INPUT FIELD ──────────────────────────────────────────────────────────────
function Field({
  label, id, error, children,
}: {
  label: string; id: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id}
        style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#52525b" }}>
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", color: "#ef4444" }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass = `
  w-full bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-700
  px-4 py-3 outline-none transition-all duration-200
  focus:border-[#c8ff00]/50 focus:bg-zinc-900
`;
const inputStyle = {
  fontFamily: "'Space Mono', monospace",
  fontSize: "11px",
  letterSpacing: "0.04em",
  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function Contact() {
  const [form, setForm]     = useState({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const set = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim())  e.nombre  = "El nombre es requerido.";
    if (!form.email.trim())   e.email   = "El correo es requerido.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Correo inválido.";
    if (!form.asunto)         e.asunto  = "Selecciona un asunto.";
    if (!form.mensaje.trim()) e.mensaje = "El mensaje no puede estar vacío.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1800)); // simula envío
    setSending(false);
    setSent(true);
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

      {/* Orbs */}
      <div aria-hidden className="absolute -left-40 top-1/3 w-125 h-125 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,255,0,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div aria-hidden className="absolute -right-40 bottom-1/3 w-125 h-125 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="max-w-6xl mx-auto px-4 pt-16 pb-28 relative">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-3 text-[#c8ff00]"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.35em", textTransform: "uppercase" }}>
            <span className="w-8 h-px bg-[#c8ff00]" />
            Estamos aquí
          </div>
          <h1 className="leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 8vw, 6rem)", letterSpacing: "0.02em" }}>
            <span className="text-white">HABLEMOS </span>
            <span style={{ color: "transparent", WebkitTextStroke: "2px #c8ff00" }}>DE</span>
            <br />
            <span className="text-white">TU PROYECTO</span>
          </h1>
        </motion.div>

        {/* ── LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

          {/* ── COLUMNA INFO ── */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-2"
          >
            {CONTACT_INFO.map((c, i) => (
              <motion.div key={c.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                className="group flex items-center gap-3 bg-zinc-950 border border-zinc-800/60 px-4 py-3
                           hover:border-zinc-700/60 transition-colors duration-300 relative overflow-hidden"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
              >
                {/* Línea neon inferior */}
                <motion.div aria-hidden className="absolute bottom-0 left-0 h-0.5"
                  initial={{ width: "0%" }} whileHover={{ width: "100%" }}
                  transition={{ duration: 0.35 }}
                  style={{ background: c.color, boxShadow: `0 0 6px ${c.color}` }} />

                <div className="shrink-0 flex items-center justify-center w-8 h-8"
                  style={{
                    background: `${c.color}10`, border: `1px solid ${c.color}25`,
                    clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                  }}>
                  <c.icon className="w-3.5 h-3.5" style={{ color: c.color }} />
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3f3f46" }}>
                    {c.label}
                  </span>
                  <span className="truncate" style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#71717a" }}>
                    {c.value}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Nota */}
            <p className="mt-2 px-1" style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", lineHeight: "1.8", letterSpacing: "0.05em", color: "#3f3f46" }}>
              Respondemos en menos de 24 horas en días hábiles. Para soporte urgente llama directamente.
            </p>
          </motion.aside>

          {/* ── FORMULARIO ── */}
          <AnimatePresence mode="wait">
            {sent ? (
              /* ─ ESTADO ÉXITO ─ */
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center gap-6 bg-zinc-950 border border-zinc-800/60 p-14 relative"
                style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
              >
                <span aria-hidden className="absolute top-0 right-0 w-4 h-4 bg-[#c8ff00]"
                  style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />

                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
                  className="flex items-center justify-center w-20 h-20 border-2 border-[#c8ff00]/30 bg-[#c8ff00]/05"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
                    boxShadow: "0 0 50px -10px rgba(200,255,0,0.4)",
                  }}
                >
                  <CheckCircle2 className="w-10 h-10 text-[#c8ff00]" />
                </motion.div>

                <div className="text-center flex flex-col gap-2">
                  <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", letterSpacing: "0.04em", color: "#c8ff00" }}>
                    MENSAJE ENVIADO
                  </h2>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", lineHeight: "1.8", letterSpacing: "0.04em", color: "#52525b" }}>
                    Recibimos tu mensaje. Te contactaremos en menos de 24 horas hábiles al correo{" "}
                    <span className="text-zinc-300">{form.email}</span>.
                  </p>
                </div>

                <motion.button
                  onClick={() => { setSent(false); setForm({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" }); }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 border border-zinc-700 text-zinc-500 px-5 py-2.5
                             hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-all duration-200"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase",
                    clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
                  <X className="w-3.5 h-3.5" />
                  Enviar otro
                </motion.button>
              </motion.div>

            ) : (
              /* ─ FORMULARIO ─ */
              <motion.form key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-zinc-950 border border-zinc-800/60 p-7 sm:p-10 flex flex-col gap-5 relative"
                style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
              >
                {/* Acento esquina */}
                <span aria-hidden className="absolute top-0 right-0 w-4 h-4 bg-[#c8ff00]"
                  style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />
                <span aria-hidden className="absolute bottom-0 left-0 w-4 h-4 bg-purple-500"
                  style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />

                {/* Nombre + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nombre completo *" id="nombre" error={errors.nombre}>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                      <input id="nombre" type="text" value={form.nombre} onChange={(e) => set("nombre", e.target.value)}
                        placeholder="Juan Pérez"
                        className={inputClass + " pl-9"}
                        style={{ ...inputStyle, borderColor: errors.nombre ? "rgba(239,68,68,0.4)" : undefined }}
                      />
                    </div>
                  </Field>

                  <Field label="Correo electrónico *" id="email" error={errors.email}>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                      <input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                        placeholder="tu@correo.com"
                        className={inputClass + " pl-9"}
                        style={{ ...inputStyle, borderColor: errors.email ? "rgba(239,68,68,0.4)" : undefined }}
                      />
                    </div>
                  </Field>
                </div>

                {/* Teléfono + Asunto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Teléfono (opcional)" id="telefono">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                      <input id="telefono" type="tel" value={form.telefono} onChange={(e) => set("telefono", e.target.value)}
                        placeholder="+52 (844) 000-0000"
                        className={inputClass + " pl-9"}
                        style={inputStyle}
                      />
                    </div>
                  </Field>

                  <Field label="Asunto *" id="asunto" error={errors.asunto}>
                    <select id="asunto" value={form.asunto} onChange={(e) => set("asunto", e.target.value)}
                      className={inputClass + " appearance-none cursor-pointer"}
                      style={{ ...inputStyle, borderColor: errors.asunto ? "rgba(239,68,68,0.4)" : undefined, color: form.asunto ? "#fff" : "#3f3f46" }}>
                      <option value="" disabled>Selecciona un asunto...</option>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Mensaje */}
                <Field label="Mensaje *" id="mensaje" error={errors.mensaje}>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3.5 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                    <textarea id="mensaje" value={form.mensaje} onChange={(e) => set("mensaje", e.target.value)}
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                      rows={5}
                      className={inputClass + " pl-9 resize-none"}
                      style={{ ...inputStyle, borderColor: errors.mensaje ? "rgba(239,68,68,0.4)" : undefined }}
                    />
                    {/* Contador de caracteres */}
                    <span className="absolute bottom-3 right-3"
                      style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", color: "#3f3f46" }}>
                      {form.mensaje.length}/1000
                    </span>
                  </div>
                </Field>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.01, boxShadow: "0 0 30px -6px rgba(200,255,0,0.45)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 bg-[#c8ff00] text-black py-4 mt-1
                             disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-300 transition-colors duration-200"
                  style={{
                    fontFamily: "'Space Mono', monospace", fontSize: "11px", fontWeight: 700,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  }}
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar mensaje
                    </>
                  )}
                </motion.button>

                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", color: "#FFFFFF", textAlign: "center" }}>
                  Al enviar aceptas nuestra política de privacidad. Nunca compartiremos tu información.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        textarea:focus, input:focus, select:focus {
          box-shadow: 0 0 0 1px rgba(200,255,0,0.15);
        }
      `}</style>
    </div>
  );
}