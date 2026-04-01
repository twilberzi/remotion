/**
 * Behavioral Implicit Scene (from GTM Explained series)
 * Left: 6 behavioral signal rows slide in with point badges (+25 to +5).
 * Right: behavior score circle fills to 85, "HOT LEAD — Route to Sales" badge pops.
 * Duration: ~300 frames @ 30fps
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

function SignalIcon({ type, size = 20 }) {
  const c = NAVY;
  const s = { width: size, height: size };
  if (type === "pricing") return <svg {...s} viewBox="0 0 24 24" fill={c}><path d="M12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm.5 16.5v1.5h-1v-1.52C9.74 17.24 8.5 16.03 8.5 14.5h1.5c0 .83.9 1.5 2 1.5s2-.67 2-1.5c0-.9-.72-1.5-2-1.5-2.21 0-3.5-1.12-3.5-3 0-1.49 1.21-2.72 3-2.98V5.5h1v1.53c1.74.28 2.5 1.48 2.5 2.97h-1.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5c0 .9.72 1.5 2 1.5 2.21 0 3.5 1.12 3.5 3 0 1.5-1.24 2.74-3 2.99z"/></svg>;
  if (type === "download") return <svg {...s} viewBox="0 0 24 24" fill={c}><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>;
  if (type === "target") return <svg {...s} viewBox="0 0 24 24" fill={c}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 5.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>;
  if (type === "email") return <svg {...s} viewBox="0 0 24 24" fill={c}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;
  if (type === "web") return <svg {...s} viewBox="0 0 24 24" fill={c}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;
  if (type === "search") return <svg {...s} viewBox="0 0 24 24" fill={c}><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;
  return null;
}

export function BehavioralImplicit() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { text: "Visited pricing page",          pts: "+25", icon: "pricing",  delay: 50  },
    { text: "Downloaded buyer's guide",      pts: "+20", icon: "download", delay: 75  },
    { text: "Attended live demo webinar",    pts: "+15", icon: "target",   delay: 100 },
    { text: "Opened 3 emails this week",     pts: "+10", icon: "email",    delay: 125 },
    { text: "Visited website 5x in 7 days",  pts: "+10", icon: "web",      delay: 150 },
    { text: "Clicked competitor comparison", pts: "+5",  icon: "search",   delay: 175 },
  ];

  const totalScore = 85;
  const totalSp = spring({ frame: frame - 200, fps, config: { damping: 30, stiffness: 140 } });
  const totalOp = fi(frame, 200, 216, 0, 1);
  const taglineOp = fi(frame, 255, 275, 0, 1);
  const taglineY  = fi(frame, 255, 275, 12, 0);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 60 }}>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 560 }}>
        <div style={{ opacity: fi(frame, 0, 22, 0, 1), transform: `translateY(${fi(frame, 0, 22, -14, 0)}px)`, marginBottom: 6 }}>
          <div style={{ display: "inline-block", padding: "10px 16px", borderRadius: 6, background: NAVY, fontSize: 17, fontWeight: 600, color: "white", fontFamily: FONT }}>Behavioral Data — Implicit</div>
          <div style={{ fontSize: 18, color: "rgba(30,45,90,0.72)", fontFamily: FONT, marginTop: 7 }}>Actions that signal buying intent — even without a form fill</div>
        </div>

        {items.map((item, i) => {
          const sp = spring({ frame: frame - item.delay, fps, config: { damping: 28, stiffness: 165 } });
          const op = fi(frame, item.delay, item.delay + 18, 0, 1);
          const x  = fi(frame, item.delay, item.delay + 18, -24, 0);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1.5px solid rgba(30,45,90,0.07)", borderRadius: 14, padding: "14px 20px", boxShadow: "0 2px 12px rgba(0,0,60,0.06)", transform: `scale(${sp}) translateX(${x}px)`, opacity: op }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <SignalIcon type={item.icon} size={20} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: NAVY, fontFamily: FONT }}>{item.text}</div>
              </div>
              <div style={{ padding: "5px 12px", borderRadius: 6, background: RED, fontSize: 15, fontWeight: 600, color: "white", fontFamily: FONT, boxShadow: "0 2px 8px rgba(232,24,46,0.28)", transform: `scale(${sp})` }}>{item.pts}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ opacity: totalOp, transform: `scale(${totalSp})`, width: 220, height: 220, borderRadius: "50%", background: `linear-gradient(135deg, ${RED}, #c2185b)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 60px rgba(232,24,46,0.4)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.8)", fontFamily: FONT, letterSpacing: "1px", marginBottom: 4 }}>BEHAVIOR SCORE</div>
          <div style={{ fontSize: 68, fontWeight: 900, color: "white", fontFamily: FONT, lineHeight: 1 }}>{Math.round(totalScore * Math.min(totalSp, 1))}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.75)", fontFamily: FONT }}>out of 100</div>
        </div>

        <div style={{ opacity: totalOp, transform: `translateY(${fi(frame, 200, 220, 10, 0)}px)`, padding: "10px 16px", borderRadius: 6, background: RED, fontSize: 14, fontWeight: 600, color: "white", fontFamily: FONT, display: "flex", alignItems: "center", gap: 7 }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
            <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
          </svg>
          HOT LEAD — Route to Sales
        </div>

        <div style={{ opacity: taglineOp, transform: `translateY(${taglineY}px)`, fontSize: 17, fontWeight: 600, color: "rgba(30,45,90,0.6)", fontFamily: FONT, textAlign: "center", maxWidth: 240 }}>
          Behavior tells you <strong style={{ color: NAVY }}>who's ready to buy right now.</strong>
        </div>
      </div>

    </AbsoluteFill>
  );
}
