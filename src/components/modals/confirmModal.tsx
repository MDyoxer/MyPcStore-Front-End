"use client";

import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, CheckCircle2, Zap, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "success";
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_CFG = {
  danger: {
    color:  "#ef4444",
    bg:     "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.3)",
    glow:   "rgba(239,68,68,0.25)",
    icon:   AlertTriangle,
  },
  primary: {
    color:  "#c8ff00",
    bg:     "rgba(200,255,0,0.08)",
    border: "rgba(200,255,0,0.3)",
    glow:   "rgba(200,255,0,0.2)",
    icon:   Zap,
  },
  success: {
    color:  "#a855f7",
    bg:     "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.3)",
    glow:   "rgba(168,85,247,0.2)",
    icon:   CheckCircle2,
  },
};

export default function ConfirmModal({
  isOpen,
  title       = "Confirmar acción",
  message     = "¿Estás seguro?",
  confirmText = "Aceptar",
  cancelText  = "Cancelar",
  variant     = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cfg  = VARIANT_CFG[variant];
  const Icon = cfg.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── OVERLAY ── */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* ── MODAL ── */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800/70 p-7 pointer-events-auto"
              style={{
                clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
                boxShadow: `0 0 60px -15px ${cfg.glow}`,
              }}
            >
              {/* Acento esquina top-right */}
              <span
                aria-hidden
                className="absolute top-0 right-0 w-4.5 h-4.5"
                style={{ background: cfg.color, clipPath: "polygon(0 0, 100% 100%, 100% 0)" }}
              />
              {/* Acento esquina bottom-left */}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 w-4.5 h-4.5"
                style={{ background: cfg.color, opacity: 0.4, clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
              />

              {/* Grid fondo interior */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                  maskImage: `radial-gradient(ellipse at 50% 0%, black 10%, transparent 70%)`,
                }}
              />

              {/* Botón cerrar */}
              <motion.button
                onClick={onCancel}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 left-4 flex items-center justify-center w-6 h-6 text-zinc-700 hover:text-zinc-400 transition-colors duration-200"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>

              {/* Contenido */}
              <div className="flex flex-col items-center gap-5 text-center relative">

                {/* Ícono animado */}
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
                  className="flex items-center justify-center w-16 h-16"
                  style={{
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    boxShadow: `0 0 30px -8px ${cfg.glow}`,
                    clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  }}
                >
                  <Icon className="w-7 h-7" style={{ color: cfg.color }} />
                </motion.div>

                {/* Título */}
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    letterSpacing: "0.05em",
                    color: cfg.color,
                    lineHeight: 1,
                  }}
                >
                  {title}
                </h2>

                {/* Línea neon */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60px" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-px"
                  style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }}
                />

                {/* Mensaje */}
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "12px",
                    lineHeight: "1.8",
                    letterSpacing: "0.04em",
                    color: "#71717a",
                  }}
                >
                  {message}
                </p>

                {/* Botones */}
                <div className="flex gap-3 w-full mt-1">
                  {/* Cancelar */}
                  <motion.button
                    type="button"
                    onClick={onCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 py-3 border border-zinc-700 text-zinc-500
                               hover:border-zinc-500 hover:text-zinc-300 transition-all duration-200"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
                    }}
                  >
                    {cancelText}
                  </motion.button>

                  {/* Confirmar */}
                  <motion.button
                    type="button"
                    onClick={onConfirm}
                    whileHover={{ scale: 1.02, boxShadow: `0 0 24px -6px ${cfg.glow}` }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 py-3 transition-all duration-200"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      background: cfg.color,
                      color: variant === "danger" ? "#fff" : "#000",
                      clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
                    }}
                  >
                    {confirmText}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}