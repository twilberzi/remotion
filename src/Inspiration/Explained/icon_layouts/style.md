Icon Layouts — style.md
Purpose

This folder defines how icons should be arranged into explainer layouts for GTM Explained videos.

Layouts are used to visually explain:

Relationships between roles

How systems connect

How buyers move through channels

How decisions happen across stakeholders

How data flows across tools

Layouts are the structure. Icons are the language.

Core Layout Types
1. Hub & Spoke (Account / Golden Record / CRM Center)

Use When

Explaining buying committees

Showing a central system (CRM, Account, MDM)

Showing many roles touching one core object

Layout Rules

One central card (Account / CRM / Golden Record)

4–8 icons placed in a circular ring

Thin curved connectors from center to each icon

Equal spacing between nodes

No overlapping elements

Motion Rules

Center appears first

Outer nodes animate in clockwise

Lines draw in after each icon appears

Narrative Fit
“Everything connects back to one source of truth.”

2. Orbit / Journey Map (Buyer Research / GTM Motion)

Use When

Explaining buyer research behavior

Showing channels (review sites, YouTube, ATS, search, ads)

Explaining awareness → consideration → decision

Layout Rules

Central company or product

1–3 orbit rings

Touchpoints placed along orbit path

Arcs or rings visible as subtle guides

Icons should follow a clockwise direction

Motion Rules

Rings fade in

Icons travel slightly along orbit path

Central object stays anchored

Narrative Fit
“Buyers don’t start with you — they orbit your brand across channels.”

3. Org Chart / Stakeholder Tree

Use When

Explaining roles in a buying group

Showing influence paths

Mapping decision structure

Layout Rules

Top-down hierarchy

One top node (CEO / Exec)

Mid-level nodes (CFO, CMO, Head of Sales)

Lower-level nodes (RevOps, AE, End User)

Dotted or dashed connectors

Department group boxes allowed

Motion Rules

Top node appears first

Downstream nodes appear in waves

Lines draw downward

Narrative Fit
“Different roles care about different outcomes.”

4. Linear Workflow (Process / Pipeline)

Use When

Explaining GTM steps

Showing outreach → demo → decision

Showing handoffs

Layout Rules

Horizontal or vertical step layout

Each step = icon card

Connectors between steps

One direction of flow (left→right or top→bottom)

Motion Rules

Steps appear sequentially

Connector animates after each step

Slight emphasis glow on current step

Narrative Fit
“This is how value moves through the system.”

5. Cluster / System Map (Tech Stack / Data Systems)

Use When

Showing multiple tools in a stack

Explaining integrations

Showing ecosystem complexity

Layout Rules

Central system (CRM, MDM, Data Layer)

Tools arranged in loose clusters

Grouped by category if possible

Soft container rings or regions

Thin connecting lines

Motion Rules

Central system appears first

Tool clusters fade in

Lines draw outward

Narrative Fit
“Your data lives across more systems than you realize.”

Spacing & Composition Rules

Always leave breathing room between elements

Never crowd icons

Icons should align to invisible grid

Centered layouts preferred

Avoid diagonal chaos

Layout must read clearly at small screen sizes

Claude Prompting Instructions (For This Folder)

When Claude selects an icon layout:

Claude should:

Pick layout based on concept, not aesthetics

Default to:

Hub & Spoke → roles, master records, buying committees

Orbit → buyer journeys, research

Org Chart → stakeholders, influence

Linear → processes, GTM steps

Describe layout first before generating visuals

Match layout to narration beats

Claude should NOT:

Mix multiple layout types in one scene

Create free-floating icons without structure

Use decorative shapes without meaning

Example Mappings

MDM Explainer

Layout: Hub & Spoke

Center: Golden Record

Outer: CRM, ERP, Support, Marketing

Buying Committee

Layout: Hub & Spoke

Center: Account

Outer: Economic Buyer, Champion, Technical Buyer

Buyer Journey

Layout: Orbit

Center: Company

Orbit nodes: Review Sites, YouTube, Demo, ATS

Org Alignment

Layout: Org Chart

CEO → CFO / CMO / Head of Sales → RevOps / AE

File Usage Rules

Images in this folder:

Are layout references

Should be recreated in Remotion using:

Positioning

Motion logic

Structural composition

Do NOT copy logos 1:1 unless explicitly instructed

Default Scene Recipe

When in doubt:

Use Hub & Spoke

Center = concept being explained

Outer = stakeholders or systems

Animate center → then surround

Next Best Folder To Create

After this:

/library/flows/style.md (for arrows, sync, handoffs)

/library/boxes/style.md (for cards, highlights, callouts)