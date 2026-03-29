/**
 * export.js
 * Handles all card export operations: PNG, SVG, PDF, JSON, HTML.
 * All exports are fully client-side.
 */

/**
 * Exports the card as a PNG image using html2canvas.
 * Renders at 2x resolution for high quality.
 */
async function exportPNG() {
  const card = document.getElementById('card-preview');
  if (!card) return;
  showToast('Generating PNG…', 'info');
  try {
    const canvas = await html2canvas(card, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });
    const url = canvas.toDataURL('image/png');
    downloadFile(url, 'cardify-card.png');
    showToast('PNG downloaded!', 'success');
  } catch (err) {
    console.error(err);
    showToast('PNG export failed.', 'error');
  }
}

/**
 * Exports the card as an SVG vector file.
 * Constructs an SVG string representing the card layout.
 */
function exportSVG() {
  const state = window.cardState;
  if (!state) return;

  const isHoriz  = state.layout === 'horizontal';
  const W        = isHoriz ? 480 : 320;
  const H        = isHoriz ? 200 : 380;
  const r        = state.borderRadius !== undefined ? state.borderRadius : 24;
  const accent   = state.accentColor || '#4070f4';
  const bg       = state.bgColor     || '#ffffff';
  const textCol  = state.textColor   || '#333333';
  const font     = state.font        || 'Poppins';
  const fullName = [state.firstName, state.lastName].filter(Boolean).join(' ') || 'Your Name';
  const profession = state.profession || '';
  const bio        = state.bio || '';

  let photoEl = '';
  if (state.photo) {
    if (isHoriz) {
      photoEl = `<image href="${state.photo}" x="96" y="${H/2 - 44}" width="88" height="88" clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice"/>`;
    } else {
      photoEl = `<image href="${state.photo}" x="116" y="46" width="88" height="88" clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice"/>`;
    }
  }

  // Social links
  const platforms   = window.SOCIAL_PLATFORMS || {};
  const iconStyle   = state.iconStyle || 'filled';
  const socialLinks = state.socialLinks || [];
  let socialSvg     = '';
  let socialX       = isHoriz ? 160 : (W / 2) - (socialLinks.length * 22);
  let socialY       = isHoriz ? H - 44 : H - 60;

  socialLinks.forEach((link, i) => {
    const info = platforms[link.platform];
    if (!info) return;
    const cx = isHoriz ? socialX + i * 44 : (W / 2) - (socialLinks.length * 22) + i * 44;
    const cy = socialY;
    if (iconStyle === 'filled') {
      socialSvg += `<circle cx="${cx + 18}" cy="${cy + 18}" r="18" fill="${info.color}"/>`;
      socialSvg += `<text x="${cx + 18}" y="${cy + 24}" font-family="${font}" font-size="14" fill="#fff" text-anchor="middle">${link.platform.charAt(0).toUpperCase()}</text>`;
    } else if (iconStyle === 'outline') {
      socialSvg += `<circle cx="${cx + 18}" cy="${cy + 18}" r="17" fill="none" stroke="${info.color}" stroke-width="2"/>`;
      socialSvg += `<text x="${cx + 18}" y="${cy + 24}" font-family="${font}" font-size="13" fill="${info.color}" text-anchor="middle">${link.platform.charAt(0).toUpperCase()}</text>`;
    } else {
      socialSvg += `<text x="${cx + 18}" y="${cy + 22}" font-family="${font}" font-size="18" fill="${info.color}" text-anchor="middle">${link.platform.charAt(0).toUpperCase()}</text>`;
    }
  });

  const headerW = isHoriz ? 140 : W;
  const headerH = isHoriz ? H : 90;

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <clipPath id="cardClip">
      <rect width="${W}" height="${H}" rx="${r}" ry="${r}"/>
    </clipPath>
    <clipPath id="photoClip">
      <circle cx="${isHoriz ? 140 : 160}" cy="${isHoriz ? H/2 : 90}" r="44"/>
    </clipPath>
  </defs>
  <!-- Card background -->
  <rect width="${W}" height="${H}" rx="${r}" ry="${r}" fill="${bg}"/>
  <!-- Header accent -->
  <rect width="${headerW}" height="${headerH}" fill="${accent}" clip-path="url(#cardClip)"/>
  <!-- Photo placeholder circle -->
  ${!state.photo ? `<circle cx="${isHoriz ? 140 : 160}" cy="${isHoriz ? H/2 : 90}" r="44" fill="${accent}" opacity="0.8"/>` : ''}
  ${photoEl}
  <!-- Name -->
  <text x="${isHoriz ? 168 : W/2}" y="${isHoriz ? H/2 - 20 : 168}"
        font-family="${font}, sans-serif" font-size="18" font-weight="700"
        fill="${textCol}" text-anchor="${isHoriz ? 'start' : 'middle'}">${escapeXml(fullName)}</text>
  <!-- Profession -->
  <text x="${isHoriz ? 168 : W/2}" y="${isHoriz ? H/2 : 192}"
        font-family="${font}, sans-serif" font-size="11" font-weight="600"
        fill="${accent}" text-anchor="${isHoriz ? 'start' : 'middle'}"
        letter-spacing="1">${escapeXml(profession.toUpperCase())}</text>
  <!-- Bio -->
  <foreignObject x="${isHoriz ? 168 : 24}" y="${isHoriz ? H/2 + 12 : 204}"
                 width="${isHoriz ? W - 180 : W - 48}" height="60">
    <div xmlns="http://www.w3.org/1999/xhtml"
         style="font-family:${font},sans-serif;font-size:11px;color:${textCol};opacity:0.7;line-height:1.5;word-wrap:break-word;">
      ${escapeXml(bio)}
    </div>
  </foreignObject>
  <!-- Social icons -->
  ${socialSvg}
</svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  downloadFile(url, 'cardify-card.svg');
  URL.revokeObjectURL(url);
  showToast('SVG downloaded!', 'success');
}

/**
 * Escapes special XML characters in a string.
 * @param {string} str
 * @returns {string}
 */
function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Exports the card as a PDF using jsPDF.
 * Renders to canvas first, then embeds into a PDF page.
 */
async function exportPDF() {
  const card = document.getElementById('card-preview');
  if (!card) return;
  showToast('Generating PDF…', 'info');
  try {
    const canvas = await html2canvas(card, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });
    const imgData  = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const cardW    = card.offsetWidth;
    const cardH    = card.offsetHeight;
    // Convert px to mm using the standard web pixel density of 96 px/inch:
    // 1 mm = 96 / 25.4 ≈ 3.779 px  →  1 px ≈ 0.2646 mm.
    // Note: this produces consistent PDF sizing regardless of the display's
    // physical DPI (devicePixelRatio), because offsetWidth/Height are always
    // CSS pixel values (not physical pixels).
    const PX_TO_MM = 25.4 / 96; // ≈ 0.2646 mm per CSS pixel
    const pdfW     = cardW * PX_TO_MM;
    const pdfH     = cardH * PX_TO_MM;
    const pdf      = new jsPDF({
      orientation: pdfW > pdfH ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pdfW + 20, pdfH + 20],
    });
    pdf.addImage(imgData, 'PNG', 10, 10, pdfW, pdfH);
    pdf.save('cardify-card.pdf');
    showToast('PDF downloaded!', 'success');
  } catch (err) {
    console.error(err);
    showToast('PDF export failed.', 'error');
  }
}

/**
 * Exports the current cardState as a JSON template file.
 */
function exportJSON() {
  const state    = window.cardState;
  const jsonStr  = JSON.stringify(state, null, 2);
  const blob     = new Blob([jsonStr], { type: 'application/json' });
  const url      = URL.createObjectURL(blob);
  downloadFile(url, 'cardify-card.json');
  URL.revokeObjectURL(url);
  showToast('JSON downloaded!', 'success');
}

/**
 * Exports the card as a standalone HTML snippet.
 * Generates a self-contained HTML file with inline CSS.
 */
function exportHTML() {
  const state     = window.cardState;
  const platforms = window.SOCIAL_PLATFORMS || {};
  const isHoriz   = state.layout === 'horizontal';
  const r         = (state.borderRadius !== undefined ? state.borderRadius : 24) + 'px';
  const accent    = state.accentColor || '#4070f4';
  const bg        = state.bgColor     || '#ffffff';
  const textCol   = state.textColor   || '#333333';
  const font      = state.font        || 'Poppins';
  const fullName  = [state.firstName, state.lastName].filter(Boolean).join(' ') || 'Your Name';
  const profession = escapeHtml(state.profession || '');
  const bio        = escapeHtml(state.bio        || '');
  const iconStyle  = state.iconStyle || 'filled';

  const shadowArr = [
    'none',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 5px 20px rgba(0,0,0,0.14)',
    '0 10px 40px rgba(0,0,0,0.22)',
  ];
  const shadow = shadowArr[state.shadowLevel] || shadowArr[1];

  // Build social icons HTML
  let socialHTML = '';
  (state.socialLinks || []).forEach(link => {
    const info = platforms[link.platform];
    if (!info) return;
    const href  = link.url && link.url.trim() ? link.url.trim() : '#';
    let iconStyle2 = '';
    let svgStyle   = '';
    if (iconStyle === 'filled') {
      iconStyle2 = `background:${info.color};width:36px;height:36px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;`;
      svgStyle   = 'fill:#fff;width:18px;height:18px;';
    } else if (iconStyle === 'outline') {
      iconStyle2 = `border:2px solid ${info.color};width:36px;height:36px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;`;
      svgStyle   = `fill:${info.color};width:18px;height:18px;`;
    } else {
      iconStyle2 = `display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;`;
      svgStyle   = `fill:${info.color};width:20px;height:20px;`;
    }
    // Inline the SVG icon with inline styles
    const svgHtml = info.icon.replace('<svg ', `<svg style="${svgStyle}" `);
    socialHTML += `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" style="${iconStyle2}text-decoration:none;">${svgHtml}</a>`;
  });

  let photoHTML = '';
  if (state.photo) {
    photoHTML = `<img src="${state.photo}" alt="Profile" style="width:88px;height:88px;border-radius:50%;border:4px solid ${bg};object-fit:cover;display:block;" />`;
  } else {
    photoHTML = `<div style="width:88px;height:88px;border-radius:50%;border:4px solid ${bg};background:${accent};display:flex;align-items:center;justify-content:center;font-size:2.5rem;">👤</div>`;
  }

  let cardHTML = '';
  if (!isHoriz) {
    cardHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;width:320px;background:${bg};color:${textCol};border-radius:${r};box-shadow:${shadow};overflow:hidden;font-family:'${font}',sans-serif;">
      <div style="width:100%;height:90px;background:${accent};"></div>
      <div style="margin-top:-44px;z-index:1;">${photoHTML}</div>
      <div style="width:100%;padding:0.75rem 1.5rem 1.75rem;display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;">
        <h2 style="font-size:1.25rem;font-weight:700;margin:0 0 2px;">${escapeHtml(fullName)}</h2>
        <p style="font-size:0.82rem;font-weight:600;color:${accent};text-transform:uppercase;letter-spacing:0.06em;margin:0;">${profession}</p>
        <p style="font-size:0.82rem;opacity:0.7;line-height:1.55;margin:4px 0 0;">${bio}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:10px;">${socialHTML}</div>
      </div>
    </div>`;
  } else {
    cardHTML = `
    <div style="display:flex;flex-direction:row;width:480px;background:${bg};color:${textCol};border-radius:${r};box-shadow:${shadow};overflow:hidden;font-family:'${font}',sans-serif;position:relative;min-height:200px;">
      <div style="width:140px;background:${accent};display:flex;align-items:center;justify-content:center;flex-shrink:0;">${photoHTML}</div>
      <div style="flex:1;padding:1.75rem 1.5rem 1.75rem 2.5rem;display:flex;flex-direction:column;justify-content:center;gap:4px;">
        <h2 style="font-size:1.25rem;font-weight:700;margin:0 0 2px;">${escapeHtml(fullName)}</h2>
        <p style="font-size:0.82rem;font-weight:600;color:${accent};text-transform:uppercase;letter-spacing:0.06em;margin:0;">${profession}</p>
        <p style="font-size:0.82rem;opacity:0.7;line-height:1.55;margin:4px 0 0;">${bio}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">${socialHTML}</div>
      </div>
    </div>`;
  }

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${escapeHtml(fullName)} — Cardify Card</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;600;700&display=swap" rel="stylesheet"/>
  <style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f0f2f8;}</style>
</head>
<body>
${cardHTML}
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  downloadFile(url, 'cardify-card.html');
  URL.revokeObjectURL(url);
  showToast('HTML downloaded!', 'success');
}

/**
 * Escapes HTML special characters.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Initializes export button event listeners.
 */
function initExports() {
  document.getElementById('export-png').addEventListener('click', exportPNG);
  document.getElementById('export-svg').addEventListener('click', exportSVG);
  document.getElementById('export-pdf').addEventListener('click', exportPDF);
  document.getElementById('export-json').addEventListener('click', exportJSON);
  document.getElementById('export-html').addEventListener('click', exportHTML);
}

window.initExports = initExports;
window.exportPNG   = exportPNG;
window.exportSVG   = exportSVG;
window.exportPDF   = exportPDF;
window.exportJSON  = exportJSON;
window.exportHTML  = exportHTML;
