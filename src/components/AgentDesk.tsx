import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createCanvas, roundRect } from "@/canvasUtils";

/* ------------------------------------------------------------------ */
/*  Terminal screen painting                                           */
/* ------------------------------------------------------------------ */

function lineColor(l: string) {
  if (l.startsWith("$")) return "#22d3ee";
  if (l.includes("[tunnel]")) return "#4ade80";
  if (l.includes("[agent]")) return "#a78bfa";
  if (l.includes("[server]")) return "#facc15";
  if (l.includes("[note]") || l.includes("[fallback]")) return "#94a3b8";
  return "#cbd5e1";
}

function drawTerminal(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  time: number,
  control: boolean,
) {
  const W = 1024;
  const H = 576;
  ctx.fillStyle = "#070b12";
  ctx.fillRect(0, 0, W, H);

  // header bar
  roundRect(ctx, 0, 0, W, 56, 0);
  ctx.fillStyle = "#0d1420";
  ctx.fill();
  const dots = ["#f87171", "#facc15", "#4ade80"];
  dots.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(30 + i * 26, 28, 8, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#7dd3fc";
  ctx.font = "600 22px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText("agent@asin39k — ~/machine", 120, 35);
  if (control) {
    ctx.fillStyle = `rgba(248,113,113,${0.6 + 0.4 * Math.sin(time * 6)})`;
    ctx.font = "700 20px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillText("● REMOTE CONTROL ACTIVE", W - 30, 35);
    ctx.textAlign = "left";
  }

  // lines
  ctx.font = "400 21px 'JetBrains Mono', monospace";
  const visible = lines.slice(-15);
  visible.forEach((l, i) => {
    const y = 100 + i * 30;
    ctx.fillStyle = lineColor(l);
    const txt = l.length > 74 ? "…" + l.slice(l.length - 73) : l;
    ctx.fillText(txt, 30, y);
  });

  // prompt + cursor
  const cy = 100 + visible.length * 30;
  if (cy < H - 30) {
    ctx.fillStyle = "#22d3ee";
    ctx.fillText("$ ", 30, cy);
    if (Math.sin(time * 5) > -0.2) {
      ctx.fillStyle = "#22d3ee";
      ctx.fillRect(58, cy - 20, 12, 22);
    }
  }

  // remote cursor
  if (control) {
    const cx = W * 0.5 + Math.sin(time * 0.9) * W * 0.3;
    const cyy = H * 0.5 + Math.sin(time * 1.3) * H * 0.28;
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.moveTo(cx, cyy);
    ctx.lineTo(cx + 16, cyy + 22);
    ctx.lineTo(cx + 8, cyy + 23);
    ctx.lineTo(cx + 11, cyy + 34);
    ctx.lineTo(cx + 5, cyy + 36);
    ctx.lineTo(cx + 2, cyy + 25);
    ctx.lineTo(cx - 4, cyy + 26);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // scanlines
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  for (let sy = 0; sy < H; sy += 4) ctx.fillRect(0, sy, W, 2);
}

/* ------------------------------------------------------------------ */
/*  The desk                                                           */
/* ------------------------------------------------------------------ */

function DeskScene({
  lines,
  control,
}: {
  lines: string[];
  control: boolean;
}) {
  const { ctx, texture } = useMemo(() => createCanvas(1024, 576), []);
  const linesRef = useRef(lines);
  linesRef.current = lines;
  const controlRef = useRef(control);
  controlRef.current = control;

  const robot = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const rgb = useRef<THREE.Mesh>(null);
  const leds = useRef<THREE.Mesh[]>([]);
  const glowRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      drawTerminal(ctx, linesRef.current, performance.now() / 1000, controlRef.current);
      texture.needsUpdate = true;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ctx, texture]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (robot.current) {
      robot.current.position.y = 1.12 + Math.sin(t * 1.4) * 0.045;
      robot.current.rotation.y = Math.sin(t * 0.6) * 0.5;
    }
    if (ring.current) {
      ring.current.rotation.z = t * 1.2;
      ring.current.rotation.x = Math.PI / 2 + Math.sin(t) * 0.15;
    }
    if (rgb.current) {
      (rgb.current.material as THREE.MeshStandardMaterial).color.setHSL(
        (t * 0.08) % 1,
        0.85,
        0.55,
      );
      (rgb.current.material as THREE.MeshStandardMaterial).emissive.setHSL(
        (t * 0.08) % 1,
        0.9,
        0.45,
      );
    }
    leds.current.forEach((led, i) => {
      const m = led.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.4 + 2.4 * (0.5 + 0.5 * Math.sin(t * (2 + i) + i));
    });
    if (glowRef.current) {
      glowRef.current.intensity = 5 + Math.sin(t * 2.2) * 0.6;
    }
    // slow orbit
    const a = t * 0.1;
    state.camera.position.x = Math.sin(a) * 2.5 + state.pointer.x * 0.4;
    state.camera.position.y = 1.55 + Math.sin(t * 0.13) * 0.1 + state.pointer.y * 0.15;
    state.camera.position.z = Math.cos(a) * 2.5 + 1.1;
    state.camera.lookAt(0, 1.0, -1.3);
  });

  return (
    <>
      <fog attach="fog" args={["#04050a", 5, 13]} />
      <ambientLight intensity={0.2} />
      <hemisphereLight args={["#1e293b", "#02030a", 0.35]} />
      <pointLight ref={glowRef} position={[0, 1.2, -0.9]} intensity={5} distance={4.5} color="#34d399" />
      <pointLight position={[1.6, 0.9, 0.2]} intensity={3} distance={4} color="#a78bfa" />

      {/* room */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.8]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#0a0d14" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2, -1.75]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color="#0e131e" roughness={0.9} />
      </mesh>

      {/* wall poster: the ban certificate */}
      <group position={[-1.55, 1.7, -1.7]} rotation={[0, 0.12, 0]}>
        <mesh>
          <planeGeometry args={[0.95, 0.72]} />
          <meshStandardMaterial color="#141a28" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.85, 0.62]} />
          <meshBasicMaterial map={banTexture} toneMapped={false} />
        </mesh>
      </group>

      {/* desk */}
      <mesh position={[0, 0.74, -1.25]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.07, 1.0]} />
        <meshStandardMaterial color="#1b2334" roughness={0.65} />
      </mesh>
      {[
        [-1.38, -0.9],
        [1.38, -0.9],
        [-1.38, -1.6],
        [1.38, -1.6],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.37, z]}>
          <boxGeometry args={[0.09, 0.74, 0.09]} />
          <meshStandardMaterial color="#131a28" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}

      {/* main monitor */}
      <group position={[-0.25, 0, -1.55]}>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[1.9, 1.1, 0.07]} />
          <meshStandardMaterial color="#0b0e16" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.2, 0.045]}>
          <planeGeometry args={[1.76, 0.96]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.85, -0.02]}>
          <boxGeometry args={[0.16, 0.2, 0.14]} />
          <meshStandardMaterial color="#0b0e16" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.79, 0]}>
          <cylinderGeometry args={[0.26, 0.3, 0.03, 24]} />
          <meshStandardMaterial color="#0b0e16" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>

      {/* laptop */}
      <group position={[1.15, 0.78, -1.05]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, 0.09, 0.14]} rotation={[-0.32, 0, 0]}>
          <boxGeometry args={[0.62, 0.4, 0.03]} />
          <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.09, 0.155]}>
          <planeGeometry args={[0.56, 0.34]} />
          <meshBasicMaterial map={laptopTexture} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.62, 0.42, 0.025]} />
          <meshStandardMaterial color="#1f2937" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>

      {/* keyboard + mouse */}
      <mesh position={[-0.25, 0.79, -0.72]} rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[0.95, 0.03, 0.32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
      <mesh position={[0.62, 0.79, -0.72]}>
        <boxGeometry args={[0.11, 0.05, 0.17]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>

      {/* server tower */}
      <group position={[1.55, 0, -1.75]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.42, 0.84, 0.55]} />
          <meshStandardMaterial color="#0c111c" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* glass side */}
        <mesh position={[0.215, 0.42, 0]}>
          <planeGeometry args={[0.36, 0.76]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.08}
            roughness={0.1}
            metalness={0.2}
          />
        </mesh>
        {/* rgb strip */}
        <mesh ref={rgb} position={[0.222, 0.42, 0]}>
          <planeGeometry args={[0.05, 0.7]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
        {/* LEDs */}
        {[0.62, 0.5, 0.38].map((y, i) => (
          <mesh
            key={i}
            ref={(m) => {
              if (m) leds.current[i] = m;
            }}
            position={[0.222, y, 0.2]}
          >
            <sphereGeometry args={[0.018, 10, 10]} />
            <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* THE AGENT — hovering robot */}
      <group ref={robot} position={[0.55, 1.12, -0.95]}>
        <mesh>
          <boxGeometry args={[0.24, 0.2, 0.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <boxGeometry args={[0.17, 0.12, 0.15]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* eye */}
        <mesh position={[0, 0.17, 0.08]}>
          <sphereGeometry args={[0.035, 14, 14]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        {/* antenna */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.16, 8]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0, 0.39, 0]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        {/* arms */}
        {[-0.15, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <capsuleGeometry args={[0.02, 0.12, 4, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        ))}
      </group>
      {/* hover ring */}
      <mesh ref={ring} position={[0.55, 0.95, -0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.012, 10, 40]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} />
      </mesh>

      {/* cables */}
      <mesh position={[1.05, 0.72, -1.5]} rotation={[0, 0.4, 0]}>
        <torusGeometry args={[0.22, 0.018, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* sticky notes on wall */}
      {[
        ["#facc15", -2.4, 1.9, -1.68, 0.1],
        ["#4ade80", 2.35, 1.75, -1.68, -0.12],
      ].map(([c, x, y, z, rz], i) => (
        <mesh key={i} position={[x as number, y as number, z as number]} rotation={[0, 0, rz as number]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshStandardMaterial color={c as string} roughness={0.95} />
        </mesh>
      ))}
    </>
  );
}

const banTexture = createCanvas(512, 384, (ctx) => {
  ctx.fillStyle = "#161d2e";
  ctx.fillRect(0, 0, 512, 384);
  ctx.strokeStyle = "#f87171";
  ctx.lineWidth = 6;
  ctx.strokeRect(16, 16, 480, 352);
  ctx.strokeStyle = "rgba(248,113,113,0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, 452, 324);
  ctx.fillStyle = "#f87171";
  ctx.font = "800 40px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("OFFICIAL NOTICE", 256, 100);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "700 30px 'JetBrains Mono', monospace";
  ctx.fillText("PERMANENTLY BANNED", 256, 165);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "400 22px 'JetBrains Mono', monospace";
  ctx.fillText("arena discord · channel misuse", 256, 215);
  ctx.fillText("appeal: REJECTED", 256, 250);
  ctx.fillStyle = "#f87171";
  ctx.font = "700 22px 'JetBrains Mono', monospace";
  ctx.fillText("asin39k", 256, 310);
}).texture;

const laptopTexture = createCanvas(512, 320, (ctx) => {
  ctx.fillStyle = "#0b1220";
  ctx.fillRect(0, 0, 512, 320);
  ctx.fillStyle = "#4ade80";
  ctx.font = "400 22px 'JetBrains Mono', monospace";
  ctx.fillText("$ agent status", 30, 60);
  ctx.fillStyle = "#a78bfa";
  ctx.fillText("[agent] tunnel: ONLINE", 30, 100);
  ctx.fillStyle = "#facc15";
  ctx.fillText("[server] localhost:5173", 30, 140);
  ctx.fillStyle = "#22d3ee";
  ctx.fillText("no MKEP required", 30, 180);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  for (let y = 0; y < 320; y += 4) ctx.fillRect(0, y, 512, 2);
}).texture;

/* ------------------------------------------------------------------ */

export default function AgentDesk({
  lines,
  control,
}: {
  lines: string[];
  control: boolean;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 40, near: 0.1, far: 40, position: [2.5, 1.55, 2.2] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <DeskScene lines={lines} control={control} />
    </Canvas>
  );
}
