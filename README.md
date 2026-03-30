# Cardify Creator

Cardify Creator is a browser-based personal card builder for designing, previewing, and exporting modern digital profile cards.

It provides a structured editing panel, live responsive preview, template management, and multi-format export in a lightweight vanilla JavaScript architecture.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Template System](#template-system)
- [Export System](#export-system)
- [Data Model](#data-model)
- [Configuration Notes](#configuration-notes)
- [Browser Compatibility](#browser-compatibility)
- [Troubleshooting](#troubleshooting)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [License](#license)

## Overview

The application is designed around a single-page workflow:

- Edit identity, social links, and visual style.
- See instant rendering updates in the preview stage.
- Save reusable templates in `localStorage`.
- Export the final card as PNG, SVG, PDF, JSON, or standalone HTML.

The app is intentionally backend-free, making it suitable for fast local usage, prototyping, and static hosting.

## Key Features

- Real-time card editor with debounced identity input updates.
- Three card layouts: `vertical`, `horizontal`, `compact`.
- Three social icon styles: `filled`, `outline`, `minimal`.
- Theme toggle (`light`/`dark`) with preference persistence.
- Profile photo upload with initials-based fallback avatar.
- Starter templates + user-defined templates.
- Template import/export with schema normalization.
- Multi-format asset export pipeline:
  - PNG via `html2canvas`
  - PDF via `jsPDF`
  - SVG via `foreignObject` serialization
  - JSON state snapshot
  - Standalone HTML document export
- Responsive UI with dedicated mobile editor toggle behavior.

## Tech Stack

- HTML5
- CSS3 (custom properties, responsive grid, media queries)
- Vanilla JavaScript (ES Modules)
- Third-party libraries (local vendor files):
  - `html2canvas` for raster rendering
  - `jsPDF` for PDF generation

## Architecture

The codebase is split into focused modules:

- `js/main.js`: application bootstrap.
- `js/editor.js`: state management, event binding, template lifecycle.
- `js/preview.js`: rendering engine for card visuals and adaptive scaling.
- `js/export.js`: export orchestration for all output formats.
- `js/templates.js`: built-in templates and `localStorage` persistence.
- `js/utils.js`: shared utility helpers.

State-driven rendering pattern:

1. UI controls mutate a normalized in-memory `state`.
2. `previewController.render()` translates state into DOM/CSS variable updates.
3. Export handlers clone the rendered card and produce downloadable assets.

## Project Structure

```text
Cardify/
├── assets/
│   ├── icons/                # Social platform SVG icons
│   └── libs/                 # Vendor bundles (html2canvas, jsPDF)
├── js/
│   ├── editor.js             # Orchestration and state updates
│   ├── export.js             # PNG/SVG/PDF/JSON/HTML export
│   ├── main.js               # Entry point
│   ├── preview.js            # Render + responsive scale logic
│   ├── templates.js          # Starter/saved templates + persistence
│   └── utils.js              # Shared utilities
├── index.html                # App shell
├── style.css                 # UI and card styling
└── README.md
```

## Getting Started

### Prerequisites

- A modern browser (Chrome, Edge, Firefox, Safari).
- A local static server (recommended due to ES module loading).

### Run Locally

From the project root, start any static server:

```bash
# Python 3
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Usage Guide

1. Fill in identity fields (`First Name`, `Last Name`, `Profession`, `Bio`).
2. Upload an optional profile image or keep the initials fallback.
3. Add and configure social links.
4. Tune appearance settings:
   - Layout
   - Icon style
   - Font
   - Colors
   - Border radius
   - Shadow level
   - Spacing
5. Apply a starter template or save your custom template.
6. Export in the preferred output format.

## Template System

### Starter Templates

Defined in `js/templates.js` and always available on load.

### Saved Templates

Persisted in browser `localStorage` under:

```text
cardify.creator.templates.v1
```

### Import/Export Behavior

- Exported template pack includes metadata (`version`, `exportedAt`, `templates`).
- Imported templates are normalized before persistence.
- Invalid or incomplete payloads are rejected.

## Export System

### Supported Formats

- `PNG`: high-resolution canvas render.
- `SVG`: inline-styled `foreignObject` document.
- `PDF`: image embed with dynamic page sizing.
- `JSON`: full editor state.
- `HTML`: standalone document with inlined card styles.

### Export Notes

- Export filenames are derived from profile name and sanitized.
- SVG/HTML exports include font imports for visual consistency.
- Some format differences can occur across browsers due to rendering engines.

## Data Model

Core editor state shape:

```json
{
  "firstName": "Avery",
  "lastName": "Stone",
  "profession": "Product Engineer",
  "bio": "Building crisp interfaces and useful tooling for modern teams.",
  "photoDataUrl": "",
  "socialLinks": [
    {
      "id": "default_linkedin",
      "platform": "linkedin",
      "url": "https://linkedin.com"
    }
  ],
  "layout": "vertical",
  "iconStyle": "filled",
  "fontFamily": "Space Grotesk",
  "backgroundColor": "#ffffff",
  "textColor": "#14213d",
  "accentColor": "#0d9488",
  "borderRadius": 24,
  "shadowLevel": 2,
  "spacing": 24
}
```

Validation and normalization are applied when loading/importing templates (e.g., clamping range values, validating color and layout tokens).

## Configuration Notes

- UI theme preference key:

```text
cardify.creator.ui-theme
```

- Maximum social links per card: `12`.
- Supported social platforms are defined in `js/preview.js`.

## Browser Compatibility

Best experience in current versions of:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

If export features fail in older browsers, update to a recent version with full ES module and modern canvas support.

## Troubleshooting

- App does not load modules:
  - Use a local HTTP server instead of opening `index.html` directly with `file://`.
- Export output looks different than preview:
  - Verify browser zoom level and test another browser engine.
- Imported templates are not visible:
  - Confirm JSON payload shape and required fields.

## Development Workflow

- Keep modules focused by concern (`editor`, `preview`, `export`, `templates`, `utils`).
- Prefer pure helpers for normalization/formatting logic.
- Preserve state schema compatibility when extending template import/export logic.
- If adding new social providers:
  - Add icon asset to `assets/icons/`
  - Register metadata in `SOCIAL_NETWORKS` in `js/preview.js`

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Implement and verify your change locally.
4. Open a pull request with:
   - Problem statement
   - Solution summary
   - Manual test notes

## License

This project is licensed under the MIT License.

See [LICENSE](LICENSE) for full text.
