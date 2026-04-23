"use strict";

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const ORANGE = "#E06020";
const BOX_BORDER = "#E8A890";

function loadIcon(filename) {
  let svg = fs.readFileSync(path.join(__dirname, filename), "utf8");
  svg = svg.replace(/<style[\s\S]*?<\/style>/g, "");
  svg = svg.replace(/class="st0"/g, 'fill="currentColor"');
  svg = svg.replace("<svg ", '<svg style="height:36px;width:auto;" ');
  return svg;
}

const ICON_LICENSED = loadIcon("icon_licensed.svg");
const ICON_INDEPENDENT = loadIcon("icon_independent.svg");
const ICON_INTERNATIONAL = loadIcon("icon_international.svg");
const ICON_ONLINE = loadIcon("icon_online.svg");
const ICON_EFFICIENT = loadIcon("icon_efficient.svg");
const ICON_EXPERIENCED = loadIcon("icon_experienced.svg");

function logo(height) {
  const LOGO_SVG_RAW = `<svg xmlns="http://www.w3.org/2000/svg" width="156.678" height="31.352" viewBox="0 0 156.678 31.352"><g id="isologotipo_horizontal_d" transform="translate(0 -0.01)"><path d="M145.794,29.626a5.98,5.98,0,0,1,1.546,4.473v7.738h-3.918V34.7a3.517,3.517,0,0,0-.7-2.4,2.589,2.589,0,0,0-2.036-.792,3.12,3.12,0,0,0-2.362.918,3.8,3.8,0,0,0-.881,2.726v6.692h-3.92V22.24h3.915v7.486a5.227,5.227,0,0,1,1.884-1.189,6.833,6.833,0,0,1,2.413-.414A5.56,5.56,0,0,1,145.794,29.626Z" transform="translate(-110.007 -18.313)" fill="#333"/><path d="M231.825,24.981a2.129,2.129,0,0,1-.107-3.01h0q.049-.055.106-.106a2.5,2.5,0,0,1,1.761-.627,2.548,2.548,0,0,1,1.761.6,1.937,1.937,0,0,1,.678,1.507,2.14,2.14,0,0,1-.678,1.62,2.465,2.465,0,0,1-1.761.641,2.5,2.5,0,0,1-1.759-.629Zm-.2,2.511h3.92V41.01h-3.927Z" transform="translate(-190.441 -17.486)" fill="#333"/><path d="M289.907,56.476a6.229,6.229,0,0,1,2.425,2.437,8.048,8.048,0,0,1,0,7.312,6.218,6.218,0,0,1-2.425,2.437,6.884,6.884,0,0,1-3.429.866,5.224,5.224,0,0,1-4.072-1.632v9.265H278.49V55.81h3.744v1.559a5.2,5.2,0,0,1,4.248-1.761A6.868,6.868,0,0,1,289.907,56.476ZM288.274,65.3a4.327,4.327,0,0,0,0-5.452,3.522,3.522,0,0,0-4.95,0,4.327,4.327,0,0,0,0,5.452A3.522,3.522,0,0,0,288.274,65.3Z" transform="translate(-229.447 -45.805)" fill="#333"/><path d="M376.573,68.689a6.62,6.62,0,0,1-2.642-2.476,7.234,7.234,0,0,1,0-7.185,6.606,6.606,0,0,1,2.642-2.465,8.64,8.64,0,0,1,7.65,0,6.643,6.643,0,0,1,2.642,2.465,7.234,7.234,0,0,1,0,7.185,6.657,6.657,0,0,1-2.642,2.476A8.65,8.65,0,0,1,376.573,68.689Zm6.306-3.346a4.327,4.327,0,0,0,0-5.452,3.268,3.268,0,0,0-2.465-1.018,3.307,3.307,0,0,0-2.488,1.018,4.284,4.284,0,0,0,0,5.452,3.307,3.307,0,0,0,2.488,1.018,3.27,3.27,0,0,0,2.465-1.014Z" transform="translate(-307.294 -45.856)" fill="#333"/><path d="M474.987,41.184a4.015,4.015,0,0,1-1.419.641,7.151,7.151,0,0,1-1.772.213,5.263,5.263,0,0,1-3.732-1.233,4.7,4.7,0,0,1-1.319-3.617V31.637H464.66V28.37h2.085V22.24h3.918v6.13h3.367v3.267h-3.367v5.5a1.839,1.839,0,0,0,.44,1.319,1.632,1.632,0,0,0,1.243.465,2.525,2.525,0,0,0,1.585-.5Z" transform="translate(-382.831 -18.313)" fill="#333"/><path d="M543.58,63.7H533.356a3.17,3.17,0,0,0,1.3,1.985,4.328,4.328,0,0,0,2.564.729,5.181,5.181,0,0,0,1.872-.322,4.514,4.514,0,0,0,1.52-.991l2.085,2.261a7.018,7.018,0,0,1-5.577,2.185,8.835,8.835,0,0,1-4.05-.891,6.552,6.552,0,0,1-2.714-2.476,6.818,6.818,0,0,1-.954-3.593,6.9,6.9,0,0,1,.94-3.573,6.574,6.574,0,0,1,2.587-2.485,8.014,8.014,0,0,1,7.275-.039,6.257,6.257,0,0,1,2.524,2.45,7.274,7.274,0,0,1,.918,3.7C543.654,62.686,543.631,63.042,543.58,63.7Zm-9.17-4.346a3.2,3.2,0,0,0-1.106,2.06h6.659a3.232,3.232,0,0,0-1.106-2.048,3.305,3.305,0,0,0-2.21-.766A3.372,3.372,0,0,0,534.411,59.349Z" transform="translate(-436.175 -45.825)" fill="#333"/><path d="M632.684,36.536,630.8,38.4v3.443h-3.92V22.24h3.92V33.747l5.729-5.428H641.2l-5.635,5.729,6.127,7.789h-4.755Z" transform="translate(-516.484 -18.313)" fill="#333"/><path d="M727.9,63.654H717.669a3.17,3.17,0,0,0,1.307,1.985,4.325,4.325,0,0,0,2.562.729,5.163,5.163,0,0,0,1.869-.322,4.5,4.5,0,0,0,1.52-.991l2.085,2.261a7.018,7.018,0,0,1-5.577,2.185,8.835,8.835,0,0,1-4.05-.891,6.553,6.553,0,0,1-2.714-2.476,6.818,6.818,0,0,1-.954-3.593,6.9,6.9,0,0,1,.942-3.58,6.6,6.6,0,0,1,2.587-2.487,8.015,8.015,0,0,1,7.275-.039,6.261,6.261,0,0,1,2.525,2.45,7.316,7.316,0,0,1,.918,3.7C727.971,62.649,727.945,63,727.9,63.654Zm-9.172-4.346a3.213,3.213,0,0,0-1.106,2.06h6.659a3.232,3.232,0,0,0-1.106-2.048,3.305,3.305,0,0,0-2.21-.766A3.372,3.372,0,0,0,718.724,59.308Z" transform="translate(-588.027 -45.784)" fill="#333"/><path d="M823.493,57.133a5.986,5.986,0,0,1,1.546,4.473v7.738h-3.92V62.209a3.518,3.518,0,0,0-.7-2.4,2.587,2.587,0,0,0-2.034-.792,3.113,3.113,0,0,0-2.361.918,3.816,3.816,0,0,0-.881,2.726v6.692H811.22V55.827h3.742v1.585a5.207,5.207,0,0,1,1.937-1.319,6.725,6.725,0,0,1,2.538-.465A5.539,5.539,0,0,1,823.493,57.133Z" transform="translate(-668.361 -45.821)" fill="#333"/><rect width="19.595" height="3.917" transform="translate(0 27.445)" fill="#e67039"/><path d="M15.673,4.559l-.828-.641L12.988,2.478l-1.233-.96L9.8,0h0L7.84,1.518,6.607,2.48,4.755,3.92l-.824.637L0,7.6V23.515H19.6V7.6Zm0,15.038H3.918V9.518l2.166-1.68,1.761-1.36,1.96-1.52,1.949,1.522,1.75,1.358,2.168,1.684Z" transform="translate(0 0.01)" fill="#e67039"/></g></svg>`;

  const w = Math.round(height * (156.678 / 31.352));
  return LOGO_SVG_RAW.replace(
    'width="156.678" height="31.352"',
    `width="${w}" height="${height}"`,
  );
}

function logoPage1(height) {
  const LOGO_SVG_RAW_PAGE_1 = `<svg width="136" height="70" viewBox="0 0 136 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.1124 45.8495C19.6091 46.3939 19.9894 47.0339 20.2301 47.7304C20.4709 48.4269 20.5669 49.1652 20.5124 49.9001V56.9075H16.9643V50.4444C17.0263 49.6667 16.8008 48.8934 16.3304 48.271C16.0939 48.0243 15.8064 47.8323 15.4879 47.7084C15.1694 47.5845 14.8277 47.5317 14.4867 47.5538C14.0918 47.535 13.6974 47.5993 13.329 47.7425C12.9605 47.8857 12.6262 48.1046 12.3477 48.3851C11.7699 49.0724 11.4836 49.9583 11.5499 50.8537V56.9138H8V39.1608H11.5454V45.94C12.0301 45.4627 12.612 45.0954 13.2515 44.8633C13.9513 44.6078 14.6916 44.4808 15.4366 44.4884C16.1092 44.458 16.781 44.5628 17.4124 44.7965C18.0437 45.0303 18.6218 45.3884 19.1124 45.8495Z" fill="#333333"/>
<path d="M24.1809 42.392C23.9955 42.2194 23.8459 42.012 23.7407 41.7816C23.6354 41.5512 23.5766 41.3023 23.5676 41.0491C23.5586 40.796 23.5996 40.5436 23.6882 40.3063C23.7768 40.069 23.9113 39.8515 24.084 39.6662C24.1136 39.633 24.1456 39.601 24.18 39.5702C24.6182 39.1818 25.1897 38.9783 25.7747 39.0024C26.3558 38.976 26.9253 39.1701 27.3694 39.5457C27.5661 39.7138 27.7231 39.9234 27.8293 40.1593C27.9354 40.3953 27.9881 40.6518 27.9834 40.9104C27.9907 41.1845 27.9397 41.4569 27.8339 41.7098C27.728 41.9627 27.5697 42.1903 27.3694 42.3775C26.935 42.7734 26.362 42.9819 25.7747 42.9579C25.1901 42.981 24.6192 42.7769 24.1818 42.3883L24.1809 42.392ZM23.9998 44.6659H27.5497V56.9075H23.9934L23.9998 44.6659Z" fill="#333333"/>
<path d="M41.4558 45.2681C42.3803 45.7831 43.1413 46.5479 43.6518 47.475C44.1746 48.5003 44.4472 49.6349 44.4472 50.7858C44.4472 51.9367 44.1746 53.0713 43.6518 54.0966C43.1417 55.024 42.3806 55.7889 41.4558 56.3035C40.5066 56.8308 39.4362 57.1012 38.3505 57.0877C37.6655 57.1234 36.9808 57.0098 36.3441 56.7546C35.7074 56.4994 35.1337 56.1088 34.663 55.6098V64H31.1167V44.665H34.5072V46.0768C34.9833 45.5338 35.5778 45.1076 36.2448 44.8311C36.9119 44.5545 37.6336 44.4351 38.3541 44.482C39.4389 44.4691 40.5081 44.7401 41.4558 45.2681ZM39.9769 53.2589C40.5432 52.5608 40.8523 51.6892 40.8523 50.7903C40.8523 49.8914 40.5432 49.0198 39.9769 48.3217C39.38 47.7321 38.5747 47.4014 37.7356 47.4014C36.8966 47.4014 36.0913 47.7321 35.4943 48.3217C34.928 49.0198 34.6189 49.8914 34.6189 50.7903C34.6189 51.6892 34.928 52.5608 35.4943 53.2589C36.0913 53.8486 36.8966 54.1792 37.7356 54.1792C38.5747 54.1792 39.38 53.8486 39.9769 53.2589Z" fill="#333333"/>
<path d="M49.4421 56.2817C48.4517 55.7712 47.6232 54.9947 47.0495 54.0395C46.4828 53.0489 46.1846 51.9275 46.1846 50.7862C46.1846 49.645 46.4828 48.5235 47.0495 47.5329C47.6241 46.581 48.4526 45.8079 49.4421 45.3007C50.5193 44.7688 51.7045 44.4922 52.9059 44.4922C54.1073 44.4922 55.2925 44.7688 56.3697 45.3007C57.3582 45.8094 58.1863 46.5821 58.7623 47.5329C59.329 48.5235 59.6272 49.645 59.6272 50.7862C59.6272 51.9275 59.329 53.0489 58.7623 54.0395C58.1872 54.9936 57.3591 55.7697 56.3697 56.2817C55.2923 56.8129 54.1072 57.0892 52.9059 57.0892C51.7047 57.0892 50.5195 56.8129 49.4421 56.2817ZM55.1526 53.2517C55.719 52.5536 56.028 51.682 56.028 50.7831C56.028 49.8841 55.719 49.0125 55.1526 48.3144C54.8663 48.0125 54.5195 47.7743 54.1348 47.6154C53.7502 47.4566 53.3364 47.3806 52.9204 47.3926C52.5012 47.3799 52.0841 47.4554 51.6959 47.6142C51.3078 47.773 50.9574 48.0116 50.6673 48.3144C50.0941 49.0094 49.7805 49.8822 49.7805 50.7831C49.7805 51.6839 50.0941 52.5567 50.6673 53.2517C50.9574 53.5545 51.3078 53.7931 51.6959 53.9519C52.0841 54.1107 52.5012 54.1862 52.9204 54.1735C53.3361 54.1858 53.7497 54.1104 54.1343 53.9522C54.5189 53.794 54.8659 53.5565 55.1526 53.2553V53.2517Z" fill="#333333"/>
<path d="M70.159 56.3161C69.7726 56.5916 69.3361 56.7888 68.874 56.8966C68.3492 57.0277 67.8101 57.0925 67.2693 57.0895C66.0408 57.1677 64.8297 56.7676 63.8897 55.9729C63.4706 55.5422 63.1475 55.0277 62.9417 54.4631C62.7358 53.8986 62.6518 53.2968 62.6952 52.6975V47.6706H60.8071V44.7121H62.6952V39.1608H66.2433V44.7121H69.2924V47.6706H66.2433V52.6513C66.2146 53.0862 66.3577 53.5151 66.6417 53.8457C66.7894 53.9908 66.9659 54.1033 67.1598 54.1759C67.3537 54.2484 67.5607 54.2794 67.7674 54.2668C68.2832 54.2822 68.7891 54.1226 69.2027 53.814L70.159 56.3161Z" fill="#333333"/>
<path d="M83.9682 51.7919H74.7096C74.8545 52.5209 75.2765 53.1653 75.8868 53.5894C76.5721 54.0483 77.3845 54.2793 78.2087 54.2496C78.7869 54.2577 79.3617 54.1589 79.9039 53.958C80.4188 53.7551 80.8871 53.4498 81.2804 53.0606L83.1686 55.1081C82.5249 55.7901 81.7382 56.3212 80.8651 56.6633C79.9919 57.0054 79.0538 57.15 78.1182 57.0868C76.8489 57.1126 75.5918 56.836 74.4506 56.2799C73.4343 55.7822 72.5815 55.0042 71.9928 54.0377C71.409 53.0541 71.1099 51.9276 71.1289 50.784C71.1132 49.6481 71.4075 48.5294 71.9801 47.5483C72.5373 46.5955 73.3485 45.8164 74.3229 45.298C75.3404 44.7728 76.4677 44.4958 77.6127 44.4896C78.7577 44.4835 79.8879 44.7484 80.9109 45.2626C81.8693 45.7684 82.6626 46.5384 83.1967 47.4813C83.7667 48.5044 84.0537 49.661 84.028 50.832C84.0352 50.8736 84.0144 51.196 83.9682 51.7919ZM75.664 47.8562C75.1068 48.3295 74.7491 48.9958 74.6625 49.7217H80.6927C80.6008 49.0006 80.2437 48.3395 79.6911 47.8671C79.1309 47.3996 78.4192 47.153 77.6898 47.1734C76.9552 47.1484 76.2363 47.3893 75.665 47.8517L75.664 47.8562Z" fill="#333333"/>
<path d="M91.9328 52.107L90.2266 53.795V56.9129H86.6768V39.1608H90.2266V49.5814L95.4147 44.6659H99.6447L94.5417 49.8539L100.09 56.9075H95.7842L91.9328 52.107Z" fill="#333333"/>
<path d="M113.371 51.7873H104.106C104.252 52.5174 104.676 53.1619 105.289 53.5849C105.974 54.0436 106.786 54.2746 107.609 54.2451C108.187 54.2532 108.76 54.1544 109.302 53.9535C109.817 53.7509 110.285 53.4456 110.678 53.0561L112.566 55.1036C111.923 55.7856 111.136 56.3167 110.263 56.6588C109.39 57.0009 108.452 57.1455 107.516 57.0823C106.247 57.1081 104.99 56.8315 103.848 56.2754C102.832 55.7776 101.979 54.9996 101.391 54.0332C100.807 53.0496 100.508 51.9231 100.527 50.7794C100.51 49.6412 100.805 48.5202 101.38 47.5375C101.938 46.5848 102.749 45.8052 103.722 45.2853C104.74 44.7602 105.867 44.4832 107.012 44.4771C108.157 44.4709 109.288 44.7358 110.311 45.25C111.269 45.7558 112.063 46.5257 112.597 47.4686C113.166 48.4924 113.452 49.6486 113.429 50.8193C113.435 50.8772 113.411 51.1951 113.371 51.7873ZM105.065 47.8517C104.508 48.3257 104.151 48.9916 104.063 49.7172H110.093C110.001 48.996 109.644 48.3349 109.092 47.8626C108.531 47.3951 107.82 47.1484 107.09 47.1689C106.354 47.1441 105.633 47.3866 105.061 47.8517H105.065Z" fill="#333333"/>
<path d="M127.189 45.8486C127.685 46.3931 128.065 47.0332 128.306 47.7296C128.547 48.4261 128.643 49.1643 128.589 49.8992V56.9066H125.039V50.4453C125.101 49.6676 124.875 48.8943 124.405 48.2719C124.169 48.0253 123.882 47.8334 123.563 47.7095C123.245 47.5856 122.904 47.5328 122.563 47.5547C122.168 47.5356 121.774 47.5998 121.406 47.743C121.037 47.8862 120.703 48.1053 120.425 48.386C119.849 49.074 119.562 49.9593 119.627 50.8546V56.9147H116.075V44.6659H119.463V46.1012C119.95 45.5749 120.55 45.1664 121.217 44.9067C121.949 44.6193 122.73 44.4764 123.516 44.4857C124.188 44.4548 124.86 44.5595 125.491 44.7937C126.122 45.0278 126.699 45.3866 127.189 45.8486Z" fill="#333333"/>
<path d="M77.5 29.5018H60V33H77.5V29.5018Z" fill="#E67039"/>
<path d="M73.9973 9.07157L73.2578 8.49911L71.5994 7.21306L70.4982 6.3557L68.7522 5L67.0018 6.3557L65.9006 7.21485L64.2466 8.50089L63.5107 9.06979L60 11.7874V26.0009H77.5045V11.7874L73.9973 9.07157ZM73.9973 22.5018H63.4991V13.5004L65.4335 12L67.0063 10.7854L68.7567 9.42792L70.4973 10.7872L72.0602 12L73.9964 13.504L73.9973 22.5018Z" fill="#E67039"/>
</svg>
`;
  const w = Math.round(height * (156.678 / 31.352));
  return LOGO_SVG_RAW_PAGE_1.replace(
    'width="156.678" height="31.352"',
    `width="${w}" height="${height}"`,
  );
}

function fmt(n) {
  const num = Number(n);
  if (isNaN(num) || num === 0) return "€ 0";
  return (
    "€ " +
    num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function pct(n) {
  return Number(n) + "%";
}

function fmtDate(iso) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

function customerName(name) {
  const idx = name.indexOf("€");
  return (
    idx > 0 ? name.slice(0, idx) : name.split(/\s+/).slice(0, 2).join(" ")
  ).trim();
}

function infoBar(date, preparedBy, customer) {
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

function box(content) {
  return `<div style="border:2px solid ${BOX_BORDER};border-radius:8px;padding:9px 13px;margin-bottom:4mm;">${content}</div>`;
}

function boxHdr(text, italic = false) {
  return `<div style="font-weight:900;text-decoration:underline;${italic ? "font-style:italic;" : ""}margin-bottom:7px;font-size:13px;">${text}</div>`;
}

function row(left, right, opts = {}) {
  const { bold = false, topBorder = false, orangeText = false, tab = false } = opts;
  const leftStyle = tab ? "width:50%;flex-shrink:0;font-weight:700;" : "font-weight:700;";
  const flexStyle = tab ? "" : "justify-content:space-between;";
  return `<div style="display:flex;${flexStyle}align-items:baseline;padding:2px 0;font-size:13px;${bold ? "font-weight:800;" : ""}${topBorder ? `border-top:2px solid #333;margin-top:3px;padding-top:4px;` : ""}${orangeText ? `color:${ORANGE};font-style:italic;` : ""}">
    <span style="${leftStyle}">${left}</span><span style="white-space:nowrap;">${right}</span>
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
    ${cell(`<i class="fas fa-clipboard-list" style="color:white;font-size:30px;"></i>`, "Documenting Process", "Depending on the tax residence, documents will be required")}
    ${sep}
    ${cell(`<span style="color:white;font-size:36px;font-weight:900;line-height:1;">?</span>`, "Mortgage Application", "We put various banks in competition to ensure the best terms possible")}
    ${sep}
    ${cell(`<i class="fas fa-camera" style="color:white;font-size:28px;"></i>`, "Completion Process", "We coordinate completion with all parts to ensure a smooth process")}
  </div>`;
}

function buildHTML(d) {
  const date = fmtDate(d.Created_Time);
  const by = d.Owner.name;
  const cust = customerName(d.Name);

  const poaFee = d.Power_of_Attorney_or_NIE ? d.Power_of_Attorney_NIE || 0 : 0;
  const solicitorFee = d.Lawyer || 0;
  const buyerPct = d.Buyer_Agent1 ? d.Buyer_Agent || 0 : 0;
  const buyerFee = d.Buyer_Agent_Fee || 0;
  const mortgageCosts = (d.Broker_fees || 0) + (d.Valuation_Costs || 0);

  const centeredLogo = logo(21);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
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
  .page-num { position:absolute; bottom:8mm; right:17mm; font-size:16px; font-weight:700; z-index:2; }
  .main-title { font-size:30px; font-weight:800; color:${ORANGE}; }
  .sec-title { font-size:23px; font-weight:800; color:${ORANGE}; margin:4mm 0 3mm; }
  .sub-title { font-size:17px; font-weight:800; color:${ORANGE}; margin:3mm 0 2mm; }
  .why-box { background:#FCEEE4; padding:6mm 17mm 8mm; margin:4mm -17mm -9mm; flex:1 0 auto; }
  .icon-grid {
    display:grid; grid-template-columns:1fr 1fr 1fr;
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
    <div style="padding-top:4px;">${logoPage1(35)}</div>
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
      ${iconCell(ICON_LICENSED, "Licensed")}
      ${iconCell(ICON_INDEPENDENT, "Independent")}
      ${iconCell(ICON_INTERNATIONAL, "International")}
      ${iconCell(ICON_ONLINE, "Online")}
      ${iconCell(ICON_EFFICIENT, "Efficient")}
      ${iconCell(ICON_EXPERIENCED, "Experienced")}
    </div>
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

  <div class="page-num" style="color:${ORANGE};">3</div>
</div>

</body>
</html>`;
}

async function generate(dataPath, outPath) {
  const d = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const html = buildHTML(d);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: outPath,
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  } finally {
    await browser.close();
  }
}

const dataPath = process.argv[2] || path.join(__dirname, "data.json");
const outPath = process.argv[3] || path.join(__dirname, "output.pdf");

generate(dataPath, outPath)
  .then(() => console.log("Generated:", outPath))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
