/**
 * Lead Score Product UI Scene (from GTM Explained series)
 * Recreates a ZI-style CRM lead scoring list: "NYC Event Sign-Ups", 5,000 accounts.
 * 5 rows with score badges (90, 98, 88, 72, 80) stagger in. Acme (98) gets a
 * glowing "TOP PRIORITY — Route to sales now" callout.
 * Duration: ~330 frames @ 30fps
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const NAVY = "#1e2d5a";
const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

export function LeadScoreProductUI() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rows = [
    { name: "Knotwise", url: "knotwise.com", locs: 230, crm: "Salesforce", state: "CO", score: 90,  color: "#22c55e", delay: 60  },
    { name: "Acme",     url: "acme.com",     locs: 35,  crm: "Pipedrive",  state: "MA", score: 98,  color: "#16a34a", delay: 82  },
    { name: "Newex",    url: "newex.com",     locs: 100, crm: "Hubspot",    state: "CA", score: 88,  color: "#22c55e", delay: 104 },
    { name: "Doncon",   url: "doncon.com",    locs: 7,   crm: "Salesforce", state: "TX", score: 72,  color: "#f59e0b", delay: 126 },
    { name: "Solis",    url: "solis.com",     locs: 23,  crm: "Hubspot",    state: "MA", score: 80,  color: "#22c55e", delay: 148 },
  ];

  const panelSp = spring({ frame: frame - 0, fps, config: { damping: 30, stiffness: 130 } });
  const panelY  = fi(frame, 0, 35, 60, 0);
  const panelOp = fi(frame, 0, 20, 0, 1);
  const headerOp= fi(frame, 15, 38, 0, 1);
  const headerY = fi(frame, 15, 38, -10, 0);
  const colOp   = fi(frame, 40, 56, 0, 1);
  const calloutSp = spring({ frame: frame - 240, fps, config: { damping: 30, stiffness: 150 } });
  const calloutOp = fi(frame, 238, 255, 0, 1);

  const SFCloud = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M10 6.5C10 4.567 11.567 3 13.5 3c1.406 0 2.623.82 3.214 2.014C17.1 4.735 17.537 4.5 18 4.5c1.105 0 2 .895 2 2 0 .173-.022.34-.063.5H20c1.105 0 2 .895 2 2s-.895 2-2 2H6c-1.105 0-2-.895-2-2 0-.94.648-1.727 1.528-1.938A2.5 2.5 0 0 1 10 6.5z" fill="#00A1E0"/>
    </svg>
  );
  const HubspotDot = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="#FF7A59"/><circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  );
  const PipedriveDot = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="#1F9B52"/><circle cx="12" cy="9" r="3.5" fill="white"/><rect x="8.5" y="12" width="3" height="6" rx="1.5" fill="white"/>
    </svg>
  );
  const CRMIcon = ({ crm }) => {
    if (crm === "Salesforce") return <SFCloud />;
    if (crm === "Hubspot") return <HubspotDot />;
    return <PipedriveDot />;
  };
  const Avatar = ({ name, color }) => (
    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${color}22`, border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color, fontFamily: FONT, flexShrink: 0 }}>{name[0]}</div>
  );

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1100, background: "#ffffff", borderRadius: 20, boxShadow: "0 20px 80px rgba(0,0,60,0.14), 0 4px 20px rgba(0,0,60,0.08)", border: "1px solid rgba(0,0,60,0.07)", overflow: "hidden", transform: `translateY(${panelY}px) scale(${0.94 + 0.06 * panelSp})`, opacity: panelOp }}>
        <div style={{ height: 48, background: "#0070d2", display: "flex", alignItems: "center", padding: "0 20px", gap: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: "rgba(255,255,255,0.3)" }}/>
          <div style={{ width: 60, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.4)" }}/>
          <div style={{ flex: 1 }}/>
          <div style={{ width: 80, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.25)" }}/>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }}/>
        </div>

        <div style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, opacity: headerOp, transform: `translateY(${headerY}px)` }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: NAVY, fontFamily: FONT }}>NYC Event Sign-Ups</div>
            <div style={{ padding: "4px 14px", borderRadius: 6, background: "rgba(30,45,90,0.07)", border: "1px solid rgba(30,45,90,0.12)", fontSize: 13, fontWeight: 700, color: NAVY, fontFamily: FONT }}>5,000 Accounts</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.8fr 1fr 1.4fr 0.7fr 1fr", gap: 0, paddingBottom: 10, borderBottom: "1.5px solid rgba(30,45,90,0.08)", opacity: colOp }}>
            {["Name", "URL", "Locations", "CRM", "State", "Lead Score"].map((col) => (
              <div key={col} style={{ fontSize: 14, fontWeight: 700, color: "rgba(30,45,90,0.6)", fontFamily: FONT, letterSpacing: "0.5px" }}>{col}</div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {rows.map((row, i) => {
              const rowOp   = fi(frame, row.delay, row.delay + 20, 0, 1);
              const rowX    = fi(frame, row.delay, row.delay + 20, -18, 0);
              const badgeSp = spring({ frame: frame - (row.delay + 25), fps, config: { damping: 32, stiffness: 190 } });
              const scoreVal= Math.round(row.score * Math.min(badgeSp, 1));
              const isPriority = row.score === 98;
              const glowPulse  = isPriority ? 0.5 + 0.5 * Math.sin(((frame - 240) / 15) * Math.PI * 2) : 0;
              const rowHighlight = isPriority ? fi(frame, 240, 260, 0, 1) : 0;
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.8fr 1fr 1.4fr 0.7fr 1fr", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(30,45,90,0.05)", opacity: rowOp, transform: `translateX(${rowX}px)`, background: `rgba(232,24,46,${rowHighlight * 0.04})`, borderRadius: rowHighlight > 0 ? 10 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={row.name} color={row.color} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: NAVY, fontFamily: FONT }}>{row.name}</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#0070d2", fontFamily: FONT, fontWeight: 500 }}>{row.url}</div>
                  <div style={{ fontSize: 14, color: NAVY, fontFamily: FONT, fontWeight: 500 }}>{row.locs}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <CRMIcon crm={row.crm} />
                    <span style={{ fontSize: 14, color: NAVY, fontFamily: FONT, fontWeight: 500 }}>{row.crm}</span>
                  </div>
                  <div style={{ fontSize: 14, color: NAVY, fontFamily: FONT, fontWeight: 500 }}>{row.state}</div>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: row.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: "white", fontFamily: FONT, transform: `scale(${Math.min(badgeSp, 1)})`, boxShadow: isPriority ? `0 0 0 ${4 + glowPulse * 8}px ${row.color}44, 0 4px 16px ${row.color}66` : `0 3px 12px ${row.color}55` }}>{scoreVal}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: "50%", right: 140, transform: `translateY(-50%) translateX(${fi(frame, 238, 258, 24, 0)}px) scale(${calloutSp})`, opacity: calloutOp, background: "#ffffff", borderRadius: 16, padding: "14px 20px", boxShadow: "0 8px 40px rgba(0,0,60,0.18)", border: "2px solid #16a34a", display: "flex", flexDirection: "column", gap: 4, minWidth: 180 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#16a34a" }}/>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a", fontFamily: FONT, letterSpacing: "0.5px" }}>TOP PRIORITY</div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: NAVY, fontFamily: FONT }}>Acme — Score 98</div>
        <div style={{ fontSize: 17, fontWeight: 500, color: "rgba(30,45,90,0.75)", fontFamily: FONT }}>Route to sales now →</div>
      </div>
    </AbsoluteFill>
  );
}
