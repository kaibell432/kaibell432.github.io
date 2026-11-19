import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { parseDocument, Scalar } from 'yaml';
import { parseHex } from './src/theme.ts';

/** Dev-only endpoint the theme picker posts `{ main, accent }` to (same path in ThemePicker.tsx). */
const DESIGN_THEME_ENDPOINT = '/__design-theme';

/**
 * Keep DESIGN.md's color list in step with its two inputs while `npm run dev` runs:
 *  - saving DESIGN.md re-runs `npm run tokens`, so editing `main` or `accent`
 *    rewrites every derived color in the file and hot-reloads the site;
 *  - the theme picker can POST a new pair to DESIGN_THEME_ENDPOINT, which writes
 *    it into the frontmatter and re-derives the list the same way.
 */
function designTokens(): Plugin {
  return {
    name: 'design-tokens',
    apply: 'serve',
    configureServer(server) {
      const root = server.config.root;
      const design = resolve(root, 'DESIGN.md');
      const log = server.config.logger;

      const sync = () =>
        new Promise<void>((done, fail) => {
          execFile(
            process.execPath,
            ['--experimental-strip-types', '--no-warnings', 'scripts/sync-tokens.ts'],
            { cwd: root },
            (error, stdout, stderr) => {
              if (error) {
                log.error(`[design-tokens] ${stderr || error.message}`);
                fail(new Error(stderr || error.message));
              } else {
                log.info(`[design-tokens] ${stdout.trim()}`);
                done();
              }
            },
          );
        });

      server.watcher.add(design);
      server.watcher.on('change', (file) => {
        if (resolve(file) === design) sync().catch(() => {});
      });

      server.middlewares.use(DESIGN_THEME_ENDPOINT, async (req, res) => {
        const reply = (status: number, body: object) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        };
        if (req.method !== 'POST') return reply(405, { error: 'POST only' });
        try {
          let raw = '';
          for await (const chunk of req) raw += chunk;
          const input = JSON.parse(raw || '{}');
          const main = parseHex(String(input.main ?? ''));
          const accent = parseHex(String(input.accent ?? ''));
          if (!main || !accent) return reply(400, { error: 'main and accent must be hex colors' });

          const source = await readFile(design, 'utf8');
          const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
          if (!match) return reply(500, { error: 'DESIGN.md has no frontmatter' });
          const doc = parseDocument(match[1]!);
          for (const [key, value] of [['main', main], ['accent', accent]] as const) {
            const node = new Scalar(value);
            node.type = Scalar.QUOTE_DOUBLE;
            doc.setIn(['colors', key], node);
          }
          await writeFile(design, source.replace(match[0], `---\n${doc.toString({ lineWidth: 0 }).trimEnd()}\n---\n`));
          await sync(); // derive the rest now so the reply means the whole list is current
          reply(200, { main, accent });
        } catch (error) {
          reply(500, { error: error instanceof Error ? error.message : String(error) });
        }
      });
    },
  };
}

// kaibell432.github.io is a user site, so it is served from the domain root.
export default defineConfig({
  plugins: [designTokens(), react(), tailwindcss()],
});
