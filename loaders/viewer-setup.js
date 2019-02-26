import pdfjs from "../pdf";

export const originalExports = window.exports;
export const originalModule = window.module;

window.exports = {};
window.module = { exports };
window["pdfjs-dist/build/pdf"] = pdfjs;
