"use client";

import { useState } from "react";
import { Lock, Link2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { linkGoogleWithEmailPassword } from "@/src/utils/emailAuth";
import type { AuthCredential } from "firebase/auth";

export default function GoogleLinkPrompt({
    email,
    credential,
    onCancel,
}: {
    email: string;
    credential: AuthCredential;
    onCancel: () => void;
}) {
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.trim() === "") {
            setError("La contraseña no puede estar vacía");
            return;
        }
        setLoading(true);
        setError(null);
        const result = await linkGoogleWithEmailPassword(email, password, credential);
        setLoading(false);
        if (result.error) {
            setError(result.error);
            return;
        }
        router.push("/");
    };

    return (
        <div
            className="flex flex-col gap-4 border border-purple-500/40 bg-zinc-900/50 p-4"
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
        >
            <p
                className="flex items-start gap-2 text-zinc-300 leading-relaxed"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.05em" }}
            >
                <Link2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                    El correo <span className="text-[#c8ff00]">{email}</span> ya está registrado con contraseña.
                    Ingresa tu contraseña para vincular tu cuenta de Google y entrar.
                </span>
            </p>

            <form onSubmit={handleLink} className="flex flex-col gap-3">
                <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
                    <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tu contraseña"
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

                {error && (
                    <p
                        className="text-red-400"
                        style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.05em" }}
                    >
                        {error}
                    </p>
                )}

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#c8ff00] text-black
                            py-3 text-xs font-bold uppercase tracking-widest
                            hover:bg-yellow-300 active:scale-[0.98]
                            disabled:opacity-60 disabled:cursor-not-allowed
                            transition-all duration-200"
                        style={{
                            fontFamily: "'Space Mono', monospace",
                            letterSpacing: "0.15em",
                            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                        }}
                    >
                        {loading ? (
                            <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                Vincular
                                <Link2 className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-3 border border-zinc-700/80 text-zinc-400 text-xs uppercase tracking-widest
                            hover:border-zinc-500 hover:text-white
                            disabled:opacity-60 transition-all duration-200"
                        style={{
                            fontFamily: "'Space Mono', monospace",
                            letterSpacing: "0.15em",
                            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
