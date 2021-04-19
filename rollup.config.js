import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const getPlugins = () => {
  const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

  let plugins = [
    babel({
      exclude: ['node_modules/**'],
      babelHelpers: 'bundled'
    }),
    resolve(),
    commonjs({
      include: "node_modules/**"
    }),
    terser()
  ];

  if (env === 'development') {
    plugins = plugins.concat([
      serve({
        open: true,
        host: "localhost",
        port: 3000,
        contentBase: ["build"]
      }),
      livereload()
    ])
  }

  return plugins;
};

export default {
  input: 'src/index.js',
  output: {
    file: 'build/js/script.min.js',
    format: 'iife',
    sourcemap: 'inline'
  },
  plugins: getPlugins()
};
