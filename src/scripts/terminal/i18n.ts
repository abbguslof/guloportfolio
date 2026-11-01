// src/scripts/terminal/i18n.ts - Centralized Internationalization & Terminal Texts
import type { LangCode } from './types';
import { getActiveStatus } from '../../data/status';
import { getUpcomingEvents, getCurrentEvent } from '../../data/schedule';
import fastfetchSv from '../../data/terminal/sv/fastfetch.json';
import fastfetchEn from '../../data/terminal/en/fastfetch.json';

export function getSiteLang(): LangCode {
  if (typeof window === 'undefined') return 'en';
  const docLang = (document.documentElement.lang || document.documentElement.getAttribute('data-lang')) as LangCode;
  if (docLang === 'sv' || docLang === 'en') return docLang;
  const stored = localStorage.getItem('site_lang') as LangCode;
  if (stored === 'sv' || stored === 'en') return stored;
  return 'en';
}

/**
 * Standard Focused Help: only shows essential, actual primary commands
 */
export function getStandardHelpHtml(lang: LangCode): string {
  const isSv = lang === 'sv';

  const groups = isSv
    ? [
        { title: 'Om', rows: [
          ['bio', 'profil och bakgrund'],
          ['school', 'Chalmers och kurser'],
          ['swim', 'träning och resultat'],
          ['status', 'aktuellt fokus och tillgänglighet'],
          ['contact', 'e-post och länkar'],
        ]},
        { title: 'Läs', rows: [
          ['projects', 'projektarkivet'],
          ['writing', 'texter och anteckningar'],
          ['files', 'nedladdningar'],
        ]},
        { title: 'Sidan', rows: [
          ['home', 'tillbaka till startsidan'],
          ['lang [sv|en]', 'byt språk'],
          ['bg [stil]', 'bakgrundseffekt'],
        ]},
        { title: 'Filer', rows: [
          ['ls [-la]', 'lista filer'],
          ['cd <mapp>', 'byt katalog'],
          ['cat <fil>', 'läs en fil'],
          ['grep <mönster>', 'sök text'],
          ['nvim [fil]', 'textredigerare'],
          ['wget <fil>', 'ladda ner'],
          ['open <mål>', 'öppna en sida'],
          ['clear', 'rensa skärmen'],
          ['exit', 'stäng terminalen'],
        ]},
      ]
    : [
        { title: 'About', rows: [
          ['bio', 'profile and background'],
          ['school', 'Chalmers and coursework'],
          ['swim', 'training and results'],
          ['status', 'current focus and availability'],
          ['contact', 'email and links'],
        ]},
        { title: 'Read', rows: [
          ['projects', 'project archive'],
          ['writing', 'notes and articles'],
          ['files', 'downloads'],
        ]},
        { title: 'Site', rows: [
          ['home', 'back to the start'],
          ['lang [en|sv]', 'switch language'],
          ['bg [style]', 'background effect'],
        ]},
        { title: 'Files', rows: [
          ['ls [-la]', 'list files'],
          ['cd <dir>', 'change directory'],
          ['cat <file>', 'read a file'],
          ['grep <pattern>', 'search text'],
          ['nvim [file]', 'text editor'],
          ['wget <file>', 'download a file'],
          ['open <target>', 'open a page'],
          ['clear', 'clear the screen'],
          ['exit', 'close the terminal'],
        ]},
      ];

  const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const renderGroups = (items: typeof groups) => items.map((group) => `
    <div>
      <div class="text-[#38bdf8] font-semibold mb-1">${esc(group.title)}</div>
      <div class="grid grid-cols-[132px_1fr] gap-x-3 gap-y-1">
        ${group.rows.map(([cmd, desc]) => `<span class="text-[#10b981]">${esc(cmd)}</span><span class="text-[#8b949e]">${esc(desc)}</span>`).join('')}
      </div>
    </div>`).join('');

  const groupsHtmlLeft = renderGroups(groups.slice(0, 3));
  const groupsHtmlRight = renderGroups(groups.slice(3));

  return `
<div class="text-[#e6edf3] space-y-3 text-xs font-mono">
  <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#30363d] pb-1">
    <span class="text-[#10b981] font-bold text-sm"># ${isSv ? 'Kommandon' : 'Commands'}</span>
    <span class="text-[10px] text-[#8b949e]">${isSv ? 'Tab-komplettering fungerar' : 'Tab completion works'}</span>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
    <div class="space-y-3">${groupsHtmlLeft}</div>
    <div class="space-y-3">${groupsHtmlRight}</div>
  </div>

  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/50 pt-2">
    [help -e] ${isSv ? 'git, miniräknare och spel' : 'git, calculator, and games'} &nbsp; [Tab] ${isSv ? 'komplettera' : 'complete'}
  </div>
</div>`;
}

/**
 * Extended Help: displays full developer toolkit, git commands, calculator, minigames and scripts
 */
export function getExtendedHelpHtml(lang: LangCode): string {
  if (lang === 'sv') {
    return `
<div class="text-[#e6edf3] space-y-3.5 font-mono">
  <div class="text-[#10b981] font-bold border-b border-[#30363d] pb-1 flex items-center justify-between">
    <span>BASH KOMMANDOTOLK // FULLSTÄNDIG UTÖKAD KOMMANDOGUIDE</span>
    <span class="text-[10px] text-[#38bdf8] font-normal">help --extended / -e</span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
    <!-- Kolumn 1: Profil, Webb, Språk, Fönster -->
    <div class="space-y-3">
      <div>
        <div class="text-[#38bdf8] font-bold mb-1">Information, Profil &amp; Studier:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">bio</code>, <code class="text-[#10b981]">about</code>, <code class="text-[#10b981]">tldr</code> : Biografi, personlig bakgrund &amp; översikt</div>
          <div><code class="text-[#10b981]">cv</code>, <code class="text-[#10b981]">resume</code>, <code class="text-[#10b981]">recruit</code> : Utbildning, tekniska färdigheter &amp; meriter</div>
          <div><code class="text-[#10b981]">status</code> : Aktuell status, homelab och tillgänglighet</div>
          <div><code class="text-[#10b981]">schedule</code>, <code class="text-[#10b981]">tentor</code> : Chalmers tentaveckor &amp; träningsläger</div>
          <div><code class="text-[#10b981]">school</code>, <code class="text-[#10b981]">study</code>, <code class="text-[#10b981]">education</code> : Civilingenjör Datateknik @ Chalmers (D-24)</div>
          <div><code class="text-[#10b981]">swim</code> : Tävlingssimning för MASS &amp; Growth Objective</div>
          <div><code class="text-[#10b981]">whoami</code>, <code class="text-[#10b981]">gustav</code>, <code class="text-[#10b981]">contact</code> : Vem jag är, GitHub, e-post &amp; sociala medier</div>
          <div><code class="text-[#10b981]">proxmox</code>, <code class="text-[#10b981]">mc</code>, <code class="text-[#10b981]">sleep</code> : Bashrc-alias &amp; homelab-status</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">Webb, Navigering &amp; Språkväxling:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">home</code>, <code class="text-[#10b981]">hem</code> : Återvänd till startsidan (/)</div>
          <div><code class="text-[#10b981]">projects</code>, <code class="text-[#10b981]">homelab</code> : Portfölj med projekt, labbar &amp; servrar</div>
          <div><code class="text-[#10b981]">thoughts</code>, <code class="text-[#10b981]">blog</code> : Tankar, guider &amp; tekniska anteckningar</div>
          <div><code class="text-[#10b981]">files</code> : Filarkiv, skript, CV &amp; dotfiles</div>
          <div><code class="text-[#10b981]">open &lt;mål&gt;</code> : Öppna projekt, artikel eller länk direkt</div>
          <div><code class="text-[#10b981]">lang [sv|en|se]</code> : Växla hela webbplatsens språk</div>
          <div class="text-[11px] text-[#38bdf8] pl-2">Svenska alias: <code class="text-[#e6edf3]">se</code>, <code class="text-[#e6edf3]">sv</code>, <code class="text-[#e6edf3]">swe</code>, <code class="text-[#e6edf3]">swedish</code>, <code class="text-[#e6edf3]">svenska</code></div>
          <div class="text-[11px] text-[#38bdf8] pl-2">Engelska alias: <code class="text-[#e6edf3]">en</code>, <code class="text-[#e6edf3]">eng</code>, <code class="text-[#e6edf3]">english</code>, <code class="text-[#e6edf3]">engelska</code></div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">⌨️ Tangentbord &amp; Terminalkontroller:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">Tab</code> : Autokomplettera kommandon, argument &amp; filnamn</div>
          <div><code class="text-[#10b981]">↑ / ↓ (Pilar)</code> : Bläddra bland tidigare körda kommandon</div>
          <div><code class="text-[#10b981]">history</code> : Visa de senaste 25 kommandona</div>
          <div><code class="text-[#10b981]">clear</code>, <code class="text-[#10b981]">cls</code> : Rensa terminalskärmen</div>
          <div><code class="text-[#10b981]">reset</code> : Återställ alla inställningar, språk (EN), historik &amp; notiser till standard</div>
          <div><code class="text-[#10b981]">exit</code>, <code class="text-[#10b981]">close</code> : Stäng terminalfönstret (eller klicka på [x])</div>
          <div><code class="text-[#10b981]">Esc</code> : Avsluta fullskärmsläge</div>
        </div>
      </div>
    </div>

    <!-- Kolumn 2: Filsystem, Verktyg, Git, Grafik -->
    <div class="space-y-3">
      <div>
        <div class="text-[#38bdf8] font-bold mb-1">Filsystem &amp; Editor:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">ls [-la] [mapp]</code> : Lista filer, storlek och rättigheter</div>
          <div><code class="text-[#10b981]">cd &lt;katalog&gt;</code> : Navigera (<code class="text-[#e6edf3]">cd projects</code>, <code class="text-[#e6edf3]">cd ..</code>, <code class="text-[#e6edf3]">cd ~</code>)</div>
          <div><code class="text-[#10b981]">cat &lt;fil&gt;</code> : Skriv ut innehållet i en fil i terminalen</div>
          <div><code class="text-[#10b981]">grep [-inrl] &lt;mönster&gt; [fil]</code> : Sök textmönster med radnummer &amp; markering</div>
          <div><code class="text-[#10b981]">nvim [fil]</code>, <code class="text-[#10b981]">vim</code> : Neovim TUI buffer-visare med radnummer</div>
          <div><code class="text-[#10b981]">pwd</code> : Skriv ut den aktuella sökvägen</div>
          <div><code class="text-[#10b981]">wget &lt;fil&gt;</code> : Ladda ned faktiska resurser &amp; PDF:er (alias: dl, download)</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">Miniräknare, Skript &amp; Spel:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">calc &lt;uttryck&gt;</code> : Matematik (stödjer <code class="text-[#e6edf3]">2^8</code>, <code class="text-[#e6edf3]">2²</code>, <code class="text-[#e6edf3]">sqrt(256)</code>, <code class="text-[#e6edf3]">sin(pi/2)</code>)</div>
          <div><code class="text-[#10b981]">guess [&lt;tal&gt;]</code> : Interaktivt gissningsspel (1-100) med poängräkning</div>
          <div><code class="text-[#10b981]">./helloworld.sh</code> : Kör det virtuella välkomstskriptet</div>
          <div><code class="text-[#10b981]">hello / hej / tjena</code> : Hälsningsfraser</div>
          <div><code class="text-[#10b981]">msg &lt;meddelande&gt;</code> : Skicka en hälsning till Gustavs inkorg (alias: say, message)</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">Git, Diagnostik &amp; Bakgrundseffekter:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">git [status|log|branch|diff|remote|push]</code> : Simulerad Git</div>
          <div><code class="text-[#10b981]">fastfetch</code>, <code class="text-[#10b981]">neofetch</code> : Maskinvaruspecifikationer och ASCII-avatar</div>
          <div><code class="text-[#10b981]">uptime</code>, <code class="text-[#10b981]">uname -a</code>, <code class="text-[#10b981]">hostname</code> : Host information</div>
          <div><code class="text-[#10b981]">bg &lt;stil&gt;</code> : Ändra bakgrund (standard, topo, dither, ascii, dots, pixel, shimmer, off)</div>
        </div>
      </div>
    </div>
  </div>

  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/60 pt-2 flex flex-wrap items-center justify-between gap-2">
    <span>Skriv <code class="text-[#10b981]">help</code> för kompakt lista.</span>
    <span>Tryck <code class="text-[#10b981]">Tab</code> för autokomplettering av alla kommandon och filer.</span>
  </div>
</div>`;
  }

  return `
<div class="text-[#e6edf3] space-y-3.5 font-mono">
  <div class="text-[#10b981] font-bold border-b border-[#30363d] pb-1 flex items-center justify-between">
    <span>BASH INTERPRETER // COMPREHENSIVE COMMAND GUIDE</span>
    <span class="text-[10px] text-[#38bdf8] font-normal">help --extended / -e</span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
    <!-- Col 1: Bio, Web, Language, Window Controls -->
    <div class="space-y-3">
      <div>
        <div class="text-[#38bdf8] font-bold mb-1">Information, Bio &amp; Academics:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">bio</code>, <code class="text-[#10b981]">about</code>, <code class="text-[#10b981]">tldr</code> : Biography, background &amp; executive overview</div>
          <div><code class="text-[#10b981]">cv</code>, <code class="text-[#10b981]">resume</code>, <code class="text-[#10b981]">recruit</code> : Education, technical skillsets &amp; experience</div>
          <div><code class="text-[#10b981]">status</code> : Live homelab status, academic focus &amp; availability</div>
          <div><code class="text-[#10b981]">schedule</code>, <code class="text-[#10b981]">exams</code> : Chalmers exam calendar &amp; training camps</div>
          <div><code class="text-[#10b981]">school</code>, <code class="text-[#10b981]">study</code>, <code class="text-[#10b981]">education</code> : Chalmers Computer Science degree (D-24)</div>
          <div><code class="text-[#10b981]">swim</code> : Competitive swimming for MASS &amp; Growth Objective</div>
          <div><code class="text-[#10b981]">whoami</code>, <code class="text-[#10b981]">gustav</code>, <code class="text-[#10b981]">contact</code> : Identity, GitHub, email &amp; social profiles</div>
          <div><code class="text-[#10b981]">proxmox</code>, <code class="text-[#10b981]">mc</code>, <code class="text-[#10b981]">sleep</code> : Bashrc aliases &amp; homelab status</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">Web, Navigation &amp; Language Switcher:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">home</code>, <code class="text-[#10b981]">hem</code> : Return to the homepage (/)</div>
          <div><code class="text-[#10b981]">projects</code>, <code class="text-[#10b981]">homelab</code> : Showcase of coursework, homelab &amp; code</div>
          <div><code class="text-[#10b981]">thoughts</code>, <code class="text-[#10b981]">blog</code> : Digital garden notes, guides &amp; articles</div>
          <div><code class="text-[#10b981]">files</code> : Downloadable packages, resume, dotfiles &amp; scripts</div>
          <div><code class="text-[#10b981]">open &lt;target&gt;</code> : Open any project, post or route in the browser</div>
          <div><code class="text-[#10b981]">lang [en|se|sv]</code> : Switch entire site &amp; terminal language</div>
          <div class="text-[11px] text-[#38bdf8] pl-2">English aliases: <code class="text-[#e6edf3]">en</code>, <code class="text-[#e6edf3]">eng</code>, <code class="text-[#e6edf3]">english</code>, <code class="text-[#e6edf3]">engelska</code></div>
          <div class="text-[11px] text-[#38bdf8] pl-2">Swedish aliases: <code class="text-[#e6edf3]">se</code>, <code class="text-[#e6edf3]">sv</code>, <code class="text-[#e6edf3]">swe</code>, <code class="text-[#e6edf3]">swedish</code>, <code class="text-[#e6edf3]">svenska</code></div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">⌨️ Keyboard &amp; Window Controls:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">Tab</code> : Autocomplete commands, arguments &amp; filenames</div>
          <div><code class="text-[#10b981]">↑ / ↓ (Arrows)</code> : Cycle through command history</div>
          <div><code class="text-[#10b981]">history</code> : View previous 25 executed commands</div>
          <div><code class="text-[#10b981]">clear</code>, <code class="text-[#10b981]">cls</code> : Clear terminal output window</div>
          <div><code class="text-[#10b981]">reset</code> : Restore all preferences, language (EN), history &amp; notices to defaults</div>
          <div><code class="text-[#10b981]">exit</code>, <code class="text-[#10b981]">close</code> : Close terminal window (or click [x])</div>
          <div><code class="text-[#10b981]">Esc</code> : Exit fullscreen mode</div>
        </div>
      </div>
    </div>

    <!-- Col 2: Filesystem, Tools, Git, Diagnostics -->
    <div class="space-y-3">
      <div>
        <div class="text-[#38bdf8] font-bold mb-1">Filesystem &amp; Editor:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">ls [-la] [dir]</code> : List files, file sizes and permissions</div>
          <div><code class="text-[#10b981]">cd &lt;dir&gt;</code> : Navigate directories (<code class="text-[#e6edf3]">cd projects</code>, <code class="text-[#e6edf3]">cd ..</code>, <code class="text-[#e6edf3]">cd ~</code>)</div>
          <div><code class="text-[#10b981]">cat &lt;file&gt;</code> : Print document contents to the shell</div>
          <div><code class="text-[#10b981]">grep [-inrl] &lt;pattern&gt; [file]</code> : Search text patterns with line numbers &amp; highlighting</div>
          <div><code class="text-[#10b981]">nvim [file]</code>, <code class="text-[#10b981]">vim</code> : Neovim TUI buffer view with line numbers</div>
          <div><code class="text-[#10b981]">pwd</code> : Print working directory</div>
          <div><code class="text-[#10b981]">wget &lt;file&gt;</code> : Download actual archive file or companion PDF to disk (alias: dl, download)</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">Calculator, Scripting &amp; Minigames:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">calc &lt;expr&gt;</code> : Math evaluator (supports <code class="text-[#e6edf3]">2^8</code>, <code class="text-[#e6edf3]">2²</code>, <code class="text-[#e6edf3]">sqrt(256)</code>, <code class="text-[#e6edf3]">sin(pi/2)</code>)</div>
          <div><code class="text-[#10b981]">guess [&lt;num&gt;]</code> : Interactive number guessing game (1-100) with score tracking</div>
          <div><code class="text-[#10b981]">./helloworld.sh</code> : Execute the virtual shell script</div>
          <div><code class="text-[#10b981]">hello / hi / hey</code> : Friendly greetings</div>
          <div><code class="text-[#10b981]">msg &lt;message&gt;</code> : Send a note straight to Gustav's inbox (alias: say, message)</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">Git, Diagnostics &amp; Ambient Visuals:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">git [status|log|branch|diff|remote|push]</code> : Simulated Git toolkit</div>
          <div><code class="text-[#10b981]">fastfetch</code>, <code class="text-[#10b981]">neofetch</code> : Machine specs and ASCII avatar</div>
          <div><code class="text-[#10b981]">uptime</code>, <code class="text-[#10b981]">uname -a</code>, <code class="text-[#10b981]">hostname</code> : Host information</div>
          <div><code class="text-[#10b981]">bg &lt;style&gt;</code> : Set background (standard, topo, dither, ascii, dots, pixel, shimmer, off)</div>
        </div>
      </div>
    </div>
  </div>

  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/60 pt-2 flex flex-wrap items-center justify-between gap-2">
    <span>Type <code class="text-[#10b981]">help</code> for the compact list.</span>
    <span>Press <code class="text-[#10b981]">Tab</code> to autocomplete all commands, flags and filenames.</span>
  </div>
</div>`;
}

/**
 * Friendly greetings handler for hello, hi, tjena, hej, yo, etc.
 */
export function getGreetingResponse(word: string, lang: LangCode): string {
  if (lang === 'sv') {
    const greetings = [
      `Hej. Välkommen till min terminal och texter. Skriv <code class="text-[#10b981]">help</code> för att se vad du kan göra, eller <code class="text-[#38bdf8]">cat whoami.md</code> för att läsa om mig!`,
      `Hej där! Kul att du hittade hit till terminalen. Testa att köra <code class="text-[#10b981]">./helloworld.sh</code> eller öppna något i <code class="text-[#38bdf8]">nvim whoami.md</code>!`,
      `Hej. Hoppas du gillar sidan. Skriv <code class="text-[#10b981]">school</code> för att läsa om mina Chalmers-studier eller <code class="text-[#38bdf8]">status</code> för live-info.`
    ];
    return `<div class="text-[#10b981] text-xs font-mono">${greetings[Math.floor(Math.random() * greetings.length)]}</div>`;
  }

  const greetings = [
    `Hello. Welcome to my terminal and writing archive. Type <code class="text-[#10b981]">help</code> to explore commands, or <code class="text-[#38bdf8]">cat whoami.md</code> to learn more about me!`,
    `Hey there! Great to see you in the terminal. Try running <code class="text-[#10b981]">./helloworld.sh</code> or explore files with <code class="text-[#38bdf8]">nvim whoami.md</code>!`,
    `Hi. Welcome to my site. Type <code class="text-[#10b981]">school</code> to read about Chalmers CS or <code class="text-[#38bdf8]">status</code> for live updates.`
  ];
  return `<div class="text-[#10b981] text-xs font-mono">${greetings[Math.floor(Math.random() * greetings.length)]}</div>`;
}

/**
 * Secret command output: subtle, atmospheric and intriguing (no spoiler list)
 */
export function getSecretOutput(lang: LangCode): string {
  if (lang === 'sv') {
    return `
<div class="text-[#e6edf3] space-y-2 font-mono text-xs p-3 rounded bg-[#0d1117] border border-[#a78bfa]/50">
  <div class="text-[#a78bfa] font-bold flex items-center gap-2 border-b border-[#30363d] pb-1">
    <span></span>
    <span>TERMINAL CORE // RESTRICTED ACCESS</span>
  </div>
  <div class="space-y-1.5 text-[#8b949e]">
    <p class="text-[#e6edf3] italic">"Ju tystare du blir, desto mer kan du höra."</p>
    <p>Det finns saker i det här skalet som medvetet lämnats odokumenterade. Vissa kommandon svarar bara när du frågar om världen utanför, och vissa mekaniker vaknar först när du rör vid rätt tangenter.</p>
    <p class="text-[11px] text-[#a78bfa]">Kanske finns det kodregn, ocensurerade tankar om operativsystem, eller fragment gömda i historiken...</p>
  </div>
  <div class="text-[10px] text-[#8b949e] border-t border-[#30363d]/40 pt-1 flex items-center justify-between">
    <span>Session: encrypted // tty1</span>
    <span class="text-[#a78bfa]">[SHADOW_MODE]</span>
  </div>
</div>`;
  }

  return `
<div class="text-[#e6edf3] space-y-2 font-mono text-xs p-3 rounded bg-[#0d1117] border border-[#a78bfa]/50">
  <div class="text-[#a78bfa] font-bold flex items-center gap-2 border-b border-[#30363d] pb-1">
    <span></span>
    <span>TERMINAL CORE // RESTRICTED ACCESS</span>
  </div>
  <div class="space-y-1.5 text-[#8b949e]">
    <p class="text-[#e6edf3] italic">"The quieter you become, the more you are able to hear."</p>
    <p>There are mechanics in this shell that remain deliberately unlisted. Some commands only respond when probed, and some layers only awaken when you touch the right keys.</p>
    <p class="text-[11px] text-[#a78bfa]">Perhaps there is digital rain, unfiltered OS takes, or subtle fragments lingering in history...</p>
  </div>
  <div class="text-[10px] text-[#8b949e] border-t border-[#30363d]/40 pt-1 flex items-center justify-between">
    <span>Session: encrypted // tty1</span>
    <span class="text-[#a78bfa]">[SHADOW_MODE]</span>
  </div>
</div>`;
}

/**
 * OS Opinion secret command — fun commentary on Linux vs Windows
 */
export function getOsOpinionOutput(lang: LangCode): string {
  if (lang === 'sv') {
    return `
<div class="text-[#e6edf3] space-y-2 font-mono text-xs p-3 rounded bg-[#0d1117] border border-[#a78bfa]/50">
  <div class="text-[#a78bfa] font-bold flex items-center gap-2 border-b border-[#30363d] pb-1">
    <span></span>
    <span>LINUX vs WINDOWS // ÄRLIG ÅSIKT</span>
  </div>
  <div class="space-y-1.5 text-[#8b949e]">
    <p>Linux är <span class="text-[#10b981] font-bold">friheten</span> att förstå exakt vad din dator gör. Inget telemetri-nonsens, inga uppdateringar som startar om mitt i ett prov.</p>
    <p>Windows är som att hyra en lägenhet där hyresvärden <span class="text-[#f85149]">byter lås varannan vecka</span>, installerar nya gardiner du inte bad om, och ibland bara... startar om allt medan du sover.</p>
    <p>Men — ärligt? Ibland vid 3 på natten när <span class="text-[#f59e0b]">nvidia-drivrutinerna vägrar</span> samarbeta, PulseAudio bestämmer sig för att byta till hörlurarna i ett annat rum, och WiFi-kortet kräver en kernel-patch kompilerad under fullmåne... då undrar man ibland.</p>
    <p class="text-[#10b981] font-bold">Men sedan startar man om i 0.8 sekunder utan att bli tillfrågad om Outlook, OneDrive, Copilot och Edge. Och då vet man att det var värt det. </p>
  </div>
  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/40 pt-1">
    <span class="text-[#38bdf8]">BTW, I use</span> <span class="text-[#10b981] font-bold">Omarchy (Arch Linux + Hyprland).</span>
  </div>
</div>`;
  }

  return `
<div class="text-[#e6edf3] space-y-2 font-mono text-xs p-3 rounded bg-[#0d1117] border border-[#a78bfa]/50">
  <div class="text-[#a78bfa] font-bold flex items-center gap-2 border-b border-[#30363d] pb-1">
    <span></span>
    <span>LINUX vs WINDOWS // HONEST TAKE</span>
  </div>
  <div class="space-y-1.5 text-[#8b949e]">
    <p>Linux is the <span class="text-[#10b981] font-bold">freedom</span> to understand exactly what your machine is doing. No telemetry nonsense, no updates that reboot mid-exam.</p>
    <p>Windows is like renting an apartment where the landlord <span class="text-[#f85149]">changes the locks every other week</span>, installs curtains you didn't ask for, and occasionally just... reboots everything while you sleep.</p>
    <p>But — honestly? Sometimes at 3 AM when <span class="text-[#f59e0b]">nvidia drivers refuse</span> to cooperate, PulseAudio decides to route sound to headphones in another room, and the WiFi card requires a kernel patch compiled under a full moon... you wonder.</p>
    <p class="text-[#10b981] font-bold">But then you reboot in 0.8 seconds without being asked about Outlook, OneDrive, Copilot and Edge. And you know it was worth it. </p>
  </div>
  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/40 pt-1">
    <span class="text-[#38bdf8]">BTW, I use</span> <span class="text-[#10b981] font-bold">Omarchy (Arch Linux + Hyprland).</span>
  </div>
</div>`;
}

/**
 * Status command output: clean telemetry card dynamically pulling from active schedule & presets
 */
export function getStatusOutput(lang: LangCode): string {
  const isSv = lang === 'sv';
  const status = getActiveStatus();
  const eventBanner = status.activeEvent ? `
    <div class="p-2 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] flex items-center justify-between text-[11px]">
      <span class="font-bold">${isSv ? 'Schemalagt event:' : 'Scheduled event:'} ${status.activeEvent.name[lang]}</span>
      <span class="text-[#8b949e]">${status.activeEvent.startDate} – ${status.activeEvent.endDate}</span>
    </div>
  ` : '';

  const row = (label: string, value: string, cls = 'text-[#e6edf3]') => `
    <div class="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-x-2">
      <span class="text-[#8b949e]">${label}</span>
      <span class="${cls}">${value}</span>
    </div>`;

  return `
<div class="p-3.5 rounded bg-[#0d1117] border border-[#30363d] text-xs font-mono space-y-2.5 max-w-2xl">
  <div class="flex items-center justify-between border-b border-[#30363d] pb-2 gap-1.5">
    <span class="text-[#10b981] font-bold">#</span> <span class="text-[#e6edf3] font-bold">${status.user}@${status.host}</span>
    <span class="text-[10px] text-[#8b949e]">${status.lastUpdated}</span>
  </div>

  ${eventBanner}

  <div class="space-y-1.5 pt-0.5">
    ${row(isSv ? 'Plats' : 'Location', status.location[lang])}
    ${row(isSv ? 'Aktivitet' : 'Activity', status.activity[lang])}
    ${row(isSv ? 'Fokus' : 'Focus', status.focus[lang])}
    ${row(isSv ? 'Homelab' : 'Homelab', status.homelab[lang])}
    ${row(isSv ? 'Tillgänglig' : 'Available', status.availability[lang])}
  </div>

  <div class="text-[10px] text-[#8b949e] border-t border-[#30363d]/40 pt-1.5">
    ${isSv ? "Skriv 'schedule' för kommande tentor och läger." : "Type 'schedule' for upcoming exams and camps."}
  </div>
</div>`;
}

/**
 * Schedule command output: lists upcoming exam weeks and athletic training camps
 */
export function getScheduleOutput(lang: LangCode): string {
  const isSv = lang === 'sv';
  const upcoming = getUpcomingEvents(5);
  const current = getCurrentEvent();

  const eventsHtml = upcoming.map((ev) => {
    const isOngoing = current?.id === ev.id;
    const color = ev.statusPreset === 'exam'
      ? '#e0a43a'
      : ev.statusPreset === 'swim'
        ? '#56b6e8'
        : ev.statusPreset === 'camp'
          ? '#4fbf8b'
          : ev.statusPreset === 'vacation'
            ? '#b39ae8'
            : '#484f58';

    return `
      <div class="border-l-2 pl-3 py-1.5" style="border-color:${color}">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <span class="text-[#e6edf3] font-semibold">
            ${ev.name[lang]}
            <span class="text-[10px] font-normal" style="color:${color}">[${ev.badge[lang]}]</span>
          </span>
          <span class="text-[10px] text-[#8b949e]">${ev.startDate} – ${ev.endDate}${isOngoing ? ` · ${isSv ? 'pågår' : 'now'}` : ''}</span>
        </div>
        <p class="text-[11px] text-[#a8b1bb] mt-0.5 leading-relaxed">${ev.description[lang]}</p>
      </div>`;
  }).join('');

  return `
<div class="p-3 rounded bg-[#0d1117] border border-[#30363d] text-xs font-mono space-y-2.5 max-w-2xl">
  <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#30363d] pb-1">
    <span class="text-[#10b981] font-bold text-sm"># ${isSv ? 'Schema' : 'Schedule'}</span>
    <span class="text-[10px] text-[#8b949e]">${isSv ? 'Datum som påverkar tillgängligheten' : 'Dates that affect availability'}</span>
  </div>

  <div class="space-y-2">
    ${eventsHtml}
  </div>

  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/50 pt-2">
    <span class="text-[#10b981]">[status]</span> ${isSv ? 'speglar aktuellt datum' : 'reflects the current date'}
  </div>
</div>`;
}

/**
 * Fastfetch command output: prints the complete ASCII cat badge + specs + palette inline!
 */
export function getFastfetchOutput(lang: LangCode): string {
  const data = lang === 'sv' ? fastfetchSv : fastfetchEn;

  const specsRows = data.specs.map((item: any) => {
    const color = item.color === 'emerald' ? '#10b981' : item.color === 'amber' ? '#f59e0b' : '#38bdf8';
    return `
      <div class="grid grid-cols-[104px_1fr] gap-x-2">
        <span class="font-semibold" style="color:${color}">${item.key}</span>
        <span class="text-[#e6edf3]">${item.value}</span>
      </div>`;
  }).join('');

  return `
<div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-3 rounded bg-[#161b22] border border-[#30363d]/80 text-xs font-mono">
  <div class="shrink-0 select-none text-[11px] sm:text-xs leading-[1.2] p-2.5 rounded bg-[#161b22] border border-[#30363d]/80 flex flex-col justify-center items-center text-center">
        <img src="/images/logosmall.svg" alt="GULO" class="w-20 h-20 sm:w-24 sm:h-24 object-contain opacity-90" style="filter: invert(1);" />

    <div class="mt-1.5 text-[10px] font-semibold text-[#10b981]">${data.badge}</div>
    <div class="text-[9px] text-[#8b949e]">${data.tagline}</div>
  </div>

  <div class="flex-1 min-w-0 space-y-1">
    <div>
      <span class="text-[#10b981] font-bold">${data.user}</span><span class="text-[#8b949e]">@</span><span class="text-[#38bdf8] font-bold">${data.host}</span>
      <div class="text-[#30363d] select-none tracking-tighter leading-none mt-0.5">
        ---------------------------------------------------
      </div>
    </div>
    <div class="space-y-0.5 pt-0.5 text-xs">
      ${specsRows}
    </div>
  </div>
</div>`;
}

/**
 * Bio / About command output: clean executive overview of profile, passions and stack
 */
export function getBioOutput(lang: LangCode): string {
  const isSv = lang === 'sv';

  const rows = isSv
    ? [
        ['Studier', '#56b6e8', 'Civilingenjör Datateknik på Chalmers, årskurs två, EDIT-huset, RIU-student.'],
        ['Simning', '#4fbf8b', 'Sprint frisim och fjäril för MASS och Growth Objective, på Åbybadet och GoCo.'],
        ['Linux', '#38bdf8', 'Arch med Hyprland, Neovim och Alacritty på mina egna maskiner.'],
        ['Homelab', '#e0a43a', 'Proxmox-server och ett Raspberry Pi-kluster med webbplatser, spelservrar och interna verktyg.'],
        ['Utanför', '#b39ae8', 'Vandring, klättring, cykling, discgolf, golf och foto/video med en Sony ZV-E10.'],
      ]
    : [
        ['Studies', '#56b6e8', 'Computer Science and Engineering at Chalmers, year two, EDIT building, RIU student.'],
        ['Swimming', '#4fbf8b', 'Sprint freestyle and butterfly for MASS and Growth Objective, at Åbybadet and GoCo.'],
        ['Linux', '#38bdf8', 'Arch with Hyprland, Neovim, and Alacritty on my own machines.'],
        ['Homelab', '#e0a43a', 'A Proxmox server and a Raspberry Pi cluster running websites, game servers, and internal tools.'],
        ['Outside', '#b39ae8', 'Hiking, climbing, cycling, discgolf, golf, and photo/video on a Sony ZV-E10.'],
      ];

  const rowsHtml = rows.map(([label, color, value]) => `
    <span class="font-semibold" style="color:${color}">${label}</span><span class="text-[#c9d1d9]">${value}</span>`).join('');

  return `
<div class="p-3 rounded bg-[#0d1117] border border-[#30363d] text-xs font-mono space-y-2.5 max-w-2xl">
  <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#30363d] pb-1">
    <span class="text-[#10b981] font-bold text-sm"># Gustav Löfqvist</span>
    <span class="text-[10px] text-[#8b949e]">${isSv ? 'Chalmers D-24' : 'Chalmers D-24'}</span>
  </div>

  <p class="text-[#c9d1d9] leading-relaxed">
    ${isSv ? 'Jag läser datateknik på Chalmers, simmar sprint frisim och driver ett homelab i Göteborg.' : 'I study computer science at Chalmers, swim sprint freestyle, and run a homelab in Gothenburg.'}
  </p>

  <div class="grid grid-cols-[84px_1fr] sm:grid-cols-[96px_1fr] gap-x-3 gap-y-1 text-[11px]">
    ${rowsHtml}
  </div>

  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/50 pt-2">
    <span class="text-[#10b981]">[cv]</span> ${isSv ? 'hela tidslinjen' : 'full timeline'}
    &nbsp; <span class="text-[#10b981]">[school]</span> ${isSv ? 'Chalmers' : 'Chalmers'}
    &nbsp; <span class="text-[#10b981]">[swim]</span> ${isSv ? 'träning' : 'training'}
    &nbsp; <span class="text-[#10b981]">[contact]</span> ${isSv ? 'e-post' : 'email'}
  </div>
</div>`;
}

/**
 * CV / Resume / Recruit command output: structured candidate summary
 */
export function getCvOutput(lang: LangCode): string {
  const isSv = lang === 'sv';

  const section = (title: string, body: string) => `
    <div>
      <div class="text-[#e6edf3] font-semibold mb-1">${title}</div>
      <div class="space-y-1 text-[11px] text-[#a8b1bb] leading-relaxed">${body}</div>
    </div>`;

  const item = (title: string, detail: string) =>
    `<div><span class="text-[#e6edf3]">${title}</span> ${detail}</div>`;

  const education = isSv
    ? item('Chalmers tekniska högskola, 2024–2029', 'Civilingenjör Datateknik, årskurs två. RIU-elitidrottare.') +
      item('Wheeling University, 2023–2024', 'Business Management och NCAA D2-simning. Dean\'s List, Conference Champion och Freshman of the Year.') +
      item('Mälardalens universitet, 2022–2023', 'Datavetenskap: Python, Linux och nätverkssäkerhet.') +
      item('Hitachigymnasiet, 2020–2023', 'Smarta system och AI.')
    : item('Chalmers University of Technology, 2024–2029', 'M.Sc. Computer Science and Engineering, year two. RIU elite athlete.') +
      item('Wheeling University, 2023–2024', 'Business Management and NCAA D2 swimming. Dean\'s List, Conference Champion, Freshman of the Year.') +
      item('Mälardalen University, 2022–2023', 'Computer science: Python, Linux, and network security.') +
      item('Hitachigymnasiet, 2020–2023', 'Smart systems and AI.');

  const technical = isSv
    ? item('Programmering:', 'Python, C, Java, JavaScript.') +
      item('Infrastruktur:', 'Proxmox VE, Linux (Arch, Debian), Docker, WireGuard.') +
      item('Verktyg:', 'Git, Neovim, REST APIs, CI/CD.')
    : item('Languages:', 'Python, C, Java, JavaScript.') +
      item('Infrastructure:', 'Proxmox VE, Linux (Arch, Debian), Docker, WireGuard.') +
      item('Tooling:', 'Git, Neovim, REST APIs, CI/CD.');

  const homelab = isSv
    ? 'Proxmox-server och Raspberry Pi-kluster. Där kör webbplatser, Minecraft (Velocity och PaperMC), interna verktyg och schemalagda backuper.'
    : 'A Proxmox server and Raspberry Pi cluster running websites, Minecraft (Velocity and PaperMC), internal tools, and scheduled backups.';

  const athletics = isSv
    ? 'Sprintsimmare för MASS och Growth Objective. SM-silver 4x50 m frisim 2025 och Student-SM-guld 50 m frisim 2026. Fem simpass och tre gympass i veckan.'
    : 'Sprint swimmer for MASS and Growth Objective. SM silver in the 4x50 m freestyle (2025) and Student-SM gold in the 50 m freestyle (2026). Five swim and three gym sessions each week.';

  return `
<div class="p-3.5 rounded bg-[#0d1117] border border-[#30363d] text-xs font-mono space-y-3 max-w-2xl">
  <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#30363d] pb-2">
    <span class="text-[#10b981] font-bold text-sm"># ${isSv ? 'Meritförteckning' : 'Curriculum vitae'}</span>
    <span class="text-[10px] text-[#8b949e]">Gustav Löfqvist, Chalmers D-24</span>
  </div>

  ${section(isSv ? 'Utbildning' : 'Education', education)}
  ${section(isSv ? 'Teknik' : 'Technical', technical)}
  ${section('Homelab', homelab)}
  ${section(isSv ? 'Simning' : 'Swimming', athletics)}

  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/50 pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
    <span>${isSv ? 'Fullständigt CV via e-post:' : 'Full CV by email:'} <a href="mailto:gurra@gulo.se" class="text-[#e6edf3] underline decoration-[#484f58] underline-offset-2 hover:text-[#10b981]">gurra@gulo.se</a></span>
    <span><span class="text-[#10b981]">[contact]</span> ${isSv ? 'för länkar' : 'for links'}</span>
  </div>
</div>`;
}
