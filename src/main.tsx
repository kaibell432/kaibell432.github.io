import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/jetbrains-mono';
import './index.css';
import { App } from './App';
import { DESIGN_THEME } from './design-tokens';
import { installInPageLinks } from './hooks';
import { applyPalette, derivePalette, loadTheme } from './theme';

// Dev only: re-apply the theme picker's unsaved preview before the first render.
// Production always ships the DESIGN.md palette from tokens.css.
if (import.meta.env.DEV) {
  const saved = loadTheme(DESIGN_THEME);
  if (saved !== DESIGN_THEME) applyPalette(derivePalette(saved));
}

installInPageLinks();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
