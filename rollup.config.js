const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

export default {
  input: 'src/index.js',
  output: [
    {
      format: 'es',
      file: 'dist/vue-wc-wrapper.js'
    },
    {
      format: 'iife',
      name: 'wrapVueWebComponent',
      file: 'dist/vue-wc-wrapper.global.js'
    }
  ],
  plugins: [
    babel({ include: 'src/**', plugins: [] }), // see .babelrc
    resolve(), // so Rollup can find node_modules
    commonjs() // so Rollup can convert `ms` to an ES module
  ]
}
