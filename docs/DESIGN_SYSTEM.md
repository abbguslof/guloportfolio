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