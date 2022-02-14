import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [{
	input: 'src/browser.ts',
	output: [
		{
			file: 'dist/bundle.esm.js',
			format: 'es'
		},
		{
			file: 'dist/bundle.amd.js',
			format: 'amd',
		},
	],
    // for d.ts use tsconfig option
	plugins: [typescript({ tsconfig: './tsconfig.json' }), nodeResolve()]
},
{
	input: 'src/node.ts',
	output: [
		{
			file: 'dist/bundle.node.js',
			format: 'es',
			name: 'run-tests-bundle'
		}
	],
	plugins: [typescript({ tsconfig: './tsconfig.json' }), nodeResolve(), commonjs()]
},
{
	input: 'tests/browser/run.mjs',
	output: [
		{
			file: 'tests/browser/run-bundle.mjs',
			format: 'iife',
		}
	],
	plugins: [nodeResolve(), commonjs(), json()]
}];
