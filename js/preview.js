/**
 * preview.js
 * Renders the card preview from the current cardState.
 * Called whenever cardState changes.
 */

/**
 * Updates all visible elements of the card preview
 * based on the current cardState values.
 */
function renderPreview() {
  const state = window.cardState;
  if (!state) return;

  // Update text content
  const nameEl = document.getElementById('preview-name');
  if (nameEl) {
    const fullName = [state.firstName, state.lastName].filter(Boolean).join(' ') || 'Your Name';
    nameEl.textContent = fullName;
  }

  const profEl = document.getElementById('preview-profession');
  if (profEl) profEl.textContent = state.profession || 'Your Profession';

  const bioEl = document.getElementById('preview-bio');
  if (bioEl) bioEl.textContent = state.bio || '';

  // Update photo
  const photoImg         = document.getElementById('preview-photo');
  const photoPlaceholder = document.getElementById('preview-photo-placeholder');
  if (state.photo) {
    photoImg.src = state.photo;
    photoImg.style.display = '';
    if (photoPlaceholder) photoPlaceholder.style.display = 'none';
  } else {
    photoImg.src = '';
    photoImg.style.display = 'none';
    if (photoPlaceholder) photoPlaceholder.style.display = '';
  }

  applyCardStyles();
  applyLayout(state.layout);
  renderSocialIcons();
}

/**
 * Applies CSS variables to the card element for colors, fonts, etc.
 */
function applyCardStyles() {
  const state = window.cardState;
  const card  = document.getElementById('card-preview');
  if (!card || !state) return;

  card.style.setProperty('--card-bg',     state.bgColor     || '#ffffff');
  card.style.setProperty('--card-text',   state.textColor   || '#333333');
  card.style.setProperty('--card-accent', state.accentColor || '#4070f4');
  card.style.setProperty('--card-radius', (state.borderRadius !== undefined ? state.borderRadius : 24) + 'px');
  card.style.fontFamily = `'${state.font || 'Poppins'}', sans-serif`;

  // Background + text on card element itself
  card.style.backgroundColor = state.bgColor   || '#ffffff';
  card.style.color           = state.textColor || '#333333';
  card.style.borderRadius    = (state.borderRadius !== undefined ? state.borderRadius : 24) + 'px';

  // Shadow
  const shadows = [
    'none',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 5px 20px rgba(0,0,0,0.14)',
    '0 10px 40px rgba(0,0,0,0.22)',
  ];
  card.style.boxShadow = shadows[state.shadowLevel] || shadows[1];
}

/**
 * Switches between vertical and horizontal card layouts.
 * @param {'vertical'|'horizontal'} layout
 */
function applyLayout(layout) {
  const card = document.getElementById('card-preview');
  if (!card) return;
  card.classList.remove('vertical', 'horizontal');
  card.classList.add(layout || 'vertical');
}

/**
 * Renders social media icons into #preview-social.
 * Applies icon style (filled/outline/minimal) and brand colors.
 */
function renderSocialIcons() {
  const state     = window.cardState;
  const container = document.getElementById('preview-social');
  if (!container || !state) return;

  container.innerHTML = '';

  const platforms = window.SOCIAL_PLATFORMS || {};
  const iconStyle = state.iconStyle || 'filled';

  (state.socialLinks || []).forEach(link => {
    if (!link.platform || !platforms[link.platform]) return;

    const info = platforms[link.platform];
    const href = link.url && link.url.trim() ? link.url.trim() : '#';

    const a = document.createElement('a');
    a.href   = href;
    a.target = '_blank';
    a.rel    = 'noopener noreferrer';
    a.title  = info.label;
    a.className = `social-icon-link style-${iconStyle}`;

    const svgWrapper = document.createElement('span');
    svgWrapper.innerHTML = info.icon;
    const svg = svgWrapper.querySelector('svg');

    if (iconStyle === 'filled') {
      a.style.backgroundColor = info.color;
      if (svg) {
        svg.style.fill = '#ffffff';
        svg.querySelectorAll('path').forEach(p => p.style.fill = '#ffffff');
      }
    } else if (iconStyle === 'outline') {
      a.style.borderColor = info.color;
      a.style.color = info.color;
      if (svg) {
        svg.style.fill = info.color;
        svg.querySelectorAll('path').forEach(p => p.style.fill = info.color);
      }
    } else {
      // minimal
      a.style.color = info.color;
      if (svg) {
        svg.style.fill = info.color;
        svg.querySelectorAll('path').forEach(p => p.style.fill = info.color);
      }
    }

    if (svg) {
      a.appendChild(svg);
    } else {
      a.textContent = info.label.charAt(0);
    }

    container.appendChild(a);
  });
}

window.renderPreview    = renderPreview;
window.renderSocialIcons = renderSocialIcons;
window.applyCardStyles  = applyCardStyles;
window.applyLayout      = applyLayout;
