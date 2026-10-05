Här är en komplett uppsättning specifikationsfiler i Markdown som du kan spara i en mapp (t.ex. `.docs/` eller `specs/` i ditt repo) och mata in direkt i din AI-kodassistent för att generera hela sajten utan förvirring.

---

### Fil 1: `PROJECT_BRIEF.md`

```markdown
# Project Brief: Personal Playground & Cockpit

## 1. Vision & Syfte
En personlig "digital garden / cockpit" och playground som fungerar som visitkort, portfolio, blogg och filarkiv. Sajten ska reflektera ett intresse för systemadministration, servrar (t.ex. Minecraft, homelab), Linux och utveckling. 

Estetiken ska vara en modern **TUI-hybrid (Terminal User Interface möter minimalistisk webb)**. Den ska ge känslan av en terminal eller systemmonitor utan att kräva teknisk förkunskap för att navigera.

## 2. Kärnfunktioner
- **System Dashboard / Hero:** Statusrader, neofetch-liknande presentation och en frivillig interaktiv terminalruta.
- **Projekt & Skola:** Tydliga kort med status-taggar (`[ACTIVE]`, `[COMPLETED]`, `[WIP]`) och tech-stacks.
- **Tankar / Blogg (Text-first):** Minimalistiskt arkiv med datum, titel och tagg. **Inga bild-thumbnails i listvyer.** Bilder tillåts endast inuti artiklar där det tillför värde.
- **Fildelning & Resurser:** Nedladdningshub för Minecraft-configs, modpacks, server-scripts och dotfiles.
- **Responsivitet:** Fullt fungerande på mobil (där terminalen fungerar som en snygg informationsbox med vanliga tryckbara element).

## 3. Tech Stack
- **Framework:** Astro 4.x / 5.x (Static Site Generation / SSG)
- **Styling:** Tailwind CSS med `@tailwindcss/typography`
- **Innehållshantering:** Astro Content Collections (`astro:content`) med strikta Zod-scheman
- **Syntax Highlighting:** Shiki (inbyggt i Astro, tema: `catppuccin-mocha` eller `github-dark`)
- **Hosting / Deployment:** Cloudflare Pages eller Vercel via GitHub CI/CD

```

---

### Fil 2: `DESIGN_SYSTEM.md`

```markdown
# Design System & UI Guidelines

## 1. Visuell Identitet: "Modern TUI-hybrid"
- **Filosofi:** All layout ska kännas som en strukturerad terminalapplikation (htop, neofetch, ranger) men använda standard webblänkar, knappar och responsiva layouter.
- **Inga Thumbnails-regeln:** Listor över inlägg eller projekt ska ALDRIG använda generiska bild-thumbnails. All visuell hierarki skapas genom typografi, borders, datum och färgkodade status-badges.

## 2. Färgpalett (Dark Theme Only)
Inspirerad av terminaler och modern dark mode:
- **Bakgrund primär:** `#0d1117` (Deep Slate / Dark Charcoal)
- **Bakgrund sekundär / Kort:** `#161b22`
- **Borders & Linjer:** `#30363d` (Subtila 1px-linjer som liknar box-drawing)
- **Text primär:** `#e6edf3`
- **Text dämpad / Metadata:** `#8b949e`
- **Accenter:**
  - Prompt / Terminalgrön: `#2ea043` (eller Emerald `#10b981`)
  - Accent / Varning / Amber: `#f59e0b`
  - Info / Cyan: `#38bdf8`

## 3. Typografi
- **Monospace (Kärnan i TUI):** `JetBrains Mono`, `Geist Mono` eller `Fira Code`
  - Används för meny, datum, filstorlekar, statusindikatorer, taggar och kodblock.
- **Sans-Serif (Läsbarhet i text):** `Inter` eller `Geist Sans`
  - Används valfritt för längre brödtext i artiklar för att inte trötta ut ögonen.

## 4. UI-komponenter & Mönster
- **Status Badges:** Text i hakparenteser med färg, t.ex. `[● ONLINE]`, `[WIP]`, `[v1.20.4]`.
- **Divider:** Rena linjer eller teckenbaserade avdelare (`───` eller `===`).
- **Hover-effekter:** Bakgrundsskifte till `#1f242c` och diskret färgförändring på pil-ikoner (`↗` eller `↓`).

```

---

### Fil 3: `CONTENT_SCHEMA.md`

```markdown
# Content Collections & Datastruktur

Alla Markdown-filer styrs via Astro Content Collections i `src/content/config.ts`.

## 1. Schema: Tankar / Blogg (`src/content/thoughts/`)
Filformat: `.md` eller `.mdx`

```typescript
import { defineCollection, z } from 'astro:content';

const thoughts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

```

Exempel på frontmatter (`src/content/thoughts/mc-jvm-flags.md`):

```markdown
---
title: "Optimerade JVM-flaggor för PaperMC 1.20"
description: "Hur jag konfigurerade Aikar's flags för stabil TPS under hög belastning."
pubDate: 2026-03-15
tags: ["Minecraft", "Linux", "Sysadmin"]
---
Innehållet börjar här...

```

## 2. Schema: Projekt (`src/content/projects/`)

Filformat: `.md`

```typescript
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['ACTIVE', 'MAINTAINED', 'WIP', 'ARCHIVED']),
    category: z.enum(['School', 'Homelab', 'Minecraft', 'Web']),
    tech: z.array(z.string()),
    repoUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    order: z.number().default(100),
  }),
});

```

## 3. Schema: Filer & Nedladdningar (`src/content/downloads/`)

Kan hanteras som en YAML- eller JSON-fil (`src/data/downloads.json`):

```json
[
  {
    "id": "fabric-server-pack",
    "name": "Fabric Performance Pack 1.20.4",
    "filename": "fabric-1.20.4-optimized.zip",
    "size": "4.8 MB",
    "category": "Minecraft",
    "fileUrl": "/downloads/fabric-1.20.4-optimized.zip",
    "description": "Förkonfigurerat serverpack med Lithium, FerriteCore och spark.",
    "updatedAt": "2026-02-20"
  },
  {
    "id": "mc-backup-script",
    "name": "Automated World Backup Script",
    "filename": "backup-world.sh",
    "size": "2.4 KB",
    "category": "Bash",
    "fileUrl": "/downloads/backup-world.sh",
    "description": "Tar dagliga rsync-backuper och zippar med datumstämpel.",
    "updatedAt": "2026-01-10"
  }
]

```

```

---

### Fil 4: `COMPONENTS_SPEC.md`

```markdown
# Komponentspecifikation

## 1. `<InteractiveTerminal />`
- **Placering:** Överst på startsidan (Hero).
- **Utseende:** 
  - Fönsterram med titel: `● ● ● bash — user@playground: ~`
  - Statiskt "Neofetch"-block med användarinfo (Namn, Plats, Aktuell status, Uptime).
  - En promptrad: `visitor@web:~$ [input-fält]`
- **Interaktivitet (Vanilla JS):**
  - Inte obligatorisk för navigation! Scrollning och klickbara länkar fungerar som vanligt.
  - Kommandostöd:
    - `help`: Visar tillgängliga kommandon (`projects`, `thoughts`, `files`, `clear`, `whoami`, `school`).
    - `projects`: Rullar mjukt ner till projektsektionen (`#projects`).
    - `thoughts`: Rullar mjukt ner till artikelsektionen (`#thoughts`).
    - `files`: Rullar ner till filkatalogen (`#files`).
    - `clear`: Tömmer terminalens utdata och återställer prompten.
    - `cat [fil]`: Skriver ut enkel text i terminalen.

## 2. `<ThoughtRow />`
- **Utseende:** En enda rad per artikel:
  - Vänster: Datum formaterat som `YYYY-MM-DD` i grått monospace.
  - Mitten: Artikelns titel med understrykning vid hover.
  - Höger: Taggbadge `[Minecraft]` samt diskret länkpil `↗`.
- **Mobilvy:** Datum staplas snyggt ovanför titeln för att förhindra textkollaps.

## 3. `<DownloadTable />`
- **Utseende:** Strukturerad lista eller tabell med monospace-attribut:
  - Ikon / Filändelsebadge: `[ZIP]`, `[SH]`, `[JSON]`
  - Filnamn och kort beskrivning
  - Storlek och kategori
  - Klickbar nedladdningsknapp med HTML5 `download`-attribut: `[Ladda ner ↓]`

```

---

### Fil 5: `AI_BOOTSTRAP_PROMPT.md` (Klistra in detta i Antigravity)

```markdown
Du är en erfaren frontend-arkitekt specialiserad på Astro och modern CSS.

Jag vill att du bygger ett personligt playground/portfolio-system baserat på följande specifikationer:
- Läs filerna: PROJECT_BRIEF.md, DESIGN_SYSTEM.md, CONTENT_SCHEMA.md och COMPONENTS_SPEC.md.

Gör följande steg:
1. Skapa en ren Astro-projektstruktur med Tailwind CSS och Monospace-stilar (JetBrains Mono/Geist Mono).
2. Sätt upp Content Collections i `src/content/config.ts` enligt schemat med exempeldata för:
   - 2 projekt (ett Minecraft-serverprojekt och ett skola/programmeringsprojekt)
   - 2 blogginlägg/tankar
   - 2 nedladdningsbara filer
3. Bygg komponenten `InteractiveTerminal.astro` med Neofetch-layout och en fungerande kommandotolk (help, projects, thoughts, files, clear).
4. Bygg startsidan `src/pages/index.astro` med:
   - Hero med terminalen
   - 'Just nu / Skola'-sektion
   - Projektsektion (med status-badges, inga thumbnails)
   - Tankar-sektion (ren typografi, datum och rubrik)
   - Nedladdningsarkiv
   - Footer med systemstatus och sociala länkar
5. Säkerställ att designen är 100% responsiv och följer den mörka TUI-paletten utan onödig JavaScript för sidnavigation.

Börja med att visa mappstrukturen och konfigurera grundfilerna (`astro.config.mjs`, `tailwind.config.mjs`, `src/content/config.ts`).

```

---

Med dessa filer i ditt repo har Antigravity all kontext den behöver om färgkoder, layouter, schema och regler (särskilt förbudet mot fula thumbnails och kravet på valfri terminal-interaktivitet).