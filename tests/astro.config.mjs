import { defineConfig } from 'astro/config';
import production from '../astro.config.mjs';

// A separate source/output/cache tree. Production config never imports this file.
export default defineConfig({
  ...production,
  srcDir: './.qa/src',
  outDir: './.qa/dist',
  cacheDir: './.qa/cache',
});
