/**
 * main.js
 * Application entry point.
 * Initializes all modules and wires them together.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize modules in order
  initTemplates();   // templates.js — renders template UI
  initEditor();      // editor.js — sets up form listeners
  initExports();     // export.js — attaches export button listeners
  renderPreview();   // preview.js — initial render

  // Dark/light mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  const html        = document.documentElement;

  const savedTheme = localStorage.getItem('cardify_theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('cardify_theme', next);
  });

  // Mobile editor toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const editorPanel  = document.getElementById('editor-panel');

  mobileToggle.addEventListener('click', () => {
    editorPanel.classList.toggle('mobile-open');
    mobileToggle.textContent = editorPanel.classList.contains('mobile-open') ? '✕' : '☰';
  });

  // Close editor panel when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (
      window.innerWidth <= 900 &&
      editorPanel.classList.contains('mobile-open') &&
      !editorPanel.contains(e.target) &&
      e.target !== mobileToggle
    ) {
      editorPanel.classList.remove('mobile-open');
      mobileToggle.textContent = '☰';
    }
  });

  // Collapsible sections
  document.querySelectorAll('.section-header').forEach(header => {
    header.querySelector('.collapse-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const section = header.closest('.editor-section');
      section.classList.toggle('collapsed');
    });

    // Also allow clicking anywhere on the header to toggle
    header.addEventListener('click', (e) => {
      if (e.target.classList.contains('collapse-btn')) return;
      const section = header.closest('.editor-section');
      section.classList.toggle('collapsed');
    });
  });
});
