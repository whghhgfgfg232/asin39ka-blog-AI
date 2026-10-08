import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createCanvas, roundRect, wrapText } from "@/canvasUtils";

export type ChatMsg = { role: "user" | "ai"; text: string };

/* ------------------------------------------------------------------ */
/*  Screen painting                                                    */
/* ------------------------------------------------------------------ */

function drawChat(
  ctx: CanvasRenderingContext2D,
  messages: ChatMsg[],
  reveal: number,
  thinking: boolean,
  time: number,
) {
  const W = 1024;
  const H = 576;
  ctx.clearRect(0, 0, W, H);

  // background
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#0a1322");
  g.addColorStop(1, "#04060c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // grid
  ctx.strokeStyle = "rgba(34,211,238,0.06)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 42) {
    ctx.beginPath();
    ctx.moveTo(x, 96);
    ctx.lineTo(x, H - 64);
    ctx.stroke();
  }
  for (let y = 96; y <= H - 64; y += 42) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // header
  ctx.fillStyle = "#22d3ee";
  ctx.font = "800 27px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText("AI // TV-LINK", 36, 50);
  ctx.font = "400 17px 'JetBrains Mono', monospace";
  ctx.fillStyle = "#7dd3fc";
  ctx.fillText("resident intelligence · room_01 · asin39k", 36, 76);
  const pulse = 0.55 + 0.45 * Math.sin(time * 3);
  ctx.fillStyle = `rgba(74,222,128,${pulse})`;
  ctx.beginPath();
  ctx.arc(W - 44, 44, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "400 15px 'JetBrains Mono', monospace";
  ctx.fillStyle = "#4ade80";
  ctx.textAlign = "right";
  ctx.fillText("ONLINE", W - 60, 49);
  ctx.textAlign = "left";

  // build bubbles (only the ones that fit)
  ctx.font = "400 21px 'JetBrains Mono', monospace";
  const maxW = W - 260;
  type Item = { role: "user" | "ai"; text: string };
  const items: Item[] = messages.map((m) => ({ ...m }));
  if (thinking) items.push({ role: "ai", text: "@@typing@@" });
  const last = items[items.length - 1];

  const prepared = items.map((m) => {
    const shown = m === last && m.role === "ai" && m.text !== "@@typing@@" ? m.text.slice(0, Math.floor(reveal)) : m.text;
    const lines =
      m.text === "@@typing@@"
        ? ["· · ·"]
        : wrapText(ctx, shown, maxW - 64);
    const bw = Math.min(
      maxW,
      Math.max(80, ...lines.map((l) => ctx.measureText(l).width)) + 62,
    );
    const bh = lines.length * 29 + 34;
    return { role: m.role, lines, bw, bh };
  });

  let total = prepared.reduce((s, p) => s + p.bh + 16, 0);
  let start = 0;
  while (total > H - 210 && start < prepared.length - 1) {
    total -= prepared[start].bh + 16;
    start++;
  }

  let y = 118;
  for (let i = start; i < prepared.length; i++) {
    const p = prepared[i];
    const x = p.role === "user" ? W - 36 - p.bw : 36;
    roundRect(ctx, x, y, p.bw, p.bh, 14);
    ctx.fillStyle =
      p.role === "user" ? "rgba(34,211,238,0.13)" : "rgba(167,139,250,0.11)";
    ctx.fill();
    ctx.strokeStyle =
      p.role === "user" ? "rgba(34,211,238,0.6)" : "rgba(167,139,250,0.55)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = p.role === "user" ? "#dffaff" : "#f1ebff";
    p.lines.forEach((l, li) => ctx.fillText(l, x + 30, y + 36 + li * 29));
    y += p.bh + 16;
  }

  // input bar
  roundRect(ctx, 36, H - 52, W - 72, 38, 12);
  ctx.fillStyle = "rgba(148,163,184,0.08)";
  ctx.fill();
  ctx.strokeStyle = "rgba(148,163,184,0.25)";
  ctx.stroke();
  ctx.fillStyle = "#64748b";
  ctx.font = "400 18px 'JetBrains Mono', monospace";
  ctx.fillText("type on the tv …", 58, H - 27);
  if (Math.sin(time * 5) > 0) {
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(232, H - 42, 10, 19);
  }

  // scanlines + glow
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  for (let sy = 0; sy < H; sy += 4) ctx.fillRect(0, sy, W, 2);
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.5)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}

function posterTexture() {
  return createCanvas(512, 700, (ctx) => {
    ctx.fillStyle = "#0b1120";
    ctx.fillRect(0, 0, 512, 700);
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 8;
    ctx.strokeRect(24, 24, 464, 652);
    ctx.strokeStyle = "rgba(167,139,250,0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, 424, 612);
    ctx.fillStyle = "#22d3ee";
    ctx.font = "800 62px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("STUDYING", 256, 240);
    ctx.fillStyle = "#a78bfa";
    ctx.fillText("ARTIFICIAL", 256, 320);
    ctx.fillStyle = "#f472b6";
    ctx.fillText("INTELLIGENCE", 256, 400);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "400 26px 'JetBrains Mono', monospace";
    ctx.fillText("est. june 2025", 256, 480);
    ctx.strokeStyle = "rgba(34,211,238,0.35)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(80, 540 + i * 18);
      ctx.lineTo(432 - i * 24, 540 + i * 18);
      ctx.stroke();
    }
  }).texture;
}

function cityTexture() {
  return createCanvas(512, 512, (ctx) => {
    const sky = ctx.createLinearGradient(0, 0, 0, 512);
    sky.addColorStop(0, "#0a0f24");
    sky.addColorStop(1, "#1b1035");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 512, 512);
    // moon
    ctx.fillStyle = "rgba(226,232,240,0.9)";
    ctx.beginPath();
    ctx.arc(400, 90, 34, 0, Math.PI * 2);
    ctx.fill();
    // buildings
    let x = 0;
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    while (x < 512) {
      const w = 40 + rnd() * 60;
      const h = 120 + rnd() * 240;
      ctx.fillStyle = "#05070f";
      ctx.fillRect(x, 512 - h, w, h);
      for (let wy = 512 - h + 14; wy < 500; wy += 22) {
        for (let wx = x + 8; wx < x + w - 10; wx += 16) {
          if (rnd() > 0.55) {
            ctx.fillStyle = rnd() > 0.5 ? "rgba(34,211,238,0.8)" : "rgba(250,204,21,0.75)";
            ctx.fillRect(wx, wy, 7, 10);
          }
        }
      }
      x += w + 6;
    }
  }).texture;
}

/* ------------------------------------------------------------------ */
/*  The room                                                           */
/* ------------------------------------------------------------------ */

function RoomScene({ messages, thinking }: { messages: ChatMsg[]; thinking: boolean }) {
  const { ctx, texture } = useMemo(() => createCanvas(1024, 576), []);
  const poster = useMemo(posterTexture, []);
  const city = useMemo(cityTexture, []);

  const msgRef = useRef(messages);
  msgRef.current = messages;
  const thinkRef = useRef(thinking);
  thinkRef.current = thinking;
  const revealRef = useRef(1e9);
  const sigRef = useRef("");
  const tvLight = useRef<THREE.PointLight>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const spotTarget = useMemo(() => new THREE.Object3D(), []);
  const dust = useRef<THREE.Points>(null);
  const camRef = useRef<THREE.Group>(null);

  // typing reveal + screen repaint
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const msgs = msgRef.current;
      const last = msgs[msgs.length - 1];
      const sig = `${msgs.length}|${last?.role}|${last?.text.length ?? 0}|${thinkRef.current}`;
      if (sig !== sigRef.current) {
        sigRef.current = sig;
        revealRef.current = last?.role === "ai" ? 0 : 1e9;
      }
      if (revealRef.current < 1e8) {
        revealRef.current = Math.min(1e8, revealRef.current + 1.7);
      }
      drawChat(ctx, msgs, revealRef.current, thinkRef.current, performance.now() / 1000);
      texture.needsUpdate = true;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ctx, texture]);

  // dust field
  const dustGeo = useMemo(() => {
    const n = 240;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6.4;
      pos[i * 3 + 1] = 0.2 + Math.random() * 2.6;
      pos[i * 3 + 2] = -2.4 + Math.random() * 5.4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    // camera drift + mouse parallax
    const px = state.pointer.x;
    const py = state.pointer.y;
    const wide = state.size.width > state.size.height;
    const bx = wide ? 3.05 : 3.9;
    const bz = wide ? 2.85 : 4.1;
    state.camera.position.x += (bx + px * 0.45 + Math.sin(t * 0.14) * 0.3 - state.camera.position.x) * 0.03;
    state.camera.position.y += (1.95 + py * 0.18 + Math.sin(t * 0.09) * 0.07 - state.camera.position.y) * 0.03;
    state.camera.position.z += (bz + Math.cos(t * 0.11) * 0.22 - state.camera.position.z) * 0.03;
    state.camera.lookAt(-0.15, 1.3, -2.2);

    // tv flicker
    if (tvLight.current) {
      tvLight.current.intensity = 10.5 + Math.sin(t * 37) * 0.9 + (Math.random() - 0.5) * 1.4;
    }

    // dust drift
    if (dust.current) {
      const arr = dust.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < arr.count; i++) {
        let y = arr.getY(i) + dt * (0.05 + (i % 5) * 0.012);
        let x = arr.getX(i) + Math.sin(t * 0.4 + i) * 0.0012;
        if (y > 2.9) y = 0.15;
        arr.setY(i, y);
        arr.setX(i, x);
      }
      arr.needsUpdate = true;
    }
    if (camRef.current) camRef.current.rotation.y = Math.sin(t * 0.2) * 0.02;
  });

  const hoodie = "#24344d";
  const skin = "#c98d63";
  const dark = "#10151f";

  return (
    <>
      <fog attach="fog" args={["#04050a", 6, 14]} />
      <ambientLight intensity={0.16} />
      <hemisphereLight args={["#1e293b", "#02030a", 0.25]} />

      {/* ceiling lamp */}
      <primitive object={spotTarget} position={[0, 0.72, -2]} />
      <spotLight
        ref={spotRef}
        position={[0.5, 3.15, 0.3]}
        angle={0.65}
        penumbra={0.85}
        intensity={44}
        color="#ffd9a0"
        target={spotTarget}
      />
      {/* tv glow */}
      <pointLight ref={tvLight} position={[0, 1.45, -1.85]} intensity={11} distance={7.5} color="#38bdf8" />
      <pointLight position={[-1.4, 1.9, -2.2]} intensity={4} distance={5} color="#a78bfa" />
      <pointLight position={[3.1, 1.5, 0.4]} intensity={2.4} distance={6} color="#818cf8" />

      {/* room shell */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.6]} receiveShadow>
        <planeGeometry args={[11, 9]} />
        <meshStandardMaterial color="#0a0d14" roughness={0.92} metalness={0.05} />
      </mesh>
      <mesh position={[0, 2.1, -2.75]}>
        <planeGeometry args={[11, 4.4]} />
        <meshStandardMaterial color="#10141f" roughness={0.9} />
      </mesh>
      <mesh position={[-3.55, 2.1, -0.6]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[9, 4.4]} />
        <meshStandardMaterial color="#0d1119" roughness={0.9} />
      </mesh>
      <mesh position={[3.55, 2.1, -0.6]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[9, 4.4]} />
        <meshStandardMaterial color="#0d1119" roughness={0.9} />
      </mesh>

      {/* neon strips on back wall */}
      <mesh position={[-1.62, 2.55, -2.7]}>
        <boxGeometry args={[0.05, 3.4, 0.05]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
      <mesh position={[1.62, 2.55, -2.7]}>
        <boxGeometry args={[0.05, 3.4, 0.05]} />
        <meshBasicMaterial color="#a78bfa" />
      </mesh>

      {/* poster on left wall */}
      <mesh position={[-3.5, 1.75, -1.2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.85, 1.15]} />
        <meshBasicMaterial map={poster} toneMapped={false} />
      </mesh>

      {/* window on right wall */}
      <group position={[3.5, 1.7, -0.7]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[1.7, 2.1]} />
          <meshBasicMaterial map={city} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.03]}>
          <planeGeometry args={[1.9, 2.3]} />
          <meshStandardMaterial color="#0a0d14" />
        </mesh>
        <mesh position={[0, 0, 0.01]} scale={[1.78, 2.18, 1]}>
          <ringGeometry args={[0.98, 1.0, 4]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* desk */}
      <group>
        <mesh position={[0.5, 0.76, -2.02]} castShadow>
          <boxGeometry args={[2.9, 0.07, 0.95]} />
          <meshStandardMaterial color="#1c2333" roughness={0.7} />
        </mesh>
        {[
          [-0.82, -1.66],
          [1.82, -1.66],
          [-0.82, -2.38],
          [1.82, -2.38],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.38, z]}>
            <boxGeometry args={[0.08, 0.76, 0.08]} />
            <meshStandardMaterial color="#141a28" roughness={0.6} metalness={0.4} />
          </mesh>
        ))}
        {/* keyboard + mug */}
        <mesh position={[-0.1, 0.81, -1.78]} rotation={[-0.06, 0, 0]}>
          <boxGeometry args={[0.85, 0.03, 0.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[1.05, 0.85, -2.0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.14, 20]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        <mesh position={[1.14, 0.85, -2.0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.045, 0.014, 10, 20, Math.PI]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
      </group>

      {/* THE TV */}
      <group position={[0.45, 1.52, -2.68]}>
        <mesh>
          <boxGeometry args={[2.62, 1.52, 0.09]} />
          <meshStandardMaterial color="#0b0e16" roughness={0.35} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.052]}>
          <planeGeometry args={[2.44, 1.34]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        {/* stand */}
        <mesh position={[0, -0.86, 0.04]}>
          <boxGeometry args={[0.5, 0.1, 0.3]} />
          <meshStandardMaterial color="#0b0e16" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.95, 0]}>
          <boxGeometry args={[1.1, 0.05, 0.42]} />
          <meshStandardMaterial color="#0b0e16" metalness={0.6} roughness={0.35} />
        </mesh>
        {/* under-glow strip */}
        <mesh position={[0, -0.79, 0.07]}>
          <boxGeometry args={[2.2, 0.03, 0.03]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      </group>

      {/* chair */}
      <group position={[-0.75, 0, -1.18]}>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.56, 0.07, 0.52]} />
          <meshStandardMaterial color="#151b29" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.78, -0.24]}>
          <boxGeometry args={[0.56, 0.62, 0.07]} />
          <meshStandardMaterial color="#151b29" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.42, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.3, 0.32, 0.05, 20]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* PERSON — sitting, facing the TV */}
      <group position={[-0.75, 0, -1.05]} ref={camRef}>
        {/* legs */}
        {[-0.16, 0.16].map((x, i) => (
          <group key={i} position={[x, 0.5, 0]}>
            <mesh position={[0, -0.02, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.11, 0.42, 6, 12]} />
              <meshStandardMaterial color="#141a29" roughness={0.9} />
            </mesh>
            <mesh position={[0, -0.4, 0.42]} rotation={[0.12, 0, 0]}>
              <capsuleGeometry args={[0.09, 0.5, 6, 12]} />
              <meshStandardMaterial color="#141a29" roughness={0.9} />
            </mesh>
            <mesh position={[0, -0.64, 0.62]}>
              <boxGeometry args={[0.15, 0.08, 0.26]} />
              <meshStandardMaterial color="#0b0e16" roughness={0.7} />
            </mesh>
          </group>
        ))}
        {/* torso (hoodie) */}
        <mesh position={[0, 0.86, 0]} rotation={[-0.14, 0, 0]} castShadow>
          <capsuleGeometry args={[0.27, 0.44, 8, 16]} />
          <meshStandardMaterial color={hoodie} roughness={0.9} />
        </mesh>
        {/* hood */}
        <mesh position={[0, 1.08, -0.1]} rotation={[-0.3, 0, 0]}>
          <sphereGeometry args={[0.24, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color={hoodie} roughness={0.95} />
        </mesh>
        {/* arms reaching to the desk */}
        {[-0.33, 0.33].map((x, i) => (
          <group key={i} position={[x, 1.0, 0.02]} rotation={[-1.05, 0, i === 0 ? 0.12 : -0.12]}>
            <mesh position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.085, 0.4, 6, 12]} />
              <meshStandardMaterial color={hoodie} roughness={0.9} />
            </mesh>
            <mesh position={[0, -0.5, 0.02]}>
              <sphereGeometry args={[0.075, 12, 12]} />
              <meshStandardMaterial color={skin} roughness={0.7} />
            </mesh>
          </group>
        ))}
        {/* head */}
        <mesh position={[0, 1.32, 0.01]}>
          <sphereGeometry args={[0.21, 26, 26]} />
          <meshStandardMaterial color={skin} roughness={0.65} />
        </mesh>
        {/* hair */}
        <mesh position={[0, 1.35, -0.02]}>
          <sphereGeometry args={[0.215, 26, 20, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
          <meshStandardMaterial color={dark} roughness={0.9} />
        </mesh>
        {/* headphones */}
        <mesh position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.24, 0.028, 10, 32, Math.PI]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.5} />
        </mesh>
        {[-0.25, 0.25].map((x, i) => (
          <mesh key={i} position={[x, 1.28, 0.02]}>
            <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* shelf + books on right wall */}
      <group position={[3.3, 1.6, 0.6]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[1.6, 0.05, 0.3]} />
          <meshStandardMaterial color="#1a2130" roughness={0.8} />
        </mesh>
        {[
          ["#22d3ee", -0.5],
          ["#a78bfa", -0.3],
          ["#f472b6", -0.12],
          ["#facc15", 0.06],
        ].map(([c, x], i) => (
          <mesh key={i} position={[x as number, -0.32, 0]}>
            <boxGeometry args={[0.12, 0.32, 0.22]} />
            <meshStandardMaterial color={c as string} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0.5, -0.3, 0]}>
          <boxGeometry args={[0.3, 0.26, 0.2]} />
          <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* dust */}
      <points ref={dust} geometry={dustGeo}>
        <pointsMaterial
          size={0.018}
          color="#bae6fd"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported canvas                                                    */
/* ------------------------------------------------------------------ */

export default function TVRoom({ messages, thinking }: { messages: ChatMsg[]; thinking: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 42, near: 0.1, far: 40, position: [3.05, 1.95, 2.85] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <RoomScene messages={messages} thinking={thinking} />
    </Canvas>
  );
}
