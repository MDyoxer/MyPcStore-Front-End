"use client"

import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, ImageOff, Check, Plus, Minus,  Heart } from "lucide-react"
import { GetProducts, Products } from "@/src/actions/products/get-all-products"
import { useState, useEffect, useCallback } from "react"
import { formatMoney } from "@/src/utils/formatMoney"
import { slugify } from "@/src/utils/slugify"
import { useProductAction } from "@/src/hooks/useProductAction"
import { FireParticles } from "../ui/three/fire-animation"
// ─── HOOK: carrito por producto ───────────────────────────────────────────────
function useProductCart() {
  const [activeCart, setActiveCart] = useState<number | null>(null)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [cartItems, setCartItems] = useState<Record<number, boolean>>({})
  const getQty = useCallback((id: number) => quantities[id] ?? 1, [quantities])

  const increase = useCallback((id: number, maxStock: number) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min((prev[id] ?? 1) + 1, maxStock),
    })),
    [])

  const decrease = useCallback((id: number) =>
    setQuantities((prev) => {
      const next = (prev[id] ?? 1) - 1
      if (next <= 0) {
        setActiveCart(null)
        setCartItems((c) => ({ ...c, [id]: false }))
        return { ...prev, [id]: 1 }
      }
      return { ...prev, [id]: next }
    }),
    [])

  const confirm = useCallback((id: number) => {
    setCartItems((c) => ({ ...c, [id]: true }))
    setActiveCart(null)
  }, [])

  const openCart = useCallback((id: number) => {
    setActiveCart(id)
  }, [])

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
  onFavorite,
  qty,
  inCart,
}: {
  product: Products
  index: number
  loaded: boolean
  activeCart: number | null
  onOpenCart: (id: number) => void
  onConfirm: (id: number) => void
  onIncrease: (id: number, maxStock: number) => void
  onDecrease: (id: number) => void
  onFavorite: (id: number) => void
  qty: number
  inCart: boolean
}) {
  const isActive = activeCart === product.id
  const [liked, setLiked] = useState(false)
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.55, delay: index * 0.055, ease: [0.16, 1, 0.3, 1] }}
      className="apex-card group relative flex flex-col bg-zinc-950 border border-zinc-800/60 overflow-hidden"
      style={{
        clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
      }}
    >
      {/* Neon corner accent */}
      <span
        aria-hidden
        className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#c8ff00] z-10"
        style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }}
      />

      {/* "En carrito" indicator */}
      {inCart && (
        <span className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-[#00ffff91] text-black px-2 py-0.5"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          <Check className="w-2.5 h-2.5" /> En carrito
        </span>
      )}

      {/* Imagen */}
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-900">
        {product.imagen ? (
          <Link href={`/products/${slugify(product.nombre)}`}>
            <Image
              src={product.imagen}
              alt={product.nombre}
              width={400}
              height={300}
              className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
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
          className="absolute bottom-0 left-0 h-0.5 bg-[#c8ff00] w-0 group-hover:w-full transition-all duration-500 ease-out"
          style={{ boxShadow: "0 0 8px #c8ff00" }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {/* Categoría / Marca */}
        <div
          className="flex items-center gap-2 text-zinc-600"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase" }}
        >
          <span>{product.categoria}</span>
          <span className="text-[#c8ff00] opacity-60">✦</span>
          <span>{product.marca}</span>
        </div>

        {/* Nombre */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-white leading-tight line-clamp-2  transition-colors duration-300"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.04em" }}
          >
            <Link href={`/products/${slugify(product.nombre)}`}>
              {product.nombre}
            </Link>
          </h3>
          <button
            onClick={() => {
              setLiked((v) => !v);
              onFavorite(product.id);
            }}
            aria-label={liked ? "Quitar de favoritos" : "Agregar a favoritos"}
            className="shrink-0 mt-0.5 transition-transform duration-200 active:scale-90"
          >
            <Heart
              className="w-4.5 h-4.5 transition-colors duration-200"
              style={{
                fill: liked ? "#a855f7" : "transparent",
                stroke: liked ? "#a855f7" : "#52525b",
                strokeWidth: 1.8,
              }}
            />
          </button>
        </div>

        {/* Precio + Botón */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800/50">
          <span
            className="text-[#9e00c6]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.02em" }}
          >
            {formatMoney(product.precio)}
          </span>

          {/* Cart toggle */}
          <div className="relative h-9 w-32.5">
            {/* Botón agregar */}
            <button
              onClick={() => onOpenCart(product.id)}
              aria-label="Agregar al carrito"
              className={`absolute inset-0 flex items-center justify-center gap-1.5
                          bg-[#c8ff00] text-black hover:bg-purple-700
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
                onClick={() => onIncrease(product.id, product.stock)}
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
    </motion.article>
  )
}

// ─── CONTADOR SEMANAL ────────────────────────────────────────────────────────
function WeeklyCountdown() {
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })

  useEffect(() => {
    const calcular = () => {
      const ahora = new Date()
      // Próximo lunes 00:00:00
      const proximoLunes = new Date(ahora)
      const dia = ahora.getDay() // 0 domingo, 1 lunes...
      const diasHastaLunes = dia === 0 ? 1 : 8 - dia
      proximoLunes.setDate(ahora.getDate() + diasHastaLunes)
      proximoLunes.setHours(0, 0, 0, 0)

      const diff = proximoLunes.getTime() - ahora.getTime()
      setTimeLeft({
        dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((diff / (1000 * 60)) % 60),
        segundos: Math.floor((diff / 1000) % 60),
      })
    }

    calcular()
    const interval = setInterval(calcular, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, "0")

 return (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="relative flex flex-col items-center gap-2 px-2 py-4 sm:px-10" 
  >
    {/* FUEGO */}
    <FireParticles />

    {/* Glow rojo de fondo */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at 50% 100%, rgba(239,68,68,0.12) 0%, transparent 70%)",
        filter: "blur(8px)",
      }}
    />

    {/* resto del contenido igual... */}
    <span
      style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(11px, 3.5vw, 15px)", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444" }}
    >
      ⚡ Ofertas terminan en ⚡
    </span>

    <div className="flex items-center gap-1.5 sm:gap-2">
      {[
        { val: timeLeft.dias,     label: "." },
        { val: timeLeft.horas,    label: "-"  },
        { val: timeLeft.minutos,  label: "_"  },
        { val: timeLeft.segundos, label: ","  },
      ].map(({ val, label }, i) => (
        <div key={label} className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex flex-col items-center">
            <span
              className="border border-red-500/40 bg-red-500/08 px-2 sm:px-4 py-1.5 tabular-nums"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(1.75rem, 6vw, 4rem)",
                lineHeight: 1,
                color: "#ef4444",
                boxShadow: "0 0 12px -4px rgba(239,68,68,0.4)",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              }}
            >
              {pad(val)}
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7f1d1d", marginTop: "4px" }}>
              {label}
            </span>
          </div>
          {i < 3 && (
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.1rem, 3vw, 2.5rem)", color: "#ef4444", opacity: 0.5, marginBottom: "16px" }}>:</span>
          )}
        </div>
      ))}
    </div>
  </motion.div>
)
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function TopProducts({ onLoaded }: { onLoaded?: () => void }) {
  const [products, setProducts] = useState<Products[]>([])
  const [loading, setLoading] = useState(true)
  const cart = useProductCart()
  const { handleFavoriteItem, confirmAndAdd } = useProductAction({
    onConfirmCart: cart.confirm,
    getQuantity: cart.getQty,
  })


  useEffect(() => {
    const load = async () => {
      const [data] = await Promise.all([
        GetProducts(),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ])
      setProducts(data)
      setLoading(false)
      onLoaded?.()
    }
    load()
  }, [onLoaded])





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
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>
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


            </div>
          </div>

          {/* ── COUNTDOWN SEMANAL (centrado en la página) ── */}
          <div className="flex justify-center">
            <WeeklyCountdown />
          </div>

          {/* Contador de resultados */}
        </div>

        {/* ── GRID DE PRODUCTOS ── */}
        {!loading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 border border-zinc-800/50">
            <span
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3.5rem, 12vw, 5rem)", color: "transparent", WebkitTextStroke: "1px rgba(200,255,0,0.2)" }}
            >
              VACÍO
            </span>
            <p
              className="text-zinc-600"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em" }}
            >
              No hay productos disponibles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800/30">
            {products.slice(0, 8).map((product, i) => (

              <ProductCard
                key={product.id}
                product={product}
                index={i}
                loaded={!loading}
                activeCart={cart.activeCart}
                onOpenCart={cart.openCart}
                onConfirm={confirmAndAdd}
                onFavorite={handleFavoriteItem}
                onIncrease={cart.increase}
                onDecrease={cart.decrease}
                qty={cart.getQty(product.id)}
                inCart={!!cart.cartItems[product.id]}
              />
            ))}
          </div>

        )}

        {/* ── FOOTER: Link ── */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-10 pt-8 border-t border-zinc-800/50">
          <Link
            href="/allProducts"
            className="group inline-flex items-center gap-2 border border-zinc-700 text-zinc-400 px-6 py-3
                       hover:border-[#c8ff00]/50 hover:text-[#c8ff00] transition-all duration-300"
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