// builds the full html for the 3-page pdf
import { icons } from "./icons.js";
import { logo, logoPage1 } from "./logos.js";
import { fmt, pct, fmtDate, customerName } from "./format.js";
import {
  infoBar, box, boxHdr, row, hint, iconCell, nextSteps,
  ORANGE, BOX_BORDER,
} from "./components.js";

export function buildHTML(d) {
  const date = fmtDate(d.Created_Time);
  const by = d.Owner.name;
  const cust = customerName(d.Name);

  // some fields are conditional on checkboxes
  const poaFee = d.Power_of_Attorney_or_NIE ? (d.Power_of_Attorney_NIE || 0) : 0;
  const solicitorFee = d.Lawyer || 0;
  const buyerPct = d.Buyer_Agent1 ? (d.Buyer_Agent || 0) : 0;
  const buyerFee = d.Buyer_Agent_Fee || 0;
  const mortgageCosts = (d.Broker_fees || 0) + (d.Valuation_Costs || 0);

  const centeredLogo = logo(21);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Nunito',Arial,sans-serif; font-size:13.5px; font-weight:500; color:#1a1a1a; background:white; }
  .page {
    width:210mm; height:297mm;
    padding: 6mm 17mm 9mm 17mm;
    overflow:hidden; position:relative;
    break-after:page; page-break-after:always;
    display:flex; flex-direction:column;
  }
  .page:last-child { break-after:auto; page-break-after:auto; }
  .page-num { position:absolute; bottom:8mm; right:17mm; font-size:16px; font-weight:700; color:${ORANGE}; z-index:2; }
  .main-title { font-size:30px; font-weight:800; color:${ORANGE}; }
  .sec-title { font-size:23px; font-weight:800; color:${ORANGE}; margin:4mm 0 3mm; }
  .sub-title { font-size:17px; font-weight:800; color:${ORANGE}; margin:3mm 0 2mm; }
  .why-box { background:#FDF4EC; padding:6mm 17mm 8mm; margin:4mm -17mm -9mm; flex:1 0 auto; }
  .icon-grid { display:grid; grid-template-columns:1fr 1fr 1fr; }
  .icon-grid > div + div { border-left:2px solid ${ORANGE}; }
  .icon-grid > div:nth-child(n+4) { border-top:2px solid ${ORANGE}; }
  .icon-grid > div:nth-child(4) { border-left:none; }
</style>
</head>
<body>

<!-- PAGE 1 -->
<div class="page">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3mm;">
    <div class="main-title">Personal Mortgage Simulation</div>
    <div>${logoPage1(56)}</div>
  </div>

  ${infoBar(date, by, cust)}

  <div class="sec-title">Briefing:</div>

  ${box(`
    ${boxHdr("Your property purchase:")}
    ${row("Price:", fmt(d.Property_Price), { tab: true })}
    ${row("Area:", d.Area, { tab: true })}
    ${row("Status:", d.Status, { tab: true })}
    ${row("Type of property:", d.PropertySalesType, { tab: true })}
  `)}

  ${box(`
    ${boxHdr("Your potential mortgage:")}
    ${row("Loan to Value:", pct(d.LTV), { tab: true })}
    ${row("Resulting mortgage:", fmt(d.Resulting_Mortgage), { tab: true })}
    ${row("Mortgage term:", d.Mortgage_term_Years + " yrs", { tab: true })}
  `)}

  ${box(`
    <div style="font-weight:700;text-decoration:underline;margin-bottom:6px;display:flex;align-items:baseline;gap:6px;">
      Monthly Repayment Estimation: ${hint("(See page 2 for more details)")}
    </div>
    <div style="display:flex;border-top:1px solid #ccc;margin-top:4px;">
      <div style="flex:1;text-align:center;padding:8px;">
        <div style="font-size:15px;font-weight:700;">Fixed: <span style="color:${ORANGE};font-size:13px;font-weight:600;">(Section A)</span></div>
        <div style="font-size:17px;font-weight:800;margin-top:7px;">${fmt(d.Monthly_payments_fixed_mortgage)}</div>
      </div>
      <div style="flex:1;text-align:center;padding:8px;border-left:2px solid ${BOX_BORDER};">
        <div style="font-size:15px;font-weight:700;">Variable: <span style="color:${ORANGE};font-size:13px;font-weight:600;">(Section B)</span></div>
        <div style="font-size:17px;font-weight:800;margin-top:7px;">${fmt(d.Monthly_payments_variable_interest)}</div>
      </div>
      <div style="flex:1;text-align:center;padding:8px;border-left:2px solid ${BOX_BORDER};">
        <div style="font-size:15px;font-weight:700;">Mixed: <span style="color:${ORANGE};font-size:13px;font-weight:600;">(Section B)</span></div>
        <div style="font-size:17px;font-weight:800;margin-top:7px;">${fmt(d.Monthly_Payments_fixed_rate)}</div>
      </div>
    </div>
  `)}

  ${box(`
    ${boxHdr("Key figures:")}
    ${row("<strong>Property purchase price</strong>", `<strong>${fmt(d.Property_Price)}</strong>`)}
    ${row(`Estimated purchase costs &nbsp;${hint("(See page 3, section C, for more details)")}`, fmt(d.Estimated_purchase_Costs))}
    ${row(`Mortgage costs &nbsp;${hint("(See page 3, section D, for more details)")}`, fmt(mortgageCosts))}
    ${row("<u>Estimated Total Cost of your purchase</u>", fmt(d.TOTAL_Amount_needed), { bold: true, topBorder: true })}
    ${row("Mortgage contribution", fmt(d.Resulting_Mortgage))}
    ${row("<u>Savings needed</u>", fmt(d.TOTAL_Savings_needed), { bold: true, topBorder: true })}
  `)}

  <div class="why-box">
    <div style="text-align:center;font-size:23px;font-weight:800;color:${ORANGE};margin-bottom:3mm;">Why use Hipoteken?</div>
    <div class="icon-grid">
      ${iconCell(icons.licensed, "Licensed")}
      ${iconCell(icons.independent, "Independent")}
      ${iconCell(icons.international, "International")}
      ${iconCell(icons.online, "Online")}
      ${iconCell(icons.efficient, "Efficient")}
      ${iconCell(icons.experienced, "Experienced")}
    </div>
  </div>

  <div class="page-num">1</div>
</div>

<!-- PAGE 2 -->
<div class="page">
  <div style="text-align:center;margin-bottom:2mm;">
    ${centeredLogo}
    <div class="main-title">Personal Mortgage Simulation</div>
  </div>

  ${infoBar(date, by, cust)}

  <div class="sec-title">Monthly Repayment Estimations:</div>
  <div class="sub-title">Section A:</div>

  ${box(`
    ${boxHdr("OPTION 1 - Fixed interest mortgage:", true)}
    ${row("Average interest rate offered by banks", pct(d.Fixed_interest_rate_fixed_mortgage))}
    ${row("Resulting monthly repayment", fmt(d.Monthly_payments_fixed_mortgage), { bold: true, topBorder: true })}
    <div style="font-size:11px;font-style:italic;margin-top:5px;line-height:1.55;color:#222;">
      <div>Early repayment fee ranges between 2% and 0%</div>
      <div>Depending on your specific country of income/tax residency a fixed interest mortgage will be possible or not</div>
      <div>Sometimes only variable interest mortgages are available</div>
      <div><strong>Both options consider contracting certain combined products to reach these rates</strong></div>
    </div>
  `)}

  <div class="sub-title">Section B:</div>

  ${box(`
    ${boxHdr("OPTION 2 - Variable and Mixed Interest mortgage:", true)}

    <div style="margin-bottom:8px;">
      <div style="font-size:13px;margin-bottom:3px;"><strong>Fixed interest period</strong> - <em>depending on the bank, they offer between 1 and 5 years of fixed interests</em></div>
      ${row("Average interest rate during initial fixed interest period", pct(d.Fixed_interest_rate_Av))}
      ${row("Resulting monthly repayment during variable period", fmt(d.Monthly_Payments_fixed_rate), { bold: true, topBorder: true })}
    </div>

    <div>
      <div style="font-size:13px;margin-bottom:3px;"><strong>Variable interest period</strong> - <em>the rest of the mortgage term the interest rate is indexed to Euribor</em></div>
      ${row("Euribor is the reference interest rate. Its actual value is", pct(d.EURIBOR_12M_F), { orangeText: true })}
      ${row("Average Spread banks offer on variable interest rate principle", pct(d.Spread))}
      ${row("Resulting interest rate during variable interest period", pct(d.Variable_interest_rate))}
      ${row("Resulting monthly repayment during variable period", fmt(d.Monthly_payments_variable_interest), { bold: true, topBorder: true })}
      <div style="font-size:11px;font-style:italic;margin-top:4px;color:#333;">Early repayment fee of between 0.25% and 0%</div>
    </div>
  `)}

  <div class="why-box">
    <div style="text-align:center;font-size:23px;font-weight:800;color:${ORANGE};margin-bottom:3mm;">Next Steps</div>
    ${nextSteps()}
  </div>

  <div class="page-num">2</div>
</div>

<!-- PAGE 3 -->
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
      <span style="font-weight:700;">Transfer tax/ VAT &nbsp;&nbsp;<span style="margin-left:4px;">${pct(d.Transfer_TAX_VAT)}</span></span>
      <span style="white-space:nowrap;">${fmt(d.Transfer_TAX_VAT1)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding:2px 0;font-size:12px;">
      <span style="font-weight:700;">Stamp duty &nbsp;&nbsp;<span style="margin-left:4px;">${pct(d.Stamp_Duty)}</span></span>
      <span style="white-space:nowrap;">${fmt(d.Stamp_Duty2)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding:2px 0;font-size:12px;">
      <span style="font-weight:700;">Buyer agent fee &nbsp;&nbsp;<span style="margin-left:4px;">${pct(buyerPct)}</span></span>
      <span style="white-space:nowrap;">${fmt(buyerFee)}</span>
    </div>
    ${row("Solicitor fees", fmt(solicitorFee))}
    ${row("Power of Attorney & NIE", fmt(poaFee))}
    ${row("Land registry", fmt(d.Land_Registry))}
    ${row("Notary fees", fmt(d.Notary_Cost))}
    ${row("Registration & admin costs", fmt(d.Admin_Costs))}
    ${row("Banker´s Draft Commission", fmt(d.Bank_s_Draft_Commision))}
    ${row("1st year´s home insurance", fmt(d.Home_Insurance))}
    ${row("<u>Estimated purchase cost</u>", fmt(d.Estimated_purchase_Costs), { bold: true, topBorder: true })}
  `)}

  <div class="sub-title">Section D:</div>

  ${box(`
    ${boxHdr("Mortgage costs:")}
    <div style="display:flex;justify-content:space-between;padding:2px 0;font-size:12px;">
      <span>Bank set up fee (depending on the bank, a small fee can apply)</span><span></span>
    </div>
    ${row("Broker fee - % over final mortgage or min. fee", fmt(d.Broker_fees))}
    ${row("Property Valuation", fmt(d.Valuation_Costs))}
    <div style="display:flex;justify-content:space-between;padding:2px 0;font-size:12px;">
      <span>Life insurance (sometimes required at additional cost)</span><span></span>
    </div>
    ${row("<u>Estimated mortgage costs</u>", fmt(mortgageCosts), { bold: true, topBorder: true })}
    <div style="font-size:11px;font-style:italic;margin-top:4px;color:#444;">Bank set up fee or life insurance costs would be on top of this, although in most they don´t apply</div>
  `)}

  <div style="text-align:center;margin-bottom:4mm;font-size:12.5px;line-height:1.55;">
    <strong>Hipoteken International Mortgages</strong> is a commercial brand, registered by Hipoteken S.L., a registered company in Spain, with registation number ESB06838445, and registered address Calle Serrano Morales 11, 4, 46004 Valencia, Spain. You can check our mortgage broker registration with the bank of Spain and legal information here.
  </div>

  <div style="text-align:center;margin:2mm 0 4mm;font-size:12.5px;color:#2F80B4;font-weight:700;text-decoration:underline;">
    https://hipoteken.com/legal-mortgage-regulation
  </div>

  <div style="font-style:italic;font-size:12px;text-align:center;line-height:1.55;color:#222;">
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
