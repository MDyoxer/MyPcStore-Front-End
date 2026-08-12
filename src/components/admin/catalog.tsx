"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brands, GetBrands } from "@/src/actions/brands/get-all-brands";
import { Categories, GetCategories } from "@/src/actions/categories/get-all-categories";
import { Tag, Shield, Plus, Edit3, Check, X, ChevronDown, LucideIcon } from "lucide-react";
import { createBrand } from "@/src/actions/brands/new-brand";
import { updateBrand } from "@/src/actions/brands/update-brand";
import { createCategory } from "@/src/actions/categories/new-categorie";
import { updateCategory } from "@/src/actions/categories/update-category";
import { useAuth } from "@/src/context/AuthContext";
// ─── ESTILOS COMPARTIDOS ──────────────────────────────────────────────────────
const inputCls = `
  w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-700
  px-4 py-3 outline-none focus:border-[#c8ff00]/50 transition-colors duration-200
`;
const inputStyle = {
  fontFamily: "'Space Mono', monospace",
  fontSize: "12px",
  letterSpacing: "0.03em",
  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

// ─── FEEDBACK BADGE ───────────────────────────────────────────────────────────
function SavedBadge({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8, x: 8 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-1 px-2 py-1"
          style={{
            fontFamily: "'Space Mono', monospace", fontSize: "12px",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#000", background: "#c8ff00",
            clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
          }}
        >
          <Check className="w-3 h-3" /> Guardado
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ─── PANEL CARD ───────────────────────────────────────────────────────────────
function PanelCard({
  title, icon: Icon, accent = "#c8ff00", children,
}: {
  title: string;
  icon: LucideIcon;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-zinc-950 border border-zinc-800/60 p-6 flex flex-col gap-5"
      style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}
    >
      {/* Acento esquina */}
      <span aria-hidden className="absolute top-0 right-0 w-3.5 h-3.5"
        style={{ background: accent, clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />

      {/* Header panel */}
      <div className="flex items-center gap-2 pb-4 border-b border-zinc-800/50">
        <div className="flex items-center justify-center w-8 h-8"
          style={{
            background: `${accent}12`, border: `1px solid ${accent}25`,
            clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
          }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.06em", color: "#fff" }}>
          {title}
        </span>
      </div>

      {children}
    </motion.div>
  );
}

// ─── SELECT ESTILIZADO ────────────────────────────────────────────────────────
function StyledSelect({
  value, onChange, placeholder, children, accent = "#c8ff00",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls + " appearance-none cursor-pointer pr-9"}
        style={{ ...inputStyle, color: value ? "#fff" : "#3f3f46" }}
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
        style={{ color: accent }} />
    </div>
  );
}

// ─── SECCIÓN: NUEVA + EDITAR ──────────────────────────────────────────────────
function CrudSection({
  label, items, itemKey, itemLabel, accent, onCreate, onRename,
}: {
  label: string;
  items: { id: number | string; [key: string]: unknown }[];
  itemKey: string;
  itemLabel: string;
  accent: string;
  onCreate: (name: string) => Promise<void>;
  onRename: (id: number | string, name: string) => Promise<void>;
}) {
  const [newVal,      setNewVal]      = useState("");
  const [selected,    setSelected]    = useState("");
  const [editVal,     setEditVal]     = useState("");
  const [savedNew,    setSavedNew]    = useState(false);
  const [savedEdit,   setSavedEdit]   = useState(false);
  const [savingNew,   setSavingNew]   = useState(false);
  const [savingEdit,  setSavingEdit]  = useState(false);

  const handleSaveNew = async () => {
    if (!newVal.trim() || savingNew) return;
    setSavingNew(true);
    try {
      await onCreate(newVal.trim());
      setSavedNew(true);
      setNewVal("");
      setTimeout(() => setSavedNew(false), 2000);
    } catch (e) {
      console.error("Error al crear:", e);
    } finally {
      setSavingNew(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selected || !editVal.trim() || savingEdit) return;
    setSavingEdit(true);
    try {
      await onRename(selected, editVal.trim());
      setSavedEdit(true);
      setEditVal("");
      setSelected("");
      setTimeout(() => setSavedEdit(false), 2000);
    } catch (e) {
      console.error("Error al editar:", e);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── NUEVA ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <Plus className="w-3.5 h-3.5" style={{ color: accent }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b" }}>
            Nueva {label}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveNew()}
            placeholder={`Ej: ${label === "marca" ? "Kingston" : "Almacenamiento"}`}
            className={inputCls + " flex-1"}
            style={inputStyle}
          />
          <motion.button
            type="button"
            onClick={handleSaveNew}
            disabled={!newVal.trim() || savingNew}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-4 py-3 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: accent, color: "#000",
              fontFamily: "'Space Mono', monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Añadir
          </motion.button>
        </div>
        <div className="h-4 flex items-center">
          <SavedBadge show={savedNew} />
        </div>
      </div>

      {/* Separador */}
      <div className="h-px bg-zinc-800/60" />

      {/* ── EDITAR ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <Edit3 className="w-3.5 h-3.5" style={{ color: accent }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b" }}>
            Editar {label}
          </span>
        </div>

        <StyledSelect
          value={selected}
          onChange={(v) => { setSelected(v); setEditVal(""); }}
          placeholder={`Seleccionar ${label}...`}
          accent={accent}
        >
          {items.map((item) => (
            <option key={String(item[itemKey])} value={String(item[itemKey])}>
              {String(item[itemLabel])}
            </option>
          ))}
        </StyledSelect>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-2 overflow-hidden"
            >
              <div className="flex gap-2 pt-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                    placeholder="Nuevo valor..."
                    className={inputCls}
                    style={inputStyle}
                  />
                  {editVal && (
                    <button type="button" onClick={() => setEditVal("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <motion.button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={!editVal.trim() || savingEdit}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-3 border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    borderColor: `${accent}40`, color: accent,
                    fontFamily: "'Space Mono', monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                    clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
                  }}
                >
                  <Check className="w-3.5 h-3.5" />
                  Guardar
                </motion.button>
              </div>
              <div className="h-4 flex items-center">
                <SavedBadge show={savedEdit} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lista actual */}
      {items.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-1 border-t border-zinc-800/40">
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3f3f46", marginBottom: "4px" }}>
            Registradas ({items.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <motion.span
                key={String(item[itemKey])}
                whileHover={{ scale: 1.04 }}
                className="px-2.5 py-1"
                style={{
                  fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.1em",
                  color: selected === String(item[itemKey]) ? "#000" : "#71717a",
                  background: selected === String(item[itemKey]) ? accent : "rgba(255,255,255,0.04)",
                  border: `1px solid ${selected === String(item[itemKey]) ? accent : "rgba(63,63,70,0.5)"}`,
                  clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                  cursor: "pointer",
                }}
                onClick={() => setSelected(String(item[itemKey]))}
              >
                {String(item[itemLabel])}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function Catalog() {
  const [brands,     setBrands]     = useState<Brands[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const { getIdToken } = useAuth();

  const refresh = useCallback(async () => {
    const [b, c] = await Promise.all([GetBrands(), GetCategories()]);
    setBrands(b);
    setCategories(c);
  }, []);

  useEffect(() => {
    (async () => {
      try { await refresh(); } catch (e) { console.error(e); }
    })();
  }, [refresh]);

  const handleCreateBrand = async (name: string) => {
    const idToken = await getIdToken();
    if (!idToken) return;
    await createBrand(idToken, name);
    await refresh();
  };

  const handleCreateCategory = async (name: string) => {
    const idToken = await getIdToken();
    if (!idToken) return;
    await createCategory(idToken, name);
    await refresh();
  };

  const handleRenameBrand = async (id: number | string, name: string) => {
    const idToken = await getIdToken();
    if (!idToken) return;
    await updateBrand(idToken, Number(id), name);
    await refresh();
  };

  const handleRenameCategory = async (id: number | string, name: string) => {
    const idToken = await getIdToken();
    if (!idToken) return;
    await updateCategory(idToken, Number(id), name);
    await refresh();
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

      <div className="max-w-5xl mx-auto px-4 pt-10 pb-24 relative">

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }} className="mb-10">
          <div className="flex items-center gap-3 mb-2 text-[#c8ff00]"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            <span className="w-8 h-px bg-[#c8ff00]" /> Catálogo
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.02em", lineHeight: 0.95 }}>
            <span className="text-white">MARCAS & </span>
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>CATEGORÍAS</span>
          </h1>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.06em", color: "#52525b", marginTop: "11px" }}>
            Crea o edita las marcas y categorías del catálogo.
          </p>
        </motion.div>

        {/* ── DOS COLUMNAS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* MARCAS */}
          <PanelCard title="Gestión de Marcas" icon={Shield} accent="#c8ff00">
            <CrudSection
              label="marca"
              items={brands as unknown as { id: number | string; [key: string]: unknown }[]}
              itemKey="id"
              itemLabel="marca"
              accent="#c8ff00"
              onCreate={handleCreateBrand}
              onRename={handleRenameBrand}
            />
          </PanelCard>

          {/* CATEGORÍAS */}
          <PanelCard title="Gestión de Categorías" icon={Tag} accent="#a855f7">
            <CrudSection
              label="categoría"
              items={categories as unknown as { id: number | string; [key: string]: unknown }[]}
              itemKey="id"
              itemLabel="categoria"
              accent="#a855f7"
              onCreate={handleCreateCategory}
              onRename={handleRenameCategory}
            />
          </PanelCard>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
        select option { background: #09090b; color: #fff; }
        input:focus, select:focus { box-shadow: 0 0 0 1px rgba(200,255,0,0.1); }
      `}</style>
    </div>
  );
}