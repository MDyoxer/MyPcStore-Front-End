import React, { useRef } from 'react'
import { Canvas, useFrame, useThree, extend, ThreeElement } from '@react-three/fiber'
import * as THREE from 'three'

class MultiFireMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#ff2200") }, // Rojo/Naranja intenso
        uColorB: { value: new THREE.Color("#ffaa00") }, // Amarillo brillante
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying vec2 vUv;

        // Ruido Simplex 2D para movimiento fluido
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ) );
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 uv = vUv;
          
          // Frecuencia horizontal alta para repetir múltiples lenguas de fuego
          vec2 noiseCoord = vec2(uv.x * 8.0, uv.y * 3.0 - uTime * 2.5);
          float n = snoise(noiseCoord);

          // Segunda capa de ruido más fina para variedad
          float n2 = snoise(vec2(uv.x * 16.0 + uTime, uv.y * 5.0 - uTime * 4.0)) * 0.5;

          // Combinar ruidos
          float finalNoise = (n + n2) * 0.5 + 0.5;

          // Máscara vertical: el fuego nace abajo (y=0) y se desvanece hacia arriba (y=1)
          float heightFade = smoothstep(0.9, 0.0, uv.y);
          float baseGlow = smoothstep(0.0, 0.15, uv.y) * (1.0 - smoothstep(0.15, 0.8, uv.y));

          // Fundido horizontal: las orillas laterales se desvanecen sin cortarse
          float edgeFade = smoothstep(0.0, 0.12, uv.x) * (1.0 - smoothstep(0.88, 1.0, uv.x));

          // Forma de las llamas envolventes
          float fireIntensity = finalNoise * heightFade * edgeFade;
          fireIntensity = smoothstep(0.2, 0.65, fireIntensity);

          // Mezcla de colores según altura e intensidad
          vec3 color = mix(uColorA, uColorB, uv.y + fireIntensity * 0.5);
          
          // Transparencia suave
          float alpha = fireIntensity * heightFade * 1.5;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }
}

extend({ MultiFireMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    multiFireMaterial: ThreeElement<typeof MultiFireMaterial>
  }
}

function FireScene() {
  const materialRef = useRef<MultiFireMaterial>(null!)
  const { viewport } = useThree()

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  return (
    <mesh position={[0, -0.2, 0]} scale={[viewport.width * 1.00, viewport.height * 0.7, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <multiFireMaterial ref={materialRef} />
    </mesh>
  )
}

export function FireParticles() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <Canvas 
        camera={{ position: [0, 0, 3], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: "low-power", antialias: false }}
      >
        <FireScene />
      </Canvas>
    </div>
  )
}