---
name: remotion-animation
description: Expertise for building Remotion v4 compositions — B2B GTM Explained series. Covers design tokens, card components, icon rules, motion style, spring configs, static asset patterns, and composition structure. Auto-invoke when working on .jsx files in a Remotion project.
---

# Remotion Animation Skill

## Project Context
Remotion v4.0.434, B2B marketing/sales explainer video series. All compositions live in `src/`. Assets in `public/`.

---

## Design Tokens

```js
const NAVY  = "#1e2d5a";
const RED   = "#e8182e";
const PINK  = "#c2185b";
const LIGHT = "#f8faff";
const FONT  = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";
```

Figtree is loaded globally in `Root.jsx` via `@remotion/google-fonts/Figtree`.

---

## Static Assets

- All assets must live in `public/`
- Reference via `staticFile('path/relative/to/public')`
- Never reference `src/Inspiration/` directly in components

```js
import { staticFile } from "remotion";
<Img src={staticFile("icon-box-blank.png")} />
```

---

## Card Components

### ExplainedCard — primary/hero cards only
Use for hub center, 2–3 featured spotlight cards. NOT every card on screen.

```jsx
function ExplainedCard({ width, height, children }) {
  const r = 24;
  return (
    <div style={{
      width, height, background: "#ffffff", borderRadius: r,
      border: "1.5px solid rgba(232,24,46,0.10)",
      boxShadow: "0 4px 20px rgba(0,0,60,0.08), inset 0 0 0 1px rgba(255,255,255,0.8)",
      position: "relative", overflow: "hidden",
    }}>
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={width} height={height}>
        <defs>
          <linearGradient id={`lg-v-${width}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="transparent"/>
            <stop offset="40%"  stopColor="#e8182e"/>
            <stop offset="100%" stopColor="#c2185b"/>
          </linearGradient>
        </defs>
        <path
          d={`M ${width-2} ${height*0.28} L ${width-2} ${height-r} Q ${width-2} ${height-2} ${width-r} ${height-2} L ${width*0.28} ${height-2}`}
          fill="none" stroke={`url(#lg-v-${width})`} strokeWidth={4} strokeLinecap="round"
        />
      </svg>
      {children}
    </div>
  );
}
```

Corner accent: single SVG `<path>` with quadratic bezier `Q` to follow `borderRadius`. Diagonal linearGradient fades transparent → red → pink. NOT two separate div bars.

### PlainCard — secondary/supporting cards
Use for source lists, input rows, context items.

```jsx
function PlainCard({ width, height, children, style = {} }) {
  return (
    <div style={{
      width, height, background: "white", borderRadius: 16,
      border: "1.5px solid rgba(30,45,90,0.08)",
      boxShadow: "0 3px 12px rgba(30,45,90,0.06)",
      position: "relative", overflow: "hidden", ...style,
    }}>
      {children}
    </div>
  );
}
```

---

## ExplainedIconCard — primary/hero icon cards

For scenes with a featured icon card (hub, spotlight, 2–3 hero items).

- Card: 220×240px, no CSS `borderRadius` (asset handles it)
- Background: `<Img src={staticFile("icon-box-blank.png")}>`
- Icon: 88×88px SVG, solid navy `#1e2d5a` filled paths, no strokes, no emojis, positioned with `bottom:80`
- Label: Figtree 23px, `fontWeight: 700`, NOT uppercase, `letterSpacing: 0`, `lineHeight: 1.3`, `bottom: 38`

---

## Icon Rules

- Single-color navy (`#1e2d5a`) solid silhouette icons — Font Awesome / Muze style
- Solid filled SVG paths ONLY — NO outlines, NO strokes, NO emojis
- Icon occupies ~60% of tile, centered in upper portion of card
- No gradients inside icons

---

## Motion Style — Firm & Premium

All animations must feel **firm, confident, and premium**. No bounciness, no overshoot, no playful elasticity. This is B2B enterprise — bouncy springs feel consumer/toy-like.

### Canonical Spring Configs

| Use case                  | damping | stiffness | Notes                          |
|---------------------------|---------|-----------|--------------------------------|
| Card entrance (scale/fade)| 32      | 160       | Snappy, no bounce              |
| Element slide in          | 28      | 140       | Smooth deceleration            |
| Badge / emphasis pop      | 30      | 200       | Fast settle, zero overshoot    |
| Camera / large-scale pan  | 34      | 80        | Slow, controlled, cinematic    |
| Line draw / reveal        | `fi()` interpolate | —  | Use easeOut, NOT spring   |

### Rules
- `damping` ≥ 28 for all entrance animations
- `damping` ≥ 32 for any hero/badge pop
- Never use `damping` below 22 anywhere
- `stiffness` 120–200 for most elements; lower only for camera moves
- Use `fi()` with `interpolate` for line draws — NOT spring
- Never chain multiple low-damping springs on the same element

---

## Common Helpers

### fi() — clamped interpolate
```js
function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}
```

### Polar tile placement
```js
function atAngle(id, img, angleDeg, radius, size, popDelay) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const tcx = CX + radius * Math.cos(rad);
  const tcy = CY + radius * Math.sin(rad);
  return { id, img, x: tcx - size/2, y: tcy - size/2, w: size, h: size, popDelay };
}
```

### Seeded random (deterministic float)
```js
function seededRand(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return (h >>> 0) / 4294967295;
}
```

---

## Composition Registration

All compositions registered in `src/Root.jsx`. Each uses `<Composition>` with `id`, `component`, `durationInFrames`, `fps: 30`, `width: 1920`, `height: 1080`.

## Running Remotion Studio
```
cd /Users/travis.wilber/Remotion && npx remotion studio
```
Runs at http://localhost:3000
