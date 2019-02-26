import resolve from "rollup-plugin-node-resolve";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import commonjs from "rollup-plugin-commonjs";
import copy from "rollup-plugin-copy";

/**
 * Globals and Builtins needed
 *   url (imported by node_modules\pdfjs-dist\lib\display\node_stream.js,  commonjs-external:url)
 */

/**
 * Babel-core needed
 * babel-runtime/regenerator (imported by node_modules\pdfjs-dist\lib\display\node_stream.js, node_modules\pdfjs-dist\lib\display\fetch_stream.js, node_modules\pdfjs-dist\lib\display\network.js, node_modules\pdfjs-dist\lib\display\transport_stream.js, node_modules\pdfjs-dist\lib\shared\message_handler.js, node_modules\pdfjs-dist\lib\core\pdf_manager.js, node_modules\pdfjs-dist\lib\core\obj.js, node_modules\pdfjs-dist\lib\core\evaluator.js,  commonjs-external:babel-runtime/regenerator)
 */

/**
 * core-js needed
 * several in pdfjs-dist/lib/shared/compatibility.js
 */

export default [
  {
    input: "./src/pdf.js",
    output: {
      file: "./pdf.js",
      format: "es"
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      globals(),
      builtins()
    ]
  },
  {
    input: "./src/pdf_viewer.js",
    output: {
      file: "./pdf_viewer.js",
      format: "es"
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      globals(),
      builtins()
    ],
    external: id => id.includes("pdf.js")
  }
];
