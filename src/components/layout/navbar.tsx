"use client";
import Image from "next/image";
import { useState } from "react";
import { Sun, Bell, ShoppingCart, Heart, Search, Menu, X, User } from "lucide-react";
import Link from "next/link";
const navLinks = [
  { label: "Productos", href: "/" },
  { label: "Equipos", href: "/" },
  { label: "Hardware", href: "/" },
  { label: "Mis compras", href: "/" },
  { label: "Arma tu PC", href: "/" },
  { label: "Promociones", href: "/" },
  { label: "Nosotros", href: "/" },
  { label: "Contacto", href: "/" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.svg" alt="MyPcStore" width={32} height={32} />
          <span className="text-white font-bold text-lg tracking-tight">My PC Store</span>
        </a>

        <div className="hidden md:flex relative flex-1 max-w-md mx-6 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-focus-within:text-purple-400 transition-colors duration-300" />
          <input
            type="text"
            placeholder="Busca laptops o equipos..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 
                       focus:outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-purple-500/50 
                       transition-all duration-300 group-focus-within:shadow-[0_0_12px_-3px_#a855f7]"
          />
        </div>

        <div className="flex items-center gap-1">
          {/* Theme */}
          <button className="hidden sm:flex p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200 active:scale-90">
            <Sun className="w-5 h-5" />
          </button>
          {/* Notifications */}
          <button className="hidden sm:flex p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200 active:scale-90 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c8ff00] rounded-full" />
          </button>
          {/* Cart section */}
          <Link href="/cart" className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200 active:scale-90">
            <ShoppingCart className="w-5 h-5" />
          </Link>
          {/* Favorite products */}
          <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200 active:scale-90">
            <Heart className="w-5 h-5" />
          </button>
          {/* User profile */}
          <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200 active:scale-90">
            <User className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200 rounded-none border-0 outline-none"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="hidden lg:flex border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-zinc-400 hover:text-white text-xs uppercase tracking-widest transition-all duration-200 hover:tracking-[0.2em] relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-purple-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-black">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-zinc-400 hover:text-white hover:bg-zinc-900 text-sm py-2.5 px-3 rounded-lg transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
