'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ORANGE = '#E06020';
const BOX_BORDER = '#C0A888';

const LOGO_SVG_RAW = `<svg xmlns="http://www.w3.org/2000/svg" width="156.678" height="31.352" viewBox="0 0 156.678 31.352"><g id="isologotipo_horizontal_d" transform="translate(0 -0.01)"><path d="M145.794,29.626a5.98,5.98,0,0,1,1.546,4.473v7.738h-3.918V34.7a3.517,3.517,0,0,0-.7-2.4,2.589,2.589,0,0,0-2.036-.792,3.12,3.12,0,0,0-2.362.918,3.8,3.8,0,0,0-.881,2.726v6.692h-3.92V22.24h3.915v7.486a5.227,5.227,0,0,1,1.884-1.189,6.833,6.833,0,0,1,2.413-.414A5.56,5.56,0,0,1,145.794,29.626Z" transform="translate(-110.007 -18.313)" fill="#333"/><path d="M231.825,24.981a2.129,2.129,0,0,1-.107-3.01h0q.049-.055.106-.106a2.5,2.5,0,0,1,1.761-.627,2.548,2.548,0,0,1,1.761.6,1.937,1.937,0,0,1,.678,1.507,2.14,2.14,0,0,1-.678,1.62,2.465,2.465,0,0,1-1.761.641,2.5,2.5,0,0,1-1.759-.629Zm-.2,2.511h3.92V41.01h-3.927Z" transform="translate(-190.441 -17.486)" fill="#333"/><path d="M289.907,56.476a6.229,6.229,0,0,1,2.425,2.437,8.048,8.048,0,0,1,0,7.312,6.218,6.218,0,0,1-2.425,2.437,6.884,6.884,0,0,1-3.429.866,5.224,5.224,0,0,1-4.072-1.632v9.265H278.49V55.81h3.744v1.559a5.2,5.2,0,0,1,4.248-1.761A6.868,6.868,0,0,1,289.907,56.476ZM288.274,65.3a4.327,4.327,0,0,0,0-5.452,3.522,3.522,0,0,0-4.95,0,4.327,4.327,0,0,0,0,5.452A3.522,3.522,0,0,0,288.274,65.3Z" transform="translate(-229.447 -45.805)" fill="#333"/><path d="M376.573,68.689a6.62,6.62,0,0,1-2.642-2.476,7.234,7.234,0,0,1,0-7.185,6.606,6.606,0,0,1,2.642-2.465,8.64,8.64,0,0,1,7.65,0,6.643,6.643,0,0,1,2.642,2.465,7.234,7.234,0,0,1,0,7.185,6.657,6.657,0,0,1-2.642,2.476A8.65,8.65,0,0,1,376.573,68.689Zm6.306-3.346a4.327,4.327,0,0,0,0-5.452,3.268,3.268,0,0,0-2.465-1.018,3.307,3.307,0,0,0-2.488,1.018,4.284,4.284,0,0,0,0,5.452,3.307,3.307,0,0,0,2.488,1.018,3.27,3.27,0,0,0,2.465-1.014Z" transform="translate(-307.294 -45.856)" fill="#333"/><path d="M474.987,41.184a4.015,4.015,0,0,1-1.419.641,7.151,7.151,0,0,1-1.772.213,5.263,5.263,0,0,1-3.732-1.233,4.7,4.7,0,0,1-1.319-3.617V31.637H464.66V28.37h2.085V22.24h3.918v6.13h3.367v3.267h-3.367v5.5a1.839,1.839,0,0,0,.44,1.319,1.632,1.632,0,0,0,1.243.465,2.525,2.525,0,0,0,1.585-.5Z" transform="translate(-382.831 -18.313)" fill="#333"/><path d="M543.58,63.7H533.356a3.17,3.17,0,0,0,1.3,1.985,4.328,4.328,0,0,0,2.564.729,5.181,5.181,0,0,0,1.872-.322,4.514,4.514,0,0,0,1.52-.991l2.085,2.261a7.018,7.018,0,0,1-5.577,2.185,8.835,8.835,0,0,1-4.05-.891,6.552,6.552,0,0,1-2.714-2.476,6.818,6.818,0,0,1-.954-3.593,6.9,6.9,0,0,1,.94-3.573,6.574,6.574,0,0,1,2.587-2.485,8.014,8.014,0,0,1,7.275-.039,6.257,6.257,0,0,1,2.524,2.45,7.274,7.274,0,0,1,.918,3.7C543.654,62.686,543.631,63.042,543.58,63.7Zm-9.17-4.346a3.2,3.2,0,0,0-1.106,2.06h6.659a3.232,3.232,0,0,0-1.106-2.048,3.305,3.305,0,0,0-2.21-.766A3.372,3.372,0,0,0,534.411,59.349Z" transform="translate(-436.175 -45.825)" fill="#333"/><path d="M632.684,36.536,630.8,38.4v3.443h-3.92V22.24h3.92V33.747l5.729-5.428H641.2l-5.635,5.729,6.127,7.789h-4.755Z" transform="translate(-516.484 -18.313)" fill="#333"/><path d="M727.9,63.654H717.669a3.17,3.17,0,0,0,1.307,1.985,4.325,4.325,0,0,0,2.562.729,5.163,5.163,0,0,0,1.869-.322,4.5,4.5,0,0,0,1.52-.991l2.085,2.261a7.018,7.018,0,0,1-5.577,2.185,8.835,8.835,0,0,1-4.05-.891,6.553,6.553,0,0,1-2.714-2.476,6.818,6.818,0,0,1-.954-3.593,6.9,6.9,0,0,1,.942-3.58,6.6,6.6,0,0,1,2.587-2.487,8.015,8.015,0,0,1,7.275-.039,6.261,6.261,0,0,1,2.525,2.45,7.316,7.316,0,0,1,.918,3.7C727.971,62.649,727.945,63,727.9,63.654Zm-9.172-4.346a3.213,3.213,0,0,0-1.106,2.06h6.659a3.232,3.232,0,0,0-1.106-2.048,3.305,3.305,0,0,0-2.21-.766A3.372,3.372,0,0,0,718.724,59.308Z" transform="translate(-588.027 -45.784)" fill="#333"/><path d="M823.493,57.133a5.986,5.986,0,0,1,1.546,4.473v7.738h-3.92V62.209a3.518,3.518,0,0,0-.7-2.4,2.587,2.587,0,0,0-2.034-.792,3.113,3.113,0,0,0-2.361.918,3.816,3.816,0,0,0-.881,2.726v6.692H811.22V55.827h3.742v1.585a5.207,5.207,0,0,1,1.937-1.319,6.725,6.725,0,0,1,2.538-.465A5.539,5.539,0,0,1,823.493,57.133Z" transform="translate(-668.361 -45.821)" fill="#333"/><rect width="19.595" height="3.917" transform="translate(0 27.445)" fill="#e67039"/><path d="M15.673,4.559l-.828-.641L12.988,2.478l-1.233-.96L9.8,0h0L7.84,1.518,6.607,2.48,4.755,3.92l-.824.637L0,7.6V23.515H19.6V7.6Zm0,15.038H3.918V9.518l2.166-1.68,1.761-1.36,1.96-1.52,1.949,1.522,1.75,1.358,2.168,1.684Z" transform="translate(0 0.01)" fill="#e67039"/></g></svg>`;

function loadIcon(filename) {
  let svg = fs.readFileSync(path.join(__dirname, filename), 'utf8');
  svg = svg.replace(/<style[\s\S]*?<\/style>/g, '');
  svg = svg.replace(/class="st0"/g, 'fill="currentColor"');
  svg = svg.replace('<svg ', '<svg style="height:36px;width:auto;" ');
  return svg;
}

const ICON_LICENSED      = loadIcon('icon_licensed.svg');
const ICON_INDEPENDENT   = loadIcon('icon_independent.svg');
const ICON_INTERNATIONAL = loadIcon('icon_international.svg');
const ICON_ONLINE        = loadIcon('icon_online.svg');
const ICON_EFFICIENT     = loadIcon('icon_efficient.svg');
const ICON_EXPERIENCED   = loadIcon('icon_experienced.svg');

function logo(height) {
  const w = Math.round(height * (156.678 / 31.352));
  return LOGO_SVG_RAW
    .replace('width="156.678" height="31.352"', `width="${w}" height="${height}"`);
}

function fmt(n) {
  const num = Number(n);
  if (isNaN(num) || num === 0) return '€ 0';
  return '€ ' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pct(n) {
  return Number(n) + '%';
}

function fmtDate(iso) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}-${mm}-${d.getFullYear()}`;
}

function customerName(name) {
  const idx = name.indexOf('€');
  return (idx > 0 ? name.slice(0, idx) : name.split(/\s+/).slice(0, 2).join(' ')).trim();
}


function infoBar(date, preparedBy, customer) {
  return `
  <div style="display:flex;border-top:2px solid ${ORANGE};margin-bottom:5mm;">
    <div style="flex:1;padding:4px 8px 4px 0;">
      <div style="font-size:9px;color:${ORANGE};margin-bottom:3px;">Date:</div>
      <div style="font-size:12.5px;font-weight:600;">${date}</div>
    </div>
    <div style="flex:1;border-left:2px solid ${ORANGE};padding:4px 8px;">
      <div style="font-size:9px;color:${ORANGE};margin-bottom:3px;">Prepared by:</div>
      <div style="font-size:12.5px;font-weight:600;">${preparedBy}</div>
    </div>
    <div style="flex:1;border-left:2px solid ${ORANGE};padding:4px 8px;">
      <div style="font-size:9px;color:${ORANGE};margin-bottom:3px;">Customer name:</div>
      <div style="font-size:12.5px;font-weight:600;">${customer}</div>
    </div>
  </div>`;
}

function box(content) {
  return `<div style="border:2px solid ${BOX_BORDER};border-radius:8px;padding:9px 13px;margin-bottom:4mm;">${content}</div>`;
}

function boxHdr(text, italic = false) {
  return `<div style="font-weight:700;text-decoration:underline;${italic ? 'font-style:italic;' : ''}margin-bottom:7px;font-size:13px;">${text}</div>`;
}

function row(left, right, opts = {}) {
  const { bold = false, topBorder = false, orangeText = false } = opts;
  return `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:2px 0;font-size:13px;${bold ? 'font-weight:700;' : ''}${topBorder ? `border-top:2px solid #333;margin-top:3px;padding-top:4px;` : ''}${orangeText ? `color:${ORANGE};font-style:italic;` : ''}">
    <span>${left}</span><span style="white-space:nowrap;">${right}</span>
  </div>`;
}

function hint(text) {
  return `<span style="font-size:10px;color:${ORANGE};font-weight:400;">${text}</span>`;
}

function iconCell(svgContent, label) {
  return `<div style="display:flex;flex-direction:column;align-items:center;padding:12px 5px;text-align:center;color:${ORANGE};">
    <div style="height:38px;display:flex;align-items:center;justify-content:center;margin-bottom:5px;">${svgContent}</div>
    <div style="font-size:11px;font-weight:700;color:${ORANGE};">${label}</div>
  </div>`;
}

function nextSteps() {
  const cell = (icon, label, desc) => `
    <div style="flex:1;text-align:center;padding:10px 14px;">
      <div style="width:70px;height:70px;border-radius:50%;background:${ORANGE};display:flex;align-items:center;justify-content:center;margin:0 auto 8px;">
        ${icon}
      </div>
      <div style="font-size:13px;font-weight:800;color:${ORANGE};margin-bottom:4px;">${label}</div>
      <div style="font-size:11px;color:${ORANGE};">${desc}</div>
    </div>`;
  const sep = `<div style="width:2px;background:${ORANGE};flex-shrink:0;"></div>`;
  return `<div style="display:flex;margin-top:4mm;">
    ${cell(`<i class="fas fa-clipboard-list" style="color:white;font-size:30px;"></i>`, 'Documenting Process', 'Depending on the tax residence, documents will be required')}
    ${sep}
    ${cell(`<span style="color:white;font-size:36px;font-weight:900;line-height:1;">?</span>`, 'Mortgage Application', 'We put various banks in competition to ensure the best terms possible')}
    ${sep}
    ${cell(`<i class="fas fa-camera" style="color:white;font-size:28px;"></i>`, 'Completion Process', 'We coordinate completion with all parts to ensure a smooth process')}
  </div>`;
}

function buildHTML(d) {
  const date = fmtDate(d.Created_Time);
  const by = d.Owner.name;
  const cust = customerName(d.Name);

  const poaFee = d.Power_of_Attorney_or_NIE ? (d.Power_of_Attorney_NIE || 0) : 0;
  const solicitorFee = d.Lawyer || 0;
  const buyerPct = d.Buyer_Agent1 ? (d.Buyer_Agent || 0) : 0;
  const buyerFee = d.Buyer_Agent_Fee || 0;
  const mortgageCosts = (d.Broker_fees || 0) + (d.Valuation_Costs || 0);

  const centeredLogo = logo(28);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Nunito',Arial,sans-serif; font-size:13.5px; font-weight:500; color:#1a1a1a; background:white; }
  .page {
    width:210mm; height:297mm;
    padding:14mm 17mm 12mm;
    overflow:hidden; position:relative;
    break-after:page; page-break-after:always;
  }
  .page:last-child { break-after:auto; page-break-after:auto; }
  .page-num { position:absolute; bottom:8mm; right:17mm; font-size:16px; font-weight:700; }
  .main-title { font-size:30px; font-weight:800; color:${ORANGE}; }
  .sec-title { font-size:23px; font-weight:800; color:${ORANGE}; margin:4mm 0 3mm; }
  .sub-title { font-size:17px; font-weight:800; color:${ORANGE}; margin:3mm 0 2mm; }
  .icon-grid {
    display:grid; grid-template-columns:1fr 1fr 1fr;
    border:2px solid ${ORANGE};
  }
  .icon-grid > div + div { border-left:2px solid ${ORANGE}; }
  .icon-grid > div:nth-child(n+4) { border-top:2px solid ${ORANGE}; }
  .icon-grid > div:nth-child(4) { border-left:none; }
</style>
</head>
<body>

<!-- ═══════════════════ PAGE 1 ═══════════════════ -->
<div class="page">

  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:3mm;">
    <div class="main-title">Personal Mortgage Simulation</div>
    <div style="padding-top:4px;">${logo(38)}</div>
  </div>

  ${infoBar(date, by, cust)}

  <div class="sec-title">Briefing:</div>

  ${box(`
    ${boxHdr('Your property purchase:')}
    ${row('Price:', fmt(d.Property_Price))}
    ${row('Area:', d.Area)}
    ${row('Status:', d.Status)}
    ${row('Type of property:', d.PropertySalesType)}
  `)}

  ${box(`
    ${boxHdr('Your potential mortgage:')}
    ${row('Loan to Value:', pct(d.LTV))}
    ${row('Resulting mortgage:', fmt(d.Resulting_Mortgage))}
    ${row('Mortgage term:', d.Mortgage_term_Years + ' yrs')}
  `)}

  ${box(`
    <div style="font-weight:700;text-decoration:underline;margin-bottom:6px;display:flex;align-items:baseline;gap:6px;">
      Monthly Repayment Estimation: ${hint('(See page 2 for more details)')}
    </div>
    <div style="display:flex;border-top:1px solid #ccc;margin-top:4px;">
      <div style="flex:1;text-align:center;padding:8px;">
        <div style="font-size:12px;">Fixed: <span style="color:${ORANGE};font-size:11px;">(Section A)</span></div>
        <div style="font-size:15px;font-weight:700;margin-top:7px;">${fmt(d.Monthly_payments_fixed_mortgage)}</div>
      </div>
      <div style="flex:1;text-align:center;padding:8px;border-left:2px solid ${BOX_BORDER};">
        <div style="font-size:12px;">Variable: <span style="color:${ORANGE};font-size:11px;">(Section B)</span></div>
        <div style="font-size:15px;font-weight:700;margin-top:7px;">${fmt(d.Monthly_payments_variable_interest)}</div>
      </div>
      <div style="flex:1;text-align:center;padding:8px;border-left:2px solid ${BOX_BORDER};">
        <div style="font-size:12px;">Mixed: <span style="color:${ORANGE};font-size:11px;">(Section B)</span></div>
        <div style="font-size:15px;font-weight:700;margin-top:7px;">${fmt(d.Monthly_Payments_fixed_rate)}</div>
      </div>
    </div>
  `)}

  ${box(`
    ${boxHdr('Key figures:')}
    ${row('<strong>Property purchase price</strong>', `<strong>${fmt(d.Property_Price)}</strong>`)}
    ${row(`Estimated purchase costs &nbsp;${hint('(See page 3, section C, for more details)')}`, fmt(d.Estimated_purchase_Costs))}
    ${row(`Mortgage costs &nbsp;${hint('(See page 3, section D, for more details)')}`, fmt(mortgageCosts))}
    ${row('<u>Estimated Total Cost of your purchase</u>', fmt(d.TOTAL_Amount_needed), { bold: true, topBorder: true })}
    ${row('Mortgage contribution', fmt(d.Resulting_Mortgage))}
    ${row('<u>Savings needed</u>', fmt(d.TOTAL_Savings_needed), { bold: true, topBorder: true })}
  `)}

  <div style="text-align:center;font-size:19px;font-weight:800;color:${ORANGE};margin:4mm 0 3mm;">Why use Hipoteken?</div>
  <div class="icon-grid">
    ${iconCell(ICON_LICENSED, 'Licensed')}
    ${iconCell(ICON_INDEPENDENT, 'Independent')}
    ${iconCell(ICON_INTERNATIONAL, 'International')}
    ${iconCell(ICON_ONLINE, 'Online')}
    ${iconCell(ICON_EFFICIENT, 'Efficient')}
    ${iconCell(ICON_EXPERIENCED, 'Experienced')}
  </div>

  <div class="page-num">1</div>
</div>

<!-- ═══════════════════ PAGE 2 ═══════════════════ -->
<div class="page">

  <div style="text-align:center;margin-bottom:2mm;">
    ${centeredLogo}
    <div class="main-title">Personal Mortgage Simulation</div>
  </div>

  ${infoBar(date, by, cust)}

  <div class="sec-title">Monthly Repayment Estimations:</div>

  <div class="sub-title">Section A:</div>

  ${box(`
    ${boxHdr('OPTION 1 - Fixed interest mortgage:', true)}
    ${row('Average interest rate offered by banks', pct(d.Fixed_interest_rate_fixed_mortgage))}
    ${row('Resulting monthly repayment', fmt(d.Monthly_payments_fixed_mortgage), { bold: true, topBorder: true })}
    <div style="font-size:11px;font-style:italic;margin-top:5px;line-height:1.55;color:#222;">
      <div>Early repayment fee ranges between 2% and 0%</div>
      <div>Depending on your specific country of income/tax residency a fixed interest mortgage will be possible or not</div>
      <div>Sometimes only variable interest mortgages are available</div>
      <div><strong>Both options consider contracting certain combined products to reach these rates</strong></div>
    </div>
  `)}

  <div class="sub-title">Section B:</div>

  ${box(`
    ${boxHdr('OPTION 2 - Variable and Mixed Interest mortgage:', true)}

    <div style="margin-bottom:8px;">
      <div style="font-size:13px;margin-bottom:3px;"><strong>Fixed interest period</strong> - <em>depending on the bank, they offer between 1 and 5 years of fixed interests</em></div>
      ${row('Average interest rate during initial fixed interest period', pct(d.Fixed_interest_rate_Av))}
      ${row('Resulting monthly repayment during variable period', fmt(d.Monthly_Payments_fixed_rate), { bold: true, topBorder: true })}
    </div>

    <div>
      <div style="font-size:13px;margin-bottom:3px;"><strong>Variable interest period</strong> - <em>the rest of the mortgage term the interest rate is indexed to Euribor</em></div>
      ${row('Euribor is the reference interest rate. Its actual value is', pct(d.EURIBOR_12M_F), { orangeText: true })}
      ${row('Average Spread banks offer on variable interest rate principle', pct(d.Spread))}
      ${row('Resulting interest rate during variable interest period', pct(d.Variable_interest_rate))}
      ${row('Resulting monthly repayment during variable period', fmt(d.Monthly_payments_variable_interest), { bold: true, topBorder: true })}
      <div style="font-size:11px;font-style:italic;margin-top:4px;color:#333;">Early repayment fee of between 0.25% and 0%</div>
    </div>
  `)}

  <div style="text-align:center;font-size:19px;font-weight:800;color:${ORANGE};margin:4mm 0 2mm;">Next Steps</div>
  ${nextSteps()}

  <div class="page-num">2</div>
</div>

<!-- ═══════════════════ PAGE 3 ═══════════════════ -->
<div class="page">

  <div style="text-align:center;margin-bottom:2mm;">
    ${centeredLogo}
    <div class="main-title">Personal Mortgage Simulation</div>
  </div>

  ${infoBar(date, by, cust)}

  <div class="sub-title">Section C:</div>

  ${box(`
    <div style="font-weight:700;text-decoration:underline;margin-bottom:7px;">
      Cost of purchase
      <span style="font-style:italic;font-weight:400;font-size:11px;"> (estimated, please check with your solicitor as will be the best to calculate this):</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding:2px 0;font-size:12px;">
      <span>Transfer tax/ VAT &nbsp;&nbsp;<span style="margin-left:4px;">${pct(d.Transfer_TAX_VAT)}</span></span>
      <span style="white-space:nowrap;">${fmt(d.Transfer_TAX_VAT1)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding:2px 0;font-size:12px;">
      <span>Stamp duty &nbsp;&nbsp;<span style="margin-left:4px;">${pct(d.Stamp_Duty)}</span></span>
      <span style="white-space:nowrap;">${fmt(d.Stamp_Duty2)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding:2px 0;font-size:12px;">
      <span>Buyer agent fee &nbsp;&nbsp;<span style="margin-left:4px;">${pct(buyerPct)}</span></span>
      <span style="white-space:nowrap;">${fmt(buyerFee)}</span>
    </div>
    ${row('Solicitor fees', fmt(solicitorFee))}
    ${row('Power of Attorney & NIE', fmt(poaFee))}
    ${row('Land registry', fmt(d.Land_Registry))}
    ${row('Notary fees', fmt(d.Notary_Cost))}
    ${row('Registration & admin costs', fmt(d.Admin_Costs))}
    ${row('Banker´s Draft Commission', fmt(d.Bank_s_Draft_Commision))}
    ${row('1st year´s home insurance', fmt(d.Home_Insurance))}
    ${row('<u>Estimated purchase cost</u>', fmt(d.Estimated_purchase_Costs), { bold: true, topBorder: true })}
  `)}

  <div class="sub-title">Section D:</div>

  ${box(`
    ${boxHdr('Mortgage costs:')}
    <div style="display:flex;justify-content:space-between;padding:2px 0;font-size:12px;">
      <span>Bank set up fee (depending on the bank, a small fee can apply)</span><span></span>
    </div>
    ${row('Broker fee - % over final mortgage or min. fee', fmt(d.Broker_fees))}
    ${row('Property Valuation', fmt(d.Valuation_Costs))}
    <div style="display:flex;justify-content:space-between;padding:2px 0;font-size:12px;">
      <span>Life insurance (sometimes required at additional cost)</span><span></span>
    </div>
    ${row('<u>Estimated mortgage costs</u>', fmt(mortgageCosts), { bold: true, topBorder: true })}
    <div style="font-size:11px;font-style:italic;margin-top:4px;color:#444;">Bank set up fee or life insurance costs would be on top of this, although in most they don´t apply</div>
  `)}

  <div style="background:#f0e0d0;border-radius:4px;padding:8px 12px;margin-bottom:3mm;font-size:11px;line-height:1.45;">
    <strong>Hipoteken International Mortgages</strong> is a commercial brand, registered by Hipoteken S.L., a registered company in Spain, with registation number ESB06838445, and registered address Calle Serrano Morales 11, 4, 46004 Valencia, Spain. You can check our mortgage broker registration with the bank of Spain and legal information here.
  </div>

  <div style="text-align:center;margin:3mm 0 2mm;font-size:11px;color:${ORANGE};font-weight:600;">
    https://hipoteken.com/legal-mortgage-regulation
  </div>

  <div style="font-style:italic;font-size:10.5px;text-align:center;line-height:1.45;color:#444;">
    Disclaimer - simulation supplied for orientative purposes only. Conditions of final mortgage offers can change
    depending on financial market situation, risk assesment, property area, type and real estate market conditions, and
    many other factors each bank considers differently. The material contained within all of our marketing material has
    been prepared for information purposes only. Information contained herein is not to be relied upon as a basis of any
    contract or commitment. The information is not to be construed as an offer, invitation or guarantee of obtaining a
    mortgange, and calculations expressed are orientative and subject to change without prior notice. No personal
    recommendation is being made to you and the past is not necessarily a guide to the future. We recommend the use
    of a solicitor to advise on any written contractual agreements. It is also the responsibility of your solicitor to check
    any title deeds and bank guarantee attributed to your property.
  </div>

  <div class="page-num">3</div>
</div>

</body>
</html>`;
}

async function generate(dataPath, outPath) {
  const d = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const html = buildHTML(d);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  } finally {
    await browser.close();
  }
}

const dataPath = process.argv[2] || path.join(__dirname, 'data.json');
const outPath  = process.argv[3] || path.join(__dirname, 'output.pdf');

generate(dataPath, outPath)
  .then(() => console.log('Generated:', outPath))
  .catch(err => { console.error(err); process.exit(1); });
