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

export type CommandFunction = (args: string[], ctx: CommandContext) => string | void;

export function getCommands(): Record<string, CommandFunction> {
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

    // 2. INFORMATION CARDS
    school: (_args, ctx) => {
      const fileNode = ctx.fileSystem.children['school.md'] || ctx.fileSystem.children['chalmers.md'] || ctx.fileSystem.children['chalmers.txt'];
      if (fileNode && fileNode.type === 'file' && fileNode.content) {
        return ctx.renderMarkdownCard(fileNode.content);
      }
      return `<div class="text-[#8b949e] font-mono">Chalmers University of Technology — Computer Science & Engineering (D-24)</div>`;
    },

    swim: (_args, ctx) => {
      const fileNode = ctx.fileSystem.children['swim.md'] || ctx.fileSystem.children['swim.txt'];
      if (fileNode && fileNode.type === 'file' && fileNode.content) {
        return ctx.renderMarkdownCard(fileNode.content);
      }
      return `<div class="text-[#38bdf8] font-mono">Valhallabadet 50m — Competitive swimming (5-6 sessions/week)</div>`;
    },

    whoami: (_args, ctx) => {
      const fileNode = ctx.fileSystem.children['whoami.md'];
      if (fileNode && fileNode.type === 'file' && fileNode.content) {
        return ctx.renderMarkdownCard(fileNode.content);
      }
      return `<div class="text-[#10b981] font-mono">gulo // Chalmers student, swimmer & developer</div>`;
    },

    contact: (_args, ctx) => {
      const fileNode = ctx.fileSystem.children['contact.md'];
      if (fileNode && fileNode.type === 'file' && fileNode.content) {
        return ctx.renderMarkdownCard(fileNode.content);
      }
      return `<div class="text-[#10b981] font-mono">GitHub: github.com/abbguslof | Email: contact@example.com</div>`;
    },

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

    // 7. GREETINGS
    hello: (args, ctx) => getGreetingResponse(args[0] || 'hello', ctx.lang),
    hi: (args, ctx) => getGreetingResponse(args[0] || 'hi', ctx.lang),
    hey: (args, ctx) => getGreetingResponse(args[0] || 'hey', ctx.lang),
    hej: (args, ctx) => getGreetingResponse(args[0] || 'hej', ctx.lang),
    hejsan: (args, ctx) => getGreetingResponse(args[0] || 'hejsan', ctx.lang),
    halloj: (args, ctx) => getGreetingResponse(args[0] || 'halloj', ctx.lang),
    tjena: (args, ctx) => getGreetingResponse(args[0] || 'tjena', ctx.lang),
    yo: (args, ctx) => getGreetingResponse(args[0] || 'yo', ctx.lang),
    hallå: (args, ctx) => getGreetingResponse(args[0] || 'hallå', ctx.lang),
    sup: (args, ctx) => getGreetingResponse(args[0] || 'sup', ctx.lang),

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
      localStorage.removeItem('terminal_cmd_history');

      // Unhide thought notice on current page if present
      const notice = document.getElementById('thought-lang-notice');
      if (notice) notice.classList.remove('hidden');

      // 4. Reset cwd to ~
      ctx.setCurrentPath([]);

      // 5. Purge command history & clear terminal output
      ctx.clearHistory();

      return `
<div class="space-y-2 font-mono text-xs p-3.5 rounded bg-[#0d1117] border border-[#10b981]/50 text-[#e6edf3]">
  <div class="text-[#10b981] font-bold flex items-center gap-2 text-sm border-b border-[#30363d]/60 pb-1.5">
    <span>✓</span> <span>SYSTEM RESET // FACTORY DEFAULTS RESTORED</span>
  </div>
  <div class="text-[#8b949e] text-xs space-y-1">
    <div class="flex items-center gap-2">
      <span class="text-[#10b981]">●</span> <span>Language reset:</span>
      <span class="text-[#e6edf3] font-semibold">English (EN)</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-[#38bdf8]">●</span> <span>Ambient background:</span>
      <span class="text-[#e6edf3] font-semibold">standard (dark cockpit)</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-[#f59e0b]">●</span> <span>Dismissed notices:</span>
      <span class="text-[#e6edf3] font-semibold">Restored &amp; unhidden</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-[#a78bfa]">●</span> <span>Terminal history &amp; buffer:</span>
      <span class="text-[#e6edf3] font-semibold">Purged</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-[#8b949e]">●</span> <span>Working directory:</span>
      <span class="text-[#e6edf3] font-semibold">~</span>
    </div>
  </div>
  <div class="text-[11px] text-[#8b949e] pt-1.5 border-t border-[#30363d]/40">
    All user preferences, session flags, and console state have been reset to initial cockpit defaults.
  </div>
</div>`;
    },
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
          try { cmds = JSON.parse(saved); } catch {}
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

    // 14. WGET COMMAND (primary command for downloading files from files/ archive)
    wget: (args, ctx) => {
      const isSv = ctx.lang === 'sv';
      const filesDir = ctx.fileSystem.children['files'];

      if (!args[0]) {
        if (filesDir && filesDir.type === 'dir') {
          const list = Object.keys(filesDir.children)
            .map(f => `<span class="text-[#10b981]">${ctx.escapeHtml(f)}</span>`)
            .join(', ');
          return isSv
            ? `<div class="text-[#f59e0b] text-xs font-mono space-y-1">
                <div>Användning: <code class="text-[#10b981]">wget &lt;filnamn&gt;</code> — Ladda ned en resurs från <code class="text-[#38bdf8]">files/</code>.</div>
                <div class="text-[#8b949e]">Tillgängliga filer i files/: ${list}</div>
               </div>`
            : `<div class="text-[#f59e0b] text-xs font-mono space-y-1">
                <div>Usage: <code class="text-[#10b981]">wget &lt;filename&gt;</code> — Download a resource from <code class="text-[#38bdf8]">files/</code>.</div>
                <div class="text-[#8b949e]">Available files in files/: ${list}</div>
               </div>`;
        }
        return isSv
          ? `<div class="text-[#f59e0b] text-xs font-mono">Användning: <code class="text-[#10b981]">wget &lt;filnamn&gt;</code> — Laddar ned från arkivet. Skriv <code class="text-[#38bdf8]">ls files</code> för att se filer.</div>`
          : `<div class="text-[#f59e0b] text-xs font-mono">Usage: <code class="text-[#10b981]">wget &lt;filename&gt;</code> — Downloads from archive. Type <code class="text-[#38bdf8]">ls files</code> to list files.</div>`;
      }

      let filename = args[0].trim();
      let matchedName = filename;

      // Strip path prefixes if provided
      if (filename.startsWith('files/')) {
        filename = filename.slice(6);
      } else if (filename.startsWith('./files/')) {
        filename = filename.slice(8);
      } else if (filename.startsWith('./')) {
        filename = filename.slice(2);
      }

      // Check if user tried to download a virtual root shell doc (whoami.md, school.md, helloworld.sh, etc.)
      const isInternalDoc = ctx.fileSystem.children[filename] && ctx.fileSystem.children[filename].type === 'file';
      const isInsideFilesDir = ctx.currentPath.length > 0 && ctx.currentPath[0] === 'files';

      // 1. Search in files/ directory first (intended location for downloadable files)
      let targetNode: any = null;
      if (filesDir && filesDir.type === 'dir') {
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

      // 2. If user is currently in files/ directory, also check current directory
      if (!targetNode && isInsideFilesDir) {
        const current = ctx.getCurrentDir();
        if (current && current.children[filename] && current.children[filename].type === 'file') {
          targetNode = current.children[filename];
          matchedName = filename;
        }
      }

      // If user attempted to wget a root virtual markdown/doc file:
      if (!targetNode && isInternalDoc) {
        return isSv
          ? `<div class="text-[#f59e0b] font-mono text-xs p-2.5 rounded bg-[#0d1117] border border-[#f59e0b]/40 space-y-1">
              <div class="text-[#f59e0b] font-bold">wget: '${ctx.escapeHtml(filename)}' är ett internt terminaldokument</div>
              <div class="text-[#8b949e]">Detta är ett virtuellt skalsystemsdokument och laddas inte ned till disken.</div>
              <div class="text-[#e6edf3]">Läs med: <code class="text-[#10b981]">cat ${ctx.escapeHtml(filename)}</code> eller <code class="text-[#10b981]">nvim ${ctx.escapeHtml(filename)}</code></div>
              <div class="text-[#8b949e] text-[11px] pt-1 border-t border-[#30363d]/40">Nedladdningsbara paket finns i <code class="text-[#38bdf8]">files/</code> (skriv <code class="text-[#38bdf8]">ls files</code>).</div>
             </div>`
          : `<div class="text-[#f59e0b] font-mono text-xs p-2.5 rounded bg-[#0d1117] border border-[#f59e0b]/40 space-y-1">
              <div class="text-[#f59e0b] font-bold">wget: '${ctx.escapeHtml(filename)}' is an internal terminal document</div>
              <div class="text-[#8b949e]">This is a virtual shell document and cannot be downloaded to disk.</div>
              <div class="text-[#e6edf3]">Inspect with: <code class="text-[#10b981]">cat ${ctx.escapeHtml(filename)}</code> or <code class="text-[#10b981]">nvim ${ctx.escapeHtml(filename)}</code></div>
              <div class="text-[#8b949e] text-[11px] pt-1 border-t border-[#30363d]/40">Downloadable files reside in <code class="text-[#38bdf8]">files/</code> (type <code class="text-[#38bdf8]">ls files</code>).</div>
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
