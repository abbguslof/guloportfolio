# 🚀 GULO // Personal Cockpit & TUI Digital Garden

```text
  ____ _   _ _     ___  
 / ___| | | | |   / _ \ 
| |  _| | | | |  | | | |
| |_| | |_| | |__| |_| |
 \____|\___/|_____\___/ 
 CHALMERS // D-24 // TUI WORKSTATION & DIGITAL PLAYGROUND
```

[![Framework](https://img.shields.io/badge/Astro-7.x%20(SSG)-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Language](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Styling](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Typography](https://img.shields.io/badge/Font-JetBrains%20Mono-000000?style=flat-square&logo=jetbrains&logoColor=white)](https://www.jetbrains.com/lp/mono/)
[![License](https://img.shields.io/badge/License-MIT-2ea043?style=flat-square)](LICENSE)

A personal digital garden, portfolio showcase, technical blog, and file distribution hub disguised as an interactive Unix/Linux TUI workstation. Built with **Astro 7 (Static Site Generation)**, **TypeScript**, and **Tailwind CSS v4** for maximum performance, battery efficiency, and zero layout shift.

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/guloportfolio.git
cd guloportfolio

# 2. Install dependencies
npm install

# 3. Start the local development server (http://localhost:4321)
npm run dev

# 4. Build the production bundle (static output in dist/)
npm run build

# 5. Preview the production build locally
npm run preview
```

---

## 🖥️ Core Architecture & Features

### 1. Interactive TUI Terminal (`src/components/InteractiveTerminal.astro`)
- **Built-in Bash Interpreter**: Interactive command engine supporting 40+ Unix-like commands including `help` (`help -e`), `bio`, `status`, `schedule`, `school`, `swim`, `whoami`, `contact`, `ls`, `cd`, `cat`, `nvim`, `git`, `calc`, `uptime`, `fastfetch` / `neofetch`, `lang`, `reset`, `clear`, and `exit`.
- **Dynamic Virtual Filesystem**: Reads contents from `src/data/terminal/{en,sv}/` at compile time and allows navigating and viewing simulated files directly in the browser.
- **Language Switcher & Aliases**: Switch site language in the terminal via `lang se`, `lang en`, or direct aliases (`swedish`, `svenska`, `se`, `sv`, `swe`, `english`, `engelska`, `en`, `eng`). Already-selected languages are politely recognized without unnecessary re-renders.
- **Factory Reset Command (`reset`)**: Restores user preferences to initial factory defaults — resetting language to English, ambient background to standard, unhiding dismissed notices, clearing command history, and resetting the working directory.
- **Sub-Interpreters**: Built-in mini Vim (`nvim` text viewer), Git commit inspector (`git log`, `git status`), and scientific calculator (`calc 2^10 + 42`).
- **Window Management & Shortcuts**: Functional macOS-style window controls (Close, Minimize, Maximize/Fullscreen with `Esc` shortcut), persistent state across navigation, tab auto-completion, and `Esc` to unfocus the terminal.
- **Graceful Fallback Card**: When the terminal is closed or on mobile devices (<1024px), it smoothly collapses into a structured *"Who is gulo? // About me & background"* biography card with a one-click reopening button.

### 2. Live Telemetry & Offline Detection (`src/data/telemetry.ts`)
- **Dynamic Host Uptime**: Live ticking uptime calculated from a configurable station launch epoch (`SITE_LAUNCH_DATE`).
- **Zero-Bandwidth RTT Ping**: Measures real round-trip network latency from browser navigation timing with zero extra HTTP overhead.
- **Reactive Offline State**: Lightweight WAN probe (`/generate_204`) combined with native browser events (`online` / `offline`). When disconnected:
  - Header brand badge (`GULO`) and status pill turn solid red (`#f85149`).
  - Terminal fastfetch and `status` command show red `[OFFLINE]` indicators.
  - Footer uptime counter and Gothenburg clock freeze their counters and turn red.
  - All tickers automatically pause when browser tabs are inactive (`visibilitychange`) to save CPU and battery.

### 3. Automated Exam & Finals Scheduler (`src/data/schedule.ts`)
- Configurable calendar for university exam periods (tentaveckor) and athletic training camps.
- The site's status badge, fastfetch specs, and `status` command dynamically detect current dates and switch modes automatically (e.g. from regular training to active exam week).

### 4. Bilingual Localization (`src/data/i18n.ts` & `src/scripts/i18n-client.ts`)
- First-class English (`EN`) and Swedish (`SV`) support.
- Zero-refresh client-side language switching that instantly updates headers, navigation, cards, footer, and the active terminal session.
- Technical thoughts, guides, and notes are authored in English with a compact inline notification bar for Swedish users, while projects, downloads, and UI are fully bilingual.
- Remembers user language preference via `localStorage`.

### 5. Keyboard Navigation & Accessibility (`src/scripts/keyboard-nav.ts`)
- **Full Keyboard Traversal**: Navigate smoothly using `Tab`, `Shift+Tab`, `Enter`, `Space`, `Esc`, and arrow keys (`←`, `→`, `↑`, `↓`) on all platforms (including macOS Safari and Chrome without needing system-level Full Keyboard Access).
- **Cockpit Focus System**: High-contrast emerald `:focus-visible` outlines (`#10b981`) with soft cockpit glow across buttons, links, inputs, and interactive cards.
- **Smart Terminal & Input Controls**:
  - `Esc` deselects/blurs the terminal input or active search bar.
  - When the terminal is not focused, `Tab` allows tabbing into the terminal and continuing through page content.
  - Inside the terminal, `Tab` executes command and path auto-completion.
  - `Arrow keys` cycle between category filter buttons (`projects`, `files`, `thoughts`), header navigation links, and article/project cards.

### 6. Ambient Canvas & Glassmorphic Design System (`src/styles/global.css`)
- **Unified 6px Frosted Blur**: Subtle `backdrop-filter: blur(6px)` applied uniformly across all windows, cards, and panels.
- **Ambient Visual Effects**: Switch between background modes (`standard`, `topo`, `dither`, `ascii`, `dots`, `pixel`, `shimmer`, `off`) on the fly.
- **Typography & Aesthetics**: Powered by JetBrains Mono with curated dark mode tones (`#0d1117`, `#161b22`, `#30363d`) and high-contrast TUI accent colors (`#10b981`, `#38bdf8`, `#f59e0b`, `#a78bfa`, `#f85149`).

### 7. Astro Content Collections (`src/content.config.ts`)
- Type-safe schemas with Zod validation for:
  - **`projects`**: Bilingual Markdown showcases (`src/content/projects/{en,sv}/`) with status badges (`ACTIVE`, `WIP`, `COMPLETED`), tech stack tags, and repository/live demo links.
  - **`thoughts`**: Digital garden notes, guides, and thoughts with word count, category badges, tag filtering, and instant search.
  - **`downloads`**: Curated developer files, dotfiles, scripts, and CV with file size, terminal installation commands, and SHA-256 integrity checksums.

---

## 📁 Repository Structure

```text
guloportfolio/
├── public/                       # Static public assets
│   ├── downloads/                # Downloadable files (.pdf, .zip, .sh, .tar.gz)
│   ├── favicon.svg               # Site icon
│   └── vendor/                   # Ambient shader & runtime assets
├── src/
│   ├── components/               # Astro UI components
│   │   ├── AmbientBackground.astro # Dynamic background canvas
│   │   ├── Footer.astro          # Diagnostics grid, Gothenburg clock, uptime & links
│   │   ├── Header.astro          # Cockpit navigation, online status, language toggle
│   │   ├── InteractiveTerminal.astro # Full TUI terminal window & engine
│   │   ├── ProjectCard.astro     # Standardized portfolio card
│   │   └── ThoughtRow.astro      # Blog list item component
│   ├── content/                  # Astro Content Layer collections
│   │   ├── downloads/            # Metadata JSON files for downloads
│   │   ├── projects/             # Bilingual portfolio writeups (.md)
│   │   │   ├── en/               # English project descriptions
│   │   │   └── sv/               # Swedish project descriptions
│   │   └── thoughts/             # Blog posts, guides and research notes (.md)
│   ├── content.config.ts         # Zod schemas for content collections
│   ├── data/                     # Configuration & Telemetry
│   │   ├── i18n.ts               # Bilingual translations dictionary (EN/SV)
│   │   ├── schedule.ts           # University exam & athletic event scheduler
│   │   ├── status.ts             # Availability presets & status badges
│   │   ├── telemetry.ts          # Launch epoch & live uptime math
│   │   └── terminal/             # Virtual terminal filesystem
│   │       ├── en/               # English files (.bashrc, fastfetch.json, whoami.md...)
│   │       └── sv/               # Swedish files (.bashrc, fastfetch.json, whoami.md...)
│   ├── layouts/
│   │   └── Layout.astro          # Base HTML layout with SEO metadata & fonts
│   ├── pages/                    # File-based routing
│   │   ├── 404.astro             # Custom 404 cockpit with terminal command hints
│   │   ├── files/index.astro     # Download hub with category filter & search
│   │   ├── index.astro           # Homepage: Terminal hero, projects & latest posts
│   │   ├── projects/             # Portfolio showcase & [slug] project details
│   │   └── thoughts/             # Digital garden blog & [slug] reader view
│   ├── scripts/                  # Client-side scripts & terminal engine
│   │   ├── i18n-client.ts        # Client language manager & event dispatcher
│   │   ├── keyboard-nav.ts       # Global keyboard traversal (Tab, Shift+Tab, Esc, Arrows)
│   │   └── terminal/             # Bash parser, calculator, git, nvim & i18n
│   ├── utils/
│   │   ├── projects.ts           # Bilingual project grouping & aggregation
│   │   └── readingTime.ts        # Article reading time estimation
│   └── styles/
│       └── global.css            # Tailored design system, frosted blur & code blocks
├── AGENTS.md                     # Development workflows and coding rules
├── astro.config.mjs              # Astro configuration
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript strict configuration
```

---

## ⚙️ Customization Guide

### 1. Setting Your Launch Date & Uptime
Open [`src/data/telemetry.ts`](file:///Users/glof-mac/projects/guloportfolio/src/data/telemetry.ts) and edit the `SITE_LAUNCH_DATE` constant:

```typescript
// Format: ISO-8601 (YYYY-MM-DDTHH:mm:ssZ)
export const SITE_LAUNCH_DATE = '2026-01-01T00:00:00Z';
```

### 2. Configuring Exam Weeks & Schedule Events
Open [`src/data/schedule.ts`](file:///Users/glof-mac/projects/guloportfolio/src/data/schedule.ts) to define upcoming university exam weeks or activities:

```typescript
export const SCHEDULED_EVENTS: ScheduleEvent[] = [
  {
    id: 'exam-lp3-2026',
    name: { en: 'Finals Week LP3', sv: 'Tentavecka LP3' },
    startDate: '2026-03-09',
    endDate: '2026-03-14',
    statusPreset: 'exam',
    badge: { en: 'EXAM WEEK', sv: 'TENTAVECKA' },
    description: { 
      en: 'Exams in EDA433 and TDA384. Homelab maintenance paused.', 
      sv: 'Tentor i EDA433 och TDA384. Serverdrift pausad.' 
    },
  },
];
```

### 3. Personalizing Fastfetch & Whoami
- **Specs & Badge**: Modify [`src/data/terminal/en/fastfetch.json`](file:///Users/glof-mac/projects/guloportfolio/src/data/terminal/en/fastfetch.json) and [`src/data/terminal/sv/fastfetch.json`](file:///Users/glof-mac/projects/guloportfolio/src/data/terminal/sv/fastfetch.json).
- **Bio in Terminal**: Edit [`src/data/terminal/en/whoami.md`](file:///Users/glof-mac/projects/guloportfolio/src/data/terminal/en/whoami.md) and [`src/data/terminal/sv/whoami.md`](file:///Users/glof-mac/projects/guloportfolio/src/data/terminal/sv/whoami.md).

> **Note**: Avoid adding random documentation files directly inside `src/data/terminal/{en,sv}/`, as every file in those folders is mounted into the terminal's virtual filesystem.

### 4. Adding Projects
Create a markdown file in `src/content/projects/<slug>.md`:

```markdown
---
title: "Distributed SMP Cluster"
description: "Bare-metal Debian 12 server cluster running containerized instances."
status: "ACTIVE"       # ACTIVE | MAINTAINED | COMPLETED | WIP | ARCHIVED
category: "Homelab"    # School | Homelab | Minecraft | Web | Other
tech: ["Docker", "Linux", "WireGuard", "Zfs"]
repoUrl: "https://github.com/your-username/cluster"
liveUrl: "https://mc.example.com"
order: 1
featured: true
---

Your markdown writeup here...
```

### 5. Writing Blog Posts / Thoughts
Create a markdown file in `src/content/thoughts/<slug>.md`:

```markdown
---
title: "Valgrind & Manual Memory Management in C"
description: "Tracking down memory leaks and illegal reads using Valgrind and GDB."
pubDate: 2026-03-01
category: "guide"      # tanke | guide | anteckning
tags: ["c", "linux", "valgrind"]
featured: true
---

Your article content here...
```

### 6. Adding Downloadable Files
1. Place the physical file in `public/downloads/<filename>`.
2. Create a metadata entry in `src/content/downloads/<filename>.json`:

```json
{
  "name": "Neovim Lua Configuration",
  "filename": "nvim-dotfiles.tar.gz",
  "size": "42 KB",
  "category": "Config",
  "fileUrl": "/downloads/nvim-dotfiles.tar.gz",
  "description": "Clean modular Neovim setup in Lua with Lazy.nvim.",
  "usage": "tar -xzf nvim-dotfiles.tar.gz -C ~/.config/nvim",
  "updatedAt": "2026-03",
  "checksum": "sha256:4f8a...c91e",
  "tags": ["neovim", "lua", "dotfiles"]
}
```

---

## 🚢 Deployment

The project is configured for static site generation (`output: "static"`). The generated output in `dist/` can be deployed instantly to any static host:

- **Cloudflare Pages**: Framework preset `Astro`, build command `npm run build`, output directory `dist`.
- **Vercel**: Framework preset `Astro`, build command `npm run build`, output directory `dist`.
- **Netlify**: Build command `npm run build`, publish directory `dist`.
- **GitHub Pages**: Use the official Astro GitHub Actions workflow to deploy the `dist/` directory.

---

## 📜 License

Built with curiosity and playground spirit. Code released under the [MIT License](LICENSE).
