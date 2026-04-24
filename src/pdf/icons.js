import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsPath = path.join(__dirname, "..", "..", "assets");

// loads an svg file and inlines the fill colors from <style>
function loadIcon(filename, heightPx = 36) {
  let svg = fs.readFileSync(path.join(assetsPath, filename), "utf8");
  svg = svg.replace(/<\?xml[^?]*\?>/g, "");

  // parse the style tag to get class -> fill mapping
  const classMap = {};
  const styleMatch = svg.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    const re = /\.([\w-]+)\s*\{\s*fill:\s*([^;}\s]+)\s*;?\s*\}/g;
    let m;
    while ((m = re.exec(styleMatch[1])) !== null) {
      classMap[m[1]] = m[2];
    }
    svg = svg.replace(/<style[\s\S]*?<\/style>/g, "");
    svg = svg.replace(/<defs>\s*<\/defs>/g, "");
  }

  // replace class="x" with fill="color"
  for (const cls of Object.keys(classMap)) {
    const re = new RegExp(`class="${cls}"`, "g");
    svg = svg.replace(re, `fill="${classMap[cls]}"`);
  }

  svg = svg.replace("<svg ", `<svg style="height:${heightPx}px;width:auto;" `);
  return svg;
}

// load all icons once at startup
export const icons = {
  licensed: loadIcon("icon_licensed.svg"),
  independent: loadIcon("icon_independent.svg"),
  international: loadIcon("icon_international.svg"),
  online: loadIcon("icon_online.svg"),
  efficient: loadIcon("icon_efficient.svg"),
  experienced: loadIcon("icon_experienced.svg"),
  documenting: loadIcon("icon_documenting.svg", 75),
  application: loadIcon("icon_application.svg", 75),
  completion: loadIcon("icon_completion.svg", 75),
};
