"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Plus, Minus, Trash2, ShoppingCart, ImageOff, ArrowLeft, Tag } from "lucide-react";
import { GetUserCart, cartItems } from "@/src/actions/cart/get-user-cart";
import { formatMoney } from "@/src/utils/formatMoney";

// ─── SKELETON ────────────────────────────────────────────────────────────────
function CartSkeleton() {
    return (
        <div className="animate-pulse flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 bg-zinc-900 border border-zinc-800/60 h-28" />
            ))}
        </div>
    );
}

// ─── ESTADO VACÍO ────────────────────────────────────────────────────────────
function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
            <span
                style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(5rem, 15vw, 10rem)",
                    lineHeight: 1,
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(200,255,0,0.15)",
                }}
            >
                VACÍO
            </span>
            <p
                className="text-zinc-600"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}
            >
                No tienes productos en tu carrito.
            </p>
            <Link
                href="/allProducts"
                className="inline-flex items-center gap-2 bg-[#c8ff00] text-black px-6 py-3 hover:bg-yellow-300 active:scale-95 transition-all duration-200"
                style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                }}
            >
                Explorar productos →
            </Link>
        </div>
    );
}

// ─── FILA DE ITEM ────────────────────────────────────────────────────────────
function CartRow({
    item,
    onIncrease,
    onDecrease,
    onRemove,
}: {
    item: cartItems;
    onIncrease: (id: number) => void;
    onDecrease: (id: number) => void;
    onRemove: (id: number) => void;
}) {
    return (
        <li
            className="group grid grid-cols-[80px_1fr_auto] sm:grid-cols-[100px_1fr_auto] gap-4 items-center
                 bg-zinc-950 border border-zinc-800/60 p-3 sm:p-4
                 hover:border-zinc-700/60 transition-colors duration-300"
            style={{
                clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
        >
            {/* Imagen */}
            <div className="relative aspect-square bg-zinc-900 overflow-hidden shrink-0">
                {item.imagen ? (
                    <Image
                        src={item.imagen}
                        alt={item.nombre}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="w-5 h-5 text-zinc-700" />
                    </div>
                )}
                {/* Acento esquina */}
                <span
                    aria-hidden
                    className="absolute top-0 right-0 w-[w-2] h-[h-2] bg-[#c8ff00]"
                    style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }}
                />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 min-w-0">
                <p
                    className="text-white leading-tight line-clamp-2"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.05rem", letterSpacing: "0.04em" }}
                >
                    {item.nombre}
                </p>
                <p
                    className="text-[#c8ff00]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.02em" }}
                >
                    {formatMoney(item.precio)}
                </p>
                <p
                    className="text-zinc-400"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase" }}
                >
                    Subtotal: {formatMoney(item.precio * item.cantidad)}
                </p>
            </div>

            {/* Cantidad + eliminar */}
            <div className="flex flex-col items-end gap-2">
                {/* Selector */}
                <div className="flex items-center border border-zinc-700/80 bg-zinc-900">
                    <button
                        onClick={() => onDecrease(item.id)}
                        aria-label="Reducir"
                        className="flex items-center justify-center w-8 h-8 text-zinc-500 hover:text-[#c8ff00] transition-colors"
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <span
                        className="w-8 text-center text-white tabular-nums"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem" }}
                    >
                        {item.cantidad}
                    </span>
                    <button
                        onClick={() => onIncrease(item.id)}
                        aria-label="Aumentar"
                        className="flex items-center justify-center w-8 h-8 text-zinc-500 hover:text-[#c8ff00] transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>

                {/* Eliminar */}
                <button
                    onClick={() => onRemove(item.id)}
                    aria-label="Eliminar producto"
                    className="flex items-center gap-1 text-zinc-500 hover:text-red-500 transition-colors duration-200"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" }}
                >
                    <Trash2 className="w-3 h-3" />
                    Quitar
                </button>
            </div>
        </li>
    );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function Cart() {
    const [items, setItems] = useState<cartItems[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [checkedOut, setCheckedOut] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await GetUserCart();
                setItems(data);
            } catch (e) {
                console.error(e);
            } finally {
                setTimeout(() => setLoaded(true), 80);
            }
        };
        fetch();
    }, []);

    const increase = (id: number) =>
        setItems((prev) => prev.map((i) => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i));

    const decrease = (id: number) =>
        setItems((prev) =>
            prev
                .map((i) => i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i)
                .filter((i) => i.cantidad > 0)
        );

    const remove = (id: number) =>
        setItems((prev) => prev.filter((i) => i.id !== id));

    const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);

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

            <div className="max-w-6xl mx-auto px-4 pt-10 pb-24 relative">

                {/* ── BREADCRUMB ── */}
                <Link
                    href="/allProducts"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#c8ff00] transition-colors duration-200 group mb-10"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase" }}
                >
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                    Seguir comprando
                </Link>

                {/* ── HEADER ── */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div
                            className="flex items-center gap-3 mb-2 text-[#c8ff00]"
                            style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase" }}
                        >
                            <span className="w-8 h-px bg-[#c8ff00]" />
                            Resumen
                        </div>
                        <h1
                            className="text-white leading-none"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "0.03em" }}
                        >
                            TU{" "}
                            <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>
                                CARRITO
                            </span>
                        </h1>
                    </div>

                    {/* Badge total items */}
                    {totalItems > 0 && (
                        <div
                            className="flex items-center gap-2 border border-[#c8ff00]/30 bg-[#c8ff00]/5 px-3 py-2"
                            style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
                        >
                            <ShoppingCart className="w-4 h-4 text-[#c8ff00]" />
                            <span
                                className="text-[#c8ff00]"
                                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", lineHeight: 1 }}
                            >
                                {totalItems}
                            </span>
                            <span
                                className="text-zinc-500"
                                style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase" }}
                            >
                                {totalItems === 1 ? "producto" : "productos"}
                            </span>
                        </div>
                    )}
                </div>

                {/* ── CONTENIDO ── */}
                {!loaded ? (
                    <CartSkeleton />
                ) : items.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

                        {/* Lista de items */}
                        <ul className="flex flex-col gap-2">
                            {items.map((item) => (
                                <CartRow
                                    key={item.id}
                                    item={item}
                                    onIncrease={increase}
                                    onDecrease={decrease}
                                    onRemove={remove}
                                />
                            ))}
                            <div className="flex flex-col items-start gap-1 pt-2 pl-1">
                                <span className="h-px bg-[#c8ff00] w-26 opacity-80" />
                                <span className="h-px bg-[#c8ff00] w-15 opacity-50" />
                                <span className="h-px bg-[#c8ff00] w-5  opacity-25" />
                            </div>
                        </ul>

                        {/* ── PANEL RESUMEN ── */}
                        <aside
                            className="bg-zinc-950 border border-zinc-800/60 p-6 flex flex-col gap-5 sticky top-6"
                            style={{
                                clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
                            }}
                        >
                            {/* Acento esquina */}
                            <span
                                aria-hidden
                                className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#c8ff00]"
                                style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }}
                            />

                            <h2
                                className="text-white"
                                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.06em" }}
                            >
                                Resumen del pedido
                            </h2>

                            <div className="h-px bg-zinc-800" />

                            {/* Desglose */}
                            <div className="flex flex-col gap-3">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-start justify-between gap-3">
                                        <span
                                            className="text-zinc-400 line-clamp-1 flex-1"
                                            style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", letterSpacing: "0.05em" }}
                                        >
                                            {item.nombre}
                                            <span className="text-zinc-700"> ×{item.cantidad}</span>
                                        </span>
                                        <span
                                            className="text-zinc-300 shrink-0"
                                            style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px" }}
                                        >
                                            {formatMoney(item.precio * item.cantidad)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-zinc-800" />

                            {/* Total */}
                            <div className="flex items-baseline justify-between">
                                <span
                                    className="text-zinc-500"
                                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase" }}
                                >
                                    Total
                                </span>
                                <span
                                    className="text-[#c8ff00]"
                                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.02em" }}
                                >
                                    {formatMoney(total)}
                                </span>
                            </div>

                            {/* Nota IVA */}
                            <p
                                className="text-zinc-400 -mt-3"
                                style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "0.1em" }}
                            >
                                IVA incluido en todos los precios.
                            </p>

                            {/* Botón pagar */}
                            <button
                                onClick={() => setCheckedOut(true)}
                                className="w-full flex items-center justify-center gap-2 bg-[#c8ff00] text-black
                           hover:bg-purple-600 active:scale-[0.98] transition-all duration-200 py-4"
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                                    boxShadow: "0 0 24px -6px rgba(200,255,0,0.4)",
                                }}
                            >
                                {checkedOut ? "Procesando..." : "Pagar ahora →"}
                            </button>

                            {/* Seguir comprando */}
                            <Link
                                href="/"
                                className="w-full flex items-center justify-center gap-2 border border-zinc-700 text-zinc-400
                           hover:border-zinc-500 hover:text-zinc-300 transition-all duration-200 py-3"
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: "12px",
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                }}
                            >
                                <Tag className="w-3.5 h-3.5" />
                                Agregar más productos
                            </Link>
                        </aside>
                    </div>
                )}
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      `}</style>
        </div>
    );
}