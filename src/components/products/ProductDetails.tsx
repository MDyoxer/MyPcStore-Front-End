"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  ImageOff,
  Plus,
  Minus,
  ArrowLeft,
  Package,
  Tag,
  Layers,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { GetOneProduct, Product } from "@/src/actions/products/get-one-product";
import { useState, useEffect } from "react";
import { formatMoney } from "@/src/utils/formatMoney";

// ─── BADGE DE STOCK ──────────────────────────────────────────────────────────
function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span
        className="inline-flex items-center gap-1.5 border border-red-500/30 bg-red-500/5 text-red-400 px-3 py-1"
        style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}
      >
        <XCircle className="w-3 h-3" />
        Sin existencias
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span
        className="inline-flex items-center gap-1.5 border border-yellow-500/30 bg-yellow-500/5 text-yellow-400 px-3 py-1"
        style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}
      >
        <Package className="w-3 h-3" />
        Últimas {stock} unidades
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 border border-[#c8ff00]/30 bg-[#c8ff00]/5 text-[#c8ff00] px-3 py-1"
      style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}
    >
      <CheckCircle2 className="w-3 h-3" />
      En existencia — {stock} uds.
    </span>
  );
}

// ─── CANTIDAD ────────────────────────────────────────────────────────────────
function QuantitySelector({
  qty,
  onIncrease,
  onDecrease,
  max,
}: {
  qty: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max: number;
}) {
  return (
    <div className="flex items-center border border-zinc-700/80 bg-zinc-900/80 w-fit">
      <button
        onClick={onDecrease}
        disabled={qty <= 1}
        aria-label="Reducir cantidad"
        className="flex items-center justify-center w-10 h-10 text-zinc-500 hover:text-[#c8ff00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span
        className="w-12 text-center text-white tabular-nums"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem" }}
      >
        {qty}
      </span>
      <button
        onClick={onIncrease}
        disabled={qty >= max}
        aria-label="Aumentar cantidad"
        className="flex items-center justify-center w-10 h-10 text-zinc-500 hover:text-[#c8ff00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── SKELETON LOADER ─────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="w-full bg-black min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-4 w-32 bg-zinc-800 mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="aspect-square bg-zinc-900" />
          <div className="p-10 flex flex-col gap-6">
            <div className="h-3 w-24 bg-zinc-800" />
            <div className="h-16 w-3/4 bg-zinc-800" />
            <div className="h-12 w-1/3 bg-zinc-800" />
            <div className="h-10 w-full bg-zinc-800" />
            <div className="h-10 w-full bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PLACEHOLDER DE RELACIONADOS ─────────────────────────────────────────────
function RelatedProducts() {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-20">
      {/* Divisor */}
      <div className="flex items-center gap-4 mb-10">
        <span className="w-8 h-px bg-[#c8ff00]" />
        <span
          className="text-[#c8ff00]"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", letterSpacing: "0.35em", textTransform: "uppercase" }}
        >
          También te puede interesar
        </span>
        <span className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Grid de placeholders */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-zinc-800/30">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-zinc-950 flex flex-col items-center justify-center gap-3 aspect-4/3 text-zinc-800 border border-transparent hover:border-zinc-700/40 transition-colors"
            style={{
              opacity: 1 - i * 0.15,
              clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
          >
            <Layers className="w-6 h-6" />
            <span
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}
            >
              Próximamente
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function ProductDetails({ id }: { id: number }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await GetOneProduct(id);
      setProduct(data);
      setTimeout(() => setLoaded(true), 80);
    };
    load();
  }, [id]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!loaded || !product) return <Skeleton />;

  const outOfStock = product.stock === 0;

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

      {/* ── BREADCRUMB ── */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#c8ff00] transition-colors duration-200 group"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "13fpx", letterSpacing: "0.2em", textTransform: "uppercase" }}
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          Volver al catálogo
        </Link>
      </div>

      {/* ── LAYOUT PRINCIPAL: imagen | info ── */}
      <div
        className="max-w-7xl mx-auto px-4 pt-8 pb-16"
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-800/40">

          {/* ── COLUMNA IMAGEN ── */}
          <div className="relative bg-zinc-950 overflow-hidden group">
            {product.imagen ? (
              <>
                <Image
                  src={product.imagen}
                  alt={product.nombre}
                  width={400}
                  height={400}
                  className="w-full h-full object-contain aspect-square transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                />
                {/* Overlay scanline */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(200,255,0,0.015) 3px, rgba(200,255,0,0.015) 4px)",
                  }}
                />
              </>
            ) : (
              <div className="aspect-square w-full flex flex-col items-center justify-center gap-4 text-zinc-700">
                <ImageOff className="w-12 h-12" />
                <span
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase" }}
                >
                  Sin imagen disponible
                </span>
              </div>
            )}

            {/* Acento esquina */}
            <span
              aria-hidden
              className="absolute top-0 right-0 w-5 h-5 bg-[#c8ff00]"
              style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }}
            />
            {/* Línea inferior neon en hover */}
            <div
              aria-hidden
              className="absolute bottom-0 left-0 h-0.5 bg-[#c8ff00] w-0 group-hover:w-full transition-all duration-700 ease-out"
              style={{ boxShadow: "0 0 8px #c8ff00" }}
            />
          </div>

          {/* ── COLUMNA INFO ── */}
          <div className="bg-zinc-950 flex flex-col justify-between p-8 lg:p-12 gap-8">

            {/* Parte superior: meta + nombre + precio */}
            <div className="flex flex-col gap-5">

              {/* Categoría / Marca */}
              <div
                className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-400"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "16px", letterSpacing: "0.25em", textTransform: "uppercase" }}
              >
                {product.categoria && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-2.5 h-2.5" />
                      {product.categoria}
                    </span>
                    <span className="text-[#c8ff00] opacity-40">✦</span>
                  </>
                )}
                {product.marca && (
                  <span>{product.marca}</span>
                )}
              </div>

              {/* Nombre del producto */}
              <h1
                className="text-white leading-none"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
                  letterSpacing: "0.03em",
                  lineHeight: 0.95,
                }}
              >
                {product.nombre}
              </h1>

              {/* Precio */}
              <div className="flex items-baseline gap-4">
                <span
                  className="text-[#c8ff00]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "0.02em" }}
                >
                  {formatMoney(product.precio)}
                </span>
                <span
                  className="text-zinc-400"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: "16px", letterSpacing: "0.2em", textTransform: "uppercase" }}
                >
                  IVA incluido
                </span>
              </div>

              {/* Stock */}
              <StockBadge stock={product.stock} />
            </div>

            {/* Separador */}
            <div className="h-px bg-zinc-800/80" />

            {/* Parte inferior: cantidad + acciones */}
            <div className="flex flex-col gap-5">

              {/* Label cantidad */}
              <div
                className="text-zinc-400"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", letterSpacing: "0.25em", textTransform: "uppercase" }}
              >
                Cantidad
              </div>

              <QuantitySelector
                qty={qty}
                onIncrease={() => setQty((q) => Math.min(q + 1, product.stock))}
                onDecrease={() => setQty((q) => Math.max(q - 1, 1))}
                max={product.stock}
              />

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3 mt-1">

                {/* Comprar ahora */}
                <button
                  disabled={outOfStock}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#c8ff00] text-black
                             disabled:opacity-30 disabled:cursor-not-allowed
                             hover:bg-yellow-300 active:scale-[0.98]
                             transition-all duration-200"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "14px 24px",
                    clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                    boxShadow: outOfStock ? "none" : "0 0 24px -6px rgba(200,255,0,0.5)",
                  }}
                >
                  Comprar ahora →
                </button>

                {/* Agregar al carrito */}
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 border
                              disabled:opacity-30 disabled:cursor-not-allowed
                              active:scale-[0.98] transition-all duration-300
                              ${addedToCart
                                ? "border-[#c8ff00] text-[#c8ff00] bg-[#c8ff00]/5"
                                : "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white bg-transparent"
                              }`}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "14px 24px",
                  }}
                >
                  {addedToCart ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#c8ff00] inline-block" />
                      Agregado
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Al carrito
                    </>
                  )}
                </button>
              </div>

              {/* Nota de stock numérico */}
              {!outOfStock && (
                <p
                  className="text-zinc-400"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", letterSpacing: "0.1em" }}
                >
                  {product.stock <= 5
                    ? `⚠ Solo quedan ${product.stock} unidades disponibles.`
                    : `Stock disponible: ${product.stock} unidades.`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── DESCRIPCIÓN ── */}
        <div className="border border-t-0 border-zinc-800/40 bg-zinc-950">
          <div className="flex items-center gap-4 px-8 lg:px-12 pt-8 pb-6 border-b border-zinc-800/40">
            <span className="w-6 h-px bg-[#c8ff00]" />
            <h2
              className="text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.08em" }}
            >
              Descripción
            </h2>
          </div>

          <div className="px-8 lg:px-12 py-8">
            {product.descripcion ? (
              <p
                className="text-zinc-400 max-w-3xl leading-relaxed"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", lineHeight: "1.9", letterSpacing: "0.02em" }}
              >
                {product.descripcion}
              </p>
            ) : (
              <p
                className="text-zinc-700"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                Sin descripción disponible.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── PRODUCTOS RELACIONADOS ── */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-zinc-800/60 mb-16" />
      </div>
      <RelatedProducts />

      {/* Fuentes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      `}</style>
    </div>
  );
}