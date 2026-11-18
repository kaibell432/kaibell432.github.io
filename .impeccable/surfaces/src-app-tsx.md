---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/components/Hero.tsx","src/components/Projects.tsx"]
---

# Home page (src/App.tsx)

Scope: the whole single-page site. Mode: Persuade (professional presence; the visitor decides what to make of Kai and reaches the résumé or email).

Audience: recruiters and hiring managers first, then peers and general visitors (PRODUCT.md). Job: leave with an accurate picture of Kai and the work. Action: open the résumé or email Kai. Proof: the two KBR apps, three public projects, the experience timeline, the AWS certification. Constraints: every sentence in content.ts stays word for word; section order Hero, About, Experience, Projects, Skills, Contact; section numbers 01–05 stay; Radix icons only; no AI-generated assets (procedural line art and Kai's own photo only); the procedural topography stays; static GitHub Pages.

Kai's answers (2026-11-18): the memory should be the work; must not feel gimmicky or timid; theme picker and reticle portrait may change.

## Direction contract

THESIS: The work is the surveyed ground. The five projects are numbered stations on one traverse that starts in the hero and ends in their data sheets; it refuses the hero-over-a-card-grid arrangement.

OWN-WORLD: Graphite bands with procedural contours and the 64px grid; one orange signal for KBR stations, markers and leaders. Survey symbols: circle-and-triangle stations, a dashed traverse, square waypoints. Archivo semi-expanded titles, JetBrains Mono station numbers. Flat paper data sheets with hairlines.

STORY: A recruiter sees name, title and five named projects at once, reads the two orange KBR stations first, jumps from a station to its data sheet, and leaves with the résumé or an email.

FIRST VIEWPORT: Desktop: the left half holds the name at 6rem, title byline, lede, paragraph, See my work, Résumé and icon links (halves, not five/seven: the 6rem name needs about 530px). The right half carries the traverse over the topography: five station markers 03.1–03.5 joined by a dashed line, each labelled with title and context as a link, 03.1 and 03.2 in orange. The facts legend runs along the bottom edge. Phones: the traverse becomes a vertical dashed station list under the actions.

FORM: Survey Stations, position 6 of 7 on the second grounded list (dealt lead), seed:1712315aeeff1878. Signature interaction: the traverse draws station to station on load; hovering or focusing a station lights its leg of the line; in Projects the traverse continues as a vertical dashed line past each data sheet, drawing down on scroll. Reduced motion shows the finished line.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Decisions

- Portrait moved from the hero into About (light-band reticle variant).
