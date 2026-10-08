import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { createCanvas } from "./canvasUtils";

/* ---------------- textures ---------------- */

const signCache = new Map<string, THREE.Texture>();
function signTexture(text: string, bg: string, fg: string) {
  const key = `${text}|${bg}|${fg}`;
  if (signCache.has(key)) return signCache.get(key)!;
  const t = createCanvas(512, 128, (ctx) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = fg;
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, 496, 112);
    ctx.fillStyle = fg;
    const size = Math.max(22, Math.min(64, Math.floor(460 / (text.length * 0.62))));
    ctx.font = `800 ${size}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 256, 70);
  }).texture;
  signCache.set(key, t);
  return t;
}

const stripesTexture = createCanvas(256, 64, (ctx) => {
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 ? "#f8fafc" : "#f43f5e";
    ctx.fillRect(i * 32, 0, 32, 64);
  }
}).texture;

const ggFace = createCanvas(256, 256, (ctx) => {
  ctx.fillStyle = "#ff9f1a";
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = "#0b1120";
  ctx.fillRect(48, 84, 44, 58);
  ctx.fillRect(164, 84, 44, 58);
  ctx.fillStyle = "#fff";
  ctx.fillRect(60, 96, 20, 22);
  ctx.fillRect(176, 96, 20, 22);
  ctx.beginPath();
  ctx.arc(128, 160, 46, 0, Math.PI);
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#0b1120";
  ctx.stroke();
}).texture;

/* ---------------- data ---------------- */

const SHOPS: { x: number; y: number; label: string; bg: string; fg: string }[] = [
  { x: -2.25, y: 0, label: "SHOP", bg: "#0b1120", fg: "#22d3ee" },
  { x: 2.25, y: 0, label: "FOOD", bg: "#0b1120", fg: "#f97316" },
  { x: -2.25, y: 3, label: "GAMES", bg: "#0b1120", fg: "#a78bfa" },
  { x: 2.25, y: 3, label: "GG STORE", bg: "#0b1120", fg: "#f43f5e" },
];

const COIN_POS: [number, number, number][] = [
  [-1.4, 0.4, 4.6],
  [-3.9, 0.4, 1.6],
  [3.9, 0.4, 1.6],
  [-4.6, 0.4, -1.2],
  [2.7, 3.4, 3.3],
  [-2.7, 3.4, 3.3],
  [0, 6.55, 1.6],
  [1.9, 4.7, -2.4],
];

/* ---------------- building pieces ---------------- */

function Shop({ x, y, label, bg, fg }: { x: number; y: number; label: string; bg: string; fg: string }) {
  return (
    <group position={[x, y, 2.5]}>
      {/* frame */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.75, 1.95, 0.18]} />
        <meshStandardMaterial color="#111827" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* glass */}
      <mesh position={[0, 1.05, 0.1]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#0ea5e9"
          emissiveIntensity={0.5}
          transparent
          opacity={0.28}
          roughness={0.1}
        />
      </mesh>
      {/* awning */}
      <mesh position={[0, 2.08, 0.28]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[1.85, 0.07, 0.55]} />
        <meshStandardMaterial map={stripesTexture} roughness={0.8} />
      </mesh>
      {/* sign */}
      <mesh position={[0, 2.42, 0.12]}>
        <planeGeometry args={[1.5, 0.38]} />
        <meshBasicMaterial map={signTexture(label, bg, fg)} toneMapped={false} />
      </mesh>
      {/* interior warm light */}
      <mesh position={[0, 1.05, 0.06]}>
        <planeGeometry args={[1.4, 1.4]} />
        <meshBasicMaterial color="#fde68a" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function GG() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 2) * 0.06;
    ref.current.rotation.y = Math.sin(t * 0.8) * 0.35;
  });
  return (
    <group position={[0, 0, 4.1]}>
      <group ref={ref}>
        {/* body */}
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[0.46, 0.5, 0.3]} />
          <meshStandardMaterial color="#ff9f1a" roughness={0.5} />
        </mesh>
        {/* head */}
        <mesh position={[0, 1.08, 0]}>
          <boxGeometry args={[0.52, 0.5, 0.44]} />
          <meshStandardMaterial color="#ffb347" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.08, 0.23]}>
          <planeGeometry args={[0.48, 0.46]} />
          <meshBasicMaterial map={ggFace} toneMapped={false} />
        </mesh>
        {/* arms + legs */}
        {[-0.32, 0.32].map((x, i) => (
          <mesh key={i} position={[x, 0.66, 0]}>
            <boxGeometry args={[0.14, 0.42, 0.16]} />
            <meshStandardMaterial color="#ff9f1a" roughness={0.5} />
          </mesh>
        ))}
        {[-0.13, 0.13].map((x, i) => (
          <mesh key={i} position={[x, 0.14, 0]}>
            <boxGeometry args={[0.17, 0.3, 0.18]} />
            <meshStandardMaterial color="#1d4ed8" roughness={0.6} />
          </mesh>
        ))}
      </group>
      {/* shadow blob */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.4, 24]} />
        <meshBasicMaterial color="#000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function Bot() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime * 0.35;
    ref.current.position.x = Math.cos(t) * 4.4;
    ref.current.position.z = Math.sin(t) * 3.4;
    ref.current.rotation.y = -t + Math.PI / 2;
    ref.current.position.y = 0.1 + Math.abs(Math.sin(s.clock.elapsedTime * 6)) * 0.05;
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.3, 0.28, 0.3]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.53, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.53, 0.11]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.18, 6]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[0, 0.76, 0]}>
        <sphereGeometry args={[0.025, 10, 10]} />
        <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.22, 0.3, 24]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

/* ---------------- scene ---------------- */

function MallScene({
  collected,
  onCollect,
}: {
  collected: number[];
  onCollect: (i: number) => void;
}) {
  const coins = useRef<THREE.Group[]>([]);
  const rail = useRef<THREE.Mesh>(null);

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    coins.current.forEach((c, i) => {
      if (!c) return;
      c.rotation.y += dt * 2.4;
      c.position.y = COIN_POS[i][1] + Math.sin(t * 2.5 + i) * 0.07;
    });
    if (rail.current) {
      const m = rail.current.material as THREE.MeshBasicMaterial;
      if (m.map) m.map.offset.x -= dt * 0.6;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#060812", 14, 34]} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#312e81", "#0b1020", 0.5]} />
      <directionalLight position={[6, 10, 6]} intensity={1.4} color="#ffedd5" />
      <pointLight position={[0, 4.5, 4]} intensity={14} distance={12} color="#fda4af" />
      <pointLight position={[0, 1.2, 4.6]} intensity={8} distance={8} color="#38bdf8" />

      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial color="#0d1220" roughness={0.95} />
      </mesh>
      <gridHelper args={[32, 32, "#1e293b", "#131c2e"]} position={[0, 0.01, 0]} />

      {/* trees + lamps */}
      {[
        [-7, -4],
        [7.5, -3],
        [-8, 3],
        [8, 4],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.09, 0.12, 1, 8]} />
            <meshStandardMaterial color="#3f2d1d" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.35, 0]}>
            <coneGeometry args={[0.6, 1.1, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.85} />
          </mesh>
        </group>
      ))}
      {[
        [-5.2, 2.6],
        [5.2, 2.6],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.05, 0.07, 2.2, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 2.25, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#fde68a" emissive="#fde68a" emissiveIntensity={2.4} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* ================= MALL ================= */}
      {/* floor slabs */}
      <mesh position={[0, 0.14, 0]} receiveShadow castShadow>
        <boxGeometry args={[7.2, 0.28, 5.2]} />
        <meshStandardMaterial color="#1a2236" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.14, 0]} receiveShadow castShadow>
        <boxGeometry args={[7.2, 0.28, 5.2]} />
        <meshStandardMaterial color="#1a2236" roughness={0.8} />
      </mesh>
      {/* columns */}
      {[
        [-3.3, -2.2],
        [3.3, -2.2],
        [-3.3, 2.2],
        [3.3, 2.2],
        [0, -2.2],
        [0, 2.2],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.55, z]}>
          <boxGeometry args={[0.22, 2.9, 0.22]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
      {/* back + side walls */}
      <mesh position={[0, 1.6, -2.62]}>
        <boxGeometry args={[7.2, 3.1, 0.16]} />
        <meshStandardMaterial color="#111a2e" roughness={0.85} />
      </mesh>
      <mesh position={[-3.62, 1.6, 0]}>
        <boxGeometry args={[0.16, 3.1, 5.2]} />
        <meshStandardMaterial color="#111a2e" roughness={0.85} />
      </mesh>
      <mesh position={[3.62, 1.6, 0]}>
        <boxGeometry args={[0.16, 3.1, 5.2]} />
        <meshStandardMaterial color="#111a2e" roughness={0.85} />
      </mesh>

      {/* shops */}
      {SHOPS.map((s, i) => (
        <Shop key={i} {...s} />
      ))}

      {/* entrance (middle, ground floor) */}
      <group position={[0, 0, 2.5]}>
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[1.6, 2.0, 0.16]} />
          <meshStandardMaterial color="#05070d" roughness={0.4} metalness={0.4} />
        </mesh>
        <mesh position={[0, 2.28, 0.12]}>
          <planeGeometry args={[1.5, 0.34]} />
          <meshBasicMaterial map={signTexture("ENTRANCE", "#0b1120", "#4ade80")} toneMapped={false} />
        </mesh>
        {/* steps */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0.06 + i * 0.001, 2.95 + i * 0.28]}>
            <boxGeometry args={[1.8, 0.12 + i * 0.001, 0.28]} />
            <meshStandardMaterial color="#243044" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* escalator on the right side */}
      <group position={[4.4, 0, -0.4]} rotation={[0, -Math.PI / 2, 0]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[0, 0.3 + i * 0.24, -1.4 + i * 0.24]}>
            <boxGeometry args={[0.9, 0.08, 0.24]} />
            <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
          </mesh>
        ))}
        <mesh ref={rail} position={[0, 0.75, -0.6]} rotation={[0.5, 0, 0]}>
          <boxGeometry args={[0.94, 0.05, 3.4]} />
          <meshBasicMaterial map={stripesTexture} toneMapped={false} />
        </mesh>
      </group>

      {/* second floor railing */}
      {[
        [-3.3, 2.5],
        [3.3, 2.5],
        [0, 2.5],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 3.45, z]}>
          <boxGeometry args={[2.6, 0.06, 0.06]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      ))}

      {/* roof */}
      <mesh position={[0, 6.28, 0]} castShadow>
        <boxGeometry args={[7.6, 0.2, 5.6]} />
        <meshStandardMaterial color="#151d31" roughness={0.8} />
      </mesh>
      {/* roof sign */}
      <mesh position={[0, 6.75, 0]}>
        <boxGeometry args={[5.4, 0.9, 0.14]} />
        <meshStandardMaterial color="#0b1120" roughness={0.5} />
      </mesh>
      <mesh position={[0, 6.75, 0.09]}>
        <planeGeometry args={[5.2, 0.72]} />
        <meshBasicMaterial map={signTexture("GEOMETRY DASH MALL", "#0b1120", "#f43f5e")} toneMapped={false} />
      </mesh>
      <mesh position={[0, 6.75, -0.09]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[5.2, 0.72]} />
        <meshBasicMaterial map={signTexture("GEOMETRY DASH MALL", "#0b1120", "#22d3ee")} toneMapped={false} />
      </mesh>
      {/* string lights */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-3.2 + i * 0.8, 3.6, 2.75]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial
            color="#fde68a"
            emissive="#fde68a"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}

      <GG />
      <Bot />

      {/* coins */}
      {COIN_POS.map((p, i) =>
        collected.includes(i) ? null : (
          <group
            key={i}
            position={p}
            ref={(m) => {
              if (m) coins.current[i] = m;
            }}
            onClick={(e) => {
              e.stopPropagation();
              onCollect(i);
            }}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          >
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.2} emissive="#b45309" emissiveIntensity={0.35} />
            </mesh>
            <pointLight distance={1.6} intensity={2.4} color="#fbbf24" />
          </group>
        ),
      )}

      <OrbitControls
        enablePan={false}
        minDistance={7}
        maxDistance={20}
        minPolarAngle={0.5}
        maxPolarAngle={1.5}
        autoRotate
        autoRotateSpeed={0.9}
        enableDamping
      />
    </>
  );
}

export default function GeometryMall({
  collected,
  onCollect,
}: {
  collected: number[];
  onCollect: (i: number) => void;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 40, near: 0.1, far: 80, position: [9, 6.5, 10] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <MallScene collected={collected} onCollect={onCollect} />
    </Canvas>
  );
}
