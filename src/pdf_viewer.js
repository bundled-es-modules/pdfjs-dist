import { originalExports, originalModule } from "./viewer-setup";
import "pdfjs-dist/web/pdf_viewer.js";

export default window.module.exports;
window.exports = originalExports;
window.module = originalModule;
delete window["pdfjs-dist/build/pdf"];
