import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import ignore from 'rollup-plugin-ignore';

/**
 * # Rollup configuration
 * 
 * ### pdf.js
 * 
 * - Transform UMD to ESM
 * - Resolve commonJS imports, **except**:
 * - Ignore `pdf.worker.js` import. This is very important, as it's conditionally required and is very large in size.
 * - Copy over all remaining files we wish to provide.
 * 
 * With `pdf.worker.js` ignored, pdfjs will expect a link to the file externally (see above)
 * 
 * ### pdf_viewer.js
 * 
 * - Transform UMD to ESM
 * - Resolve imports
 * - Ignore `pdf.js`. This is important, as we don't want to serve duplicates of pdfjs.
 * 
 * With `pdf.js` ignored, the viewer will expect to find a global pdfjs. This is circumvented by temporarily adding pdfjs to the global scope, 
 * and removed immediately after the viewer acquires a reference.
 */

export default [
  {
    input: './src/core/pdf.js',
    output: {
      file: './build/pdf.js',
      format: 'es'
    },
    plugins: [
      ignore(['./pdf.worker.js']),
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs({
        namedExports: {
          'node_modules/buffer/index.js': ['isBuffer'],
          'node_modules/process/browser.js': ['nextTick'],
          'node_modules/events/events.js': ['EventEmitter']
        }
      }),
      copy({
        targets: [
          {
            src: './node_modules/pdfjs-dist/build/pdf.worker.js',
            dest: './build/'
          },
          {
            src: './node_modules/pdfjs-dist/build/pdf.worker.min.js',
            dest: './build/'
          },
          {
            src: './node_modules/pdfjs-dist/build/pdf.worker.entry.js',
            dest: './build/'
          },
          {
            src: './node_modules/pdfjs-dist/build/pdf.worker.js.map',
            dest: './build/'
          },
          {
            src: './node_modules/pdfjs-dist/LICENSE',
            dest: './'
          }
        ]
      }),
      globals(),
      builtins()
    ]
  },
  {
    input: './src/viewer/module.js',
    output: {
      file: './web/module.js',
      format: 'es'
    },
    plugins: [
      ignore(['../build/pdf.js']),
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      copy({
        targets: [
          {
            src: './src/viewer/pdf_viewer.js',
            dest: './web/'
          },
          {
            src: './src/viewer/util.js',
            dest: './web/'
          }
        ]
      }),
      globals(),
      builtins()
    ]
  }
];
