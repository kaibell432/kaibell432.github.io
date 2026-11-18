---
name: Kai Bell
description: Personal site of Kai Bell, React front ends for data-heavy work.
# Edit only `main` and `accent`. Every other color is derived from them by
# `npm run tokens` (src/theme.ts) and written back here, so hand edits to the
# derived keys are overwritten. The script also generates src/tokens.css.
colors:
  main-950: "#161616"
  main-800: "#2a2a2a"
  main: "#333333"
  main-700: "#404040"
  on-main: "#ffffff"
  on-main-muted: "#cecece"
  on-main-subtle: "#a3a3a3"
  accent-ink: "#b64a00"
  accent-600: "#e05d00"
  accent: "#fc6a03"
  accent-glow: "#ff782f"
  on-accent: "#0d0d0d"
  paper: "#f4f4f4"
  ink: "#333333"
  muted: "#5c5c5c"
typography:
  display:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "6rem"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112.5"
  headline:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112.5"
  title:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112.5"
  lede:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1.375
  body:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0.18em"
  label-sm:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  gutter-sm: "16px"
  gutter: "24px"
  section-sm: "80px"
  section: "112px"
  container: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.accent-600}"
  button-compact:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "36px"
  button-ghost-on-main:
    textColor: "{colors.on-main}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  tag:
    textColor: "{colors.ink}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  card:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "28px"
  card-feature:
    backgroundColor: "{colors.main}"
    textColor: "{colors.on-main}"
    rounded: "{rounded.lg}"
    padding: "28px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "36px"
  tooltip:
    backgroundColor: "{colors.main-950}"
    textColor: "{colors.on-main}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
---

# Design System: Kai Bell

## Overview

**Creative North Star: "The Annotated Map"**

The site reads like a clean map with annotations laid over it. The content is the terrain: plain, readable, generously spaced on light paper. On top of it sit the annotations: callouts whose leader lines run from each headline to its label, a legend of symbols, dates set in the margin like coordinates, small accent squares as markers, thin hairline rings, a survey reticle around the portrait, a faint survey grid under every band and topographic contours in the dark ones. Only the annotation lines move, drawing themselves in as they come into view. The annotations orient the visitor; they never compete with the content.

Two dark bands in the main color bracket the page: the hero at the top and the contact band at the bottom, with the header pinned in the same color. Everything between alternates paper and white. The single accent color is the signal: actions, the current state, and the markers that make the map legible. Components are precise and confident: crisp radii, solid accent fills, tight labels.

The whole palette comes from two inputs, main and accent, and every text color is solved for WCAG contrast against its background, so the system holds for any pair.

**Key Characteristics:**
- Two input colors; every other shade derived and contrast-solved.
- Expanded-width Archivo headings over plain Archivo body text, with JetBrains Mono as the annotation voice.
- Flat surfaces with hairline rings; depth appears only on interaction and for floating layers.
- Map motifs (contours, grid, reticle, square markers) used as line art, never as fills.
- Annotations behave like a map's: callouts with leader lines, a symbol legend, coordinates in the margin, and lines that draw themselves in.

## Colors

One graphite family carries the structure and one orange signal carries the meaning; names below describe the default inputs.

### Primary
- **Survey Orange** (`accent`): primary buttons, the active nav underline, list markers, the current-role dot, the portrait ring. Large text and fills only.
- **Burnt Survey Orange** (`accent-600`): hover state for accent fills.
- **Ink Orange** (`accent-ink`): accent for small text on light surfaces (callout labels, links, label text), solved to at least 4.8:1 on paper.
- **Glow Orange** (`accent-glow`): accent for small text on the main color, solved to at least 4.8:1 on main.
- **Near Black** (`on-accent`): text and icons on accent fills.

### Neutral
- **Graphite** (`main`): header, hero, contact band, featured cards, certification card.
- **Deep Graphite** (`main-950`): tooltips and toasts.
- **Night Graphite** (`main-800`): the facts strip under the hero, the footer, inset panels on dark bands.
- **Raised Graphite** (`main-700`): small raised elements on dark bands (the monogram tile).
- **Signal White** (`on-main`): primary text on main.
- **Fog** (`on-main-muted`): secondary text on main (at least 7:1).
- **Ash** (`on-main-subtle`): labels and metadata on main (at least 4.6:1).
- **Map Paper** (`paper`): the page background; a near-white tinted by the main hue.
- **Graphite Ink** (`ink`): body text on light surfaces (at least 7:1 on paper).
- **Pencil Gray** (`muted`): secondary text on light surfaces (at least 6:1 on paper).

Cards and panels on light bands use plain white (#ffffff), with hairlines drawn in black at 8% opacity.

### Named Rules
**The Two-Input Rule.** Only `main` and `accent` are chosen. Every other color is derived by `npm run tokens` and never edited by hand.

**The Signal Rule.** The accent marks action, current state and markers. It is never a background for large areas or a decoration for its own sake.

**The Small-Text Rule.** Small orange text always uses `accent-ink` on light surfaces and `accent-glow` on main, never the raw `accent`.

## Typography

**Display Font:** Archivo Variable (with ui-sans-serif, system-ui)
**Body Font:** Archivo Variable
**Label/Mono Font:** JetBrains Mono Variable (with ui-monospace)

**Character:** One grotesque in two widths. Headings run Archivo at semi-expanded width (112.5%) for a broad, map-title presence, while body text stays at normal width for reading. JetBrains Mono is the annotation layer.

### Hierarchy
- **Display** (800, 3.75rem on phones up to 6rem, line-height 0.95): the name in the hero, once per page. Directly under it the current title runs as a byline (500, 1.125rem up to 1.25rem, `on-main-muted`) after a 6px accent square.
- **Headline** (700, 1.875rem up to 3rem, line-height 1.1): section titles.
- **Title** (700, 1.25rem up to 1.5rem): company names, project titles, card headings.
- **Lede** (500, 1.5rem up to 1.75rem, line-height 1.375): the one-sentence statement under the name in the hero.
- **Body** (400, 1rem, line-height 1.625): running text; the About narrative steps up to 1.125rem. Bullets are capped near 48rem so lines stay readable.
- **Label** (400, 0.75rem, letter-spacing 0.18em, uppercase; Tailwind `text-label`): section callouts and skill group headings.
- **Label small** (400, 0.6875rem, letter-spacing 0.08em; Tailwind `text-label-sm`): tags, card corner tags and metadata, legend labels, tooltips and small UI labels.
- **Data** (mono 400, 0.75rem, normal tracking): dates, codes and issue numbers.

Body-adjacent UI text (buttons, nav links, secondary copy) uses 0.875rem; small headings and triggers use 1rem.

### Named Rules
**The Map Legend Rule.** Uppercase mono with wide tracking is for labels, dates and metadata only. Sentences are never set in it.

## Layout

A single centered container (72rem max) with 16px gutters on phones and 24px from 640px up. Sections are full-bleed bands with 80px of vertical padding, 112px from 640px up. Bands alternate paper and white, with the main-color hero and contact band at either end. Each section opens with its headline and a callout on the same line (see Section Callout); nothing sits above the headline. Cards and card grids are spaced 24px apart throughout.

Breakpoints: 640px (gutters and section spacing grow), 768px (the header switches from a menu sheet to inline navigation), 1024px (the hero becomes two columns with the portrait on the right; grids widen to three or four columns). Phones get a single column throughout with no horizontal scrolling.

## Elevation & Depth

Mostly flat. Surfaces sit at rest with a 1px hairline ring (black at 8% on light surfaces, `on-main` at 10% on main) instead of shadows. Depth appears in two cases only: on interaction, when a card lifts 2px and gains a soft shadow, and for floating layers (dialogs, the theme popover, toasts, the mobile menu), which carry a large diffuse shadow over a dimmed backdrop.

### Shadow Vocabulary
- **Hover lift** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.06)` with a 2px upward move): project cards on hover.
- **Floating layer** (`box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25)`): dialogs, popovers, toasts, the mobile menu.

### Named Rules
**The Lift-On-Intent Rule.** Nothing casts a shadow at rest except floating layers. Shadows answer interaction or mark something that floats above the page.

## Shapes

Crisp, consistent radii: 6px for tags, pills and small controls, 8px for buttons, inputs and icon tiles, 12px for cards and dialogs, fully round for the portrait, presets and status dots. Markers are small accent squares (6px), not dots. Line art carries the map motif: topographic contour rings and a 64px grid in the dark bands, the same 64px grid in ink at 6% fading out from the top right of every light band, leader lines in callouts and the timeline, and a survey reticle (dashed orbit, compass ticks, an accent arc) around the circular portrait.

### Named Rules
**The Square Marker Rule.** List bullets, callout markers and timeline waypoints are small accent squares. Round dots are reserved for the timeline's company stops (filled accent for the current one).

**The Survey Line Rule.** Only annotation lines move. Callout leaders, the timeline rail, its stops and its leaders draw in once, the first time they scroll into view. Content is never hidden waiting for scroll, and reduced motion shows the finished lines.

## Components

### Buttons
- **Shape:** gently rounded (8px).
- **Primary:** solid accent fill with near-black text, 44px tall, 20px side padding, semibold 14px; hover darkens to `accent-600`; pressing nudges it down 1px. Never a gradient, glow or outline-only variant.
- **Ghost on light:** transparent with a 1px black ring at 15%, used next to a primary in the project dialog.
- **Compact:** the same fill at 36px tall with 16px padding, used in the header.
- **Ghost on main:** transparent with a 1px `on-main` ring at 20%, brightening to 40% with a faint wash on hover.
- **Focus:** a 2px accent outline offset 3px, on every interactive element.

### Chips
- **Tags:** label-small mono on a 4% black wash with an 8% hairline (on main: 7% white wash, 10% ring), 6px radius. Used for stacks and focus areas.
- **Pills:** hobbies and coursework use white 6px-radius chips with a hairline.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** white or paper on light bands; `main` for featured work and the certification.
- **Shadow Strategy:** flat at rest; hover lift on clickable cards (see Elevation & Depth).
- **Border:** a 1px hairline ring.
- **Internal Padding:** 24px, 28px from 640px up.
- **Corner tag:** a card's category (legend symbol plus `label-sm`) sits top right beside the title and drops below it on phones; it never sits above the title.
- **Status badge:** "Current" is `accent-ink` on white with a 30% accent hairline, so it stays above 4.5:1 for any accent.

### Inputs / Fields
- **Style:** paper background, 1px hairline border at 15% black, 8px radius, mono uppercase hex values.
- **Focus:** border shifts to `accent-ink` with a 2px accent ring at 30%.
- **Error:** red border and a short red message under the field.

### Navigation
Header pinned to the top in `main` at 90% with a backdrop blur. Links are 14px `on-main-muted`, turning `on-main` on hover; the section in view gets a 2px accent underline that grows from the left. On phones the links move into a right-hand sheet with large numbered entries.

### Survey Reticle Portrait (signature)
The circular portrait sits inside a 2px accent ring offset 6px from the photo, with a dashed orbit that turns once every 90 seconds (static when reduced motion is set), four accent compass ticks, and a short accent arc.

### Topographic Background (signature)
Procedurally drawn contour rings and a 64px grid in `on-main` at 3–11% opacity, with one accent contour, faded by a radial mask. Used only in the hero and contact bands. Light bands get the grid alone (`.map-grid`).

### Section Callout (signature)
The headline and its callout share a row. A 1px leader line (ink at 20%, `on-main` at 25% on dark bands) runs from the end of the headline's first line to a 6px accent square and the two-digit index and section name in `label`, set right. The headline shrink-wraps to its widest line (`useShrinkWrap`) so the leader always starts at the text. On phones the callout drops below the headline. The callout is decorative (`aria-hidden`); the headline carries the meaning.

### Map Legend (signature)
The facts strip under the hero is the page's key: each fact has a Radix symbol in `accent-glow` beside its `label-sm` name (Now: ID card, Certified: check circle, Studied: reader, Based: pin). The same symbol marks that fact wherever it reappears: the current-role badge and the corner tags on the certification and education cards. The mapping lives in `legend` in `src/content.ts`.

### Experience Timeline (signature)
A 1px rail with a round stop for each company. From 1024px the cards move 224px in, and each role's dates sit in that margin like coordinates: mono 12px, right-aligned, with a leader line crossing the rail to the card edge. A move within the same company gets a 7px accent square waypoint on the rail. Below 1024px the dates return to the role row.

### Survey Line Motion (signature)
Lines draw by scaling from zero on `ease-out-expo`: callout leaders and timeline leaders over 900ms, the rail over 1600ms, stops and markers pop over 500ms, staggered down the timeline. Classes `.draw-x`, `.draw-y` and `.draw-dot` animate when their `.reveal` container gets `data-shown`. The hero's load-in and the reticle's slow orbit are the only other motion.

## Do's and Don'ts

### Do:
- **Do** change the palette by editing `colors.main` and `colors.accent` in this file and running `npm run tokens`.
- **Do** style with the theme tokens (`bg-main`, `text-on-main-muted`, `text-accent-ink`, and so on) so every color follows the theme.
- **Do** keep orange small text on `accent-ink` or `accent-glow` (The Small-Text Rule).
- **Do** use Radix icons for every icon.
- **Do** respect reduced motion: the line draw-ins, the hero load-in and the reticle rotation all switch off.
- **Do** reuse a legend symbol wherever its fact appears, and add new facts to `legend` first.

### Don't:
- **Don't** hard-code hex values or Tailwind palette colors (`text-white`, `neutral-*`) in components. The exceptions are white card surfaces, black-alpha hairlines and shadows, and the status colors in the contrast grades.
- **Don't** use thick colored side stripes on cards or toasts as an accent.
- **Don't** set sentences in the uppercase mono label style (The Map Legend Rule).
- **Don't** add shadows to surfaces at rest (The Lift-On-Intent Rule).
- **Don't** put a label or kicker above a headline or card title; section names go in the callout and card categories in a corner tag.
- **Don't** fade or slide content in on scroll; only lines move (The Survey Line Rule).
