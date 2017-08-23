import pkg from './package.json';

export default {
  plugins: [],
  external: ['kronos-interceptor', 'kronos-message'],
  input: pkg.module,

  output: {
    format: 'cjs',
    file: pkg.main
  }
};
