/**
 * editor.js
 * Manages the editor panel: reads form inputs, applies changes to app state,
 * and triggers live preview updates.
 */

/**
 * Available social media platforms with their brand colors and inline SVG paths.
 */
const SOCIAL_PLATFORMS = {
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  },
  twitter: {
    label: 'Twitter/X',
    color: '#000000',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.859L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>',
  },
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  },
  youtube: {
    label: 'YouTube',
    color: '#FF0000',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  },
  github: {
    label: 'GitHub',
    color: '#181717',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
  },
  tiktok: {
    label: 'TikTok',
    color: '#000000',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
  },
};

/**
 * App state — single source of truth for all card data and settings.
 * Exported globally as `window.cardState`.
 */
const cardState = {
  firstName: 'John',
  lastName: 'Doe',
  profession: 'UI/UX Designer',
  bio: 'A short description about yourself.',
  photo: null,
  socialLinks: [],
  layout: 'vertical',
  accentColor: '#4070f4',
  bgColor: '#ffffff',
  textColor: '#333333',
  font: 'Poppins',
  borderRadius: 24,
  shadowLevel: 1,
  iconStyle: 'filled',
};

window.cardState = cardState;
window.SOCIAL_PLATFORMS = SOCIAL_PLATFORMS;

/**
 * Initializes the editor: attaches all event listeners to form inputs.
 */
function initEditor() {
  // Profile text inputs
  const firstNameInput = document.getElementById('input-firstname');
  const lastNameInput  = document.getElementById('input-lastname');
  const professionInput = document.getElementById('input-profession');
  const bioInput       = document.getElementById('input-bio');

  // Populate defaults
  firstNameInput.value  = cardState.firstName;
  lastNameInput.value   = cardState.lastName;
  professionInput.value = cardState.profession;
  bioInput.value        = cardState.bio;

  const handleTextChange = debounce(() => {
    cardState.firstName  = firstNameInput.value.trim();
    cardState.lastName   = lastNameInput.value.trim();
    cardState.profession = professionInput.value.trim();
    cardState.bio        = bioInput.value.trim();
    renderPreview();
  }, 80);

  firstNameInput.addEventListener('input', handleTextChange);
  lastNameInput.addEventListener('input', handleTextChange);
  professionInput.addEventListener('input', handleTextChange);
  bioInput.addEventListener('input', handleTextChange);

  // Photo upload
  const photoInput   = document.getElementById('input-photo');
  const removePhoto  = document.getElementById('remove-photo');

  photoInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file.', 'error');
      return;
    }
    try {
      cardState.photo = await fileToBase64(file);
      removePhoto.style.display = '';
      renderPreview();
      showToast('Photo uploaded!', 'success');
    } catch {
      showToast('Failed to load image.', 'error');
    }
  });

  removePhoto.addEventListener('click', () => {
    cardState.photo = null;
    photoInput.value = '';
    removePhoto.style.display = 'none';
    renderPreview();
    showToast('Photo removed.', 'info');
  });

  // Social links
  document.getElementById('add-social-link').addEventListener('click', () => {
    addSocialLinkRow(null);
  });

  // Appearance — layout
  document.querySelectorAll('.layout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cardState.layout = btn.dataset.layout;
      renderPreview();
    });
  });

  // Appearance — colors
  const accentInput = document.getElementById('color-accent');
  const bgInput     = document.getElementById('color-bg');
  const textInput   = document.getElementById('color-text');

  accentInput.value = cardState.accentColor;
  bgInput.value     = cardState.bgColor;
  textInput.value   = cardState.textColor;

  accentInput.addEventListener('input', () => {
    cardState.accentColor = accentInput.value;
    renderPreview();
  });
  bgInput.addEventListener('input', () => {
    cardState.bgColor = bgInput.value;
    renderPreview();
  });
  textInput.addEventListener('input', () => {
    cardState.textColor = textInput.value;
    renderPreview();
  });

  // Appearance — font
  const fontSelect = document.getElementById('font-select');
  fontSelect.value = cardState.font;
  fontSelect.addEventListener('change', () => {
    cardState.font = fontSelect.value;
    renderPreview();
  });

  // Appearance — border radius
  const radiusRange = document.getElementById('border-radius');
  const radiusVal   = document.getElementById('border-radius-val');
  radiusRange.value = cardState.borderRadius;
  radiusVal.textContent = cardState.borderRadius;
  radiusRange.addEventListener('input', () => {
    cardState.borderRadius = parseInt(radiusRange.value, 10);
    radiusVal.textContent = cardState.borderRadius;
    renderPreview();
  });

  // Appearance — shadow
  const shadowRange = document.getElementById('shadow-intensity');
  const shadowVal   = document.getElementById('shadow-intensity-val');
  const shadowLabels = ['none', 'small', 'medium', 'large'];
  shadowRange.value = cardState.shadowLevel;
  shadowVal.textContent = shadowLabels[cardState.shadowLevel] || 'medium';
  shadowRange.addEventListener('input', () => {
    cardState.shadowLevel = parseInt(shadowRange.value, 10);
    shadowVal.textContent = shadowLabels[cardState.shadowLevel] || 'medium';
    renderPreview();
  });

  // Appearance — icon style
  document.querySelectorAll('.icon-style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.icon-style-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cardState.iconStyle = btn.dataset.style;
      renderPreview();
    });
  });
}

/**
 * Adds a new social link row to the editor UI.
 * @param {{id: string, platform: string, url: string}|null} linkData
 */
function addSocialLinkRow(linkData) {
  const id       = (linkData && linkData.id) ? linkData.id : generateId();
  const platform = (linkData && linkData.platform) ? linkData.platform : 'facebook';
  const url      = (linkData && linkData.url) ? linkData.url : '';

  if (!linkData) {
    cardState.socialLinks.push({ id, platform, url });
  }

  const container = document.getElementById('social-links-editor');

  const row = document.createElement('div');
  row.className = 'social-link-row';
  row.dataset.id = id;

  // Platform select
  const select = document.createElement('select');
  Object.entries(SOCIAL_PLATFORMS).forEach(([key, info]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = info.label;
    if (key === platform) opt.selected = true;
    select.appendChild(opt);
  });

  // URL input
  const input = document.createElement('input');
  input.type = 'url';
  input.placeholder = 'https://...';
  input.value = url;

  // Remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'social-link-remove';
  removeBtn.innerHTML = '✕';
  removeBtn.title = 'Remove';

  removeBtn.addEventListener('click', () => {
    removeSocialLinkRow(id);
  });

  select.addEventListener('change', () => {
    const link = cardState.socialLinks.find(l => l.id === id);
    if (link) link.platform = select.value;
    renderPreview();
  });

  input.addEventListener('input', debounce(() => {
    const link = cardState.socialLinks.find(l => l.id === id);
    if (link) link.url = input.value.trim();
    renderPreview();
  }, 200));

  row.appendChild(select);
  row.appendChild(input);
  row.appendChild(removeBtn);
  container.appendChild(row);

  renderPreview();
}

/**
 * Removes a social link row by ID.
 * @param {string} id
 */
function removeSocialLinkRow(id) {
  cardState.socialLinks = cardState.socialLinks.filter(l => l.id !== id);
  const row = document.querySelector(`.social-link-row[data-id="${id}"]`);
  if (row) row.remove();
  renderPreview();
}

/**
 * Populates the editor form from a state object (used when loading templates).
 * @param {Object} state
 */
function loadStateIntoEditor(state) {
  // Copy state properties
  Object.assign(cardState, JSON.parse(JSON.stringify(state)));
  window.cardState = cardState;

  // Repopulate form fields
  document.getElementById('input-firstname').value  = cardState.firstName || '';
  document.getElementById('input-lastname').value   = cardState.lastName  || '';
  document.getElementById('input-profession').value = cardState.profession || '';
  document.getElementById('input-bio').value        = cardState.bio || '';

  // Photo
  const removePhoto = document.getElementById('remove-photo');
  if (cardState.photo) {
    removePhoto.style.display = '';
  } else {
    removePhoto.style.display = 'none';
    document.getElementById('input-photo').value = '';
  }

  // Colors
  document.getElementById('color-accent').value = cardState.accentColor || '#4070f4';
  document.getElementById('color-bg').value     = cardState.bgColor     || '#ffffff';
  document.getElementById('color-text').value   = cardState.textColor   || '#333333';

  // Font
  const fontSelect = document.getElementById('font-select');
  fontSelect.value = cardState.font || 'Poppins';

  // Border radius
  const radiusRange = document.getElementById('border-radius');
  const radiusVal   = document.getElementById('border-radius-val');
  radiusRange.value = cardState.borderRadius !== undefined ? cardState.borderRadius : 24;
  radiusVal.textContent = radiusRange.value;

  // Shadow
  const shadowRange  = document.getElementById('shadow-intensity');
  const shadowVal    = document.getElementById('shadow-intensity-val');
  const shadowLabels = ['none', 'small', 'medium', 'large'];
  shadowRange.value = cardState.shadowLevel !== undefined ? cardState.shadowLevel : 1;
  shadowVal.textContent = shadowLabels[parseInt(shadowRange.value, 10)] || 'medium';

  // Layout buttons
  document.querySelectorAll('.layout-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.layout === cardState.layout);
  });

  // Icon style buttons
  document.querySelectorAll('.icon-style-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.style === cardState.iconStyle);
  });

  // Clear and re-render social link rows
  const container = document.getElementById('social-links-editor');
  container.innerHTML = '';
  if (Array.isArray(cardState.socialLinks)) {
    cardState.socialLinks.forEach(link => addSocialLinkRow(link));
  }

  renderPreview();
}

window.loadStateIntoEditor = loadStateIntoEditor;
window.addSocialLinkRow    = addSocialLinkRow;
window.removeSocialLinkRow = removeSocialLinkRow;
window.initEditor          = initEditor;
