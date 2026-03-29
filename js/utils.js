/**
 * utils.js
 * Shared helper functions used across all modules.
 */

/**
 * Generates a unique ID for social links, template IDs, etc.
 * @returns {string}
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Converts an image File to a base64 data URL.
 * @param {File} file
 * @returns {Promise<string>} base64 data URL
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Shows a toast notification message.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type}`;
  // Force reflow so the class addition triggers the transition
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Debounces a function call.
 * @param {Function} fn
 * @param {number} delay ms
 * @returns {Function}
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Downloads a blob or data URL as a file.
 * @param {string} url - blob URL or data URL
 * @param {string} filename
 */
function downloadFile(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Clones the card element cleanly for export.
 * @returns {HTMLElement}
 */
function cloneCardForExport() {
  const card = document.getElementById('card-preview');
  return card.cloneNode(true);
}

/**
 * Gets computed CSS variable values from the card element.
 * @returns {Object} map of variable names to values
 */
function getCardInlineStyles() {
  const card = document.getElementById('card-preview');
  const computed = getComputedStyle(card);
  return {
    '--card-bg':     computed.getPropertyValue('--card-bg').trim() || card.style.getPropertyValue('--card-bg').trim(),
    '--card-text':   computed.getPropertyValue('--card-text').trim() || card.style.getPropertyValue('--card-text').trim(),
    '--card-accent': computed.getPropertyValue('--card-accent').trim() || card.style.getPropertyValue('--card-accent').trim(),
    '--card-radius': computed.getPropertyValue('--card-radius').trim() || card.style.getPropertyValue('--card-radius').trim(),
    '--card-shadow': computed.getPropertyValue('--card-shadow').trim() || card.style.getPropertyValue('--card-shadow').trim(),
    fontFamily:      computed.fontFamily,
    backgroundColor: computed.backgroundColor,
    color:           computed.color,
    borderRadius:    computed.borderRadius,
    boxShadow:       computed.boxShadow,
  };
}
