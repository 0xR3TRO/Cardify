/**
 * templates.js
 * Manages saving/loading card templates.
 * Persists user templates to localStorage.
 * Provides 3 built-in starter templates.
 */

const STORAGE_KEY = 'cardify_templates';

/**
 * Built-in starter templates — Minimal, Modern, Bold.
 */
const DEFAULT_TEMPLATES = [
  {
    id: 'minimal',
    name: 'Minimal',
    thumbnail: '⬜',
    state: {
      firstName: 'Alex', lastName: 'Morgan',
      profession: 'Product Designer',
      bio: 'Designing experiences that matter.',
      photo: null,
      socialLinks: [],
      layout: 'vertical',
      accentColor: '#374151', bgColor: '#f9fafb', textColor: '#111827',
      font: 'Inter', borderRadius: 8, shadowLevel: 1, iconStyle: 'minimal',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    thumbnail: '🟦',
    state: {
      firstName: 'Sam', lastName: 'Chen',
      profession: 'Full-Stack Developer',
      bio: 'Building the future, one commit at a time.',
      photo: null,
      socialLinks: [{ id: 'tpl-modern-1', platform: 'github', url: 'https://github.com' }],
      layout: 'vertical',
      accentColor: '#0ea5e9', bgColor: '#0f172a', textColor: '#e2e8f0',
      font: 'Montserrat', borderRadius: 20, shadowLevel: 2, iconStyle: 'filled',
    },
  },
  {
    id: 'bold',
    name: 'Bold',
    thumbnail: '🟣',
    state: {
      firstName: 'Jordan', lastName: 'Rivera',
      profession: 'Creative Director',
      bio: 'Vision + Craft = Magic.',
      photo: null,
      socialLinks: [
        { id: 'tpl-bold-1', platform: 'instagram', url: 'https://instagram.com' },
        { id: 'tpl-bold-2', platform: 'linkedin',  url: 'https://linkedin.com'  },
      ],
      layout: 'horizontal',
      accentColor: '#7c3aed', bgColor: '#1e1b4b', textColor: '#ede9fe',
      font: 'Playfair Display', borderRadius: 16, shadowLevel: 3, iconStyle: 'filled',
    },
  },
];

/** Thumbnail emojis cycled when saving new user templates. */
const TEMPLATE_THUMBNAIL_EMOJIS = ['🔵','🟢','🟠','🟡','🔴','🟤','⚫','⚪'];

/**
 * Loads user-saved templates from localStorage.
 * @returns {Array}
 */
function getSavedTemplates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves a new template to localStorage.
 * @param {string} name
 * @param {Object} state
 */
function saveTemplate(name, state) {
  const templates = getSavedTemplates();
  const id        = generateId();
  const thumb     = TEMPLATE_THUMBNAIL_EMOJIS[templates.length % TEMPLATE_THUMBNAIL_EMOJIS.length];
  templates.push({
    id,
    name: name || 'My Template',
    thumbnail: thumb,
    state: JSON.parse(JSON.stringify(state)),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  return id;
}

/**
 * Deletes a saved template by ID.
 * @param {string} id
 */
function deleteTemplate(id) {
  const templates = getSavedTemplates().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

/**
 * Creates and returns a template card DOM element.
 * @param {Object} tpl  - { id, name, thumbnail, state }
 * @param {boolean} deletable - whether to show a delete button
 * @returns {HTMLElement}
 */
function createTemplateCardEl(tpl, deletable) {
  const card = document.createElement('div');
  card.className = 'template-card';
  card.title = tpl.name;

  const thumb = document.createElement('span');
  thumb.className = 'template-thumb';
  thumb.textContent = tpl.thumbnail || '📋';

  const nameEl = document.createElement('span');
  nameEl.className = 'template-name';
  nameEl.textContent = tpl.name;

  card.appendChild(thumb);
  card.appendChild(nameEl);

  if (deletable) {
    const delBtn = document.createElement('button');
    delBtn.className = 'template-delete';
    delBtn.innerHTML = '✕';
    delBtn.title = 'Delete template';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTemplate(tpl.id);
      renderSavedTemplates();
      showToast('Template deleted.', 'info');
    });
    card.appendChild(delBtn);
  }

  card.addEventListener('click', () => {
    loadStateIntoEditor(tpl.state);
    showToast(`Template "${tpl.name}" loaded!`, 'success');
  });

  return card;
}

/**
 * Renders the starter template cards in the UI.
 */
function renderStarterTemplates() {
  const container = document.getElementById('starter-templates');
  if (!container) return;
  container.innerHTML = '';
  DEFAULT_TEMPLATES.forEach(tpl => {
    container.appendChild(createTemplateCardEl(tpl, false));
  });
}

/**
 * Renders the user-saved template cards in the UI.
 */
function renderSavedTemplates() {
  const container = document.getElementById('saved-templates');
  if (!container) return;
  container.innerHTML = '';
  const saved = getSavedTemplates();
  if (saved.length === 0) {
    const empty = document.createElement('p');
    empty.style.cssText = 'font-size:0.78rem;color:var(--text-secondary);font-style:italic;';
    empty.textContent = 'No saved templates yet.';
    container.appendChild(empty);
    return;
  }
  saved.forEach(tpl => {
    container.appendChild(createTemplateCardEl(tpl, true));
  });
}

/**
 * Initializes the template system and renders all template UI.
 */
function initTemplates() {
  renderStarterTemplates();
  renderSavedTemplates();

  const saveBtn = document.getElementById('save-template-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const name = prompt('Enter a name for this template:', 'My Card');
      if (name === null) return; // user cancelled
      saveTemplate(name.trim() || 'My Card', window.cardState);
      renderSavedTemplates();
      showToast('Template saved!', 'success');
    });
  }
}

window.initTemplates        = initTemplates;
window.renderStarterTemplates = renderStarterTemplates;
window.renderSavedTemplates   = renderSavedTemplates;
window.getSavedTemplates      = getSavedTemplates;
window.saveTemplate           = saveTemplate;
window.deleteTemplate         = deleteTemplate;
