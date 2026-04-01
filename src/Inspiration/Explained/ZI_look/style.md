# ZI Look — Style Guide

## What This Is
The "ZI Look" is ZoomInfo's branded graphic system. It uses bold red/orange gradient orbs,
white rounded cards, and clean navy typography on light backgrounds. Everything looks like
a real product or a polished marketing diagram — not an abstract infographic.

---

## Asset Inventory & When To Use Each

### 1. Orbit / Hub-and-Spoke (`connection-graphic`, `connections-graphic2`, `map-flow1`, `info-blocks-1`)
**Use for:** Data flows into/out of a central system, partner integrations, any "many inputs → one hub" or "one hub → many outputs" story.

**Visual rules:**
- Center: large red→orange radial gradient orb (400–500px), NO hard edge — bleeds into bg
- Concentric inner rings: 2–3 rings at 20–30% opacity same gradient color
- Outer cards: white, border-radius 14–18px, subtle dark border `rgba(0,0,60,0.1)`, soft shadow
- Orbit connector: thin dashed red circle `rgba(232,24,46,0.3)`, 1.5px, dash 8/6
- Connector lines: thin dashed lines from orb edge to card, `rgba(232,24,46,0.25)`
- Cards contain: small icon left + bold label + optional sub-label

---

### 2. Linear Flow / Pipeline (`map-connection-workflow`, `API-empower-tech-and-apps`, `icons-layout`)
**Use for:** Step-by-step processes, API pipelines, input→process→output, workflow stages.

**Visual rules:**
- Left column: white rounded cards, stacked, with labels
- Center: small red gradient circle node (API, brand icon, etc.)
- Right column: red/pink gradient filled cards with white text
- Connectors: horizontal dashed red arrows between columns, `rgba(232,24,46,0.4)`
- Arrowheads: small, same red color

---

### 3. Product UI Mockup (`ui-product-list`, `UI-product-icons`)
**Use for:** Showing the ZoomInfo platform in context — audience builder, lead lists, campaign setup.

**Visual rules:**
- Outer card: white, border-radius 16px, soft shadow, subtle border
- Top bar: ZI "Z" logo left + module label ("Marketing", "Sales") + red/pink gradient accent
- Table rows: company name + data fields + colored score badge (green circle for high scores)
- Floating callout chips: white pill, icon left, bold label, description text
- Chips float at angles around the main card (top-right, bottom-left, etc.)
- Score badge: solid colored circle (green = high, yellow = mid), white number, bold

---

### 4. List Box (`list-box-info`)
**Use for:** Enumerating data fields, feature lists, attribute breakdowns.

**Visual rules:**
- Header: red→pink gradient fill, white bold text, border-radius top
- Body: white background, bullet list with red dot markers
- Text: navy, uppercase tracking, 14–16px
- Card: border-radius 12–16px, subtle shadow

---

### 5. Contact / People Cards (`contacts-icon-people-buyers`, `contacts-connection-people`, `Contact-enrichment`)
**Use for:** Buying committee, contact enrichment before/after, people-centric data stories.

**Visual rules:**
- Card: white, border-radius 14px, person avatar (circle) left
- Role badge: small blue pill overlay on avatar — "DECISION MAKER", "KEY BUYER"
- Name: bold navy 16–18px, title: muted navy 13px
- Action icons: email + phone icons right side (blue)
- Enrichment: show "before" card (sparse) → arrow → "after" card (full data)

---

### 6. Wheel / Segmented Ring (`wheel-choices`)
**Use for:** Mutually-exclusive categories around a central concept, delivery mechanisms, three-way splits.

**Visual rules:**
- Outer ring: dashed red, clockwise direction arrows
- Segments: navy filled arcs, bold white text, equal spacing
- Center: white circle, ZI cloud icon + label
- 3–4 segments max

---

### 7. Donut / TAM Chart (`layouts-1`)
**Use for:** Market sizing, TAM visualization, percentage breakdowns.

**Visual rules:**
- Donut: red→pink gradient fill, white center
- Center text: bold label ("TOTAL ADDRESSABLE MARKET" etc.)
- Radiating labels: plain navy text with small red dot connectors
- Below: gradient pill bar with sub-categories listed inline

---

## Global ZI Look Rules

### Color
- Orb / gradient: `#e8182e` → `#ff6b35` (radial, red→orange)
- Gradient cards/headers: `#e8182e` → `#c2185b` (linear, red→pink)
- White cards: `#ffffff`, border `rgba(0,0,60,0.08–0.12)`
- Navy text: `#1e2d5a`
- Muted text: `rgba(30,45,90,0.45)`
- Accent blue (UI mockups only): `#0070d2`
- Score badge green: `#22c55e` (high), `#f59e0b` (mid)

### Typography
- Headlines: 40–56px, weight 800, navy
- Card labels: 13–16px, weight 700, navy
- Sub-labels: 11–13px, weight 500, muted navy
- Section labels: 10–11px, weight 700, uppercase, letter-spacing 1–1.5px

### Spacing
- Orbit radius from center: 320–400px (1920×1080 canvas)
- Card size: 160–220px wide, 60–80px tall
- Card corner radius: 14–18px
- Internal card padding: 12–16px

### Motion (ZI Look specific)
- Center orb: scales in with spring (damping 14, stiffness 100), then slow pulse (±2.5%)
- Orbit ring: strokeDashoffset draw from full→0 over ~90 frames
- Cards: stagger in clockwise, spring scale from 0.85, ~15 frame gap each
- Connector lines: fade in after cards settle (all at once)
- Gradient cards/output: slide in from right, spring
- No rotation animations — everything enters via scale+fade or translate+fade
