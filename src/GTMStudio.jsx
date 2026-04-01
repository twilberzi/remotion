import { useCurrentFrame, interpolate, AbsoluteFill, staticFile, Img } from "remotion";

const BG = "#08101f";
const RED = "#EA1815";
const PURPLE = "#9333ea";
const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Concentric neon rings pulsing outward
function NeonRings({ frame }) {
  const rings = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      viewBox="0 0 1920 1080"
    >
      {rings.map((i) => {
        const baseR = 260 + i * 90;
        const pulse = fi(frame, i * 8, i * 8 + 60, 0, 12);
        const r = baseR + pulse;
        const opacity = fi(frame, 0, 40, 0, 1) * (0.18 - i * 0.018);
        // gradient from red to purple around the ring
        const gradId = `rg${i}`;
        return (
          <g key={i}>
            <defs>
              <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={RED} stopOpacity="0" />
                <stop offset="100%" stopColor={RED} stopOpacity="1" />
              </radialGradient>
            </defs>
            <circle
              cx={960}
              cy={620}
              r={r}
              fill="none"
              stroke={i % 2 === 0 ? RED : PURPLE}
              strokeWidth={1.2}
              opacity={opacity}
            />
          </g>
        );
      })}
    </svg>
  );
}

// Ambient radial glow blob center-bottom
function GlowBlob({ frame }) {
  const opacity = fi(frame, 0, 50, 0, 0.55);
  return (
    <div style={{
      position: "absolute",
      bottom: -200,
      left: "50%",
      transform: "translateX(-50%)",
      width: 900,
      height: 600,
      borderRadius: "50%",
      background: `radial-gradient(ellipse at center, ${PURPLE}55 0%, ${RED}22 40%, transparent 70%)`,
      opacity,
      pointerEvents: "none",
    }} />
  );
}

// ZoomInfo logo wordmark (SVG text-based)
function ZILogo({ opacity, scale = 1 }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      opacity,
      transform: `scale(${scale})`,
    }}>
      {/* Z icon box */}
      <div style={{
        width: 52,
        height: 52,
        background: RED,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d="M6 7h18l-14 16h14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span style={{
        fontFamily: FONT,
        fontSize: 38,
        fontWeight: 300,
        color: "white",
        letterSpacing: -0.5,
      }}>
        ZoomInfo
      </span>
    </div>
  );
}

// Single text card — words fade in left to right
function TextCard({ text, frame, startFrame, style = {} }) {
  const words = text.split(" ");
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "0 12px",
      ...style,
    }}>
      {words.map((word, i) => {
        const wStart = startFrame + i * 5;
        const opacity = fi(frame, wStart, wStart + 12, 0, 1);
        const x = fi(frame, wStart, wStart + 12, 10, 0);
        return (
          <span key={i} style={{
            opacity,
            transform: `translateX(${x}px)`,
            display: "inline-block",
            fontFamily: FONT,
            color: "white",
          }}>
            {word}
          </span>
        );
      })}
    </div>
  );
}

// Angled neon line sweep — used as transition wipe between scenes
function NeonSweep({ frame, startFrame }) {
  const progress = fi(frame, startFrame, startFrame + 25, 0, 1);
  const x = fi(frame, startFrame, startFrame + 35, -200, 2200);
  const opacity = progress * (1 - fi(frame, startFrame + 20, startFrame + 35, 0, 1));
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      viewBox="0 0 1920 1080"
    >
      <defs>
        <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="40%" stopColor={PURPLE} stopOpacity="0.9" />
          <stop offset="60%" stopColor={RED} stopOpacity="0.9" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <line
        x1={x - 120} y1={1080}
        x2={x + 120} y2={0}
        stroke="url(#sweepGrad)"
        strokeWidth={3}
        opacity={opacity}
      />
      <line
        x1={x - 60} y1={1080}
        x2={x + 60} y2={0}
        stroke="url(#sweepGrad)"
        strokeWidth={1}
        opacity={opacity * 0.5}
      />
    </svg>
  );
}

// ── SCENE 0–150: Logo slam + tagline (5 seconds) ──────────────────────────────
function OpenScene({ frame }) {
  // Logo drops in from above and settles
  const logoY = fi(frame, 0, 22, -60, 0);
  const logoOpacity = fi(frame, 0, 18, 0, 1);

  // Tagline line 1: "Your GTM data is everywhere."  starts at frame 45
  const line1Opacity = fi(frame, 45, 58, 0, 1);
  const line1Y = fi(frame, 45, 62, 14, 0);

  // Tagline line 2: "Your team is drowning in it."  starts at frame 72
  const line2Opacity = fi(frame, 72, 85, 0, 1);
  const line2Y = fi(frame, 72, 89, 14, 0);

  // Everything fades out at end (frame 130–150)
  const sceneOpacity = fi(frame, 128, 150, 1, 0);

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <NeonRings frame={frame} />
      <GlowBlob frame={frame} />

      {/* Logo */}
      <div style={{
        position: "absolute",
        top: 340,
        left: 0, right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: logoOpacity,
        transform: `translateY(${logoY}px)`,
      }}>
        <ZILogo opacity={1} />
      </div>

      {/* Tagline */}
      <div style={{
        position: "absolute",
        top: 445,
        left: 0, right: 0,
        textAlign: "center",
      }}>
        <div style={{
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
          fontFamily: FONT,
          fontSize: 42,
          fontWeight: 300,
          color: "white",
          letterSpacing: -0.3,
          lineHeight: 1.3,
        }}>
          Your GTM data is everywhere.
        </div>
        <div style={{
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
          fontFamily: FONT,
          fontSize: 42,
          fontWeight: 300,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: -0.3,
          marginTop: 6,
        }}>
          Your team is drowning in it.
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── SCENE 2: 150–360 — Setup / Problem + GTM Studio reveal ───────────────────
// Beat 1 (150–220): "34+ tools. Siloed data. Manual research." — problem slam
// Beat 2 (220–280): "There's a better way." — single line pause
// Beat 3 (280–360): "GTM Studio." + sub — name card

function ProblemBeat({ frame }) {
  // Three stat pills animate in sequentially
  const stats = ["34+ tools.", "Siloed data.", "Manual research."];
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 18,
    }}>
      {stats.map((text, i) => {
        const sf = 150 + i * 16;
        const opacity = fi(frame, sf, sf + 14, 0, 1);
        const y = fi(frame, sf, sf + 18, 20, 0);
        // fade out whole beat from frame 210
        const fadeOut = fi(frame, 210, 225, 1, 0);
        return (
          <div key={i} style={{
            opacity: opacity * fadeOut,
            transform: `translateY(${y}px)`,
            fontFamily: FONT,
            fontSize: 52,
            fontWeight: 700,
            color: i === 0 ? "white" : i === 1 ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.5)",
            letterSpacing: -0.5,
          }}>
            {text}
          </div>
        );
      })}
      {/* sub-line: "Campaigns that take 3 weeks to launch." */}
      {(() => {
        const sf = 150 + 3 * 16;
        const opacity = fi(frame, sf, sf + 14, 0, 1) * fi(frame, 210, 225, 1, 0);
        return (
          <div style={{
            opacity,
            fontFamily: FONT,
            fontSize: 28,
            fontWeight: 300,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: 0.2,
            marginTop: 4,
          }}>
            Campaigns that take 3 weeks to launch.
          </div>
        );
      })()}
    </div>
  );
}

function BetterWayBeat({ frame }) {
  const opacity = fi(frame, 225, 238, 0, 1) * fi(frame, 268, 282, 1, 0);
  const scale = fi(frame, 225, 240, 0.94, 1);
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        opacity,
        transform: `scale(${scale})`,
        fontFamily: FONT,
        fontSize: 58,
        fontWeight: 300,
        color: "white",
        letterSpacing: -1,
        textAlign: "center",
      }}>
        There's a better way to run go-to-market.
      </div>
    </div>
  );
}

function GTMStudioNameCard({ frame }) {
  // "GTM Studio" slams in bold, sub fades below
  const nameOpacity = fi(frame, 285, 300, 0, 1);
  const nameScale = fi(frame, 285, 302, 0.88, 1);
  const subOpacity = fi(frame, 308, 322, 0, 1);
  const subY = fi(frame, 308, 322, 10, 0);
  // scene fade-out
  const sceneOut = fi(frame, 345, 362, 1, 0);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 20,
      opacity: sceneOut,
    }}>
      {/* Glow behind the name */}
      <div style={{
        position: "absolute",
        width: 700, height: 260,
        borderRadius: "50%",
        background: `radial-gradient(ellipse at center, ${RED}33 0%, transparent 70%)`,
        opacity: nameOpacity,
      }} />
      <div style={{
        opacity: nameOpacity,
        transform: `scale(${nameScale})`,
        fontFamily: FONT,
        fontSize: 96,
        fontWeight: 800,
        color: "white",
        letterSpacing: -2,
        lineHeight: 1,
        textAlign: "center",
      }}>
        GTM Studio.
      </div>
      <div style={{
        opacity: subOpacity,
        transform: `translateY(${subY}px)`,
        fontFamily: FONT,
        fontSize: 30,
        fontWeight: 300,
        color: "rgba(255,255,255,0.6)",
        letterSpacing: 0.2,
        textAlign: "center",
      }}>
        Turn fragmented data into intelligent, automated revenue plays.
      </div>
    </div>
  );
}

// ── SCENE 3: 360–600 — Data layer convergence diagram (:12–:20) ──────────────
// Source nodes fan in from sides, animated connector lines flow to center hub

const DATA_SOURCES = [
  { label: "CRM",                    sub: "Salesforce · HubSpot",   angle: -140, radius: 370, color: "#60a5fa" },
  { label: "Snowflake",              sub: "First-party warehouse",  angle: -100, radius: 420, color: "#818cf8" },
  { label: "ZoomInfo Signals",       sub: "Intent · firmographics", angle:  -60, radius: 370, color: RED       },
  { label: "Conversation Intel",     sub: "Gong · Chorus",          angle:   80, radius: 420, color: "#a78bfa" },
  { label: "Marketing Automation",  sub: "Marketo · Eloqua",       angle:  120, radius: 370, color: "#f472b6" },
];

function dataNodePos(angle, radius) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: 960 + radius * Math.cos(rad),
    y: 540 + radius * Math.sin(rad),
  };
}

// ── WORKFLOW RIG — reusable horizontal node flow ──────────────────────────────
function WorkflowRig({ frame, startFrame, nodes, accentColor = RED }) {
  const lf = frame - startFrame;
  const NODE_W = 280;
  const NODE_H = 100;
  const GAP = 80;
  const STEP = NODE_W + GAP;
  const totalW = nodes.length * NODE_W + (nodes.length - 1) * GAP;
  const startX = (1920 - totalW) / 2;
  const cy = 540;
  const HOLD = 50;
  const TRAVEL = 28;

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 1920 1080">
      {nodes.map((node, i) => {
        const nodeStart = i * HOLD;
        const nodeOpacity = fi(lf, nodeStart, nodeStart + 14, 0, 1);
        const nodeY = fi(lf, nodeStart, nodeStart + 18, 18, 0);
        const isActive = lf >= nodeStart && lf < nodeStart + HOLD;
        const isPast = lf >= nodeStart + HOLD;
        const nx = startX + i * STEP;
        const glowOpacity = isActive ? 0.18 * Math.sin(((lf - nodeStart) / HOLD) * Math.PI) : 0;
        const hasNext = i < nodes.length - 1;
        const lineStart = nodeStart + 20;
        const lineProgress = hasNext ? fi(lf, lineStart, lineStart + TRAVEL, 0, 1) : 0;
        const lineX1 = nx + NODE_W;
        const lineX2 = lineX1 + GAP * lineProgress;
        const ptProgress = hasNext ? fi(lf, lineStart + 4, lineStart + TRAVEL + 4, 0, 1) : 0;
        const ptX = lineX1 + GAP * ptProgress;
        const ptVisible = ptProgress > 0.02 && ptProgress < 0.98;
        const borderColor = isActive ? accentColor : isPast ? `rgba(255,255,255,0.5)` : `rgba(255,255,255,0.2)`;
        const bg = isActive ? `rgba(234,24,21,0.12)` : isPast ? `rgba(255,255,255,0.04)` : `rgba(255,255,255,0.02)`;
        return (
          <g key={i}>
            {isActive && <ellipse cx={nx + NODE_W / 2} cy={cy} rx={NODE_W * 0.6} ry={NODE_H * 0.7} fill={accentColor} opacity={glowOpacity} />}
            <foreignObject x={nx} y={cy - NODE_H / 2} width={NODE_W} height={NODE_H} style={{ opacity: nodeOpacity, transform: `translateY(${nodeY}px)` }}>
              <div style={{
                width: "100%", height: "100%", background: bg,
                border: `2px solid ${borderColor}`, borderRadius: 20,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 6, boxSizing: "border-box", padding: "0 18px",
                boxShadow: isActive ? `0 0 24px ${accentColor}44` : "none",
              }}>
                <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: isActive ? accentColor : "rgba(255,255,255,0.3)", letterSpacing: 1.8, textTransform: "uppercase" }}>
                  {node.type}
                </div>
                <div style={{ fontFamily: FONT, fontSize: 19, fontWeight: 700, color: isActive || isPast ? "white" : "rgba(255,255,255,0.35)", letterSpacing: -0.2, textAlign: "center", lineHeight: 1.2 }}>
                  {node.label}
                </div>
                {node.sub && (
                  <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 400, color: isActive ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.3 }}>
                    {node.sub}
                  </div>
                )}
              </div>
            </foreignObject>
            {hasNext && (
              <>
                <line x1={lineX1} y1={cy} x2={lineX2} y2={cy} stroke={accentColor} strokeWidth={2} opacity={0.6} />
                {ptVisible && <circle cx={ptX} cy={cy} r={5} fill={accentColor} opacity={0.9} />}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── UI SCREENSHOT MOMENT — matches reference video treatment exactly ──────────
// Light/white bg with colored gradient blobs, screenshot floats in from scale+y
// Slow upward pan while holding. Optional prompt bar that sweeps in from right.

function PromptBar({ text, frame, startFrame }) {
  // Sweeps in from right on dark bg with neon streak
  const lf = frame - startFrame;
  const x = fi(lf, 0, 22, 220, 0); // slides in from right
  const opacity = fi(lf, 0, 18, 0, 1);
  // typing: reveal chars progressively
  const charsVisible = Math.floor(fi(lf, 10, 10 + text.length * 1.4, 0, text.length));
  const displayText = text.slice(0, charsVisible);
  const showCursor = charsVisible < text.length || (Math.floor(lf / 15) % 2 === 0);

  return (
    <div style={{
      position: "absolute", top: "50%", left: "8%",
      transform: `translateY(-50%) translateX(${x}px)`,
      opacity,
      width: "84%",
    }}>
      {/* Neon glow streak behind bar */}
      <div style={{
        position: "absolute", top: "50%", left: -40, right: -40,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${PURPLE}cc, ${RED}cc, transparent)`,
        transform: "translateY(-50%)",
        filter: "blur(3px)",
        opacity: fi(lf, 0, 14, 0, 0.8),
      }} />
      <div style={{
        background: "white",
        borderRadius: 12,
        padding: "22px 32px",
        boxShadow: `0 0 40px ${PURPLE}44, 0 2px 20px rgba(0,0,0,0.3)`,
        border: `1.5px solid ${PURPLE}55`,
        fontFamily: FONT,
        fontSize: 32,
        fontWeight: 600,
        color: "#1e2d5a",
        letterSpacing: -0.3,
        minHeight: 72,
      }}>
        {displayText}
        {showCursor && <span style={{ borderRight: "2px solid #1e2d5a", marginLeft: 2 }}>&nbsp;</span>}
      </div>
    </div>
  );
}

function UIScreenshot({ src, frame, startFrame, blobColors, panAmount = 40, sceneOut }) {
  const lf = frame - startFrame;
  // Float in: scale from 1.06→1.0, translateY from 30→0
  const scale = fi(lf, 0, 28, 1.06, 1.0);
  const y = fi(lf, 0, 28, 30, 0);
  const opacity = fi(lf, 0, 20, 0, 1);
  // Slow upward pan while holding
  const pan = fi(lf, 28, 280, 0, -panAmount);

  const [blob1, blob2] = blobColors;

  return (
    <AbsoluteFill style={{ opacity: (sceneOut !== undefined ? sceneOut : 1) }}>
      {/* Light background */}
      <div style={{ position: "absolute", inset: 0, background: "#f5f5f8" }} />
      {/* Gradient blobs */}
      <div style={{
        position: "absolute", top: -100, left: -100, width: 700, height: 700,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${blob1}88 0%, transparent 65%)`,
        filter: "blur(2px)",
      }} />
      <div style={{
        position: "absolute", bottom: -120, right: -80, width: 650, height: 650,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${blob2}77 0%, transparent 65%)`,
        filter: "blur(2px)",
      }} />

      {/* Screenshot */}
      <div style={{
        position: "absolute",
        top: "8%", left: "8%", right: "8%", bottom: "8%",
        opacity,
        transform: `scale(${scale}) translateY(${y + pan}px)`,
        transformOrigin: "top center",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.18), 0 4px 20px rgba(0,0,0,0.1)",
      }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      </div>
    </AbsoluteFill>
  );
}

// ── SCENE 4: 600–1080 — UC1 Competitive Displacement (:20–:36) ───────────────
const UC1_NODES = [
  { type: "TRIGGER", label: "Competitor Tech Stack", sub: "Exclude existing customers" },
  { type: "AGENT 1", label: "Layer Intent Signals",  sub: "G2 activity · job postings · tech drops" },
  { type: "AGENT 2", label: "AI Ranks Accounts",     sub: "Fit + switch potential score" },
  { type: "OUTPUT",  label: "Push to Reps",           sub: "AI-drafted email · ready to send" },
];

function UC1Scene({ frame }) {
  const lf = frame - 600;
  const sceneOut = fi(frame, 1060, 1080, 1, 0);

  // Beat 1 (lf 0–160): dark bg — headline + workflow nodes animate
  const darkOpacity = fi(lf, 140, 165, 1, 0);
  const titleOpacity = fi(lf, 0, 18, 0, 1) * fi(lf, 130, 150, 1, 0);
  const titleY = fi(lf, 0, 18, 12, 0);
  const wfOpacity = fi(lf, 28, 44, 0, 1) * fi(lf, 130, 150, 1, 0);

  // Beat 2 (lf 165–300): prompt bar sweeps in on dark bg
  const promptVisible = lf >= 160 && lf < 310;
  const promptOut = fi(lf, 290, 310, 1, 0);

  // Beat 3 (lf 310–480): UI screenshot — audience/activate screen on light bg
  const screenshotVisible = lf >= 305;
  const screenshotOut = fi(lf, 455, 475, 1, 0);

  // Card overlay after screenshot (lf 380–455)
  const cardOpacity = fi(lf, 375, 392, 0, 1) * fi(lf, 450, 468, 1, 0);
  const cardY = fi(lf, 375, 392, 14, 0);

  return (
    <AbsoluteFill style={{ opacity: sceneOut }}>

      {/* Beat 3: UI screenshot on light bg (renders behind dark overlay) */}
      {screenshotVisible && (
        <UIScreenshot
          src="/gtmstudio/activate-screen.png"
          frame={frame} startFrame={905}
          blobColors={["#e87575", "#c084fc"]}
          panAmount={50}
          sceneOut={screenshotOut}
        />
      )}

      {/* Beat 1: dark bg with workflow */}
      <AbsoluteFill style={{ opacity: darkOpacity }}>
        <div style={{ position: "absolute", inset: 0, background: BG }} />
        <NeonRings frame={frame} />
        <GlowBlob frame={frame} />
        <NeonSweep frame={frame} startFrame={598} />
        <div style={{ position: "absolute", top: 148, left: 0, right: 0, textAlign: "center", opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
          <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Use Case 01</div>
          <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 700, color: "white", letterSpacing: -1 }}>Find competitors' customers.</div>
          <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 300, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>Before they switch on their own.</div>
        </div>
        <div style={{ opacity: wfOpacity }}>
          <WorkflowRig frame={frame} startFrame={630} nodes={UC1_NODES} />
        </div>
      </AbsoluteFill>

      {/* Beat 2: prompt bar on dark bg */}
      {promptVisible && (
        <AbsoluteFill style={{ opacity: promptOut }}>
          <div style={{ position: "absolute", inset: 0, background: BG }} />
          <NeonRings frame={frame} />
          {/* deep purple-red bg glow for prompt moment */}
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 70% 50%, ${PURPLE}55 0%, transparent 55%)`,
          }} />
          <PromptBar
            text="Filter accounts by competitor tech stack"
            frame={frame} startFrame={770}
          />
        </AbsoluteFill>
      )}

      {/* Card overlay on screenshot */}
      {screenshotVisible && (
        <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", opacity: cardOpacity * screenshotOut, transform: `translateY(${cardY}px)` }}>
          <div style={{ display: "inline-block", background: "rgba(8,16,31,0.82)", border: `1px solid ${RED}55`, borderRadius: 16, padding: "16px 48px", backdropFilter: "blur(8px)" }}>
            <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 300, color: "rgba(255,255,255,0.8)" }}>From signal to outreach — </span>
            <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: "white" }}>in minutes, not weeks.</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}


// ── SCENE 5: 1080–1560 — UC2 Churn Risk Detection (:36–:52) ─────────────────
const UC2_NODES = [
  { type: "TRIGGER", label: "Renewal Timeline",      sub: "Filter by contract value" },
  { type: "AGENT 1", label: "Layer Risk Signals",    sub: "Usage drops · champion exits · competitive" },
  { type: "AGENT 2", label: "AI Scores Churn Risk",  sub: "Ranked by contract value + time to renewal" },
  { type: "OUTPUT",  label: "Alert CSM + Email",     sub: "Slack alert · re-engagement draft ready" },
];

function UC2Scene({ frame }) {
  const lf = frame - 1080;
  const sceneOut = fi(frame, 1540, 1560, 1, 0);

  const darkOpacity = fi(lf, 140, 165, 1, 0);
  const titleOpacity = fi(lf, 0, 18, 0, 1) * fi(lf, 130, 150, 1, 0);
  const titleY = fi(lf, 0, 18, 12, 0);
  const wfOpacity = fi(lf, 28, 44, 0, 1) * fi(lf, 130, 150, 1, 0);

  const promptVisible = lf >= 160 && lf < 310;
  const promptOut = fi(lf, 290, 310, 1, 0);

  const screenshotVisible = lf >= 305;
  const screenshotOut = fi(lf, 435, 455, 1, 0);

  const cardOpacity = fi(lf, 370, 388, 0, 1) * fi(lf, 430, 448, 1, 0);
  const cardY = fi(lf, 370, 388, 14, 0);

  return (
    <AbsoluteFill style={{ opacity: sceneOut }}>

      {screenshotVisible && (
        <UIScreenshot
          src="gtmstudio/ai-enrich.png"
          frame={frame} startFrame={1385}
          blobColors={["#f87171", "#818cf8"]}
          panAmount={45}
          sceneOut={screenshotOut}
        />
      )}

      <AbsoluteFill style={{ opacity: darkOpacity }}>
        <div style={{ position: "absolute", inset: 0, background: BG }} />
        <NeonRings frame={frame} />
        <GlowBlob frame={frame} />
        <NeonSweep frame={frame} startFrame={1078} />
        <div style={{ position: "absolute", top: 148, left: 0, right: 0, textAlign: "center", opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
          <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Use Case 02</div>
          <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 700, color: "white", letterSpacing: -1 }}>Catch churn before they decide.</div>
          <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 300, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>Before your customer decides to leave.</div>
        </div>
        <div style={{ opacity: wfOpacity }}>
          <WorkflowRig frame={frame} startFrame={1110} nodes={UC2_NODES} />
        </div>
      </AbsoluteFill>

      {promptVisible && (
        <AbsoluteFill style={{ opacity: promptOut }}>
          <div style={{ position: "absolute", inset: 0, background: BG }} />
          <NeonRings frame={frame} />
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 30% 50%, ${RED}44 0%, transparent 55%)`,
          }} />
          <PromptBar
            text="Score churn risk across renewals this quarter"
            frame={frame} startFrame={1250}
          />
        </AbsoluteFill>
      )}

      {screenshotVisible && (
        <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", opacity: cardOpacity * screenshotOut, transform: `translateY(${cardY}px)` }}>
          <div style={{ display: "inline-block", background: "rgba(8,16,31,0.82)", border: `1px solid ${RED}55`, borderRadius: 16, padding: "16px 48px", backdropFilter: "blur(8px)" }}>
            <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: "white" }}>Your early warning system. </span>
            <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 300, color: "rgba(255,255,255,0.8)" }}>Always on.</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}

// ── SCENE 6: 1560–2040 — UC3 Champion Has Moved (:52–:68) ────────────────────
const UC3_NODES = [
  { type: "TRIGGER", label: "Champion Changes Jobs",  sub: "Job change signal detected" },
  { type: "AGENT 1", label: "Match New Company",      sub: "Firmographics · signals · fit score" },
  { type: "AGENT 2", label: "AI Account Brief",       sub: "Brief + personalized outreach angle" },
  { type: "OUTPUT",  label: "Warm Outreach Ready",    sub: "Rep notified · draft ready to send" },
];

function UC3Scene({ frame }) {
  const lf = frame - 1560;
  const sceneOut = fi(frame, 2020, 2040, 1, 0);

  const darkOpacity = fi(lf, 140, 165, 1, 0);
  const titleOpacity = fi(lf, 0, 18, 0, 1) * fi(lf, 130, 150, 1, 0);
  const titleY = fi(lf, 0, 18, 12, 0);
  const wfOpacity = fi(lf, 28, 44, 0, 1) * fi(lf, 130, 150, 1, 0);

  const promptVisible = lf >= 160 && lf < 310;
  const promptOut = fi(lf, 290, 310, 1, 0);

  const screenshotVisible = lf >= 305;
  const screenshotOut = fi(lf, 435, 455, 1, 0);

  const cardOpacity = fi(lf, 370, 388, 0, 1) * fi(lf, 430, 448, 1, 0);
  const cardY = fi(lf, 370, 388, 14, 0);

  return (
    <AbsoluteFill style={{ opacity: sceneOut }}>

      {screenshotVisible && (
        <UIScreenshot
          src="gtmstudio/main-layout.png"
          frame={frame} startFrame={1865}
          blobColors={["#c084fc", "#f472b6"]}
          panAmount={40}
          sceneOut={screenshotOut}
        />
      )}

      <AbsoluteFill style={{ opacity: darkOpacity }}>
        <div style={{ position: "absolute", inset: 0, background: BG }} />
        <NeonRings frame={frame} />
        <GlowBlob frame={frame} />
        <NeonSweep frame={frame} startFrame={1558} />
        <div style={{ position: "absolute", top: 148, left: 0, right: 0, textAlign: "center", opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
          <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Use Case 03</div>
          <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 700, color: "white", letterSpacing: -1 }}>Your best leads already know you.</div>
          <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 300, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>Turn every job change into a warm introduction.</div>
        </div>
        <div style={{ opacity: wfOpacity }}>
          <WorkflowRig frame={frame} startFrame={1590} nodes={UC3_NODES} />
        </div>
      </AbsoluteFill>

      {promptVisible && (
        <AbsoluteFill style={{ opacity: promptOut }}>
          <div style={{ position: "absolute", inset: 0, background: BG }} />
          <NeonRings frame={frame} />
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 60% 50%, ${PURPLE}55 0%, transparent 55%)`,
          }} />
          <PromptBar
            text="Champions who moved to new companies this month"
            frame={frame} startFrame={1730}
          />
        </AbsoluteFill>
      )}

      {screenshotVisible && (
        <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", opacity: cardOpacity * screenshotOut, transform: `translateY(${cardY}px)` }}>
          <div style={{ display: "inline-block", background: "rgba(8,16,31,0.82)", border: `1px solid ${PURPLE}66`, borderRadius: 16, padding: "16px 48px", backdropFilter: "blur(8px)" }}>
            <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 300, color: "rgba(255,255,255,0.8)" }}>One job change. </span>
            <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: "white" }}>A fully briefed outreach in seconds.</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}

function ConceptScene({ frame }) {
  // frame is absolute — scene runs 360–600
  const lf = frame - 360; // local frame 0–240

  const hubScale = fi(lf, 20, 42, 0.5, 1);
  const hubOpacity = fi(lf, 16, 36, 0, 1);
  const sceneOut = fi(frame, 582, 600, 1, 0);

  return (
    <AbsoluteFill style={{ opacity: sceneOut }}>
      <NeonRings frame={frame} />
      <GlowBlob frame={frame} />
      <NeonSweep frame={frame} startFrame={358} />

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 1920 1080">
        {DATA_SOURCES.map((src, i) => {
          const nodeDelay = 30 + i * 18;
          const nodeOpacity = fi(lf, nodeDelay, nodeDelay + 16, 0, 1);
          const nodeScale = fi(lf, nodeDelay, nodeDelay + 20, 0.7, 1);
          const pos = dataNodePos(src.angle, src.radius);

          // Animated line from node → hub (cx=960, cy=540)
          // Progress draws the line from node toward hub
          const lineStart = nodeDelay + 10;
          const lineProgress = fi(lf, lineStart, lineStart + 28, 0, 1);
          // Interpolate point along line: from pos → hub center
          const lx1 = pos.x, ly1 = pos.y;
          const lx2 = 960,   ly2 = 540;
          // Draw line from node end, ending at progress% toward hub
          const ex = lx1 + (lx2 - lx1) * lineProgress;
          const ey = ly1 + (ly2 - ly1) * lineProgress;

          // Glowing particle traveling along the line
          const ptProgress = fi(lf, lineStart + 5, lineStart + 38, 0, 1);
          const ptX = lx1 + (lx2 - lx1) * ptProgress;
          const ptY = ly1 + (ly2 - ly1) * ptProgress;
          const ptOpacity = ptProgress > 0 && ptProgress < 1 ? 1 : 0;

          return (
            <g key={i}>
              {/* Connector line */}
              <line
                x1={lx1} y1={ly1} x2={ex} y2={ey}
                stroke={src.color}
                strokeWidth={1.5}
                strokeOpacity={0.45}
              />
              {/* Traveling particle */}
              <circle cx={ptX} cy={ptY} r={4} fill={src.color} opacity={ptOpacity}>
                <animate attributeName="r" values="3;6;3" dur="0.6s" repeatCount="indefinite" />
              </circle>
              {/* Node box */}
              <foreignObject
                x={pos.x - 110} y={pos.y - 36}
                width={220} height={72}
                style={{ opacity: nodeOpacity, transform: `scale(${nodeScale})`, transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                <div style={{
                  width: "100%", height: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: `1.5px solid ${src.color}44`,
                  borderRadius: 14,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 4,
                  backdropFilter: "blur(4px)",
                  boxShadow: `0 0 18px ${src.color}22`,
                }}>
                  <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: "white", letterSpacing: 0.2 }}>
                    {src.label}
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.45)" }}>
                    {src.sub}
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Center hub */}
        <g style={{ transformOrigin: "960px 540px", transform: `scale(${hubScale})` }}>
          <circle cx={960} cy={540} r={88} fill={`${RED}22`} />
          <circle cx={960} cy={540} r={88} fill="none" stroke={RED} strokeWidth={2} opacity={hubOpacity} />
          <circle cx={960} cy={540} r={72} fill="rgba(8,16,31,0.9)" opacity={hubOpacity} />
          <foreignObject x={960 - 84} y={540 - 30} width={168} height={60} style={{ opacity: hubOpacity }}>
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 3,
            }}>
              <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 800, color: "white", letterSpacing: 1.5, textTransform: "uppercase" }}>
                GTM Studio
              </div>
              <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 400, color: `${RED}cc`, letterSpacing: 0.5 }}>
                Unified Workspace
              </div>
            </div>
          </foreignObject>
        </g>
      </svg>

      {/* Card overlay: "One workspace. Every signal. Instant action." */}
      {(() => {
        const opacity = fi(lf, 170, 188, 0, 1) * fi(lf, 225, 240, 1, 0);
        const y = fi(lf, 170, 188, 14, 0);
        return (
          <div style={{
            position: "absolute", bottom: 110, left: 0, right: 0,
            textAlign: "center",
            opacity,
            transform: `translateY(${y}px)`,
          }}>
            <div style={{
              display: "inline-block",
              background: "rgba(8,16,31,0.75)",
              border: "1px solid rgba(234,24,21,0.3)",
              borderRadius: 16,
              padding: "18px 48px",
              backdropFilter: "blur(8px)",
            }}>
              <span style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: "white", letterSpacing: -0.3 }}>
                One workspace.{" "}
              </span>
              <span style={{ fontFamily: FONT, fontSize: 32, fontWeight: 300, color: `${RED}ee` }}>
                Every signal.{" "}
              </span>
              <span style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: "white" }}>
                Instant action.
              </span>
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
}

function SetupScene({ frame }) {
  return (
    <AbsoluteFill>
      <NeonRings frame={frame} />
      <GlowBlob frame={frame} />
      <NeonSweep frame={frame} startFrame={148} />
      {frame < 225 && <ProblemBeat frame={frame} />}
      {frame >= 220 && frame < 285 && <BetterWayBeat frame={frame} />}
      {frame >= 282 && <GTMStudioNameCard frame={frame} />}
    </AbsoluteFill>
  );
}

export function GTMStudio() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FONT, overflow: "hidden" }}>
      {/* Scene 1: Open */}
      {frame < 150 && <OpenScene frame={frame} />}
      {/* Scene 2: Setup / Problem → GTM Studio */}
      {frame >= 148 && frame < 362 && <SetupScene frame={frame} />}
      {/* Scene 3: Data layer convergence */}
      {frame >= 358 && frame < 602 && <ConceptScene frame={frame} />}
      {/* Scene 4: UC1 Competitive Displacement */}
      {frame >= 598 && frame < 1082 && <UC1Scene frame={frame} />}
      {/* Scene 5: UC2 Churn Risk */}
      {frame >= 1078 && frame < 1562 && <UC2Scene frame={frame} />}
      {/* Scene 6: UC3 Champion Moved */}
      {frame >= 1558 && frame < 2042 && <UC3Scene frame={frame} />}
      {/* Scene 7: Value props rapid cards */}
      {frame >= 2038 && frame < 2370 && <ValuePropsScene frame={frame} />}
      {/* Scene 8: Close */}
      {frame >= 2366 && <CloseScene frame={frame} />}
    </AbsoluteFill>
  );
}

// ── SCENE 7: 2040–2370 — Value props rapid fire (:68–:79) ────────────────────
const VALUE_CARDS = [
  {
    eyebrow: "Built on ZoomInfo's B2B intelligence",
    stats: ["100M+ companies", "260M+ professionals", "Real-time intent & signals"],
  },
  {
    eyebrow: "AI that works from your data",
    stats: ["Web research", "Conversation intelligence", "Custom scoring · waterfall enrichment"],
  },
  {
    eyebrow: "Designed for revenue teams",
    stats: ["No engineering required", "50+ integrations", "CRM · Outreach · Salesloft · Snowflake"],
  },
  {
    eyebrow: null,
    headline: "3x faster pipeline generation.",
    sub: "26% higher conversion rates.",
    big: true,
  },
];

function ValuePropsScene({ frame }) {
  const lf = frame - 2040;
  // Each card gets ~80 frames
  const CARD_DUR = 80;
  const sceneOut = fi(frame, 2350, 2370, 1, 0);

  return (
    <AbsoluteFill style={{ opacity: sceneOut }}>
      <div style={{ position: "absolute", inset: 0, background: BG }} />
      <NeonRings frame={frame} />
      <GlowBlob frame={frame} />
      <NeonSweep frame={frame} startFrame={2038} />

      {VALUE_CARDS.map((card, i) => {
        const start = i * CARD_DUR;
        const end = start + CARD_DUR;
        if (lf < start - 5 || lf > end + 10) return null;
        const opacity = fi(lf, start, start + 14, 0, 1) * fi(lf, end - 14, end, 1, 0);
        const y = fi(lf, start, start + 18, 20, 0);

        if (card.big) {
          return (
            <div key={i} style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              opacity, transform: `translateY(${y}px)`,
            }}>
              <div style={{
                fontFamily: FONT, fontSize: 72, fontWeight: 800,
                color: "white", letterSpacing: -2, textAlign: "center", lineHeight: 1.1,
              }}>
                {card.headline}
              </div>
              <div style={{
                fontFamily: FONT, fontSize: 48, fontWeight: 300,
                color: `${RED}ee`, letterSpacing: -1, marginTop: 16, textAlign: "center",
              }}>
                {card.sub}
              </div>
            </div>
          );
        }

        return (
          <div key={i} style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 20, opacity, transform: `translateY(${y}px)`,
          }}>
            <div style={{
              fontFamily: FONT, fontSize: 15, fontWeight: 700,
              color: RED, letterSpacing: 3, textTransform: "uppercase",
            }}>
              {card.eyebrow}
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
              {card.stats.map((s, j) => {
                const so = fi(lf, start + 12 + j * 8, start + 24 + j * 8, 0, 1);
                return (
                  <div key={j} style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 14,
                    padding: "16px 32px",
                    fontFamily: FONT, fontSize: 26, fontWeight: 600,
                    color: "white", opacity: so,
                    transform: `translateY(${fi(lf, start + 12 + j * 8, start + 24 + j * 8, 10, 0)}px)`,
                  }}>
                    {s}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// ── SCENE 8: 2370–2550 — Close (:79–:85) ─────────────────────────────────────
function CloseScene({ frame }) {
  const lf = frame - 2370;

  // "Stop managing data." slams in
  const line1Op = fi(lf, 0, 16, 0, 1) * fi(lf, 55, 70, 1, 0);
  const line1Y = fi(lf, 0, 16, 18, 0);
  const line2Op = fi(lf, 18, 34, 0, 1) * fi(lf, 55, 70, 1, 0);
  const line2Y = fi(lf, 18, 34, 18, 0);

  // "GTM Studio by ZoomInfo" brand lock-up
  const brandOp = fi(lf, 80, 98, 0, 1) * fi(lf, 165, 180, 1, 0);
  const brandScale = fi(lf, 80, 98, 0.92, 1);
  const subBrandOp = fi(lf, 100, 116, 0, 1) * fi(lf, 165, 180, 1, 0);

  // Final ZI logo + URL
  const finalOp = fi(lf, 185, 200, 0, 1);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, background: BG }} />
      <NeonRings frame={frame} />
      <GlowBlob frame={frame} />
      <NeonSweep frame={frame} startFrame={2368} />

      {/* Beat 1: Stop managing data */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <div style={{ opacity: line1Op, transform: `translateY(${line1Y}px)`, fontFamily: FONT, fontSize: 72, fontWeight: 800, color: "white", letterSpacing: -2 }}>
          Stop managing data.
        </div>
        <div style={{ opacity: line2Op, transform: `translateY(${line2Y}px)`, fontFamily: FONT, fontSize: 72, fontWeight: 300, color: `${RED}ee`, letterSpacing: -2 }}>
          Start activating it.
        </div>
      </div>

      {/* Beat 2: Brand name */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ opacity: brandOp, transform: `scale(${brandScale})`, fontFamily: FONT, fontSize: 64, fontWeight: 800, color: "white", letterSpacing: -1.5, textAlign: "center" }}>
          GTM Studio by ZoomInfo
        </div>
        <div style={{ opacity: subBrandOp, fontFamily: FONT, fontSize: 28, fontWeight: 300, color: "rgba(255,255,255,0.6)", letterSpacing: 0.2 }}>
          From idea to live play — in minutes.
        </div>
      </div>

      {/* Beat 3: Logo + URL */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, opacity: finalOp }}>
        {/* ZI logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 64, height: 64, background: RED, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="36" height="36" viewBox="0 0 30 30" fill="none">
              <path d="M6 7h18l-14 16h14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontFamily: FONT, fontSize: 44, fontWeight: 300, color: "white", letterSpacing: -0.5 }}>ZoomInfo</span>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 400, color: "rgba(255,255,255,0.45)", letterSpacing: 0.5 }}>
          Learn more at zoominfo.com
        </div>
        {/* Neon underline accent */}
        <div style={{ width: 200, height: 2, background: `linear-gradient(90deg, ${PURPLE}, ${RED})`, borderRadius: 2, opacity: 0.7 }} />
      </div>
    </AbsoluteFill>
  );
}
