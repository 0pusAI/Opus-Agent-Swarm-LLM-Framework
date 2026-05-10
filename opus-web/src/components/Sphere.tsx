"use client";

/**
 * Sphere — the OPUS armillary sphere, in real Three.js.
 *
 * Mirrors the brand mark: a wireframe globe with concentric rings,
 * a beaded equatorial ring, a finial stem on top, a base ring on
 * bottom, and a glowing "all-seeing eye" at the centre.
 *
 *   - Slow constant rotation (~0.04 rad/s on Y).
 *   - Mouse parallax tilts the whole sphere group toward the cursor.
 *   - Eye pulses on a slow heartbeat (~1.2s).
 *   - Bloom postprocessing glows the gold accent.
 *
 * Falls back to a static SVG sphere on prefers-reduced-motion or
 * when the user has narrow viewports (handled in Hero.tsx).
 */

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const BONE = "#F2EFE6";
const GOLD = "#D4AF7A";

// ──────────────────────────────────────────────────────────────────
// Building blocks
// ──────────────────────────────────────────────────────────────────

function MeridianRing({
  rotation = [0, 0, 0],
  thickness = 0.0035,
}: {
  rotation?: [number, number, number];
  thickness?: number;
}) {
  return (
    <mesh rotation={rotation}>
      <torusGeometry args={[1.0, thickness, 6, 96]} />
      <meshBasicMaterial color={BONE} />
    </mesh>
  );
}

function BeadedEquator({ count = 36 }: { count?: number }) {
  const beads = Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return (
      <mesh key={i} position={[Math.cos(angle), 0, Math.sin(angle)]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial
          color={BONE}
          emissive={GOLD}
          emissiveIntensity={0.4}
        />
      </mesh>
    );
  });

  return (
    <group>
      <mesh>
        <torusGeometry args={[1.0, 0.006, 8, 128]} />
        <meshBasicMaterial color={BONE} />
      </mesh>
      {beads}
    </group>
  );
}

function Eye() {
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Slow heartbeat ~1.2s
    const beat = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin((t / 1.2) * Math.PI * 2));
    if (innerRef.current) {
      const m = innerRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = beat * 2.4;
    }
    if (outerRef.current) {
      outerRef.current.scale.setScalar(0.95 + 0.07 * beat);
    }
  });

  return (
    <group>
      {/* Outer halo ring */}
      <mesh ref={outerRef}>
        <ringGeometry args={[0.07, 0.085, 64]} />
        <meshBasicMaterial color={BONE} side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>
      {/* Inner pupil */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial
          color={BONE}
          emissive={GOLD}
          emissiveIntensity={1.6}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function Finial() {
  // Small stem and bulb on top, mirroring the brand mark.
  return (
    <group position={[0, 1.05, 0]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.18, 8]} />
        <meshBasicMaterial color={BONE} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color={BONE} />
      </mesh>
      <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.04, 0.005, 6, 32]} />
        <meshBasicMaterial color={BONE} />
      </mesh>
    </group>
  );
}

function BasePlate() {
  return (
    <group position={[0, -1.05, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.008, 8, 64]} />
        <meshBasicMaterial color={BONE} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.02, 32]} />
        <meshBasicMaterial color={BONE} />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// Sphere group
// ──────────────────────────────────────────────────────────────────

function Armillary() {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, dt) => {
    if (!group.current) return;
    // Smooth toward target
    mouse.current.x += (target.current.x - mouse.current.x) * 0.05;
    mouse.current.y += (target.current.y - mouse.current.y) * 0.05;
    // Slow constant Y rotation + parallax tilt
    group.current.rotation.y += dt * 0.04;
    group.current.rotation.x = mouse.current.y * 0.18;
    group.current.rotation.z = mouse.current.x * -0.06;
  });

  // Generate meridian rings: rotated around Y at evenly-spaced angles.
  const meridianCount = 6;
  const meridians = Array.from({ length: meridianCount }).map((_, i) => {
    const angle = (i / meridianCount) * Math.PI;
    return (
      <MeridianRing
        key={`m-${i}`}
        rotation={[0, angle, Math.PI / 2]}
      />
    );
  });

  // Generate latitude rings (smaller as they approach poles).
  const latitudes = [0.35, 0.65, 0.85].flatMap((y, idx) => {
    const r = Math.sqrt(1 - y * y);
    return [
      <mesh key={`lat+${idx}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r, 0.003, 6, 64]} />
        <meshBasicMaterial color={BONE} transparent opacity={0.55} />
      </mesh>,
      <mesh key={`lat-${idx}`} position={[0, -y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r, 0.003, 6, 64]} />
        <meshBasicMaterial color={BONE} transparent opacity={0.55} />
      </mesh>,
    ];
  });

  return (
    <group ref={group}>
      {/* Faint inner wireframe sphere for volume */}
      <mesh>
        <sphereGeometry args={[0.99, 24, 16]} />
        <meshBasicMaterial color={BONE} wireframe transparent opacity={0.08} />
      </mesh>
      {meridians}
      {latitudes}
      <BeadedEquator count={36} />
      <Eye />
      <Finial />
      <BasePlate />
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// Top-level component
// ──────────────────────────────────────────────────────────────────

interface SphereProps {
  className?: string;
}

export function Sphere({ className }: SphereProps) {
  return (
    <div className={className} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.6]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 0, 2]} intensity={0.8} color={BONE} />
        <Armillary />
        <EffectComposer>
          <Bloom
            intensity={0.85}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.6}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
