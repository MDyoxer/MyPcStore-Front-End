"use client";

import WireSpinner from "./three/wireSpinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-6">

      {/* Spinner 3D */}
      <WireSpinner size={96} />

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
      `}</style>
    </div>
  );
}
