import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { createCanvas } from "./canvasUtils";

const CYCLE = 3.2; // seconds per slam

const plateTex = () =>
  createCanvas(1024, 256, (ctx) => {
    ctx.fillStyle = "#1a0508";
    ctx.fillRect(0, 0, 1024, 256);
    ctx.strokeStyle = "#f87171";
    ctx.lineWidth = 10;
    ctx.strokeRect(14, 14, 996, 228);
    ctx.fillStyle = "#f87171";
    ctx.font = "800 118px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BANNED", 512, 112);
    ctx.fillStyle = "#fca5a5";
    ctx.font = "600 30px 'JetBrains Mono', monospace";
    ctx.fillText("DURATION: PERMANENT · 02.10.2026", 512, 200);
  }).texture;

const chipTex = (label: string, color: string) =>
  createCanvas(256, 96, (ctx) => {
    ctx.fillStyle = "#0b0f1a";
    ctx.fillRect(0, 0, 256, 96);
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 244, 84);
    ctx.fillStyle = color;
    ctx.font = "800 34px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 128, 50);
  }).texture;

const CHIPS: [string, string][] = [
  ["WARN 1", "#38bdf8"],
  ["WARN 2", "#a78bfa"],
  ["WARN 3", "#f87171"],
  ["WARN 4", "#fbbf24"],
  ["MUTE 1H", "#fb923c"],
  ["UNMUTE", "#64748b"],
  ["BAN", "#ef4444"],
];

/** 0 = raised, 1 = impact. Returns hammer angle + time since impact. */
function hammerPhase(t: number) {
  const p = (t % CYCLE) / CYCLE;
  // 0–0.55 raise slowly, 0.55–0.62 slam, 0.62–1 hold
  let angle: number;
  let since = -1;
  if (p < 0.55) {
    const k = p / 0.55;
    angle = -1.15 * (1 - Math.pow(1 - k, 2));
  } else if (p < 0.62) {
    const k = (p - 0.55) / 0.07;
    angle = -1.15 * (1 - k * k);
  } else {
    angle = 0;
    since = (p - 0.62) * CYCLE;
  }
  return { angle, since };
}

function Scene() {
  const hammer = useRef<THREE.Group>(null);
  const wave = useRef<THREE.Mesh>(null);
  const wave2 = useRef<THREE.Mesh>(null);
  const flash = useRef<THREE.PointLight>(null);
  const plate = useRef<THREE.MeshBasicMaterial>(null);
  const chips = useRef<THREE.Group>(null);
  const sparks = useRef<THREE.Points>(null);
  const plateMap = useMemo(plateTex, []);
  const chipMaps = useMemo(() => CHIPS.map(([l, c]) => chipTex(l, c)), []);

  const sparkGeo = useMemo(() => {
    const n = 140;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const vel = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 1.2 + Math.random() * 2.6;
      vel[i * 3] = Math.cos(a) * s;
      vel[i * 3 + 1] = 1.5 + Math.random() * 3;
      vel[i * 3 + 2] = Math.sin(a) * s;
    }
    g.userData.vel = vel;
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { angle, since } = hammerPhase(t);
    if (hammer.current) hammer.current.rotation.z = angle;

    const hit = since >= 0 ? since : 99;
    const shock = Math.max(0, 1 - hit / 0.9);

    // shockwaves
    if (wave.current) {
      const s = 0.4 + Math.min(hit, 1.2) * 4.2;
      wave.current.scale.set(s, s, s);
      (wave.current.material as THREE.MeshBasicMaterial).opacity = shock * 0.8;
    }
    if (wave2.current) {
      const s = 0.3 + Math.min(hit, 1.2) * 2.6;
      wave2.current.scale.set(s, s, s);
      (wave2.current.material as THREE.MeshBasicMaterial).opacity = shock * 0.5;
    }
    if (flash.current) flash.current.intensity = 4 + shock * 70;
    if (plate.current) plate.current.color.setScalar(0.65 + shock * 0.8);

    // sparks
    if (sparks.current) {
      const pos = sparks.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      const vel = sparks.current.geometry.userData.vel as Float32Array;
      const tt = Math.min(hit, 1.4);
      for (let i = 0; i < pos.count; i++) {
        pos.setXYZ(
          i,
          vel[i * 3] * tt * 0.6,
          0.55 + vel[i * 3 + 1] * tt * 0.6 - 4.9 * tt * tt * 0.6,
          vel[i * 3 + 2] * tt * 0.6,
        );
      }
      pos.needsUpdate = true;
      (sparks.current.material as THREE.PointsMaterial).opacity = shock;
    }

    // orbiting case chips
    if (chips.current) {
      chips.current.rotation.y = t * 0.22;
      chips.current.children.forEach((c, i) => {
        c.position.y = 1.4 + Math.sin(t * 1.2 + i) * 0.18;
        c.lookAt(state.camera.position.x, c.position.y, state.camera.position.z);
      });
    }

    // camera + shake
    const shake = shock * 0.09;
    const px = state.pointer.x;
    state.camera.position.set(
      Math.sin(t * 0.12) * 1.2 + px * 0.6 + (Math.random() - 0.5) * shake,
      2.3 + state.pointer.y * 0.3 + (Math.random() - 0.5) * shake,
      6.6,
    );
    state.camera.lookAt(0, 0.9, 0);
  });

  return (
    <>
      <color attach="background" args={["#060306"]} />
      <fog attach="fog" args={["#060306", 8, 20]} />
      <Stars radius={40} depth={20} count={700} factor={2.5} fade speed={0.4} />
      <ambientLight intensity={0.25} />
      <spotLight position={[0, 6, 2]} angle={0.55} penumbra={0.9} intensity={60} color="#fecaca" />
      <pointLight ref={flash} position={[0, 1.2, 0.8]} distance={9} color="#ef4444" intensity={4} />
      <pointLight position={[-4, 2, -2]} intensity={6} distance={10} color="#7c3aed" />

      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <circleGeometry args={[12, 64]} />
        <meshStandardMaterial color="#0d0709" roughness={0.9} />
      </mesh>
      <gridHelper args={[24, 48, "#3b0d14", "#1c0a0e"]} position={[0, -0.59, 0]} />

      {/* sound block / pedestal */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.25, 1.4, 1.1, 48]} />
        <meshStandardMaterial color="#1c1012" roughness={0.45} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.06, 48]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      {/* BANNED plate on the front */}
      <mesh position={[0, -0.05, 1.33]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2.1, 0.52]} />
        <meshBasicMaterial ref={plate} map={plateMap} toneMapped={false} />
      </mesh>

      {/* shockwaves */}
      <mesh ref={wave} position={[0, -0.57, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 64]} />
        <meshBasicMaterial color="#f87171" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={wave2} position={[0, 0.56, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 1, 64]} />
        <meshBasicMaterial color="#fde68a" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* sparks */}
      <points ref={sparks} geometry={sparkGeo}>
        <pointsMaterial
          size={0.06}
          color="#fdba74"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* THE BAN HAMMER — pivot at the end of the handle */}
      <group ref={hammer} position={[2.6, 1.05, 0]}>
        {/* handle */}
        <mesh position={[-1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.09, 2.6, 16]} />
          <meshStandardMaterial color="#3f1d0f" roughness={0.6} />
        </mesh>
        {/* grip bands */}
        {[-0.25, -0.45].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
            <meshStandardMaterial color="#d4a017" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        {/* head */}
        <group position={[-2.6, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.38, 0.38, 1.0, 32]} />
            <meshStandardMaterial color="#2a0d10" roughness={0.35} metalness={0.5} />
          </mesh>
          {[-0.42, 0.42].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <cylinderGeometry args={[0.41, 0.41, 0.12, 32]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#ef4444"
                emissiveIntensity={1.4}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* orbiting record of cases */}
      <group ref={chips}>
        {chipMaps.map((map, i) => {
          const a = (i / chipMaps.length) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 3.3, 1.4, Math.sin(a) * 3.3]}>
              <planeGeometry args={[0.9, 0.34]} />
              <meshBasicMaterial map={map} toneMapped={false} side={THREE.DoubleSide} transparent />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

export default function BanHammer() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 42, near: 0.1, far: 60, position: [0, 2.3, 6.6] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene />
    </Canvas>
  );
}
