// small html building blocks used in the pdf template
import { icons } from "./icons.js";

const ORANGE = "#E06020";
const BOX_BORDER = "#E8A890";

export function infoBar(date, preparedBy, customer) {
  return `
  <div style="display:flex;margin-bottom:5mm;">
    <div style="flex:1;padding:4px 8px 4px 0;">
      <div style="font-size:12px;color:${ORANGE};margin-bottom:3px;">Date:</div>
      <div style="font-size:12.5px;font-weight:600;text-align:center;">${date}</div>
    </div>
    <div style="flex:1;padding:4px 8px;">
      <div style="font-size:12px;color:${ORANGE};border-left:4px solid ${ORANGE};margin-bottom:3px;padding:4px 8px 4px 8px;">Prepared by:</div>
      <div style="font-size:12.5px;font-weight:600;text-align:center;">${preparedBy}</div>
    </div>
    <div style="flex:1;padding:4px 8px;">
      <div style="font-size:12px;color:${ORANGE};border-left:4px solid ${ORANGE};margin-bottom:3px;padding:4px 8px 4px 8px;">Customer name:</div>
      <div style="font-size:12.5px;font-weight:600;text-align:center;">${customer}</div>
    </div>
  </div>`;
}

export function box(content) {
  return `<div style="border:2px solid ${BOX_BORDER};border-radius:8px;padding:9px 13px;margin-bottom:4mm;">${content}</div>`;
}

export function boxHdr(text, italic = false) {
  const italicStyle = italic ? "font-style:italic;" : "";
  return `<div style="font-weight:900;text-decoration:underline;${italicStyle}margin-bottom:7px;font-size:13px;">${text}</div>`;
}

export function row(left, right, opts = {}) {
  const bold = opts.bold || false;
  const topBorder = opts.topBorder || false;
  const orangeText = opts.orangeText || false;
  const tab = opts.tab || false;

  const leftStyle = tab ? "width:50%;flex-shrink:0;font-weight:700;" : "font-weight:700;";
  const flexStyle = tab ? "" : "justify-content:space-between;";

  let style = `display:flex;${flexStyle}align-items:baseline;padding:2px 0;font-size:13px;`;
  if (bold) style += "font-weight:800;";
  if (topBorder) style += "border-top:2px solid #333;margin-top:3px;padding-top:4px;";
  if (orangeText) style += `color:${ORANGE};font-style:italic;`;

  return `<div style="${style}">
    <span style="${leftStyle}">${left}</span><span style="white-space:nowrap;">${right}</span>
  </div>`;
}

export function hint(text) {
  return `<span style="font-size:10px;color:${ORANGE};font-weight:400;">${text}</span>`;
}

export function iconCell(svg, label) {
  return `<div style="display:flex;flex-direction:column;align-items:center;padding:12px 5px;text-align:center;color:${ORANGE};">
    <div style="height:38px;display:flex;align-items:center;justify-content:center;margin-bottom:5px;">${svg}</div>
    <div style="font-size:11px;font-weight:700;color:${ORANGE};">${label}</div>
  </div>`;
}

export function nextSteps() {
  const cell = (icon, label, desc) => `
    <div style="flex:1;text-align:center;padding:10px 14px;">
      <div style="display:flex;align-items:center;justify-content:center;margin:0 auto 8px;">${icon}</div>
      <div style="font-size:13px;font-weight:800;color:${ORANGE};margin-bottom:4px;">${label}</div>
      <div style="font-size:11px;color:${ORANGE};">${desc}</div>
    </div>`;
  const sep = `<div style="width:2px;background:${ORANGE};flex-shrink:0;"></div>`;

  return `<div style="display:flex;margin-top:4mm;">
    ${cell(icons.documenting, "Documenting Process", "Depending on the tax residence, documents will be required")}
    ${sep}
    ${cell(icons.application, "Mortgage Application", "We put various banks in competition to ensure the best terms possible")}
    ${sep}
    ${cell(icons.completion, "Completion Process", "We coordinate completion with all parts to ensure a smooth process")}
  </div>`;
}

export { ORANGE, BOX_BORDER };
