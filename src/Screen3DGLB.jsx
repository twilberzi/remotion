import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  staticFile,
  continueRender,
  delayRender,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const RED = "#EA1815";
const PURPLE = "#9333ea";
const BG = "#08101f";
const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function WavyLines({ frame }) {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
    >
      {Array.from({ length: 18 }, (_, i) => {
        const amp = 55 + i * 11;
        const freq = 0.0028 + i * 0.00025;
        const phase = frame * 0.016 + i * 0.52;
        const yBase = 180 + i * 42;
        const color = i % 2 === 0 ? RED : PURPLE;
        const opacity = 0.05 + (i < 9 ? i : 18 - i) * 0.007;
        const pts = Array.from({ length: 80 }, (_, j) => {
          const x = (j / 79) * 1920;
          const y = yBase + Math.sin(x * freq + phase) * amp;
          return `${x},${y}`;
        }).join(" ");
        return (
          <polyline key={i} points={pts} fill="none"
            stroke={color} strokeWidth={1.2} opacity={opacity} />
        );
      })}
    </svg>
  );
}

// ── Procedural MacBook scene — raw Three.js, no drei ─────────────────────
function LaptopScene({ frame, fps, screenTexture }) {

  // ── Phase 1: Orbit spin (0–120) ───────────────────────────────────────
  // Camera sweeps in from the right side, laptop body counter-rotates to face us
  // Eased with ease-out quint so spin decelerates smoothly into hero position
  const spinT  = Math.max(0, Math.min(1, frame / 120));
  const spinE  = 1 - Math.pow(1 - spinT, 4); // ease-out quart

  // Camera orbits from theta=1.4rad (right side) → 0.0 (front-center)
  const orbitTheta = 1.4 * (1 - spinE);
  // Camera height: starts high (above), comes down to eye-level
  const orbitPhi   = fi(frame, 0, 120, 0.65, 0.32);
  // Camera distance: starts far, settles in
  const orbitDist  = fi(frame, 0, 120, 7.5, 4.8);

  // ── Phase 2: Slow push-in (120–480) ──────────────────────────────────
  const pushDist = fi(frame, 120, 480, 4.8, 2.2);

  // ── Phase 3: Final fill — zoom into screen (480–570) ─────────────────
  const zoomT  = Math.max(0, Math.min(1, (frame - 480) / 90));
  const zoomE  = 1 - Math.pow(1 - zoomT, 5); // ease-out quint
  const zoomDist = 2.2 - 1.4 * zoomE; // 2.2 → 0.8 — screen fills frame

  const dist = frame < 120 ? orbitDist : frame < 480 ? pushDist : zoomDist;

  // Camera height also drops slightly during zoom to face screen square-on
  const finalPhi = frame < 480 ? orbitPhi : fi(frame, 480, 570, orbitPhi, 0.18);

  const camX = dist * Math.sin(finalPhi) * Math.sin(orbitTheta);
  const camY = dist * Math.cos(finalPhi) + 0.5;
  const camZ = dist * Math.sin(finalPhi) * Math.cos(orbitTheta);

  // Lid opens while camera spins in — starts closed, fully open by frame 150
  const lidAngle = spring({ frame, from: -0.08, to: -1.84, fps,
    config: { damping: 26, stiffness: 110, mass: 1.1, overshootClamping: true } });

  // Body Y rotation: starts turned away slightly, faces camera as it settles
  const bodyRot = fi(frame, 0, 120, -0.3, 0.0);

  // MacBook proportions
  const W = 3.1, D = 2.1, H = 0.065;
  const LW = 2.98, LH = 1.94, LD = 0.042;
  const hingeZ = -D / 2 + 0.09;

  const aluminium = new THREE.MeshStandardMaterial({ color: "#aeb6c2", roughness: 0.22, metalness: 0.88 });
  const darkKey   = new THREE.MeshStandardMaterial({ color: "#1c1c1e", roughness: 0.6,  metalness: 0.1 });
  const trackpad  = new THREE.MeshStandardMaterial({ color: "#252528", roughness: 0.3,  metalness: 0.55 });
  const bezel     = new THREE.MeshStandardMaterial({ color: "#141414", roughness: 0.8,  metalness: 0.05 });
  const screenMat = screenTexture
    ? new THREE.MeshStandardMaterial({
        map: screenTexture,
        roughness: 0.04, metalness: 0.0,
        emissiveMap: screenTexture, emissive: new THREE.Color(1, 1, 1), emissiveIntensity: 0.3,
      })
    : new THREE.MeshStandardMaterial({ color: "#0a0f1e" });
  const ground = new THREE.MeshStandardMaterial({ color: "#0d1628", roughness: 0.8, metalness: 0.1, transparent: true, opacity: 0.65 });

  const camera = new THREE.PerspectiveCamera(38, 1920 / 1080, 0.1, 100);
  camera.position.set(camX, camY, camZ);
  // During zoom phase, look directly at screen face; otherwise look at laptop center
  const lookY = fi(frame, 480, 570, 0.9, 1.4);
  const lookZ = fi(frame, 480, 570, -0.6, -0.9);
  camera.lookAt(0, lookY, lookZ);

  const scene = new THREE.Scene();
  scene.background = null;

  // Lighting
  const keyLight  = new THREE.DirectionalLight("#fffaf0", 1.9);
  keyLight.position.set(-3, 6, 4);
  const fillLight = new THREE.PointLight("#b0c8ff", 0.9);
  fillLight.position.set(4, 3, 2);
  const rimLight  = new THREE.PointLight(PURPLE, 0.65);
  rimLight.position.set(0, 2, -5);
  const screenGlow= new THREE.PointLight("#e8f0ff", 0.55, 3);
  screenGlow.position.set(0, 1.8, -0.4);
  const ambient   = new THREE.AmbientLight("#d0d8ff", 0.35);
  scene.add(keyLight, fillLight, rimLight, screenGlow, ambient);

  // Laptop group
  const laptop = new THREE.Group();
  laptop.rotation.y = bodyRot;
  laptop.position.y = -0.38;

  // Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), aluminium);
  laptop.add(base);

  // Keyboard inset
  const kb = new THREE.Mesh(new THREE.BoxGeometry(W * 0.85, 0.001, D * 0.6), darkKey);
  kb.position.set(0, H / 2 + 0.001, 0.1);
  laptop.add(kb);

  // Trackpad
  const tp = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.001, 0.46), trackpad);
  tp.position.set(0, H / 2 + 0.001, 0.72);
  laptop.add(tp);

  // Lid group — pivot at back edge
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, H / 2, hingeZ);
  lidGroup.rotation.x = lidAngle;

  // Lid shell
  const lidShell = new THREE.Mesh(new THREE.BoxGeometry(LW, LH, LD), aluminium);
  lidShell.position.set(0, LH / 2, -LD / 2);
  lidGroup.add(lidShell);

  // Bezel face
  const bezelMesh = new THREE.Mesh(new THREE.BoxGeometry(LW, LH, 0.002), bezel);
  bezelMesh.position.set(0, LH / 2, LD / 2 + 0.001);
  lidGroup.add(bezelMesh);

  // Screen
  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(LW * 0.9, LH * 0.88), screenMat);
  screenMesh.position.set(0, LH / 2 + 0.01, LD / 2 + 0.003);
  lidGroup.add(screenMesh);

  // Screen glare
  const glareMat = new THREE.MeshBasicMaterial({ color: "white", transparent: true, opacity: 0.04 });
  const glare = new THREE.Mesh(new THREE.PlaneGeometry(LW * 0.28, LH * 0.48), glareMat);
  glare.position.set(-0.38, LH * 0.68, LD / 2 + 0.005);
  lidGroup.add(glare);

  laptop.add(lidGroup);
  scene.add(laptop);

  // Ground
  const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), ground);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.38;
  scene.add(groundMesh);

  return { scene, camera };
}

// ── Composition ───────────────────────────────────────────────────────────
export function Screen3DGLB() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Load texture with delayRender
  const [texture, setTexture] = useState(null);
  const handleRef = useRef(null);

  useEffect(() => {
    handleRef.current = delayRender("Loading screen texture");
    const loader = new THREE.TextureLoader();
    loader.load(
      staticFile("gtmstudio/activate-screen.png"),
      (tex) => {
        tex.flipY = true;
        tex.needsUpdate = true;
        setTexture(tex);
        continueRender(handleRef.current);
      },
      undefined,
      () => continueRender(handleRef.current)
    );
  }, []);

  const fadeOut = fi(frame, 580, 630, 1, 0);
  const fadeIn  = fi(frame, 0, 18, 0, 1);

  const { scene, camera } = LaptopScene({ frame, fps, screenTexture: texture });

  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 30% 70%, ${PURPLE}44 0%, transparent 55%)`,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 75% 28%, ${RED}22 0%, transparent 48%)`,
      }} />
      <WavyLines frame={frame} />

      <div style={{ position: "absolute", inset: 0, opacity: fadeIn * fadeOut }}>
        <ThreeCanvas
          width={width}
          height={height}
          scene={scene}
          camera={camera}
          gl={{ antialias: true, alpha: true }}
        />
      </div>

      {/* Label */}
      <div style={{
        position: "absolute", bottom: 80, left: 0, right: 0,
        textAlign: "center",
        opacity: fi(frame, 60, 90, 0, 1) * fi(frame, 400, 430, 1, 0),
        transform: `translateY(${fi(frame, 60, 90, 12, 0)}px)`,
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: FONT, fontSize: 22, fontWeight: 700,
          color: "rgba(255,255,255,0.9)", letterSpacing: 2, textTransform: "uppercase",
        }}>GTM Studio</div>
        <div style={{
          fontFamily: FONT, fontSize: 14, fontWeight: 400,
          color: `${PURPLE}cc`, marginTop: 6, letterSpacing: 1,
        }}>Activate your audience in one click</div>
      </div>
    </AbsoluteFill>
  );
}
