# GULO // Personal Site & Terminal (gulo.se)

```text
  ____ _   _ _     ___
 / ___| | | | |   / _ \
| |  _| | | | |  | | | |
| |_| | |_| | |__| |_| |
  \____|\___/|_____\___/
 CHALMERS D-24 // PERSONAL SITE & TERMINAL
```

[![Site](https://img.shields.io/badge/Live-gulo.se-10b981?style=flat-square)](https://gulo.se)
[![Framework](https://img.shields.io/badge/Astro-7.x%20(SSG)-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Language](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Styling](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Typography](https://img.shields.io/badge/Font-JetBrains%20Mono-000000?style=flat-square&logo=jetbrains&logoColor=white)](https://www.jetbrains.com/lp/mono/)
[![Security](https://img.shields.io/badge/Security-CSP%20%2B%20XSS%20Hardened-10b981?style=flat-square)](#-security)
[![Source](https://img.shields.io/badge/Source-GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/abbguslof/guloportfolio)

A personal site with an interactive Unix terminal, a writing archive, and a file shelf. It runs on GitHub Pages at [gulo.se](https://gulo.se) and builds with Astro 7 (static generation), TypeScript, and Tailwind CSS v4.

The source lives at [github.com/abbguslof/guloportfolio](https://github.com/abbguslof/guloportfolio).

## Using This Repository

This is my personal site, not a template. I publish the source so you can read it and learn how it works. I do not accept pull requests.

Please do not copy, redeploy, or publish this site as your own. The code and content are all rights reserved; see [LICENSE](LICENSE). If you want to reuse a specific piece, ask me first.

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/abbguslof/guloportfolio.git
cd guloportfolio

# 2. Install dependencies
npm install

# 3. Start the dev server (http://localhost:4321)
npm run dev

# 4. Build the static site into dist/
npm run build

# 5. Preview the production build
npm run preview
```

## How It Works

Astro builds the whole site ahead of time. There is no server at runtime; the output is HTML, CSS, and ES modules.

1. Astro validates Markdown and JSON in `src/content/` against the schemas in `src/content.config.ts`.
2. `src/pages/` defines the routes. Each `[slug].astro` file renders one page per content entry at build time.
3. `InteractiveTerminal.astro` starts a TypeScript shell in the browser. The commands in `src/scripts/terminal/` work on in-memory state and download links, and the browser exposes no real shell.
4. `npm run build` runs `astro build` and writes `dist/`.
5. GitHub Actions uploads `dist/` as a Pages artifact, and `actions/deploy-pages@v4` publishes it.
6. The terminal can send messages and anonymous command telemetry to Supabase. Without credentials the site still builds, and the backend features stay off.

## Git Branching Strategy

The repository uses two long-lived branches.

```
feature/my-post  ───┐
                    ▼
develop branch  ────► (drafts, features, testing)
                    │
                    ▼  pull request (CI validation)
main branch     ────► (production at gulo.se)
```

- **`develop`** is the working branch for drafts and features.
- **`main`** is production. A push or merge to `main` triggers GitHub Actions to build and deploy to [gulo.se](https://gulo.se).
- Pull requests to `main` and pushes to `develop` run `.github/workflows/ci.yml` (`npm ci` and `npm run build`), so a broken build fails before it reaches production.

## GitHub Pages and Custom Domain (gulo.se)

Three files connect the repository to GitHub Pages:

1. `public/CNAME` contains `gulo.se`.
2. `astro.config.mjs` sets `site: 'https://gulo.se'` and `base: '/'`.
3. `.github/workflows/deploy.yml` builds the site and publishes the artifact with `actions/deploy-pages@v4`.

### DNS Records

Point `gulo.se` at GitHub Pages with these records:

| Type | Name | Target / Value |
| :--- | :--- | :--- |
| **A** | `@` (apex) | `185.199.108.153` |
| **A** | `@` (apex) | `185.199.109.153` |
| **A** | `@` (apex) | `185.199.110.153` |
| **A** | `@` (apex) | `185.199.111.153` |
| **CNAME** | `www` | `abbguslof.github.io` |

In the repository, open **Settings ➔ Pages** and enable **Enforce HTTPS** after GitHub issues the certificate.

### Deploy Your Own Copy

1. Fork or clone the repository and push it to your GitHub account.
2. Run `npm install`. Set `site` in `astro.config.mjs` to your domain and update `public/CNAME`. For a stock `*.github.io` URL, delete `public/CNAME` and leave `base: '/'`.
3. Open **Settings ➔ Pages ➔ Build and deployment** and set **Source** to **GitHub Actions**. Free accounts can publish Pages from public repositories; private-repo Pages needs a paid plan.
4. Add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_KEY` under **Settings ➔ Secrets and variables ➔ Actions** if you want the backend. The workflows read either a secret or a variable. Skip this and the site still builds.
5. Push to `main`. `deploy.yml` builds and deploys, and `ci.yml` checks pull requests and `develop`.
6. For a custom domain, add the DNS records above, set the domain under **Settings ➔ Pages**, and enable **Enforce HTTPS** once the certificate exists.

## Optional: Supabase Backend

The message board and command telemetry need Supabase. The rest of the site does not.

1. Create a project at [supabase.com](https://supabase.com).
2. Run the schema in the SQL editor, or use the Supabase CLI (`supabase db push`) with [`supabase/migrations/20261009_terminal_schema.sql`](supabase/migrations/20261009_terminal_schema.sql).
3. Copy `.env.example` to `.env.local` and fill in your project URL and publishable key.
4. Add the same values as Actions secrets or variables named `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_KEY`.
5. Keep service-role keys out of the browser. The publishable key is safe to ship because RLS allows inserts only on the two tables and no public select.

## Content Authoring and Overleaf Workflow

### CLI Scaffolding

Create starter files in one command:

```bash
# New blog post or research note
npm run new:thought "my-new-post-title"

# New portfolio project
npm run new:project "riscv-emulator"

# New downloadable file descriptor
npm run new:download "my-backup-tool"
```

### Overleaf and LaTeX

For research notes or course reports written in Overleaf:

1. Compile your PDF in Overleaf.
2. Save the PDF to `public/downloads/<slug>.pdf`.
3. Add the file to your Markdown frontmatter in `src/content/thoughts/<slug>.md`:
   ```yaml
   pdfUrl: "/downloads/<slug>.pdf"
   pdfName: "Research Preprint (PDF, 420 KB)"
   ```
4. The article header then shows a download button for the PDF.

For schema details and writing guidelines, read [AUTHORING.md](AUTHORING.md).

## Security

- **CSP**: sources are limited to `self`, with `object-src 'none'`, `base-uri 'self'`, and `form-action 'self'`. The boot sequence and terminal need inline scripts; user input is escaped before rendering.
- **Referrer policy**: `strict-origin-when-cross-origin`.
- **Terminal input**: commands escape their arguments, and the calculator uses a parser instead of `eval` or `Function`.
- **Supabase RLS**: `terminal_messages` and `terminal_stats` are insert-only for the `anon` role, and neither table has a public select policy. The publishable key is not a service-role secret. The client cooldown slows spam but is not a server-side rate limit.
- **No secrets in git**: `.env.local` and `.env.*` are ignored, and so is the personal `.obsidian/` vault, which can hold API keys. Only `.env.example` with placeholder values is committed.
- **Dependencies**: run `npm audit` after dependency changes.
- **No external CDNs**: fonts and vendor code are bundled locally.

## Core Features

- **Interactive terminal** (`src/components/InteractiveTerminal.astro`): more than 40 commands, including `help`, `grep`, `egrep`, `fgrep`, `git`, `calc`, `guess`, `echo`, `man`, `tldr`, `nvim`, `wget`, `status`, `school`, `swim`, `whoami`, `bg`, and `fastfetch`. It supports tab completion, Ctrl+C, Ctrl+L, command history, a two-column `help` page on wide screens, and fullscreen. `bg standard` turns on the animated contour canvas; reading mode leaves it off.
- **Boot intro**: a 23-line dmesg cascade into a boot splash, followed by a typewriter line ("launching terminal" / "startar terminalen"). It follows reduced-motion settings, skips on any keypress or click, and replays with `reboot` or `reset`.
- **Open Graph and icons**: a 1200x630 card at `/images/og-card.png`, `og:*` and `twitter:card="summary_large_image"` metadata, an SVG favicon with `.ico` and PNG fallbacks, an Apple touch icon, and a PWA manifest.
- **Overleaf PDFs**: thoughts and projects accept optional `pdfUrl` and `pdfName` fields. The slug page then shows a download button next to the word count and tags, and `wget` and tab completion pick the file up.
- **Ambient background** (`src/components/AmbientBackground.astro`): off by default. `bg standard` starts the canvas contour waves; `topo`, `dither`, `ascii`, `dots`, `pixel`, and `shimmer` select WebGL effects. Animation pauses when the tab is hidden.
- **Writing archive**: category and tag filters sync to the URL (`?category=guide`, `?tag=wellbeing`), and the chips link into the filtered list. Article links, inline code, and the copy button use the post category colour.
- **Footer** (`src/components/Footer.astro`): Gothenburg time, navigation, contact links, an `about` shortcut, and the build date.
- **Navigation**: the header underline fades on hover and fills with the page colour when active. Page content fades in on navigation.
- **Keyboard navigation** (`src/scripts/keyboard-nav.ts`): skip link, roving Tab and Shift+Tab, arrow keys for the header, writing filters, tags, cards, and file lists, plus focus handling after filtering and after hiding or restoring the About card.

## Repository Structure

```text
guloportfolio/
├── .github/workflows/
│   ├── deploy.yml            # GitHub Pages deployment
│   └── ci.yml                # Build check for PRs and develop
├── public/
│   ├── CNAME                 # Custom domain (gulo.se)
│   ├── android-chrome-*.png  # Android Chrome PWA icons
│   ├── apple-touch-icon.png  # iOS home screen icon
│   ├── favicon.ico           # Legacy and scraper fallback icon
│   ├── favicon.svg           # Scalable vector favicon
│   ├── favicon-*.png         # Raster tab favicons
│   ├── site.webmanifest      # PWA manifest
│   ├── downloads/            # PDFs, archives, and scripts
│   ├── images/               # Logo variants and og-card.png
│   └── vendor/               # Ambient shader runtime
├── scripts/
│   └── scaffold.js           # CLI generator for content
├── src/
│   ├── components/           # Astro UI components
│   ├── content/              # Content collections
│   │   ├── downloads/        # JSON metadata descriptors
│   │   ├── projects/         # Markdown project writeups
│   │   └── thoughts/         # Markdown notes and articles
│   ├── data/                 # i18n, fastfetch, status, and terminal files
│   ├── db/                   # Supabase client (optional backend)
│   ├── layouts/              # CSP, Open Graph, SEO, and canonical URL
│   ├── pages/                # index, projects, thoughts, files, 404
│   ├── scripts/              # Terminal dispatcher, calc, git, nvim, i18n
│   └── styles/               # Tailwind v4 theme and global styles
├── supabase/
│   └── migrations/           # SQL schema and RLS policies
├── templates/                # Markdown and JSON starter templates
├── .env.example              # Environment variable template (no secrets)
├── AGENTS.md                 # Dev server commands and Astro docs links
├── AUTHORING.md              # Authoring manual and content guide
├── LICENSE                   # MIT license
├── astro.config.mjs          # Astro config (site: https://gulo.se)
└── package.json              # Dependencies and scaffolding scripts
```

## License

All rights reserved. You may read the source and learn from it, but you may not copy, redistribute, or deploy this site or substantial parts of it. See [LICENSE](LICENSE).
