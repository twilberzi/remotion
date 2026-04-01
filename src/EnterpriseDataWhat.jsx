import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

const CX = 960, CY = 520;

const DEPTS = [
  { label: "Marketing",        sub: "Campaigns & leads",   angle: -72  },
  { label: "Sales",            sub: "Pipeline & revenue",  angle:  0   },
  { label: "Finance",          sub: "Budgets & reporting", angle:  72  },
  { label: "Product",          sub: "Usage & roadmap",     angle:  144 },
  { label: "Customer Success", sub: "Health & retention",  angle:  216 },
];

const CITY_Q = [
  "Who maintains the roads?",
  "Which streets connect neighborhoods?",
  "Where do power & water lines run?",
  "How does traffic flow & who controls it?",
];
const DATA_Q = [
  "Who owns which data sets?",
  "How do systems talk to each other?",
  "Where does our data actually live?",
  "How does information flow across the org?",
  "Who controls quality, security & access?",
  "What definitions do we use across teams?",
];

// ── Scene A: Departments as isolated neighborhood cards ───────────────────────
function SceneA({ frame, fps }) {
  const R = 300;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080">
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(30,45,90,0.06)" strokeWidth={2}/>
      </svg>

      {DEPTS.map((d, i) => {
        const rad = ((d.angle - 90) * Math.PI) / 180;
        const nx = CX + R * Math.cos(rad);
        const ny = CY + R * Math.sin(rad);
        const delay = 12 + i * 18;
        const sp = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 150 } });
        const op = fi(frame, delay, delay + 18, 0, 1);
        return (
          <div key={i} style={{ position: "absolute", left: nx - 100, top: ny - 50, width: 200, opacity: op, transform: `scale(${sp})` }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "14px 18px", boxShadow: "0 4px 20px rgba(0,0,60,0.1)", border: "1.5px solid rgba(30,45,90,0.08)", textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, fontFamily: FONT }}>{d.label}</div>
              <div style={{ fontSize: 11, color: "rgba(30,45,90,0.4)", fontFamily: FONT, marginTop: 3 }}>{d.sub}</div>
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", opacity: fi(frame, 105, 120, 0, 1), transform: `translateY(${fi(frame, 105, 120, 12, 0)}px)` }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: NAVY, fontFamily: FONT }}>Your organization is like a <span style={{ color: RED }}>city.</span></div>
        <div style={{ fontSize: 18, fontWeight: 500, color: "rgba(30,45,90,0.5)", fontFamily: FONT, marginTop: 8 }}>Each department is its own neighborhood.</div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene B: "Nothing truly connects" — cards dim, broken connectors ──────────
function SceneB({ frame, fps }) {
  const R = 300;
  const dimOp = fi(frame, 20, 55, 1, 0.25);
  const lineOp = fi(frame, 30, 58, 0, 1);
  const textOp = fi(frame, 70, 90, 0, 1);
  const textY  = fi(frame, 70, 90, 14, 0);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080">
        {DEPTS.map((d, i) => {
          const rad = ((d.angle - 90) * Math.PI) / 180;
          const nx = CX + R * Math.cos(rad);
          const ny = CY + R * Math.sin(rad);
          return (
            <line key={i}
              x1={CX} y1={CY} x2={nx} y2={ny}
              stroke={`rgba(232,24,46,${lineOp * 0.4})`}
              strokeWidth={2} strokeDasharray="8 8"
              opacity={lineOp}
            />
          );
        })}
        {/* X marks in center */}
        <line x1={CX-18} y1={CY-18} x2={CX+18} y2={CY+18} stroke={RED} strokeWidth={4} strokeLinecap="round" opacity={lineOp}/>
        <line x1={CX+18} y1={CY-18} x2={CX-18} y2={CY+18} stroke={RED} strokeWidth={4} strokeLinecap="round" opacity={lineOp}/>
      </svg>

      {DEPTS.map((d, i) => {
        const rad = ((d.angle - 90) * Math.PI) / 180;
        const nx = CX + R * Math.cos(rad);
        const ny = CY + R * Math.sin(rad);
        return (
          <div key={i} style={{ position: "absolute", left: nx - 100, top: ny - 50, width: 200, opacity: dimOp }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "14px 18px", boxShadow: "0 4px 20px rgba(0,0,60,0.1)", border: "1.5px solid rgba(30,45,90,0.08)", textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, fontFamily: FONT }}>{d.label}</div>
              <div style={{ fontSize: 11, color: "rgba(30,45,90,0.4)", fontFamily: FONT, marginTop: 3 }}>{d.sub}</div>
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10, opacity: textOp }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "22px 36px", border: `2px solid ${RED}`, boxShadow: "0 8px 32px rgba(232,24,46,0.2)", textAlign: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: RED, fontFamily: FONT }}>Nothing truly connects.</div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", opacity: textOp, transform: `translateY(${textY}px)` }}>
        <div style={{ fontSize: 20, fontWeight: 500, color: "rgba(30,45,90,0.55)", fontFamily: FONT }}>Each team builds independently — with their own rules, language, and systems.</div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene C: City questions vs. data questions side by side ───────────────────
function SceneC({ frame, fps }) {
  const headerOp = fi(frame, 0, 18, 0, 1);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
      <div style={{ opacity: headerOp }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(30,45,90,0.4)", fontFamily: FONT, letterSpacing: "2px", textAlign: "center", marginBottom: 8 }}>THE SAME QUESTIONS — DIFFERENT CONTEXT</div>
      </div>

      <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        {/* City */}
        <div style={{ width: 400 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(30,45,90,0.4)", fontFamily: FONT, letterSpacing: "2px", marginBottom: 14, textAlign: "center" }}>IN A CITY</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CITY_Q.map((q, i) => {
              const delay = 22 + i * 16;
              return (
                <div key={i} style={{ opacity: fi(frame, delay, delay + 16, 0, 1), transform: `translateX(${fi(frame, delay, delay + 16, -14, 0)}px)` }}>
                  <div style={{ background: "#fff", borderRadius: 12, padding: "12px 18px", boxShadow: "0 2px 12px rgba(0,0,60,0.07)", border: "1.5px solid rgba(30,45,90,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(30,45,90,0.3)", flexShrink: 0 }}/>
                    <div style={{ fontSize: 15, color: "rgba(30,45,90,0.65)", fontFamily: FONT }}>{q}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ opacity: fi(frame, 80, 96, 0, 1), display: "flex", alignItems: "center", paddingTop: 60, fontSize: 32, color: RED }}>→</div>

        {/* Data */}
        <div style={{ width: 460 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: RED, fontFamily: FONT, letterSpacing: "2px", marginBottom: 14, textAlign: "center" }}>IN YOUR BUSINESS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DATA_Q.map((q, i) => {
              const delay = 30 + i * 14;
              return (
                <div key={i} style={{ opacity: fi(frame, delay, delay + 16, 0, 1), transform: `translateX(${fi(frame, delay, delay + 16, 14, 0)}px)` }}>
                  <div style={{ background: "#fff", borderRadius: 12, padding: "12px 18px", boxShadow: "0 2px 12px rgba(232,24,46,0.08)", border: "1.5px solid rgba(232,24,46,0.12)", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: `linear-gradient(135deg, ${RED}, ${PINK})`, flexShrink: 0 }}/>
                    <div style={{ fontSize: 14, color: NAVY, fontFamily: FONT, fontWeight: 500 }}>{q}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene D: Blueprint — center orb connects to all 5 departments ─────────────
function SceneD({ frame, fps }) {
  const R = 310;
  const orbSp = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const ORB_R = 120;
  const lineP = fi(frame, 35, 75, 0, 1);

  return (
    <AbsoluteFill>
      {/* Connector lines */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080">
        {DEPTS.map((d, i) => {
          const rad = ((d.angle - 90) * Math.PI) / 180;
          const nx = CX + R * Math.cos(rad);
          const ny = CY + R * Math.sin(rad);
          const delay = 35 + i * 10;
          const lp = fi(frame, delay, delay + 30, 0, 1);
          return (
            <line key={i}
              x1={CX + ORB_R * Math.cos(rad)} y1={CY + ORB_R * Math.sin(rad)}
              x2={CX + ORB_R * Math.cos(rad) + (nx - CX - ORB_R * Math.cos(rad)) * lp}
              y2={CY + ORB_R * Math.sin(rad) + (ny - CY - ORB_R * Math.sin(rad)) * lp}
              stroke={`rgba(232,24,46,0.3)`} strokeWidth={2} strokeDasharray="6 5"
            />
          );
        })}
      </svg>

      {/* Center orb */}
      <div style={{
        position: "absolute", left: CX - ORB_R * orbSp, top: CY - ORB_R * orbSp,
        width: ORB_R * 2 * orbSp, height: ORB_R * 2 * orbSp,
        borderRadius: "50%", background: `radial-gradient(circle at 36% 34%, #ff5555 0%, ${RED} 38%, #a80f20 100%)`,
        boxShadow: `0 0 0 ${20 * orbSp}px rgba(232,24,46,0.08), 0 0 0 ${44 * orbSp}px rgba(232,24,46,0.04)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, zIndex: 2,
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "white", fontFamily: FONT, letterSpacing: "1.5px", textAlign: "center", lineHeight: 1.3 }}>ENTERPRISE{"\n"}DATA STRATEGY</div>
      </div>

      {/* Dept cards */}
      {DEPTS.map((d, i) => {
        const rad = ((d.angle - 90) * Math.PI) / 180;
        const nx = CX + R * Math.cos(rad);
        const ny = CY + R * Math.sin(rad);
        const delay = 38 + i * 10;
        const sp = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 150 } });
        const op = fi(frame, delay, delay + 18, 0, 1);
        return (
          <div key={i} style={{ position: "absolute", left: nx - 100, top: ny - 44, width: 200, opacity: op, transform: `scale(${sp})` }}>
            <div style={{ background: "#fff", borderRadius: 14, padding: "12px 16px", boxShadow: "0 4px 18px rgba(0,0,60,0.1)", border: "1.5px solid rgba(30,45,90,0.08)", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: NAVY, fontFamily: FONT }}>{d.label}</div>
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", bottom: 72, left: 0, right: 0, textAlign: "center", opacity: fi(frame, 90, 110, 0, 1), transform: `translateY(${fi(frame, 90, 110, 12, 0)}px)` }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: NAVY, fontFamily: FONT }}>
          The <span style={{ color: RED }}>blueprint</span> that defines what data matters, who owns it, and how it drives value.
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene E: "Must be company-wide" warning ───────────────────────────────────
function SceneE({ frame, fps }) {
  const sp = spring({ frame, fps, config: { damping: 18, stiffness: 130 } });
  const op = fi(frame, 0, 22, 0, 1);
  const items = [
    "Own roads, rules & definitions per team",
    "Siloed data, contradictions & confusion",
    "No single source of truth",
  ];

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
      <div style={{ opacity: op, transform: `scale(${sp})`, textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(30,45,90,0.4)", fontFamily: FONT, letterSpacing: "2px", marginBottom: 16 }}>THE TRAP</div>
        <div style={{ fontSize: 44, fontWeight: 900, color: NAVY, fontFamily: FONT, lineHeight: 1.15 }}>
          This only works if it&apos;s <span style={{ color: RED }}>company-wide.</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 680 }}>
        {items.map((item, i) => {
          const delay = 52 + i * 18;
          return (
            <div key={i} style={{ opacity: fi(frame, delay, delay + 16, 0, 1), transform: `translateX(${fi(frame, delay, delay + 16, -16, 0)}px)` }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: "14px 22px", border: `1.5px solid rgba(232,24,46,0.2)`, boxShadow: "0 4px 16px rgba(232,24,46,0.1)", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: RED, flexShrink: 0 }}/>
                <div style={{ fontSize: 17, fontWeight: 600, color: NAVY, fontFamily: FONT }}>{item}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ opacity: fi(frame, 108, 128, 0, 1), transform: `translateY(${fi(frame, 108, 128, 12, 0)}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 500, color: "rgba(30,45,90,0.55)", fontFamily: FONT }}>
          That&apos;s where the silos, contradictions, and confusion begin.{" "}
          <strong style={{ color: NAVY }}>Let&apos;s talk about why this matters now.</strong>
        </div>
      </div>
    </AbsoluteFill>
  );
}

const SA = 150, SB = 120, SC = 150, SD = 120, SE = 150;

export const EnterpriseDataWhat = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Sequence from={0} durationInFrames={SA}><SceneA frame={frame} fps={fps}/></Sequence>
      <Sequence from={SA} durationInFrames={SB}><SceneB frame={frame - SA} fps={fps}/></Sequence>
      <Sequence from={SA+SB} durationInFrames={SC}><SceneC frame={frame - SA - SB} fps={fps}/></Sequence>
      <Sequence from={SA+SB+SC} durationInFrames={SD}><SceneD frame={frame - SA - SB - SC} fps={fps}/></Sequence>
      <Sequence from={SA+SB+SC+SD} durationInFrames={SE}><SceneE frame={frame - SA - SB - SC - SD} fps={fps}/></Sequence>
    </AbsoluteFill>
  );
};
