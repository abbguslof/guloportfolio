// src/scripts/terminal/commands.ts - Modular Command Dispatcher & Engine
import type { CommandContext, FileNode, DirNode } from './types';
import {
  getStandardHelpHtml,
  getExtendedHelpHtml,
  getGreetingResponse,
  getSecretOutput,
  getOsOpinionOutput,
  getStatusOutput,
  getScheduleOutput,
  getFastfetchOutput,
  getBioOutput,
  getCvOutput,
  getStatsMonitorOutput
} from './i18n';
import { handleGitCommand } from './git';
import { evaluateMathExpression } from './calc';
import { handleGameCommand } from './game';
import { handleNvimCommand } from './nvim';
import { calculateUptime, isSiteOnline } from '../../data/telemetry';
import { setSiteLang } from '../i18n-client';
import { sendTerminalMessage, setPendingMessage } from './messaging';

export type CommandFunction = (args: string[], ctx: CommandContext) => string | void;

export function getCommands(): Record<string, CommandFunction> {
  const handleGreeting = (greetingWord: string, args: string[], ctx: CommandContext): string => {
    const isSv = ctx.lang === 'sv';
    if (args && args.length > 0) {
      let extra = args.join(' ').trim();
      if (extra.startsWith('-') || extra.startsWith(':')) {
        extra = extra.replace(/^[-:\s]+/, '').trim();
      }
      if (extra.length >= 2) {
        setPendingMessage(extra);
        return `
<div class="msg-pending-prompt-card text-xs font-mono space-y-2 p-2.5 sm:p-3 rounded-lg bg-[#0d1117] border border-[#10b981]/50 my-1 shadow-md">
  <div class="text-[#10b981] font-bold flex items-center gap-2">
    <span>💡</span>
    <span>${isSv ? 'HÄLSNING / MEDDELANDE UPPTÄCKT' : 'GREETING / MESSAGE DETECTED'}</span>
  </div>
  <p class="text-[#e6edf3] text-xs leading-relaxed">
    ${isSv ? 'Det ser ut som en hälsning till Gustav! Vill du skicka detta till hans inkorg?' : "Looks like a note to Gustav! Would you like to send this to his inbox?"}
  </p>
  <div class="text-[#38bdf8] bg-[#161b22] p-2 rounded border border-[#30363d] italic break-words text-xs">
    "${ctx.escapeHtml(extra)}"
  </div>
  <div class="text-[#8b949e] pt-1 flex items-center gap-x-2 gap-y-1.5 flex-wrap text-[11px] sm:text-xs leading-relaxed">
    <span class="inline-flex items-center flex-wrap gap-1">
      <span>${isSv ? 'Tryck' : 'Type'}</span>
      <button type="button" class="btn-send-pending-msg text-[#10b981] hover:text-[#e6edf3] active:opacity-60 hover:underline font-bold cursor-pointer transition-all px-1.5 py-0.5 -my-0.5 rounded hover:bg-[#10b981]/15 active:scale-95 font-mono inline-flex items-center select-none touch-manipulation" title="${isSv ? 'Klicka för att skicka' : 'Click to send'}">${isSv ? '[j]' : '[y]'}</button>
      <span>${isSv ? 'för att skicka' : 'to send'}</span>
    </span>
    <span class="text-[#484f58] select-none">•</span>
    <span class="inline-flex items-center flex-wrap gap-1">
      <button type="button" class="btn-cancel-pending-msg text-[#f85149] hover:text-[#e6edf3] active:opacity-60 hover:underline font-bold cursor-pointer transition-all px-1.5 py-0.5 -my-0.5 rounded hover:bg-[#f85149]/15 active:scale-95 font-mono inline-flex items-center select-none touch-manipulation" title="${isSv ? 'Klicka för att avbryta' : 'Click to cancel'}">[n]</button>
      <span>${isSv ? 'för att avbryta' : 'to cancel'}</span>
    </span>
  </div>
</div>`;
      }
    }
    return getGreetingResponse(greetingWord, ctx.lang);
  };

  const commands: Record<string, CommandFunction> = {
    // 1. HELP & DISCOVERY
    help: (args, ctx) => {
      const isExtended = args.some(a =>
        a === '--extended' || a === '-e' || a === '--all' || a === '-a' || a === 'max' || a === 'all' || a === 'full'
      );
      if (isExtended) {
        return getExtendedHelpHtml(ctx.lang);
      }
      return getStandardHelpHtml(ctx.lang);
    },

    // 1b. STATUS & LIVE SYSOPS
    status: (_args, ctx) => getStatusOutput(ctx.lang),
    schedule: (_args, ctx) => getScheduleOutput(ctx.lang),
    tentor: (_args, ctx) => getScheduleOutput(ctx.lang),
    tentavecka: (_args, ctx) => getScheduleOutput(ctx.lang),
    exams: (_args, ctx) => getScheduleOutput(ctx.lang),
    finals: (_args, ctx) => getScheduleOutput(ctx.lang),

    // 1c. BIO & EXECUTIVE PROFILE
    bio: (args, ctx) => {
      const sub = (args[0] || '').toLowerCase().trim();
      if (sub === 'cv' || sub === 'resume' || sub === 'recruit') {
        return getCvOutput(ctx.lang);
      }
      if (sub === 'stats' || sub === 'btop' || sub === 'htop' || sub === 'top') {
        return getStatsMonitorOutput(ctx.lang);
      }
      return getBioOutput(ctx.lang);
    },

    intro: (_args, ctx) => {
      const isSv = ctx.lang === 'sv';
      return `<div class="space-y-2 py-1 font-mono">
  <div class="text-[#10b981] font-bold text-sm sm:text-base">&gt; ${isSv ? 'HEJ, JAG ÄR GUSTAV' : "HI, I'M GUSTAV"}</div>
  <pre class="text-[#10b981] text-[9px] sm:text-[10px] leading-tight font-mono hidden sm:block select-none opacity-90">
 ██████╗ ██╗   ██╗███████╗████████╗ █████╗ ██╗   ██╗
██╔════╝ ██║   ██║██╔════╝╚══██╔══╝██╔══██╗██║   ██║
██║  ███╗██║   ██║███████╗   ██║   ███████║██║   ██║
██║   ██║██║   ██║╚════██║   ██║   ██╔══██║╚██╗ ██╔╝
╚██████╔╝╚██████╔╝███████║   ██║   ██║  ██║ ╚████╔╝ 
  </pre>
  <div class="text-[#e6edf3] font-semibold text-xs sm:text-sm">Gustav Löfqvist // <span class="text-[#38bdf8]">gulo</span></div>
  <div class="text-[#8b949e] text-xs">${isSv ? 'Civilingenjör Datateknik @ Chalmers Tekniska Högskola (Åk 2, EDIT-huset, RIU-elitidrottare).' : 'Second-year M.Sc. Computer Science &amp; Engineering @ Chalmers (EDIT building, accepted RIU elite athlete).'}</div>
  <div class="text-[#8b949e] text-xs">${isSv ? 'Elitsprintsimmare för MASS &amp; Growth Objective (Åbybadet/GoCo). SM-silver 4x50m frisim.' : 'Elite sprint swimmer for MASS &amp; Growth Objective (Åbybadet/GoCo). SM Silver 4x50m freestyle.'}</div>
  <div class="text-[#8b949e] text-xs">${isSv ? 'Tech: Python, C, Java, JavaScript, Omarchy (Arch + Hyprland) &amp; Proxmox VE homelab.' : 'Tech: Python, C, Java, JavaScript, Omarchy (Arch + Hyprland) &amp; Proxmox VE homelab.'}</div>
  <div class="text-[11px] text-[#38bdf8] pt-1 border-t border-[#30363d]/40">${isSv ? 'Kommandon: bio, cv, school, swim, contact, status' : 'Commands: bio, cv, school, swim, contact, status'}</div>
</div>`;
    },
    boot: (args, ctx) => commands.intro(args, ctx),
    gustav: (args, ctx) => commands.intro(args, ctx),

    // 1d. CV & RESUME
    cv: (_args, ctx) => getCvOutput(ctx.lang),

    // 1e. STATS & BTOP
    stats: (_args, ctx) => getStatsMonitorOutput(ctx.lang),

    // 1f. LANGUAGE SWITCHER
    lang: (args, ctx) => {
      const target = (args[0] || '').toLowerCase().trim();
      const current = ctx.lang;

      const swedishAliases = ['sv', 'se', 'swe', 'swedish', 'svenska'];
      const englishAliases = ['en', 'eng', 'english', 'engelska'];

      if (swedishAliases.includes(target)) {
        if (current === 'sv') {
          return '<div class="text-[#8b949e] font-mono text-xs">Webbplatsen är redan inställd på <span class="text-[#10b981] font-bold">svenska (SV)</span>.</div>';
        }
        setSiteLang('sv');
        return '<div class="text-[#10b981] font-mono text-xs">Språk ändrat till <span class="font-bold">svenska (SV)</span>. Hela cockpiten & webbplatsen är uppdaterad.</div>';
      }

      if (englishAliases.includes(target)) {
        if (current === 'en') {
          return '<div class="text-[#8b949e] font-mono text-xs">Site language is already set to <span class="text-[#10b981] font-bold">English (EN)</span>.</div>';
        }
        setSiteLang('en');
        return '<div class="text-[#10b981] font-mono text-xs">Language switched to <span class="font-bold">English (EN)</span>. Entire cockpit & site updated.</div>';
      }

      if (target) {
        return current === 'sv'
          ? `<div class="text-[#f85149] font-mono text-xs">Okänt språk: '${ctx.escapeHtml(target)}'. Välj <code class="text-[#38bdf8]">lang en</code> eller <code class="text-[#38bdf8]">lang se</code> (eller alias: sv, swe, eng, english, swedish).</div>`
          : `<div class="text-[#f85149] font-mono text-xs">Unknown language: '${ctx.escapeHtml(target)}'. Choose <code class="text-[#38bdf8]">lang en</code> or <code class="text-[#38bdf8]">lang se</code> (or aliases: sv, swe, eng, english, swedish).</div>`;
      }

      // No argument provided -> describe current language and how to change
      return current === 'sv'
        ? `<div class="text-xs font-mono space-y-1 p-2 rounded bg-[#0d1117] border border-[#30363d]/80">
            <div>Aktuellt språk: <span class="text-[#10b981] font-bold">Svenska (SV)</span></div>
            <div class="text-[#8b949e]">Byt språk med: <code class="text-[#38bdf8]">lang en</code> eller <code class="text-[#38bdf8]">lang se</code></div>
            <div class="text-[#8b949e] text-[11px] pt-1 border-t border-[#30363d]/40">
              Tillgängliga alias för engelska: <code class="text-[#10b981]">en</code>, <code class="text-[#10b981]">eng</code>, <code class="text-[#10b981]">english</code>, <code class="text-[#10b981]">engelska</code><br/>
              Tillgängliga alias för svenska: <code class="text-[#10b981]">sv</code>, <code class="text-[#10b981]">se</code>, <code class="text-[#10b981]">swe</code>, <code class="text-[#10b981]">swedish</code>, <code class="text-[#10b981]">svenska</code>
            </div>
           </div>`
        : `<div class="text-xs font-mono space-y-1 p-2 rounded bg-[#0d1117] border border-[#30363d]/80">
            <div>Current language: <span class="text-[#10b981] font-bold">English (EN)</span></div>
            <div class="text-[#8b949e]">Switch language with: <code class="text-[#38bdf8]">lang se</code> or <code class="text-[#38bdf8]">lang en</code></div>
            <div class="text-[#8b949e] text-[11px] pt-1 border-t border-[#30363d]/40">
              English aliases: <code class="text-[#10b981]">en</code>, <code class="text-[#10b981]">eng</code>, <code class="text-[#10b981]">english</code>, <code class="text-[#10b981]">engelska</code><br/>
              Swedish aliases: <code class="text-[#10b981]">sv</code>, <code class="text-[#10b981]">se</code>, <code class="text-[#10b981]">swe</code>, <code class="text-[#10b981]">swedish</code>, <code class="text-[#10b981]">svenska</code>
            </div>
           </div>`;
    },
    language: (args, ctx) => commands.lang(args, ctx),
    sprak: (args, ctx) => commands.lang(args, ctx),
    språk: (args, ctx) => commands.lang(args, ctx),
    se: (_args, ctx) => commands.lang(['se'], ctx),
    sv: (_args, ctx) => commands.lang(['sv'], ctx),
    swe: (_args, ctx) => commands.lang(['swe'], ctx),
    swedish: (_args, ctx) => commands.lang(['swedish'], ctx),
    svenska: (_args, ctx) => commands.lang(['svenska'], ctx),
    en: (_args, ctx) => commands.lang(['en'], ctx),
    eng: (_args, ctx) => commands.lang(['eng'], ctx),
    english: (_args, ctx) => commands.lang(['english'], ctx),
    engelska: (_args, ctx) => commands.lang(['engelska'], ctx),

    // 2. INFORMATION CARDS & BASH ALIASES
    school: (_args, ctx) => {
      const fileNode = ctx.fileSystem.children['school.md'];
      if (fileNode && fileNode.type === 'file' && fileNode.content) {
        return ctx.renderMarkdownCard(fileNode.content);
      }
      return `<div class="text-[#8b949e] font-mono">Chalmers University of Technology — Computer Science & Engineering (D-24)</div>`;
    },
    chalmers: (args, ctx) => commands.school(args, ctx),
    study: (args, ctx) => commands.school(args, ctx),
    education: (args, ctx) => commands.school(args, ctx),
    studies: (args, ctx) => commands.school(args, ctx),
    skola: (args, ctx) => commands.school(args, ctx),
    studier: (args, ctx) => commands.school(args, ctx),
    utbildning: (args, ctx) => commands.school(args, ctx),

    swim: (_args, ctx) => {
      const fileNode = ctx.fileSystem.children['swim.md'];
      if (fileNode && fileNode.type === 'file' && fileNode.content) {
        return ctx.renderMarkdownCard(fileNode.content);
      }
      return `<div class="text-[#38bdf8] font-mono">Åbybadet &amp; GoCo — MASS &amp; Growth Objective (5+ swim sessions/week)</div>`;
    },
    simma: (args, ctx) => commands.swim(args, ctx),
    simning: (args, ctx) => commands.swim(args, ctx),
    swimming: (args, ctx) => commands.swim(args, ctx),

    whoami: (_args, ctx) => {
      const fileNode = ctx.fileSystem.children['whoami.md'];
      if (fileNode && fileNode.type === 'file' && fileNode.content) {
        return ctx.renderMarkdownCard(fileNode.content);
      }
      return `<div class="text-[#10b981] font-mono">gulo // Chalmers student, sprint swimmer &amp; developer</div>`;
    },
    me: (args, ctx) => commands.whoami(args, ctx),
    gulo: (args, ctx) => commands.whoami(args, ctx),

    contact: (_args, ctx) => {
      const fileNode = ctx.fileSystem.children['contact.md'];
      if (fileNode && fileNode.type === 'file' && fileNode.content) {
        return ctx.renderMarkdownCard(fileNode.content);
      }
      return `<div class="text-[#10b981] font-mono">GitHub: github.com/abbguslof | Email: gurra@gulo.se</div>`;
    },
    kontakt: (args, ctx) => commands.contact(args, ctx),
    email: (args, ctx) => commands.contact(args, ctx),
    epost: (args, ctx) => commands.contact(args, ctx),

    // .bashrc and homelab command aliases
    proxmox: (_args, ctx) => {
      return ctx.lang === 'sv'
        ? `<div class="text-[#10b981] font-mono">Proxmox VE-kluster: Alla noder mår prima och är online. [Server PC, Raspberry Pi-kluster, Docker, WireGuard]</div>`
        : `<div class="text-[#10b981] font-mono">Proxmox VE cluster: All nodes healthy and operational. [Server PC, Raspberry Pi cluster, Docker, WireGuard]</div>`;
    },
    mc: (_args, ctx) => {
      return ctx.lang === 'sv'
        ? `<div class="text-[#10b981] font-mono">PaperMC / Velocity-kluster kör med stabila 20.0 TPS. [SMP &amp; proxy aktiva]</div>`
        : `<div class="text-[#10b981] font-mono">PaperMC / Velocity cluster running smooth at 20.0 TPS. [SMP &amp; proxy active]</div>`;
    },
    minecraft: (args, ctx) => commands.mc(args, ctx),
    sleep: (_args, ctx) => {
      return ctx.lang === 'sv'
        ? `<div class="text-[#f59e0b] font-mono">Error: 404 Sleep Not Found under tentavecka 😴</div>`
        : `<div class="text-[#f59e0b] font-mono">Error: 404 Sleep Not Found during exam week 😴</div>`;
    },
    sova: (args, ctx) => commands.sleep(args, ctx),

    // 3. GIT SIMULATION
    git: (args, ctx) => {
      return handleGitCommand(args, ctx.lang);
    },

    // 4. CALCULATOR
    calc: (args, ctx) => {
      const expr = args.join(' ');
      return evaluateMathExpression(expr, ctx.lang);
    },

    // 5. INTERACTIVE MINIGAME
    guess: (args, ctx) => {
      return handleGameCommand(args, ctx.lang);
    },

    // 6. EXECUTABLE SCRIPT
    './helloworld.sh': (_args, ctx) => executeHelloWorldScript(ctx),
    './helloworld': (_args, ctx) => executeHelloWorldScript(ctx),
    'helloworld.sh': (_args, ctx) => executeHelloWorldScript(ctx),
    bash: (args, ctx) => {
      if (args[0] === 'helloworld.sh' || args[0] === './helloworld.sh') {
        return executeHelloWorldScript(ctx);
      }
      return ctx.lang === 'sv'
        ? `<div class="text-[#8b949e] font-mono">bash: du är redan i en interaktiv bash-session. Kör t.ex. <code class="text-[#10b981]">./helloworld.sh</code></div>`
        : `<div class="text-[#8b949e] font-mono">bash: already inside an interactive bash session. Try running <code class="text-[#10b981]">./helloworld.sh</code></div>`;
    },
    sh: (args, ctx) => {
      if (args[0] === 'helloworld.sh' || args[0] === './helloworld.sh') {
        return executeHelloWorldScript(ctx);
      }
      return commands.bash(args, ctx);
    },

    // 6.5. VISITOR MESSAGING & GUESTBOOK
    msg: (args, ctx) => {
      const isSv = ctx.lang === 'sv';
      if (!args || args.length === 0) {
        return `<div class="text-[#8b949e] font-mono text-xs">
          ${isSv 
            ? 'Användning: <code class="text-[#10b981]">msg &lt;ditt meddelande&gt;</code> (skickar en direkt hälsning till Gustav)' 
            : 'Usage: <code class="text-[#10b981]">msg &lt;your message&gt;</code> (sends a direct note to Gustav)'}
        </div>`;
      }

      const messageText = args.join(' ').trim();
      const msgId = 'msg-send-' + Math.random().toString(36).slice(2, 9);

      setTimeout(async () => {
        const res = await sendTerminalMessage(messageText, ctx.lang as any);
        const container = document.getElementById(msgId);
        if (container) {
          container.innerHTML = res.feedback;
        }
      }, 50);

      return `<div id="${msgId}" class="text-xs font-mono text-[#38bdf8] flex items-center gap-2 py-0.5">
        <span class="inline-block animate-spin text-[#10b981]">⠋</span>
        <span>${isSv ? 'Sparar meddelande till Gustavs inkorg...' : 'Saving message to Gustav\'s inbox...'}</span>
      </div>`;
    },
    message: (args, ctx) => commands.msg(args, ctx),
    say: (args, ctx) => commands.msg(args, ctx),
    feedback: (args, ctx) => commands.msg(args, ctx),

    // 7. GREETINGS & DAD-PROOF CONVERSATION
    hello: (args, ctx) => handleGreeting('hello', args, ctx),
    hi: (args, ctx) => handleGreeting('hi', args, ctx),
    hey: (args, ctx) => handleGreeting('hey', args, ctx),
    hej: (args, ctx) => handleGreeting('hej', args, ctx),
    hejsan: (args, ctx) => handleGreeting('hejsan', args, ctx),
    halloj: (args, ctx) => handleGreeting('halloj', args, ctx),
    tjena: (args, ctx) => handleGreeting('tjena', args, ctx),
    yo: (args, ctx) => handleGreeting('yo', args, ctx),
    hallå: (args, ctx) => handleGreeting('hallå', args, ctx),
    sup: (args, ctx) => handleGreeting('sup', args, ctx),

    // 8. NAVIGATION SHORTCUTS & ALIASES
    projects: (_args, ctx) => {
      ctx.navigateWithCli('/projects', `<div class="text-[#a78bfa]">${ctx.lang === 'sv' ? 'Öppnar /projects (Portfolio)...' : 'Opening /projects (Portfolio)...'}</div>`);
    },
    project: (args, ctx) => commands.projects(args, ctx),
    portfolio: (args, ctx) => commands.projects(args, ctx),

    thoughts: (_args, ctx) => {
      ctx.navigateWithCli('/thoughts', `<div class="text-[#f59e0b]">${ctx.lang === 'sv' ? 'Öppnar /thoughts (Blogg & Anteckningar)...' : 'Opening /thoughts (Blog & Notes)...'}</div>`);
    },
    thought: (args, ctx) => commands.thoughts(args, ctx),
    blog: (args, ctx) => commands.thoughts(args, ctx),
    blogg: (args, ctx) => commands.thoughts(args, ctx),
    tankar: (args, ctx) => commands.thoughts(args, ctx),
    note: (args, ctx) => commands.thoughts(args, ctx),
    notes: (args, ctx) => commands.thoughts(args, ctx),
    anteckning: (args, ctx) => commands.thoughts(args, ctx),
    anteckningar: (args, ctx) => commands.thoughts(args, ctx),
    guide: (args, ctx) => commands.thoughts(args, ctx),
    guides: (args, ctx) => commands.thoughts(args, ctx),
    guider: (args, ctx) => commands.thoughts(args, ctx),

    files: (_args, ctx) => {
      ctx.navigateWithCli('/files', `<div class="text-[#10b981]">${ctx.lang === 'sv' ? 'Öppnar /files...' : 'Opening /files...'}</div>`);
    },
    file: (args, ctx) => commands.files(args, ctx),
    filer: (args, ctx) => commands.files(args, ctx),

    // 9. FILESYSTEM OPERATIONS
    ls: (args, ctx) => {
      let targetDir = ctx.getCurrentDir();
      const flags = args.filter(a => a.startsWith('-'));
      const nonFlags = args.filter(a => !a.startsWith('-'));

      const showAll = flags.some(f => f.includes('a'));
      const isLong = flags.some(f => f.includes('l'));

      if (nonFlags[0]) {
        const target = nonFlags[0].replace(/\/$/, '');
        const node = target === '~' ? ctx.fileSystem : targetDir.children[target];
        if (!node) {
          const err = ctx.lang === 'sv'
            ? `kan inte komma åt '${ctx.escapeHtml(nonFlags[0])}': Ingen sådan fil eller katalog`
            : `cannot access '${ctx.escapeHtml(nonFlags[0])}': No such file or directory`;
          return `<div class="text-[#f85149]">ls: ${err}</div>`;
        }
        if (node.type === 'file') {
          return `<div class="text-[#e6edf3]">${ctx.escapeHtml(target)} (${node.size})</div>`;
        }
        targetDir = node as DirNode;
      }

      let entries = Object.entries(targetDir.children);
      if (!showAll) {
        entries = entries.filter(([name]) => !name.startsWith('.'));
      }

      if (entries.length === 0) {
        return `<div class="text-[#8b949e]">${ctx.lang === 'sv' ? 'Katalogen är tom.' : 'Directory is empty.'}</div>`;
      }

      if (isLong) {
        let rows = '';
        if (showAll) {
          rows += `
            <div class="grid grid-cols-[100px_70px_1fr] gap-2">
              <span class="text-[#8b949e]">drwxr-xr-x</span>
              <span class="text-[#8b949e] text-right">4.0 KB</span>
              <span class="text-[#38bdf8] font-bold">.</span>
            </div>
            <div class="grid grid-cols-[100px_70px_1fr] gap-2">
              <span class="text-[#8b949e]">drwxr-xr-x</span>
              <span class="text-[#8b949e] text-right">4.0 KB</span>
              <span class="text-[#38bdf8] font-bold">..</span>
            </div>
          `;
        }
        rows += entries.map(([name, node]) => {
          const isDir = node.type === 'dir';
          const isExec = !isDir && name.endsWith('.sh');
          const perm = isDir ? 'drwxr-xr-x' : (isExec ? '-rwxr-xr-x' : (name.startsWith('.') ? '-rw-------' : '-rw-r--r--'));
          const size = isDir ? '4.0 KB' : node.size;
          const color = isDir ? 'text-[#38bdf8] font-bold' : (isExec ? 'text-[#10b981] font-bold' : (name.startsWith('.') ? 'text-[#a78bfa]' : 'text-[#e6edf3]'));
          return `<div class="grid grid-cols-[100px_70px_1fr] gap-2">
            <span class="text-[#8b949e]">${perm}</span>
            <span class="text-[#8b949e] text-right">${size}</span>
            <span class="${color}">${ctx.escapeHtml(name)}${isDir ? '/' : (isExec ? '*' : '')}</span>
          </div>`;
        }).join('');
        return `<div class="font-mono text-xs space-y-1">${rows}</div>`;
      }

      let prefix = '';
      if (showAll) {
        prefix = `<span class="text-[#38bdf8] font-bold">.</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-[#38bdf8] font-bold">..</span>&nbsp;&nbsp;&nbsp;&nbsp;`;
      }

      const pills = entries.map(([name, node]) => {
        if (node.type === 'dir') {
          return `<span class="text-[#38bdf8] font-bold">${ctx.escapeHtml(name)}/</span>`;
        }
        if (name.endsWith('.sh')) {
          return `<span class="text-[#10b981] font-bold">${ctx.escapeHtml(name)}*</span>`;
        }
        if (name.startsWith('.')) {
          return `<span class="text-[#a78bfa]">${ctx.escapeHtml(name)}</span>`;
        }
        return `<span class="text-[#e6edf3]">${ctx.escapeHtml(name)}</span>`;
      }).join('&nbsp;&nbsp;&nbsp;&nbsp;');

      return `<div class="flex flex-wrap gap-x-6 gap-y-1 text-xs sm:text-sm font-mono">${prefix}${pills}</div>`;
    },

    cd: (args, ctx) => {
      const dest = args[0] ? args[0].trim() : '~';
      if (dest === '~' || dest === '') {
        ctx.setCurrentPath([]);
        return;
      }
      if (dest === '.') return;

      const targetSegments = ctx.resolvePath(ctx.currentPath, dest);
      const node = ctx.resolveNode(targetSegments);

      if (node) {
        if (node.type === 'dir') {
          ctx.setCurrentPath(targetSegments);
        } else {
          return `<div class="text-[#f85149]">cd: '${ctx.escapeHtml(dest)}': ${ctx.lang === 'sv' ? 'Inte en katalog' : 'Not a directory'}</div>`;
        }
      } else {
        return `<div class="text-[#f85149]">cd: '${ctx.escapeHtml(dest)}': ${ctx.lang === 'sv' ? 'Ingen sådan fil eller katalog' : 'No such file or directory'}</div>`;
      }
    },

    pwd: (_args, ctx) => `<div class="text-[#8b949e]">/home/gulo${ctx.currentPath.length > 0 ? '/' + ctx.currentPath.join('/') : ''}</div>`,

    cat: (args, ctx) => {
      if (!args[0]) {
        return `<div class="text-[#f85149]">${ctx.lang === 'sv' ? 'Användning' : 'Usage'}: cat &lt;${ctx.lang === 'sv' ? 'filnamn' : 'filename'}&gt;</div>`;
      }
      const filename = args[0].trim();
      const targetSegments = ctx.resolvePath(ctx.currentPath, filename);
      let node = ctx.resolveNode(targetSegments);

      if (!node && ctx.currentPath.length > 0 && ctx.fileSystem.children[filename]) {
        node = ctx.fileSystem.children[filename];
      }

      if (!node) {
        return `<div class="text-[#f85149]">cat: ${ctx.escapeHtml(filename)}: ${ctx.lang === 'sv' ? 'Ingen sådan fil' : 'No such file'}</div>`;
      }
      if (node.type === 'dir') {
        return `<div class="text-[#f85149]">cat: ${ctx.escapeHtml(filename)}: ${ctx.lang === 'sv' ? 'Är en katalog' : 'Is a directory'}</div>`;
      }

      return `
<div class="p-3 rounded bg-[#0d1117] border border-[#30363d] text-xs text-[#e6edf3] whitespace-pre-wrap leading-relaxed font-mono">
${ctx.escapeHtml(node.content)}
</div>`;
    },

    // 8a-2. GREP PATTERN MATCHER
    grep: (args, ctx) => {
      const isSv = ctx.lang === 'sv';
      if (!args[0]) {
        return isSv
          ? `<div class="text-[#f59e0b] text-xs font-mono space-y-1">
              <div>Användning: <code class="text-[#10b981]">grep [-inrl] &lt;mönster&gt; [fil|katalog]</code></div>
              <div class="text-[#8b949e]">Exempel: <code class="text-[#38bdf8]">grep rust</code>, <code class="text-[#38bdf8]">grep -i docker whoami.md</code>, <code class="text-[#38bdf8]">grep -r valgrind thoughts/</code></div>
             </div>`
          : `<div class="text-[#f59e0b] text-xs font-mono space-y-1">
              <div>Usage: <code class="text-[#10b981]">grep [-inrl] &lt;pattern&gt; [file|dir]</code></div>
              <div class="text-[#8b949e]">Examples: <code class="text-[#38bdf8]">grep rust</code>, <code class="text-[#38bdf8]">grep -i docker whoami.md</code>, <code class="text-[#38bdf8]">grep -r valgrind thoughts/</code></div>
             </div>`;
      }

      // Parse flags and positional arguments
      const flags = new Set<string>();
      const positionals: string[] = [];

      for (const arg of args) {
        if (arg.startsWith('-') && arg.length > 1 && !arg.startsWith('--')) {
          for (const char of arg.slice(1)) {
            flags.add(char);
          }
        } else if (arg.startsWith('--')) {
          flags.add(arg.slice(2));
        } else {
          positionals.push(arg);
        }
      }

      if (positionals.length === 0) {
        return `<div class="text-[#f85149] text-xs font-mono">${isSv ? 'grep: inget sökmönster angivet.' : 'grep: no search pattern specified.'}</div>`;
      }

      const patternStr = positionals[0];
      const targetArg = positionals[1]; // optional file/dir

      const ignoreCase = flags.has('i') || flags.has('ignore-case') || true;
      const showLineNumbers = flags.has('n') || flags.has('line-number') || true;
      const filesOnly = flags.has('l') || flags.has('files-with-matches');
      const countOnly = flags.has('c') || flags.has('count');
      const invertMatch = flags.has('v') || flags.has('invert-match');

      function collectFiles(dirNode: DirNode, currentPrefix: string): { path: string; node: FileNode }[] {
        const results: { path: string; node: FileNode }[] = [];
        for (const [name, child] of Object.entries(dirNode.children)) {
          const itemPath = currentPrefix ? `${currentPrefix}/${name}` : name;
          if (child.type === 'file') {
            results.push({ path: itemPath, node: child as FileNode });
          } else if (child.type === 'dir') {
            results.push(...collectFiles(child as DirNode, itemPath));
          }
        }
        return results;
      }

      let filesToSearch: { path: string; node: FileNode }[] = [];
      let singleFile = false;

      if (targetArg) {
        const targetSegments = ctx.resolvePath(ctx.currentPath, targetArg);
        let targetNode = ctx.resolveNode(targetSegments);

        if (!targetNode && ctx.currentPath.length > 0 && ctx.fileSystem.children[targetArg]) {
          targetNode = ctx.fileSystem.children[targetArg];
        }

        if (!targetNode) {
          return `<div class="text-[#f85149] text-xs font-mono">grep: ${ctx.escapeHtml(targetArg)}: ${isSv ? 'Ingen sådan fil eller katalog' : 'No such file or directory'}</div>`;
        }

        if (targetNode.type === 'file') {
          filesToSearch.push({ path: targetArg, node: targetNode as FileNode });
          singleFile = true;
        } else {
          filesToSearch = collectFiles(targetNode as DirNode, targetArg.replace(/\/$/, ''));
        }
      } else {
        const currentDir = ctx.getCurrentDir();
        filesToSearch = collectFiles(currentDir, ctx.currentPath.join('/'));
      }

      if (filesToSearch.length === 0) {
        return `<div class="text-[#8b949e] text-xs font-mono">${isSv ? 'Inga filer att söka igenom.' : 'No files to search.'}</div>`;
      }

      let regex: RegExp;
      try {
        regex = new RegExp(patternStr, ignoreCase ? 'gi' : 'g');
      } catch {
        const escaped = patternStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        regex = new RegExp(escaped, ignoreCase ? 'gi' : 'g');
      }

      interface MatchResult {
        filePath: string;
        lineNum: number;
        lineContent: string;
        highlightedContent: string;
      }

      const matches: MatchResult[] = [];
      const fileCounts: Record<string, number> = {};

      for (const file of filesToSearch) {
        const content = file.node.content || '';
        const lines = content.split('\n');
        fileCounts[file.path] = 0;

        lines.forEach((line, idx) => {
          regex.lastIndex = 0;
          const isMatch = regex.test(line);
          const shouldInclude = invertMatch ? !isMatch : isMatch;

          if (shouldInclude) {
            fileCounts[file.path]++;
            let highlighted = ctx.escapeHtml(line);
            if (!invertMatch) {
              regex.lastIndex = 0;
              highlighted = ctx.escapeHtml(line).replace(
                new RegExp(regex.source, regex.flags),
                (m) => `<mark class="bg-[#f59e0b]/30 text-[#f59e0b] px-0.5 rounded font-bold">${m}</mark>`
              );
            }
            matches.push({
              filePath: file.path,
              lineNum: idx + 1,
              lineContent: line,
              highlightedContent: highlighted,
            });
          }
        });
      }

      if (filesOnly) {
        const matchingFiles = Object.keys(fileCounts).filter(p => fileCounts[p] > 0);
        if (matchingFiles.length === 0) {
          return `<div class="text-[#8b949e] text-xs font-mono">${isSv ? `Inga matchningar hittades för '${ctx.escapeHtml(patternStr)}'.` : `No matches found for '${ctx.escapeHtml(patternStr)}'.`}</div>`;
        }
        return `<div class="font-mono text-xs space-y-0.5 text-[#38bdf8]">${matchingFiles.map(f => `<div>${ctx.escapeHtml(f)}</div>`).join('')}</div>`;
      }

      if (countOnly) {
        return `<div class="font-mono text-xs space-y-0.5">${Object.entries(fileCounts).map(([f, c]) =>
          `<div><span class="text-[#38bdf8]">${ctx.escapeHtml(f)}</span>: <span class="text-[#10b981] font-bold">${c}</span></div>`
        ).join('')}</div>`;
      }

      if (matches.length === 0) {
        return `<div class="text-[#8b949e] text-xs font-mono">${isSv ? `grep: Inga matchningar hittades för '${ctx.escapeHtml(patternStr)}'.` : `grep: No matches found for '${ctx.escapeHtml(patternStr)}'.`}</div>`;
      }

      const rows = matches.map(m => {
        const filePrefix = singleFile ? '' : `<span class="text-[#38bdf8] font-bold">${ctx.escapeHtml(m.filePath)}</span><span class="text-[#30363d]">:</span>`;
        const linePrefix = showLineNumbers ? `<span class="text-[#10b981] font-mono">${m.lineNum}</span><span class="text-[#30363d]">:</span> ` : ' ';
        return `<div class="leading-relaxed">${filePrefix}${linePrefix}<span class="text-[#e6edf3] font-mono">${m.highlightedContent}</span></div>`;
      }).join('');

      return `<div class="font-mono text-xs space-y-1 p-2.5 rounded bg-[#0d1117] border border-[#30363d] overflow-x-auto max-h-96">${rows}</div>`;
    },

    // 8b. NEOVIM TUI EDITOR SIMULATOR
    nvim: (args, ctx) => handleNvimCommand(args, ctx),

    open: (args, ctx) => {
      const rawTarget = args[0] ? args[0].trim() : '.';
      const target = rawTarget.toLowerCase().replace(/\/$/, '').replace(/\.md$/, '');
      const opening = (p: string) => `<div class="text-[#10b981]">${ctx.lang === 'sv' ? `Öppnar ${ctx.escapeHtml(p)} på webben...` : `Opening ${ctx.escapeHtml(p)} on web...`}</div>`;
      const navTo = (p: string) => `<div class="text-[#10b981]">${ctx.lang === 'sv' ? `Navigerar till ${ctx.escapeHtml(p)}...` : `Navigating to ${ctx.escapeHtml(p)}...`}</div>`;

      if (target === '.' || target === '') {
        if (ctx.currentPath.length === 0) {
          ctx.navigateWithCli('/', opening('/'));
          return;
        }
        const folder = ctx.currentPath[0];
        ctx.navigateWithCli(`/${folder}`, opening(`/${folder}`));
        return;
      }

      if (target === '..' || target === '~') {
        ctx.navigateWithCli('/', opening('/'));
        return;
      }

      const targetSegments = ctx.resolvePath(ctx.currentPath, rawTarget);
      const resolvedNode = ctx.resolveNode(targetSegments);

      if (resolvedNode) {
        if (resolvedNode.type === 'dir') {
          const dirUrl = targetSegments.length === 0 ? '/' : `/${targetSegments.join('/')}`;
          ctx.navigateWithCli(dirUrl, opening(dirUrl));
          return;
        } else if (resolvedNode.type === 'file' && resolvedNode.actionUrl) {
          ctx.navigateWithCli(resolvedNode.actionUrl, opening(`${rawTarget} (${resolvedNode.actionUrl})`));
          return;
        }
      }

      const current = ctx.getCurrentDir();
      if (current.children[rawTarget] && current.children[rawTarget].type === 'file') {
        const f = current.children[rawTarget] as FileNode;
        if (f.actionUrl) {
          ctx.navigateWithCli(f.actionUrl, opening(`${rawTarget} (${f.actionUrl})`));
          return;
        }
      }

      const cleanTarget = target.replace(/^(\.\.\/|\.\/|\/|~\/)+/, '');

      for (const [_, dirNode] of Object.entries(ctx.fileSystem.children)) {
        if (dirNode.type === 'dir') {
          for (const [fname, node] of Object.entries(dirNode.children)) {
            if (node.type === 'file') {
              const baseFname = fname.toLowerCase().replace(/\.md$/, '');
              if (cleanTarget === baseFname || cleanTarget === fname.toLowerCase() || baseFname.includes(cleanTarget) || cleanTarget.includes(baseFname)) {
                if (node.actionUrl) {
                  ctx.navigateWithCli(node.actionUrl, `<div class="text-[#38bdf8]">${ctx.lang === 'sv' ? 'Öppnar' : 'Opening'} ${ctx.escapeHtml(fname)} (${ctx.escapeHtml(node.actionUrl)})...</div>`);
                  return;
                }
              }
            }
          }
        }
      }

      if (cleanTarget === 'projects' || cleanTarget === 'projekt') {
        ctx.navigateWithCli('/projects', navTo('/projects'));
        return;
      }
      if (cleanTarget === 'thoughts' || cleanTarget === 'tankar' || cleanTarget === 'blog' || cleanTarget === 'blogg' || cleanTarget === 'anteckningar') {
        ctx.navigateWithCli('/thoughts', navTo('/thoughts'));
        return;
      }
      if (cleanTarget === 'files' || cleanTarget === 'filer' || cleanTarget === 'downloads') {
        ctx.navigateWithCli('/files', navTo('/files'));
        return;
      }

      const isSv = ctx.lang === 'sv';
      return `
<div class="space-y-2.5 pt-1 text-xs font-mono">
  <div class="p-3.5 rounded bg-[#0d1117] border border-[#f85149]/60 space-y-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-[#f85149] font-bold">HTTP 404 // COMMAND_NOT_FOUND</span>
      </div>
      <span class="text-[10px] text-[#f59e0b] px-1.5 py-0.5 rounded border border-[#f59e0b]/40">ERR_NOT_FOUND</span>
    </div>
    <div class="text-[#e6edf3]">
      <span class="text-[#f85149]">open:</span> ${isSv ? `Kunde inte hitta eller öppna mål: ` : `Cannot locate or open target: `}<code class="text-[#f85149] font-bold">${ctx.escapeHtml(rawTarget)}</code>
    </div>
    <p class="text-[#8b949e] text-[11px] leading-relaxed">
      ${isSv ? 'Sökvägen existerar inte på stationen. Den kan ha flyttats, döpts om eller aldrig kompilerats.' : 'The requested path does not exist on this station. It might have been moved, renamed, or never compiled.'}
    </p>
    <div class="pt-2 border-t border-[#30363d]/50">
      <div class="text-[10px] text-[#8b949e] mb-1.5 uppercase tracking-wider font-semibold">
        ${isSv ? 'FÖRESLAGNA DISCOVERY-VEKTORER:' : 'SUGGESTED DISCOVERY VECTORS:'}
      </div>
      <div class="flex flex-wrap gap-2 text-xs">
        <a href="/" class="px-2.5 py-1 rounded bg-[#161b22] border border-[#30363d] hover:border-[#10b981] text-[#10b981] transition-all">[cd ~ / home]</a>
        <a href="/projects" class="px-2.5 py-1 rounded bg-[#161b22] border border-[#30363d] hover:border-[#a78bfa] text-[#a78bfa] transition-all">[cd ~/projects]</a>
        <a href="/thoughts" class="px-2.5 py-1 rounded bg-[#161b22] border border-[#30363d] hover:border-[#f59e0b] text-[#f59e0b] transition-all">[cd ~/thoughts]</a>
        <a href="/files" class="px-2.5 py-1 rounded bg-[#161b22] border border-[#30363d] hover:border-[#38bdf8] text-[#38bdf8] transition-all">[cd ~/files]</a>
      </div>
    </div>
  </div>
</div>`;
    },

    // 9b. HOME / COCKPIT NAVIGATION
    home: (_args, ctx) => {
      const isSv = ctx.lang === 'sv';
      const isAlreadyHome = typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '');
      if (isAlreadyHome) {
        return `<div class="text-[#10b981] font-mono text-xs">${isSv ? 'Du är redan vid cockpiten / på startsidan (/).' : 'You are already at the cockpit / homepage (/).'}</div>`;
      }
      const openingMsg = `<div class="text-[#10b981] font-mono text-xs">${isSv ? 'Navigerar hem till cockpiten (/)...' : 'Navigating home to cockpit (/)...'}</div>`;
      ctx.navigateWithCli('/', openingMsg);
    },

    // 10. BACKGROUND SWITCHER & CONTROLS
    bg: (args, ctx) => {
      let mode = (args[0] || '').toLowerCase().trim();
      const validModes = ['standard', 'topo', 'dither', 'ascii', 'dots', 'blocky', 'shimmer', 'off'];

      if (mode === 'help' || mode === 'list' || mode === '--help' || mode === '-h') {
        return getSecretOutput(ctx.lang);
      }

      if (mode === 'next' || mode === 'cycle') {
        window.dispatchEvent(new CustomEvent('cycle-bg-mode'));
        const current = localStorage.getItem('site_bg_mode') || 'standard';
        return `<div class="text-[#10b981] font-mono">${ctx.lang === 'sv' ? 'Växlade till nästa bakgrundsstil:' : 'Switched to next background style:'} <span class="font-bold">${ctx.escapeHtml(current)}</span></div>`;
      }

      if (!mode || mode === 'toggle' || mode === 'hud' || mode === 'box') {
        window.dispatchEvent(new CustomEvent('toggle-bg-switcher'));
        const current = localStorage.getItem('site_bg_mode') || 'standard';
        const isNowOpen = localStorage.getItem('site_bg_switcher_open') === 'true';
        return `
<div class="space-y-1 font-mono text-xs">
  <div>${ctx.lang === 'sv' ? 'Aktiv bakgrundsstil:' : 'Active background style:'} <span class="text-[#10b981] font-bold">${ctx.escapeHtml(current)}</span></div>
  <div class="text-[#8b949e]">${ctx.lang === 'sv' ? 'Hörnpanel (HUD):' : 'Corner HUD:'} <span class="text-[#38bdf8] font-bold">${isNowOpen ? (ctx.lang === 'sv' ? 'SYNLIG' : 'VISIBLE') : (ctx.lang === 'sv' ? 'DOLD' : 'HIDDEN')}</span></div>
  <div class="text-[#8b949e] text-[11px] pt-1">
    ${ctx.lang === 'sv' ? 'Byt stil direkt med:' : 'Switch style directly with:'} 
    <code class="text-[#38bdf8]">bg standard</code>, <code class="text-[#38bdf8]">bg topo</code>, <code class="text-[#38bdf8]">bg dither</code>, <code class="text-[#38bdf8]">bg ascii</code>, <code class="text-[#38bdf8]">bg dots</code>, <code class="text-[#38bdf8]">bg pixel</code>, <code class="text-[#38bdf8]">bg shimmer</code>, <code class="text-[#38bdf8]">bg off</code>
  </div>
</div>`;
      }

      const rawInput = mode;
      if (mode === 'default') mode = 'standard';
      if (mode === 'pixel') mode = 'blocky';
      if (mode === 'noise') mode = 'shimmer';

      if (validModes.includes(mode)) {
        window.dispatchEvent(new CustomEvent('set-bg-mode', { detail: mode }));
        const label = rawInput === 'pixel' ? 'pixel' : (rawInput === 'noise' ? 'shimmer (noise)' : mode);
        return `<div class="text-[#10b981] font-mono">${ctx.lang === 'sv' ? 'Bakgrundsstil ändrad till:' : 'Background style set to:'} <span class="font-bold">${ctx.escapeHtml(label)}</span></div>`;
      }
      return `<div class="text-[#f85149] font-mono">${ctx.lang === 'sv' ? `Ogiltig stil '${ctx.escapeHtml(rawInput)}'. Välj mellan: standard, topo, dither, ascii, dots, pixel, shimmer, off.` : `Invalid style '${ctx.escapeHtml(rawInput)}'. Choose from: standard, topo, dither, ascii, dots, pixel, shimmer, off.`}</div>`;
    },

    secret: (_args, ctx) => getSecretOutput(ctx.lang),

    matrix: () => {
      window.dispatchEvent(new CustomEvent('set-bg-mode', { detail: 'ascii' }));
      return '<div class="text-[#10b981] font-mono">Wake up, Neo... [Background switched to ASCII matrix]</div>';
    },

    clear: (_args, ctx) => {
      ctx.clearHistory();
    },

    reset: (_args, ctx) => {
      // 1. Language to English (default)
      setSiteLang('en');
      localStorage.setItem('site_lang', 'en');

      // 2. Ambient background to standard
      window.dispatchEvent(new CustomEvent('set-bg-mode', { detail: 'standard' }));
      localStorage.removeItem('site_bg_mode');
      localStorage.removeItem('site_bg_switcher_open');

      // 3. Clear all dismissed notices and stored session preferences
      sessionStorage.removeItem('dismissed_thought_lang_notice');
      sessionStorage.removeItem('terminal_cat_hint_dismissed');
      sessionStorage.removeItem('terminal_closed_by_user');
      sessionStorage.removeItem('terminal_cmd_history');
      sessionStorage.removeItem('terminal_history_html');
      sessionStorage.removeItem('terminal_nav_scroll_y');
      sessionStorage.removeItem('terminal_opened_on_mobile');
      sessionStorage.removeItem('gulo_boot_intro_played');
      sessionStorage.removeItem('navigated_via_cli');
      localStorage.removeItem('terminal_cmd_history');

      // Unhide thought notice on current page if present
      const notice = document.getElementById('thought-lang-notice');
      if (notice) notice.classList.remove('hidden');

      // 4. Reset cwd to ~
      ctx.setCurrentPath([]);

      // 5. Purge command history & clear terminal output buffer
      ctx.clearHistory();

      // 6. Trigger reboot sequence across all pages (even subpages like /thoughts)
      window.dispatchEvent(new CustomEvent('terminal-reboot'));

      // Return empty string so no output is printed in the terminal
      return '';
    },
    reboot: (args, ctx) => commands.reset(args, ctx),
    restart: (args, ctx) => commands.reset(args, ctx),
    'factory-reset': (args, ctx) => commands.reset(args, ctx),
    defaults: (args, ctx) => commands.reset(args, ctx),
    default: (args, ctx) => commands.reset(args, ctx),

    uptime: (_args, ctx) => {
      const up = calculateUptime();
      const uptimeStr = ctx.lang === 'sv' ? up.formattedSv : up.formattedEn;
      const isOnline = isSiteOnline();
      if (!isOnline) {
        return `<div class="text-[#f85149] font-mono">system uptime: <span class="text-[#e6edf3] font-semibold">${uptimeStr}</span> (chalmers-station) <span class="text-[#f85149] font-bold">[OFFLINE]</span></div>`;
      }
      return `<div class="text-[#10b981] font-mono">system uptime: <span class="text-[#e6edf3] font-semibold">${uptimeStr}</span> (chalmers-station)</div>`;
    },

    exit: (_args, ctx) => {
      ctx.exitTerminal();
    },

    // 10b. SAFE ECHO COMMAND
    echo: (args, ctx) => {
      if (args.length === 0) return '<div></div>';
      const isInterpretEscapes = args[0] === '-e';
      const cleanArgs = isInterpretEscapes ? args.slice(1) : args;
      let rawText = cleanArgs.join(' ');
      if ((rawText.startsWith('"') && rawText.endsWith('"')) || (rawText.startsWith("'") && rawText.endsWith("'"))) {
        rawText = rawText.slice(1, -1);
      }
      return `<div class="text-[#e6edf3] font-mono text-xs whitespace-pre-wrap">${ctx.escapeHtml(rawText)}</div>`;
    },

    // 10c. MAN & TLDR COMMANDS
    man: (args, ctx) => {
      const topic = (args[0] || '').toLowerCase().trim();
      const isSv = ctx.lang === 'sv';
      if (!topic) {
        return `<div class="text-[#f59e0b] font-mono text-xs">${isSv ? 'Användning: man <kommando> (t.ex. man git, man nvim, man calc, man wget)' : 'Usage: man <command> (e.g. man git, man nvim, man calc, man wget)'}</div>`;
      }
      const manuals: Record<string, { descSv: string; descEn: string; syn: string }> = {
        help: { descSv: 'Visar tillgängliga kommandon i terminalen.', descEn: 'Displays available commands in the terminal.', syn: 'help [--extended]' },
        grep: { descSv: 'Söker efter mönster i filer och kataloger med radnummer och syntaxfärgning.', descEn: 'Searches for patterns across files and directories with line numbers and highlighting.', syn: 'grep [-inrl] <mönster> [fil|katalog]' },
        git: { descSv: 'Simulerad Git-klient för versionshantering & inspektion av repot.', descEn: 'Simulated Git client for version control & repo inspection.', syn: 'git [status|log|branch|diff|remote|push]' },
        nvim: { descSv: 'Interaktiv Neovim TUI bufferinspektör med TokyoNight statusline.', descEn: 'Interactive Neovim TUI buffer inspector with TokyoNight statusline.', syn: 'nvim [filnamn]' },
        calc: { descSv: 'Säker matematisk miniräknare utan eval.', descEn: 'Safe mathematical expression evaluator without eval.', syn: 'calc <uttryck>' },
        wget: { descSv: 'Laddar ned resurser, arkivpaket och artikeldokument (PDF) direkt till din disk.', descEn: 'Downloads resources, archive packages, and article companion PDFs directly to your disk.', syn: 'wget <filnamn>' },
        bg: { descSv: 'Växlar ambient visuell bakgrundseffekt i cockpiten.', descEn: 'Switches ambient visual background effect in the cockpit.', syn: 'bg [standard|topo|dither|ascii|dots|pixel|shimmer|off]' },
        status: { descSv: 'Visar aktuell live-telemetri, homelab & tillgänglighet.', descEn: 'Displays current live telemetry, homelab status & availability.', syn: 'status' },
        echo: { descSv: 'Skriver ut säker text till terminalen.', descEn: 'Prints sanitized text to the terminal.', syn: 'echo <text>' }
      };

      const m = manuals[topic];
      if (m) {
        return `
<div class="p-3 rounded bg-[#0d1117] border border-[#30363d] font-mono text-xs space-y-1.5">
  <div class="text-[#10b981] font-bold border-b border-[#30363d] pb-1">MANUAL: ${ctx.escapeHtml(topic.toUpperCase())}(1)</div>
  <div><span class="text-[#38bdf8] font-semibold">${isSv ? 'SYNTAX' : 'SYNOPSIS'}:</span> <code class="text-[#e6edf3]">${ctx.escapeHtml(m.syn)}</code></div>
  <div><span class="text-[#38bdf8] font-semibold">${isSv ? 'BESKRIVNING' : 'DESCRIPTION'}:</span> <span class="text-[#8b949e]">${isSv ? ctx.escapeHtml(m.descSv) : ctx.escapeHtml(m.descEn)}</span></div>
</div>`;
      }
      return `<div class="text-[#f85149] font-mono text-xs">${isSv ? `Ingen manual hittades för '${ctx.escapeHtml(topic)}'. Skriv 'help' för kommandolista.` : `No manual entry for '${ctx.escapeHtml(topic)}'. Type 'help' for command list.`}</div>`;
    },
    tldr: (args, ctx) => commands.man(args, ctx),

    // 11. NEOFETCH / FASTFETCH (print system diagnostic banner inline)
    neofetch: (_args, ctx) => getFastfetchOutput(ctx.lang),
    fastfetch: (_args, ctx) => getFastfetchOutput(ctx.lang),
    fetch: (_args, ctx) => getFastfetchOutput(ctx.lang),

    // 12. UNAME
    uname: (args, _ctx) => {
      const flag = (args[0] || '-s').toLowerCase();
      if (flag === '-a' || flag === '--all') {
        return `<div class="text-[#8b949e] font-mono">Linux chalmers-station 6.12.8-zen1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux</div>`;
      }
      if (flag === '-r') {
        return `<div class="text-[#8b949e] font-mono">6.12.8-zen1</div>`;
      }
      return `<div class="text-[#8b949e] font-mono">Linux</div>`;
    },

    hostname: (_args, _ctx) => `<div class="text-[#38bdf8] font-mono">chalmers-station</div>`,

    // 13. HISTORY
    history: (_args, ctx) => {
      let cmds: string[] = [];
      if (typeof window !== 'undefined' && (window as any).__terminal_cmd_history && Array.isArray((window as any).__terminal_cmd_history)) {
        cmds = (window as any).__terminal_cmd_history;
      }
      if (cmds.length === 0) {
        const saved = sessionStorage.getItem('terminal_cmd_history');
        if (saved) {
          try { cmds = JSON.parse(saved); } catch { }
        }
      }
      if (cmds.length === 0) {
        return ctx.lang === 'sv'
          ? `<div class="text-[#8b949e] font-mono text-xs">Inga tidigare kommandon i historiken.</div>`
          : `<div class="text-[#8b949e] font-mono text-xs">No previous commands in history.</div>`;
      }
      const lines = cmds.slice(-25).map((c, i) =>
        `<div class="text-[#8b949e]"><span class="text-[#38bdf8] inline-block w-6 text-right mr-2">${i + 1}</span>${ctx.escapeHtml(c)}</div>`
      ).join('');
      return `<div class="font-mono text-xs space-y-0.5">${lines}</div>`;
    },

    // 14. WGET COMMAND (primary command for downloading files from files/ archive & companion PDFs)
    wget: (args, ctx) => {
      const isSv = ctx.lang === 'sv';
      const filesDir = ctx.fileSystem.children['files'];
      const thoughtsDir = ctx.fileSystem.children['thoughts'];
      const projectsDir = ctx.fileSystem.children['projects'];

      if (!args[0]) {
        const downloadables: string[] = [];
        if (filesDir && filesDir.type === 'dir') {
          downloadables.push(...Object.keys(filesDir.children));
        }
        if (thoughtsDir && thoughtsDir.type === 'dir') {
          downloadables.push(...Object.keys(thoughtsDir.children).filter(f => f.endsWith('.pdf')));
        }
        if (projectsDir && projectsDir.type === 'dir') {
          downloadables.push(...Object.keys(projectsDir.children).filter(f => f.endsWith('.pdf')));
        }
        const list = downloadables.length > 0
          ? downloadables.map(f => `<span class="text-[#10b981]">${ctx.escapeHtml(f)}</span>`).join(', ')
          : (isSv ? 'inga filer tillgängliga' : 'no files available');

        return isSv
          ? `<div class="text-[#f59e0b] text-xs font-mono space-y-1">
              <div>Användning: <code class="text-[#10b981]">wget &lt;filnamn&gt;</code> — Ladda ned en resurs eller PDF till din disk.</div>
              <div class="text-[#8b949e]">Tillgängliga filer &amp; PDF:er: ${list}</div>
             </div>`
          : `<div class="text-[#f59e0b] text-xs font-mono space-y-1">
              <div>Usage: <code class="text-[#10b981]">wget &lt;filename&gt;</code> — Download a resource or PDF to your disk.</div>
              <div class="text-[#8b949e]">Available files &amp; PDFs: ${list}</div>
             </div>`;
      }

      let filename = args[0].trim();
      let matchedName = filename;

      // Strip path prefixes if provided
      if (filename.startsWith('files/')) {
        filename = filename.slice(6);
      } else if (filename.startsWith('./files/')) {
        filename = filename.slice(8);
      } else if (filename.startsWith('thoughts/')) {
        filename = filename.slice(9);
      } else if (filename.startsWith('./thoughts/')) {
        filename = filename.slice(11);
      } else if (filename.startsWith('projects/')) {
        filename = filename.slice(9);
      } else if (filename.startsWith('./projects/')) {
        filename = filename.slice(11);
      } else if (filename.startsWith('./')) {
        filename = filename.slice(2);
      }

      let targetNode: any = null;

      // 1. Search in current directory first
      const current = ctx.getCurrentDir();
      if (current && current.children[filename] && current.children[filename].type === 'file') {
        const candidate = current.children[filename] as FileNode;
        if (candidate.actionUrl || (candidate as any).isPdf) {
          targetNode = candidate;
          matchedName = filename;
        }
      }

      // 2. Search in files/ directory (primary downloads archive)
      if (!targetNode && filesDir && filesDir.type === 'dir') {
        if (filesDir.children[filename] && filesDir.children[filename].type === 'file') {
          targetNode = filesDir.children[filename];
          matchedName = filename;
        } else {
          const matchKey = Object.keys(filesDir.children).find(k =>
            k.toLowerCase() === filename.toLowerCase() || k.toLowerCase().includes(filename.toLowerCase())
          );
          if (matchKey) {
            targetNode = filesDir.children[matchKey];
            matchedName = matchKey;
          }
        }
      }

      // 3. Search in thoughts/ directory (for companion PDFs ONLY)
      if (!targetNode && thoughtsDir && thoughtsDir.type === 'dir') {
        if (thoughtsDir.children[filename] && thoughtsDir.children[filename].type === 'file') {
          const candidate = thoughtsDir.children[filename] as FileNode;
          if ((candidate as any).isPdf || filename.endsWith('.pdf')) {
            targetNode = candidate;
            matchedName = filename;
          }
        } else {
          const matchKey = Object.keys(thoughtsDir.children).find(k =>
            k.endsWith('.pdf') && (k.toLowerCase() === filename.toLowerCase() || k.toLowerCase().startsWith(filename.toLowerCase()) || k.toLowerCase().includes(filename.toLowerCase()))
          );
          if (matchKey) {
            targetNode = thoughtsDir.children[matchKey];
            matchedName = matchKey;
          }
        }
      }

      // 4. Search in projects/ directory (for project companion PDFs ONLY)
      if (!targetNode && projectsDir && projectsDir.type === 'dir') {
        if (projectsDir.children[filename] && projectsDir.children[filename].type === 'file') {
          const candidate = projectsDir.children[filename] as FileNode;
          if ((candidate as any).isPdf || filename.endsWith('.pdf')) {
            targetNode = candidate;
            matchedName = filename;
          }
        } else {
          const matchKey = Object.keys(projectsDir.children).find(k =>
            k.endsWith('.pdf') && (k.toLowerCase() === filename.toLowerCase() || k.toLowerCase().startsWith(filename.toLowerCase()) || k.toLowerCase().includes(filename.toLowerCase()))
          );
          if (matchKey) {
            targetNode = projectsDir.children[matchKey];
            matchedName = matchKey;
          }
        }
      }

      // Check if user attempted to wget a markdown shell document that has NO pdf attached
      const isInternalDoc = (!targetNode && (
        (ctx.fileSystem.children[filename] && ctx.fileSystem.children[filename].type === 'file') ||
        (thoughtsDir && thoughtsDir.type === 'dir' && thoughtsDir.children[filename]) ||
        (projectsDir && projectsDir.type === 'dir' && projectsDir.children[filename])
      ));

      if (!targetNode && isInternalDoc) {
        return isSv
          ? `<div class="text-[#f59e0b] font-mono text-xs p-2.5 rounded bg-[#0d1117] border border-[#f59e0b]/40 space-y-1">
              <div class="text-[#f59e0b] font-bold">wget: '${ctx.escapeHtml(filename)}' saknar nedladdningsbar PDF</div>
              <div class="text-[#8b949e]">Detta dokument har ingen kopplad PDF och är enbart tillgängligt som webbartikel / skalsystemstext.</div>
              <div class="text-[#e6edf3]">Läs med: <code class="text-[#10b981]">cat ${ctx.escapeHtml(filename)}</code> eller <code class="text-[#10b981]">open ${ctx.escapeHtml(filename)}</code></div>
             </div>`
          : `<div class="text-[#f59e0b] font-mono text-xs p-2.5 rounded bg-[#0d1117] border border-[#f59e0b]/40 space-y-1">
              <div class="text-[#f59e0b] font-bold">wget: '${ctx.escapeHtml(filename)}' has no downloadable PDF attached</div>
              <div class="text-[#8b949e]">This document does not have a companion PDF and is only available as a web post / text document.</div>
              <div class="text-[#e6edf3]">Read with: <code class="text-[#10b981]">cat ${ctx.escapeHtml(filename)}</code> or <code class="text-[#10b981]">open ${ctx.escapeHtml(filename)}</code></div>
             </div>`;
      }

      if (targetNode) {
        if (targetNode.actionUrl) {
          const link = document.createElement('a');
          link.href = targetNode.actionUrl;
          link.download = matchedName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return isSv
            ? `<div class="font-mono text-xs text-[#10b981] space-y-0.5">
                <div>[wget] Ansluter till <span class="text-[#38bdf8]">${ctx.escapeHtml(targetNode.actionUrl)}</span>... 200 OK</div>
                <div>Sparar till: <span class="font-bold text-[#e6edf3]">'${ctx.escapeHtml(matchedName)}'</span> [100%] [Lokal nedladdning startad]</div>
               </div>`
            : `<div class="font-mono text-xs text-[#10b981] space-y-0.5">
                <div>[wget] Connecting to <span class="text-[#38bdf8]">${ctx.escapeHtml(targetNode.actionUrl)}</span>... 200 OK</div>
                <div>Saved to: <span class="font-bold text-[#e6edf3]">'${ctx.escapeHtml(matchedName)}'</span> [100%] [Download started]</div>
               </div>`;
        }

        const blob = new Blob([targetNode.content || ''], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = matchedName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return isSv
          ? `<div class="font-mono text-xs text-[#10b981] space-y-0.5">
              <div>[wget] Ansluter till arkiv... 200 OK</div>
              <div>Sparar till: <span class="font-bold text-[#e6edf3]">'${ctx.escapeHtml(matchedName)}'</span> [100%] [Lokal nedladdning startad]</div>
             </div>`
          : `<div class="font-mono text-xs text-[#10b981] space-y-0.5">
              <div>[wget] Connecting to archive... 200 OK</div>
              <div>Saved to: <span class="font-bold text-[#e6edf3]">'${ctx.escapeHtml(matchedName)}'</span> [100%] [Download started]</div>
             </div>`;
      }

      return isSv
        ? `<div class="text-[#f85149] font-mono text-xs">wget: '${ctx.escapeHtml(filename)}': Filen hittades inte (404 Not Found). Skriv <code class="text-[#38bdf8]">ls files</code> för att se tillgängliga paket.</div>`
        : `<div class="text-[#f85149] font-mono text-xs">wget: '${ctx.escapeHtml(filename)}': File not found (404 Not Found). Type <code class="text-[#38bdf8]">ls files</code> to view available packages.</div>`;
    },

    // 15. LINUX / WINDOWS SECRET COMMAND
    linux: (_args, ctx) => getOsOpinionOutput(ctx.lang),
    windows: (_args, ctx) => getOsOpinionOutput(ctx.lang)
  };

  // Aliases
  commands['game'] = commands['guess'];
  commands['spel'] = commands['guess'];
  commands['background'] = commands['bg'];
  commands['theme'] = commands['bg'];
  commands['secrets'] = commands['secret'];
  commands['easteregg'] = commands['secret'];
  commands['eastereggs'] = commands['secret'];

  commands['chalmers'] = commands['school'];
  commands['dir'] = commands['ls'];
  commands['egrep'] = commands['grep'];
  commands['fgrep'] = commands['grep'];
  commands['cls'] = commands['clear'];
  commands['close'] = commands['exit'];

  commands['whoisgulo'] = commands['whoami'];
  commands['whoamgulo'] = commands['whoami'];
  commands['gulo'] = commands['whoami'];
  commands['whois'] = commands['whoami'];
  commands['who'] = commands['whoami'];

  commands['discord'] = commands['contact'];
  commands['kontakt'] = commands['contact'];
  commands['email'] = commands['contact'];
  commands['mail'] = commands['contact'];

  commands['homelab'] = commands['projects'];
  commands['blog'] = commands['thoughts'];
  commands['blogg'] = commands['thoughts'];

  commands['fastfetch'] = commands['neofetch'];
  commands['fetch'] = commands['neofetch'];

  // Wget & download aliases
  commands['download'] = commands['wget'];
  commands['dl'] = commands['wget'];

  // Home aliases
  commands['hem'] = commands['home'];
  commands['main'] = commands['home'];
  commands['index'] = commands['home'];
  commands['cockpit'] = commands['home'];
  commands['root'] = commands['home'];

  // Neovim & Vi aliases
  commands['vim'] = commands['nvim'];
  commands['vi'] = commands['nvim'];
  commands['nano'] = commands['nvim'];

  // Vim muscle memory easter egg (friendly bash notice)
  commands[':q'] = (_args, ctx) => {
    const isSv = ctx.lang === 'sv';
    return isSv
      ? `<div class="text-[#8b949e] font-mono text-xs">[bash] :q: du är redan i bash! 😉 (Skriv <code class="text-[#10b981]">help</code> för kommandon)</div>`
      : `<div class="text-[#8b949e] font-mono text-xs">[bash] :q: you are already in bash! 😉 (Type <code class="text-[#10b981]">help</code> for commands)</div>`;
  };
  commands[':q!'] = commands[':wq'] = commands[':x'] = commands[':q'];

  // Bio, CV & Stats aliases
  commands['about'] = commands['bio'];
  commands['tldr'] = commands['bio'];
  commands['info'] = commands['bio'];
  commands['profil'] = commands['bio'];
  commands['profile'] = commands['bio'];

  commands['resume'] = commands['cv'];
  commands['recruit'] = commands['cv'];

  commands['btop'] = commands['stats'];
  commands['htop'] = commands['stats'];
  commands['top'] = commands['stats'];

  commands['os'] = commands['linux'];
  commands['distro'] = commands['linux'];

  commands['stat'] = commands['status'];
  commands['sysops'] = commands['status'];

  return commands;
}

function executeHelloWorldScript(ctx: CommandContext): string {
  return ctx.lang === 'sv'
    ? `
<div class="text-xs font-mono space-y-1.5 p-3 rounded bg-[#0d1117] border border-[#10b981]">
  <div class="text-[#8b949e] text-[11px]">[exec] Kör ./helloworld.sh ...</div>
  <div class="text-[#10b981] font-bold text-sm">Hello, World! 🚀</div>
  <p class="text-[#e6edf3]">Välkommen till Gulos digitala cockpit (Chalmers Datateknik // D-24).</p>
  <div class="text-[#8b949e] text-[11px] pt-1 border-t border-[#30363d]/50">
    Testa att köra <code class="text-[#38bdf8]">school</code>, <code class="text-[#38bdf8]">swim</code>, <code class="text-[#38bdf8]">calc 42 * 1337</code>, <code class="text-[#38bdf8]">guess</code> eller <code class="text-[#38bdf8]">git status</code>!
  </div>
</div>`
    : `
<div class="text-xs font-mono space-y-1.5 p-3 rounded bg-[#0d1117] border border-[#10b981]">
  <div class="text-[#8b949e] text-[11px]">[exec] Running ./helloworld.sh ...</div>
  <div class="text-[#10b981] font-bold text-sm">Hello, World! 🚀</div>
  <p class="text-[#e6edf3]">Welcome to Gulo's digital cockpit (Chalmers CS // D-24).</p>
  <div class="text-[#8b949e] text-[11px] pt-1 border-t border-[#30363d]/50">
    Try running <code class="text-[#38bdf8]">school</code>, <code class="text-[#38bdf8]">swim</code>, <code class="text-[#38bdf8]">calc 42 * 1337</code>, <code class="text-[#38bdf8]">guess</code>, or <code class="text-[#38bdf8]">git status</code>!
  </div>
</div>`;
}
