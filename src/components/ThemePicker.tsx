import { useMemo, useState } from 'react';
import { Field } from '@base-ui/react/field';
import { Popover } from '@base-ui/react/popover';
import { Toast } from '@base-ui/react/toast';
import { Tooltip } from '@base-ui/react/tooltip';
import { ClipboardCopyIcon, ColorWheelIcon, Cross2Icon, FileTextIcon, ResetIcon } from '@radix-ui/react-icons';
import { DESIGN_THEME } from '../design-tokens';
import {
  PRESETS,
  applyPalette,
  contrastReport,
  derivePalette,
  designSnippet,
  loadTheme,
  parseHex,
  saveTheme,
  type Palette,
  type ThemeInput,
  type Token,
} from '../theme';
import { cn, tooltipPopup } from './ui';

const MAIN_TOKENS: Token[] = ['main-950', 'main-800', 'main', 'main-700', 'on-main', 'on-main-muted', 'on-main-subtle', 'paper', 'ink', 'muted'];
const ACCENT_TOKENS: Token[] = ['accent-ink', 'accent-600', 'accent', 'accent-glow', 'on-accent'];

const sameTheme = (a: ThemeInput, b: ThemeInput) => a.main === b.main && a.accent === b.accent;

const ALL_PRESETS = [{ name: 'Site default', theme: DESIGN_THEME }, ...PRESETS];

/** Dev server only (vite.config.ts): writes main and accent into DESIGN.md and re-derives its color list. */
const DESIGN_THEME_ENDPOINT = '/__design-theme';

export function ThemePicker() {
  const [theme, setTheme] = useState<ThemeInput>(() => loadTheme(DESIGN_THEME));
  const palette = useMemo(() => derivePalette(theme), [theme]);
  const toast = Toast.useToastManager();

  function update(next: ThemeInput) {
    setTheme(next);
    applyPalette(derivePalette(next));
    saveTheme(next, DESIGN_THEME);
  }

  const [saving, setSaving] = useState(false);

  async function saveToDesignMd() {
    setSaving(true);
    try {
      const res = await fetch(DESIGN_THEME_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? res.statusText);
      saveTheme(theme, theme); // the pair is the site default now, so drop the stored preview
      toast.add({
        title: 'Saved to DESIGN.md',
        description: 'main and accent are updated and every derived color in the file was regenerated.',
      });
    } catch (error) {
      toast.add({ title: 'Couldn’t save', description: error instanceof Error ? error.message : String(error) });
    } finally {
      setSaving(false);
    }
  }

  async function copyForDesignMd() {
    try {
      await navigator.clipboard.writeText(designSnippet(theme));
      toast.add({
        title: 'Copied for DESIGN.md',
        description: 'Replace main and accent under colors: in DESIGN.md, then run npm run tokens.',
      });
    } catch {
      toast.add({ title: 'Couldn’t copy', description: 'Clipboard access was blocked by the browser.' });
    }
  }

  return (
    <Popover.Root>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <Popover.Trigger
              aria-label="Theme colors"
              className="grid size-11 place-items-center rounded-lg text-on-main-muted transition-colors hover:bg-on-main/10 hover:text-on-main data-popup-open:bg-on-main/10 data-popup-open:text-on-main"
            />
          }
        >
          <ColorWheelIcon aria-hidden className="size-[18px]" />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={6}>
            <Tooltip.Popup className={tooltipPopup}>Theme colors</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Popover.Portal>
        <Popover.Positioner sideOffset={10} align="end" collisionPadding={12} className="z-50">
          <Popover.Popup className="w-[22rem] max-w-[calc(100vw-1.5rem)] origin-[var(--transform-origin)] rounded-xl bg-white p-5 text-ink shadow-2xl shadow-black/25 ring-1 ring-black/10 transition-[scale,opacity] duration-150 ease-out-expo data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Popover.Title className="text-base font-bold tracking-tight font-stretch-semi-expanded">Theme</Popover.Title>
                <Popover.Description className="mt-1 text-sm leading-snug text-pretty text-muted">
                  Preview a main and an accent color. Every other shade is derived from them and checked for contrast. The site default lives in DESIGN.md.
                </Popover.Description>
              </div>
              <Popover.Close
                aria-label="Close"
                className="-mt-1 -mr-2 grid size-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-black/5 hover:text-ink"
              >
                <Cross2Icon aria-hidden />
              </Popover.Close>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <ColorField label="Main" value={theme.main} onChange={(main) => update({ ...theme, main })} />
              <ColorField label="Accent" value={theme.accent} onChange={(accent) => update({ ...theme, accent })} />
            </div>

            <SectionLabel>Presets</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {ALL_PRESETS.map((preset) => (
                <PresetButton
                  key={preset.name}
                  name={preset.name}
                  theme={preset.theme}
                  active={sameTheme(preset.theme, theme)}
                  onSelect={() => update(preset.theme)}
                />
              ))}
            </div>

            <SectionLabel>Generated palette</SectionLabel>
            <div className="space-y-2">
              <SwatchRow tokens={MAIN_TOKENS} palette={palette} />
              <SwatchRow tokens={ACCENT_TOKENS} palette={palette} />
            </div>

            <SectionLabel>Contrast</SectionLabel>
            <ul className="space-y-1.5">
              {contrastReport(palette).map(({ label, ratio }) => (
                <li key={label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted">{label}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs tabular-nums">{ratio.toFixed(1)}:1</span>
                    <Grade ratio={ratio} />
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex gap-2 border-t border-black/[0.08] pt-4">
              <button
                type="button"
                onClick={() => update(DESIGN_THEME)}
                disabled={sameTheme(theme, DESIGN_THEME)}
                className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-black/15 text-sm font-semibold transition-colors hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ResetIcon aria-hidden />
                Reset
              </button>
              {import.meta.env.DEV ? (
                <button
                  type="button"
                  onClick={saveToDesignMd}
                  disabled={saving || sameTheme(theme, DESIGN_THEME)}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-semibold text-on-accent transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <FileTextIcon aria-hidden />
                  {saving ? 'Saving…' : 'Save to DESIGN.md'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={copyForDesignMd}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-semibold text-on-accent transition-colors hover:bg-accent-600"
                >
                  <ClipboardCopyIcon aria-hidden />
                  Copy theme
                </button>
              )}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <p className="mt-5 mb-2 font-mono text-label-sm text-muted uppercase">{children}</p>;
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  const [draft, setDraft] = useState<string | null>(null); // non-null while the user is typing
  const shown = draft ?? value.toUpperCase();
  const invalid = draft !== null && parseHex(draft) === null;

  return (
    <Field.Root invalid={invalid} className="min-w-0">
      <Field.Label className="font-mono text-label-sm text-muted uppercase">{label}</Field.Label>
      <div className="mt-1.5 flex items-center gap-2">
        <label
          className="relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-full shadow-inner ring-1 ring-black/15 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent"
          style={{ backgroundColor: value }}
        >
          <span className="sr-only">Open {label.toLowerCase()} color picker</span>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
        <Field.Control
          value={shown}
          onFocus={() => setDraft(value.toUpperCase())}
          onBlur={() => setDraft(null)}
          onValueChange={(next) => {
            setDraft(next);
            const hex = parseHex(next);
            if (hex) onChange(hex);
          }}
          maxLength={7}
          spellCheck={false}
          autoComplete="off"
          className="h-9 w-full min-w-0 rounded-lg border border-black/15 bg-paper px-2.5 font-mono text-sm uppercase outline-none focus:border-accent-ink focus:ring-2 focus:ring-accent/30 data-invalid:border-red-600 data-invalid:ring-red-600/20"
        />
      </div>
      <Field.Error match={invalid} className="mt-1 text-xs text-red-700">
        Use a hex like #FC6A03
      </Field.Error>
    </Field.Root>
  );
}

function PresetButton({
  name,
  theme,
  active,
  onSelect,
}: {
  name: string;
  theme: ThemeInput;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={
          <button
            type="button"
            onClick={onSelect}
            aria-label={name}
            aria-pressed={active}
            className={cn(
              'size-8 rounded-full ring-1 ring-black/15 ring-offset-2 ring-offset-white transition-shadow',
              active && 'ring-2 ring-ink',
            )}
            style={{ background: `linear-gradient(135deg, ${theme.main} 50%, ${theme.accent} 50%)` }}
          />
        }
      />
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={6} className="z-[60]">
          <Tooltip.Popup className={tooltipPopup}>{name}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function SwatchRow({ tokens, palette }: { tokens: Token[]; palette: Palette }) {
  return (
    <ul className="grid grid-cols-10 gap-1">
      {tokens.map((token) => (
        <li key={token}>
          <Tooltip.Root>
            <Tooltip.Trigger
              render={
                <span
                  tabIndex={0}
                  aria-label={`${token} ${palette[token]}`}
                  className="block aspect-square w-full rounded-md ring-1 ring-black/10 ring-inset"
                  style={{ backgroundColor: palette[token] }}
                />
              }
            />
            <Tooltip.Portal>
              <Tooltip.Positioner sideOffset={6} className="z-[60]">
                <Tooltip.Popup className={tooltipPopup}>
                  {token} · {palette[token].toUpperCase()}
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </li>
      ))}
    </ul>
  );
}

function Grade({ ratio }: { ratio: number }) {
  const [label, tone] =
    ratio >= 7
      ? ['AAA', 'bg-emerald-100 text-emerald-800']
      : ratio >= 4.5
        ? ['AA', 'bg-emerald-100 text-emerald-800']
        : ratio >= 3
          ? ['Large', 'bg-amber-100 text-amber-800']
          : ['Fail', 'bg-red-100 text-red-800'];
  return <span className={cn('w-12 rounded px-1.5 py-0.5 text-center font-mono text-label-sm font-semibold', tone)}>{label}</span>;
}
