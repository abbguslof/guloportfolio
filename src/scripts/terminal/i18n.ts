// src/scripts/terminal/i18n.ts - Centralized Internationalization & Terminal Texts
import type { LangCode } from './types';
import { getActiveStatus, type ActiveStatusResult } from '../../data/status';
import { getUpcomingEvents, getCurrentEvent } from '../../data/schedule';
import { calculateUptime, isSiteOnline } from '../../data/telemetry';
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
  if (lang === 'sv') {
    return `
<div class="text-[#e6edf3] space-y-2 font-mono">
  <div class="text-[#10b981] font-bold border-b border-[#30363d] pb-1">BASH KOMMANDOTOLK // AKTUELLA KOMMANDON</div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
    <div>
      <div class="text-[#38bdf8] font-bold mb-1">Information &amp; Studier:</div>
      <div><span class="text-[#10b981] font-semibold">bio / about</span> : Komplett profil, CV &amp; översikt</div>
      <div><span class="text-[#10b981] font-semibold">status</span> : Live-status, homelab &amp; tillgänglighet</div>
      <div><span class="text-[#10b981] font-semibold">schedule / tentor</span> : Chalmers tentaveckor &amp; planering</div>
      <div><span class="text-[#10b981] font-semibold">school / chalmers</span> : Chalmers-studier &amp; kurser</div>
      <div><span class="text-[#10b981] font-semibold">swim</span> : Simningspass &amp; träningstider</div>
      <div><span class="text-[#10b981] font-semibold">whoami</span> : Information om mig &amp; bakgrund</div>
      <div><span class="text-[#10b981] font-semibold">contact</span> : Kontaktvägar &amp; sociala medier</div>
    </div>
    <div>
      <div class="text-[#38bdf8] font-bold mb-1">Navigering &amp; Webb:</div>
      <div><span class="text-[#10b981] font-semibold">home / hem</span> : Gå till startsidan (cockpiten)</div>
      <div><span class="text-[#10b981] font-semibold">projects / homelab</span> : Öppna portföljsidan</div>
      <div><span class="text-[#10b981] font-semibold">thoughts / blog</span> : Öppna blogg/anteckningar</div>
      <div><span class="text-[#10b981] font-semibold">files</span> : Öppna filarkivet</div>
      <div><span class="text-[#10b981] font-semibold">theme / bg &lt;stil&gt;</span> : Växla visuell bakgrundseffekt</div>
    </div>
  </div>

  <div class="text-xs pt-1 border-t border-[#30363d]/60">
    <div class="text-[#38bdf8] font-bold mb-1">Filsystem &amp; Verktyg:</div>
    <div class="text-[#8b949e] flex flex-wrap gap-x-4 gap-y-1">
      <span><strong class="text-[#10b981]">ls [-la]</strong> lista filer</span>
      <span><strong class="text-[#10b981]">cd &lt;mapp&gt;</strong> byt katalog</span>
      <span><strong class="text-[#10b981]">cat &lt;fil&gt;</strong> visa filinnehåll</span>
      <span><strong class="text-[#10b981]">nvim [fil] / vim</strong> texteditor</span>
      <span><strong class="text-[#10b981]">wget &lt;fil&gt;</strong> ladda ned från files/</span>
      <span><strong class="text-[#10b981]">open &lt;mål&gt;</strong> öppna sida/fil</span>
      <span><strong class="text-[#10b981]">clear</strong> rensa skärmen</span>
      <span><strong class="text-[#10b981]">exit</strong> stäng fönstret</span>
    </div>
  </div>

  <div class="text-[11px] text-[#38bdf8] bg-[#0d1117] p-2 rounded border border-[#30363d] flex items-center justify-between">
    <span>💡 Skriv <code class="text-[#10b981] font-bold">help --extended</code> (eller <code class="text-[#10b981]">help -e</code>) för git, miniräknare, spel &amp; verktyg</span>
    <span class="text-[#8b949e]">[Tab för autokomplettering]</span>
  </div>
</div>`;
  }

  return `
<div class="text-[#e6edf3] space-y-2 font-mono">
  <div class="text-[#10b981] font-bold border-b border-[#30363d] pb-1">BASH INTERPRETER // ESSENTIAL COMMANDS</div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
    <div>
      <div class="text-[#38bdf8] font-bold mb-1">Information &amp; Academics:</div>
      <div><span class="text-[#10b981] font-semibold">bio / about</span> : Complete profile, CV &amp; overview</div>
      <div><span class="text-[#10b981] font-semibold">status</span> : Live status, homelab &amp; availability</div>
      <div><span class="text-[#10b981] font-semibold">schedule / exams</span> : Chalmers finals &amp; exam calendar</div>
      <div><span class="text-[#10b981] font-semibold">school / chalmers</span> : Chalmers coursework &amp; focus</div>
      <div><span class="text-[#10b981] font-semibold">swim</span> : Swim routines &amp; training stats</div>
      <div><span class="text-[#10b981] font-semibold">whoami</span> : Background &amp; profile overview</div>
      <div><span class="text-[#10b981] font-semibold">contact</span> : Contact info &amp; social handles</div>
    </div>
    <div>
      <div class="text-[#38bdf8] font-bold mb-1">Navigation &amp; Web:</div>
      <div><span class="text-[#10b981] font-semibold">home / hem</span> : Navigate to homepage (cockpit)</div>
      <div><span class="text-[#10b981] font-semibold">projects / homelab</span> : Portfolio showcase</div>
      <div><span class="text-[#10b981] font-semibold">thoughts / blog</span> : Blog &amp; research notes</div>
      <div><span class="text-[#10b981] font-semibold">files</span> : Downloads &amp; dotfiles</div>
      <div><span class="text-[#10b981] font-semibold">theme / bg &lt;style&gt;</span> : Switch ambient visual effect</div>
    </div>
  </div>

  <div class="text-xs pt-1 border-t border-[#30363d]/60">
    <div class="text-[#38bdf8] font-bold mb-1">Filesystem &amp; Utilities:</div>
    <div class="text-[#8b949e] flex flex-wrap gap-x-4 gap-y-1">
      <span><strong class="text-[#10b981]">ls [-la]</strong> list files</span>
      <span><strong class="text-[#10b981]">cd &lt;dir&gt;</strong> change directory</span>
      <span><strong class="text-[#10b981]">cat &lt;file&gt;</strong> view file contents</span>
      <span><strong class="text-[#10b981]">nvim [file] / vim</strong> text editor</span>
      <span><strong class="text-[#10b981]">wget &lt;file&gt;</strong> download from files/</span>
      <span><strong class="text-[#10b981]">open &lt;target&gt;</strong> open file or page</span>
      <span><strong class="text-[#10b981]">clear</strong> clear screen</span>
      <span><strong class="text-[#10b981]">exit</strong> close window</span>
    </div>
  </div>

  <div class="text-[11px] text-[#38bdf8] bg-[#0d1117] p-2 rounded border border-[#30363d] flex items-center justify-between">
    <span>💡 Type <code class="text-[#10b981] font-bold">help --extended</code> (or <code class="text-[#10b981]">help -e</code>) for git, calculator, games &amp; tools</span>
    <span class="text-[#8b949e]">[Press Tab to auto-complete]</span>
  </div>
</div>`;
}

/**
 * Extended Help: displays full developer toolkit, git commands, calculator, minigames and scripts
 */
export function getExtendedHelpHtml(lang: LangCode): string {
  if (lang === 'sv') {
    return `
<div class="text-[#e6edf3] space-y-3 font-mono">
  <div class="text-[#10b981] font-bold border-b border-[#30363d] pb-1 flex items-center justify-between">
    <span>BASH KOMMANDOTOLK // FULLSTÄNDIG UTÖKAD KOMMANDOLISTA</span>
    <span class="text-[10px] text-[#38bdf8] font-normal">--extended / -e</span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
    <!-- Kolumn 1: Info & Webb -->
    <div class="space-y-3">
      <div>
        <div class="text-[#38bdf8] font-bold mb-1">📄 Information &amp; Profil:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">bio</code>, <code class="text-[#10b981]">about</code> : Biografi &amp; executive översikt</div>
          <div><code class="text-[#10b981]">cv</code>, <code class="text-[#10b981]">resume</code> : Utbildning, kompetenser &amp; meriter</div>
          <div><code class="text-[#10b981]">stats</code>, <code class="text-[#10b981]">btop</code> : System- &amp; träningsmonitor (TUI)</div>
          <div><code class="text-[#10b981]">status</code> : Aktuell status, homelab &amp; tillgänglighet</div>
          <div><code class="text-[#10b981]">whoami</code> : Profil, bakgrund &amp; intressen</div>
          <div><code class="text-[#10b981]">school</code>, <code class="text-[#10b981]">chalmers</code> : Civilingenjör Datateknik</div>
          <div><code class="text-[#10b981]">swim</code> : Tävlingssimning &amp; träningsschema</div>
          <div><code class="text-[#10b981]">contact</code> : E-post, GitHub &amp; länkar</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">🌐 Webb &amp; Navigering:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">home</code>, <code class="text-[#10b981]">hem</code> : Gå tillbaka till cockpiten (/)</div>
          <div><code class="text-[#10b981]">projects</code>, <code class="text-[#10b981]">homelab</code> : Projekt &amp; servrar</div>
          <div><code class="text-[#10b981]">thoughts</code>, <code class="text-[#10b981]">blog</code> : Tankar &amp; anteckningar</div>
          <div><code class="text-[#10b981]">files</code> : Filarkiv &amp; nedladdningar</div>
          <div><code class="text-[#10b981]">open &lt;mål&gt;</code> : Öppna projekt, post eller sida</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">🎨 Bakgrunder &amp; Cockpit:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">bg</code> : Växla / öppna HUD-rutan för bakgrunder</div>
          <div><code class="text-[#10b981]">bg &lt;stil&gt;</code> : Byt stil (standard, topo, dither, ascii, dots, pixel, shimmer, off)</div>
        </div>
      </div>
    </div>

    <!-- Kolumn 2: Utvecklarverktyg, Git & Nöje -->
    <div class="space-y-3">
      <div>
        <div class="text-[#38bdf8] font-bold mb-1">🐙 Git Versionshantering:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">git status</code> : Arbetskopia &amp; ändrade filer</div>
          <div><code class="text-[#10b981]">git log [--oneline]</code> : Senaste commits</div>
          <div><code class="text-[#10b981]">git branch</code> : Aktiva grenar</div>
          <div><code class="text-[#10b981]">git diff</code> : Visa färgkodad diff</div>
          <div><code class="text-[#10b981]">git remote -v</code> : Upstream GitHub-adress</div>
          <div><code class="text-[#10b981]">git push</code> : Simulera git push till origin</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">🧮 Interaktivitet, Skript &amp; Spel:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">nvim [fil]</code>, <code class="text-[#10b981]">vim</code> : Neovim texteditor</div>
          <div><code class="text-[#10b981]">calc &lt;uttryck&gt;</code> : Matematisk miniräknare (t.ex. <span class="text-[#e6edf3]">calc 2²</span> eller <span class="text-[#e6edf3]">calc 2**2</span>)</div>
          <div><code class="text-[#10b981]">guess [&lt;tal&gt;]</code> : Spela gissningsspelet (1-100)</div>
          <div><code class="text-[#10b981]">./helloworld.sh</code> : Kör skalskriptet i hemkatalogen</div>
          <div><code class="text-[#10b981]">hello / hej / tjena</code> : Hälsningsfras</div>
          <div><code class="text-[#10b981]">fastfetch / neofetch</code> : Skriv ut systemdiagnostik</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">📁 Filsystem &amp; Bash:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">ls -la</code> : Lista alla filer (inkl. dolda filer)</div>
          <div><code class="text-[#10b981]">cd &lt;katalog&gt;</code>, <code class="text-[#10b981]">pwd</code>, <code class="text-[#10b981]">cat &lt;fil&gt;</code></div>
          <div><code class="text-[#10b981]">wget &lt;fil&gt;</code> : Ladda ned från files/ (alias: dl, download)</div>
          <div><code class="text-[#10b981]">uptime</code>, <code class="text-[#10b981]">date</code>, <code class="text-[#10b981]">uname</code>, <code class="text-[#10b981]">history</code></div>
        </div>
      </div>
    </div>
  </div>

  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/60 pt-2 flex items-center justify-between">
    <span>Skriv <code class="text-[#10b981]">help</code> för den korta listan.</span>
    <span>Tryck <code class="text-[#10b981]">Tab</code> för autokomplettering.</span>
  </div>
</div>`;
  }

  return `
<div class="text-[#e6edf3] space-y-3 font-mono">
  <div class="text-[#10b981] font-bold border-b border-[#30363d] pb-1 flex items-center justify-between">
    <span>BASH INTERPRETER // FULL EXTENDED COMMAND SUITE</span>
    <span class="text-[10px] text-[#38bdf8] font-normal">--extended / -e</span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
    <!-- Col 1: Info & Web -->
    <div class="space-y-3">
      <div>
        <div class="text-[#38bdf8] font-bold mb-1">📄 Information &amp; Bio:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">bio</code>, <code class="text-[#10b981]">about</code> : Biography &amp; executive summary</div>
          <div><code class="text-[#10b981]">cv</code>, <code class="text-[#10b981]">resume</code> : Academics, skills &amp; experience</div>
          <div><code class="text-[#10b981]">stats</code>, <code class="text-[#10b981]">btop</code> : System &amp; athletic metrics (TUI)</div>
          <div><code class="text-[#10b981]">status</code> : Current focus, homelab &amp; availability</div>
          <div><code class="text-[#10b981]">whoami</code> : Profile, background &amp; passions</div>
          <div><code class="text-[#10b981]">school</code>, <code class="text-[#10b981]">chalmers</code> : Chalmers Computer Science degree</div>
          <div><code class="text-[#10b981]">swim</code> : Competitive swimming routines &amp; stats</div>
          <div><code class="text-[#10b981]">contact</code> : Email, GitHub &amp; social links</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">🌐 Web &amp; Navigation:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">home</code>, <code class="text-[#10b981]">hem</code> : Return to the cockpit (/)</div>
          <div><code class="text-[#10b981]">projects</code>, <code class="text-[#10b981]">homelab</code> : Portfolio showcase</div>
          <div><code class="text-[#10b981]">thoughts</code>, <code class="text-[#10b981]">blog</code> : Articles, notes &amp; deep dives</div>
          <div><code class="text-[#10b981]">files</code> : Downloads, configs &amp; dotfiles</div>
          <div><code class="text-[#10b981]">open &lt;target&gt;</code> : Open project, post or page</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">🎨 Visual Themes &amp; Effects:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">bg</code> : Toggle HUD switcher widget</div>
          <div><code class="text-[#10b981]">bg &lt;style&gt;</code> : Set effect (standard, topo, dither, ascii, dots, pixel, shimmer, off)</div>
        </div>
      </div>
    </div>

    <!-- Col 2: Dev Tools, Git & Fun -->
    <div class="space-y-3">
      <div>
        <div class="text-[#38bdf8] font-bold mb-1">🐙 Git Version Control:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">git status</code> : Working tree &amp; modified files</div>
          <div><code class="text-[#10b981]">git log [--oneline]</code> : Recent commit history</div>
          <div><code class="text-[#10b981]">git branch</code> : List branches</div>
          <div><code class="text-[#10b981]">git diff</code> : View colorized code diff</div>
          <div><code class="text-[#10b981]">git remote -v</code> : Remote upstream URLs</div>
          <div><code class="text-[#10b981]">git push</code> : Simulate upstream push</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">🧮 Interactive, Scripting &amp; Fun:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">nvim [file]</code>, <code class="text-[#10b981]">vim</code> : Neovim text editor</div>
          <div><code class="text-[#10b981]">calc &lt;expr&gt;</code> : Math evaluator (e.g. <span class="text-[#e6edf3]">calc 2²</span> or <span class="text-[#e6edf3]">calc 2**2</span>)</div>
          <div><code class="text-[#10b981]">guess [&lt;num&gt;]</code> : Number guessing minigame (1-100)</div>
          <div><code class="text-[#10b981]">./helloworld.sh</code> : Execute the shell script in ~</div>
          <div><code class="text-[#10b981]">hello / hi / hey</code> : Friendly greeting</div>
          <div><code class="text-[#10b981]">fastfetch / neofetch</code> : Print system diagnostic banner</div>
        </div>
      </div>

      <div>
        <div class="text-[#38bdf8] font-bold mb-1">📁 Filesystem &amp; Bash:</div>
        <div class="space-y-0.5 text-[#8b949e]">
          <div><code class="text-[#10b981]">ls -la</code> : List all files (including dotfiles)</div>
          <div><code class="text-[#10b981]">cd &lt;dir&gt;</code>, <code class="text-[#10b981]">pwd</code>, <code class="text-[#10b981]">cat &lt;file&gt;</code></div>
          <div><code class="text-[#10b981]">wget &lt;file&gt;</code> : Download from files/ (alias: dl, download)</div>
          <div><code class="text-[#10b981]">uptime</code>, <code class="text-[#10b981]">date</code>, <code class="text-[#10b981]">uname</code>, <code class="text-[#10b981]">history</code></div>
        </div>
      </div>
    </div>
  </div>

  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/60 pt-2 flex items-center justify-between">
    <span>Type <code class="text-[#10b981]">help</code> for the compact list.</span>
    <span>Press <code class="text-[#10b981]">Tab</code> for autocomplete.</span>
  </div>
</div>`;
}

/**
 * Friendly greetings handler for hello, hi, tjena, hej, yo, etc.
 */
export function getGreetingResponse(word: string, lang: LangCode): string {
  if (lang === 'sv') {
    const greetings = [
      `Tjena! 👋 Välkommen till min terminal och digitala trädgård. Skriv <code class="text-[#10b981]">help</code> för att se vad du kan göra, eller <code class="text-[#38bdf8]">cat whoami.md</code> för att läsa om mig!`,
      `Hej där! Kul att du hittade hit till terminalen. Testa att köra <code class="text-[#10b981]">./helloworld.sh</code> eller öppna något i <code class="text-[#38bdf8]">nvim whoami.md</code>!`,
      `Hallå! 🏊‍♂️ Hoppas du gillar cockpiten. Skriv <code class="text-[#10b981]">school</code> för att läsa om mina Chalmers-studier eller <code class="text-[#38bdf8]">status</code> för live-info.`
    ];
    return `<div class="text-[#10b981] text-xs font-mono">${greetings[Math.floor(Math.random() * greetings.length)]}</div>`;
  }

  const greetings = [
    `Hello! 👋 Welcome to my terminal and digital garden. Type <code class="text-[#10b981]">help</code> to explore commands, or <code class="text-[#38bdf8]">cat whoami.md</code> to learn more about me!`,
    `Hey there! Great to see you in the terminal. Try running <code class="text-[#10b981]">./helloworld.sh</code> or explore files with <code class="text-[#38bdf8]">nvim whoami.md</code>!`,
    `Hi! 🏊‍♂️ Welcome to my personal cockpit. Type <code class="text-[#10b981]">school</code> to read about Chalmers CS or <code class="text-[#38bdf8]">status</code> for live updates.`
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
    <span>🗝️</span>
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
    <span>🗝️</span>
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
    <span>🐧</span>
    <span>LINUX vs WINDOWS // ÄRLIG ÅSIKT</span>
  </div>
  <div class="space-y-1.5 text-[#8b949e]">
    <p>Linux är <span class="text-[#10b981] font-bold">friheten</span> att förstå exakt vad din dator gör. Inget telemetri-nonsens, inga uppdateringar som startar om mitt i ett prov.</p>
    <p>Windows är som att hyra en lägenhet där hyresvärden <span class="text-[#f85149]">byter lås varannan vecka</span>, installerar nya gardiner du inte bad om, och ibland bara... startar om allt medan du sover.</p>
    <p>Men — ärligt? Ibland vid 3 på natten när <span class="text-[#f59e0b]">nvidia-drivrutinerna vägrar</span> samarbeta, PulseAudio bestämmer sig för att byta till hörlurarna i ett annat rum, och WiFi-kortet kräver en kernel-patch kompilerad under fullmåne... då undrar man ibland.</p>
    <p class="text-[#10b981] font-bold">Men sedan startar man om i 0.8 sekunder utan att bli tillfrågad om Outlook, OneDrive, Copilot och Edge. Och då vet man att det var värt det. 🐧</p>
  </div>
  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/40 pt-1">
    <span class="text-[#38bdf8]">BTW, I use</span> <span class="text-[#10b981] font-bold">Arch... nej, Debian. Okej, det beror på.</span>
  </div>
</div>`;
  }

  return `
<div class="text-[#e6edf3] space-y-2 font-mono text-xs p-3 rounded bg-[#0d1117] border border-[#a78bfa]/50">
  <div class="text-[#a78bfa] font-bold flex items-center gap-2 border-b border-[#30363d] pb-1">
    <span>🐧</span>
    <span>LINUX vs WINDOWS // HONEST TAKE</span>
  </div>
  <div class="space-y-1.5 text-[#8b949e]">
    <p>Linux is the <span class="text-[#10b981] font-bold">freedom</span> to understand exactly what your machine is doing. No telemetry nonsense, no updates that reboot mid-exam.</p>
    <p>Windows is like renting an apartment where the landlord <span class="text-[#f85149]">changes the locks every other week</span>, installs curtains you didn't ask for, and occasionally just... reboots everything while you sleep.</p>
    <p>But — honestly? Sometimes at 3 AM when <span class="text-[#f59e0b]">nvidia drivers refuse</span> to cooperate, PulseAudio decides to route sound to headphones in another room, and the WiFi card requires a kernel patch compiled under a full moon... you wonder.</p>
    <p class="text-[#10b981] font-bold">But then you reboot in 0.8 seconds without being asked about Outlook, OneDrive, Copilot and Edge. And you know it was worth it. 🐧</p>
  </div>
  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/40 pt-1">
    <span class="text-[#38bdf8]">BTW, I use</span> <span class="text-[#10b981] font-bold">Arch... no wait, Debian. Well, it depends.</span>
  </div>
</div>`;
}

/**
 * Status command output: clean telemetry card dynamically pulling from active schedule & presets
 */
export function getStatusOutput(lang: LangCode): string {
  const isSv = lang === 'sv';
  const status = getActiveStatus();
  const uptime = calculateUptime();
  const isOnline = isSiteOnline();
  const eventBanner = status.activeEvent ? `
    <div class="p-2 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] flex items-center justify-between text-[11px]">
      <span class="font-bold flex items-center gap-1.5">
        <span>⚠</span>
        <span>${isSv ? 'SCHEMALAGT EVENT AKTIVT:' : 'SCHEDULED EVENT ACTIVE:'} ${status.activeEvent.name[lang]}</span>
      </span>
      <span class="text-[#8b949e]">${status.activeEvent.startDate} → ${status.activeEvent.endDate}</span>
    </div>
  ` : '';

  const statusBadge = !isOnline
    ? `<span class="text-[10px] px-1.5 py-0.2 rounded border border-[#f85149] text-[#f85149]" style="color: #f85149 !important; border-color: #f85149 !important;">[OFFLINE]</span>`
    : `<span class="text-[10px] px-1.5 py-0.2 rounded border ${status.activeEvent ? 'border-[#f59e0b] text-[#f59e0b]' : 'border-[#10b981] text-[#10b981]'}">${status.badge[lang].replace(/\[●\s*/g, '[')}</span>`;

  return `
<div class="p-3.5 rounded bg-[#0d1117] border border-[#38bdf8]/50 text-xs font-mono space-y-2.5 max-w-2xl">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#30363d] pb-2 gap-1.5">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full ${!isOnline ? 'bg-[#f85149]' : (status.activeEvent ? 'bg-[#f59e0b] animate-pulse' : 'bg-[#10b981] animate-pulse')}" style="${!isOnline ? 'background-color: #f85149 !important;' : ''}"></span>
      <span class="text-[#38bdf8] font-bold">STATUS // ${status.user}@${status.host}</span>
      ${statusBadge}
    </div>
    <span class="text-[10px] text-[#8b949e]">${isSv ? 'Senast uppdaterad:' : 'Last updated:'} ${status.lastUpdated}</span>
  </div>

  ${eventBanner}

  <div class="space-y-1.5 pt-0.5 text-[#e6edf3]">
    <div class="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-x-2">
      <span class="text-[#8b949e]">${isSv ? 'Drifttid:' : 'Host Uptime:'}</span>
      <span class="${isOnline ? 'text-[#10b981]' : 'text-[#f85149]'} font-semibold" style="${!isOnline ? 'color: #f85149 !important;' : ''}">${isSv ? uptime.formattedSv : uptime.formattedEn}${!isOnline ? ` <span class="text-[#8b949e] text-[10px]">(${isSv ? 'fryst under offline' : 'frozen while offline'})</span>` : ''}</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-x-2">
      <span class="text-[#8b949e]">${isSv ? 'Nätverk:' : 'Network:'}</span>
      <span class="${isOnline ? 'text-[#38bdf8]' : 'text-[#f85149] font-bold'}" style="${!isOnline ? 'color: #f85149 !important;' : ''}">${isOnline ? (isSv ? 'Ansluten // Aktiv telemetri' : 'Connected // Live telemetry') : (isSv ? '[OFFLINE] Ej ansluten till nätverk' : '[OFFLINE] Disconnected from network')}</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-x-2">
      <span class="text-[#8b949e]">${isSv ? 'Plats:' : 'Location:'}</span>
      <span class="text-[#38bdf8]">${status.location[lang]}</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-x-2">
      <span class="text-[#8b949e]">${isSv ? 'Aktivitet:' : 'Activity:'}</span>
      <span>${status.activity[lang]}</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-x-2">
      <span class="text-[#8b949e]">${isSv ? 'Fokus:' : 'Focus:'}</span>
      <span class="text-[#10b981] font-medium">${status.focus[lang]}</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-x-2">
      <span class="text-[#8b949e]">${isSv ? 'Stämning:' : 'Mood:'}</span>
      <span>${status.mood[lang]}</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-x-2">
      <span class="text-[#8b949e]">${isSv ? 'Homelab:' : 'Homelab:'}</span>
      <span class="text-[#f59e0b]">${status.homelab[lang]}</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-x-2">
      <span class="text-[#8b949e]">${isSv ? 'Tillgänglig:' : 'Available:'}</span>
      <span class="text-[#a78bfa]">${status.availability[lang]}</span>
    </div>
  </div>

  <div class="text-[10px] text-[#8b949e] border-t border-[#30363d]/40 pt-1.5 flex flex-wrap items-center justify-between gap-2">
    <span class="flex items-center gap-1.5">
      <span class="w-1.5 h-1.5 rounded-full ${!isOnline ? 'bg-[#f85149]' : status.activeEvent ? 'bg-[#f59e0b]' : 'bg-[#10b981]'}"></span>
      <span>${isSv ? `Läge: ${status.isAutoScheduled ? 'Auto-kalender aktiv' : 'Manuell profil'}` : `Mode: ${status.isAutoScheduled ? 'Auto-schedule active' : 'Manual profile'}`} (${status.mode})</span>
    </span>
    <span class="text-[#38bdf8]">${isSv ? "Kör 'schedule' för tentaveckor" : "Type 'schedule' for finals calendar"}</span>
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
    const border = isOngoing ? 'border-[#f59e0b] bg-[#f59e0b]/5' : 'border-[#30363d] bg-[#0d1117]';
    const tagColor = ev.statusPreset === 'exam' ? 'text-[#f59e0b]' : ev.statusPreset === 'camp' ? 'text-[#38bdf8]' : 'text-[#10b981]';

    return `
      <div class="p-2.5 rounded border ${border} space-y-1 font-mono text-xs">
        <div class="flex flex-wrap items-center justify-between gap-1">
          <div class="flex items-center gap-2">
            <span class="${tagColor} font-bold">[${ev.badge[lang]}]</span>
            <span class="text-[#e6edf3] font-semibold">${ev.name[lang]}</span>
          </div>
          <span class="text-[11px] text-[#8b949e]">${ev.startDate} → ${ev.endDate}${isOngoing ? ` <span class="text-[#f59e0b] font-bold">(${isSv ? 'PÅGÅR NU' : 'NOW ACTIVE'})</span>` : ''}</span>
        </div>
        <p class="text-[11px] text-[#8b949e]">${ev.description[lang]}</p>
      </div>
    `;
  }).join('');

  return `
<div class="p-3.5 rounded bg-[#0d1117] border border-[#a78bfa]/50 text-xs font-mono space-y-3 max-w-2xl">
  <div class="flex items-center justify-between border-b border-[#30363d] pb-2">
    <div class="flex items-center gap-2">
      <span class="text-sm">📅</span>
      <span class="text-[#a78bfa] font-bold">${isSv ? 'CHALMERS & AKTIVITETSSCHEMA // TENTAVECKOR & LÄGER' : 'CHALMERS & ACTIVITY SCHEDULE // EXAMS & CAMPS'}</span>
    </div>
    <span class="text-[10px] text-[#8b949e]">${isSv ? 'Källa: src/data/schedule.ts' : 'Source: src/data/schedule.ts'}</span>
  </div>

  <div class="space-y-2">
    ${eventsHtml}
  </div>

  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/40 pt-2 flex items-center justify-between">
    <span>💡 ${isSv ? 'Kommandot \'status\' slår om automatiskt under dessa datum.' : '\'status\' automatically reflects these dates.'}</span>
    <span class="text-[#10b981] font-bold">[AUTO-SYNC]</span>
  </div>
</div>`;
}

/**
 * Fastfetch command output: prints the complete ASCII cat badge + specs + palette inline!
 */
export function getFastfetchOutput(lang: LangCode): string {
  const data = lang === 'sv' ? fastfetchSv : fastfetchEn;
  const uptime = calculateUptime();
  const status = getActiveStatus();
  const isOnline = isSiteOnline();

  const specsRows = data.specs.map((item: any) => {
    let key = item.key;
    let val = item.value;
    let color = item.color;
    let isOnlineItem = item.online;

    if (key === 'Uptime' || key === 'Drifttid') {
      val = lang === 'sv' ? uptime.formattedSv : uptime.formattedEn;
    }
    const isStatusRow = (key || '').toLowerCase() === 'status';

    if (isStatusRow) {
      if (!isOnline) {
        val = lang === 'sv' ? '[OFFLINE] Ej ansluten till nätverk' : '[OFFLINE] Disconnected from network';
        isOnlineItem = false;
      } else {
        val = (status.badge[lang] || val).replace(/\[●\s*/g, '[');
        color = status.activeEvent ? 'amber' : 'emerald';
        isOnlineItem = true;
      }
    }

    let keyStyle = '';
    let valStyle = '';

    if (isStatusRow && !isOnline) {
      keyStyle = 'color: #f85149 !important;';
      valStyle = 'color: #f85149 !important;';
    } else if (color === 'emerald') {
      keyStyle = 'color: #10b981;';
    } else if (color === 'amber') {
      keyStyle = 'color: #f59e0b;';
    } else {
      keyStyle = 'color: #38bdf8;';
    }

    const valHtml = isOnlineItem
      ? `<span class="text-[#10b981] font-medium flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping"></span>${val}</span>`
      : (isStatusRow
        ? `<span class="font-medium flex items-center gap-1.5" style="${valStyle}"><span class="w-1.5 h-1.5 rounded-full bg-[#f85149]" style="background-color: #f85149 !important;"></span>${val}</span>`
        : `<span class="text-[#e6edf3]">${val}</span>`);
    return `
      <div class="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] gap-x-2">
        <span class="font-semibold" style="${keyStyle}">${key}:</span>
        ${valHtml}
      </div>`;
  }).join('');

  return `
<div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-3 rounded bg-[#161b22] border border-[#30363d]/80 text-xs font-mono">
  <!-- Fastfetch ASCII Emblem -->
  <div class="shrink-0 select-none text-[11px] sm:text-xs leading-[1.2] p-2.5 rounded bg-[#161b22] border border-[#30363d]/80 flex flex-col justify-center items-center text-center">
    <pre class="leading-tight text-center font-mono">
<span class="text-[#38bdf8]">     /\\_____/\\     </span>
<span class="text-[#38bdf8]">    /</span>  <span class="text-[#e6edf3] font-bold">o</span>   <span class="text-[#e6edf3] font-bold">o</span>  <span class="text-[#38bdf8]">\\    </span>
<span class="text-[#10b981]">   (</span> <span class="text-[#38bdf8]">==</span>  <span class="text-[#10b981] font-bold">^</span>  <span class="text-[#38bdf8]">==</span> <span class="text-[#10b981]">)   </span>
<span class="text-[#10b981]">    )</span>   <span class="text-[#e6edf3] font-bold">GULO</span>  <span class="text-[#10b981]">)    </span>
<span class="text-[#10b981]">   (</span>  <span class="text-[#38bdf8]">[D-24]</span>   <span class="text-[#10b981]">)   </span>
<span class="text-[#10b981]">  (</span> <span class="text-[#38bdf8]">(  )</span>   <span class="text-[#38bdf8]">(  )</span> <span class="text-[#10b981]">)  </span>
<span class="text-[#38bdf8]"> (__(__)___(__)__) </span>
    </pre>
    <div class="mt-1.5 text-[10px] font-bold text-[#10b981] tracking-wider uppercase">${data.badge}</div>
    <div class="text-[9px] text-[#8b949e]">${data.tagline}</div>
  </div>

  <!-- Specs -->
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
    <div class="pt-2 flex items-center gap-1.5">
      <span class="w-3.5 h-2 rounded-xs bg-[#0d1117] border border-[#30363d]"></span>
      <span class="w-3.5 h-2 rounded-xs bg-[#f85149]"></span>
      <span class="w-3.5 h-2 rounded-xs bg-[#10b981]"></span>
      <span class="w-3.5 h-2 rounded-xs bg-[#f59e0b]"></span>
      <span class="w-3.5 h-2 rounded-xs bg-[#38bdf8]"></span>
      <span class="w-3.5 h-2 rounded-xs bg-[#a78bfa]"></span>
      <span class="w-3.5 h-2 rounded-xs bg-[#56d364]"></span>
      <span class="w-3.5 h-2 rounded-xs bg-[#e6edf3]"></span>
    </div>
  </div>
</div>`;
}

/**
 * Bio / About command output: clean executive overview of profile, passions and stack
 */
export function getBioOutput(lang: LangCode): string {
  const isSv = lang === 'sv';
  return isSv
    ? `
<div class="p-3.5 rounded bg-[#0d1117] border border-[#10b981]/50 text-xs font-mono space-y-2.5 max-w-2xl">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#30363d] pb-2 gap-1.5">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
      <span class="text-[#10b981] font-bold text-sm">GULO // BIOGRAFI &amp; ÖVERSIKT</span>
    </div>
    <span class="text-[10px] text-[#38bdf8] bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d]">Chalmers Datateknik D-24</span>
  </div>

  <div class="space-y-2 text-[#e6edf3] leading-relaxed">
    <p>
      Hej! Jag är <span class="text-[#10b981] font-semibold">Gulo</span> — civilingenjörsstudent i Datateknik på Chalmers, tävlingssimmare och entusiast inom operativsystem, systemprogrammering och homelab-arkitektur.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 text-[#8b949e]">
      <div class="p-2 rounded bg-[#161b22] border border-[#30363d]">
        <div class="text-[#38bdf8] font-bold mb-0.5">🎓 Chalmers Studier</div>
        <div>Civilingenjör Datateknik (åk 2). Fokus på minneshantering, C/Rust, datastrukturer och distribuerade nätverk.</div>
      </div>
      <div class="p-2 rounded bg-[#161b22] border border-[#30363d]">
        <div class="text-[#38bdf8] font-bold mb-0.5">🏊‍♂️ Simning &amp; Disciplin</div>
        <div>Tävlingssimmar 5–6 pass i veckan på Valhallabadet. Träningen ger skarp mental uthållighet och struktur.</div>
      </div>
      <div class="p-2 rounded bg-[#161b22] border border-[#30363d]">
        <div class="text-[#38bdf8] font-bold mb-0.5">🖥️ Homelab &amp; Nätverk</div>
        <div>Dedikerat PaperMC-kluster på Debian 12, isolerade Docker-containrar, WireGuard och automatiserade zstd-backuper.</div>
      </div>
      <div class="p-2 rounded bg-[#161b22] border border-[#30363d]">
        <div class="text-[#38bdf8] font-bold mb-0.5">📸 Analogt &amp; Miljö</div>
        <div>Fotograferar 35mm film, bygger Neovim-plugins i Lua och trivs bäst i anpassade terminalmiljöer.</div>
      </div>
    </div>
  </div>

  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/60 pt-2 flex flex-wrap gap-x-3 gap-y-1">
    <span>💡 Relaterat:</span>
    <span class="text-[#10b981] font-semibold">cv / resume</span>
    <span class="text-[#38bdf8] font-semibold">stats / btop</span>
    <span class="text-[#e6edf3]">school</span>
    <span class="text-[#e6edf3]">swim</span>
    <span class="text-[#e6edf3]">contact</span>
  </div>
</div>`
    : `
<div class="p-3.5 rounded bg-[#0d1117] border border-[#10b981]/50 text-xs font-mono space-y-2.5 max-w-2xl">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#30363d] pb-2 gap-1.5">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
      <span class="text-[#10b981] font-bold text-sm">GULO // BIOGRAPHY &amp; PROFILE</span>
    </div>
    <span class="text-[10px] text-[#38bdf8] bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d]">Chalmers CS D-24</span>
  </div>

  <div class="space-y-2 text-[#e6edf3] leading-relaxed">
    <p>
      Hi! I'm <span class="text-[#10b981] font-semibold">Gulo</span> — a Computer Science &amp; Engineering student at Chalmers University of Technology, competitive swimmer, and low-level systems &amp; homelab builder.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 text-[#8b949e]">
      <div class="p-2 rounded bg-[#161b22] border border-[#30363d]">
        <div class="text-[#38bdf8] font-bold mb-0.5">🎓 Chalmers Academics</div>
        <div>M.Sc. Computer Science (Year 2). Focus on memory safety, operating systems, C/Rust, and network concurrency.</div>
      </div>
      <div class="p-2 rounded bg-[#161b22] border border-[#30363d]">
        <div class="text-[#38bdf8] font-bold mb-0.5">🏊‍♂️ Competitive Swimming</div>
        <div>Training 5–6 sessions/week at Valhallabadet. Swimming builds mental discipline and deep resilience.</div>
      </div>
      <div class="p-2 rounded bg-[#161b22] border border-[#30363d]">
        <div class="text-[#38bdf8] font-bold mb-0.5">🖥️ Homelab &amp; Systems</div>
        <div>Dedicated PaperMC cluster on Debian 12, isolated Docker containers, WireGuard mesh, and zstd cron backups.</div>
      </div>
      <div class="p-2 rounded bg-[#161b22] border border-[#30363d]">
        <div class="text-[#38bdf8] font-bold mb-0.5">📸 Analog &amp; Dotfiles</div>
        <div>Shooting 35mm mechanical film, configuring Neovim in Lua, and optimizing sleek Linux workflows.</div>
      </div>
    </div>
  </div>

  <div class="text-[11px] text-[#8b949e] border-t border-[#30363d]/60 pt-2 flex flex-wrap gap-x-3 gap-y-1">
    <span>💡 Related:</span>
    <span class="text-[#10b981] font-semibold">cv / resume</span>
    <span class="text-[#38bdf8] font-semibold">stats / btop</span>
    <span class="text-[#e6edf3]">school</span>
    <span class="text-[#e6edf3]">swim</span>
    <span class="text-[#e6edf3]">contact</span>
  </div>
</div>`;
}

/**
 * CV / Resume / Recruit command output: structured candidate summary
 */
export function getCvOutput(lang: LangCode): string {
  const isSv = lang === 'sv';
  return isSv
    ? `
<div class="p-3.5 rounded bg-[#0d1117] border border-[#38bdf8]/50 text-xs font-mono space-y-3 max-w-2xl">
  <div class="flex items-center justify-between border-b border-[#30363d] pb-2">
    <div>
      <span class="text-[#38bdf8] font-bold text-sm">MERITFÖRTECKNING // CV &amp; KOMPETENSER</span>
      <div class="text-[#8b949e] text-[10px]">Chalmers Datateknik • Civilingenjör</div>
    </div>
    <span class="text-[#10b981] font-bold text-xs">[AKTIV SÖKANDE // RECRUIT]</span>
  </div>

  <div class="space-y-2.5 text-[#e6edf3]">
    <div>
      <div class="text-[#10b981] font-bold text-xs">🎓 Utbildning</div>
      <div class="pl-2 border-l border-[#30363d] text-[11px] text-[#8b949e] space-y-0.5 mt-0.5">
        <div class="text-[#e6edf3] font-semibold">Chalmers tekniska högskola (2024 – 2029)</div>
        <div>Civilingenjör i Datateknik (300 HP), åk 2. Kurser i OS, datastrukturer, maskinnära programmering, diskret matematik.</div>
      </div>
    </div>

    <div>
      <div class="text-[#10b981] font-bold text-xs">🛠️ Tekniska Kärnkompetenser</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 border-l border-[#30363d] text-[11px] text-[#8b949e] mt-0.5">
        <div><span class="text-[#38bdf8]">Programmering:</span> C, Rust, TypeScript, Python, Bash, SQL</div>
        <div><span class="text-[#38bdf8]">Infrastruktur:</span> Linux (Debian, Arch), Docker, WireGuard, Nginx</div>
        <div><span class="text-[#38bdf8]">Webb &amp; Ramverk:</span> Astro, TailwindCSS, Node.js, REST APIs</div>
        <div><span class="text-[#38bdf8]">Verktyg:</span> Git, Neovim, Valgrind, GDB, tmux, systemd</div>
      </div>
    </div>

    <div>
      <div class="text-[#10b981] font-bold text-xs">🚀 Homelab &amp; Utvalda Projekt</div>
      <div class="pl-2 border-l border-[#30363d] text-[11px] text-[#8b949e] space-y-1 mt-0.5">
        <div><span class="text-[#e6edf3] font-semibold">Minecraft Cluster &amp; Homelab:</span> Självhostad PaperMC SMP på Debian med Aikar JVM-flaggor, WireGuard VPN och container-isolering.</div>
        <div><span class="text-[#e6edf3] font-semibold">Systems Scheduler (C):</span> CPU schemaläggningssimulator med round-robin &amp; prioriteringsköer.</div>
      </div>
    </div>

    <div>
      <div class="text-[#10b981] font-bold text-xs">🏊 Idrottsmeriter &amp; Ledarskap</div>
      <div class="pl-2 border-l border-[#30363d] text-[11px] text-[#8b949e] mt-0.5">
        Aktiv tävlingssimmare på elitnivå (5–6 pass/vecka). Erfarenhet av målinriktat lagarbete, disciplin och hantering av höga krav under press.
      </div>
    </div>
  </div>

  <div class="text-[10px] text-[#8b949e] border-t border-[#30363d]/40 pt-1.5 flex items-center justify-between">
    <span>GitHub: github.com/abbguslof</span>
    <span class="text-[#38bdf8]">Skriv 'contact' för direktkontakt</span>
  </div>
</div>`
    : `
<div class="p-3.5 rounded bg-[#0d1117] border border-[#38bdf8]/50 text-xs font-mono space-y-3 max-w-2xl">
  <div class="flex items-center justify-between border-b border-[#30363d] pb-2">
    <div>
      <span class="text-[#38bdf8] font-bold text-sm">RESUME // SKILLS &amp; EXPERIENCE</span>
      <div class="text-[#8b949e] text-[10px]">Chalmers CS • M.Sc. Candidate</div>
    </div>
    <span class="text-[#10b981] font-bold text-xs">[ACTIVE CANDIDATE // RECRUIT]</span>
  </div>

  <div class="space-y-2.5 text-[#e6edf3]">
    <div>
      <div class="text-[#10b981] font-bold text-xs">🎓 Education</div>
      <div class="pl-2 border-l border-[#30363d] text-[11px] text-[#8b949e] space-y-0.5 mt-0.5">
        <div class="text-[#e6edf3] font-semibold">Chalmers University of Technology (2024 – 2029)</div>
        <div>M.Sc. in Computer Science &amp; Engineering (300 ECTS), Year 2. Core focus: OS, memory safety, data structures, low-level architecture.</div>
      </div>
    </div>

    <div>
      <div class="text-[#10b981] font-bold text-xs">🛠️ Technical Competencies</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 border-l border-[#30363d] text-[11px] text-[#8b949e] mt-0.5">
        <div><span class="text-[#38bdf8]">Languages:</span> C, Rust, TypeScript, Python, Bash, SQL</div>
        <div><span class="text-[#38bdf8]">Infrastructure:</span> Linux (Debian, Arch), Docker, WireGuard, Nginx</div>
        <div><span class="text-[#38bdf8]">Web &amp; Frameworks:</span> Astro, TailwindCSS, Node.js, REST APIs</div>
        <div><span class="text-[#38bdf8]">Tooling:</span> Git, Neovim, Valgrind, GDB, tmux, systemd</div>
      </div>
    </div>

    <div>
      <div class="text-[#10b981] font-bold text-xs">🚀 Homelab &amp; Selected Projects</div>
      <div class="pl-2 border-l border-[#30363d] text-[11px] text-[#8b949e] space-y-1 mt-0.5">
        <div><span class="text-[#e6edf3] font-semibold">Minecraft Cluster:</span> Self-hosted PaperMC SMP on Debian 12 with tuned Aikar flags, WireGuard VPN and container sandbox.</div>
        <div><span class="text-[#e6edf3] font-semibold">Systems Scheduler (C):</span> Multi-algorithm CPU scheduler simulator implementing round-robin &amp; priority queues.</div>
      </div>
    </div>

    <div>
      <div class="text-[#10b981] font-bold text-xs">🏊 Athletics &amp; Work Ethic</div>
      <div class="pl-2 border-l border-[#30363d] text-[11px] text-[#8b949e] mt-0.5">
        Competitive swimmer training 5–6 sessions/week. Proven track record of rigorous time management, self-motivation, and focus.
      </div>
    </div>
  </div>

  <div class="text-[10px] text-[#8b949e] border-t border-[#30363d]/40 pt-1.5 flex items-center justify-between">
    <span>GitHub: github.com/abbguslof</span>
    <span class="text-[#38bdf8]">Type 'contact' for direct inquiries</span>
  </div>
</div>`;
}

/**
 * Stats / btop / htop monitor output: visual process and life-stats dashboard
 */
export function getStatsMonitorOutput(lang: LangCode): string {
  const isSv = lang === 'sv';
  return `
<div class="p-3 rounded bg-[#0d1117] border border-[#a78bfa]/50 text-xs font-mono space-y-2 max-w-xl select-none">
  <!-- Header / Titlebar -->
  <div class="flex items-center justify-between border-b border-[#30363d] pb-1.5 text-[11px]">
    <div class="flex items-center gap-2">
      <span class="px-1.5 py-0.5 rounded bg-[#a78bfa] text-[#0d1117] font-bold text-[10px]">BTOP++</span>
      <span class="text-[#e6edf3] font-semibold">gulo-station :: sysmon &amp; athletic stats</span>
    </div>
    <span class="text-[#10b981] text-[10px] font-bold">RATE: 1.0s</span>
  </div>

  <!-- Resource Bars -->
  <div class="space-y-1.5 text-[11px]">
    <!-- CPU -->
    <div>
      <div class="flex justify-between text-[#8b949e] mb-0.5">
        <span class="text-[#38bdf8] font-bold">CPU [Ryzen 7 7800X3D]</span>
        <span class="text-[#10b981]">18% (4.85 GHz)</span>
      </div>
      <div class="h-2 w-full bg-[#161b22] rounded overflow-hidden flex border border-[#30363d]">
        <div class="bg-[#10b981] h-full" style="width: 18%"></div>
      </div>
    </div>

    <!-- MEM -->
    <div>
      <div class="flex justify-between text-[#8b949e] mb-0.5">
        <span class="text-[#38bdf8] font-bold">MEM [32 GiB DDR5-6000]</span>
        <span class="text-[#f59e0b]">6.4 GiB / 32 GiB (20%)</span>
      </div>
      <div class="h-2 w-full bg-[#161b22] rounded overflow-hidden flex border border-[#30363d]">
        <div class="bg-[#f59e0b] h-full" style="width: 20%"></div>
      </div>
    </div>

    <!-- Chalmers Progress -->
    <div>
      <div class="flex justify-between text-[#8b949e] mb-0.5">
        <span class="text-[#a78bfa] font-bold">${isSv ? 'CHALMERS HP (Civilingenjör)' : 'CHALMERS ECTS (M.Sc. CS)'}</span>
        <span class="text-[#a78bfa]">75 / 300 HP (25%)</span>
      </div>
      <div class="h-2 w-full bg-[#161b22] rounded overflow-hidden flex border border-[#30363d]">
        <div class="bg-[#a78bfa] h-full" style="width: 25%"></div>
      </div>
    </div>

    <!-- Swim Weekly Volume -->
    <div>
      <div class="flex justify-between text-[#8b949e] mb-0.5">
        <span class="text-[#38bdf8] font-bold">${isSv ? 'SIMNING VOLYM (Valhallabadet 50m)' : 'SWIMMING VOLUME (Valhallabadet 50m)'}</span>
        <span class="text-[#38bdf8]">22.5 km / 25 km mål (90%)</span>
      </div>
      <div class="h-2 w-full bg-[#161b22] rounded overflow-hidden flex border border-[#30363d]">
        <div class="bg-[#38bdf8] h-full" style="width: 90%"></div>
      </div>
    </div>
  </div>

  <!-- Active Processes / Services -->
  <div class="pt-1 border-t border-[#30363d]/60 text-[10px] text-[#8b949e] space-y-0.5">
    <div class="flex justify-between">
      <span>SERVICE: papermc.service (PID 1420)</span>
      <span class="text-[#10b981]">ACTIVE [0.4% CPU, 4.2G RAM]</span>
    </div>
    <div class="flex justify-between">
      <span>SERVICE: wg-quick@wg0.service</span>
      <span class="text-[#10b981]">CONNECTED [mesh wireguard]</span>
    </div>
    <div class="flex justify-between">
      <span>SERVICE: docker.service (containers: 4)</span>
      <span class="text-[#10b981]">RUNNING</span>
    </div>
  </div>
</div>`;
}
