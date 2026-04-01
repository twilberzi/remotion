# Layout: Chapter List (Step Highlight)

## Purpose
Use this layout to introduce a multi-step framework, list of options, or progression within a chapter.
This layout visually guides the viewer through steps as the narration progresses.

## Structure
- Left panel:
  - Header title at top
  - Numbered list of 3–5 items stacked vertically
- Right panel:
  - Dark panel reserved for future visuals, diagrams, or b-roll
- Highlight pill:
  - Rounded red/pink pill behind the currently discussed list item

## Visual Style
- Left panel:
  - Soft light background
  - Large header text at top
  - Clean, readable list typography
- Right panel:
  - Dark gradient or dark background video from brand/elements/backgrounds
- Highlight pill:
  - Rounded capsule shape
  - Brand accent color (red/pink)
  - White text
  - Slight glow or soft shadow

## Motion Rules
- Header fades in first
- List items fade in downward (top → bottom) with slight stagger
- Highlight pill animates vertically to the current list item
- Highlight pill slides (not jumps) between steps
- Right panel background is subtle motion only

## Timing Guidelines
- Header: 0.3–0.5s fade in
- List items: staggered fade in (0.15–0.25s per line)
- Highlight movement: smooth slide synced to narration beats
- Total per step: ~1–1.5s focus time

## When to Use
- Framework explanations
- Step-by-step breakdowns
- “Ways to…” or “How to…” lists
- Playbooks
- Process walkthroughs

## Do Not
- Do not animate all steps at once
- Do not use icons for each list item unless specified
- Do not clutter right panel while list is the focus
- Do not use fast or flashy transitions

## Example Prompt Pattern (for Claude)

Create a chapter_list layout.
Left panel with header: “Ways to activate intent data”.
Show a numbered list:
1. Data foundation
2. Workflow automation
3. Go-to-market plays
4. AI sales assistants

Animate the header first.
Fade list items downward.
Add a red highlight pill that slides to each item as it is discussed.
Use a dark subtle motion background on the right panel.
Keep motion clean and instructional.