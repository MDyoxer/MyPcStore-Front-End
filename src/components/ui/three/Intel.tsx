"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

// ─── MODELO GLB DEL PROCESADOR (Intel i7 4th Gen) ─────────────────────────────
function ProcessorGroup() {
  const groupRef = useRef<THREE.Group>(null!);
  const holderRef = useRef<THREE.Group>(null!);
  useRotateDrag(groupRef);
  const gltf = useLoader(GLTFLoader, "/3d/intel/intel_core_i9-11900k.glb");

  useEffect(() => {
    // Quitar el plano de fondo gigante que incluye el modelo de Sketchfab.
    // Si solo se ocultara, Box3.setFromObject seguiría incluyéndolo en el encuadre.
    const plane = gltf.scene.getObjectByName("Plane");
    if (plane) plane.parent?.remove(plane);

    // Auto-encuadre: centrar el chip y escalarlo a la altura objetivo
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const targetHeight = 2.0;
    const scale = targetHeight / Math.max(size.x, size.y);

    holderRef.current.scale.setScalar(scale);
    holderRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }, [gltf]);

  return (
    <group>
      <group ref={holderRef}>
        <group ref={groupRef} rotation={[1, 0.55, 0]}>
          <primitive object={gltf.scene} />
        </group>
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
        <ambientLight intensity={1.4} />

        {/* Luz principal frontal (Luz blanca de estudio) */}
        <directionalLight position={[4, 6, 6]} intensity={3} castShadow />

        {/* Luz dorada lateral para acentuar cortes metálicos */}
        <directionalLight position={[-6, 2, 3]} color="#fef08a" intensity={4} />

        {/* Rim Light trasero para perfilar el PCB */}
        <pointLight position={[0, -4, -4]} color="#22c55e" intensity={4} distance={10} />

        {/* Luz de relleno inferior */}
        <pointLight position={[0, -3, 4]} color="#ffffff" intensity={9} />

        {/* Luz frontal directa para iluminar la cara del chip */}
        <pointLight position={[0, 0, 3.5]} color="#ffffff" intensity={4} distance={2} />

        <ProcessorGroup />
      </Canvas>
    </div>
  );
}
