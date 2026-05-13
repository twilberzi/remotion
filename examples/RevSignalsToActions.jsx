import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

const W = 1920, H = 1080;

// ─── Phase timing ──────────────────────────────────────────────────────────
const P1_END   = 105;
const P2_START = 95;
const P2_END   = 215;
const P3_START = 205;

// ─── Phase 1: signal cards ─────────────────────────────────────────────────
const SIGNALS = [
  { label: "CRM",        icon: "crm",      scatter: { x: 310,  y: 250, rot: -12 }, final: { x: 755, y: 295 } },
  { label: "Emails",     icon: "email",    scatter: { x: 175,  y: 490, rot:   8 }, final: { x: 755, y: 390 } },
  { label: "Calls",      icon: "calls",    scatter: { x: 1550, y: 215, rot:  -6 }, final: { x: 755, y: 485 } },
  { label: "Meetings",   icon: "meetings", scatter: { x: 1645, y: 565, rot:  14 }, final: { x: 755, y: 580 } },
  { label: "Engagement", icon: "engage",   scatter: { x: 415,  y: 770, rot:  -9 }, final: { x: 755, y: 675 } },
];
const SIG_W = 200, SIG_H = 68;

// ─── Phase 2: deal nodes for neural web ────────────────────────────────────
const NODES = [
  { id: 0, x: 760,  y: 310, label: "Acme",    cluster: 0 },
  { id: 1, x: 960,  y: 220, label: "Globex",  cluster: 0 },
  { id: 2, x: 1140, y: 340, label: "Initech", cluster: 0 },
  { id: 3, x: 870,  y: 480, label: "Dunder",  cluster: 1 },
  { id: 4, x: 1060, y: 560, label: "Vance",   cluster: 1 },
  { id: 5, x: 680,  y: 560, label: "Prestige",cluster: 1 },
  { id: 6, x: 1240, y: 480, label: "Umbrella",cluster: 2 },
  { id: 7, x: 1340, y: 320, label: "Veridian", cluster: 2 },
  { id: 8, x: 960,  y: 700, label: "Initrode", cluster: 2 },
];

// Edges between nodes
const EDGES = [
  [0, 1], [1, 2], [0, 3], [1, 3], [3, 4], [3, 5],
  [2, 6], [6, 7], [4, 8], [5, 3], [7, 2], [8, 4],
  [1, 4], [2, 7],
];

// Cluster colors
const CLUSTER_COLORS = ["#16a34a", RED, "#2563eb"];
const CLUSTER_LABELS = ["Multi-threaded", "Single-contact risk", "Stalled — no activity"];

// ─── Phase 3: action cards ─────────────────────────────────────────────────
const ACTIONS = [
  { priority: "01", label: "Call Acme — champion\ngoes dark in 3 days",     color: RED       },
  { priority: "02", label: "Multi-thread Globex —\nmissing 2 stakeholders",  color: "#d97706" },
  { priority: "03", label: "Advance Initech —\nhigh engagement signal",      color: "#16a34a" },
];

function SourceIcon({ type, size = 22 }) {
  const c = NAVY;
  const s = { width: size, height: size };
  if (type === "crm") return (
    <svg {...s} viewBox="0 0 28 28" fill="none">
      <rect x="3" y="7" width="22" height="16" rx="3" stroke={c} strokeWidth="2"/>
      <path d="M3 11h22" stroke={c} strokeWidth="2"/>
      <circle cx="9" cy="17" r="2" fill={c}/>
      <rect x="13" y="15.5" width="8" height="2" rx="1" fill={c}/>
    </svg>
  );
  if (type === "email") return (
    <svg {...s} viewBox="0 0 28 28" fill="none">
      <rect x="3" y="6" width="22" height="16" rx="3" stroke={c} strokeWidth="2"/>
      <path d="M3 9l11 8 11-8" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
  if (type === "calls") return (
    <svg {...s} viewBox="0 0 28 28" fill="none">
      <path d="M6 5h5l2 5-3 2a14 14 0 006 6l2-3 5 2v5c0 1-1 2-2 2C9 24 4 15 4 7c0-1 1-2 2-2z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
  if (type === "meetings") return (
    <svg {...s} viewBox="0 0 28 28" fill="none">
      <rect x="4" y="6" width="20" height="18" rx="3" stroke={c} strokeWidth="2"/>
      <path d="M4 11h20" stroke={c} strokeWidth="2"/>
      <path d="M9 4v4M19 4v4" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <rect x="8" y="15" width="4" height="4" rx="1" fill={c}/>
      <rect x="16" y="15" width="4" height="4" rx="1" fill={c}/>
    </svg>
  );
  if (type === "engage") return (
    <svg {...s} viewBox="0 0 28 28" fill="none">
      <path d="M14 4l2.5 5 5.5.8-4 3.9.9 5.5L14 17l-4.9 2.2.9-5.5-4-3.9 5.5-.8z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
  return null;
}

export const RevSignalsToActions = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showP1 = frame < P1_END + 15;
  const showP2 = frame >= P2_START - 5;
  const showP3 = frame >= P3_START - 5;

  // Phase transition crossfade
  const p1op = fi(frame, P1_END - 10, P1_END + 10, 1, 0);
  const p2op = fi(frame, P2_START, P2_START + 16, 0, 1);
  const p2fade = fi(frame, P2_END - 10, P2_END + 10, 1, 0);
  const p3op = fi(frame, P3_START, P3_START + 16, 0, 1);

  return (
    <AbsoluteFill style={{ background: "#f8faff", fontFamily: FONT, overflow: "hidden" }}>

      {/* ══ PHASE 1: Signals snap into one view ══════════════════════════ */}
      {showP1 && (
        <div style={{ position: "absolute", inset: 0, opacity: p1op }}>
          {/* Label */}
          <div style={{
            position: "absolute", top: 62, left: 0, right: 0, textAlign: "center",
            opacity: fi(frame, 0, 16, 0, 1),
            transform: `translateY(${fi(frame, 0, 16, 10, 0)}px)`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "3px", textTransform: "uppercase", opacity: 0.38 }}>Step 1</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: NAVY, marginTop: 4 }}>
              Bring signals into <span style={{ color: RED }}>one view</span>
            </div>
          </div>

          {/* Panel outline */}
          <div style={{
            position: "absolute", left: 718, top: 242,
            width: 274, height: 484,
            borderRadius: 18,
            border: `2px solid rgba(232,24,46,${fi(frame, 52, 70, 0, 0.3)})`,
            background: `rgba(232,24,46,${fi(frame, 52, 70, 0, 0.025)})`,
          }}/>

          {/* Signal cards */}
          {SIGNALS.map((sig, i) => {
            const appearDelay = 6 + i * 9;
            const moveDelay   = 44 + i * 7;
            const appearSp = spring({ frame: frame - appearDelay, fps, config: { damping: 18, stiffness: 160 } });
            const moveSp   = spring({ frame: frame - moveDelay,   fps, config: { damping: 24, stiffness: 55  } });
            const op = fi(frame, appearDelay, appearDelay + 14, 0, 1);
            const x  = sig.scatter.x + (sig.final.x - sig.scatter.x) * moveSp - SIG_W / 2;
            const y  = sig.scatter.y + (sig.final.y - sig.scatter.y) * moveSp - SIG_H / 2;
            const rot = sig.scatter.rot * (1 - moveSp);
            return (
              <div key={i} style={{
                position: "absolute", left: x, top: y,
                width: SIG_W, height: SIG_H,
                opacity: op,
                transform: `scale(${appearSp}) rotate(${rot}deg)`,
                transformOrigin: "center center",
                background: "white", borderRadius: 13,
                border: "1.5px solid rgba(30,45,90,0.09)",
                boxShadow: "0 4px 16px rgba(30,45,90,0.08)",
                display: "flex", alignItems: "center", gap: 12, padding: "0 16px",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, background: "#f0f2f8",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <SourceIcon type={sig.icon} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{sig.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ PHASE 2: Neural web — pattern detection ══════════════════════ */}
      {showP2 && (
        <div style={{ position: "absolute", inset: 0, opacity: p2op * p2fade }}>
          {/* Label */}
          <div style={{
            position: "absolute", top: 62, left: 0, right: 0, textAlign: "center",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "3px", textTransform: "uppercase", opacity: 0.38 }}>Step 2</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: NAVY, marginTop: 4 }}>
              Look for <span style={{ color: RED }}>patterns</span> across real deals
            </div>
          </div>

          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            {/* Edges — draw in via dashoffset */}
            {EDGES.map(([a, b], i) => {
              const na = NODES[a], nb = NODES[b];
              const len = Math.sqrt((nb.x - na.x) ** 2 + (nb.y - na.y) ** 2);
              const edgeDelay = P2_START + 14 + i * 7;
              const drawn = fi(frame, edgeDelay, edgeDelay + 28, 0, len);
              const sameCluster = na.cluster === nb.cluster;
              const clusterReveal = fi(frame, P2_START + 80, P2_START + 110, 0, 1);
              const edgeColor = sameCluster
                ? CLUSTER_COLORS[na.cluster]
                : `rgba(30,45,90,0.12)`;
              const edgeOp = sameCluster
                ? 0.15 + clusterReveal * 0.55
                : fi(frame, edgeDelay, edgeDelay + 14, 0, 0.18);
              return (
                <line key={i}
                  x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={edgeColor}
                  strokeWidth={sameCluster ? 2 : 1.5}
                  strokeDasharray={len}
                  strokeDashoffset={len - drawn}
                  opacity={edgeOp}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map((node, i) => {
              const nodeDelay = P2_START + 8 + i * 9;
              const nodeSp = spring({ frame: frame - nodeDelay, fps, config: { damping: 18, stiffness: 160 } });
              const nodeOp = fi(frame, nodeDelay, nodeDelay + 14, 0, 1);
              const clusterReveal = fi(frame, P2_START + 80, P2_START + 110, 0, 1);
              const clusterColor = CLUSTER_COLORS[node.cluster];

              // Pulse rings when cluster is revealed
              const pulseFrame = frame - (P2_START + 85 + node.cluster * 12);
              const pulseR = fi(pulseFrame, 0, 40, 20, 52);
              const pulseOp = fi(pulseFrame, 0, 40, 0.5, 0) * clusterReveal;

              return (
                <g key={i} opacity={nodeOp}>
                  {/* Pulse ring */}
                  <circle cx={node.x} cy={node.y} r={pulseR}
                    fill="none" stroke={clusterColor} strokeWidth={2} opacity={pulseOp}/>
                  {/* Node circle */}
                  <circle cx={node.x} cy={node.y}
                    r={22 * nodeSp}
                    fill={`rgba(30,45,90,${0.06 + clusterReveal * 0.06})`}
                    stroke={`rgba(${clusterReveal > 0.5 ? clusterColor.replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)).join(',') : '30,45,90'},${0.18 + clusterReveal * 0.6})`}
                    strokeWidth={2}
                  />
                  {/* Label */}
                  <text x={node.x} y={node.y + 5}
                    textAnchor="middle" fill={NAVY}
                    fontSize={11} fontWeight="700" fontFamily={FONT} opacity={0.7}>
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Cluster legend — fades in after pattern reveal */}
          {CLUSTER_LABELS.map((lbl, i) => {
            const legendOp = fi(frame, P2_START + 105 + i * 12, P2_START + 120 + i * 12, 0, 1);
            return (
              <div key={i} style={{
                position: "absolute",
                left: 130, top: 290 + i * 52,
                display: "flex", alignItems: "center", gap: 10,
                opacity: legendOp,
              }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: CLUSTER_COLORS[i], flexShrink: 0 }}/>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, opacity: 0.75 }}>{lbl}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ PHASE 3: Action cards ════════════════════════════════════════ */}
      {showP3 && (
        <div style={{ position: "absolute", inset: 0, opacity: p3op }}>
          {/* Label */}
          <div style={{
            position: "absolute", top: 62, left: 0, right: 0, textAlign: "center",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "3px", textTransform: "uppercase", opacity: 0.38 }}>Step 3</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: NAVY, marginTop: 4 }}>
              Translate into <span style={{ color: RED }}>specific next actions</span>
            </div>
          </div>

          {ACTIONS.map((action, i) => {
            const delay = P3_START + 20 + i * 24;
            const sp = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 115 } });
            const op = fi(frame, delay, delay + 14, 0, 1);
            const CARD_W = 500, CARD_H = 112;
            return (
              <div key={i} style={{
                position: "absolute",
                left: W / 2 - CARD_W / 2,
                top: 258 + i * 136,
                width: CARD_W, height: CARD_H,
                opacity: op,
                transform: `scale(${sp}) translateY(${(1 - sp) * 28}px)`,
                transformOrigin: "center top",
                background: "white", borderRadius: 16,
                border: "1.5px solid rgba(30,45,90,0.09)",
                boxShadow: "0 6px 28px rgba(30,45,90,0.09)",
                display: "flex", alignItems: "center",
                padding: "0 26px", gap: 20, overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: 5, background: action.color, borderRadius: "16px 0 0 16px",
                }}/>
                <div style={{
                  fontSize: 30, fontWeight: 900, color: action.color,
                  opacity: 0.2, marginLeft: 14, minWidth: 38,
                }}>
                  {action.priority}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, lineHeight: 1.45, whiteSpace: "pre-line" }}>
                  {action.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </AbsoluteFill>
  );
};
