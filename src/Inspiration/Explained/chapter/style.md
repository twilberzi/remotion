# Chapter Title — Style Guide

## Layout
- Full screen, centered content
- No icons, no diagrams
- Light blue-to-white gradient background (#E8EEF8 → #F8FAFF)
- Generous negative space above and below

## Elements
1. Chapter pill (top, centered)
   - Rounded pill: border-radius 999px
   - Background: linear-gradient(135deg, #e8182e, #c2185b)
   - White text, bold, 18–20px
   - Padding: 10px 24px
   - Text: "Chapter 1", "Chapter 2", etc.

2. Headline (centered, below pill)
   - Dark navy (#1e2d5a), 56–72px, weight 800
   - Max 2 lines
   - Center aligned
   - Letter spacing: -1px
   - Line height: 1.15

## Motion Rules
- Background: static or very slow subtle gradient shift
- Chapter pill: fades in + scales from 0.85 → 1 (spring, frames 0–20)
- Headline: fades in + slides up 20px (frames 10–35)
- Hold for readability — no exit animation needed

## Timing
- Total: 60–90 frames (2–3 seconds)
- Pill in: frame 0–20
- Headline in: frame 10–35
- Hold: remaining frames

## Do Not
- No icons
- No diagrams
- No supporting text beyond headline
- No aggressive motion
