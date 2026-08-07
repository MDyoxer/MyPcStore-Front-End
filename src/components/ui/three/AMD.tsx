"use client";

import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── ROTACIÓN POR ARRASTRE CON INERCIA ────────────────────────────────────────
function useRotateDrag(groupRef: React.RefObject<THREE.Group>) {
  const velocityRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const { gl } = useThree();

  useFrame((_, delta) => {
    if (draggingRef.current) return;
    velocityRef.current.x *= Math.exp(-3.0 * delta);
    velocityRef.current.y *= Math.exp(-3.0 * delta);

    if (Math.abs(velocityRef.current.x) < 0.001) velocityRef.current.x = 0;
    if (Math.abs(velocityRef.current.y) < 0.001) velocityRef.current.y = 0;

    groupRef.current.rotation.y += velocityRef.current.x * delta;
    groupRef.current.rotation.x += velocityRef.current.y * delta;
  });

  useEffect(() => {
    const dom = gl.domElement;
    let lastX = 0, lastY = 0, lastT = 0;

    const onDown = (e: PointerEvent) => {
      draggingRef.current = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
      dom.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dt = Math.max((e.timeStamp - lastT) / 1000, 0.001);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;

      groupRef.current.rotation.y += dx * 0.008;
      groupRef.current.rotation.x += dy * 0.008;

      velocityRef.current.x = THREE.MathUtils.clamp((dx * 0.008) / dt, -10, 10);
      velocityRef.current.y = THREE.MathUtils.clamp((dy * 0.008) / dt, -10, 10);
    };

    const onUp = (e: PointerEvent) => {
      draggingRef.current = false;
      dom.releasePointerCapture(e.pointerId);
    };

    dom.addEventListener("pointerdown", onDown);
    dom.addEventListener("pointermove", onMove);
    dom.addEventListener("pointerup", onUp);
    dom.addEventListener("pointercancel", onUp);
    return () => {
      dom.removeEventListener("pointerdown", onDown);
      dom.removeEventListener("pointermove", onMove);
      dom.removeEventListener("pointerup", onUp);
      dom.removeEventListener("pointercancel", onUp);
    };
  }, [gl, groupRef]);
}

// ─── TEXTURA HD DEL IHS Y GRABADOS LASER ──────────────────────────────────────
function useProcessorTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d")!;

    // Fondo metálico con efecto cepillado suave
    ctx.fillStyle = "#cfd3da";
    ctx.fillRect(0, 0, 2048, 2048);

    // Textos impresos con efecto grabado láser
    ctx.textAlign = "center";
    ctx.fillStyle = "#1e1e24";

    // Logo AMD
    ctx.font = "bold 190px Arial, sans-serif";
    ctx.fillText("AMD", 1024, 520);

    // RYZEN
    ctx.font = "900 280px Arial, sans-serif";
    ctx.fillText("RYZEN", 1024, 820);

    // Modelo
    ctx.font = "italic bold 105px Arial, sans-serif";
    ctx.fillText("AMD Ryzen 7 7800X3D", 1024, 1080);

    // Especificaciones y seriales
    ctx.textAlign = "left";
    ctx.font = "600 60px monospace";
    ctx.fillText("100-000000910", 820, 1280);
    ctx.fillText("BF 2305PGY", 820, 1370);
    ctx.fillText("F402015N30040", 820, 1460);
    ctx.fillText("MADE IN MALAYSIA", 820, 1550);
    ctx.fillText("© 2022 AMD", 820, 1640);

    // Matriz DataMatrix (QR)
    ctx.fillStyle = "#111115";
    const qrX = 480, qrY = 1250, tileSize = 24;
    for (let r = 0; r < 14; r++) {
      for (let c = 0; c < 14; c++) {
        if ((r * 3 + c * 7) % 5 !== 1) {
          ctx.fillRect(qrX + c * tileSize, qrY + r * tileSize, tileSize - 2, tileSize - 2);
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

// ─── MODELO 3D AM5 DETALLADO ───────────────────────────────────────────────────
function ProcessorGroup() {
  const groupRef = useRef<THREE.Group>(null!);
  useRotateDrag(groupRef);
  const ihsTexture = useProcessorTexture();

  const size = 2.6;
  const pcbThick = 0.09;

  // Renderizado dinámico de capacitores SMD
  const smdCapacitors = useMemo(() => {
    const coords: [number, number, number][] = [];
    const positions = [-0.95, -0.65, 0.65, 0.95];
    
    // Capacitores superiores e inferiores del PCB
    positions.forEach((x) => {
      coords.push([x, 1.12, 0.05], [x, -1.12, 0.05]);
    });
    // Capacitores laterales
    positions.forEach((y) => {
      coords.push([1.12, y, 0.05], [-1.12, y, 0.05]);
    });
    return coords;
  }, []);

  return (
    <group ref={groupRef} rotation={[0.3, -0.4, 0]}>
      {/* ── 1. SUSTRATO / PCB VERDE OSCURO AM5 ── */}
      <mesh>
        <boxGeometry args={[size, size, pcbThick]} />
        <meshStandardMaterial color="#0b3826" metalness={0.3} roughness={0.3} />
      </mesh>

      {/* Triángulo dorado de alineación Pin 1 */}
      <mesh position={[-size / 2 + 0.15, size / 2 - 0.15, pcbThick / 2 + 0.001]}>
        <planeGeometry args={[0.16, 0.16]} />
        <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Muescas del PCB (Notches de calce) */}
      <mesh position={[0, size / 2, 0]}>
        <boxGeometry args={[0.2, 0.08, pcbThick + 0.01]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, -size / 2, 0]}>
        <boxGeometry args={[0.2, 0.08, pcbThick + 0.01]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>

      {/* ── 2. CAPACITORES EXPOSED SMD (FRONTAL) ── */}
      {smdCapacitors.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Cuerpo cerámico SMD */}
          <mesh>
            <boxGeometry args={[0.07, 0.11, 0.04]} />
            <meshStandardMaterial color="#854d0e" metalness={0.2} roughness={0.4} />
          </mesh>
          {/* Contactos metálicos del SMD */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.075, 0.03, 0.045]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* ── 3. DISIPADOR DE CALOR (IHS - ESTILO NíQUEL PULIDO) ── */}
      <group position={[0, 0, pcbThick / 2]}>
        {/* Placa central cepillada */}
        <mesh position={[0, 0, 0.09]}>
          <boxGeometry args={[1.75, 1.75, 0.14]} />
          <meshStandardMaterial
            map={ihsTexture}
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>

        {/* Patas del corte "Octopus" AM5 */}
        {/* Patas verticales */}
        {[-1.02, 1.02].map((x, i) =>
          [-0.58, 0, 0.58].map((y, j) => (
            <mesh key={`v-${i}-${j}`} position={[x, y, 0.06]}>
              <boxGeometry args={[0.3, 0.35, 0.1]} />
              <meshStandardMaterial color="#c8cbd0" metalness={0.85} roughness={0.2} />
            </mesh>
          ))
        )}
        {/* Patas horizontales */}
        {[-1.02, 1.02].map((y, i) =>
          [-0.4, 0.4].map((x, j) => (
            <mesh key={`h-${i}-${j}`} position={[x, y, 0.06]}>
              <boxGeometry args={[0.35, 0.3, 0.1]} />
              <meshStandardMaterial color="#c8cbd0" metalness={0.85} roughness={0.2} />
            </mesh>
          ))
        )}
      </group>

      {/* ── 4. CARA TRASERA (CONTACTOS LGA Y CAPACITORES CENTRALES) ── */}
      <group position={[0, 0, -pcbThick / 2 - 0.002]} rotation={[0, Math.PI, 0]}>
        {/* Matriz dorada de contactos LGA */}
        <mesh>
          <planeGeometry args={[size - 0.18, size - 0.18]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Canal central divisorio AM5 */}
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[size - 0.18, 0.06]} />
          <meshStandardMaterial color="#0b3826" roughness={0.4} />
        </mesh>

        {/* Capacitores de la parte trasera del sustrato */}
        {[-0.6, 0.6].map((y, idx) => (
          <group key={idx} position={[0, y, 0.006]}>
            {[-0.6, -0.3, 0, 0.3, 0.6].map((x, i) => (
              <mesh key={i} position={[x, 0, 0]}>
                <boxGeometry args={[0.1, 0.06, 0.02]} />
                <meshStandardMaterial color="#a1a1aa" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

// ─── ESCENA PRINCIPAL CON ILUMINACIÓN DE ESTUDIO ──────────────────────────────
export default function DetailedProcessorViewer({ size = 450 }: { size?: number }) {
  return (
    <div className="relative cursor-grab active:cursor-grabbing select-none" style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 38 }}
        dpr={[1, 2]}
        gl={{ powerPreference: "high-performance", antialias: true }}
      >
        {/* Ambient Light para relleno suave */}
        <ambientLight intensity={0.6} />

        {/* Luz principal frontal (Luz blanca de estudio) */}
        <directionalLight position={[4, 6, 6]} intensity={2.2} castShadow />

        {/* Luz dorada lateral para acentuar cortes metálicos y capacitores */}
        <directionalLight position={[-6, 2, 3]} color="#fef08a" intensity={1.8} />

        {/* Rim Light trasero para perfilar el PCB verde */}
        <pointLight position={[0, -4, -4]} color="#22c55e" intensity={2.5} distance={10} />

        {/* Luz de relleno inferior */}
        <pointLight position={[0, -3, 4]} color="#ffffff" intensity={0.8} />

        <ProcessorGroup />
      </Canvas>
    </div>
  );
}