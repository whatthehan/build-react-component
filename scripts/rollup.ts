import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import autoprefixer, { defaults } from 'autoprefixer';
import url from '@rollup/plugin-url';
import babel from '@rollup/plugin-babel';
import { getBabelConfig } from './babel';

function rollup() {
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
      url(),
      postcss({
        exact: true,
        // inject: false,
        // // modules: false,
        // // minimize: true,
        use: {
          less: {
            javascriptEnabled: true,
          },
        },
        plugins: [],
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
      typescript(),
    ],
  };
}

export default rollup;
