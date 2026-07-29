"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, ImageOff, Check, Plus, Minus, SlidersHorizontal, Search, X } from "lucide-react"
import { GetProducts, Products } from "@/src/actions/products/get-all-products"
import { useState, useEffect, useCallback, useRef } from "react"
import { formatMoney } from "@/src/utils/FormatMoney"

// ─── TIPOS ───────────────────────────────────────────────────────────────────
type SortKey = "default" | "price-asc" | "price-desc" | "name"

// ─── HOOK: carrito por producto ───────────────────────────────────────────────
function useProductCart() {
  const [activeCart, setActiveCart] = useState<number | null>(null)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [cartItems, setCartItems] = useState<Record<number, boolean>>({})

  const getQty = useCallback((id: number) => quantities[id] ?? 1, [quantities])

  const increase = (id: number) =>
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] ?? 1) + 1 }))

  const decrease = (id: number) =>
    setQuantities((prev) => {
      const next = (prev[id] ?? 1) - 1
      if (next <= 0) {
        setActiveCart(null)
        setCartItems((c) => ({ ...c, [id]: false }))
        return { ...prev, [id]: 1 }
      }
      return { ...prev, [id]: next }
    })

  const confirm = (id: number) => {
    setCartItems((c) => ({ ...c, [id]: true }))
    setActiveCart(null)
  }

  const openCart = (id: number) => {
    setActiveCart(id)
  }

  return { activeCart, openCart, confirm, getQty, increase, decrease, cartItems }
}

// ─── COMPONENTE CARD ──────────────────────────────────────────────────────────
function ProductCard({
  product,
  index,
  loaded,
  activeCart,
  onOpenCart,
  onConfirm,
  onIncrease,
  onDecrease,
  qty,
  inCart,
}: {
  product: Products
  index: number
  loaded: boolean
  activeCart: number | null
  onOpenCart: (id: number) => void
  onConfirm: (id: number) => void
  onIncrease: (id: number) => void
  onDecrease: (id: number) => void
  qty: number
  inCart: boolean
}) {
  const isActive = activeCart === product.id

  return (
    <article
      className="apex-card group relative flex flex-col bg-zinc-950 border border-zinc-800/60 overflow-hidden"
      style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.55s ease, transform 0.55s ease`,
        transitionDelay: `${index * 55}ms`,
        clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
      }}
    >
      {/* TODO: FUTURISTIC LOADING ANIMATION */}
      {/* Neon corner accent */}
      <span
        aria-hidden
        className="absolute top-0 right-0 w-[14px] h-[14px] bg-[#c8ff00] z-10"
        style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }}
      />

      {/* "En carrito" indicator */}
      {inCart && (
        <span className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-[#c8ff00] text-black px-2 py-0.5"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          <Check className="w-2.5 h-2.5" /> En carrito
        </span>
      )}

      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
        {product.imagen ? (
          <Link href={`/products/${product.id}`}>
            <Image
              src={product.imagen}
              alt={product.nombre}
              width={400}
              height={300}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageOff className="w-7 h-7 text-zinc-700" />
            <span
              className="text-zinc-600 text-center leading-relaxed px-4"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}
            >
              Sin imagen<br />disponible
            </span>
          </div>
        )}

        {/* Overlay scanline on hover */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200,255,0,0.02) 2px, rgba(200,255,0,0.02) 4px)",
          }}
        />

        {/* Bottom neon line reveal */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 h-[2px] bg-[#c8ff00] w-0 group-hover:w-full transition-all duration-500 ease-out"
          style={{ boxShadow: "0 0 8px #c8ff00" }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {/* Categoría / Marca */}
        <div
          className="flex items-center gap-2 text-zinc-600"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}
        >
          <span>{product.categoria}</span>
          <span className="text-[#c8ff00] opacity-60">✦</span>
          <span>{product.marca}</span>
        </div>

        {/* Nombre */}
        <h3
          className="text-white leading-tight line-clamp-2 group-hover:text-[#c8ff00] transition-colors duration-300"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.04em" }}
        >
          <Link href={`/products/${product.id}`}>
            {product.nombre}
          </Link>
        </h3>

        {/* Precio + Botón */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800/50">
          <span
            className="text-[#c8ff00]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.02em" }}
          >
            {formatMoney(product.precio)}
          </span>

          {/* Cart toggle */}
          <div className="relative h-9 w-[130px]">
            {/* Botón agregar */}
            <button
              onClick={() => onOpenCart(product.id)}
              aria-label="Agregar al carrito"
              className={`absolute inset-0 flex items-center justify-center gap-1.5
                          bg-[#c8ff00] text-black
                          transition-all duration-300 active:scale-95
                          ${isActive ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                boxShadow: "0 0 16px -4px rgba(200,255,0,0.5)",
              }}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Agregar
            </button>

            {/* Selector de cantidad */}
            <div
              className={`absolute inset-0 flex items-center justify-between border border-zinc-700/80 bg-zinc-900/90 px-2
                          transition-all duration-300
                          ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            >
              {/* Confirmar */}
              <button
                onClick={() => onConfirm(product.id)}
                aria-label="Confirmar"
                className="flex items-center justify-center w-6 h-6 bg-[#c8ff00] hover:bg-yellow-300 transition-colors"
              >
                <Check className="w-3.5 h-3.5 text-black" />
              </button>

              <span className="w-px h-5 bg-zinc-700" />

              <button
                onClick={() => onIncrease(product.id)}
                aria-label="Aumentar"
                className="flex items-center justify-center w-6 h-6 text-zinc-400 hover:text-[#c8ff00] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              <span
                className="w-6 text-center text-white tabular-nums"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
              >
                {qty}
              </span>

              <button
                onClick={() => onDecrease(product.id)}
                aria-label="Disminuir"
                className="flex items-center justify-center w-6 h-6 text-zinc-400 hover:text-[#c8ff00] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function TopProducts() {
  const [products, setProducts] = useState<Products[]>([])
  const [loaded, setLoaded] = useState(false)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortKey>("default")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [visibleCount, setVisibleCount] = useState(8)
  const searchRef = useRef<HTMLInputElement>(null)

  const cart = useProductCart()

  useEffect(() => {
    const load = async () => {
      const data = await GetProducts()
      setProducts(data)
      setTimeout(() => setLoaded(true), 80)
    }
    load()
  }, [])

  // Categorías únicas
  const categories = ["all", ...Array.from(new Set(products.map((p) => p.categoria).filter(Boolean)))]

  // Filtros + sort
  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.marca?.toLowerCase().includes(q) ||
        p.categoria?.toLowerCase().includes(q)
      const matchCat = selectedCategory === "all" || p.categoria === selectedCategory
      return matchSearch && matchCat
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.precio - b.precio
      if (sort === "price-desc") return b.precio - a.precio
      if (sort === "name") return a.nombre.localeCompare(b.nombre)
      return 0
    })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length
  const totalInCart = Object.values(cart.cartItems).filter(Boolean).length

  return (
    <section className="w-full bg-black py-16 relative overflow-hidden">

      {/* Fondo de grid sutil */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,255,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 80%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 relative">

        {/* ── HEADER ── */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-end justify-between">
            <div>
              {/* Eyebrow */}
              <div
                className="flex items-center gap-3 mb-2 text-[#c8ff00]"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase" }}
              >
                <span className="w-8 h-px bg-[#c8ff00]" />
                Catálogo
              </div>
              {/* Título */}
              <h2
                className="text-white leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.03em" }}
              >
                PRODUCTOS{" "}
                <span
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1.5px #c8ff00",
                  }}
                >
                  DESTACADOS
                </span>
              </h2>
            </div>

            {/* Cart badge + filtros toggle */}
            <div className="flex items-center gap-3">
              {totalInCart > 0 && (
                <div
                  className="flex items-center gap-2 border border-[#c8ff00]/30 bg-[#c8ff00]/5 px-3 py-1.5"
                  style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-[#c8ff00]" />
                  <span
                    className="text-[#c8ff00]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", lineHeight: 1 }}
                  >
                    {totalInCart}
                  </span>
                  <span
                    className="text-zinc-500"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase" }}
                  >
                    items
                  </span>
                </div>
              )}

              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-2 border px-3 py-2 transition-colors duration-200
                  ${showFilters ? "border-[#c8ff00] text-[#c8ff00] bg-[#c8ff00]/5" : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"}`}
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filtros
              </button>
            </div>
          </div>

          {/* ── PANEL DE FILTROS ── */}
          <div
            className="overflow-hidden transition-all duration-500 ease-out"
            style={{ maxHeight: showFilters ? "200px" : "0px", opacity: showFilters ? 1 : 0 }}
          >
            <div className="border border-zinc-800/80 bg-zinc-950/80 p-4 flex flex-col gap-4">

              {/* Búsqueda */}
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setVisibleCount(8) }}
                  placeholder="Buscar por nombre, marca o categoría..."
                  className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600
                             pl-9 pr-9 py-2.5 outline-none focus:border-[#c8ff00]/40 transition-colors"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.05em" }}
                />
                {search && (
                  <button
                    onClick={() => { setSearch(""); searchRef.current?.focus() }}
                    className="absolute right-3 text-zinc-600 hover:text-zinc-300 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Categorías + Sort */}
              <div className="flex flex-wrap gap-3 items-center justify-between">
                {/* Chips de categoría */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setVisibleCount(8) }}
                      className={`px-3 py-1 text-[9px] tracking-widest uppercase transition-all duration-200
                        ${selectedCategory === cat
                          ? "bg-[#c8ff00] text-black"
                          : "border border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                        }`}
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        clipPath: selectedCategory === cat
                          ? "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))"
                          : "none",
                      }}
                    >
                      {cat === "all" ? "Todos" : cat}
                    </button>
                  ))}
                </div>

                {/* Ordenar */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="bg-zinc-900 border border-zinc-700 text-zinc-300 px-3 py-1.5 outline-none
                             focus:border-zinc-500 transition-colors cursor-pointer"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.1em" }}
                >
                  <option value="default">Relevancia</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contador de resultados */}
          <div
            className="text-zinc-600"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" }}
          >
            {filtered.length === 0
              ? "Sin resultados"
              : `Mostrando ${Math.min(visibleCount, filtered.length)} de ${filtered.length} productos`}
          </div>
        </div>

        {/* ── GRID DE PRODUCTOS ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 border border-zinc-800/50">
            <span
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4rem", color: "transparent", WebkitTextStroke: "1px rgba(200,255,0,0.2)" }}
            >
              VACÍO
            </span>
            <p
              className="text-zinc-600"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em" }}
            >
              No hay productos que coincidan con tu búsqueda.
            </p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("all") }}
              className="mt-2 border border-zinc-700 text-zinc-400 px-4 py-2 hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-all"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800/30">
            {visible.map((product, i) => (

              <ProductCard
                key={product.id}
                product={product}
                index={i}
                loaded={loaded}
                activeCart={cart.activeCart}
                onOpenCart={cart.openCart}
                onConfirm={cart.confirm}
                onIncrease={cart.increase}
                onDecrease={cart.decrease}
                qty={cart.getQty(product.id)}
                inCart={!!cart.cartItems[product.id]}
              />
            ))}
          </div>

        )}

        {/* ── FOOTER: Ver más + Link ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-zinc-800/50">
          {hasMore && (
            <button
              onClick={() => setVisibleCount((v) => v + 8)}
              className="group flex items-center gap-2 bg-[#c8ff00] text-black px-6 py-3
                         hover:bg-yellow-300 transition-colors duration-200 active:scale-95"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
              }}
            >
              Cargar más
              <span className="transition-transform duration-300 group-hover:translate-y-0.5 inline-block">↓</span>
            </button>
          )}

          <Link
            href="/productos"
            className="group inline-flex items-center gap-2 border border-zinc-700 text-zinc-400 px-6 py-3
                       hover:border-[#c8ff00]/50 hover:text-[#c8ff00] transition-all duration-300 ml-auto"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            Ver catálogo completo
            <span className="transition-transform duration-300 group-hover:translate-x-1 inline-block">→</span>
          </Link>
        </div>
      </div>

      {/* Fuentes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        .apex-card {
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .apex-card:hover {
          border-color: rgba(200, 255, 0, 0.25);
          box-shadow: 0 0 32px -10px rgba(200, 255, 0, 0.2);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  )
}