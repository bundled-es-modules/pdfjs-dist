export const originalExports = window.exports;
export const originalModule = window.module;
window.exports = {};
window.module = { exports };
