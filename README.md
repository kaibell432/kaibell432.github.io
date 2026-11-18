# kaibell432.github.io

Personal site for Kai Bell, live at <https://kaibell432.github.io>.

Built with [React](https://react.dev), [Base UI](https://base-ui.com), [Tailwind CSS v4](https://tailwindcss.com), and [Radix Icons](https://www.radix-ui.com/icons), bundled with [Vite](https://vite.dev).

## Develop

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

## Editing content

All of the copy (bio, experience, projects, skills, education, links) lives in [`src/content.ts`](src/content.ts). The components in `src/components/` only handle layout.

- **Résumé:** replace `public/KaiBellResume.pdf`. Set `profile.resumeUrl` to `null` to hide the Résumé buttons.
- **Photo:** `public/kai-bell.webp` (square; it's displayed as a circle).

## Design system

[`DESIGN.md`](DESIGN.md) is the design system and the source of truth for its tokens, in the [Impeccable](https://github.com/pbakaus/impeccable) / DESIGN.md format: YAML frontmatter tokens followed by the written guidance. [`PRODUCT.md`](PRODUCT.md) holds the product context. `.impeccable/design.json` is the sidecar (component snippets, color ramps, motion) for Impeccable's tooling.

### Theme

The whole palette is derived from two colors, **main** and **accent**:

1. Edit `colors.main` / `colors.accent` in the DESIGN.md frontmatter.
2. Run `npm run tokens` (it also runs automatically before `dev` and `build`, and on every DESIGN.md save while `npm run dev` is running).

[`scripts/sync-tokens.ts`](scripts/sync-tokens.ts) derives the other shades with [`src/theme.ts`](src/theme.ts), writes them back into DESIGN.md, and generates `src/tokens.css` (Tailwind `@theme` colors) and `src/design-tokens.ts`. Don't edit those generated files by hand. `npm run tokens -- --check` exits non-zero if anything is out of date.

The derivation works in OKLCH and solves every text color against its background for WCAG contrast, so any pair stays readable (a light main flips text to dark automatically).

- The color-wheel button in the header opens a picker for previewing pairs: hex inputs, presets, the generated palette, and live contrast grades. A visitor's choice persists in `localStorage` for that browser only.
- **Copy theme** copies the `main` / `accent` lines to paste into DESIGN.md, making the previewed theme the site default.
- Hide the picker with `site.themePicker = false` in `src/content.ts`.

## Deploy

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site and publishes `dist/` to GitHub Pages.

One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.
