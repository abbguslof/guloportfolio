# Personal Playground & TUI Cockpit

Digital garden, visitkort, portfolio och fildelningshub för personliga projekt, studier vid Chalmers Datateknik, simning, homelab och systemadministration.

## ⚡ Snabbstart

```bash
# Installera beroenden
npm install

# Starta utvecklingsservern lokalt (http://localhost:4321)
npm run dev

# Bygg produktionsversionen
npm run build

# Förhandsgranska produktionsbygget
npm run preview
```

## 📂 Lägga till innehåll

Allt innehåll hanteras via **Astro Content Layer** i `src/content.config.ts`:

- **Tankar & Blogginlägg:** Skapa en `.md`-fil i `src/content/thoughts/` med `title`, `pubDate` och `tags`.
- **Projekt:** Skapa en `.md`-fil i `src/content/projects/` med `title`, `status`, `category` och `tech`.
- **Filer & Nedladdningar:** Lägg filen i `public/downloads/` och skapa en JSON-beskrivning i `src/content/downloads/`.

## 🛠 Tech Stack

- **Framework:** Astro 7 (Static Site Generation / SSG)
- **Styling:** Tailwind CSS v4 + `@tailwindcss/typography`
- **Typsnitt:** JetBrains Mono (`@fontsource/jetbrains-mono`)
- **Syntax Highlighting:** Shiki (`github-dark`)
