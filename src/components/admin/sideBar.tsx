"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Package, PackagePlus, ShoppingBag,
  MessageSquare, TrendingUp, BarChart2, PieChart, Edit,
  Users, Star, Tag, Truck, Settings, ChevronRight,
  Menu, X, Cpu, Bell, Shield,
} from "lucide-react";

// ─── TIPOS ───────────────────────────────────────────────────────────────────
type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
  color?: string;
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

// ─── NAVEGACIÓN ───────────────────────────────────────────────────────────────
const NAV: NavGroup[] = [
  {
    group: "General",
    items: [
      { label: "Dashboard",     href: "/admin",            icon: LayoutDashboard, color: "#c8ff00" },
      { label: "Notificaciones",href: "/admin/notifs",     icon: Bell,            color: "#a855f7", badge: 3 },
    ],
  },
  {
    group: "Catálogo",
    items: [
      { label: "Productos",       href: "/dashboard/products",     icon: Package,     color: "#c8ff00" },
      { label: "Agregar producto", href: "/dashboard/products/newProduct", icon: PackagePlus, color: "#a855f7" },
      { label: "Editar producto",  href: "/dashboard/products/editProduct", icon: Edit,     color: "#c8ff00" },
      { label: "Categorías",      href: "/admin/categories",   icon: Tag,         color: "#c8ff00" },
      { label: "Marcas",          href: "/admin/brands",       icon: Shield,      color: "#a855f7" },
    ],
  },
  {
    group: "Operaciones",
    items: [
      { label: "Pedidos",    href: "/admin/orders",    icon: ShoppingBag, color: "#c8ff00", badge: "new" },
      { label: "Envíos",     href: "/admin/shipping",  icon: Truck,       color: "#a855f7" },
      { label: "Mensajes",   href: "/admin/messages",  icon: MessageSquare, color: "#c8ff00", badge: 5 },
      { label: "Reseñas",    href: "/admin/reviews",   icon: Star,        color: "#a855f7" },
    ],
  },
  {
    group: "Inteligencia",
    items: [
      { label: "Ventas",    href: "/admin/sales",     icon: TrendingUp, color: "#c8ff00" },
      { label: "Métricas",  href: "/admin/metrics",   icon: BarChart2,  color: "#a855f7" },
      { label: "Análisis",  href: "/admin/analytics", icon: PieChart,   color: "#c8ff00" },
      { label: "Clientes",  href: "/admin/customers", icon: Users,      color: "#a855f7" },
    ],
  },
  {
    group: "Sistema",
    items: [
      { label: "Configuración", href: "/admin/settings", icon: Settings, color: "#52525b" },
    ],
  },
];

// ─── NAV ITEM ─────────────────────────────────────────────────────────────────
function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
  const Icon = item.icon;
  const color = item.color ?? "#c8ff00";

  return (
    <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
      <Link
        href={item.href}
        className="relative flex items-center gap-3 px-3 py-2.5 transition-colors duration-200 group overflow-hidden"
        style={{
          background: isActive ? `${color}10` : "transparent",
          borderLeft: isActive ? `2px solid ${color}` : "2px solid transparent",
        }}
      >
        {/* Glow fondo en hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `${color}06` }}
        />

        {/* Ícono */}
        <div
          className="shrink-0 flex items-center justify-center w-7 h-7 relative z-10"
          style={{
            color: isActive ? color : "#52525b",
            transition: "color 0.2s",
          }}
        >
          <Icon className="w-4 h-4 group-hover:text-white transition-colors duration-200"
            style={{ color: isActive ? color : undefined }} />
        </div>

        {/* Label */}
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 whitespace-nowrap overflow-hidden"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: isActive ? color : "#71717a",
              }}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Badge */}
        {item.badge !== undefined && !collapsed && (
          <span
            className="ml-auto relative z-10 px-1.5 py-0.5 shrink-0"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "0.75rem",
              lineHeight: 1,
              color: "#000",
              background: color,
              clipPath: "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))",
            }}
          >
            {item.badge}
          </span>
        )}

        {/* Punto badge collapsed */}
        {item.badge !== undefined && collapsed && (
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: color }}
          />
        )}
      </Link>
    </motion.div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">

      {/* ── LOGO ── */}
      <div className="flex items-center justify-between px-3 py-5 border-b border-zinc-800/60 shrink-0">
        <Link href="/admin" className="flex items-center gap-2 group">
          <div
            className="flex items-center justify-center w-8 h-8 bg-[#c8ff00] shrink-0"
            style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
          >
            <Cpu className="w-4 h-4 text-black" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap group-hover:text-[#c8ff00] transition-colors duration-200"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.1em", color: "#f4f4f5" }}
              >
                MyPC<span style={{ color: "#c8ff00" }}>Store</span>
                <span className="block" style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#52525b", marginTop: "-2px" }}>
                  Panel Admin
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Toggle collapse — solo desktop */}
        <motion.button
          onClick={() => setCollapsed((v) => !v)}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          className="hidden lg:flex items-center justify-center w-6 h-6 text-zinc-600 hover:text-[#c8ff00] transition-colors duration-200 shrink-0"
        >
          <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.div>
        </motion.button>
      </div>

      {/* ── NAV ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-none">
        {NAV.map((group, gi) => (
          <div key={group.group} className={gi > 0 ? "mt-1 pt-1 border-t border-zinc-800/40" : ""}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-4 pt-3 pb-1"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#3f3f46" }}
                >
                  {group.group}
                </motion.p>
              )}
            </AnimatePresence>
            {group.items.map((item) => (
              <NavLink key={item.href} item={item} collapsed={collapsed} />
            ))}
          </div>
        ))}
      </nav>

      {/* ── FOOTER ── */}
      <div className="shrink-0 border-t border-zinc-800/60 p-3">
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-2"
            >
              <div
                className="shrink-0 w-7 h-7 flex items-center justify-center border border-[#c8ff00]/30 bg-[#c8ff00]/08"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "0.75rem",
                  color: "#c8ff00",
                }}
              >
                AD
              </div>
              <div className="flex flex-col">
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#a1a1aa", letterSpacing: "0.05em" }}>
                  Administrador
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.1em", color: "#3f3f46" }}>
                  admin@mypcstore.mx
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <div
                className="w-7 h-7 flex items-center justify-center border border-[#c8ff00]/30"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "0.75rem",
                  color: "#c8ff00",
                }}
              >
                AD
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* ── BOTÓN MOBILE ── */}
      <motion.button
        onClick={() => setMobileOpen(true)}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-9 h-9 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-[#c8ff00] hover:border-[#c8ff00]/40 transition-all duration-200"
        style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
      >
        <Menu className="w-4 h-4" />
      </motion.button>

      {/* ── OVERLAY MOBILE ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR MOBILE ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-60 bg-zinc-950 border-r border-zinc-800/60"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── SIDEBAR DESKTOP ── */}
      <motion.aside
        animate={{ width: collapsed ? 56 : 220 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col h-screen top-0 bg-zinc-950 border-r border-zinc-800/60 overflow-hidden shrink-0 relative"
      >
        {/* Acento neon top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c8ff00]"
          style={{ boxShadow: "0 0 10px #c8ff00" }} />

        {sidebarContent}
      </motion.aside>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}