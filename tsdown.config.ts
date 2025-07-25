import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	clean: true,
	shims: true,
	outDir: 'dist',
	outputOptions: {
		banner: '#!/usr/bin/env node',
	},
})
