"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Cpu, User } from "lucide-react";
import { handleGoogleSignIn } from "@/src/utils/googleAuth";
import { useRouter } from "next/navigation";
import { handleSignUp } from "@/src/utils/emailAuth";
import GoogleLinkPrompt from "./GoogleLinkPrompt";
import type { AuthCredential } from "firebase/auth";
export default function SignIn() {
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState("");
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [linkPrompt, setLinkPrompt] = useState<{ email: string; credential: AuthCredential } | null>(null);

    const handleSubmitByEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.trim() === "" || password2.trim() === "") {
            setError("La contraseña no puede estar vacía");
            return;
        }
        if (password !== password2) {
            setError("Las contraseñas no coinciden");
            return;
        }
        setLoading(true);
        setError(null);
        const result = await handleSignUp(email, password, nombre);
        setLoading(false);
        if (result.error) {
            setError(result.error);
            return;
        }
        router.push("/");
    };

    const handleGoogleClick = async () => {
        setError(null);
        const result = await handleGoogleSignIn();
        if (result.error) {
            if (result.error.code === "account-exists-with-different-credential") {
                if (result.error.email && result.error.credential) {
                    setLinkPrompt({ email: result.error.email, credential: result.error.credential });
                } else {
                    setError("Este correo ya está registrado con contraseña. Inicia sesión con tu correo y contraseña.");
                }
            } else {
                setError("No se pudo iniciar sesión con Google. Intenta de nuevo.");
            }
            return;
        }
        router.push("/");
    };

    return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden px-4">

            {/* ── FONDO GRID ── */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(200,255,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.025) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Orb morado izquierda */}
            <div
                aria-hidden
                className="absolute -left-40 top-1/2 -translate-y-1/2 w-125 h-125 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)" }}
            />
            {/* Orb neon derecha */}
            <div
                aria-hidden
                className="absolute -right-40 top-1/2 -translate-y-1/2 w-125 h-125 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(200,255,0,0.07) 0%, transparent 70%)" }}
            />

            {/* ── CARD ── */}
            <div
                className="relative w-full max-w-md bg-zinc-950 border border-zinc-800/70 p-8 sm:p-10 flex flex-col gap-8"
                style={{
                    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                }}
            >
                {/* Acento esquina */}
                <span
                    aria-hidden
                    className="absolute top-0 right-0 w-5 h-5 bg-[#c8ff00]"
                    style={{ clipPath: "polygon(0 0, 100% 100%, 100% 0)" }}
                />
                <span
                    aria-hidden
                    className="absolute bottom-0 left-0 w-5 h-5 bg-purple-500"
                    style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
                />

                {/* ── HEADER ── */}
                <div className="flex flex-col gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 w-fit group">
                        <div
                            className="flex items-center justify-center w-8 h-8 bg-[#c8ff00]"
                            style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
                        >
                            <Cpu className="w-4 h-4 text-black" />
                        </div>
                        <span
                            className="text-white group-hover:text-[#c8ff00] transition-colors duration-200"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.1em" }}
                        >
                            MyPC<span className="text-[#c8ff00]">Store</span>
                        </span>
                    </Link>

                    {/* Título */}
                    <div>
                        <h1
                            className="text-white leading-none"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.2rem, 6vw, 3rem)", letterSpacing: "0.03em" }}
                        >
                            UNETE A NUESTRA{" "}
                            <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>
                                COMUNIDAD
                            </span>
                        </h1>
                    </div>
                </div>

                {/* ── FORM ── */}
                <form onSubmit={handleSubmitByEmail} className="flex flex-col gap-4">
                    {/* NOMBRE */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="name"
                            className="text-zinc-500"
                            style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase" }}
                        >
                            Tu nombre
                        </label>
                        <div className="relative flex items-center">
                            <User className="absolute left-3.5 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                            <input
                                id="name"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Tu nombre"
                                required
                                className="w-full bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-700
                           pl-10 pr-4 py-3 outline-none
                           focus:border-[#c8ff00]/50 focus:bg-zinc-900
                           transition-all duration-200"
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: "12px",
                                    letterSpacing: "0.05em",
                                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                                }}
                            />
                        </div>
                    </div>
                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="email"
                            className="text-zinc-500"
                            style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase" }}
                        >
                            Correo electrónico
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@correo.com"
                                required
                                className="w-full bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-700
                           pl-10 pr-4 py-3 outline-none
                           focus:border-[#c8ff00]/50 focus:bg-zinc-900
                           transition-all duration-200"
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: "12px",
                                    letterSpacing: "0.05em",
                                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                                }}
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="text-zinc-500"
                                style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}
                            >
                                Contraseña
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-zinc-600 hover:text-[#c8ff00] transition-colors duration-200"
                                style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em" }}
                            >
                                ¿Olvidaste la tuya?
                            </Link>
                        </div>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                            <input
                                id="password"
                                type={showPass ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-700
                           pl-10 pr-10 py-3 outline-none
                           focus:border-purple-500/50 focus:bg-zinc-900
                           transition-all duration-200"
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: "12px",
                                    letterSpacing: "0.05em",
                                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass((v) => !v)}
                                className="absolute right-3.5 text-zinc-600 hover:text-zinc-300 transition-colors duration-200"
                                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>
                    {/* Repetir contraseña */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password2"
                                className="text-zinc-500"
                                style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}
                            >
                                Repite tu contraseña
                            </label>
                        </div>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                            <input
                                id="password2"
                                type={showPass ? "text" : "password"}
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-700
                           pl-10 pr-10 py-3 outline-none
                           focus:border-purple-500/50 focus:bg-zinc-900
                           transition-all duration-200"
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: "12px",
                                    letterSpacing: "0.05em",
                                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass((v) => !v)}
                                className="absolute right-3.5 text-zinc-600 hover:text-zinc-300 transition-colors duration-200"
                                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>

                    {/* Botón submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full flex items-center justify-center gap-2 bg-[#c8ff00] text-black
                       py-3.5 mt-2 overflow-hidden
                       hover:bg-yellow-300 active:scale-[0.98]
                       disabled:opacity-60 disabled:cursor-not-allowed
                       transition-all duration-200"
                        style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                            boxShadow: "0 0 28px -6px rgba(200,255,0,0.45)",
                        }}
                    >
                        {loading ? (
                            <>
                                <span
                                    className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"
                                />
                                Verificando...
                            </>
                        ) : (
                            <>
                                Registrate
                                <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </form>
                {error && (
                    <p className="text-center text-red-400 text-xs" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>
                        {error}
                    </p>
                )}
                {/* ── DIVIDER ── */}
                <div className="flex items-center gap-3">
                    <span className="flex-1 h-px bg-zinc-800" />
                    <span
                        className="text-zinc-600"
                        style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}
                    >
                        O continúa con
                    </span>
                    <span className="flex-1 h-px bg-zinc-800" />
                </div>

                {/* ── GOOGLE ── */}
                <button
                    type="button"
                    onClick={handleGoogleClick}
                    disabled={!!linkPrompt}
                    className="w-full flex items-center justify-center gap-3 border border-zinc-700/80
                     bg-zinc-900/50 text-zinc-300 py-3
                     hover:border-purple-500/50 hover:text-white hover:bg-zinc-900
                     disabled:opacity-50 disabled:cursor-not-allowed
                     active:scale-[0.98] transition-all duration-200"
                    style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                    }}
                >
                    {/* Google icon SVG */}
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </button>

                {/* ── VINCULACIÓN GOOGLE ── */}
                {linkPrompt && (
                    <GoogleLinkPrompt
                        email={linkPrompt.email}
                        credential={linkPrompt.credential}
                        onCancel={() => setLinkPrompt(null)}
                    />
                )}

                {/* ── REGISTRO ── */}
                <p
                    className="text-center text-zinc-600"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.1em" }}
                >
                    ¿Ya tienes cuenta?{" "}
                    <Link
                        href="/login"
                        className="text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors duration-200"
                    >
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      `}</style>
        </div>
    );
}