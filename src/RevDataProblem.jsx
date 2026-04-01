import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const GREEN = "#16a34a";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

function seededRand(seed) {
  let h = 2166136261;
  for (let i = 0; i < String(seed).length; i++) {
    h ^= String(seed).charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return (h >>> 0) / 4294967295;
}

const SOURCES = [
  { label: "CRM",      color: "#2563eb", x: 300,  y: 80  },
  { label: "Email",    color: RED,       x: 760,  y: 80  },
  { label: "Calendar", color: "#7c3aed", x: 1220, y: 80  },
];

const CHANNELS = [
  { label: "Prioritize", color: GREEN,   x: 380  },
  { label: "At Risk",    color: RED,     x: 760  },
  { label: "Next Action",color: "#2563eb", x: 1140 },
];

const PARTICLE_COUNT = 54;

function makeParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const src = i % 3;
    return {
      id: i,
      src,
      color: SOURCES[src].color,
      startX: SOURCES[src].x + (seededRand(i * 3) - 0.5) * 80,
      speed: 2.2 + seededRand(i * 7) * 1.6,
      size: 7 + seededRand(i * 11) * 5,
      phaseOffset: Math.floor(seededRand(i * 13) * 90),
    };
  });
}

const PARTICLES = makeParticles();
const MESH_Y = 430;
const CHANNEL_Y = 680;

export const RevDataProblem = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0–100): clog — particles stream down, pile at mesh
  // Phase 2 (100–200): switch — pile disperses, routes into 3 channels
  // Phase 3 (200–270): payoff label

  const switched = frame >= 108;
  const switchProgress = fi(frame, 108, 148, 0, 1);

  const meshOp = fi(frame, 20, 40, 0, 1);
  const meshFlash = switched ? fi(frame, 108, 128, 1, 0) : 0;

  const sourceOp = fi(frame, 0, 20, 0, 1);
  const channelOp = fi(frame, 130, 155, 0, 1);

  const payoffOp = fi(frame, 205, 225, 0, 1);
  const payoffY  = fi(frame, 205, 225, 14, 0);

  return (
    <AbsoluteFill style={{ background: "#f8faff", fontFamily: FONT }}>

      {/* Source labels */}
      {SOURCES.map((s, i) => (
        <div key={i} style={{
          position: "absolute", left: s.x - 60, top: 28,
          opacity: sourceOp,
          width: 120, textAlign: "center",
        }}>
          <div style={{
            background: s.color, color: "white",
            borderRadius: 10, padding: "7px 14px",
            fontSize: 13, fontWeight: 800, letterSpacing: "1px",
            boxShadow: `0 4px 16px ${s.color}55`,
          }}>{s.label}</div>
        </div>
      ))}

      {/* SVG: particles + mesh + channel lines */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>

        {/* Mesh / bottleneck */}
        <rect
          x={200} y={MESH_Y - 18} width={1120} height={36}
          rx={8}
          fill={`rgba(30,45,90,${switched ? 0.03 : 0.07})`}
          stroke={`rgba(30,45,90,${switched ? 0.05 : 0.18})`}
          strokeWidth={1.5}
          opacity={meshOp}
        />
        {/* mesh grid lines */}
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i}
            x1={280 + i * 78} y1={MESH_Y - 18}
            x2={280 + i * 78} y2={MESH_Y + 18}
            stroke={`rgba(30,45,90,${switched ? 0.04 : 0.12})`}
            strokeWidth={1}
            opacity={meshOp}
          />
        ))}

        {/* Flash when switching */}
        <rect x={200} y={MESH_Y - 18} width={1120} height={36} rx={8}
          fill={`rgba(232,24,46,${meshFlash * 0.15})`}
          opacity={meshFlash}
        />

        {/* Channel routing lines (draw in after switch) */}
        {CHANNELS.map((ch, ci) => {
          const totalLen = CHANNEL_Y - MESH_Y - 18;
          const drawn = fi(frame, 128 + ci * 12, 165 + ci * 12, 0, totalLen);
          return (
            <line key={ci}
              x1={ch.x} y1={MESH_Y + 18}
              x2={ch.x} y2={MESH_Y + 18 + drawn}
              stroke={ch.color} strokeWidth={2.5}
              opacity={channelOp}
              strokeDasharray="6 4"
            />
          );
        })}

        {/* Particles */}
        {PARTICLES.map((p) => {
          const startFrame = p.phaseOffset;
          if (frame < startFrame) return null;

          let px = p.startX;
          let py, op = 1;

          if (!switched) {
            // Stream down from source, pile up at mesh
            const traveled = (frame - startFrame) * p.speed;
            py = 110 + traveled;
            if (py >= MESH_Y - p.size) {
              // Pile — compress into mesh with slight spread
              const excess = py - (MESH_Y - p.size);
              py = MESH_Y - p.size - excess * 0.08;
              px += Math.sin(frame * 0.3 + p.id) * 3;
            }
            if (py > MESH_Y + 30) return null;
          } else {
            // Route to assigned channel
            const chX = CHANNELS[p.src].x + (seededRand(p.id * 2) - 0.5) * 40;
            const routeStart = 108 + p.id * 0.8;
            const t = fi(frame, routeStart, routeStart + 48, 0, 1);
            const pileY = MESH_Y - p.size - (seededRand(p.id) * 20);
            px = p.startX + (chX - p.startX) * t;
            py = pileY + (CHANNEL_Y + 20 - pileY) * t;
            op = t < 0.95 ? 1 : fi(frame, routeStart + 46, routeStart + 54, 1, 0);
          }

          return (
            <circle key={p.id}
              cx={px} cy={py} r={p.size / 2}
              fill={p.color}
              opacity={op * 0.82}
            />
          );
        })}
      </svg>

      {/* Channel labels */}
      {CHANNELS.map((ch, i) => {
        const sp = spring({ frame: frame - (128 + i * 14), fps, config: { damping: 18, stiffness: 150 } });
        return (
          <div key={i} style={{
            position: "absolute",
            left: ch.x - 80, top: CHANNEL_Y + 20,
            width: 160, textAlign: "center",
            opacity: fi(frame, 148 + i * 14, 168 + i * 14, 0, 1),
            transform: `scale(${sp})`,
          }}>
            <div style={{
              background: ch.color,
              borderRadius: 10, padding: "8px 16px",
              fontSize: 13, fontWeight: 800, color: "white",
              boxShadow: `0 4px 16px ${ch.color}44`,
            }}>{ch.label}</div>
          </div>
        );
      })}

      {/* Before/After label */}
      <div style={{
        position: "absolute", top: 28, left: 60,
        opacity: fi(frame, 0, 20, 0, 1),
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: switched ? GREEN : RED,
          letterSpacing: "2px",
          transition: "color 0.3s",
        }}>{switched ? "AFTER: CLARITY" : "BEFORE: CLOG"}</div>
      </div>

      {/* Payoff */}
      <div style={{
        position: "absolute", bottom: 60, left: 0, right: 0,
        textAlign: "center", opacity: payoffOp, transform: `translateY(${payoffY}px)`,
      }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: NAVY }}>
          Not a data problem.{" "}
          <span style={{ color: RED }}>An intelligence problem.</span>
        </div>
      </div>

    </AbsoluteFill>
  );
};
