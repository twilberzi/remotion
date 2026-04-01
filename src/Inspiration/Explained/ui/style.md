# UI / Product Mockups — Style Guide

## Purpose
Fake product UI used to show platform features in context.
Looks like a real SaaS dashboard — clean, modern, believable.

## Base Card / Modal
- White background, border-radius 16px
- Subtle border: 1px solid rgba(0,0,60,0.08)
- Box shadow: 0 8px 40px rgba(0,0,60,0.12)
- Header bar: brand color strip or ZI "Z" logo + module label
- Body: form fields, dropdowns, labels — light grey inputs

## Form Fields
- Label: 12px muted grey, uppercase
- Input: white bg, 1px border rgba(0,0,0,0.15), border-radius 8px, 14px navy text
- Dropdown: same as input + chevron icon right
- Radio/checkbox: brand red accent color when selected

## Callout Chips (floating overlays)
- White card, border-radius 12px, shadow
- Icon left: colored circle with logo/icon
- Title: bold navy 13px
- Body: description text, navy 12px
- Border: subtle 1px rgba(0,0,0,0.1)
- Positioned floating around the main UI card at angles

## Intent / Signal Tags
- Small pill: rounded, 1px border, icon + text
- Text: 12–13px navy
- Examples: "Researching competitors on G2", "Recent Funding"

## Motion Rules
- Main UI card slides up + fades in (spring)
- Callout chips float in one at a time (stagger 20 frames each)
- Each chip scales from 0.8 → 1 (spring, damping 12)
- Chips should feel like they are popping into view

## ZI Brand Bar (inside UI)
- Left edge accent: 4px red/pink gradient bar
- "Z" logo mark: small, navy or white depending on bg
- Module label: "Marketing", "Sales", "RevOps" — bold 14px

## Do Not
- No real logos unless provided as assets
- No screenshots — everything built in code
- No overly complex forms
- Keep it readable at video resolution
