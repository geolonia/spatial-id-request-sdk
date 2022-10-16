import fs from 'node:fs';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

const packageJson = JSON.parse(fs.readFileSync('./package.json'));

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'umd',
      sourcemap: true,
      name: 'SpatialIdRequest',
      globals: {
        'cross-fetch': 'window.fetch',
      }
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: [
    ...Object.keys(packageJson.dependencies || {}),
  ],
  plugins: [
    commonjs({
      requireReturnsDefault: "auto",
    }),
    resolve(),
    json(),
    typescript({ useTsconfigDeclarationDir: true }),
    // terser(),
  ],
};
export default config;
