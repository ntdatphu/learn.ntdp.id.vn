import { defineConfig } from 'astro/config';
import production from '../../astro.config.mjs';

// This source tree is never read by the production build.
export default defineConfig({
  ...production,
  srcDir: './.qa/visual/src',
  outDir: './.qa/visual/dist',
  cacheDir: './.qa/visual/cache',
});
