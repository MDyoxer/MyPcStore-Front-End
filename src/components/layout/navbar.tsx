"use client";
import { useAuth } from "@/src/context/AuthContext";
import { useState } from "react";
import { Sun, Bell, ShoppingCart, Heart, Search, Menu, X, User, Cpu, DoorOpen, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const navLinks = [
  { label: "Productos", href: "/allProducts" },
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, loading, signOutUser } = useAuth();
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      setIsUserMenuOpen(false);
      await signOutUser();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  return (
    <nav className="bg-black border-b border-zinc-800 sticky top-0 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4 justify-between relative">
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="flex items-center justify-center w-9 h-9 bg-[#c8ff00]"
            style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
          >
            <Cpu className="w-5 h-5 text-black" />
          </div>
          <span
            className="text-white group-hover:text-[#c8ff00] transition-colors duration-200"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.1em" }}
          >
            MyPC<span className="text-[#c8ff00]">Store</span>
          </span>
        </Link>

        <div className="hidden md:flex relative flex-1 max-w-md mx-2 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-focus-within:text-purple-400 transition-colors duration-300" />
          <input
            type="text"
            placeholder="Busca laptops o equipos..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 
                       focus:outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-purple-500/50 
                       transition-all duration-300 group-focus-within:shadow-[0_0_12px_-3px_#a855f7]"
          />
        </div>

        <div className="flex items-center gap-4">
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
          <Link href="/favorites" className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200 active:scale-90">
            <Heart className="w-5 h-5" />
          </Link>
          {/* User profile */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsMenuOpen(false);
              }}
              className="p-2 text-zinc-400 hover:text-white  hover:bg-zinc-800 rounded-lg transition-all duration-200 active:scale-90"
            >
              <User className="w-5 h-5" />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-xl py-1.5 shadow-lg shadow-black/50 z-50">
                <ul className="space-y-0.5">
                  <li className="px-3 flex items-center  py-2 text-sm text-white border-b-2" style={{ fontFamily: "var(--font-bebas-neue)", letterSpacing: "0.08em" }}>
                    {loading ? "..." : user ? `Hola ${user.displayName ?? "Cliente"}` : "Hola, Invitado"}
                  </li>
                  {user ? (
                    <>
                      <li className="border border-transparent rounded-lg mt-2 transition-all p-2
                   duration-200 hover:border-[#c8ff00] ">
                        <Link
                          href="/"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center  px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 hover:rounded-sm transition-all duration-200"
                          style={{ fontFamily: "var(--font-bebas-neue)", letterSpacing: "0.08em" }}
                        >
                          Mis compras <Package className="w-4 h-4 ml-auto" />
                        </Link>
                      </li>
                      <li className="border border-transparent rounded-lg p-2 transition-all duration-200 hover:border-[#c8ff00]">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            signOutUser();
                            handleSignOut();
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 hover:rounded-sm text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
                          style={{ fontFamily: "var(--font-bebas-neue)", letterSpacing: "0.08em" }}
                        >
                          Cerrar Sesión
                          <DoorOpen className="w-4 h-4" />
                        </button>
                      </li>
                    </>
                  ) : (
                    <li className="border border-transparent rounded-lg mt-2 transition-all p-2
                   duration-200 hover:border-[#c8ff00] ">
                      <Link
                        href="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center  px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 hover:rounded-sm transition-all duration-200"
                        style={{ fontFamily: "var(--font-bebas-neue)", letterSpacing: "0.08em" }}
                      >
                        Inicia sesión <DoorOpen className="w-4 h-4 ml-auto" />
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

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
              className="text-zinc-400 hover:text-white text-xs uppercase tracking-widest transition-all duration-200 hover:tracking-[0.2em] relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-500 after:transition-all after:duration-300 hover:after:w-full"
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
