import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function seededRand(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return (h >>> 0) / 4294967295;
}

// ─── Canvas constants ─────────────────────────────────────────────────────────
const CX = 960;
const CY = 540;

// ─── Tile sizes ───────────────────────────────────────────────────────────────
const L = 210; // large
const M = 170; // medium
const S = 130; // small

// ─── Tile placement helper ────────────────────────────────────────────────────
// angleDeg: 0 = top, clockwise positive
// radius: from center to tile center
function atAngle(id, img, angleDeg, radius, size, popDelay) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const tcx = CX + radius * Math.cos(rad);
  const tcy = CY + radius * Math.sin(rad);
  return { id, img, x: tcx - size / 2, y: tcy - size / 2, w: size, h: size, popDelay };
}

// ─── Orbit radius ─────────────────────────────────────────────────────────────
// Main orbit sits at R. Large tiles slightly push out, small stay at R.
const R = 370;

// Tile definitions — clockwise from 12 o'clock, matching reference
const TILES = [
  // 12 o'clock
  atAngle("salesforce",   "salesforce-partner badge-10.png",    0,    R,      L,  6),
  // ~1 o'clock
  atAngle("microsoft",    null,                                  43,   R,      S,  10),
  // ~1:40
  atAngle("marketo",      "marketo-partner badge-1.png",         75,   R,      M,  14),
  // ~2:30 - large, pushed slightly out
  atAngle("salesloft",    "partner badge-12.png",                108,  R+10,   L,  18),
  // ~3:30
  atAngle("rollworks",    "partner badge-14.png",                140,  R,      S,  22),
  // ~4:20
  atAngle("trustradius",  "partner badge-2.png",                 162,  R,      M,  26),
  // ~5:10
  atAngle("zoom",         "zoom-partner badge-7.png",            188,  R,      S,  30),
  // ~6 o'clock - large
  atAngle("g2",           "g2-partner badge-11.png",             210,  R+10,   L,  34),
  // ~7 o'clock
  atAngle("slack",        "slack-partner badge-3.png",           245,  R,      M,  38),
  // ~7:45
  atAngle("gong",         "gong-partner badge-6.png",            272,  R,      S,  34),
  // ~8:30
  atAngle("snowflake",    "snowflake-partner badge-4.png",       295,  R,      M,  30),
  // ~9 o'clock - large
  atAngle("googlecloud",  "google-cloud-partner badge-13.png",   255,  R+10,   L,  26),
  // ~9:30
  atAngle("sixsense",     "partner badge-8.png",                 305,  R,      S,  22),
  // ~10:20
  atAngle("hubspot",      "hubspot-partner badge-5.png",         318,  R,      S,  18),
  // ~11 o'clock - large
  atAngle("aws",          "aws-amazon-partner badge.png",        315,  R+10,   L,  14),
  // ~11:30 — Writer W, slightly inside orbit
  atAngle("writer",       "partner badge-9.png",                 340,  R-60,   S,  10),
  // Outreach — bottom-right inner area
  atAngle("outreach",     "partner badge-15.png",                170,  R-60,   S,  28),
];

// ─── Microsoft SVG fallback ───────────────────────────────────────────────────
function MicrosoftSVG() {
  return (
    <svg viewBox="0 0 44 44" width="76" height="76">
      <rect x="1" y="1" width="19" height="19" fill="#F25022"/>
      <rect x="24" y="1" width="19" height="19" fill="#7FBA00"/>
      <rect x="1" y="24" width="19" height="19" fill="#00A4EF"/>
      <rect x="24" y="24" width="19" height="19" fill="#FFB900"/>
    </svg>
  );
}

// ─── Textured rings ───────────────────────────────────────────────────────────
// Multiple overlapping bands per ring to create layered/textured feel

function RingBand({ cx, cy, r, sw, baseColor, opacity, dashArray, rot }) {
  return (
    <g transform={`rotate(${rot}, ${cx}, ${cy})`}>
      {/* Outer fade */}
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={baseColor} strokeWidth={sw * 1.6} opacity={opacity * 0.25}/>
      {/* Core band */}
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={baseColor} strokeWidth={sw} opacity={opacity * 0.75}/>
      {/* Inner bright strip */}
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={baseColor} strokeWidth={sw * 0.3} opacity={opacity * 0.9}/>
      {/* Dashed texture overlay */}
      {dashArray && (
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="rgba(255,120,100,0.4)" strokeWidth={sw * 0.4}
          strokeDasharray={dashArray} opacity={opacity * 0.6}/>
      )}
    </g>
  );
}

function Rings({ frame, totalFrames }) {
  const fadeIn = fi(frame, 30, 75, 0, 1);

  const rot1 = interpolate(frame, [0, totalFrames], [0,   3]);
  const rot2 = interpolate(frame, [0, totalFrames], [0,  -5]);
  const rot3 = interpolate(frame, [0, totalFrames], [0,   7]);
  const rot4 = interpolate(frame, [0, totalFrames], [0,  -3]);

  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: fadeIn }}
      viewBox="0 0 1920 1080"
    >
      {/* Outer ring */}
      <RingBand cx={CX} cy={CY} r={430} sw={46} baseColor="#d41a10" opacity={0.55} dashArray="40 12" rot={rot1}/>
      {/* Mid ring */}
      <RingBand cx={CX} cy={CY} r={332} sw={44} baseColor="#d41a10" opacity={0.45} dashArray="32 10" rot={rot2}/>
      {/* Inner ring */}
      <RingBand cx={CX} cy={CY} r={238} sw={40} baseColor="#d41a10" opacity={0.35} dashArray={null} rot={rot3}/>
      {/* Inner accent — thin pink rings close to disk */}
      <g transform={`rotate(${rot4}, ${CX}, ${CY})`}>
        <circle cx={CX} cy={CY} r={192} fill="none" stroke="rgba(230,80,70,0.40)" strokeWidth={7}/>
        <circle cx={CX} cy={CY} r={178} fill="none" stroke="rgba(230,80,70,0.25)" strokeWidth={4}/>
      </g>
    </svg>
  );
}

// ─── Center disk ──────────────────────────────────────────────────────────────

function CenterDisk({ scale, opacity, frame }) {
  const r = 155;
  // Pulse: 1 → 1.02 → 1 over ~4s
  const pulse = 1 + Math.sin((frame / 30) * (Math.PI / 2)) * 0.01;
  const finalScale = scale * pulse;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transform: `scale(${finalScale})`,
        transformOrigin: `${CX}px ${CY}px`,
      }}
      viewBox="0 0 1920 1080"
    >
      <defs>
        <radialGradient id="dg" cx="32%" cy="26%" r="75%">
          <stop offset="0%"   stopColor="#ff5c50"/>
          <stop offset="48%"  stopColor="#e31717"/>
          <stop offset="100%" stopColor="#be0808"/>
        </radialGradient>
        <filter id="ds" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="18" stdDeviation="28" floodColor="rgba(140,0,0,0.52)"/>
        </filter>
      </defs>

      {/* Disk */}
      <circle cx={CX} cy={CY} r={r} fill="url(#dg)" filter="url(#ds)"/>

      {/* Bracket corners */}
      <g fill="none" stroke="white" strokeWidth="10.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={`M${CX-52} ${CY-62} L${CX-70} ${CY-62} L${CX-70} ${CY-44}`}/>
        <path d={`M${CX+52} ${CY-62} L${CX+70} ${CY-62} L${CX+70} ${CY-44}`}/>
        <path d={`M${CX-52} ${CY+62} L${CX-70} ${CY+62} L${CX-70} ${CY+44}`}/>
        <path d={`M${CX+52} ${CY+62} L${CX+70} ${CY+62} L${CX+70} ${CY+44}`}/>
      </g>

      {/* Z */}
      <text
        x={CX} y={CY + 38}
        fontSize="120"
        fontWeight="900"
        fontFamily="Arial Black, sans-serif"
        fill="white"
        textAnchor="middle"
      >Z</text>
    </svg>
  );
}

// ─── Partner tile ─────────────────────────────────────────────────────────────

function PartnerTile({ tile, frame, fps }) {
  const { id, img, x, y, w, h, popDelay } = tile;

  const popSpring = spring({
    frame: frame - popDelay,
    fps,
    config: { damping: 11, stiffness: 210 },
  });
  const popOpacity = fi(frame, popDelay, popDelay + 12, 0, 1);

  // Deterministic micro-float ±4px
  const amp   = 2 + seededRand(id + "a") * 4;   // 2–6 px, capped to feel like ±4
  const phase = seededRand(id + "p") * Math.PI * 2;
  const rotA  = (seededRand(id + "r") - 0.5) * 0.8;
  const floatY   = Math.sin((frame / 30) * 1.05 + phase) * amp;
  const floatRot = Math.sin((frame / 30) * 0.7  + phase) * rotA;

  const radius = Math.min(w, h) * 0.165;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        background: "#ffffff",
        // Subtle blue stroke + soft drop shadow, no heavy glow
        boxShadow: `
          0 6px 18px rgba(0,0,0,0.12),
          0 0 0 4px rgba(100,145,255,0.15),
          0 0 14px rgba(80,130,255,0.22)
        `,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transform: `scale(${popSpring}) translateY(${floatY}px) rotate(${floatRot}deg)`,
        opacity: popOpacity,
        transformOrigin: "center center",
      }}
    >
      {img ? (
        <Img
          src={staticFile(`logos/${img}`)}
          style={{ width: "84%", height: "84%", objectFit: "contain" }}
        />
      ) : (
        <MicrosoftSVG />
      )}
    </div>
  );
}

// ─── Root composition ─────────────────────────────────────────────────────────

export const PartnersGoToMarket = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const diskScale = spring({
    frame: frame - 4,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const diskOpacity = fi(frame, 4, 20, 0, 1);

  return (
    <AbsoluteFill style={{ background: "#ffffff", overflow: "hidden" }}>
      {/* Faint center radial tint */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 48% 48% at 50% 50%, rgba(210,30,20,0.05) 0%, transparent 70%)",
      }}/>

      {/* Textured concentric rings */}
      <Rings frame={frame} totalFrames={durationInFrames} />

      {/* Partner tiles */}
      {TILES.map((t) => (
        <PartnerTile key={t.id} tile={t} frame={frame} fps={fps} />
      ))}

      {/* Center disk */}
      <CenterDisk scale={diskScale} opacity={diskOpacity} frame={frame} />
    </AbsoluteFill>
  );
};
