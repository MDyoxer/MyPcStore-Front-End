"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ImageOff, Upload, X, Plus, Trash2,
    Package, DollarSign, Layers, Tag,
    Eye, Shield, FileText, BarChart2, ArrowLeft, Check,
} from "lucide-react";
import Link from "next/link";
import { createProduct } from "@/src/actions/products/create-product";
import { useAuth } from "@/src/context/AuthContext";
import { Categories, GetCategories } from "@/src/actions/categories/get-all-categories";
import { Brands, GetBrands } from "@/src/actions/brands/get-all-brands";
// ─── TIPOS ────────────────────────────────────────────────────────────────────
type Spec = { key: string; value: string };


// ─── FIELD WRAPPER ────────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#52525b" }}>
                {label}
            </label>
            {children}
            <AnimatePresence>
                {error && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#ef4444" }}>
                        ⚠ {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

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

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function NewProduct() {
    // Form state
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [categorias, setCategorias] = useState<Categories[]>([]);
    const [marcas, setMarcas] = useState<Brands[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [specs, setSpecs] = useState<Spec[]>([{ key: "", value: "" }]);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saved, setSaved] = useState(false);
    const { getIdToken } = useAuth();
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            const cat = await GetCategories();
            setCategorias(cat);
            const brands = await GetBrands();
            setMarcas(brands);
        };

        fetchData();
    }, []);
    // Preview al subir archivo
    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewSrc(e.target?.result as string);
        reader.readAsDataURL(file);
        setFile(file);
    };

    // Specs
    const addSpec = () => setSpecs((p) => [...p, { key: "", value: "" }]);
    const removeSpec = (i: number) => setSpecs((p) => p.filter((_, idx) => idx !== i));
    const setSpec = (i: number, field: "key" | "value", v: string) =>
        setSpecs((p) => p.map((s, idx) => idx === i ? { ...s, [field]: v } : s));

    // Validación
    const validate = () => {
        const e: Record<string, string> = {};
        if (!nombre.trim()) e.nombre = "El nombre es requerido.";
        if (!precio.trim()) e.precio = "El precio es requerido.";
        else if (isNaN(+precio) || +precio <= 0) e.precio = "Ingresa un precio válido.";
        if (!stock.trim()) e.stock = "El stock es requerido.";
        else if (isNaN(+stock) || +stock < 0) e.stock = "Ingresa un stock válido.";
        if (!categoriaSeleccionada) e.categoria = "Selecciona una categoría.";

        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        const token = await getIdToken();
        if (!token) { setErrors({ general: "No se pudo obtener el token de autenticación." }); return; }
        const formData = new FormData();
        formData.append("nombre_prod", nombre);
        formData.append("precio_prod", precio);
        formData.append("stock_prod", stock);
        formData.append("id_ctp_prod", categoriaSeleccionada);
        formData.append("id_marca_prod", marcaSeleccionada);
        formData.append("descripcion_prod", descripcion);
        if (file) formData.append("file", file);

        try {
            await createProduct(token, formData);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            setErrors({ general: error instanceof Error ? error.message : "Error al crear el producto." });
        };
    }
    const clearError = (k: string) => setErrors((p) => ({ ...p, [k]: "" }));

    return (
        <div className="w-full bg-black min-h-screen relative overflow-hidden">

            {/* Grid fondo */}
            <div aria-hidden className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(200,255,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.02) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)",
                }} />

            <div className="max-w-6xl mx-auto px-4 pt-10 pb-24 relative">

                {/* ── BREADCRUMB ── */}
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    <Link href="/admin/products"
                        className="inline-flex items-center gap-2 text-zinc-600 hover:text-[#c8ff00] transition-colors duration-200 group mb-10"
                        style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                        Volver a productos
                    </Link>
                </motion.div>

                {/* ── HEADER ── */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }} className="mb-10">
                    <div className="flex items-center gap-3 mb-2 text-[#c8ff00]"
                        style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase" }}>
                        <span className="w-8 h-px bg-[#c8ff00]" /> Catálogo
                    </div>
                    <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", letterSpacing: "0.02em", lineHeight: 0.95 }}>
                        <span className="text-white">AGREGAR </span>
                        <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>PRODUCTO</span>
                    </h1>
                </motion.div>

                {/* ── LAYOUT PRINCIPAL ── */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

                        {/* ── COLUMNA IMAGEN ── */}
                        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col gap-4 lg:sticky lg:top-6"
                        >
                            {/* Preview */}
                            <div
                                className="relative w-full aspect-square bg-zinc-950 border border-zinc-800/60 flex items-center justify-center overflow-hidden group"
                                style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
                            >
                                <span aria-hidden className="absolute top-0 right-0 w-4 h-4 bg-[#c8ff00]"
                                    style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />

                                <AnimatePresence mode="wait">
                                    {previewSrc ? (
                                        <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }} className="w-full h-full relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={previewSrc} alt="Preview" className="w-full h-full object-contain p-4" />
                                            <button type="button" onClick={() => { setPreviewSrc(null); }}
                                                className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 bg-black/80 border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition-all duration-200">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                            {/* Scanline */}
                                            <div className="absolute inset-0 pointer-events-none"
                                                style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(200,255,0,0.015) 3px, rgba(200,255,0,0.015) 4px)" }} />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="flex flex-col items-center gap-3 text-zinc-700">
                                            <ImageOff className="w-10 h-10" />
                                            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center" }}>
                                                Sin imagen
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>



                            {/* Upload archivo */}
                            <input ref={fileRef} type="file" accept="image/*" className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                            <motion.button type="button" onClick={() => fileRef.current?.click()}
                                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-2 border border-zinc-700 text-zinc-500
                           hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-all duration-200 py-3"
                                style={{
                                    fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
                                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                                }}>
                                <Upload className="w-3.5 h-3.5" />
                                Subir archivo
                            </motion.button>
                        </motion.div>

                        {/* ── COLUMNA FORMULARIO ── */}
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-zinc-950 border border-zinc-800/60 p-7 flex flex-col gap-6 relative"
                            style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
                        >
                            <span aria-hidden className="absolute top-0 right-0 w-4 h-4 bg-[#a855f7]"
                                style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />
                            <span aria-hidden className="absolute bottom-0 left-0 w-4 h-4 bg-[#c8ff00]"
                                style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />

                            {/* ── SECCIÓN: INFO BÁSICA ── */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-zinc-800/50">
                                    <Package className="w-4 h-4 text-[#c8ff00]" />
                                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#fff" }}>
                                        Información básica
                                    </span>
                                </div>

                                {/* Nombre */}
                                <Field label="Nombre del producto *" error={errors.nombre}>
                                    <input type="text" value={nombre}
                                        onChange={(e) => { setNombre(e.target.value); clearError("nombre"); }}
                                        placeholder="Ej: Laptop ASUS ROG Strix G16"
                                        className={inputCls}
                                        style={{ ...inputStyle, borderColor: errors.nombre ? "rgba(239,68,68,0.4)" : undefined }}
                                    />
                                </Field>

                                {/* Precio + Stock */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Precio (MXN) *" error={errors.precio}>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                                            <input type="number" min="0" value={precio}
                                                onChange={(e) => { setPrecio(e.target.value); clearError("precio"); }}
                                                placeholder="0.00"
                                                className={inputCls + " pl-9"}
                                                style={{ ...inputStyle, borderColor: errors.precio ? "rgba(239,68,68,0.4)" : undefined }}
                                            />
                                        </div>
                                    </Field>

                                    <Field label="Stock disponible *" error={errors.stock}>
                                        <div className="relative">
                                            <BarChart2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                                            <input type="number" min="0" value={stock}
                                                onChange={(e) => { setStock(e.target.value); clearError("stock"); }}
                                                placeholder="0"
                                                className={inputCls + " pl-9"}
                                                style={{ ...inputStyle, borderColor: errors.stock ? "rgba(239,68,68,0.4)" : undefined }}
                                            />
                                        </div>
                                    </Field>
                                </div>

                                {/* Categoría + Marca */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Categoría *" error={errors.categoria}>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                                            <select value={categoriaSeleccionada}
                                                onChange={(e) => { setCategoriaSeleccionada(e.target.value); clearError("categoria"); }}
                                                className={inputCls + " pl-9 appearance-none cursor-pointer"}
                                                style={{ ...inputStyle, color: categorias ? "#fff" : "#3f3f46", borderColor: errors.categoria ? "rgba(239,68,68,0.4)" : undefined }}>
                                                <option value="" disabled>Seleccionar...</option>
                                                {categorias.map((c) => <option key={c.id} value={c.id}>{c.categoria}</option>)}
                                            </select>
                                        </div>
                                    </Field>

                                    <Field label="Marca *" error={errors.marca}>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                                            <select value={marcaSeleccionada}
                                                onChange={(e) => { setMarcaSeleccionada(e.target.value); clearError("marca"); }}
                                                className={inputCls + " pl-9 appearance-none cursor-pointer"}
                                                style={{ ...inputStyle, color: marcas ? "#fff" : "#3f3f46", borderColor: errors.marca ? "rgba(239,68,68,0.4)" : undefined }}>
                                                <option value="" disabled>Seleccionar...</option>
                                                {marcas.map((m) => <option key={m.id} value={m.id}>{m.marca}</option>)}
                                            </select>
                                        </div>
                                    </Field>
                                </div>
                            </div>

                            {/* ── SECCIÓN: DESCRIPCIÓN ── */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-zinc-800/50">
                                    <FileText className="w-4 h-4 text-[#a855f7]" />
                                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#fff" }}>
                                        Descripción
                                    </span>
                                </div>
                                <Field label="Descripción del producto">
                                    <div className="relative">
                                        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                                            placeholder="Describe las características principales del producto..."
                                            rows={4}
                                            className={inputCls + " resize-none"}
                                            style={{ ...inputStyle }}
                                        />
                                        <span className="absolute bottom-3 right-3"
                                            style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#27272a" }}>
                                            {descripcion.length}/2000
                                        </span>
                                    </div>
                                </Field>
                            </div>

                            {/* ── SECCIÓN: SPECS ── */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/50">
                                    <div className="flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-[#c8ff00]" />
                                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#fff" }}>
                                            Especificaciones
                                        </span>
                                    </div>
                                    <motion.button type="button" onClick={addSpec}
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-1.5 border border-zinc-700 text-zinc-500
                               hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-all duration-200 px-3 py-1.5"
                                        style={{
                                            fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
                                            clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                                        }}>
                                        <Plus className="w-3 h-3" /> Añadir
                                    </motion.button>
                                </div>

                                <AnimatePresence>
                                    {specs.map((spec, i) => (
                                        <motion.div key={i}
                                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                                            className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
                                        >
                                            <input type="text" value={spec.key} onChange={(e) => setSpec(i, "key", e.target.value)}
                                                placeholder="Ej: Procesador"
                                                className={inputCls} style={inputStyle} />
                                            <input type="text" value={spec.value} onChange={(e) => setSpec(i, "value", e.target.value)}
                                                placeholder="Ej: Intel i9-14900K"
                                                className={inputCls} style={inputStyle} />
                                            <motion.button type="button" onClick={() => removeSpec(i)}
                                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                                disabled={specs.length === 1}
                                                className="flex items-center justify-center w-10 h-10 border border-zinc-800 text-zinc-700
                                   hover:border-red-500/40 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {specs.length === 0 && (
                                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#3f3f46", letterSpacing: "0.1em" }}>
                                        Sin especificaciones añadidas.
                                    </p>
                                )}
                            </div>

                            {/* ── BOTONES ── */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-zinc-800/50">
                                <motion.button type="submit"
                                    whileHover={{ scale: 1.01, boxShadow: "0 0 30px -6px rgba(200,255,0,0.45)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#c8ff00] text-black py-3.5
                             hover:bg-yellow-300 transition-colors duration-200"
                                    style={{
                                        fontFamily: "'Space Mono', monospace", fontSize: "12px", fontWeight: 700,
                                        letterSpacing: "0.15em", textTransform: "uppercase",
                                        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                                    }}>
                                    <AnimatePresence mode="wait">
                                        {saved ? (
                                            <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="flex items-center gap-2">
                                                <Check className="w-4 h-4" /> Producto guardado
                                            </motion.span>
                                        ) : (
                                            <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="flex items-center gap-2">
                                                <Package className="w-4 h-4" /> Guardar producto
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>

                                <motion.button type="button"
                                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => { setNombre(""); setPrecio(""); setStock(""); setCategorias([]); setMarcas([]); setDescripcion(""); setSpecs([{ key: "", value: "" }]); setPreviewSrc(null); setErrors({}); }}
                                    className="flex items-center justify-center gap-2 border border-zinc-700 text-zinc-500 px-6 py-3.5
                             hover:border-zinc-500 hover:text-zinc-300 transition-all duration-200"
                                    style={{
                                        fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase",
                                        clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                                    }}>
                                    <X className="w-3.5 h-3.5" /> Limpiar
                                </motion.button>
                                <motion.button type="button"
                                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-center gap-2 border border-zinc-700 text-zinc-500 px-6 py-3.5
                             hover:border-zinc-500 hover:text-zinc-300 transition-all duration-200"
                                    style={{
                                        fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase",
                                        clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                                    }}>
                                    <Eye className="w-3.5 h-3.5" /> Preview
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </form>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        textarea:focus, input:focus, select:focus { box-shadow: 0 0 0 1px rgba(200,255,0,0.1); }
      `}</style>
        </div>
    );
}
