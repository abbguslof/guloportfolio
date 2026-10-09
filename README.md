# 🚀 GULO // Personal Cockpit & TUI Digital Garden (gulo.se)

```text
  ____ _   _ _     ___  
 / ___| | | | |   / _ \ 
| |  _| | | | |  | | | |
| |_| | |_| | |__| |_| |
 \____|\___/|_____\___/ 
 CHALMERS // D-24 // TUI WORKSTATION & DIGITAL PLAYGROUND
```

[![Site](https://img.shields.io/badge/Live-gulo.se-10b981?style=flat-square)](https://gulo.se)
[![Framework](https://img.shields.io/badge/Astro-7.x%20(SSG)-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Language](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Styling](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Typography](https://img.shields.io/badge/Font-JetBrains%20Mono-000000?style=flat-square&logo=jetbrains&logoColor=white)](https://www.jetbrains.com/lp/mono/)
[![Security](https://img.shields.io/badge/Security-CSP%20%2B%20XSS%20Hardened-10b981?style=flat-square)](#-security--hardening)

A personal digital garden, portfolio showcase, technical blog, and file distribution hub disguised as an interactive Unix/Linux TUI workstation. Hosted on **GitHub Pages** at **[gulo.se](https://gulo.se)**, built with **Astro 7 (Static Site Generation)**, **TypeScript**, and **Tailwind CSS v4** for maximum performance, battery efficiency, and zero layout shift.

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone git@github.com:abbguslof/guloportfolio.git
cd portfoliosite

# 2. Install dependencies
npm install

# 3. Start local development server (http://localhost:4321)
npm run dev

# 4. Build production static bundle (dist/)
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 🌿 Git Branching Strategy

This project uses a clean two-tier branching architecture:

```
feature/my-post  ───┐
                    ▼
develop branch  ────► (Daily authoring, writing & drafts)
                    │
                    ▼  Pull Request (Automated CI validation)
main branch     ────► (Production releases to gulo.se)
```

- **`develop`**: The primary working branch. Day-to-day writing, draft articles, and feature work happen here.
- **`main`**: The production release branch. Every push or merge to `main` automatically triggers GitHub Actions to build and deploy to **[gulo.se](https://gulo.se)**.
- **Automated CI**: Every pull request targeting `main` and pushes to `develop` run `.github/workflows/ci.yml` (`npm ci` & `npm run build`) to ensure broken builds never reach production.

---

## 🌐 GitHub Pages & Custom Domain (`gulo.se`)

The site is configured for automatic deployment to **GitHub Pages** with custom domain **`gulo.se`**:

1. **Custom Domain Binding**: `public/CNAME` contains `gulo.se`.
2. **Astro Base URL**: Configured with `site: 'https://gulo.se'` and `base: '/'` in `astro.config.mjs`.
3. **Automated Actions**: `.github/workflows/deploy.yml` builds and deploys artifacts automatically using GitHub's official Actions (`actions/deploy-pages@v4`).

### DNS Records Configuration
To point `gulo.se` to GitHub Pages:

| Type | Name | Target / Value |
| :--- | :--- | :--- |
| **A** | `@` (apex) | `185.199.108.153` |
| **A** | `@` (apex) | `185.199.109.153` |
| **A** | `@` (apex) | `185.199.110.153` |
| **A** | `@` (apex) | `185.199.111.153` |
| **CNAME** | `www` | `abbguslof.github.io` |

*In your GitHub repository settings, navigate to **Settings ➔ Pages** and ensure **Enforce HTTPS** is checked.*

---

## ✍️ Content Authoring & Overleaf Workflow

### CLI Scaffolding Tools
Create starter files in one command:

```bash
# New blog post / research note
npm run new:thought "my-new-post-title"

# New portfolio project
npm run new:project "riscv-emulator"

# New downloadable file descriptor
npm run new:download "my-backup-tool"
```

### 🎓 Academic & Overleaf LaTeX Workflow
For research notes or course reports written in **Overleaf / LaTeX**:
1. Compile your PDF in Overleaf.
2. Save the compiled PDF into `public/downloads/<slug>.pdf`.
3. In your Markdown frontmatter (`src/content/thoughts/<slug>.md`), specify:
   ```yaml
   pdfUrl: "/downloads/<slug>.pdf"
   pdfName: "Research Preprint (PDF, 420 KB)"
   ```
4. The article header will automatically render an interactive **"📄 Download Companion PDF (Overleaf / LaTeX preprint)"** badge and download button.

*For complete schema documentation and writing guidelines, read [CONTRIBUTING.md](CONTRIBUTING.md).*

---

## 🔒 Security & Hardening

- **Content Security Policy (CSP)**: Enforced via `<meta http-equiv="Content-Security-Policy">` restricting scripts, objects, and connect sources to origin.
- **Referrer Policy**: Strict cross-origin referrer policy (`strict-origin-when-cross-origin`).
- **Input Sanitization**: All user inputs in the terminal emulator (`git`, `guess`, `echo`, `cat`, `wget`, `calc`, etc.) are sanitized via `escapeHtml` to prevent client-side DOM XSS.
- **Dependency Audit**: Clean `npm audit` with 0 known vulnerabilities.
- **No External CDN Dependencies**: JetBrains Mono font, Tailwind, and assets are bundled locally for privacy, offline resilience, and speed.

---

## 🖥️ Core Workstation Features

- **Interactive TUI Terminal (`src/components/InteractiveTerminal.astro`)**:
  - 40+ commands: `help`, `grep` (pattern search with line numbers & highlights), `egrep`, `fgrep`, `git`, `calc`, `guess`, `echo`, `man`, `tldr`, `nvim`, `wget`, `status`, `school`, `swim`, `whoami`, `bg`, `fastfetch`.
  - Built-in safe expression evaluator (`calc 2^8 + 10`).
  - Simulated Neovim viewer (`nvim whoami.md`) with TokyoNight statusline.
  - Companion PDF downloading (`wget my-paper.pdf`) with dynamic autocomplete.
  - Tab auto-completion, Ctrl+C interrupt, Ctrl+L screen clear, command history (↑/↓ arrows).
- **Authentic Two-Stage Linux Kernel Boot Intro**:
  - Realistic 23-line dmesg cascade transitioning smoothly into a centered cockpit splash screen.
  - Natural typewriter animation typing "launching terminal" / "startar terminalen" with steady trailing dots and cursor.
  - 100% bilingual (EN / SV), reduced-motion friendly, instant-skip on any keypress or click, and replayable via the `reboot` / `reset` command.
- **Rich Open Graph Social Cards & Complete Favicon Suite**:
  - Custom 1200×630 Open Graph preview card (`/images/og-card.png`) featuring ambient cockpit glow, wolverine emblem, and terminal highlights.
  - Complete `og:*` and `twitter:card="summary_large_image"` metadata for rich previews on iMessage, Discord, WhatsApp, Twitter/X, and LinkedIn.
  - Multi-resolution icon set (`.svg` vector, `.ico` fallback, 32×32 and 16×16 PNGs, iOS `apple-touch-icon.png`) and Progressive Web App manifest (`site.webmanifest`).
- **Overleaf LaTeX / Markdown Parity & Companion PDFs**:
  - 1:1 parity with Overleaf LaTeX templates (`\entryMeta{TYPE}{DATE}{STATUS}{TAGS}`).
  - Optional `pdfUrl` and `pdfName` on thoughts and projects render a clean download button on the slug page (aligned next to the word count under tags).
  - Isolated from `/files` to keep the downloads hub clean.
  - Dynamically available in the terminal for `wget` and tab autocompletion only when defined.
- **Living Ambient Cockpit (`src/components/AmbientBackground.astro`)**:
  - Canvas 2D elevation contour waves (Standard) + WebGL shader effects (`topo`, `dither`, `ascii`, `dots`, `pixel`, `shimmer`, `off`).
  - Calibrated low opacities, zero battery drain when tab is backgrounded.
- **Live Diagnostics Grid (`src/components/Footer.astro`)**:
  - Resilient CSP-compliant same-origin ping measurement, location, uptime, and system nominal telemetry.
- **Full Keyboard Traversal (`src/scripts/keyboard-nav.ts`)**:
  - Complete navigation with `Tab`, `Shift+Tab`, `Esc`, `Enter`, and Arrow keys.

---

## 📁 Repository Structure

```text
portfoliosite/
├── .github/workflows/
│   ├── deploy.yml            # Automated GitHub Pages deployment
│   └── ci.yml                # CI build verification for PRs and develop
├── public/
│   ├── CNAME                 # Custom domain configuration (gulo.se)
│   ├── android-chrome-*.png  # Android Chrome PWA icons (192x192, 512x512)
│   ├── apple-touch-icon.png  # Apple iOS home screen / Safari touch icon (180x180)
│   ├── favicon.ico           # Multi-resolution legacy & scraper fallback icon
│   ├── favicon.svg           # High-resolution scalable vector favicon
│   ├── favicon-*.png         # Raster tab favicons (16x16, 32x32)
│   ├── site.webmanifest      # Progressive Web App manifest & theme config
│   ├── downloads/            # Binary assets (.pdf, .zip, .sh, .tar.gz)
│   ├── images/               # High-res graphics, logo variants & 1200x630 og-card.png
│   └── vendor/               # Ambient shader runtime
├── scripts/
│   └── scaffold.js           # CLI generator for thoughts, projects & downloads
├── src/
│   ├── components/           # Astro UI components (Header, Footer, Terminal...)
│   ├── content/              # Astro Content Layer collections
│   │   ├── downloads/        # JSON metadata descriptors
│   │   ├── projects/         # Markdown project writeups
│   │   └── thoughts/         # Markdown notes & articles
│   ├── data/                 # Configs, i18n dictionary, fastfetch & status.ts
│   ├── layouts/              # Layout.astro with CSP, Open Graph, SEO & canonical URL
│   ├── pages/                # Route pages (index, projects, thoughts, files, 404)
│   ├── scripts/              # Terminal dispatcher, calc, git, nvim, i18n
│   └── styles/               # Tailwind v4 theme & global styles
├── templates/                # Markdown & JSON starter templates
├── AGENTS.md                 # Agent guidelines and dev server commands
├── CONTRIBUTING.md           # Authoring manual and content guide
├── astro.config.mjs          # Astro config (site: https://gulo.se)
└── package.json              # Dependencies and scaffolding scripts
```

---

## 📜 License

Built with curiosity and playground spirit. Released under the [MIT License](LICENSE).
