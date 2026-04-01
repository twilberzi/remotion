/**
 * Scene 3: Lead Score Grid
 * Two rows (Behavioral, Firmographic) of 4 icon cards each, with a bottom callout.
 * Uses PNG icon assets from public/lead-scoring-icons/.
 * Animation: rows fade in staggered → cards pop in staggered → hint slides up.
 * Duration: ~160 frames @ 30fps
 * Use as reference for: grid layouts with staggered reveals, image-based icon cards
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";

const NAVY = "#1e2d5a";
const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

export function LeadScoreGridScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rows = [
    {
      label: "Behavioral",
      items: [
        { label: "Whitepaper\nDownload", img: "lead-scoring-icons/Whitepaper download.png",  pts: "+25" },
        { label: "Webinar\nAttendance",  img: "lead-scoring-icons/Webinar Attendance.png",    pts: "+15" },
        { label: "Email\nOpen",          img: "lead-scoring-icons/Email Open.png",            pts: "+1"  },
        { label: "Blog\nSubscribe",      img: "lead-scoring-icons/Blog Subscription.png",     pts: "+2"  },
      ]
    },
    {
      label: "Firmographic",
      items: [
        { label: "Job Title /\nPosition", img: "lead-scoring-icons/Job Title/Position.png",  pts: "+20" },
        { label: "Company\nSize",         img: "lead-scoring-icons/Company Size.png",         pts: "+15" },
        { label: "Company\nRevenue",      img: "lead-scoring-icons/Company Revenue.png",      pts: "+5"  },
        { label: "Company\nLocation",     img: "lead-scoring-icons/Company Location.png",     pts: "+1"  },
      ]
    },
  ];

  const hintOp = fi(frame, 100, 120, 0, 1);
  const hintY  = fi(frame, 100, 120, 12, 0);

  return (
    <AbsoluteFill style={{ display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:0 }}>
      <div style={{ display:"flex", flexDirection:"column", gap:48 }}>
        {rows.map((row, ri) => {
          const rowOp = fi(frame, ri * 22, ri * 22 + 20, 0, 1);
          return (
            <div key={ri} style={{ display:"flex", alignItems:"center", gap:44 }}>
              <div style={{ width:220, fontSize:34, fontWeight:800, color:NAVY, fontFamily:FONT, opacity:rowOp }}>
                {row.label}
              </div>
              <div style={{ display:"flex", gap:28 }}>
                {row.items.map((item, ci) => {
                  const delay = ri * 22 + ci * 10;
                  const sp = spring({ frame: frame - delay, fps, config: { damping: 28, stiffness: 170 } });
                  const op = fi(frame, delay, delay + 14, 0, 1);
                  return (
                    <div key={ci} style={{ position:"relative", transform:`scale(${sp})`, opacity:op }}>
                      <Img src={staticFile(item.img)} style={{ width:190, height:190, objectFit:"contain", display:"block" }}/>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop:52, opacity:hintOp, transform:`translateY(${hintY}px)`,
        fontSize:18, fontWeight:500, color:"rgba(30,45,90,0.72)", fontFamily:FONT, textAlign:"center",
      }}>
        Look at historical data — which actions actually correlate with revenue.{" "}
        <strong style={{ color:NAVY }}>Be ready to adjust as you learn more.</strong>
      </div>
    </AbsoluteFill>
  );
}
