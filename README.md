# pdfjs-dist

This is a mirror of [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist), bundled and exposed as an ES module

## Install

```bash
npm install @bundled-es-modules/pdfjs-dist
```

## Use

```js
import pdfjs from "@bundled-es-modules/pdfjs-dist/build/pdf";
import viewer from "@bundled-es-modules/pdfjs-dist/web/pdf_viewer";

pdfjs.GlobalWorkerOptions.workerSrc =
  "@bundled-es-modules/pdfjs-dist/pdf.worker.js";

var url = "basicapi.pdf";
var loadingTask = pdfjs.getDocument(url);
//...
```

**Important**: Unlike in the original build, the `pdfjs.GlobalWorkerOptions.workerSrc` is mandatory. We recommend supplying the worker via [CDN](https://www.jsdelivr.com/package/npm/pdfjs-dist).

# Overview

### Structure

```
├── build/
│   ├── pdf.js                    - display layer
│   └── pdf.worker.js             - core layer
└── web/
    ├── pdf_viewer.js             - top-level viewer import, containing all necessary setup
    ├── module.js                 - pdf-viewer module, transformed from UMD to ESM
    └── util.js                   - utility module for setup
```

### Background

PDFJS is a library by Mozilla, created to facillitate client-side rendering of PDF documents.

Currently, the primary build for this project is provided as UMD-style modules at [pdfjs/pdfjs-dist](https://github.com/mozilla/pdfjs-dist).

_Support for es modules in the main project has been requested [here (#10317)](https://github.com/mozilla/pdf.js/issues/10317)_

### Building

```bash
npm run build
```
