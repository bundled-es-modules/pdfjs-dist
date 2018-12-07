# pdfjs-dist

This is a mirror of [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist), bundled and exposed as an ES module

## Install

```bash
npm install @bundled-es-modules/pdfjs-dist
```

## Use

```html
<script type="module">
  import { pdfjs } from '@bundled-es-modules/pdfjs-dist/index.js';
  pdfjs.GlobalWorkerOptions.workerSrc = '@bundled-es-modules/pdfjs-dist/pdf.worker.js';
  var url = 'basicapi.pdf';
  var loadingTask = pdfjs.getDocument(url);
  //...
</script>
```

## Overview of this mirror repo

Rollup to bundle an es module out of `pdf.js`. The web worker, `pdf.worker.js`, is copied as-is from the original repo.

Support for es modules has been requested [here, #10317](https://github.com/mozilla/pdf.js/issues/10317)

### Building

```bash
npm run build
```
