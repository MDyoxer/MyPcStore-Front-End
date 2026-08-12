"use client";
import { GetProducts, Products } from "@/src/actions/products/get-all-products";
import { GetBrands, Brands } from "@/src/actions/brands/get-all-brands";
import { GetCategories, Categories } from "@/src/actions/categories/get-all-categories";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Edit, Trash2, Search, X, LayoutGrid, List, ArrowUpDown, Package, ImageOff, TrendingUp, Eye } from "lucide-react";
import { formatMoney } from "@/src/utils/formatMoney";
import Link from "next/link";
import ConfirmModal from "../modals/confirmModal";
type SortKey = "default" | "price-asc" | "price-desc" | "stock-asc" | "stock-desc" | "vendidos-desc" | "name-asc";
type ViewMode = "grid" | "list";
type ProductView = Products & { vendidos: number };
import { DesactivteProduct } from "@/src/actions/products/desactivate-product";
import { ActivateProduct } from "@/src/actions/products/activate-product";
import { useAuth } from "@/src/context/AuthContext";

// ─── STOCK BADGE ──────────────────────────────────────────────────────────────
function StockBadge({ stock }: { stock: number }) {
    const [color, bg, label] =
        stock === 0 ? ["#ef4444", "rgba(239,68,68,0.08)", "Sin stock"] :
            stock <= 5 ? ["#f59e0b", "rgba(245,158,11,0.08)", `${stock} uds`] :
                ["#c8ff00", "rgba(200,255,0,0.08)", `${stock} uds`];
    return (
        <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em",
            color, background: bg, border: `1px solid ${color}25`,
            padding: "2px 8px",
            clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
        }}>
            {label}
        </span>
    );
}

// ─── CARD CUADRÍCULA ──────────────────────────────────────────────────────────
function GridCard({ product, index, onRequestedDesactivate, onCheckActive }: { product: ProductView; index: number; onRequestedDesactivate: (product: ProductView) => void; onCheckActive: (activo: number) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3, boxShadow: "0 0 28px -10px rgba(200,255,0,0.2)" }}
            className="relative bg-zinc-950 border border-zinc-800/60 flex flex-col overflow-hidden group"
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
        >
            <span aria-hidden className="absolute top-0 right-0 w-3 h-3 bg-[#c8ff00]"
                style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />

            {/* Imagen */}
            <div className="relative aspect-video bg-zinc-900 overflow-hidden" onClick={() => onCheckActive(product.activo)}>
                {product.imagen ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imagen} alt={product.nombre} className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-700">
                        <ImageOff className="w-7 h-7" />
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}>Sin imagen</span>
                    </div>
                )}
                {/* Vendidos badge */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 px-2 py-0.5 backdrop-blur-sm"
                    style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}>
                    <TrendingUp className="w-3 h-3 text-[#a855f7]" />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#a855f7" }}>{product.vendidos} vendidos</span>
                </div>
                {/* Neon line hover */}
                <div aria-hidden className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-[#c8ff00]"
                    style={{ boxShadow: "0 0 8px #c8ff00" }} />
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#52525b" }}>
                    {product.categoria} <span className="text-[#c8ff00] opacity-50">✦</span> {product.marca}
                </div>
                <p className="line-clamp-2 leading-tight"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.04em", color: "#fff" }}>
                    {product.nombre}
                </p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800/40">
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.02em", color: "#c8ff00" }}>
                        {formatMoney(product.precio)}
                    </span>
                    <StockBadge stock={product.stock} />
                </div>
            </div>

            {/* Acciones */}
            <div className="flex border-t border-zinc-800/40">
                <Link href={`/admin/dashboard/editprod/${product.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-zinc-600 hover:text-[#c8ff00] hover:bg-[#c8ff00]/05 transition-all duration-200 border-r border-zinc-800/40">
                    <Edit className="w-3.5 h-3.5" />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Editar</span>
                </Link>
                <button
                    onClick={() => onRequestedDesactivate(product)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/05 transition-all duration-200">
                    {product.activo === 1
                        ? <Trash2 className="w-3.5 h-3.5" />
                        : <Eye className="w-3.5 h-3.5" />}
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{Number(product.activo) === 1 ? "Desactivar" : "Activar"}</span>

                </button>
            </div>
        </motion.div>
    );
}

// ─── FILA LISTA ───────────────────────────────────────────────────────────────
function ListRow({ product, index, onRequestedDesactivate, onCheckActive }: { product: ProductView; index: number; onRequestedDesactivate: (product: ProductView) => void; onCheckActive: (activo: number) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex items-center gap-4 bg-zinc-950 border border-zinc-800/60 px-4 py-3
                 hover:border-zinc-700/60 transition-colors duration-300"
            style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
        >
            <span aria-hidden className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#c8ff00] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />

            {/* Índice */}
            <span className="hidden sm:block shrink-0 w-6 text-center"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", color: "#27272a" }}>
                {String(index + 1).padStart(2, "0")}
            </span>

            {/* Imagen mini */}
            <div className="shrink-0 w-12 h-12 bg-zinc-900 flex items-center justify-center overflow-hidden"
                style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))" }} onClick={() => onCheckActive(product.activo)}>
                {product.imagen
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={product.imagen} alt="" className="w-full h-full object-contain p-1" />
                    : <ImageOff className="w-4 h-4 text-zinc-700" />
                }
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <p className="truncate" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.04em", color: "#fff" }}>
                    {product.nombre}
                </p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525b" }}>
                    {product.categoria} · {product.marca}
                </p>
            </div>

            {/* Vendidos */}
            <div className="hidden md:flex flex-col items-center shrink-0">
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "#a855f7", lineHeight: 1 }}>{product.vendidos}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#3f3f46" }}>vendidos</span>
            </div>

            {/* Stock */}
            <div className="hidden sm:block shrink-0">
                <StockBadge stock={product.stock} />
            </div>

            {/* Precio */}
            <span className="shrink-0" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.02em", color: "#c8ff00" }}>
                {formatMoney(product.precio)}
            </span>

            {/* Acciones */}
            <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/dashboard/editprod/${product.id}`}
                    className="flex items-center justify-center w-8 h-8 border border-zinc-800 text-zinc-600
                     hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-all duration-200"
                    style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}>
                    <Edit className="w-3.5 h-3.5" />
                </Link>
                <button onClick={() => onRequestedDesactivate(product)} className="flex items-center justify-center w-8 h-8 border border-zinc-800 text-zinc-600
                   hover:border-red-500/40 hover:text-red-500 transition-all duration-200"
                    style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}>
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function ListProductsAdmin() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortKey>("default");
    const [cat, setCat] = useState<"all" | number>("all");
    const [marca, setMarca] = useState<"all" | number>("all");
    const [categories, setCategories] = useState<Categories[]>([]);
    const [brands, setBrands] = useState<Brands[]>([]);
    const [products, setProducts] = useState<Products[]>([]);
    const [view, setView] = useState<ViewMode>("grid");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductView | null>(null);
    const openDesactivateModal = (product: ProductView) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };
   
    const { getIdToken } = useAuth();
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const fetchedProducts = await GetProducts();
                const fetchedCategories = await GetCategories();
                const fetchedBrands = await GetBrands();
                setProducts(fetchedProducts);
                setCategories(fetchedCategories);
                setBrands(fetchedBrands);
            } catch (error) {
                throw new Error("Error fetching data: " + error);
            }
        };
        fetchAll();
    }, []);

    const display = useMemo(() => products.map((p) => ({ ...p, vendidos: 0 })), [products]);

    const filtered = useMemo(() => {
        const catName = categories.find((c) => c.id === cat)?.categoria;
        const marcaName = brands.find((b) => b.id === marca)?.marca;
        return display
            .filter((p) => {
                const q = search.toLowerCase();
                const matchSearch = !q || p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q);
                const matchCat = cat === "all" || p.categoria === catName;
                const matchMarca = marca === "all" || p.marca === marcaName;
                return matchSearch && matchCat && matchMarca;
            })
            .sort((a, b) => {
                if (sort === "price-asc") return a.precio - b.precio;
                if (sort === "price-desc") return b.precio - a.precio;
                if (sort === "stock-asc") return a.stock - b.stock;
                if (sort === "stock-desc") return b.stock - a.stock;
                if (sort === "vendidos-desc") return b.vendidos - a.vendidos;
                if (sort === "name-asc") return a.nombre.localeCompare(b.nombre);
                return 0;
            });
    }, [display, search, sort, cat, marca, categories, brands]);

    const totalVendidos = display.reduce((acc, p) => acc + p.vendidos, 0);

    const handleDesactivarProd = async (idProd: number) => {
        const idToken = await getIdToken();
        if (!idToken) return;
        DesactivteProduct(idToken, idProd).catch((error) => {
            console.error("Error desactivating product:", error);
        });

    }
    const handleActivateProd = async (idProd: number) => {
        const idToken = await getIdToken();
        if (!idToken) return;
        ActivateProduct(idToken, idProd).catch((error) => {
            console.error("Error activating product:", error);
        });

    }
    const handleCheckactive = (activo:number) =>{
        console.log("valor activo", activo)
    }
    return (
        <div className="w-full bg-black min-h-screen relative overflow-hidden">

            {/* Grid fondo */}
            <div aria-hidden className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(200,255,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.02) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)",
                }} />

            <div className="max-w-7xl mx-auto px-4 pt-10 pb-24 relative">

                {/* ── HEADER ── */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-wrap items-end justify-between gap-4 mb-10"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2 text-[#c8ff00]"
                            style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase" }}>
                            <span className="w-8 h-px bg-[#c8ff00]" /> Catálogo
                        </div>
                        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.02em", lineHeight: 0.95 }}>
                            <span className="text-white">LISTADO DE </span>
                            <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>PRODUCTOS</span>
                        </h1>
                    </div>

                    {/* Stats rápidas */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {[
                            { label: "Total", value: products.length, color: "#c8ff00" },
                            { label: "Vendidos", value: totalVendidos, color: "#a855f7" },
                            { label: "Sin stock", value: products.filter((p) => p.stock === 0).length, color: "#ef4444" },
                        ].map((s) => (
                            <div key={s.label} className="flex items-center gap-2 border border-zinc-800/60 bg-zinc-950 px-3 py-1.5"
                                style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
                                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: s.color, lineHeight: 1 }}>{s.value}</span>
                                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b" }}>{s.label}</span>
                            </div>
                        ))}
                        <Link href="/admin/products/newProduct">
                            <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 bg-[#c8ff00] text-black px-4 py-2 cursor-pointer hover:bg-yellow-300 transition-colors duration-200"
                                style={{
                                    fontFamily: "'Space Mono', monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                                }}>
                                <Package className="w-3.5 h-3.5" /> Nuevo
                            </motion.span>
                        </Link>
                    </div>
                </motion.div>

                {/* ── CONTROLES ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.12 }}
                    className="flex flex-col gap-3 mb-6"
                >
                    {/* Fila 1: búsqueda + sort + toggle vista */}
                    <div className="flex gap-2 flex-wrap">
                        {/* Búsqueda */}
                        <div className="relative flex-1 min-w-50">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por nombre, marca o categoría..."
                                className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-700 pl-9 pr-9 py-2.5 outline-none focus:border-[#c8ff00]/40 transition-colors"
                                style={{
                                    fontFamily: "'Space Mono', monospace", fontSize: "11px",
                                    clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
                                }} />
                            {search && (
                                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                                className="bg-zinc-900 border border-zinc-800 text-zinc-400 pl-8 pr-4 py-2.5 outline-none focus:border-zinc-600 transition-colors cursor-pointer appearance-none"
                                style={{
                                    fontFamily: "'Space Mono', monospace", fontSize: "11px",
                                    clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
                                }}>
                                <option value="default">Relevancia</option>
                                <option value="price-asc">Precio ↑</option>
                                <option value="price-desc">Precio ↓</option>
                                <option value="stock-asc">Stock ↑</option>
                                <option value="stock-desc">Stock ↓</option>
                                <option value="vendidos-desc">Más vendidos</option>
                                <option value="name-asc">Nombre A-Z</option>
                            </select>
                        </div>

                        {/* Toggle vista */}
                        <div className="flex border border-zinc-800 bg-zinc-950 overflow-hidden"
                            style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
                            {(["grid", "list"] as ViewMode[]).map((v) => (
                                <motion.button key={v} onClick={() => setView(v)} whileTap={{ scale: 0.93 }}
                                    className="flex items-center justify-center w-10 h-10 transition-all duration-200"
                                    style={{ background: view === v ? "rgba(200,255,0,0.08)" : "transparent", color: view === v ? "#c8ff00" : "#52525b" }}>
                                    {v === "grid" ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Fila 2: chips categoría + marca */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3f3f46" }}>
                            Cat:
                        </span>
                        {[{ id: "all" as const, label: "Todos" }, ...categories.map((c) => ({ id: c.id, label: c.categoria }))].map((c) => (
                            <button key={c.id} onClick={() => setCat(c.id)}
                                className="px-3 py-1 text-[10px] tracking-widest uppercase transition-all duration-200"
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    background: cat === c.id ? "#c8ff00" : "transparent",
                                    color: cat === c.id ? "#000" : "#52525b",
                                    border: `1px solid ${cat === c.id ? "#c8ff00" : "rgba(63,63,70,0.5)"}`,
                                    clipPath: cat === c.id ? "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" : "none",
                                }}>
                                {c.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3f3f46" }}>
                            Marca:
                        </span>
                        {[{ id: "all" as const, label: "Todas" }, ...brands.map((b) => ({ id: b.id, label: b.marca }))].map((m) => (
                            <button key={m.id} onClick={() => setMarca(m.id)}
                                className="px-3 py-1 text-[10px] tracking-widest uppercase transition-all duration-200"
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    background: marca === m.id ? "#a855f7" : "transparent",
                                    color: marca === m.id ? "#fff" : "#52525b",
                                    border: `1px solid ${marca === m.id ? "#a855f7" : "rgba(63,63,70,0.5)"}`,
                                    clipPath: marca === m.id ? "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" : "none",
                                }}>
                                {m.label}
                            </button>
                        ))}
                    </div>

                    {/* Contador */}
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#3f3f46" }}>
                        {filtered.length === 0 ? "Sin resultados" : `${filtered.length} de ${products.length} productos`}
                    </div>
                </motion.div>

                {/* ── CONTENIDO ── */}
                <AnimatePresence mode="wait">
                    {filtered.length === 0 ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 gap-4 border border-zinc-800/40">
                            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4rem", color: "transparent", WebkitTextStroke: "1px rgba(200,255,0,0.15)" }}>
                                VACÍO
                            </span>
                            <button onClick={() => { setSearch(""); setCat("all"); setMarca("all"); }}
                                className="border border-zinc-700 text-zinc-500 px-5 py-2 hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-all"
                                style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                                Limpiar filtros
                            </button>
                        </motion.div>
                    ) : view === "grid" ? (
                        <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-zinc-800/30">
                            {filtered.map((p, i) => <GridCard key={p.id} product={p} index={i} onRequestedDesactivate={openDesactivateModal} onCheckActive={handleCheckactive} />)}
                        </motion.div>
                    ) : (
                        <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col gap-2">
                            {filtered.map((p, i) => <ListRow key={p.id} product={p} index={i} onRequestedDesactivate={openDesactivateModal} onCheckActive={handleCheckactive} />)}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Fin de lista */}
                {filtered.length > 0 && (
                    <div className="flex flex-col items-start gap-1 pt-4 pl-1 mt-4">
                        <span className="h-px bg-[#c8ff00] w-16 opacity-80" />
                        <span className="h-px bg-[#c8ff00] w-10 opacity-50" />
                        <span className="h-px bg-[#c8ff00] w-5  opacity-25" />
                    </div>
                )}
            </div>
            <ConfirmModal
                isOpen={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onConfirm={() => { if (selectedProduct) handleDesactivarProd(selectedProduct.id); setIsModalOpen(false); }}
                message={
                    selectedProduct
                        ? selectedProduct.activo === 1
                            ? `¿Desactivar "${selectedProduct.nombre}"? Ya no se mostrará en la tienda.`
                            : `¿Activar "${selectedProduct.nombre}"? Se mostrará en la tienda.`
                        : ''
                }
                cancelText="Cancelar"
                confirmText={selectedProduct && selectedProduct.activo === 1 ? "Desactivar" : "Activar"}
                variant="danger"
            />
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      `}</style>
        </div>
    );
}