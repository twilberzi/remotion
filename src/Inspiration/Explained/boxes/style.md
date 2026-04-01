# Boxes / Cards — Style Guide

## Core Card Style
- White background (#FFFFFF)
- Border radius: 16–20px
- Border: 1.5px solid rgba(232,24,46,0.12) — subtle red tint
- Box shadow: 0 4px 20px rgba(0,0,60,0.08)
- Red/pink gradient accent on bottom-right corner (L-shaped, 4px wide)
- No background fill — always white or very light (#F8FAFF)

## Card Sizes
- Small tile: 160×160px — icon + label only
- Medium card: 280×180px — icon + label + 1–2 data points
- Large info card: 380×220px — header + icon list (3–4 items)
- Full column card: 420×auto — header + bulleted list

## Header Bar Style (Large Cards)
- Gradient pill or full-width rounded top bar
- Background: linear-gradient(135deg, #e8182e, #c2185b)
- White text, bold, 18–22px
- Rounded top corners match card

## Icon + Label Row (inside cards)
- Navy icon (#1E2A5A), 28–36px
- Label text: navy, 15–17px, medium weight
- Row gap: 12px
- Left-aligned with 20px padding

## Tree / Hierarchy Layout (box-graphs style)
- Center top card: gradient header (red/pink), icon + title
- Dashed connector lines: rgba(232,24,46,0.3), 1.5px, dashed
- 3 child cards below: equal width, left-aligned content
- Child cards: navy header bar, white body, icon rows

## Motion Rules
- Parent card scales in first (spring, damping 13)
- Connector lines draw in after parent
- Child cards stagger in left→right (20 frame delay each)
- List items inside cards fade in sequentially (10 frame delay)

## Do Not
- No drop shadows heavier than specified
- No colored card backgrounds (white only)
- No borders thicker than 2px
- No rounded corners smaller than 12px
