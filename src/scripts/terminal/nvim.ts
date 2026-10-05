// src/scripts/terminal/nvim.ts - Interactive Neovim TUI Showcase & Buffer Inspector
import type { CommandContext, FileNode } from './types';

/**
 * Renders files in an authentic Neovim TUI style with line numbers and Lualine TokyoNight statusline
 */
export function handleNvimCommand(args: string[], ctx: CommandContext): string {
  const isSv = ctx.lang === 'sv';
  const targetName = (args[0] || '').trim();
  const sessionId = 'nvim-' + Math.random().toString(36).substring(2, 9);

  // 1. If no argument provided: display authentic Neovim welcome screen
  if (!targetName) {
    return `
<div id="${sessionId}" class="nvim-container my-1.5 rounded bg-[#0d1117] border border-[#38bdf8]/40 overflow-hidden font-mono text-xs select-none">
  <!-- Neovim Tabline -->
  <div class="px-2.5 py-1 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-[11px] text-[#8b949e]">
    <div class="flex items-center gap-1.5">
      <span class="px-2 py-0.5 rounded bg-[#0d1117] text-[#38bdf8] font-semibold border border-[#30363d]">[No Name]</span>
      <span class="text-[#8b949e]">nvim v0.10.2</span>
    </div>
    <div class="text-[10px] text-[#8b949e]">LuaJIT 2.1.1713484468</div>
  </div>

  <!-- Neovim Welcome Splash Screen -->
  <div class="p-5 text-center space-y-2 text-xs">
    <pre class="inline-block text-left text-[#38bdf8] font-bold leading-tight select-none">
   _   __               _         
  / | / /__  ____ _   _(_)___ ___ 
 /  |/ / _ \\/ __ \\ | / / / __  __ \\
/ /|  /  __/ /_/ / |/ / / / / / / /
/_/ |_/\\___/\\____/|___/_/_/ /_/ /_/ 
    </pre>
    <div class="text-[#e6edf3] font-semibold pt-1">NVIM v0.10.2 (LuaJIT 2.1)</div>
    <div class="text-[#8b949e] text-[11px]">Personal configuration: <span class="text-[#10b981]">~/.config/nvim (Lua dotfiles)</span></div>
    
    <div class="pt-3 max-w-sm mx-auto text-left text-[11px] text-[#8b949e] space-y-1.5 bg-[#161b22] p-2.5 rounded border border-[#30363d]">
      <div><code class="text-[#10b981]">nvim &lt;fil&gt;</code> <span class="text-[#8b949e]">— ${isSv ? 'öppna fil i neovim-buffer med radnummer' : 'open file in neovim buffer with line numbers'}</span></div>
      <div><code class="text-[#38bdf8]">cat &lt;fil&gt;</code> <span class="text-[#8b949e]">— ${isSv ? 'snabb textvisning i skalet' : 'quick text output in shell'}</span></div>
    </div>
  </div>

  <!-- Statusline (Lualine TokyoNight style) -->
  <div class="px-2.5 py-1 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between text-[10px] text-[#8b949e]">
    <div class="flex items-center gap-2">
      <span class="px-1.5 py-0.5 rounded bg-[#38bdf8] text-[#0d1117] font-bold">NORMAL</span>
      <span class="text-[#e6edf3] font-semibold">[No Name]</span>
      <span>utf-8</span>
    </div>
    <div class="flex items-center gap-3">
      <span>100%</span>
      <span>0,0-1</span>
    </div>
  </div>
</div>`;
  }

  // 2. Resolve file from virtual filesystem
  let resolvedNode: FileNode | null = null;
  let cleanName = targetName;
  if (cleanName.startsWith('files/')) cleanName = cleanName.slice(6);
  else if (cleanName.startsWith('./')) cleanName = cleanName.slice(2);

  // Check current directory
  if (ctx.currentPath.length > 0) {
    let curr: any = ctx.fileSystem;
    for (const seg of ctx.currentPath) {
      if (curr && curr.children) curr = curr.children[seg];
    }
    if (curr && curr.children && curr.children[cleanName] && curr.children[cleanName].type === 'file') {
      resolvedNode = curr.children[cleanName] as FileNode;
    }
  }

  // Check root
  if (!resolvedNode && ctx.fileSystem.children[cleanName] && ctx.fileSystem.children[cleanName].type === 'file') {
    resolvedNode = ctx.fileSystem.children[cleanName] as FileNode;
  }

  // Check files directory
  if (!resolvedNode) {
    const filesDir = ctx.fileSystem.children['files'];
    if (filesDir && filesDir.type === 'dir' && filesDir.children[cleanName] && filesDir.children[cleanName].type === 'file') {
      resolvedNode = filesDir.children[cleanName] as FileNode;
    }
  }

  const fileContent = resolvedNode ? (resolvedNode.content || '') : `# [Ny fil: ${ctx.escapeHtml(cleanName)}]\n# (Virtuell buffer, skrivskyddad)`;
  const lines = fileContent.split('\n');
  const lineCount = lines.length;
  const byteCount = new Blob([fileContent]).size;

  // Build buffer display lines with line numbers
  const displayLines = lines.slice(0, 30).map((line, idx) => {
    const lineNum = (idx + 1).toString().padStart(2, ' ');
    return `<div class="flex items-start leading-relaxed hover:bg-[#161b22]/60 px-2 py-0.5">
      <span class="text-[#484f58] select-none w-7 shrink-0 text-right pr-3 font-mono">${lineNum}</span>
      <span class="text-[#e6edf3] font-mono whitespace-pre-wrap break-all">${ctx.escapeHtml(line) || ' '}</span>
    </div>`;
  }).join('');

  // Tildes for empty lines
  const tildes = Array.from({ length: Math.max(0, 8 - lineCount) })
    .map(() => `<div class="flex items-center text-[#38bdf8]/40 select-none px-2"><span class="w-7 text-right pr-3">~</span></div>`)
    .join('');

  return `
<div id="${sessionId}" class="nvim-container my-1.5 rounded bg-[#0d1117] border border-[#a78bfa]/50 overflow-hidden font-mono text-xs select-none">
  <!-- Neovim Tabline -->
  <div class="px-2.5 py-1 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-[11px] text-[#8b949e]">
    <div class="flex items-center gap-1.5">
      <span class="px-2 py-0.5 rounded bg-[#0d1117] text-[#10b981] font-semibold border border-[#30363d]">${ctx.escapeHtml(cleanName)}</span>
      <span class="text-[10px] text-[#8b949e]">[RO]</span>
    </div>
    <div class="text-[10px] text-[#8b949e]">nvim v0.10.2</div>
  </div>

  <!-- Buffer Lines -->
  <div class="py-2 overflow-x-auto max-h-[380px] bg-[#0d1117] font-mono text-xs">
    ${displayLines}
    ${tildes}
  </div>

  <!-- Statusline (Lualine TokyoNight style) -->
  <div class="px-2.5 py-1 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between text-[10px] text-[#8b949e]">
    <div class="flex items-center gap-2">
      <span class="px-1.5 py-0.5 rounded bg-[#a78bfa] text-[#0d1117] font-bold">NORMAL</span>
      <span class="text-[#e6edf3] font-semibold">${ctx.escapeHtml(cleanName)}</span>
      <span class="text-[#38bdf8]">utf-8</span>
      <span>[unix]</span>
    </div>
    <div class="flex items-center gap-3">
      <span>100%</span>
      <span>${lineCount}L, ${byteCount}B</span>
      <span>1:1</span>
    </div>
  </div>

  <!-- Commandline / Message -->
  <div class="px-2.5 py-1 bg-[#0d1117] border-t border-[#30363d]/40 flex items-center justify-between text-[10px] text-[#8b949e]">
    <span>"${ctx.escapeHtml(cleanName)}" [readonly] ${lineCount} lines, ${byteCount} bytes</span>
    <span class="text-[#38bdf8]">Neovim Buffer Inspector</span>
  </div>
</div>`;
}
