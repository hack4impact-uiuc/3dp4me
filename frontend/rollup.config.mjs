import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from "rollup-plugin-babel"
import image from '@rollup/plugin-image'
import json from '@rollup/plugin-json'

import postcss from "rollup-plugin-postcss";
import { terser } from 'rollup-plugin-terser';

// const extensions = ['.js', '.ts', '.jsx', '.tsx'];

export default {
  input: './src/index.tsx',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
  },
  plugins: [
    resolve({
      browser: true
    }),
    image(),
    json(),
    babel({ 
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react']
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
    }),
    postcss(),
    // terser(),
  ],
  external: ['react', 'react-dom'],
};