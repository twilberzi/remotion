import { useCurrentFrame, interpolate, AbsoluteFill, staticFile, Img } from "remotion";

const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const RED = "#EA1815";
const PURPLE = "#9333ea";
const BG = "#08101f";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Animated flowing sine wave lines — matches reference video bg
function WavyLines({ frame, color1 = RED, color2 = PURPLE }) {
  const lines = Array.from({ length: 18 }, (_, i) => i);
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
    >
      {lines.map((i) => {
        const amp = 60 + i * 12;
        const freq = 0.003 + i * 0.0003;
        const phase = (frame * 0.018) + i * 0.55;
        const yBase = 200 + i * 40;
        const color = i % 2 === 0 ? color1 : color2;
        const opacity = 0.06 + (i < 9 ? i : 18 - i) * 0.008;

        const pts = Array.from({ length: 80 }, (_, j) => {
          const x = (j / 79) * 1920;
          const y = yBase + Math.sin(x * freq + phase) * amp;
          return `${x},${y}`;
        }).join(" ");

        return (
          <polyline
            key={i}
            points={pts}
            fill="none"
            stroke={color}
            strokeWidth={1.2}
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}

// UI build-in overlay — rows and action items assemble as the screen enters
function UIBuildIn({ lf }) {
  // Matches the activate-screen layout at 1520×900:
  // Left panel: table rows starting at y≈13% (header), rows ~5.5% tall each
  // Right panel: action buttons starting at y≈28%, ~7% tall each

  const TABLE_ROWS = [
    "johnson@example.com",
    "liet.smith@example.com",
    "g.williams@example.com",
    "d.brown@example.com",
    "j.jones@example.com",
    "i.garcia@example.com",
    "t.martinez@example.com",
    "s.davis@example.com",
    "g.rodriguez@example.com",
    "t.hernandez@example.com",
    "j.lopez@example.com",
    "t.wilson@example.com",
    "ro.anderson@example.com",
    "peter.thomas@example.com",
  ];

  const ACTIONS = [
    { label: "Push to GTM Workspaces",        color: RED },
    { label: "Push to ZoomInfo Marketing",     color: RED },
    { label: "Export to LinkedIn Campaign Mgr",color: "#0a66c2" },
    { label: "Export to Meta Ads Manager",     color: "#1877f2" },
    { label: "Export to Salesoft",             color: "#00a1e0" },
    { label: "Export to Outreach",             color: RED },
    { label: "Export to HubSpot",             color: "#ff7a59" },
    { label: "Export to Dynamics",            color: "#00bcf2" },
    { label: "Export to Salesforce",          color: "#00a1e0" },
  ];

  // The overlay fades out once the screen is settled (lf 70–110)
  const overlayFade = fi(lf, 55, 110, 1, 0);
  if (overlayFade <= 0) return null;

  return (
    <div style={{
      position: "absolute", inset: 0,
      borderRadius: 18,
      overflow: "hidden",
      opacity: overlayFade,
      pointerEvents: "none",
    }}>
      {/* Frosted base — slightly darkens the screenshot so rows pop */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(255,255,255,0.92)",
      }} />

      {/* Top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "7%",
        background: "white",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        display: "flex", alignItems: "center", paddingLeft: 16,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: RED, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: FONT, fontWeight: 900, color: "white", fontSize: 14, marginRight: 10,
        }}>Z</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: "#1e2d5a" }}>GTMStudio</div>
      </div>

      {/* Left table rows */}
      {TABLE_ROWS.map((email, i) => {
        const rowDelay = 8 + i * 3.5;
        const rowOp = fi(lf, rowDelay, rowDelay + 6, 0, 1);
        const rowX = fi(lf, rowDelay, rowDelay + 8, -18, 0);
        const yPct = 12 + i * 5.6;
        return (
          <div key={`row-${i}`} style={{
            position: "absolute",
            top: `${yPct}%`, left: "2%", width: "58%", height: "5%",
            display: "flex", alignItems: "center",
            opacity: rowOp,
            transform: `translateX(${rowX}px)`,
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            background: i % 2 === 0 ? "rgba(248,250,255,0.6)" : "transparent",
          }}>
            <div style={{
              fontFamily: FONT, fontSize: 11, color: "#1e2d5a", opacity: 0.5,
              width: 24, textAlign: "right", marginRight: 12, flexShrink: 0,
            }}>{i + 1}</div>
            <div style={{
              fontFamily: FONT, fontSize: 11, color: "#1e4fd8", flex: 1,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{email}</div>
            <div style={{
              width: 80, height: 8, borderRadius: 4,
              background: "rgba(30,45,90,0.12)", marginRight: 12,
            }} />
            <div style={{
              width: 70, height: 8, borderRadius: 4,
              background: "rgba(30,45,90,0.08)", marginRight: 16,
            }} />
          </div>
        );
      })}

      {/* Right actions panel */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: "30%",
        borderLeft: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.97)",
      }}>
        <div style={{
          padding: "14px 16px 10px",
          fontFamily: FONT, fontWeight: 700, fontSize: 13, color: "#1e2d5a",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}>Actions</div>

        {ACTIONS.map((action, i) => {
          const aDelay = 20 + i * 4;
          const aOp = fi(lf, aDelay, aDelay + 8, 0, 1);
          const aY = fi(lf, aDelay, aDelay + 10, 10, 0);
          return (
            <div key={`action-${i}`} style={{
              display: "flex", alignItems: "center",
              padding: "9px 14px",
              opacity: aOp,
              transform: `translateY(${aY}px)`,
              borderBottom: "1px solid rgba(0,0,0,0.045)",
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: action.color, marginRight: 10, flexShrink: 0,
              }} />
              <div style={{
                fontFamily: FONT, fontSize: 11.5, fontWeight: 500, color: "#1e2d5a",
              }}>{action.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Apple-style 3D screen reveal:
// 1. Enters tilted (rotateX 35deg, rotateY -18deg, scale 0.7, slight above center)
// 2. Camera "pushes in" — scale grows, tilt corrects toward flat
// 3. Holds flat with slow upward pan (parallax)
// 4. Optional: floating signal chips animate in around it
function Screen3D({ frame, startFrame, imgSrc, chips = [], sceneOutFrame }) {
  const lf = frame - startFrame;

  // Phase 1: tilt entry (lf 0–70)
  const rotX  = fi(lf, 0, 70, 32,  0);
  const rotY  = fi(lf, 0, 70, -18, 0);
  const rotZ  = fi(lf, 0, 70, 4,   0);
  const scale = fi(lf, 0, 70, 0.72, 1.0);
  const entryY = fi(lf, 0, 70, 60, 0);
  const opacity = fi(lf, 0, 24, 0, 1);

  // Phase 2: slow upward pan + zoom (lf 70–420)
  const pan = fi(lf, 70, 420, 0, -120);
  const camZoom = fi(lf, 70, 420, 1.0, 1.22);

  // Phase 3: zoom into "Export to Outreach" (lf 420–480, 2s)
  // Ease-out quint: fast start, long smooth deceleration — cinematic feel
  const ZOOM_START = 420;
  const ZOOM_END = 480;
  const PUSH_END = 570;
  const zoomT = Math.max(0, Math.min(1, (lf - ZOOM_START) / (ZOOM_END - ZOOM_START)));
  const zoomEased = 1 - Math.pow(1 - zoomT, 5); // ease-out quint
  const zoomScale = lf >= ZOOM_START ? 1.22 + (2.0 - 1.22) * zoomEased : 1.22;
  const originX = lf >= ZOOM_START ? 50 + (88 - 50) * zoomEased : 50;
  const originY = lf >= ZOOM_START ? 50 + (63 - 50) * zoomEased : 50;

  // Phase 4: slow push-in after zoom lands (lf 480–570)
  const pushT = Math.max(0, Math.min(1, (lf - ZOOM_END) / (PUSH_END - ZOOM_END)));
  const pushEased = 1 - Math.pow(1 - pushT, 3); // ease-out cubic
  const pushScale = lf >= ZOOM_END ? 2.0 + (2.25 - 2.0) * pushEased : zoomScale;

  // Fade out (lf 570–630)
  const fadeOut = sceneOutFrame
    ? fi(frame, sceneOutFrame - 20, sceneOutFrame, 1, 0)
    : fi(lf, 570, 630, 1, 0);

  // Chips fade out before zoom-in
  const chipsFadeOut = fi(lf, 400, 425, 1, 0);

  // Final scale
  const finalScale = lf < ZOOM_START ? scale * camZoom : lf < ZOOM_END ? zoomScale : pushScale;
  const finalPan = lf < ZOOM_START ? entryY + pan : -120;

  const transform = [
    `perspective(1100px)`,
    `scale(${finalScale})`,
    `translateY(${finalPan}px)`,
    `rotateX(${rotX}deg)`,
    `rotateY(${rotY}deg)`,
    `rotateZ(${rotZ}deg)`,
  ].join(" ");

  // transformOrigin shifts so zoom targets the Outreach row
  const transformOrigin = `${originX}% ${originY}%`;


  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity: opacity * fadeOut,
    }}>
      {/* Screen */}
      <div style={{
        position: "relative",
        width: 1520, height: 900,
        transform,
        transformOrigin,
        transformStyle: "preserve-3d",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: `
          0 80px 160px rgba(0,0,0,0.55),
          0 0 0 1px rgba(255,255,255,0.08),
          0 0 60px ${PURPLE}33
        `,
      }}>
        <Img
          src={staticFile(imgSrc)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
        />
        <UIBuildIn lf={lf} />
        {/* Flash to hide overlay→screenshot cut at lf≈110 */}
        <div style={{
          position: "absolute", inset: 0,
          background: "white",
          opacity: fi(lf, 100, 108, 0, 0.85) * fi(lf, 108, 122, 1, 0),
          pointerEvents: "none",
        }} />
        {/* Subtle glass sheen on entry */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%)",
          opacity: fi(lf, 0, 70, 1, 0),
          pointerEvents: "none",
        }} />
      </div>

      {/* Floating signal chips */}
      {chips.map((chip, i) => {
        const chipDelay = 50 + i * 18;
        const chipOp = fi(lf, chipDelay, chipDelay + 16, 0, 1) * chipsFadeOut;
        const chipY = fi(lf, chipDelay, chipDelay + 20, 12, 0);
        return (
          <div key={i} style={{
            position: "absolute",
            left: chip.x, top: chip.y,
            opacity: chipOp,
            transform: `translateY(${chipY}px)`,
          }}>
            <div style={{
              background: "rgba(8,16,31,0.88)",
              border: `1px solid ${chip.color || PURPLE}66`,
              borderRadius: 12,
              padding: "10px 18px",
              backdropFilter: "blur(12px)",
              boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 12px ${chip.color || PURPLE}22`,
              minWidth: 180,
            }}>
              <div style={{
                fontFamily: FONT, fontSize: 11, fontWeight: 700,
                color: chip.color || PURPLE, letterSpacing: 1.5,
                textTransform: "uppercase", marginBottom: 4,
              }}>
                {chip.label}
              </div>
              <div style={{
                fontFamily: FONT, fontSize: 15, fontWeight: 500, color: "white",
              }}>
                {chip.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── TEST COMPOSITION ──────────────────────────────────────────────────────────
export function Screen3DTest() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      {/* Bg gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 30% 70%, ${PURPLE}33 0%, transparent 55%)`,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 75% 30%, ${RED}22 0%, transparent 50%)`,
      }} />

      <WavyLines frame={frame} />

      {/* 3D Screen reveal */}
      <Screen3D
        frame={frame}
        startFrame={0}
        imgSrc="gtmstudio/activate-screen.png"
        sceneOutFrame={630}
        chips={[
          { label: "Trigger", text: "Competitor stack detected", color: RED,    x: 80,  y: 180 },
          { label: "Agent 1", text: "Intent signals layered",    color: PURPLE, x: 1460, y: 200 },
          { label: "Output",  text: "Rep notified · email ready",color: "#22c55e", x: 100, y: 780 },
        ]}
      />
    </AbsoluteFill>
  );
}
