# Lists — Style Guide

## Two Layout Types

### Type 1: Chapter List (Half Split)
- Left panel: light blue/white gradient background (#EEF2FF or #F0F4FF)
- Right panel: dark gradient (navy to near-black)
- Left panel width: ~45% of screen
- Header: dark navy, bold, 32–36px, top-left
- List items: numbered 1. 2. 3. 4., navy text, 24–28px, regular weight
- Active item: red/pink pill capsule behind text, white text
- Pill: border-radius 999px, background linear-gradient(135deg, #e8182e, #c2185b)
- Inactive items: plain navy text, no background

### Type 2: Selection Field List
- Card with gradient header (red→pink), white bold title text
- Body: white background
- Items: red bullet dot (•), navy uppercase text, 16–18px, spaced 14px apart
- No icons — text only with dot marker
- Compact, data-dense feel

## Motion Rules (Chapter List)
- Header fades in first (frame 0–15)
- List items stagger in top→bottom (10 frame delay each)
- Highlight pill slides vertically to active item (spring interpolation)
- Pill does NOT jump — it slides smoothly

## Motion Rules (Selection List)
- Card scales in (spring)
- Header appears with card
- Bullet items reveal top→bottom, 8 frame stagger

## Typography
- Header: 700 weight, 30–36px, NAVY
- List items: 500–600 weight, 22–26px, NAVY
- Active item: 700 weight, white

## Do Not
- Do not animate all items at once
- Do not use icons per list item unless explicitly requested
- Do not use heavy shadows on list cards
