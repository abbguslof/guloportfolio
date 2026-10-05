// src/scripts/terminal/git.ts - Simulated Git Command Engine
import type { LangCode } from './types';

export function handleGitCommand(args: string[], lang: LangCode): string {
  const subCmd = (args[0] || '').toLowerCase().trim();

  switch (subCmd) {
    case '':
    case 'help':
    case '--help':
    case '-h':
      return renderGitHelp(lang);

    case 'status':
    case 'st':
      return renderGitStatus(lang);

    case 'log':
      return renderGitLog(args, lang);

    case 'branch':
    case 'br':
      return renderGitBranch(lang);

    case 'diff':
      return renderGitDiff(lang);

    case 'remote':
      return renderGitRemote(args);

    case 'commit':
      return renderGitCommit(args, lang);

    case 'push':
      return renderGitPush(lang);

    case 'pull':
      return renderGitPull(lang);

    case 'clone':
      return renderGitClone(args, lang);

    case 'add':
      return renderGitAdd(args, lang);

    case 'checkout':
    case 'switch':
      return renderGitCheckout(args, lang);

    default:
      return lang === 'sv'
        ? `<div class="text-[#f85149] text-xs font-mono">git: '${args[0]}' är inte ett giltigt git-kommando. Skriv <code class="text-[#10b981]">git --help</code> för kommandolista.</div>`
        : `<div class="text-[#f85149] text-xs font-mono">git: '${args[0]}' is not a git command. Type <code class="text-[#10b981]">git --help</code> for command list.</div>`;
  }
}

function renderGitHelp(lang: LangCode): string {
  return lang === 'sv'
    ? `
<div class="text-xs font-mono space-y-1.5 p-3 rounded bg-[#0d1117] border border-[#30363d]">
  <div class="text-[#10b981] font-bold border-b border-[#30363d] pb-1">GIT VERSION CONTROL SYSTEM (SIMULERAT)</div>
  <div class="text-[#8b949e] mb-1">Dessa git-kommandon är tillgängliga i portföljen:</div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[#e6edf3]">
    <div><span class="text-[#10b981] font-semibold">git status</span> : Se arbetskopians status &amp; modifierade filer</div>
    <div><span class="text-[#10b981] font-semibold">git log</span> : Visa senaste commits i repot</div>
    <div><span class="text-[#10b981] font-semibold">git branch</span> : Visa aktiva grenar (branches)</div>
    <div><span class="text-[#10b981] font-semibold">git diff</span> : Visa färgkodad diff över ändringar</div>
    <div><span class="text-[#10b981] font-semibold">git remote -v</span> : Visa fjärrförrådets GitHub-URL</div>
    <div><span class="text-[#10b981] font-semibold">git push</span> : Simulera push till origin main</div>
  </div>
</div>`
    : `
<div class="text-xs font-mono space-y-1.5 p-3 rounded bg-[#0d1117] border border-[#30363d]">
  <div class="text-[#10b981] font-bold border-b border-[#30363d] pb-1">GIT VERSION CONTROL SYSTEM (SIMULATED)</div>
  <div class="text-[#8b949e] mb-1">These git commands are available in the portfolio:</div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[#e6edf3]">
    <div><span class="text-[#10b981] font-semibold">git status</span> : Show working tree status &amp; modified files</div>
    <div><span class="text-[#10b981] font-semibold">git log</span> : Show recent commits in repository</div>
    <div><span class="text-[#10b981] font-semibold">git branch</span> : List active branches</div>
    <div><span class="text-[#10b981] font-semibold">git diff</span> : Display color-coded diff of changes</div>
    <div><span class="text-[#10b981] font-semibold">git remote -v</span> : Display GitHub upstream URL</div>
    <div><span class="text-[#10b981] font-semibold">git push</span> : Simulate push to origin main</div>
  </div>
</div>`;
}

function renderGitStatus(lang: LangCode): string {
  return `
<div class="text-xs font-mono space-y-1 p-3 rounded bg-[#0d1117] border border-[#30363d] leading-relaxed">
  <div class="text-[#e6edf3]">On branch <span class="text-[#38bdf8] font-bold">main</span></div>
  <div class="text-[#8b949e]">Your branch is up to date with '<span class="text-[#38bdf8]">origin/main</span>'.</div>
  <div class="pt-2 text-[#8b949e]">Changes not staged for commit:</div>
  <div class="text-[#8b949e] pl-4 text-[11px]">(use "git add &lt;file&gt;..." to update what will be committed)</div>
  <div class="pl-4 text-[#f59e0b] font-semibold">modified:   whoami.md <span class="text-[#8b949e] font-normal">(continuous learning &amp; growth)</span></div>
  <div class="pl-4 text-[#f59e0b] font-semibold">modified:   skills.md <span class="text-[#8b949e] font-normal">(adding more Rust &amp; low-level systems)</span></div>
  <div class="pt-2 text-[#8b949e]">Untracked files:</div>
  <div class="text-[#8b949e] pl-4 text-[11px]">(use "git add &lt;file&gt;..." to include in what will be committed)</div>
  <div class="pl-4 text-[#f85149]">.secret/</div>
  <div class="pl-4 text-[#f85149]">ideas-for-next-project.txt</div>
  <div class="pt-2 text-[#8b949e]">no changes added to commit (use "git add")</div>
</div>`;
}

function renderGitLog(args: string[], _lang: LangCode): string {
  const isOneLine = args.includes('--oneline');

  if (isOneLine) {
    return `
<div class="text-xs font-mono space-y-1 p-2 rounded bg-[#0d1117] border border-[#30363d]">
  <div><span class="text-[#f59e0b]">c1d7ff1</span> <span class="text-[#38bdf8]">(HEAD -> main, origin/main)</span> <span class="text-[#e6edf3]">feat: polish cockpit aesthetics, instant WebGL transitions &amp; secret eastereggs</span></div>
  <div><span class="text-[#f59e0b]">8e20ab4</span> <span class="text-[#e6edf3]">refactor: optimize Minecraft cluster docker orchestration &amp; backups</span></div>
  <div><span class="text-[#f59e0b]">a4c9f12</span> <span class="text-[#e6edf3]">feat: add chafa ASCII avatar, bilingual switcher and TUI filesystem</span></div>
  <div><span class="text-[#f59e0b]">10b9810</span> <span class="text-[#e6edf3]">init: chalmers datateknik digital garden &amp; homelab architecture</span></div>
</div>`;
  }

  return `
<div class="text-xs font-mono space-y-3 p-3 rounded bg-[#0d1117] border border-[#30363d]">
  <div>
    <div class="text-[#f59e0b]">commit c1d7ff1b83d9e4a <span class="text-[#38bdf8] font-bold">(HEAD -&gt; main, origin/main)</span></div>
    <div class="text-[#8b949e]">Author: gulo &lt;gulo@chalmers.se&gt;</div>
    <div class="text-[#8b949e]">Date:   Sun Oct 5 20:00:00 2026 +0200</div>
    <div class="text-[#e6edf3] pl-4 pt-1 font-semibold">feat: polish cockpit aesthetics, instant WebGL transitions &amp; secret eastereggs</div>
  </div>
  <div class="border-t border-[#30363d]/40 pt-2">
    <div class="text-[#f59e0b]">commit 8e20ab49fa2312b</div>
    <div class="text-[#8b949e]">Author: gulo &lt;gulo@chalmers.se&gt;</div>
    <div class="text-[#8b949e]">Date:   Wed Oct 1 14:22:10 2026 +0200</div>
    <div class="text-[#e6edf3] pl-4 pt-1 font-semibold">refactor: optimize Minecraft cluster docker orchestration &amp; backups</div>
  </div>
  <div class="border-t border-[#30363d]/40 pt-2">
    <div class="text-[#f59e0b]">commit 10b9810ef4412a0</div>
    <div class="text-[#8b949e]">Author: gulo &lt;gulo@chalmers.se&gt;</div>
    <div class="text-[#8b949e]">Date:   Mon Sep 15 09:12:00 2026 +0200</div>
    <div class="text-[#e6edf3] pl-4 pt-1 font-semibold">init: chalmers datateknik digital garden &amp; homelab architecture</div>
  </div>
</div>`;
}

function renderGitBranch(_lang: LangCode): string {
  return `
<div class="text-xs font-mono space-y-1 p-2 rounded bg-[#0d1117] border border-[#30363d]">
  <div class="text-[#10b981] font-bold">* main</div>
  <div class="text-[#8b949e] pl-2">feature/rust-os-kernel</div>
  <div class="text-[#8b949e] pl-2">homelab/minecraft-cluster</div>
  <div class="text-[#8b949e] pl-2">remotes/origin/main</div>
</div>`;
}

function renderGitDiff(_lang: LangCode): string {
  return `
<div class="text-xs font-mono space-y-1 p-3 rounded bg-[#0d1117] border border-[#30363d]">
  <div class="text-[#8b949e] font-bold">diff --git a/skills.md b/skills.md</div>
  <div class="text-[#8b949e]">--- a/skills.md</div>
  <div class="text-[#8b949e]">+++ b/skills.md</div>
  <div class="text-[#38bdf8]">@@ -4,4 +4,6 @@ Focus Areas:</div>
  <div class="text-[#8b949e]">  - C / C++ systems programming</div>
  <div class="text-[#8b949e]">  - Linux &amp; Debian server operations</div>
  <div class="text-[#10b981] bg-[#10b981]/10 px-1">+ - Distributed systems &amp; low-level memory safety</div>
  <div class="text-[#10b981] bg-[#10b981]/10 px-1">+ - Drinking excessive amounts of tea during exam weeks</div>
</div>`;
}

function renderGitRemote(args: string[]): string {
  const isVerbose = args.includes('-v') || args.includes('--verbose');
  if (isVerbose) {
    return `
<div class="text-xs font-mono space-y-1 p-2 rounded bg-[#0d1117] border border-[#30363d]">
  <div><span class="text-[#38bdf8]">origin</span>  https://github.com/abbguslof/portfoliosite.git (fetch)</div>
  <div><span class="text-[#38bdf8]">origin</span>  https://github.com/abbguslof/portfoliosite.git (push)</div>
</div>`;
  }
  return `<div class="text-xs font-mono text-[#38bdf8]">origin</div>`;
}

function renderGitCommit(args: string[], lang: LangCode): string {
  const mIndex = args.indexOf('-m');
  const msg = mIndex !== -1 && args[mIndex + 1] ? args.slice(mIndex + 1).join(' ').replace(/^["']|["']$/g, '') : '';
  
  if (!msg) {
    return lang === 'sv'
      ? `<div class="text-[#f59e0b] text-xs font-mono">Skriv commit-meddelande med <code class="text-[#10b981]">git commit -m "ditt meddelande"</code></div>`
      : `<div class="text-[#f59e0b] text-xs font-mono">Specify a commit message with <code class="text-[#10b981]">git commit -m "your message"</code></div>`;
  }

  return lang === 'sv'
    ? `<div class="text-[#10b981] text-xs font-mono">[main 9fa1c2b] ${escapeHtml(msg)}<br/><span class="text-[#8b949e]">2 filer ändrade, 4 tillägg (+), 0 raderingar (-)</span></div>`
    : `<div class="text-[#10b981] text-xs font-mono">[main 9fa1c2b] ${escapeHtml(msg)}<br/><span class="text-[#8b949e]">2 files changed, 4 insertions(+), 0 deletions(-)</span></div>`;
}

function renderGitPush(lang: LangCode): string {
  return lang === 'sv'
    ? `
<div class="text-xs font-mono space-y-1 p-2 rounded bg-[#0d1117] border border-[#30363d]">
  <div class="text-[#8b949e]">Räknar objekt: 5, klart.</div>
  <div class="text-[#8b949e]">Komprimerar objekt: 100% (3/3), klart.</div>
  <div class="text-[#10b981]">Skriver objekt: 100% (3/3), 412 bytes | 412.00 KiB/s, klart.</div>
  <div class="text-[#e6edf3]">Till https://github.com/abbguslof/portfoliosite.git</div>
  <div class="text-[#38bdf8]">   c1d7ff1..9fa1c2b  main -> main</div>
</div>`
    : `
<div class="text-xs font-mono space-y-1 p-2 rounded bg-[#0d1117] border border-[#30363d]">
  <div class="text-[#8b949e]">Enumerating objects: 5, done.</div>
  <div class="text-[#8b949e]">Compressing objects: 100% (3/3), done.</div>
  <div class="text-[#10b981]">Writing objects: 100% (3/3), 412 bytes | 412.00 KiB/s, done.</div>
  <div class="text-[#e6edf3]">To https://github.com/abbguslof/portfoliosite.git</div>
  <div class="text-[#38bdf8]">   c1d7ff1..9fa1c2b  main -> main</div>
</div>`;
}

function renderGitPull(lang: LangCode): string {
  return lang === 'sv'
    ? `<div class="text-[#10b981] text-xs font-mono">Redan uppdaterad (Already up to date).</div>`
    : `<div class="text-[#10b981] text-xs font-mono">Already up to date.</div>`;
}

function renderGitClone(args: string[], lang: LangCode): string {
  const target = args[1] || 'repo';
  return lang === 'sv'
    ? `<div class="text-[#38bdf8] text-xs font-mono">Klonar till '${escapeHtml(target)}'... Du surfar redan direkt i repot! Kolla in <a href="https://github.com/abbguslof" target="_blank" class="text-[#10b981] underline">github.com/abbguslof</a> för källkod.</div>`
    : `<div class="text-[#38bdf8] text-xs font-mono">Cloning into '${escapeHtml(target)}'... You're already exploring the repo! Check out <a href="https://github.com/abbguslof" target="_blank" class="text-[#10b981] underline">github.com/abbguslof</a> for source code.</div>`;
}

function renderGitAdd(args: string[], lang: LangCode): string {
  const target = args.slice(1).join(' ') || '.';
  return lang === 'sv'
    ? `<div class="text-[#8b949e] text-xs font-mono">Lade till '${escapeHtml(target)}' till staging. Kör <code class="text-[#10b981]">git commit -m "meddelande"</code> för att spara.</div>`
    : `<div class="text-[#8b949e] text-xs font-mono">Added '${escapeHtml(target)}' to staging area. Run <code class="text-[#10b981]">git commit -m "message"</code> to commit.</div>`;
}

function renderGitCheckout(args: string[], lang: LangCode): string {
  const branch = args[1] || 'main';
  return lang === 'sv'
    ? `<div class="text-[#10b981] text-xs font-mono">Växlade till gren '${escapeHtml(branch)}'.</div>`
    : `<div class="text-[#10b981] text-xs font-mono">Switched to branch '${escapeHtml(branch)}'.</div>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
