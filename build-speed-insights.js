import * as esbuild from 'esbuild';
import { promises as fs } from 'fs';

async function build() {
  try {
    // Bundle the speed insights module for browser
    await esbuild.build({
      entryPoints: ['speed-insights.js'],
      bundle: true,
      minify: true,
      format: 'iife',
      outfile: 'dist/speed-insights.min.js',
      platform: 'browser',
      target: 'es2015',
    });

    console.log('✓ Speed Insights bundle created successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
