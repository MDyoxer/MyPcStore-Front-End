import Link from "next/link";
export default function NotFound404() {
 return (
        <div className="flex text-center px-4 flex-col items-center justify-center py-32 gap-6">
            <span
                style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(5rem, 15vw, 10rem)",
                    lineHeight: 1,
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(200,255,0,0.15)",
                }}
            >
                404
            </span>
            <p
                className="text-zinc-600"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(18px, 4.5vw, 31px)", letterSpacing: "0.2em", textTransform: "uppercase" }}
            >
                Pagina no encontrada
            </p>
            <Link
                href="/allProducts"
                className="text-center inline-flex items-center gap-2 bg-[#c8ff00] text-black px-6 py-3 hover:bg-yellow-300 active:scale-95 transition-all duration-200"
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