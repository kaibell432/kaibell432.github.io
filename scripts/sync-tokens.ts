/**
 * Sync design tokens from DESIGN.md (the source of truth).
 *
 *   npm run tokens          rewrite derived tokens + generated files
 *   npm run tokens -- --check   exit 1 if anything is out of date (CI)
 *
 * Reads `colors.main` and `colors.accent` from DESIGN.md's YAML frontmatter,
 * derives the full palette with src/theme.ts, then:
 *   1. writes every derived color back into DESIGN.md's frontmatter,
 *   2. generates src/tokens.css (Tailwind @theme colors),
 *   3. generates src/design-tokens.ts (the site default theme for the picker),
 *   4. refreshes colorMeta tonal ramps in .impeccable/design.json, if present.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { isMap, parseDocument, Scalar } from 'yaml';
import { TOKENS, derivePalette, parseHex, tonalRamp } from '../src/theme.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const paths = {
  design: `${root}DESIGN.md`,
  css: `${root}src/tokens.css`,
  ts: `${root}src/design-tokens.ts`,
  sidecar: `${root}.impeccable/design.json`,
};
const check = process.argv.includes('--check');
const stale: string[] = [];

function write(path: string, next: string) {
  const prev = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (prev === next) return;
  stale.push(path.slice(root.length));
  if (!check) writeFileSync(path, next);
}

// --- 1. Read DESIGN.md and derive the palette --------------------------------
// DESIGN.md is kept out of git, so a fresh checkout (CI, a new machine) builds
// from the committed src/tokens.css and src/design-tokens.ts instead.
if (!existsSync(paths.design)) {
  console.log('DESIGN.md not found; using the committed src/tokens.css and src/design-tokens.ts.');
  process.exit(0);
}
const source = readFileSync(paths.design, 'utf8');
const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
if (!match) throw new Error('DESIGN.md has no YAML frontmatter');

const doc = parseDocument(match[1]!);
const main = parseHex(String(doc.getIn(['colors', 'main']) ?? ''));
const accent = parseHex(String(doc.getIn(['colors', 'accent']) ?? ''));
if (!main || !accent) throw new Error('DESIGN.md needs valid hex values for colors.main and colors.accent');

const palette = derivePalette({ main, accent });
for (const token of TOKENS) {
  const node = new Scalar(palette[token]);
  node.type = Scalar.QUOTE_DOUBLE;
  doc.setIn(['colors', token], node);
}
const frontmatter = doc.toString({ lineWidth: 0 }).trimEnd();
write(paths.design, source.replace(match[0], `---\n${frontmatter}\n---\n`));

// All frontmatter colors (derived + any extra fixed ones) become CSS tokens.
const colorsNode = doc.get('colors');
const colors: [string, string][] = isMap(colorsNode)
  ? colorsNode.items.map((pair) => [String((pair.key as Scalar).value), String((pair.value as Scalar).value)])
  : [];

// --- 2. src/tokens.css ---------------------------------------------------------
const banner = 'Generated from DESIGN.md by `npm run tokens`. Do not edit by hand.';
write(
  paths.css,
  `/* ${banner} */\n@theme {\n${colors.map(([k, v]) => `  --color-${k}: ${v};`).join('\n')}\n}\n`,
);

// --- 3. src/design-tokens.ts ---------------------------------------------------
write(
  paths.ts,
  `// ${banner}\n\n/** The site's default theme inputs (DESIGN.md colors.main / colors.accent). */\nexport const DESIGN_THEME = { main: '${main}', accent: '${accent}' };\n`,
);

// --- 4. .impeccable/design.json colorMeta ------------------------------------------
if (existsSync(paths.sidecar)) {
  const sidecar = JSON.parse(readFileSync(paths.sidecar, 'utf8'));
  const meta = (sidecar.extensions ??= {}).colorMeta ?? {};
  const next: Record<string, unknown> = {};
  for (const [key, value] of colors) {
    next[key] = { ...meta[key], canonical: value, tonalRamp: tonalRamp(value) };
  }
  if (JSON.stringify(next) !== JSON.stringify(sidecar.extensions.colorMeta)) {
    sidecar.extensions.colorMeta = next;
    sidecar.generatedAt = new Date().toISOString();
  }
  write(paths.sidecar, `${JSON.stringify(sidecar, null, 2)}\n`);
}

if (check && stale.length) {
  console.error(`Design tokens are out of date: ${stale.join(', ')}. Run \`npm run tokens\`.`);
  process.exit(1);
}
console.log(stale.length ? `${check ? 'Stale' : 'Updated'}: ${stale.join(', ')}` : 'Design tokens up to date.');
