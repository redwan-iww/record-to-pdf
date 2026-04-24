// CLI: reads data.json and writes output.pdf
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generatePdf, closeBrowser } from "./src/pdf/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dataPath = process.argv[2] || path.join(__dirname, "data.json");
const outPath = process.argv[3] || path.join(__dirname, "output.pdf");

async function main() {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const buf = await generatePdf(data);
  fs.writeFileSync(outPath, buf);
  console.log("Generated:", outPath);
  await closeBrowser();
}

main().catch(async (err) => {
  console.error(err);
  await closeBrowser();
  process.exit(1);
});
