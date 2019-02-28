/** The pdfjs global must be set before the viewer can be instantiated */
import pdfjs from "../build/pdf";
window["pdfjs-dist/build/pdf"] = pdfjs;

export default null;
