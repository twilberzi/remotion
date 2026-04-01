# Graphs & Charts — Style Guide

## Card Container
- White card, border-radius 16px, subtle shadow
- Header: company name bold navy, URL in muted blue, 14px
- Stat row: 3 columns (Employees / Revenue / Industry), label uppercase 10px muted, value bold navy 16px
- Tag pill: light border, rounded, small text — e.g. "iOS Marketing Tools"

## Score Badge (top-left overlay)
- Circle badge, 52–72px diameter
- Background: linear-gradient(135deg, #e8182e, #c2185b)
- White bold number, 20–24px
- Positioned overlapping top-left corner of card

## Spark / Area Chart (inside card)
- 3-column table header: SOURCE / SCORE / AUDIENCE STRENGTH
- Light grey divider lines
- Area chart below: blue fill (#3B82F6 at 30% opacity), blue stroke 2px
- X-axis: date labels, 10px muted grey
- Chart height: ~80px inside card
- No Y-axis labels — keep it minimal

## Decay / Line Chart (standalone)
- Background: white card or transparent
- Line: navy (#1e2d5a), 3px stroke
- Decay shown as downward slope
- Highlight zone: red fill at 20–30% opacity on decayed area
- Annotation text: navy, 14px, with arrow pointer

## Bar Chart
- Bars: navy fill (#1e2d5a) or red/pink gradient
- Bar radius: 6px top corners
- Animate: bars grow from 0 height (spring per bar, stagger 8 frames)
- Labels: above bar, bold navy, 14px
- X-axis labels: 12px muted grey

## Motion Rules
- Card scales in first
- Score badge pops in after card (spring)
- Chart draws in last (line traces left→right, bars grow up)
- Stat rows fade in sequentially

## Do Not
- No 3D charts
- No pie charts (use hub & spoke instead)
- No gridlines heavier than 0.5px rgba(0,0,0,0.08)
