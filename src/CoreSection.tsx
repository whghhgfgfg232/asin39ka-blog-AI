import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { LaunchFn } from "../App";

/* ---------------- temperature → colour ---------------- */

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
      const k = (t - t0) / (t1 - t0);
      out.set(c0).lerp(new THREE.Color(c1), k);
      return out;
    }
  }
  return out.set(STOPS[STOPS.length - 1][1]);
}

/* ---------------- game state ---------------- */

type GameState = {
  temp: number;
  stability: number;
  score: number;
  target: [number, number];
  holdT: number;
  meltdown: number;
  best: number;
};

function newTarget(s: GameState) {
  const c = 950 + Math.random() * 480;
  const w = 90 + Math.random() * 70;
  s.target = [Math.round(c - w / 2), Math.round(c + w / 2)];
}

function initState(): GameState {
  const s: GameState = {
    temp: 800,
    stability: 100,
    score: 0,
    target: [1100, 1220],
    holdT: 0,
    meltdown: 0,
    best: 0,
  };
  return s;
}

/* ---------------- 3D scene ---------------- */

function CoreScene({ stateRef }: { stateRef: React.RefObject<GameState> }) {
  const core = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const cage = useRef<THREE.Mesh>(null);
  const column = useRef<THREE.Mesh>(null);
  const band = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const coreLight = useRef<THREE.PointLight>(null);
  const particles = useRef<THREE.Points>(null);
  const color = useMemo(() => new THREE.Color(), []);

  const pGeo = useMemo(() => {
    const n = 320;
    const pos = new Float32Array(n * 3);
    const speed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.25 + Math.random() * 0.85;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.random() * 2.2;
      pos[i * 3 + 2] = Math.sin(a) * r;
      speed[i] = 0.4 + Math.random() * 1.2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.userData.speed = speed;
    return g;
  }, []);

  useFrame((state, dt) => {
    const s = stateRef.current;
    if (!s) return;
    const t = state.clock.elapsedTime;
    const h = (s.temp - 800) / 800;
    const inBand = s.temp >= s.target[0] && s.temp <= s.target[1];
    const melting = s.meltdown > 0;

    tempColor(s.temp, color);

    if (core.current) {
      const m = core.current.material as THREE.MeshStandardMaterial;
      m.color.copy(color);
      m.emissive.copy(color);
      m.emissiveIntensity = 0.5 + h * 2.4 + (melting ? 3 : 0);
      const pulse = 1 + Math.sin(t * (1.5 + h * 7)) * (0.02 + h * 0.05);
      core.current.scale.setScalar(pulse * (1 + h * 0.1));
      core.current.rotation.y += dt * (0.15 + h * 0.5);
      core.current.rotation.x += dt * 0.07;
    }
    if (glow.current) {
      const m = glow.current.material as THREE.MeshBasicMaterial;
      m.color.copy(color);
      m.opacity = 0.16 + h * 0.5 + (melting ? 0.5 : 0);
      glow.current.scale.setScalar(1.05 + h * 0.35 + Math.sin(t * 3) * 0.02);
    }
    if (cage.current) {
      cage.current.rotation.y -= dt * (0.1 + h * 0.35);
      cage.current.rotation.z += dt * 0.05;
      const m = cage.current.material as THREE.MeshBasicMaterial;
      m.color.copy(color);
      m.opacity = 0.25 + h * 0.5;
      m.wireframe = true;
    }
    if (column.current) {
      column.current.rotation.y += dt * 0.08;
    }
    if (band.current) {
      const [lo, hi] = s.target;
      const y0 = 0.25 + ((lo - 800) / 800) * 1.65;
      const y1 = 0.25 + ((hi - 800) / 800) * 1.65;
      band.current.scale.y = Math.max(0.02, y1 - y0);
      band.current.position.y = (y0 + y1) / 2;
      const m = band.current.material as THREE.MeshBasicMaterial;
      m.color.set(inBand && !melting ? "#4ade80" : "#22d3ee");
      m.opacity = inBand ? 0.55 + Math.sin(t * 8) * 0.2 : 0.22;
    }
    if (light.current) {
      light.current.color.copy(color);
      light.current.intensity = 6 + h * 26 + (melting ? 40 : 0);
    }
    if (coreLight.current) {
      coreLight.current.color.copy(color);
      coreLight.current.intensity = 2 + h * 6;
    }

    // heat particles
    if (particles.current) {
      const attr = particles.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      const speed = particles.current.geometry.userData.speed as Float32Array;
      for (let i = 0; i < attr.count; i++) {
        let y = attr.getY(i) + dt * speed[i] * (0.25 + h * 1.5);
        if (y > 2.3) y = 0.05;
        attr.setY(i, y);
      }
      attr.needsUpdate = true;
      const m = particles.current.material as THREE.PointsMaterial;
      m.color.copy(color);
      m.opacity = 0.12 + h * 0.6;
      m.size = 0.015 + h * 0.03;
    }
  });

  return (
    <>
      <color attach="background" args={["#04050a"]} />
      <Stars radius={60} depth={40} count={1400} factor={3} fade speed={0.6} />
      <ambientLight intensity={0.25} />
      <hemisphereLight args={["#0f172a", "#02030a", 0.4]} />

      {/* reactor platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[2.6, 64]} />
        <meshStandardMaterial color="#0a0f18" roughness={0.85} metalness={0.2} />
      </mesh>
      <gridHelper args={[10, 40, "#0e3a4a", "#0a2230"]} position={[0, 0.03, 0]} />

      {/* containment column */}
      <mesh ref={column} position={[0, 1.1, 0]}>
        <cylinderGeometry args={[1.05, 1.15, 2.1, 48, 1, true]} />
        <meshStandardMaterial
          color="#0f172a"
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>
      {/* column rings */}
      {[0.28, 1.05, 1.9].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.08, 0.022, 10, 64]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* target band marker */}
      <mesh ref={band} position={[0, 1, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 1, 32, 1, true]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* THE CORE */}
      <mesh ref={core} position={[0, 1.12, 0]}>
        <icosahedronGeometry args={[0.52, 2]} />
        <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={1.4} roughness={0.25} />
      </mesh>
      <mesh ref={glow} position={[0, 1.12, 0]}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshBasicMaterial color="#ff7a00" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={cage} position={[0, 1.12, 0]}>
        <icosahedronGeometry args={[0.86, 1]} />
        <meshBasicMaterial color="#ffc400" wireframe transparent opacity={0.4} />
      </mesh>

      {/* heat particles */}
      <points ref={particles} geometry={pGeo}>
        <pointsMaterial
          size={0.02}
          color="#ff7a00"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <pointLight ref={light} position={[0, 1.12, 0]} intensity={10} distance={9} color="#ff7a00" />
      <pointLight ref={coreLight} position={[2.2, 2.4, 2.2]} intensity={2} distance={10} color="#38bdf8" />
      <spotLight position={[0, 4.2, 1.5]} angle={0.5} penumbra={1} intensity={30} color="#bae6fd" />

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={3}
        maxDistance={8}
        minPolarAngle={0.6}
        maxPolarAngle={1.65}
        autoRotate
        autoRotateSpeed={0.7}
        enableDamping
      />
    </>
  );
}

/* ---------------- section + game loop ---------------- */

const MIN = 800;
const MAX = 1600;

export default function CoreSection({ launch }: { launch: LaunchFn }) {
  const stateRef = useRef<GameState>(initState());
  const [hud, setHud] = useState({
    temp: 800,
    stability: 100,
    score: 0,
    best: 0,
    target: [1100, 1220] as [number, number],
    meltdown: 0,
  });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let hudT = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = stateRef.current;

      if (s.meltdown > 0) {
        s.meltdown = Math.max(0, s.meltdown - dt);
      } else {
        // passive heating — the hotter it gets, the faster it runs away
        const level = 1 + Math.min(2.2, s.score / 1400);
        const runaway = s.temp > 1380 ? 2.1 : 1;
        s.temp += (9 + level * 6) * dt * runaway;

        if (s.temp >= s.target[0] && s.temp <= s.target[1]) {
          s.score += 14 * dt;
          s.stability = Math.min(100, s.stability + 9 * dt);
          s.holdT += dt;
          if (s.holdT > 7) {
            newTarget(s);
            s.holdT = 0;
          }
        } else {
          s.stability -= 15 * dt;
          s.holdT = 0;
        }
        if (s.temp >= MAX) {
          s.temp = MAX;
          s.stability -= 26 * dt;
        }
        if (s.temp <= MIN) s.temp = MIN;

        if (s.stability <= 0) {
          s.best = Math.max(s.best, Math.floor(s.score));
          s.meltdown = 1.7;
          s.score = 0;
          s.stability = 55;
          s.temp = 880;
        }
      }

      hudT += dt;
      if (hudT > 0.1) {
        hudT = 0;
        setHud({
          temp: Math.round(s.temp),
          stability: Math.max(0, Math.round(s.stability)),
          score: Math.floor(s.score),
          best: s.best,
          target: [...s.target] as [number, number],
          meltdown: s.meltdown,
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const adjust = (d: number) => {
    const s = stateRef.current;
    if (s.meltdown > 0) return;
    s.temp = Math.min(MAX, Math.max(MIN, s.temp + d));
  };

  const inBand = hud.temp >= hud.target[0] && hud.temp <= hud.target[1];
  const pct = ((hud.temp - MIN) / (MAX - MIN)) * 100;
  const bandLeft = ((hud.target[0] - MIN) / (MAX - MIN)) * 100;
  const bandWidth = ((hud.target[1] - hud.target[0]) / (MAX - MIN)) * 100;

  return (
    <section id="core" className="relative min-h-screen overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Canvas dpr={[1, 1.6]} camera={{ fov: 45, near: 0.1, far: 120, position: [3.4, 2.1, 3.8] }}>
          <CoreScene stateRef={stateRef} />
        </Canvas>
      </div>
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="vignette pointer-events-none absolute inset-0" />

      {/* meltdown flash */}
      {hud.meltdown > 0 && (
        <div
          className="pointer-events-none absolute inset-0 z-20 bg-rose-500/30"
          style={{ opacity: Math.min(0.8, hud.meltdown) }}
        />
      )}

      <div className="pointer-events-none absolute left-0 right-0 top-24 z-10 px-6 text-center sm:top-28">
        <div className="pointer-events-auto inline-block">
          <div className="mb-2 font-mono text-[11px] tracking-[0.5em] text-amber-300/80">
            SCENE 03 · 3D GAME
          </div>
          <h2 className="glow-cyan text-4xl font-bold text-white sm:text-6xl">THE CORE</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            Control the core. Temperature ranges from{" "}
            <span className="font-mono text-amber-300">800</span> to{" "}
            <span className="font-mono text-amber-300">1600</span> degrees. Keep it inside the
            green band — it heats up on its own.
          </p>
        </div>
      </div>

      {/* HUD */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 sm:px-8 sm:pb-10">
        <div className="panel mx-auto max-w-3xl rounded-2xl p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] tracking-[0.35em] text-slate-500">
                CORE TEMPERATURE
              </div>
              <div
                className={`font-mono text-5xl font-extrabold tabular-nums ${
                  hud.meltdown > 0
                    ? "text-rose-400"
                    : inBand
                      ? "text-emerald-300"
                      : "text-amber-300"
                }`}
                style={{ textShadow: "0 0 24px currentColor" }}
              >
                {hud.temp}
                <span className="text-lg">°C</span>
              </div>
            </div>
            <div className="flex gap-6 font-mono text-sm">
              <div>
                <div className="text-[9px] tracking-[0.3em] text-slate-500">SCORE</div>
                <div className="text-xl font-bold text-cyan-300 tabular-nums">{hud.score}</div>
              </div>
              <div>
                <div className="text-[9px] tracking-[0.3em] text-slate-500">BEST</div>
                <div className="text-xl font-bold text-violet-300 tabular-nums">{hud.best}</div>
              </div>
              <div>
                <div className="text-[9px] tracking-[0.3em] text-slate-500">TARGET</div>
                <div className="text-xl font-bold text-emerald-300 tabular-nums">
                  {hud.target[0]}–{hud.target[1]}
                </div>
              </div>
            </div>
          </div>

          {/* gauge */}
          <div className="relative mt-4 h-6 overflow-hidden rounded-full border border-slate-600/40 bg-slate-950/70">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-600 via-amber-400 to-cyan-200"
              style={{ width: `${pct}%`, opacity: 0.85 }}
            />
            <div
              className="absolute inset-y-0 border-x-2 border-emerald-400 bg-emerald-400/20"
              style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3 font-mono text-[10px] text-slate-300 mix-blend-difference">
              <span>800°</span>
              <span>1600°</span>
            </div>
          </div>

          {/* stability */}
          <div className="mt-3 flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.3em] text-slate-500">
              CONTAINMENT
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all ${
                  hud.stability > 50
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                    : "bg-gradient-to-r from-rose-600 to-orange-400"
                }`}
                style={{ width: `${hud.stability}%` }}
              />
            </div>
            <span className="font-mono text-xs text-slate-300 tabular-nums">{hud.stability}%</span>
          </div>

          {/* controls */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => launch("core")}
              className="w-full rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 font-mono text-[11px] font-bold tracking-[0.25em] text-amber-200 transition hover:bg-amber-400/20 hover:text-white"
            >
              ▶ LAUNCH THE ORIGINAL CORE
            </button>
            <button
              onClick={() => adjust(-220)}
              className="flex-1 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 font-mono text-sm font-bold tracking-widest text-cyan-200 transition hover:bg-cyan-400/20 hover:text-white active:scale-95"
            >
              VENT −220°
            </button>
            <button
              onClick={() => adjust(-70)}
              className="flex-1 rounded-xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 font-mono text-sm font-bold tracking-widest text-sky-200 transition hover:bg-sky-400/20 hover:text-white active:scale-95"
            >
              COOL −70°
            </button>
            <button
              onClick={() => adjust(70)}
              className="flex-1 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 font-mono text-sm font-bold tracking-widest text-amber-200 transition hover:bg-amber-400/20 hover:text-white active:scale-95"
            >
              HEAT +70°
            </button>
          </div>
          <div className="mt-3 text-center font-mono text-[11px] tracking-widest">
            {hud.meltdown > 0 ? (
              <span className="text-rose-400">⚠ CONTAINMENT FAILURE — REACTOR RESET</span>
            ) : inBand ? (
              <span className="text-emerald-300">● STABLE — HOLD THE BAND FOR POINTS</span>
            ) : (
              <span className="text-amber-300">○ UNSTABLE — RETURN TO THE GREEN BAND</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
