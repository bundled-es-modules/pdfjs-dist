import { originalExports, originalModule } from "../loaders/setup.js";
import "pdfjs-dist/build/pdf";

export default window.module.exports;
window.exports = originalExports;
window.module = originalModule;
