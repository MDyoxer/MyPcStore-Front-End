"use client";

const REVIEWS = [
  {
    name: "Carlos Mendoza",
    role: "Game Developer — CDMX",
    initials: "CM",
    rating: 5,
    text: "Armé mi workstation con el Ryzen 9 que recomendaron y la diferencia es brutal. Compilaciones que antes tardaban 8 minutos ahora van en menos de 2. El soporte técnico me guió en cada paso sin hacerme sentir novato.",
    color: "#c8ff00",
  },
  {
    name: "Valeria Ríos",
    role: "Content Creator — Monterrey",
    initials: "VR",
    rating: 5,
    text: "Edito video 4K todo el día y nunca había tenido una máquina tan fluida. El i9 que me recomendaron superó todas mis expectativas. El envío llegó en 2 días y el empaque era impecable.",
    color: "#a855f7",
  },
  {
    name: "Sebastián Torres",
    role: "Streamer Pro — Guadalajara",
    initials: "ST",
    rating: 5,
    text: "Streameo a 1080p60 mientras juego y grabo localmente al mismo tiempo. Con mi build anterior no podía ni soñar con eso. Ahora lo hago sin caída de frames. Esta tienda sabe lo que vende.",
    color: "#c8ff00",
  },
  {
    name: "Andrea Fuentes",
    role: "Arquitecta 3D — Puebla",
    initials: "AF",
    rating: 5,
    text: "Renders que antes me dejaba corriendo de noche ahora terminan en horas. La inversión se pagó sola en el primer mes de proyectos. Sin duda la mejor decisión de hardware que he tomado.",
    color: "#a855f7",
  },
  {
    name: "Diego Herrera",
    role: "Gamer Competitivo — Saltillo",
    initials: "DH",
    rating: 5,
    text: "Framerates consistentes en todos mis títulos competitivos. Sin micro-stutters, sin drops inesperados. El asesoramiento que me dieron para elegir los componentes fue honesto y sin intentar venderme de más.",
    color: "#c8ff00",
  },
  {
    name: "Lucía Paredes",
    role: "Ingeniera de Software — MTY",
    initials: "LP",
    rating: 5,
    text: "Tengo docenas de contenedores Docker corriendo en paralelo y el sistema ni siente la carga. La experiencia de compra fue rápida, transparente y llegó bien protegido. Volvería a comprar sin dudar.",
    color: "#a855f7",
  },
];

// duplicar para loop infinito
const TRACK = [...REVIEWS, ...REVIEWS];

export default function Reviews() {
  return (
    <section className="w-full bg-black py-20 overflow-hidden relative">

      {/* Grid fondo */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,255,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      {/* ── HEADER ── */}
      <div className="max-w-7xl mx-auto px-4 mb-14 relative">
        <div
          className="flex items-center gap-3 mb-3 text-[#c8ff00]"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase" }}
        >
          <span className="w-8 h-px bg-[#c8ff00]" />
          Testimonios
        </div>
        <h2
          className="leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "0.03em" }}
        >
          <span className="text-white">LO QUE DICEN </span>
          <span style={{ color: "transparent", WebkitTextStroke: "1.5px #c8ff00" }}>NUESTROS</span>
          <br />
          <span className="text-white">CLIENTES</span>
        </h2>
      </div>

      {/* ── CARRUSEL ── */}
      <div className="relative">
        {/* Fade izquierda */}
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #000 0%, transparent 100%)" }}
        />
        {/* Fade derecha */}
        <div
          aria-hidden
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #000 0%, transparent 100%)" }}
        />

        {/* Track */}
        <div
          className="flex gap-5 w-max"
          style={{ animation: "carruselScroll 40s linear infinite" }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
        >
          {TRACK.map((r, i) => (
            <article
              key={i}
              className="shrink-0 w-85 flex flex-col gap-5 bg-zinc-950 border border-zinc-800/60 p-7 relative overflow-hidden group
                         hover:border-zinc-700/60 transition-colors duration-300"
              style={{
                clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
              }}
            >
              {/* Acento esquina */}
              <span
                aria-hidden
                className="absolute top-0 right-0 w-3.5 h-3.5 transition-colors duration-300"
                style={{
                  background: r.color,
                  clipPath: "polygon(0 0, 100% 100%, 100% 0)",
                }}
              />

              {/* Línea inferior en hover */}
              <div
                aria-hidden
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: r.color, boxShadow: `0 0 8px ${r.color}` }}
              />

              {/* Estrellas */}
              <div className="flex gap-1">
                {Array.from({ length: r.rating }).map((_, s) => (
                  <span key={s} style={{ color: r.color, fontSize: "12px" }}>★</span>
                ))}
              </div>

              {/* Texto */}
              <p
                className="text-zinc-400 leading-relaxed flex-1"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", lineHeight: "1.9", letterSpacing: "0.02em" }}
              >
                "{r.text}"
              </p>

              {/* Separador */}
              <div className="h-px bg-zinc-800/60" />

              {/* Autor */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className="shrink-0 w-10 h-10 flex items-center justify-center border"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1rem",
                    letterSpacing: "0.05em",
                    color: r.color,
                    borderColor: `${r.color}30`,
                    background: `${r.color}08`,
                    clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                  }}
                >
                  {r.initials}
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                  <span
                    className="text-white truncate"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.05em" }}
                  >
                    {r.name}
                  </span>
                  <span
                    className="text-zinc-600 truncate"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}
                  >
                    {r.role}
                  </span>
                </div>

                {/* Product tag */}
                <span
                  className="ml-auto shrink-0 px-2 py-0.5 text-black"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "8px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    background: r.color,
                    clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                  }}
                >
          
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        @keyframes carruselScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}