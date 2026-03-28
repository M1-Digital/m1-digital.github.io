# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing website for M1 Digital Pty Ltd, a fintech company specializing in blockchain payment solutions. Hosted on GitHub Pages at m1-digital.com.

## Tech Stack

- **No build system** — pure HTML5, CSS3, vanilla JavaScript
- **No package manager** — no npm, Gemfile, or dependencies beyond Google Fonts (Inter)
- **Deployment**: Push to `main` branch auto-deploys via GitHub Pages
- **Custom domain**: m1-digital.com (configured via CNAME file)

## Development

To develop locally, serve the directory with any static file server:
```
npx serve .
# or
python -m http.server 8000
```

There are no build, lint, or test commands.

## Architecture

### Content Model

The site uses a hybrid content approach:
- **HTML pages** (`index.html`, `contact.html`) — full page layouts with embedded structure
- **Markdown files** (`*_page.md`, `index.md`) — content source for each section

Pages: Home, About, Services, Technology, Industries, News, Contact.

### Styling (`styles.css`)

- CSS custom properties for theming (`--primary-color`, `--bg-color`, etc.)
- Light/dark theme via `[data-theme="dark"]` attribute on `<html>`
- Mobile-first responsive design with hamburger menu
- Animated hero section (grid background, blockchain chain, crypto symbols, hash particles, data flow streams)

### JavaScript (`script.js`)

- Theme toggle with `localStorage` persistence
- Mobile hamburger menu
- Smooth scrolling for anchor links
- FAQ accordion toggle

### Branding

Brand guidelines live in `m1_digital_branding.md`. Key values:
- **Primary color (M1 Blue)**: #0066CC
- **Font**: Inter (Google Fonts), weights 300–900
- **Tone**: Professional yet approachable, clear and direct

### Assets

- `m1_digital_logo.svg` — primary logo (themed via CSS variables)
- `CNAME` — GitHub Pages custom domain config
