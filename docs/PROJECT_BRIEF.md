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