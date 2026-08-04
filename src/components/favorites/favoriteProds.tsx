"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Heart, Trash2, Search, X, ArrowUpDown, ImageOff, ShoppingCart } from "lucide-react";
import { GetFavItems, favItems } from "@/src/actions/favorites/get-favorites";
import { DeleteFavorite } from "@/src/actions/favorites/delete-favorite";
import { useAuth } from "@/src/context/AuthContext";
import { formatDateTime } from "@/src/utils/formatDateTime";
import { formatMoney } from "@/src/utils/formatMoney";
import { slugify } from "@/src/utils/slugify";
import Loading from "../ui/loading";

type SortKey = "date-desc" | "date-asc" | "name-asc" | "name-desc" | "price-asc" | "price-desc";

// ─── FILA DE FAVORITO ─────────────────────────────────────────────────────────
function FavRow({
  item,
  index,
  loaded,
  onDelete,
  deleting,
}: {
  item: favItems;
  index: number;
  loaded: boolean;
  onDelete: (id: number) => void;
  deleting: number | null;
}) {
  const isDeleting = deleting === item.idProd;

  return (
    <li
      className="group relative flex items-center gap-4 bg-zinc-950 border border-zinc-800/60
                 p-3 sm:p-4 transition-all duration-300
                 hover:border-zinc-700/60"
      style={{
        opacity: loaded ? (isDeleting ? 0.4 : 1) : 0,
        transform: loaded ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.45s ease, transform 0.45s ease, border-color 0.3s`,
        transitionDelay: `${Math.min(index, 10) * 40}ms`,
        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
        pointerEvents: isDeleting ? "none" : "auto",
      }}
    >
      {/* Acento esquina */}
      <span aria-hidden className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#c8ff00]"
        style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />

      {/* Número */}
      <span className="hidden sm:flex shrink-0 w-7 items-center justify-center"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#27272a" }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      {/* TODO: imagen y titulo deben mandar a product id */}
      {/* Imagen */}
        <Link href={`/products/${slugify(item.nombre)}`}>
      <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900 overflow-hidden"
        style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
        {item.imagen ? (
          <Image src={item.imagen} alt={item.nombre} fill className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-5 h-5 text-zinc-700" />
          </div>
        )}
      </div>
        </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b" }}>
          <span>{item.categoria}</span>
          <span className="text-[#c8ff00] opacity-50">✦</span>
          <span>{item.marca}</span>
        </div>

        <Link href={`/products/${slugify(item.nombre)}`}
          className="text-white hover:text-[#c8ff00] transition-colors duration-200 leading-tight line-clamp-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.45rem", letterSpacing: "0.04em" }}>
          {item.nombre}
        </Link>

        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", color: "#3f3f46" }}>
          Agregado: {formatDateTime(item.agregado)}
        </span>
      </div>

      {/* Precio */}
      <span className="hidden sm:block shrink-0"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.02em", color: "#a855f7" }}>
        {formatMoney(item.precio)}
      </span>

      {/* Acciones */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Añadir al carrito — COMENTADO */}
        {/* <button
          className="flex items-center gap-1.5 bg-[#c8ff00] text-black px-3 py-2 hover:bg-yellow-300 active:scale-95 transition-all duration-200"
          style={{
            fontFamily: "'Space Mono', monospace", fontSize: "9px", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
          }}>
          <ShoppingCart className="w-3 h-3" />
          Agregar
        </button> */}

        {/* Eliminar */}
        <button
          onClick={() => onDelete(item.idProd)}
          aria-label="Eliminar de favoritos"
          className="flex items-center justify-center w-8 h-8 border border-zinc-800
                     text-zinc-700 hover:border-red-500/40 hover:text-red-500
                     transition-all duration-200"
          style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}
        >
          {isDeleting
            ? <span className="w-3 h-3 border border-red-500/40 border-t-red-500 rounded-full animate-spin" />
            : <Trash2 className="w-3.5 h-3.5" />
          }
        </button>
      </div>
    </li>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function FavoriteProducts() {
  const [favItems, setFavItems]   = useState<favItems[]>([]);
  const [loading, setLoading]     = useState(true);
  const [loaded, setLoaded]       = useState(false);
  const [search, setSearch]       = useState("");
  const [sort, setSort]           = useState<SortKey>("date-desc");
  const [deleting, setDeleting]   = useState<number | null>(null);
  const { getIdToken }            = useAuth();

  useEffect(() => {
    (async () => {
      const idToken = await getIdToken();
      if (!idToken) { setLoading(false); return; }
      try {
        const items = await GetFavItems(idToken);
        setFavItems(items);
      } catch (e) { console.error(e); }
      finally { setLoading(false); setTimeout(() => setLoaded(true), 80); }
    })();
  }, [getIdToken]);

  const handleDelete = async (idProd: number) => {
    const idToken = await getIdToken();
    if (!idToken) return;
    setDeleting(idProd);
    try {
      await DeleteFavorite(idToken, idProd);
      setTimeout(() => {
        setFavItems((prev) => prev.filter((i) => i.idProd !== idProd));
        setDeleting(null);
      }, 400);
    } catch (e) { console.error(e); setDeleting(null); }
  };

  const filtered = useMemo(() => {
    return favItems
      .filter((i) => {
        const q = search.toLowerCase();
        return !q || i.nombre.toLowerCase().includes(q) || i.marca?.toLowerCase().includes(q) || i.categoria?.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        if (sort === "date-desc") return new Date(b.agregado).getTime() - new Date(a.agregado).getTime();
        if (sort === "date-asc")  return new Date(a.agregado).getTime() - new Date(b.agregado).getTime();
        if (sort === "name-asc")  return a.nombre.localeCompare(b.nombre);
        if (sort === "name-desc") return b.nombre.localeCompare(a.nombre);
        if (sort === "price-asc") return a.precio - b.precio;
        if (sort === "price-desc") return b.precio - a.precio;
        return 0;
      });
  }, [favItems, search, sort]);

  if (loading) return <Loading />;

  return (
    <div className="w-full bg-black min-h-screen relative overflow-hidden">

      {/* Grid fondo */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(200,255,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)",
        }} />

      <div className="max-w-4xl mx-auto px-4 pt-12 pb-24 relative">

        {/* ── HEADER ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3 text-[#c8ff00]"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase" }}>
            <span className="w-8 h-px bg-[#c8ff00]" />
            Lista personal
          </div>

          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 7vw, 5rem)", letterSpacing: "0.02em" }}>
              <span className="text-white">MIS </span>
              <span style={{ color: "transparent", WebkitTextStroke: "1.5px #a855f7" }}>FAVORITOS</span>
            </h1>

            {/* Badge cantidad */}
            {favItems.length > 0 && (
              <div className="flex items-center gap-2 border border-purple-500/30 bg-purple-500/5 px-3 py-1.5 mb-1"
                style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
                <Heart className="w-3.5 h-3.5 text-purple-400" style={{ fill: "#a855f7" }} />
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", lineHeight: 1, color: "#a855f7" }}>
                  {favItems.length}
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b" }}>
                  {favItems.length === 1 ? "producto" : "productos"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── CONTROLES ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-300 pointer-events-none" />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, marca o categoría..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-700
                         pl-9 pr-9 py-2.5 outline-none focus:border-[#c8ff00]/40 transition-colors"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.05em",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-3 w-3 h-3 text-zinc-600 pointer-events-none" />
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-400 pl-8 pr-4 py-2.5
                         outline-none focus:border-zinc-600 transition-colors cursor-pointer appearance-none"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.05em",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
              <option value="date-desc">Más reciente primero</option>
              <option value="date-asc">Más antiguo primero</option>
              <option value="name-asc">Nombre A-Z</option>
              <option value="name-desc">Nombre Z-A</option>
              <option value="price-asc">Precio ↑</option>
              <option value="price-desc">Precio ↓</option>
            </select>
          </div>
        </div>

        {/* Contador */}
        <div className="mb-4" style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3f3f46" }}>
          {filtered.length === 0 && search ? "Sin resultados" : `${filtered.length} ${filtered.length === 1 ? "producto" : "productos"}`}
        </div>

        {/* ── LISTA ── */}
        {favItems.length === 0 ? (
          // Estado vacío
          <div className="flex flex-col items-center justify-center py-32 gap-6 border border-zinc-800/40">
            <Heart className="w-12 h-12 text-zinc-800" />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 10vw, 7rem)", color: "transparent", WebkitTextStroke: "1px rgba(168,85,247,0.15)" }}>
              VACÍO
            </span>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b" }}>
              No tienes productos en favoritos aún.
            </p>
            <Link href="/allProducts"
              className="flex items-center gap-2 bg-[#c8ff00] text-black px-6 py-3 hover:bg-yellow-300 active:scale-95 transition-all duration-200"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
              Explorar productos →
            </Link>
          </div>

        ) : filtered.length === 0 ? (
          // Sin resultados de búsqueda
          <div className="flex flex-col items-center justify-center py-20 gap-4 border border-zinc-800/40">
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4rem", color: "transparent", WebkitTextStroke: "1px rgba(200,255,0,0.15)" }}>
              SIN RESULTADOS
            </span>
            <button onClick={() => setSearch("")}
              className="border border-zinc-700 text-zinc-500 px-4 py-2 hover:border-[#c8ff00]/40 hover:text-[#c8ff00] transition-all"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Limpiar búsqueda
            </button>
          </div>

        ) : (
          <ul className="flex flex-col gap-2">
            {filtered.map((item, i) => (
              <FavRow key={item.idProd} item={item} index={i} loaded={loaded}
                onDelete={handleDelete} deleting={deleting} />
            ))}

            {/* Fin de lista */}
            <div className="flex flex-col items-start gap-1 pt-3 pl-1">
              <span className="h-px bg-[#c8ff00] w-16 opacity-80" />
              <span className="h-px bg-[#c8ff00] w-10 opacity-50" />
              <span className="h-px bg-[#c8ff00] w-5  opacity-25" />
            </div>
          </ul>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      `}</style>
    </div>
  );
}