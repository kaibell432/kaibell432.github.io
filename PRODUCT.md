# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Recruiters and hiring managers** checking Kai out: skimming current role and experience, opening the résumé, finding a way to get in touch.
- **Peers and developers** looking at what Kai builds and how.
- **Personal / general visitors**: friends, family, anyone arriving from a LinkedIn link.

## Product Purpose

The personal site of Kai Bell (kaibell432.github.io). Its job right now is **professional presence**, not an active job search: when someone finds Kai, the site should make Kai read as credible and current, with the work easy to see and contact easy to find. Success is a visitor leaving with an accurate picture of who Kai is and what Kai builds, with the résumé and contact one step away.

## Positioning

Kai builds React front ends for data-heavy work, coming from the data side: first labeling and quality-checking geospatial AI training data (imagery, FMV, SAR) at Enabled Intelligence, now building the tools at KBR, Inc. (National Security Solutions), alongside systems engineers. Kai is **not** a systems engineer and must never be described as one.

## Operating Context

- Visitors usually arrive from LinkedIn, the résumé, or a direct link, on desktop or phone.
- The résumé PDF (`public/KaiBellResume.pdf`) is generated from `C:\Users\kaibe\Documents\KaiBellResume.docx`; site content and résumé should stay consistent.
- All copy and facts live in `src/content.ts`; components handle layout only.

## Capabilities and Constraints

- **Static hosting only:** GitHub Pages, deployed by GitHub Actions from `main`. No server, backend, analytics, or forms that need one.
- **Work projects stay vague:** KBR projects (a geospatial analysis app on Base UI + Tailwind with AI, and a Fluent UI data-repository UI on SharePoint's API) are described at a high level only: no screenshots, internal names, or specifics. They have no public demo or source.
- Stack: React + TypeScript (Vite), Base UI components, Tailwind CSS v4, Radix icons for every icon.
- Existing capability (not a binding constraint): a theme engine derives the full palette from a main and an accent color, and a picker in the header that is a dev tool only: it renders under `npm run dev`, saves a pair to DESIGN.md, and is left out of production builds (`src/theme.ts`, `ThemePicker.tsx`).

## Brand Commitments

- Name: Kai Bell. Voice: first person, plain and factual; no inflated claims.
- Facts on the site must be backed by the résumé, LinkedIn, or Kai's own statements. Don't invent metrics, titles, or outcomes.

## Evidence on Hand

- Résumé PDF: `public/KaiBellResume.pdf`.
- Portrait: `public/kai-bell.webp`.
- AWS Certified Solutions Architect – Associate (SAA-C03), Sep 2025–Sep 2028, verifiable on Credly.
- Public projects: AI meal planner (live at aiweightloss.onrender.com, source at github.com/kaibell432/AIWeightloss); UVA wildfire-prediction ML project (team paper on LinkedIn, Kaggle dataset); UVA ski-hotel value analysis in R (`public/ski-hotel-analysis.pdf`).
- No testimonials, recommendations, metrics, or press exist. Don't fabricate them.

## Product Principles

1. **Credible over flashy.** It's a professional presence; every claim must hold up if a recruiter checks it.
2. **One step to the essentials.** Current role, résumé, and contact are always within reach.
3. **Show the arc.** The story is data side to tool builder; the site should make that progression legible.
4. **Discretion about work.** Professional work is shown by what it does, never by internal detail.
