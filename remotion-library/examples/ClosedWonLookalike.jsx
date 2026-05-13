import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const NAVY   = "#000d39";
const NAVY3  = "#3f486b";
const RED    = "#ea1b15";
const BLUE   = "#0094ff";
const WHITE  = "#ffffff";
const BORDER = "#dce1f0";
const PURPLE = "#a109ba";
const FONT   = "'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const FONT2  = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const BG     = "#eef0f5";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}
function sp(frame, delay, fps, damping = 32, stiffness = 160) {
  return spring({ frame: frame - delay, fps, config: { damping, stiffness } });
}

// ─── Timing ──────────────────────────────────────────────────────────────────
const T = {
  cardIn:      8,
  signalIn:    18,
  triggerIn:   28,
  thinkingIn:  42,
  titleIn:     52,
  headerIn:    62,
  check0:      72,
  scanIn:      90,
  check1:     105,
  check2:     120,
  check3:     135,
  engageIn:   148,
  analyzeIn:  165,
  optimizeIn: 185,
};

// ─── Checkbox ─────────────────────────────────────────────────────────────────
function CheckBox({ checked, frame, checkAt, size = 18, dim = false }) {
  const checkScale = checked ? sp(frame, checkAt, 30, 28, 220) : 0;
  const bg = dim ? "rgba(0,148,255,0.25)" : (checked ? BLUE : WHITE);
  const border = dim ? "rgba(0,148,255,0.3)" : (checked ? BLUE : BORDER);
  return (
    <div style={{
      width: size, height: size, borderRadius: 5,
      border: `2px solid ${border}`,
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {(checked || dim) && (
        <svg
          width={size * 0.6} height={size * 0.6}
          viewBox="0 0 10 10" fill="none"
          style={{ transform: dim ? "none" : `scale(${checkScale})`, opacity: dim ? 0.4 : 1 }}
        >
          <path d="M1.5 5L4 7.5L8.5 2.5" stroke={WHITE} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

// ─── Animated dots ────────────────────────────────────────────────────────────
function ThinkingDots({ frame }) {
  return (
    <span style={{ fontFamily: FONT, fontSize: 13, color: "#8a90ab", fontWeight: 400, fontStyle: "italic" }}>
      thinking{".".repeat(1 + Math.floor((frame * 0.12) % 3))}
    </span>
  );
}

// ─── PopIn wrapper ────────────────────────────────────────────────────────────
function PopIn({ frame, delay, fps, children, origin = "center center" }) {
  const s  = sp(frame, delay, fps, 30, 200);
  const op = fi(frame, delay, delay + 10, 0, 1);
  return (
    <div style={{ transform: `scale(${s})`, opacity: op, transformOrigin: origin, display: "inline-flex" }}>
      {children}
    </div>
  );
}

// ─── SlideUp wrapper ──────────────────────────────────────────────────────────
function SlideUp({ frame, delay, children, dist = 10 }) {
  const op = fi(frame, delay, delay + 14, 0, 1);
  const ty = fi(frame, delay, delay + 16, dist, 0);
  return (
    <div style={{ opacity: op, transform: `translateY(${ty}px)` }}>
      {children}
    </div>
  );
}

// ─── Blue waveform icon ───────────────────────────────────────────────────────
function WaveformIcon({ size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "#1a7af7",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 16 16" fill="none">
        <rect x={0.5} y={5} width={2} height={6} rx={1} fill={WHITE}/>
        <rect x={3.5} y={2} width={2} height={12} rx={1} fill={WHITE}/>
        <rect x={6.5} y={4} width={2} height={8} rx={1} fill={WHITE}/>
        <rect x={9.5} y={1} width={2} height={14} rx={1} fill={WHITE}/>
        <rect x={12.5} y={4} width={2} height={8} rx={1} fill={WHITE}/>
      </svg>
    </div>
  );
}

// ─── HSBC logo circle ─────────────────────────────────────────────────────────
function HSBCCircle({ size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: WHITE,
      border: "2px solid #f0f0f8",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      boxShadow: "0 2px 8px rgba(1,13,57,0.10)",
      overflow: "hidden",
    }}>
      <svg width={size * 0.68} height={size * 0.68} viewBox="0 0 40 40" fill="none">
        <polygon points="2,2 20,2 2,20" fill="#db0011"/>
        <polygon points="38,2 20,2 38,20" fill="#db0011"/>
        <polygon points="2,38 20,38 2,20" fill="#db0011"/>
        <polygon points="38,38 20,38 38,20" fill="#db0011"/>
      </svg>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const CARD_W = 420;
const SCALE  = 1.55;

export function ClosedWonLookalike() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardS  = sp(frame, T.cardIn, fps, 32, 140);
  const cardOp = fi(frame, T.cardIn, T.cardIn + 18, 0, 1);

  const check0done = frame >= T.check0 + 10;
  const check1done = frame >= T.check1 + 10;
  const check2done = frame >= T.check2 + 10;
  const check3done = frame >= T.check3 + 10;

  const scanPulse = 0.5 + 0.5 * Math.sin(frame * 0.15);

  const thinkingOp = fi(frame, T.thinkingIn, T.thinkingIn + 8, 0, 1) *
                     fi(frame, T.titleIn - 6, T.titleIn, 1, 0);

  const engageOp = fi(frame, T.engageIn, T.engageIn + 12, 0, 1);
  const engageS  = sp(frame, T.engageIn, fps, 28, 180);

  return (
    <AbsoluteFill style={{
      background: BG,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT,
    }}>

      {/* ── Scale wrapper — shifted right to leave room for WebSights on left ── */}
      <div style={{
        transform: `scale(${SCALE}) scale(${cardS})`,
        opacity: cardOp,
        transformOrigin: "center center",
        position: "relative",
        marginLeft: 160,
      }}>

        {/* ── WebSights signal card — floats fully visible to the left of main card ── */}
        <div style={{
          position: "absolute",
          top: 20,
          left: -230,
          zIndex: 20,
        }}>
          <PopIn frame={frame} delay={T.signalIn} fps={fps} origin="right center">
            <div style={{
              padding: "1.5px",
              borderRadius: 13,
              background: "linear-gradient(135deg, #ea1b15, #a109ba)",
              boxShadow: "0 4px 24px rgba(1,13,57,0.12)",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: WHITE,
                borderRadius: 12,
                padding: "12px 16px",
                width: 240,
                boxSizing: "border-box",
              }}>
                <HSBCCircle size={44} />
                <div>
                  <div style={{ fontFamily: FONT2, fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "0.04em" }}>
                    WEBSIGHTS SIGNAL
                  </div>
                  <div style={{ fontFamily: FONT2, fontSize: 12, fontWeight: 400, color: NAVY3, marginTop: 3 }}>
                    Viewed Integrations
                  </div>
                </div>
              </div>
            </div>
          </PopIn>
        </div>

        {/* ── Salesforce trigger — floats above card, centered on card ── */}
        <div style={{
          position: "absolute",
          top: -72,
          left: CARD_W / 2,
          transform: "translateX(-30%)",
          zIndex: 20,
        }}>
          <PopIn frame={frame} delay={T.triggerIn} fps={fps} origin="center bottom">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              {/* "moved to closed won!" label */}
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: WHITE,
                borderRadius: 6,
                padding: "3px 8px",
                boxShadow: "0 2px 8px rgba(1,13,57,0.10)",
              }}>
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v2M6 9v2M1 6h2M9 6h2M2.5 2.5l1.4 1.4M8.1 8.1l1.4 1.4M2.5 9.5l1.4-1.4M8.1 3.9l1.4-1.4" stroke="#a8c4ff" strokeWidth={1.2} strokeLinecap="round"/>
                </svg>
                <span style={{ fontFamily: FONT2, fontSize: 9, color: NAVY3, fontWeight: 400, whiteSpace: "nowrap" }}>
                  moved to closed won!
                </span>
              </div>
              {/* Salesforce cloud + HSBC pill */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {/* Salesforce — compact bubbly pill */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "#00a1e0",
                  borderRadius: 30,
                  padding: "5px 10px 5px 7px",
                }}>
                  <svg width={16} height={12} viewBox="0 0 28 19" fill="none">
                    <path d="M11.6 2.8a4.4 4.4 0 013.2-1.4c1.6 0 3 .9 3.8 2.2.7-.3 1.4-.5 2.2-.5 3 0 5.4 2.4 5.4 5.4 0 3-2.4 5.4-5.4 5.4H7.4C5 14 3 12 3 9.6c0-2.1 1.4-3.9 3.4-4.4-.1-.4-.1-.8-.1-1.2C6.3 2 8.3 0 10.8 0c1.1 0 2.1.4 2.8 1" fill={WHITE}/>
                  </svg>
                  <span style={{ fontFamily: FONT2, fontSize: 10, fontWeight: 600, color: WHITE }}>salesforce</span>
                </div>
                {/* HSBC — light blue-tinted pill */}
                <div style={{
                  background: "#ddeeff",
                  borderRadius: 30,
                  padding: "5px 12px",
                }}>
                  <span style={{ fontFamily: FONT2, fontSize: 12, fontWeight: 700, color: NAVY }}>HSBC</span>
                </div>
              </div>
            </div>
          </PopIn>
        </div>

        {/* ── Ready to Engage chip — floats right of card ── */}
        <div style={{
          position: "absolute",
          top: 190,
          right: -130,
          opacity: engageOp,
          transform: `scale(${engageS})`,
          transformOrigin: "left center",
          zIndex: 20,
        }}>
          <Img
            src={staticFile("gtmstudio/step 2/insight-chips.png")}
            style={{ width: 130, height: "auto" }}
          />
        </div>

        {/* ── Main card ── */}
        <div style={{
          width: CARD_W,
          background: WHITE,
          borderRadius: 18,
          border: `1.5px solid ${BORDER}`,
          boxShadow: "0 8px 40px rgba(1,13,57,0.10), 0 2px 8px rgba(1,13,57,0.05)",
          overflow: "visible",
          position: "relative",
          zIndex: 10,
        }}>

          {/* ── Card inner content ── */}
          <div style={{ paddingTop: 28, borderRadius: 18, position: "relative" }}>

            {/* thinking... */}
            <div style={{ padding: "0 20px", borderBottom: `1px solid #edf0f8`, paddingBottom: 12 }}>
              <div style={{ opacity: thinkingOp, minHeight: 20 }}>
                <ThinkingDots frame={frame} />
              </div>
            </div>

            {/* Title row */}
            <div style={{ padding: "14px 20px 0" }}>
              <SlideUp frame={frame} delay={T.titleIn}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "nowrap" }}>
                  <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: NAVY, whiteSpace: "nowrap", flexShrink: 0 }}>
                    Closed-Won Lookalike Play
                  </span>
                  <div style={{
                    background: PURPLE,
                    borderRadius: 5,
                    padding: "3px 10px",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: WHITE, whiteSpace: "nowrap" }}>
                      ready for review
                    </span>
                  </div>
                </div>
              </SlideUp>
            </div>

            {/* Divider */}
            <div style={{ margin: "12px 20px 0", height: 1, background: "#edf0f8", opacity: fi(frame, T.titleIn + 8, T.titleIn + 20, 0, 1) }}/>

            {/* ZI: 8 lookalike accounts */}
            <div style={{ padding: "12px 20px 0", display: "flex", alignItems: "center", gap: 10, opacity: fi(frame, T.headerIn, T.headerIn + 14, 0, 1) }}>
              <Img
                src={staticFile("gtmstudio/step 2/zi circle.png")}
                style={{ width: 26, height: 26, flexShrink: 0 }}
              />
              <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: NAVY }}>
                8 lookalike accounts identified
              </span>
            </div>

            {/* 0 currently in pipeline */}
            <div style={{ padding: "8px 20px 0 56px" }}>
              <SlideUp frame={frame} delay={T.check0}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckBox checked={check0done} frame={frame} checkAt={T.check0} />
                  <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 400, color: NAVY }}>
                    0 currently in pipeline
                  </span>
                </div>
              </SlideUp>
            </div>

            {/* Divider */}
            <div style={{ margin: "12px 20px 0", height: 1, background: "#edf0f8", opacity: fi(frame, T.scanIn - 4, T.scanIn + 8, 0, 1) }}/>

            {/* scanning for intent signals */}
            <div style={{ padding: "10px 20px 0" }}>
              <SlideUp frame={frame} delay={T.scanIn}>
                <span style={{
                  fontFamily: FONT, fontSize: 15, fontWeight: 500, color: NAVY,
                  opacity: frame < T.check1 ? 0.4 + scanPulse * 0.6 : 0.4,
                }}>
                  scanning for intent signals
                </span>
              </SlideUp>
            </div>

            {/* Intent signal checklist */}
            {[
              { label: "pricing page visits",      checkAt: T.check1, done: check1done, delay: T.check1 - 4 },
              { label: "how it works page visits",  checkAt: T.check2, done: check2done, delay: T.check2 - 4 },
              { label: "research on BOFU keywords", checkAt: T.check3, done: check3done, delay: T.check3 - 4 },
            ].map(({ label, checkAt, done, delay }) => (
              <div key={label} style={{ padding: "6px 20px 0 56px" }}>
                <SlideUp frame={frame} delay={delay}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckBox checked={done} frame={frame} checkAt={checkAt} />
                    <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 400, color: NAVY }}>
                      {label}
                    </span>
                  </div>
                </SlideUp>
              </div>
            ))}

            {/* Divider */}
            <div style={{ margin: "12px 20px 0", height: 1, background: "#edf0f8", opacity: fi(frame, T.analyzeIn - 4, T.analyzeIn + 8, 0, 1) }}/>

            {/* Analyzing call transcripts */}
            <div style={{ padding: "10px 20px 0" }}>
              <SlideUp frame={frame} delay={T.analyzeIn}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <WaveformIcon size={26} />
                  <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: NAVY }}>
                    Analyzing call transcripts
                  </span>
                </div>
              </SlideUp>
            </div>

            {/* optimize messaging approach */}
            <div style={{ padding: "8px 20px 20px 56px" }}>
              <SlideUp frame={frame} delay={T.optimizeIn}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckBox checked={false} frame={frame} checkAt={0} dim size={18} />
                  <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 400, color: NAVY, opacity: 0.35 }}>
                    optimize messaging approach
                  </span>
                </div>
              </SlideUp>
            </div>

          </div>
        </div>

      </div>

    </AbsoluteFill>
  );
}
