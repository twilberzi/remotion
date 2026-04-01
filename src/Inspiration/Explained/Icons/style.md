ICON STYLE SYSTEM — GTM Explained

All icons follow these rules:

• Flat vector style
• Single-color navy (#1E2A5A)
• Rounded corners
• Medium stroke weight
• Simple geometric shapes
• Centered inside soft rounded white cards
• No gradients
• No shadows
• No outlines on the container
• High contrast on white background
• Minimal detail, readable at small sizes

Claude: When creating new icons:
- Match this style exactly
- Do NOT copy shapes literally
- Recreate visually consistent icons for new concepts
- Keep stroke thickness and corner rounding consistent

---

CANONICAL EXPLAINED ICON CARD — confirmed style (RevWhatIsIt, March 2026)

Asset: public/icon-box-blank.png via staticFile('icon-box-blank.png')
Use <Img> from remotion, objectFit: "fill", position: absolute inset 0, width/height 100%

When to use:
- Primary / hero cards only (center hub, spotlight, 2–3 featured items)
- NOT on secondary/supporting cards (source lists, rows, small labels)

Card dimensions: 220×240px typical — scale proportionally, never squash
Border radius: handled by asset — do NOT add CSS borderRadius to outer div

Icon:
- 88×88px SVG, solid filled paths, navy (#1e2d5a), no strokes, no emojis
- Position: absolute, top:0, left:0, right:0, bottom:80 (centered in upper ~65%)

Label:
- Font: Figtree (loaded via @remotion/google-fonts/Figtree in Root.jsx)
- 23px, fontWeight 700, color NAVY, letterSpacing 0, lineHeight 1.3
- NOT uppercase, textAlign center
- Position: absolute, bottom:38, left:0, right:0
- Two lines max, use <br/> for line break

Component pattern:
  function ExplainedIconCard({ width=220, height=240, icon, label, scale=1, opacity=1 }) {
    return (
      <div style={{ width, height, position:"relative", transform:`scale(${scale})`, opacity, transformOrigin:"center center" }}>
        <Img src={staticFile("icon-box-blank.png")}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"fill" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:80,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          {icon}
        </div>
        <div style={{ position:"absolute", bottom:38, left:0, right:0,
          textAlign:"center", fontSize:23, fontWeight:700, color:"#1e2d5a",
          fontFamily:"'Figtree','Helvetica Neue',sans-serif", letterSpacing:0, lineHeight:1.3 }}>
          {label}
        </div>
      </div>
    );
  }

Plain secondary card (supporting/source cards — NO icon-box-blank):
  background: white, borderRadius: 16,
  border: "1.5px solid rgba(30,45,90,0.08)",
  boxShadow: "0 3px 12px rgba(30,45,90,0.06)"
