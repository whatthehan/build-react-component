import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import { RollupOptions } from 'rollup';
import { getBabelConfig } from './babel';

function rollup(): RollupOptions {
  const babelConfig = getBabelConfig('cjs');

  return {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'Component',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        antd: 'Antd',
      },
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true,
        // @ts-ignore
        use: {
          less: {
            javascriptEnabled: true,
          },
        },
      }),
      nodeResolve({
        mainFields: ['module', 'jsxnext:main', 'main'],
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
      }),
      babel({
        ...babelConfig,
        babelHelpers: 'runtime',
      }),
      commonjs({
        include: /node_modules/,
      }),
      typescript({ sourceMap: false }),
    ],
  };
}

export default rollup;
