// public entry for the pdf module
// render a crm record into a pdf buffer
import { getBrowser } from "./browser.js";
import { buildHTML } from "./template.js";

export { closeBrowser } from "./browser.js";

export async function generatePdf(data) {
  const html = buildHTML(data);
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: "networkidle0" });
    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  } finally {
    await page.close();
  }
}
