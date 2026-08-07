"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function SpinningWire() {
  const outerRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    outerRef.current.rotation.x = t * 0.6;
    outerRef.current.rotation.y = t * 0.8;
    outerRef.current.position.y = Math.sin(t * 1.5) * 0.1;
    innerRef.current.rotation.x = -t * 0.9;
    innerRef.current.rotation.z = t * 0.7;
  });

  return (
    <group>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial wireframe color="#c8ff00" />
      </mesh>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial wireframe color="#a855f7" />
      </mesh>
    </group>
  );
}

export default function WireSpinner({ size = 96 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: "low-power", antialias: true }}
      >
        <SpinningWire />
      </Canvas>
    </div>
  );
}
