export default function Loading() {
  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-6">

      {/* Barras /// en ola */}
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="text-[#c8ff00] font-bold select-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "2.5rem",
              lineHeight: 1,
              display: "inline-block",
              animation: "barWave 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.15}s`,
            }}
          >
            /
          </span>
        ))}
      </div>

      {/* Texto */}
      <span
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "1.6rem",
          letterSpacing: "0.4em",
          color: "#c8ff00",
          opacity: 0.7,
        }}
      >
        CARGANDO...
      </span>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        @keyframes barWave {
          0%, 100% { transform: scaleY(1);   opacity: 0.25; }
          50%       { transform: scaleY(2.2); opacity: 1;    }
        }
      `}</style>
    </div>
  );
}