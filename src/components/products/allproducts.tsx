"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  ShoppingCart, ImageOff, Check, Plus, Minus, Heart,
  ChevronDown, SlidersHorizontal, X, Search, ArrowUpDown,
} from "lucide-react";
import { GetCategories, Categories } from "@/src/actions/categories/get-all-categories";
import { GetProducts, Products } from "@/src/actions/products/get-all-products";
import { GetBrands, Brands } from "@/src/actions/brands/get-all-brands";
import { formatMoney } from "@/src/utils/formatMoney";
import { slugify } from "@/src/utils/slugify";
import LoadingScreen from "@/src/components/ui/loading";
import { useProductAction } from "@/src/hooks/useProductAction";

// ─── TIPOS ───────────────────────────────────────────────────────────────────
type SortKey = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

// ─── HOOK CARRITO ─────────────────────────────────────────────────────────────
function useCart() {
  const [activeCart, setActiveCart] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [cartItems, setCartItems] = useState<Record<number, boolean>>({});


  const getQty = useCallback((id: number) => quantities[id] ?? 1, [quantities]);
  const increase = useCallback((id: number, maxStock: number) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min((prev[id] ?? 1) + 1, maxStock),
    })),
    []);
    
  const decrease = (id: number) =>
    setQuantities((p) => {
      const next = (p[id] ?? 1) - 1;
      if (next <= 0) { setActiveCart(null); setCartItems((c) => ({ ...c, [id]: false })); return { ...p, [id]: 1 }; }
      return { ...p, [id]: next };
    });
  const confirm = (id: number) => { setCartItems((c) => ({ ...c, [id]: true })); setActiveCart(null); };
  const openCart = (id: number) => setActiveCart(id);

  return { activeCart, openCart, confirm, getQty, increase, decrease, cartItems };
}

// ─── PRODUCT CARD (misma que TopProducts) ─────────────────────────────────────
function ProductCard({
  product, index, loaded, activeCart,
  onOpenCart, onConfirm, onIncrease, onDecrease, onFavorite, qty, inCart,
}: {
  product: Products; index: number; loaded: boolean;
  activeCart: number | null;
  onOpenCart: (id: number) => void;
  onConfirm: (id: number) => void;
  onIncrease: (id: number, maxStock: number) => void;
  onDecrease: (id: number) => void;
  qty: number; inCart: boolean;
  onFavorite: (id: number) => void
}) {
  const isActive = activeCart === product.id;
  const [liked, setLiked] = useState(false);

  return (
    <article
      className="apex-card group p-4 relative flex flex-col bg-zinc-950 border border-zinc-800/60 overflow-hidden"
      style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.5s ease, transform 0.5s ease`,
        transitionDelay: `${Math.min(index, 8) * 50}ms`,
        clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
      }}
    >
      <span aria-hidden className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#c8ff00] z-10"
        style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />

      {inCart && (
        <span className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-[#c8ff00] text-black px-2 py-0.5"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          <Check className="w-2.5 h-2.5" /> En carrito
        </span>
      )}

      {/* Imagen */}
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-900">

        {product.imagen ? (
          <Link href={`/products/${slugify(product.nombre)}`}>
            <Image src={product.imagen} alt={product.nombre} width={400} height={300}
              className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105" />
          </Link>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageOff className="w-7 h-7 text-zinc-700" />
            <span className="text-zinc-600 text-center px-4"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Sin imagen
            </span>
          </div>
        )}
        <div aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200,255,0,0.02) 2px, rgba(200,255,0,0.02) 4px)" }} />
        <div aria-hidden className="absolute bottom-0 left-0 h-0.5 bg-[#c8ff00] w-0 group-hover:w-full transition-all duration-500 ease-out"
          style={{ boxShadow: "0 0 8px #c8ff00" }} />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-center gap-2 text-zinc-600"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          <span>{product.categoria}</span>
          <span className="text-[#c8ff00] opacity-60">✦</span>
          <span>{product.marca}</span>
        </div>

        {/* Nombre + corazón */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white leading-tight line-clamp-2 group-hover:text-[#c8ff00] transition-colors duration-300"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.04em" }}>
            <Link href={`/products/${slugify(product.nombre)}`}>{product.nombre}</Link>
          </h3>
          <button onClick={() => {
            setLiked((v) => !v);
            onFavorite(product.id);
          }} aria-label="Favorito"
            className="shrink-0 mt-0.5 active:scale-90 transition-transform duration-200">
            <Heart className="w-4.5 h-4.5 transition-colors duration-200"
              style={{ fill: liked ? "#a855f7" : "transparent", stroke: liked ? "#a855f7" : "#52525b", strokeWidth: 1.8 }} />
          </button>
        </div>

        {/* Precio + carrito */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800/50">
          <span className="text-[#c8ff00]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.02em" }}>
            {formatMoney(product.precio)}
          </span>

          <div className="relative h-9 w-32.5">
            <button onClick={() => onOpenCart(product.id)}
              className={`absolute inset-0 flex items-center justify-center gap-1.5 bg-[#c8ff00] text-black
                          transition-all duration-300 active:scale-95
                          ${isActive ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}
              style={{
                fontFamily: "'Space Mono', monospace", fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                boxShadow: "0 0 16px -4px rgba(200,255,0,0.4)",
              }}>
              <ShoppingCart className="w-3.5 h-3.5" /> Agregar
            </button>

            <div className={`absolute inset-0 flex items-center justify-between border border-zinc-700/80 bg-zinc-900/90 px-2
                            transition-all duration-300
                            ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
              <button onClick={() => onConfirm(product.id)}
                className="flex items-center justify-center w-6 h-6 bg-[#c8ff00] hover:bg-yellow-300 transition-colors">
                <Check className="w-3.5 h-3.5 text-black" />
              </button>
              <span className="w-px h-5 bg-zinc-700" />
              <button onClick={() => onIncrease(product.id, product.stock)}
                className="flex items-center justify-center w-6 h-6 text-zinc-400 hover:text-[#c8ff00] transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
              <span className="w-px h-5 bg-zinc-700" />
              <span className="w-6 text-center text-white tabular-nums"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}>{qty}</span>
              <span className="w-px h-5 bg-zinc-700" />
              <button onClick={() => onDecrease(product.id)}
                className="flex items-center justify-center w-6 h-6 text-zinc-400 hover:text-[#c8ff00] transition-colors">
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── PANEL DE FILTRO COLAPSABLE ────────────────────────────────────────────────
function FilterSection({ title, children, accent = "#c8ff00" }: {
  title: string; children: React.ReactNode; accent?: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-zinc-800/60 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3.5 px-1 group"
      >
        <span className="flex items-center gap-2" style={{ color: accent, fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase" }}>
          <span className="w-3 h-px" style={{ background: accent }} />
          {title}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-600 transition-transform duration-300 group-hover:text-zinc-400"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      <div className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: open ? "400px" : "0px", opacity: open ? 1 : 0 }}>
        <div className="pb-4 px-1 flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}

// ─── CHECKBOX ITEM ─────────────────────────────────────────────────────────────
function FilterCheckbox({ label, checked, onChange, count, accent = "#c8ff00" }: {
  label: string; checked: boolean; onChange: () => void; count?: number; accent?: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <span
        onClick={onChange}
        className="shrink-0 w-4 h-4 border transition-all duration-200 flex items-center justify-center"
        style={{
          borderColor: checked ? accent : "#3f3f46",
          background: checked ? accent : "transparent",
          clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
        }}
      >
        {checked && <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />}
      </span>
      <span
        className="flex-1 transition-colors duration-200"
        style={{
          fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.08em",
          color: checked ? "#fff" : "#52525b",
        }}
        onClick={onChange}
      >
        {label}
      </span>
      {count !== undefined && (
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", color: checked ? accent : "#3f3f46" }}>
          {count}
        </span>
      )}
    </label>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function AllProducts() {
  const [products, setProducts] = useState<Products[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [brands, setBrands] = useState<Brands[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // Filtros
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999999]);
  const [sort, setSort] = useState<SortKey>("default");
  const [visibleCount, setVisibleCount] = useState(12);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const cart = useCart();

  const { handleFavoriteItem, confirmAndAdd } = useProductAction({
    onConfirmCart: cart.confirm,
    getQuantity: cart.getQty,
  });

  useEffect(() => {
    (async () => {
      try {
        const [p, c, b] = await Promise.all([GetProducts(), GetCategories(), GetBrands()]);
        setProducts(p);
        setCategories(c);
        setBrands(b);
        const prices = p.map((x) => x.precio);
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      } catch (e) { console.error(e); }
      finally {
        setLoading(false);
        setTimeout(() => setLoaded(true), 80);
      }
    })();
  }, []);

  // Precio min/max real
  const [minPrice, maxPrice] = useMemo(() => {
    if (!products.length) return [0, 999999];
    const p = products.map((x) => x.precio);
    return [Math.min(...p), Math.max(...p)];
  }, [products]);

  // Conteos para checkboxes
  const catCounts = useMemo(() => Object.fromEntries(categories.map((c) => [c.categoria, products.filter((p) => p.categoria === c.categoria).length])), [categories, products]);
  const brandCounts = useMemo(() => Object.fromEntries(brands.map((b) => [b.marca, products.filter((p) => p.marca === b.marca).length])), [brands, products]);

  // Toggle helpers
  const toggleSet = (set: Set<string>, val: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(val)) {
      next.delete(val);
    } else {
      next.add(val);
    }
    setter(next);
    setVisibleCount(12);
  };

  // Productos filtrados
  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        const q = search.toLowerCase();
        const matchSearch = !q || p.nombre.toLowerCase().includes(q) || p.marca?.toLowerCase().includes(q) || p.categoria?.toLowerCase().includes(q);
        const matchCat = !selectedCats.size || selectedCats.has(p.categoria ?? "");
        const matchBrand = !selectedBrands.size || selectedBrands.has(p.marca ?? "");
        const matchPrice = p.precio >= priceRange[0] && p.precio <= priceRange[1];
        return matchSearch && matchCat && matchBrand && matchPrice;
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.precio - b.precio;
        if (sort === "price-desc") return b.precio - a.precio;
        if (sort === "name-asc") return a.nombre.localeCompare(b.nombre);
        if (sort === "name-desc") return b.nombre.localeCompare(a.nombre);
        return 0;
      });
  }, [products, search, selectedCats, selectedBrands, priceRange, sort]);

  const activeFilters = selectedCats.size + selectedBrands.size + (priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0);

  const clearAll = () => {
    setSelectedCats(new Set());
    setSelectedBrands(new Set());
    setPriceRange([minPrice, maxPrice]);
    setSearch("");
    setSort("default");
    setVisibleCount(12);
  };

  return (
    <div className="w-full bg-black min-h-screen relative overflow-x-hidden">

      {/* Grid fondo */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(200,255,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)",
        }} />

      <div className="max-w-7xl mx-auto px-4 pt-12 pb-24 relative">

        {/* ── HEADER ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3 text-[#c8ff00]"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase" }}>
            <span className="w-8 h-px bg-[#c8ff00]" />
            Catálogo completo
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 7vw, 5rem)", letterSpacing: "0.02em" }}>
              <span className="text-white">TODOS LOS </span>
              <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>PRODUCTOS</span>
            </h1>
            {/* Búsqueda + sort */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                <input
                  type="text" value={search}
                  onChange={(e) => { setSearch(e.target.value); setVisibleCount(12); }}
                  placeholder="Buscar..."
                  className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500
                             pl-9 pr-4 py-2.5 outline-none focus:border-[#c8ff00]/40 transition-colors"
                  style={{
                    fontFamily: "'Space Mono', monospace", fontSize: "10px",
                    clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
                  }}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-400 pl-8 pr-3 py-2.5 outline-none
                             focus:border-zinc-600 transition-colors cursor-pointer appearance-none"
                  style={{
                    fontFamily: "'Space Mono', monospace", fontSize: "10px",
                    clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
                  }}>
                  <option value="default">Relevancia</option>
                  <option value="price-asc">Precio ↑</option>
                  <option value="price-desc">Precio ↓</option>
                  <option value="name-asc">Nombre A-Z</option>
                  <option value="name-desc">Nombre Z-A</option>
                </select>
              </div>

              {/* Toggle sidebar mobile */}
              <button onClick={() => setSidebarOpen((v) => !v)}
                className={`lg:hidden flex items-center gap-1.5 border px-3 py-2.5 transition-colors duration-200 relative
                  ${sidebarOpen ? "border-[#c8ff00] text-[#c8ff00]" : "border-zinc-700 text-zinc-500"}`}
                style={{
                  fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase",
                  clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
                }}>
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {activeFilters > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-500 text-white flex items-center justify-center"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.7rem" }}>{activeFilters}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── LAYOUT PRINCIPAL ── */}
        <div className="flex gap-6 items-start">

          {/* ── SIDEBAR FILTROS ── */}
          <aside className={`
           shrink-0 w-64 bg-zinc-950 border border-zinc-800/60 flex flex-col
             lg:top-6
            fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
            transition-transform duration-300 ease-out overflow-y-auto
            lg:translate-x-0 lg:max-h-[calc(100vh-3rem)]
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>

            {/* Acento */}
            <span aria-hidden className="absolute top-0 right-0 w-3 h-3 bg-purple-500"
              style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />

            {/* Header sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/60">
              <span className="flex items-center gap-2 text-purple-400"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase" }}>
                <SlidersHorizontal className="w-3 h-3" /> Filtros
                {activeFilters > 0 && (
                  <span className="bg-purple-500 text-white px-1.5"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem" }}>{activeFilters}</span>
                )}
              </span>
              <div className="flex gap-2">
                {activeFilters > 0 && (
                  <button onClick={clearAll} className="text-zinc-600 hover:text-[#c8ff00] transition-colors"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Limpiar
                  </button>
                )}
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-600 hover:text-zinc-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col">

              {/* ── PRECIO ── */}
              <FilterSection title="Precio" accent="#a855f7">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", color: "#a855f7" }}>
                      {formatMoney(priceRange[0])}
                    </span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", color: "#a855f7" }}>
                      {formatMoney(priceRange[1])}
                    </span>
                  </div>
                  {/* Min */}
                  <div className="flex flex-col gap-1">
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b" }}>
                      Mínimo
                    </label>
                    <input type="range" min={minPrice} max={maxPrice} step={100}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Math.min(+e.target.value, priceRange[1] - 100), priceRange[1]])}
                      className="apex-range w-full accent-purple-500" />
                  </div>
                  {/* Max */}
                  <div className="flex flex-col gap-1">
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b" }}>
                      Máximo
                    </label>
                    <input type="range" min={minPrice} max={maxPrice} step={100}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Math.max(+e.target.value, priceRange[0] + 100)])}
                      className="apex-range w-full accent-purple-500" />
                  </div>

                  {/* Ordenar precio rápido */}
                  <div className="flex gap-1.5 mt-1">
                    {(["price-asc", "price-desc"] as SortKey[]).map((s) => (
                      <button key={s} onClick={() => setSort(s)}
                        className={`flex-1 py-1.5 text-[11px] tracking-widest uppercase transition-all duration-200
                          ${sort === s ? "bg-purple-500 text-white" : "border border-zinc-700 text-zinc-600 hover:border-zinc-500"}`}
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))"
                        }}>
                        {s === "price-asc" ? "Menor ↑" : "Mayor ↓"}
                      </button>
                    ))}
                  </div>
                </div>
              </FilterSection>

              {/* ── CATEGORÍAS ── */}
              <FilterSection title="Categoría">
                {categories.length === 0
                  ? <span className="text-zinc-600" style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>Sin categorías</span>
                  : categories.map((c) => (
                    <FilterCheckbox key={c.id} label={c.categoria}
                      checked={selectedCats.has(c.categoria)}
                      onChange={() => toggleSet(selectedCats, c.categoria, setSelectedCats)}
                      count={catCounts[c.categoria] ?? 0} />
                  ))
                }
              </FilterSection>

              {/* ── MARCAS ── */}
              <FilterSection title="Marca" accent="#a855f7">
                {brands.length === 0
                  ? <span className="text-zinc-600" style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>Sin marcas</span>
                  : brands.map((b) => (
                    <FilterCheckbox key={b.id} label={b.marca}
                      checked={selectedBrands.has(b.marca)}
                      onChange={() => toggleSet(selectedBrands, b.marca, setSelectedBrands)}
                      count={brandCounts[b.marca] ?? 0}
                      accent="#a855f7" />
                  ))
                }
              </FilterSection>
            </div>
          </aside>

          {/* Overlay mobile */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)} />
          )}

          {/* ── GRID ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Chips de filtros activos */}
            {activeFilters > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#52525b" }}>
                  Activos:
                </span>
                {[...selectedCats].map((c) => (
                  <button key={c} onClick={() => toggleSet(selectedCats, c, setSelectedCats)}
                    className="flex items-center gap-1 bg-[#c8ff00]/10 border border-[#c8ff00]/30 text-[#c8ff00] px-2 py-0.5 hover:bg-[#c8ff00]/20 transition-colors"
                    style={{
                      fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em",
                      clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))"
                    }}>
                    {c} <X className="w-2.5 h-2.5" />
                  </button>
                ))}
                {[...selectedBrands].map((b) => (
                  <button key={b} onClick={() => toggleSet(selectedBrands, b, setSelectedBrands)}
                    className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-2 py-0.5 hover:bg-purple-500/20 transition-colors"
                    style={{
                      fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em",
                      clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))"
                    }}>
                    {b} <X className="w-2.5 h-2.5" />
                  </button>
                ))}
                <button onClick={clearAll}
                  className="text-zinc-600 hover:text-zinc-300 transition-colors"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Limpiar todo
                </button>
              </div>
            )}

            {/* Contador */}
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#52525b" }}>
                {filtered.length === 0 ? "Sin resultados" : `${Math.min(visibleCount, filtered.length)} de ${filtered.length} productos`}
              </span>
            </div>

            {/* Grid */}
            {loading ? <LoadingScreen /> : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4 border border-zinc-800/40">
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "5rem", color: "transparent", WebkitTextStroke: "1px rgba(200,255,0,0.15)" }}>
                  VACÍO
                </span>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b" }}>
                  Ningún producto coincide con los filtros.
                </p>
                <button onClick={clearAll}
                  className="border border-zinc-700 text-zinc-500 px-4 py-2 hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-all"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-zinc-800/30">
                  {filtered.slice(0, visibleCount).map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} loaded={loaded}
                      activeCart={cart.activeCart} onOpenCart={cart.openCart} onConfirm={confirmAndAdd}
                      onIncrease={cart.increase} onDecrease={cart.decrease}
                      qty={cart.getQty(product.id)} inCart={!!cart.cartItems[product.id]}
                      onFavorite={handleFavoriteItem} />
                  ))}
                </div>

                {/* Fin de lista */}
                {visibleCount >= filtered.length && filtered.length > 0 && (
                  <div className="flex flex-col items-start gap-1 pt-2 pl-1">
                    <span className="h-px bg-[#c8ff00] w-16 opacity-80" />
                    <span className="h-px bg-[#c8ff00] w-10 opacity-50" />
                    <span className="h-px bg-[#c8ff00] w-5  opacity-25" />
                  </div>
                )}

                {/* Cargar más */}
                {visibleCount < filtered.length && (
                  <div className="flex justify-center pt-4">
                    <button onClick={() => setVisibleCount((v) => v + 12)}
                      className="group flex items-center gap-2 bg-[#c8ff00] text-black px-8 py-3
                                 hover:bg-yellow-300 active:scale-[0.98] transition-all duration-200"
                      style={{
                        fontFamily: "'Space Mono', monospace", fontSize: "11px", fontWeight: 700,
                        letterSpacing: "0.15em", textTransform: "uppercase",
                        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                      }}>
                      Cargar más
                      <span className="transition-transform duration-300 group-hover:translate-y-0.5 inline-block">↓</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        .apex-card { transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease; }
        .apex-card:hover {
          border-color: rgba(200,255,0,0.25);
          box-shadow: 0 0 32px -10px rgba(200,255,0,0.2);
          transform: translateY(-2px);
        }

        .apex-range { height: 2px; background: #27272a; }
        .apex-range::-webkit-slider-thumb { width: 14px; height: 14px; clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
      `}</style>
    </div>
  );
}