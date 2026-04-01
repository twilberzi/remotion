# Graphic Explain — Style Guide

## CANONICAL CARD STYLE (always use this — sourced from B2BDataExplained :10s)

This is the primary card component for ALL Explained video compositions.

```jsx
function Card({ children, width = 180, height = 180, style = {} }) {
  return (
    <div style={{
      width, height,
      background: "#ffffff",
      borderRadius: 24,                          // ROUNDER — 24px minimum
      border: "1.5px solid rgba(232,24,46,0.12)",
      boxShadow: "0 4px 20px rgba(0,0,60,0.08), inset 0 0 0 1px rgba(255,255,255,0.8)",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}>
      {/* Bottom-right L-accent: vertical bar on right edge */}
      <div style={{
        position: "absolute", right: 0, top: "30%", bottom: 0,
        width: 4, borderRadius: "0 0 24px 0",
        background: "linear-gradient(180deg, transparent, #e8182e 50%, #c2185b)",
      }}/>
      {/* Bottom-right L-accent: horizontal bar on bottom edge */}
      <div style={{
        position: "absolute", bottom: 0, left: "30%", right: 0,
        height: 4, borderRadius: "0 0 24px 0",
        background: "linear-gradient(90deg, transparent, #e8182e 50%, #c2185b)",
      }}/>
      {children}
    </div>
  );
}
```

### Icon rules inside cards
- Large solid silhouette icon — Font Awesome / Muze style (filled, no outlines, no strokes)
- Color: NAVY (#1e2d5a), opacity 1
- Size: 52–72px for hero cards, 28–36px for list/row cards
- Centered in upper 60% of card
- NO emojis — always replace with SVG silhouette icons
- NO multicolor icons — single fill only

### Label rules
- Bold, NAVY, 13–16px depending on card size
- Uppercase + letter-spacing for category labels
- Sentence case for content labels
- Positioned in lower 30% of card, centered

---

## Hub & Spoke (most common)
- Center: white Card (24px radius) with large icon + label, OR red/pink gradient card
- Outer nodes: white Cards using canonical style above
  - Size: 140–180px
  - Positioned on a radius of 280–360px from center
  - 4–6 nodes maximum
- Connectors: thin dashed line, rgba(232,24,46,0.25), 1.5px
- Optional: subtle concentric ring guides (very low opacity, 5–8%)

## Orbit Style (ZI brand look)
- Center: large gradient circle (red→pink), concentric inner rings at 20–30% opacity
- Outer cards: canonical white Card style, plain navy label bold
- Connectors: curved arcs or radial lines from center edge to card

## Tree / Hierarchy
- Top node: red/pink gradient Card, white text + white icon
- Dashed connector lines dropping down
- Child nodes: 3 across, canonical white Card style with navy header bar
- Equal spacing, center-aligned group

## Flow / Linear
- Each step: canonical Card with icon + label below
- Arrow connectors: navy, 2px, arrowhead
- Active/current step: red/pink highlight ring or glow

## Connection Map (many→one→many)
- Left column: source cards (canonical white Card, icon + label)
- Center: hub card (canonical Card or red gradient Card)
- Right column: output cards (colored fill, white text, same 24px radius)
- Horizontal connector lines with arrow tips

## Motion Rules
- Center/root always animates first
- Outer nodes stagger in clockwise or left→right
- Connectors draw in after their connected node appears
- Use spring({ damping: 18, stiffness: 150 }) for scale-in
- Use interpolate for line draw (stroke-dashoffset)

## Do Not
- No emojis anywhere
- No more than 8 nodes in one diagram
- No diagonal connectors unless necessary
- No mixing hub & spoke with tree in same scene
- No border-radius below 20px on any card
- No icon outlines or strokes — solid fills only
