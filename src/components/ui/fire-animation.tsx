import { motion } from "motion/react"

export function FireParticles() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-base select-none"
          style={{
            left: `${5 + (i % 9) * 10 + Math.sin(i) * 4}%`,
            bottom: "0%",
            fontSize: `${0.9 + (i % 3) * 0.3}rem`,
            filter: "blur(0.4px)",
          }}
          animate={{
            y: [0, -(40 + (i % 4) * 20)],
            x: [0, (i % 2 === 0 ? 1 : -1) * (4 + (i % 5) * 3)],
            opacity: [0, 0.9, 0],
            scale: [0.6, 1.1, 0.3],
          }}
          transition={{
            duration: 1.4 + (i % 4) * 0.3,
            repeat: Infinity,
            delay: i * 0.12,
            ease: "easeOut",
          }}
        >
          {i % 3 === 0 ? "🔥" : i % 3 === 1 ? "✦" : "⚡"}
        </motion.span>
      ))}
    </div>
  )
}