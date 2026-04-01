import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const GREEN = "#16a34a";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// Single-thread scenario: Rep → Champion → silence → deal drops
// Multi-thread scenario: Rep → 4 contacts → one goes dark → others hold

const REP_X = 200, REP_Y = 300;

const SINGLE_CONTACT = { x: 700, y: 300, label: "Champion", name: "Alex VP" };

const MULTI_CONTACTS = [
  { x: 760, y: 180, label: "Champion",   name: "Alex VP",      goesGrey: false },
  { x: 920, y: 280, label: "Economic",   name: "CFO",          goesGrey: true  },
  { x: 840, y: 400, label: "Technical",  name: "IT Director",  goesGrey: false },
  { x: 680, y: 380, label: "User",       name: "Team Lead",    goesGrey: false },
];

const DEAL_CARD_Y = 540;

export const RevThreaded = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0–80): Single-thread — rep + one contact draw in, line connects
  // Phase 2 (80–140): Contact goes dark, line breaks, deal card drops
  // Phase 3 (155–240): Multi-thread — same rep, 4 contacts, lines draw
  // Phase 4 (240–300): One contact goes grey, remaining lines brighten, deal survives
  // Payoff 300–360

  const singlePhase = frame < 155;

  // Single thread
  const repOp     = fi(frame, 8, 24, 0, 1);
  const sLineLen  = fi(frame, 24, 52, 0, 1); // 0→1 progress of line draw
  const sContactOp = fi(frame, 38, 56, 0, 1);
  const sContactGrey = fi(frame, 82, 108, 0, 1); // contact fades to grey
  const sLineBreak   = fi(frame, 90, 115, 1, 0); // line fades out
  const sDealDrop    = fi(frame, 96, 126, 0, 200); // deal card falls
  const sDealOp      = fi(frame, 96, 112, 0, 1) * fi(frame, 118, 138, 1, 0);

  // Multi thread
  const mPhaseOp    = fi(frame, 155, 172, 0, 1);
  const mLinesDrawn = MULTI_CONTACTS.map((_, i) => fi(frame, 168 + i * 12, 196 + i * 12, 0, 1));
  const mContactOp  = MULTI_CONTACTS.map((_, i) => fi(frame, 172 + i * 12, 192 + i * 12, 0, 1));
  const mGreyIndex  = 1; // CFO goes grey
  const mContactGrey = fi(frame, 248, 272, 0, 1); // CFO fades grey
  const mOtherBright = fi(frame, 260, 285, 1, 1.3); // others pulse brighter

  const mDealOp    = fi(frame, 290, 306, 0, 1);

  const payoffOp = fi(frame, 315, 335, 0, 1);
  const payoffY  = fi(frame, 315, 335, 14, 0);

  const singleLabel = singlePhase;
  const multiLabel  = frame >= 155;

  // Rep node Y position — same for both phases
  const REP_MY = 380;

  return (
    <AbsoluteFill style={{ background: "#f8faff", fontFamily: FONT }}>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>

        {/* ── SINGLE THREAD (left half, visible until phase 3) ── */}
        <g opacity={fi(frame, 140, 160, 1, 0)}>
          {/* Rep node */}
          <g opacity={repOp}>
            <circle cx={REP_X} cy={REP_Y} r={40} fill={NAVY}
              style={{ filter: "drop-shadow(0 4px 16px rgba(30,45,90,0.3))" }}/>
            <text x={REP_X} y={REP_Y + 5} textAnchor="middle" fill="white" fontSize={12} fontWeight="800" fontFamily={FONT}>REP</text>
          </g>

          {/* Line to single contact */}
          {(() => {
            const dx = SINGLE_CONTACT.x - REP_X;
            const dy = SINGLE_CONTACT.y - REP_Y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const drawn = sLineLen * len;
            return (
              <line
                x1={REP_X + (dx / len) * 40}
                y1={REP_Y + (dy / len) * 40}
                x2={REP_X + (dx / len) * (40 + drawn)}
                y2={REP_Y + (dy / len) * (40 + drawn)}
                stroke={NAVY} strokeWidth={3}
                opacity={sLineBreak * repOp}
                strokeDasharray="8 5"
              />
            );
          })()}

          {/* Single contact node */}
          <g opacity={sContactOp}>
            <circle cx={SINGLE_CONTACT.x} cy={SINGLE_CONTACT.y} r={36}
              fill={`rgba(30,45,90,${1 - sContactGrey * 0.85})`}
              style={{ filter: `drop-shadow(0 4px 14px rgba(30,45,90,${0.25 - sContactGrey * 0.22}))` }}
            />
            <text x={SINGLE_CONTACT.x} y={SINGLE_CONTACT.y - 4} textAnchor="middle"
              fill={`rgba(255,255,255,${1 - sContactGrey * 0.7})`}
              fontSize={11} fontWeight="800" fontFamily={FONT}
            >{SINGLE_CONTACT.label}</text>
            <text x={SINGLE_CONTACT.x} y={SINGLE_CONTACT.y + 11} textAnchor="middle"
              fill={`rgba(255,255,255,${0.7 - sContactGrey * 0.6})`}
              fontSize={10} fontFamily={FONT}
            >{SINGLE_CONTACT.name}</text>
          </g>

          {/* "Goes quiet" label */}
          <text x={SINGLE_CONTACT.x} y={SINGLE_CONTACT.y - 60}
            textAnchor="middle" fill={RED} fontSize={13} fontWeight="800" fontFamily={FONT}
            opacity={sContactGrey}
          >goes quiet...</text>
        </g>

        {/* Falling deal card SVG */}
        <g opacity={sDealOp} transform={`translate(0, ${sDealDrop})`}>
          <rect x={REP_X + 200} y={DEAL_CARD_Y - 50} width={200} height={70} rx={14}
            fill="white" stroke="rgba(30,45,90,0.1)" strokeWidth={1.5}
            style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,60,0.12))" }}
          />
          <text x={REP_X + 300} y={DEAL_CARD_Y - 18} textAnchor="middle"
            fill={RED} fontSize={13} fontWeight="800" fontFamily={FONT}>DEAL LOST</text>
          <text x={REP_X + 300} y={DEAL_CARD_Y + 5} textAnchor="middle"
            fill="rgba(30,45,90,0.4)" fontSize={11} fontFamily={FONT}>Single point of contact</text>
        </g>

        {/* ── MULTI THREAD (right half) ── */}
        <g opacity={mPhaseOp}>
          {/* Rep node */}
          <circle cx={480} cy={REP_MY} r={40} fill={NAVY}
            style={{ filter: "drop-shadow(0 4px 16px rgba(30,45,90,0.3))" }}
          />
          <text x={480} y={REP_MY + 5} textAnchor="middle" fill="white" fontSize={12} fontWeight="800" fontFamily={FONT}>REP</text>

          {/* Lines to multi contacts */}
          {MULTI_CONTACTS.map((c, i) => {
            const tx = c.x + 520;
            const ty = c.y + 80;
            const dx = tx - 480, dy = ty - REP_MY;
            const len = Math.sqrt(dx * dx + dy * dy);
            const drawn = mLinesDrawn[i] * (len - 46);
            const isGrey = i === mGreyIndex;
            const lineColor = isGrey
              ? `rgba(30,45,90,${1 - mContactGrey * 0.7})`
              : `rgba(30,45,90,${Math.min(1, (mOtherBright - 1) * 2 + 0.6)})`;
            return (
              <line key={i}
                x1={480 + (dx / len) * 40}
                y1={REP_MY + (dy / len) * 40}
                x2={480 + (dx / len) * (40 + drawn)}
                y2={REP_MY + (dy / len) * (40 + drawn)}
                stroke={isGrey ? "rgba(30,45,90,0.25)" : NAVY}
                strokeWidth={isGrey ? 2 : fi(frame, 258, 285, 2, 4)}
                strokeDasharray="8 5"
                opacity={mLinesDrawn[i] * (isGrey ? (1 - mContactGrey * 0.5) : 1)}
              />
            );
          })}

          {/* Multi contact nodes */}
          {MULTI_CONTACTS.map((c, i) => {
            const tx = c.x + 520;
            const ty = c.y + 80;
            const isGrey = i === mGreyIndex;
            const nodeColor = isGrey
              ? `rgba(30,45,90,${1 - mContactGrey * 0.75})`
              : NAVY;
            const glowColor = isGrey ? "transparent" : `rgba(30,45,90,${(mOtherBright - 1) * 0.4})`;
            return (
              <g key={i} opacity={mContactOp[i]}>
                <circle cx={tx} cy={ty} r={36}
                  fill={nodeColor}
                  style={{ filter: `drop-shadow(0 4px 14px ${glowColor})` }}
                />
                <text x={tx} y={ty - 4} textAnchor="middle"
                  fill={`rgba(255,255,255,${1 - (isGrey ? mContactGrey * 0.7 : 0)})`}
                  fontSize={10} fontWeight="800" fontFamily={FONT}
                >{c.label}</text>
                <text x={tx} y={ty + 11} textAnchor="middle"
                  fill={`rgba(255,255,255,${0.7 - (isGrey ? mContactGrey * 0.6 : 0)})`}
                  fontSize={9} fontFamily={FONT}
                >{c.name}</text>
                {/* Grey label */}
                {isGrey && (
                  <text x={tx} y={ty - 56} textAnchor="middle"
                    fill="rgba(30,45,90,0.45)" fontSize={11} fontWeight="700" fontFamily={FONT}
                    opacity={mContactGrey}
                  >goes dark</text>
                )}
              </g>
            );
          })}

          {/* Deal survives card */}
          <g opacity={mDealOp}>
            <rect x={580 + 520} y={REP_MY + 140} width={200} height={70} rx={14}
              fill="white" stroke={GREEN} strokeWidth={2}
              style={{ filter: `drop-shadow(0 8px 24px ${GREEN}33)` }}
            />
            <text x={680 + 520} y={REP_MY + 177} textAnchor="middle"
              fill={GREEN} fontSize={13} fontWeight="800" fontFamily={FONT}>DEAL SURVIVES</text>
            <text x={680 + 520} y={REP_MY + 196} textAnchor="middle"
              fill="rgba(30,45,90,0.4)" fontSize={11} fontFamily={FONT}>Multi-threaded</text>
          </g>
        </g>

        {/* Divider */}
        <line x1={960} y1={100} x2={960} y2={780}
          stroke="rgba(30,45,90,0.08)" strokeWidth={1.5}
          opacity={fi(frame, 150, 165, 0, 1)}
        />

      </svg>

      {/* Section labels */}
      <div style={{
        position: "absolute", left: 80, top: 60,
        opacity: fi(frame, 0, 18, 0, 1) * fi(frame, 138, 156, 1, 0),
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: RED, letterSpacing: "2.5px" }}>SINGLE-THREADED</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: NAVY, marginTop: 3 }}>One contact. High risk.</div>
      </div>

      <div style={{
        position: "absolute", left: 980, top: 60,
        opacity: fi(frame, 155, 175, 0, 1),
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: GREEN, letterSpacing: "2.5px" }}>MULTI-THREADED</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: NAVY, marginTop: 3 }}>Multiple contacts. Resilient.</div>
      </div>

      {/* Payoff */}
      <div style={{
        position: "absolute", bottom: 56, left: 0, right: 0,
        textAlign: "center", opacity: payoffOp, transform: `translateY(${payoffY}px)`,
      }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: NAVY }}>
          One contact = one point of failure.{" "}
          <span style={{ color: GREEN }}>Multi-thread to survive.</span>
        </div>
      </div>

    </AbsoluteFill>
  );
};
