// helper functions for formatting stuff in the pdf

export function fmt(n) {
  const num = Number(n);
  if (isNaN(num) || num === 0) return "€ 0";
  return "€ " + num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function pct(n) {
  return Number(n) + "%";
}

export function fmtDate(iso) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function customerName(name) {
  // cut off the name at € or take first 2 words
  const idx = name.indexOf("€");
  if (idx > 0) {
    return name.slice(0, idx).trim();
  }
  return name.split(/\s+/).slice(0, 2).join(" ").trim();
}
