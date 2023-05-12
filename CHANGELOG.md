# Changelog

## [v3.6.172-alpha.1](https://github.com/bundled-es-modules/pdfjs-dist/releases/tag/v3.6.172-alpha.1)

- Major release, potentially w/ breaking changes
- See pdfjs release notes for releases _since_ the last one published herein. Pay particularly close attention to "major" and "breaking" annotated items, especialy in the first 3.x.x release below:
  - https://github.com/mozilla/pdf.js/releases/tag/v3.0.279
  - https://github.com/mozilla/pdf.js/releases/tag/v3.1.81
  - https://github.com/mozilla/pdf.js/releases/tag/v3.2.146
  - https://github.com/mozilla/pdf.js/releases/tag/v3.3.122
  - https://github.com/mozilla/pdf.js/releases/tag/v3.4.120
  - https://github.com/mozilla/pdf.js/releases/tag/v3.5.141
  - https://github.com/mozilla/pdf.js/releases/tag/v3.6.172
- Potentially breaking for typescript consumers: vending types
  - pdfjs dist has started vending types, those are re-exported here
- Stopped publishing `src/` and `demo` to npm

## [v2.16.106](https://github.com/bundled-es-modules/pdfjs-dist/releases/tag/v2.16.106)

- Equivalent to `v2.16.105`, corrects a problem w/ that relase: the `web/` folder is missing! The intent of this release is to _not_ cause breakages for consumers who may start receiving the incorrectly-published `v2.16.105` release. Oops!

## [v2.16.105](https://github.com/bundled-es-modules/pdfjs-dist/releases/tag/v2.16.105)

- Accidentally published a bundle which was missing some files

## [v2.16.105-alpha.1](https://github.com/bundled-es-modules/pdfjs-dist/releases/tag/v2.16.105-alpha.1)

- Ugraded to `pdfjs-dist` [v2.16.105](https://github.com/mozilla/pdf.js/releases/tag/v2.16.105)

### Changed

- Rollup, Rollup Plugins
  - Dependencies
    - `rollup` ~~`v1.x.x`~~ => `v3.x.x`
    - `@rollup/plugin-commonjs` -- replaces:
      - ~~`rollup-plugin-commonjs`~~
    - `@rollup/plugin-node-resolve` -- replaces:
      - ~~`rollup-plugin-node-resolve`~~
    - `rollup-plugin-polyfil-node` -- replaces:
      - ~~`rollup-plugin-node-builtins`~~
      - ~~`rollup-plugin-node-globals`~~
  - Build, `rollup.config.js` changed as appropriate
- Project type to `module`

### Added

- CHANGELOG.md
- `@web/dev-server` added to serve demo (which was improved very slightly)

## [v2.5.207](https://github.com/bundled-es-modules/pdfjs-dist/releases/tag/v2.5.207-rc1)

### Changed

- Ugraded to `pdfjs-dist` [v2.5.207](https://github.com/mozilla/pdf.js/releases/tag/v2.5.207)

## [v2.2.228](https://github.com/bundled-es-modules/pdfjs-dist/releases/tag/v2.2.228-alpha1)

### Changed

- Ugraded to `pdfjs-dist` [v2.5.207](https://github.com/mozilla/pdf.js/releases/tag/v2.2.228)

## [v2.1.266](https://github.com/bundled-es-modules/pdfjs-dist/releases/tag/v2.1.266)

- Ugraded to `pdfjs-dist` [v2.1.266](https://github.com/mozilla/pdf.js/releases/tag/v2.1.266)
