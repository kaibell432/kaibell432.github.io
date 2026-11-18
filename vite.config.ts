import { execFile } from 'node:child_process';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Re-run `npm run tokens` when DESIGN.md changes, so its colors hot-reload in dev. */
function designTokens(): Plugin {
  return {
    name: 'design-tokens',
    apply: 'serve',
    configureServer(server) {
      const design = resolve(server.config.root, 'DESIGN.md');
      server.watcher.add(design);
      server.watcher.on('change', (file) => {
        if (resolve(file) !== design) return;
        execFile(
          process.execPath,
          ['--experimental-strip-types', '--no-warnings', 'scripts/sync-tokens.ts'],
          { cwd: server.config.root },
          (error, stdout, stderr) => {
            if (error) server.config.logger.error(`[design-tokens] ${stderr || error.message}`);
            else server.config.logger.info(`[design-tokens] ${stdout.trim()}`);
          },
        );
      });
    },
  };
}

// kaibell432.github.io is a user site, so it is served from the domain root.
export default defineConfig({
  plugins: [designTokens(), react(), tailwindcss()],
});
