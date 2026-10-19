import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const git = (args, cwd = root) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
if (git(['status', '--porcelain'])) throw new Error('Commit the reviewed source and evidence before publishing, so the deployed version has an exact commit ID.');
const sourceCommit = git(['rev-parse', 'HEAD']);
const dist = join(root, 'dist');
if (!existsSync(join(dist, 'index.html'))) throw new Error('Build first with TWIN_BASE_PATH=/twin-web-concept npm run build.');
if (!readFileSync(join(dist, 'index.html'), 'utf8').includes('/twin-web-concept/_astro/')) throw new Error('The build does not use the GitHub Pages base path.');
const directory = mkdtempSync(join(tmpdir(), 'twin-preview-release-'));
try {
  git(['clone', '--quiet', '--single-branch', '--branch', 'twin-preview', 'https://github.com/AURRRUS/twin-web-concept.git', directory]);
  const previousCommit = git(['rev-parse', 'HEAD'], directory);
  const tracked = git(['ls-files', '-z'], directory).split('\0').filter(Boolean);
  // Only replace known generated output. Preserve other files and all remote history.
  for (const file of tracked) {
    if (/^(_astro\/|media\/|demo\/index\.html$|index\.html$|favicon\.svg$|\.nojekyll$|build-version\.json$)/.test(file)) {
      const target = resolve(directory, file);
      if (!target.startsWith(directory + '/')) throw new Error('Unsafe output path');
      rmSync(target, { force: true });
    }
  }
  cpSync(dist, directory, { recursive: true });
  writeFileSync(join(directory, '.nojekyll'), '');
  writeFileSync(join(directory, 'build-version.json'), JSON.stringify({ version: 'desktop-0.2', sourceCommit, builtAt: new Date().toISOString(), previousDeploymentCommit: previousCommit }, null, 2) + '\n');
  git(['add', '.'], directory);
  if (!git(['diff', '--cached', '--name-only'], directory)) { console.log('No deployment changes.'); process.exit(0); }
  git(['-c', 'user.name=Codex', '-c', 'user.email=codex@users.noreply.github.com', 'commit', '-m', `Publish Twin desktop ${sourceCommit.slice(0, 7)}`], directory);
  git(['push', 'origin', 'HEAD:twin-preview'], directory);
  console.log(JSON.stringify({ status: 'pushed', sourceCommit, deploymentCommit: git(['rev-parse', 'HEAD'], directory), site: 'https://aurrrus.github.io/twin-web-concept/', note: 'Pages deployment must finish; push alone is not an online readiness check.' }, null, 2));
} finally { rmSync(directory, { recursive: true, force: true }); }
