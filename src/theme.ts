/**
 * Theme engine: derive the whole palette from two input colors.
 *
 * Shades are computed in OKLCH (perceptual lightness), then gamut-mapped back
 * to sRGB hex. Every text color is solved against its background to meet a
 * WCAG contrast target, so any main/accent pair stays readable.
 *
 * DESIGN.md is the source of truth: its frontmatter `colors.main` and
 * `colors.accent` are the inputs, and `npm run tokens` (scripts/sync-tokens.ts)
 * writes the derived shades back into DESIGN.md and generates src/tokens.css
 * and src/design-tokens.ts from them.
 *
 * This module has no imports so the sync script can run it under plain Node
 * (`node --experimental-strip-types`).
 */

export type ThemeInput = { main: string; accent: string };

/** Alternative pairs offered in the picker (the site default comes from DESIGN.md). */
export const PRESETS: { name: string; theme: ThemeInput }[] = [
  { name: 'Navy & amber', theme: { main: '#1b2a41', accent: '#f2a541' } },
  { name: 'Forest & lime', theme: { main: '#1f3a2e', accent: '#a3d65c' } },
  { name: 'Plum & coral', theme: { main: '#3a1f3d', accent: '#ff7a59' } },
  { name: 'Slate & cyan', theme: { main: '#1e293b', accent: '#22d3ee' } },
];

/** Token names, in display order. Each becomes a `--color-<name>` CSS variable. */
export const TOKENS = [
  'main-950',
  'main-800',
  'main',
  'main-700',
  'on-main',
  'on-main-muted',
  'on-main-subtle',
  'accent-ink',
  'accent-600',
  'accent',
  'accent-glow',
  'on-accent',
  'paper',
  'ink',
  'muted',
] as const;

export type Token = (typeof TOKENS)[number];
export type Palette = Record<Token, string>;

/* ---------------------------------------------------------------- color math */

type RGB = [number, number, number];
type LCH = { l: number; c: number; h: number };

export function parseHex(input: string): string | null {
  const v = input.trim().replace(/^#/, '').toLowerCase();
  if (/^[0-9a-f]{3}$/.test(v)) return `#${[...v].map((ch) => ch + ch).join('')}`;
  if (/^[0-9a-f]{6}$/.test(v)) return `#${v}`;
  return null;
}

function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function rgbToHex(rgb: RGB): string {
  return `#${rgb
    .map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0'))
    .join('')}`;
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.sign(c) * Math.abs(c) ** (1 / 2.4) - 0.055);

function toLch(hex: string): LCH {
  const [r, g, b] = hexToRgb(hex).map(toLinear) as RGB;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.hypot(A, B);
  return { l: L, c: c < 1e-4 ? 0 : c, h: c < 1e-4 ? 0 : (Math.atan2(B, A) * 180) / Math.PI };
}

function lchToRgb({ l: L, c, h }: LCH): RGB {
  const A = c * Math.cos((h * Math.PI) / 180);
  const B = c * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

const inGamut = (rgb: RGB) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** OKLCH → hex, reducing chroma until the color fits in sRGB. */
function fromLch(lch: LCH): string {
  const l = Math.min(1, Math.max(0, lch.l));
  let rgb = lchToRgb({ ...lch, l });
  if (inGamut(rgb)) return rgbToHex(rgb);
  let lo = 0;
  let hi = lch.c;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(lchToRgb({ l, c: mid, h: lch.h }))) lo = mid;
    else hi = mid;
  }
  rgb = lchToRgb({ l, c: lo, h: lch.h });
  return rgbToHex(rgb);
}

export function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map(toLinear) as RGB;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const shift = (hex: string, dl: number) => {
  const c = toLch(hex);
  return fromLch({ ...c, l: c.l + dl });
};

/** Mix two colors in OKLab-ish space (lightness + chroma, hue from `a`). */
function blend(a: string, b: string, t: number) {
  const x = toLch(a);
  const y = toLch(b);
  return fromLch({ l: x.l + (y.l - x.l) * t, c: x.c + (y.c - x.c) * t, h: x.c > 0 ? x.h : y.h });
}

/**
 * Smallest lightness change to `fg` (away from `bg`) that reaches `target`
 * contrast. Returns `fg` unchanged if it already passes.
 */
function solveContrast(fg: string, bg: string, target: number): string {
  if (contrast(fg, bg) >= target) return fg;
  const c = toLch(fg);
  const towardLight = luminance(bg) < 0.18;
  let lo = c.l;
  let hi = towardLight ? 1 : 0;
  if (contrast(fromLch({ ...c, l: hi }), bg) < target) return fromLch({ ...c, l: hi });
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (contrast(fromLch({ ...c, l: mid }), bg) >= target) hi = mid;
    else lo = mid;
  }
  return fromLch({ ...c, l: hi });
}

/* ------------------------------------------------------------------- derive */

export function derivePalette({ main, accent }: ThemeInput): Palette {
  const m = toLch(main);
  const tint = Math.min(m.c, 0.03); // keep neutrals only lightly tinted by the main hue

  const nearBlack = fromLch({ l: 0.17, c: tint * 0.6, h: m.h });
  const onMain = contrast('#ffffff', main) >= contrast(nearBlack, main) ? '#ffffff' : nearBlack;

  const paper = fromLch({ l: 0.967, c: tint * 0.25, h: m.h });
  const ink = solveContrast(fromLch({ l: Math.min(m.l, 0.32), c: tint, h: m.h }), paper, 7);
  const muted = solveContrast(fromLch({ l: 0.62, c: tint * 0.8, h: m.h }), paper, 6);

  const accent600 = shift(accent, -0.06);
  const darkOnAccent = fromLch({ l: 0.16, c: tint * 0.5, h: m.h });
  const score = (fg: string) => Math.min(contrast(fg, accent), contrast(fg, accent600));
  const onAccent = score(darkOnAccent) >= score('#ffffff') ? darkOnAccent : '#ffffff';

  return {
    'main-950': shift(main, -0.12),
    'main-800': shift(main, -0.035),
    main,
    'main-700': shift(main, 0.05),
    'on-main': onMain,
    'on-main-muted': solveContrast(blend(onMain, main, 0.22), main, 7),
    'on-main-subtle': solveContrast(blend(onMain, main, 0.42), main, 4.6),
    'accent-ink': solveContrast(accent, paper, 4.8),
    'accent-600': accent600,
    accent,
    'accent-glow': solveContrast(accent, main, 4.8),
    'on-accent': onAccent,
    paper,
    ink,
    muted,
  };
}

/** Contrast checks shown in the picker. */
export function contrastReport(p: Palette) {
  return [
    { label: 'Text on main', ratio: contrast(p['on-main'], p.main) },
    { label: 'Text on accent', ratio: contrast(p['on-accent'], p.accent) },
    { label: 'Body text', ratio: contrast(p.ink, p.paper) },
  ];
}

/** 8-step dark-to-light ramp in a color's hue, for the DESIGN.md sidecar. */
export function tonalRamp(hex: string) {
  const c = toLch(hex);
  return Array.from({ length: 8 }, (_, i) => {
    const l = 0.15 + (0.8 * i) / 7;
    const edge = Math.min(l - 0.1, 1 - l) / 0.4; // ease chroma off near black and white
    return fromLch({ l, c: c.c * Math.max(0.15, Math.min(1, edge)), h: c.h });
  });
}

/* ---------------------------------------------------------------- runtime */

const STORAGE_KEY = 'kb-theme';

export function applyPalette(p: Palette) {
  const root = document.documentElement.style;
  for (const t of TOKENS) root.setProperty(`--color-${t}`, p[t]);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', p.main);
}

export function loadTheme(fallback: ThemeInput): ThemeInput {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    const main = parseHex(raw?.main ?? '');
    const accent = parseHex(raw?.accent ?? '');
    if (main && accent) return { main, accent };
  } catch {
    /* storage unavailable or corrupt: fall back to defaults */
  }
  return fallback;
}

export function saveTheme(theme: ThemeInput, fallback: ThemeInput) {
  try {
    const isDefault = theme.main === fallback.main && theme.accent === fallback.accent;
    if (isDefault) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {
    /* ignore: theme just won't persist */
  }
}
