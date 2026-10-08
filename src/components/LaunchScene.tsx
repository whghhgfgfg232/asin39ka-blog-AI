import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { createCanvas } from "@/canvasUtils";

export type LaunchVariant = "core" | "mall" | "weather" | "blog" | "center";
type Prog = { current: number };

/* ------------------------------------------------------------------ */
/*  helpers                                                            */
/* ------------------------------------------------------------------ */

function useRise(count: number, radius: number, height: number) {
  return useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.random() * height;
      pos[i * 3 + 2] = Math.sin(a) * r;
      spd[i] = 0.35 + Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.userData.spd = spd;
    g.userData.height = height;
    return g;
  }, [count, radius, height]);
}

function RisePoints({
  geo,
  color,
  size,
  speed = 1,
  opacity = 0.55,
}: {
  geo: THREE.BufferGeometry;
  color: string;
  size: number;
  speed?: number;
  opacity?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const spd = ref.current.geometry.userData.spd as Float32Array;
    const h = ref.current.geometry.userData.height as number;
    for (let i = 0; i < arr.count; i++) {
      let y = arr.getY(i) + dt * spd[i] * speed;
      if (y > h) y = 0;
      arr.setY(i, y);
    }
    arr.needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/** camera fly-in driven by the shared progress value */
function Rig({ prog, dist, height = 0.4 }: { prog: Prog; dist: number; height?: number }) {
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const k = THREE.MathUtils.clamp(prog.current, 0, 1);
    const d = THREE.MathUtils.lerp(dist * 1.75, dist, k);
    const a = t * 0.28 + (1 - k) * 1.1;
    s.camera.position.set(
      Math.sin(a) * d,
      d * height + Math.sin(t * 0.5) * 0.12,
      Math.cos(a) * d,
    );
    s.camera.lookAt(0, 0, 0);
  });
  return null;
}

const texCache = new Map<string, THREE.Texture>();
function panelTexture(title: string, sub: string, accent: string) {
  const key = `${title}|${sub}|${accent}`;
  const hit = texCache.get(key);
  if (hit) return hit;
  const tex = createCanvas(512, 256, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#101828");
    g.addColorStop(1, "#05070d");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, 492, 236);
    ctx.fillStyle = accent;
    ctx.font = "800 34px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(title, 256, 118);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "400 20px 'JetBrains Mono', monospace";
    ctx.fillText(sub, 256, 158);
  }).texture;
  texCache.set(key, tex);
  return tex;
}

/* ------------------------------------------------------------------ */
/*  CORE                                                               */
/* ------------------------------------------------------------------ */

const STOPS: [number, string][] = [
  [800, "#ff3d00"],
  [1000, "#ff7a00"],
  [1150, "#ffc400"],
  [1300, "#ffe066"],
  [1450, "#a5f3fc"],
  [1600, "#f0f9ff"],
];

function tempColor(temp: number, out: THREE.Color) {
  const t = Math.min(1600, Math.max(800, temp));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [t0, c0] = STOPS[i];
    const [t1, c1] = STOPS[i + 1];
    if (t >= t0 && t <= t1) {
      out.set(c0).lerp(new THREE.Color(c1), (t - t0) / (t1 - t0));
      return out;
    }
  }
  return out.set(STOPS[STOPS.length - 1][1]);
}

function CoreVariant({ prog }: { prog: Prog }) {
  const core = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const cage = useRef<THREE.Mesh>(null);
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const col = useMemo(() => new THREE.Color(), []);
  const geo = useRise(280, 1.5, 4);

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const temp = 800 + (Math.sin(t * 0.5) * 0.5 + 0.5) * 800;
    const h = (temp - 800) / 800;
    tempColor(temp, col);

    if (core.current) {
      const m = core.current.material as THREE.MeshStandardMaterial;
      m.color.copy(col);
      m.emissive.copy(col);
      m.emissiveIntensity = 0.8 + h * 2.6;
      core.current.scale.setScalar(1 + h * 0.12 + Math.sin(t * (2 + h * 6)) * 0.03);
      core.current.rotation.y += dt * (0.3 + h * 0.9);
    }
    if (glow.current) {
      const m = glow.current.material as THREE.MeshBasicMaterial;
      m.color.copy(col);
      m.opacity = 0.14 + h * 0.42;
    }
    if (cage.current) {
      cage.current.rotation.y -= dt * (0.2 + h * 0.6);
      cage.current.rotation.x += dt * 0.12;
      const m = cage.current.material as THREE.MeshBasicMaterial;
      m.color.copy(col);
    }
    if (r1.current) r1.current.rotation.z += dt * 1.1;
    if (r2.current) r2.current.rotation.x += dt * 0.85;
    if (r3.current) r3.current.rotation.y += dt * 1.4;
    if (light.current) {
      light.current.color.copy(col);
      light.current.intensity = 14 + h * 34 + Math.sin(t * 12) * 2;
    }
  });

  return (
    <>
      <gridHelper args={[14, 28, "#1e3a4a", "#101c28"]} position={[0, -2.4, 0]} />
      <mesh ref={core}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={1.5} roughness={0.25} />
      </mesh>
      <mesh ref={glow}>
        <sphereGeometry args={[1.35, 32, 32]} />
        <meshBasicMaterial color="#ff7a00" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={cage}>
        <icosahedronGeometry args={[1.85, 1]} />
        <meshBasicMaterial color="#ffc400" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh ref={r1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.4, 0.03, 10, 80]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} />
      </mesh>
      <mesh ref={r2} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[2.75, 0.02, 10, 80]} />
        <meshBasicMaterial color="#a78bfa" toneMapped={false} />
      </mesh>
      <mesh ref={r3} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.1, 0.02, 10, 80]} />
        <meshBasicMaterial color="#f472b6" toneMapped={false} />
      </mesh>
      <pointLight ref={light} intensity={20} distance={14} color="#ff7a00" />
      <RisePoints geo={geo} color="#ffb347" size={0.05} speed={1.6} />
      <Rig prog={prog} dist={7} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  MALL                                                               */
/* ------------------------------------------------------------------ */

const MALL_SHOPS = [
  ["SHOP", "#22d3ee"],
  ["FOOD", "#f97316"],
  ["GAMES", "#a78bfa"],
  ["GG", "#f43f5e"],
];

function MallVariant({ prog }: { prog: Prog }) {
  const spin = useRef<THREE.Group>(null);
  const coins = useRef<THREE.Group>(null);
  const gg = useRef<THREE.Group>(null);

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    if (spin.current) spin.current.rotation.y += dt * 0.4;
    if (coins.current) {
      coins.current.rotation.y -= dt * 0.9;
      coins.current.children.forEach((c, i) => {
        c.rotation.z += dt * 2.4;
        c.position.y = Math.sin(t * 2 + i) * 0.35;
      });
    }
    if (gg.current) {
      gg.current.position.y = 2.55 + Math.sin(t * 2.4) * 0.07;
      gg.current.rotation.y = Math.sin(t * 0.8) * 0.5;
    }
  });

  return (
    <>
      <gridHelper args={[16, 32, "#1e293b", "#131c2e"]} position={[0, -2.2, 0]} />
      <group ref={spin}>
        {/* two floors */}
        {[0, 1.05].map((y, f) => (
          <group key={f} position={[0, y, 0]}>
            <mesh>
              <boxGeometry args={[3.6, 0.9, 2.4]} />
              <meshStandardMaterial color="#141d31" roughness={0.8} metalness={0.2} />
            </mesh>
            {MALL_SHOPS.map(([label, c], i) => (
              <group key={label} position={[-1.32 + i * 0.88, 0.05, 1.22]}>
                <mesh>
                  <planeGeometry args={[0.72, 0.6]} />
                  <meshStandardMaterial
                    color={c}
                    emissive={c}
                    emissiveIntensity={0.9}
                    toneMapped={false}
                  />
                </mesh>
                <mesh position={[0, 0.52, 0]}>
                  <planeGeometry args={[0.72, 0.2]} />
                  <meshBasicMaterial map={panelTexture(label, "", c)} toneMapped={false} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
        {/* roof + sign */}
        <mesh position={[0, 2.15, 0]}>
          <boxGeometry args={[3.9, 0.18, 2.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 2.15, 1.31]}>
          <planeGeometry args={[3.6, 0.42]} />
          <meshBasicMaterial map={panelTexture("GEOMETRY DASH MALL", "", "#f43f5e")} toneMapped={false} />
        </mesh>
        {/* GG on the roof */}
        <group ref={gg} position={[0, 2.55, 0]}>
          <mesh>
            <boxGeometry args={[0.3, 0.34, 0.22]} />
            <meshStandardMaterial color="#ff9f1a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.34, 0.3, 0.3]} />
            <meshStandardMaterial color="#ffb347" roughness={0.5} />
          </mesh>
          {[-0.09, 0.09].map((x) => (
            <mesh key={x} position={[x, 0.28, 0.16]}>
              <boxGeometry args={[0.07, 0.07, 0.02]} />
              <meshBasicMaterial color="#0b1120" />
            </mesh>
          ))}
        </group>
      </group>

      {/* orbiting coins */}
      <group ref={coins} position={[0, 0.2, 0]}>
        {Array.from({ length: 7 }).map((_, i) => {
          const a = (i / 7) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 3.2, 0, Math.sin(a) * 3.2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.06, 24]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.18} emissive="#b45309" emissiveIntensity={0.4} />
            </mesh>
          );
        })}
      </group>

      <pointLight position={[0, 2, 4]} intensity={26} distance={12} color="#fda4af" />
      <pointLight position={[0, 0.5, 3]} intensity={14} distance={9} color="#38bdf8" />
      <ambientLight intensity={0.4} />
      <Rig prog={prog} dist={7.5} height={0.35} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  WEATHER                                                            */
/* ------------------------------------------------------------------ */

function WeatherVariant({ prog }: { prog: Prog }) {
  const planet = useRef<THREE.Mesh>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const bolt = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const flash = useRef(0);
  const rain = useRise(420, 3.4, 7);

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    if (planet.current) planet.current.rotation.y += dt * 0.25;
    if (clouds.current) {
      clouds.current.rotation.y += dt * 0.16;
      clouds.current.rotation.z = Math.sin(t * 0.3) * 0.15;
    }
    // random lightning
    flash.current -= dt;
    if (flash.current < 0 && Math.random() > 0.94) flash.current = 0.16;
    const striking = flash.current > 0;
    if (bolt.current) {
      bolt.current.visible = striking;
      bolt.current.scale.y = 0.8 + Math.random() * 0.6;
      bolt.current.rotation.y = Math.random() * Math.PI;
    }
    if (light.current) light.current.intensity = striking ? 60 + Math.random() * 40 : 6;
  });

  return (
    <>
      <mesh ref={planet}>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshStandardMaterial color="#0e1a33" roughness={0.85} metalness={0.15} />
      </mesh>
      <mesh ref={clouds}>
        <sphereGeometry args={[1.72, 24, 18]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.32} />
      </mesh>
      {/* rain — rising points flipped so they fall */}
      <group rotation={[Math.PI, 0, 0]} position={[0, 1.2, 0]}>
        <RisePoints geo={rain} color="#7dd3fc" size={0.045} speed={4.5} opacity={0.5} />
      </group>
      {/* lightning bolt */}
      <mesh ref={bolt} position={[0, 2.6, 0]} visible={false}>
        <coneGeometry args={[0.28, 2.2, 4]} />
        <meshBasicMaterial color="#fef08a" toneMapped={false} />
      </mesh>
      {/* reward coin */}
      <mesh position={[2.9, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 28]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} emissive="#b45309" emissiveIntensity={0.5} />
      </mesh>
      <pointLight ref={light} position={[0, 3.4, 0]} intensity={8} distance={16} color="#e0f2fe" />
      <pointLight position={[3.4, 0.6, 1.4]} intensity={14} distance={7} color="#fbbf24" />
      <Rig prog={prog} dist={6.6} height={0.28} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  BLOG                                                               */
/* ------------------------------------------------------------------ */

const POSTS_3D = [
  ["STUDYING AI", "june 2025", "#a78bfa"],
  ["THE TUNNEL", "no mkep", "#4ade80"],
  ["THE BAN", "appeal: rejected", "#f87171"],
  ["THE TV ROOM", "3d scene", "#22d3ee"],
  ["THE CORE", "800–1600°", "#ffc400"],
  ["THE MALL", "coins: 8", "#f43f5e"],
];

function BlogVariant({ prog }: { prog: Prog }) {
  const ring = useRef<THREE.Group>(null);
  const letters = useRise(180, 2.4, 6);

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    if (ring.current) {
      ring.current.rotation.y += dt * 0.32;
      ring.current.children.forEach((c, i) => {
        c.position.y = Math.sin(t * 1.3 + i) * 0.28;
        c.rotation.y = -ring.current!.rotation.y;
      });
    }
  });

  return (
    <>
      <group ref={ring}>
        {POSTS_3D.map(([title, sub, c], i) => {
          const a = (i / POSTS_3D.length) * Math.PI * 2;
          return (
            <mesh key={title} position={[Math.cos(a) * 3.4, 0, Math.sin(a) * 3.4]}>
              <planeGeometry args={[1.9, 0.95]} />
              <meshBasicMaterial map={panelTexture(title, sub, c)} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
      </group>
      {/* central terminal core */}
      <mesh rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="#0f172a" emissive="#a78bfa" emissiveIntensity={0.7} roughness={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.15, 24, 24]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={16} distance={9} color="#a78bfa" />
      <pointLight position={[4, 3, 4]} intensity={12} distance={12} color="#22d3ee" />
      <RisePoints geo={letters} color="#c4b5fd" size={0.05} speed={0.8} opacity={0.5} />
      <Rig prog={prog} dist={7.4} height={0.3} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  2.5D CENTER                                                        */
/* ------------------------------------------------------------------ */

function layerTexture(kind: "sky" | "city" | "mall" | "plaza") {
  const hit = texCache.get(kind);
  if (hit) return hit;
  const tex = createCanvas(1024, 512, (ctx) => {
    if (kind === "sky") {
      const g = ctx.createLinearGradient(0, 0, 0, 512);
      g.addColorStop(0, "#1e1b4b");
      g.addColorStop(0.6, "#7c3aed");
      g.addColorStop(1, "#f59e0b");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1024, 512);
      ctx.fillStyle = "#fff";
      for (let i = 0; i < 90; i++) {
        ctx.globalAlpha = 0.25 + Math.random() * 0.6;
        ctx.fillRect(Math.random() * 1024, Math.random() * 260, 2, 2);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#fde68a";
      ctx.beginPath();
      ctx.arc(512, 250, 60, 0, Math.PI * 2);
      ctx.fill();
    } else if (kind === "city") {
      ctx.clearRect(0, 0, 1024, 512);
      let x = 0;
      let seed = 11;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      while (x < 1024) {
        const w = 50 + rnd() * 70;
        const h = 150 + rnd() * 300;
        ctx.fillStyle = "#160f2e";
        ctx.fillRect(x, 512 - h, w, h);
        for (let wy = 512 - h + 20; wy < 500; wy += 28) {
          for (let wx = x + 10; wx < x + w - 14; wx += 20) {
            if (rnd() > 0.5) {
              ctx.fillStyle = rnd() > 0.5 ? "rgba(34,211,238,0.9)" : "rgba(253,224,71,0.85)";
              ctx.fillRect(wx, wy, 9, 13);
            }
          }
        }
        x += w + 8;
      }
    } else if (kind === "mall") {
      ctx.clearRect(0, 0, 1024, 512);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(60, 90, 904, 400);
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 6;
      ctx.strokeRect(60, 90, 904, 400);
      ctx.fillStyle = "#22d3ee";
      ctx.font = "800 52px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("2.5D SHOPPING CENTER", 512, 165);
      const cols = ["#f43f5e", "#f97316", "#facc15", "#22d3ee", "#a78bfa"];
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = cols[i];
        ctx.fillRect(100 + i * 172, 250, 140, 200);
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(114 + i * 172, 266, 112, 130);
        ctx.fillStyle = "#04050a";
        ctx.font = "700 20px 'JetBrains Mono', monospace";
        ctx.fillText(["GG", "FOOD", "COIN", "GAME", "AI"][i], 170 + i * 172, 430);
      }
    } else {
      ctx.clearRect(0, 0, 1024, 512);
      ctx.fillStyle = "#1e1b4b";
      ctx.fillRect(0, 0, 1024, 512);
      ctx.strokeStyle = "rgba(148,163,184,0.5)";
      ctx.lineWidth = 3;
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.moveTo(-100 + i * 130, 0);
        ctx.lineTo(300 + i * 130, 512);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(34,211,238,0.35)";
      ctx.fillRect(0, 0, 1024, 26);
    }
  }).texture;
  texCache.set(kind, tex);
  return tex;
}

function CenterVariant({ prog }: { prog: Prog }) {
  const sway = useRef<THREE.Group>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (sway.current) {
      sway.current.rotation.y = Math.sin(t * 0.35) * 0.22;
      sway.current.rotation.x = Math.sin(t * 0.28) * 0.05;
    }
  });

  const LAYERS: { kind: "sky" | "city" | "mall" | "plaza"; z: number; y: number; w: number }[] = [
    { kind: "sky", z: -7, y: 0.4, w: 16 },
    { kind: "city", z: -4, y: -0.3, w: 13 },
    { kind: "mall", z: -1, y: -0.9, w: 10 },
    { kind: "plaza", z: 2.4, y: -2.1, w: 11 },
  ];

  return (
    <>
      <Stars radius={40} depth={20} count={900} factor={2.5} fade speed={0.5} />
      <group ref={sway}>
        {LAYERS.map((l) => (
          <mesh key={l.kind} position={[0, l.y, l.z]}>
            <planeGeometry args={[l.w, l.w / 2]} />
            <meshBasicMaterial
              map={layerTexture(l.kind)}
              transparent
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
      <ambientLight intensity={0.6} />
      <Rig prog={prog} dist={8.6} height={0.22} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  exported canvas                                                    */
/* ------------------------------------------------------------------ */

export default function LaunchScene({
  variant,
  prog,
}: {
  variant: LaunchVariant;
  prog: Prog;
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 46, near: 0.1, far: 120, position: [0, 2, 14] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#04050a"]} />
      {variant !== "center" && <Stars radius={50} depth={30} count={1100} factor={3} fade speed={0.6} />}
      {variant === "core" && <CoreVariant prog={prog} />}
      {variant === "mall" && <MallVariant prog={prog} />}
      {variant === "weather" && <WeatherVariant prog={prog} />}
      {variant === "blog" && <BlogVariant prog={prog} />}
      {variant === "center" && <CenterVariant prog={prog} />}
    </Canvas>
  );
}
