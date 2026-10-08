// src/scripts/terminal/game.ts - Interactive Minigame Engine
import type { LangCode } from './types';

interface GameState {
  isActive: boolean;
  target: number;
  attempts: number;
  min: number;
  max: number;
  bestScore: number | null;
}

const state: GameState = {
  isActive: false,
  target: 0,
  attempts: 0,
  min: 1,
  max: 100,
  bestScore: null
};

export function handleGameCommand(args: string[], lang: LangCode): string {
  const subCmd = (args[0] || '').toLowerCase().trim();

  if (subCmd === 'reset' || subCmd === 'restart') {
    startNewGame();
    return lang === 'sv'
      ? `<div class="text-[#10b981] text-xs font-mono">Spelet har startats om! Jag tänker på ett heltal mellan 1 och 100. Skriv <code class="text-[#38bdf8]">guess &lt;tal&gt;</code> (t.ex. <code class="text-[#38bdf8]">guess 50</code>).</div>`
      : `<div class="text-[#10b981] text-xs font-mono">Game reset! I'm thinking of an integer between 1 and 100. Type <code class="text-[#38bdf8]">guess &lt;number&gt;</code> (e.g. <code class="text-[#38bdf8]">guess 50</code>).</div>`;
  }

  if (subCmd === 'quit' || subCmd === 'exit') {
    if (!state.isActive) {
      return lang === 'sv'
        ? `<div class="text-[#8b949e] text-xs font-mono">Inget aktivt spel att avsluta.</div>`
        : `<div class="text-[#8b949e] text-xs font-mono">No active game to quit.</div>`;
    }
    const secretTarget = state.target;
    state.isActive = false;
    return lang === 'sv'
      ? `<div class="text-[#f59e0b] text-xs font-mono">Spelet avbröts. Det hemliga talet var <span class="text-[#e6edf3] font-bold">${secretTarget}</span>. Skriv <code class="text-[#10b981]">guess</code> för att spela igen!</div>`
      : `<div class="text-[#f59e0b] text-xs font-mono">Game ended. The secret number was <span class="text-[#e6edf3] font-bold">${secretTarget}</span>. Type <code class="text-[#10b981]">guess</code> to play again!</div>`;
  }

  // If no argument is provided
  if (!subCmd) {
    if (!state.isActive) {
      startNewGame();
      return lang === 'sv'
        ? `
<div class="text-xs font-mono space-y-1.5 p-3 rounded bg-[#0d1117] border border-[#30363d]">
  <div class="text-[#10b981] font-bold border-b border-[#30363d] pb-1">🎮 GISSNINGSSPELET // GUESS THE NUMBER</div>
  <p class="text-[#e6edf3]">Jag har valt ett hemligt heltal mellan <span class="text-[#38bdf8] font-bold">1</span> och <span class="text-[#38bdf8] font-bold">100</span>.</p>
  <p class="text-[#8b949e]">Gissa genom att skriva: <code class="text-[#10b981]">guess &lt;ditt tal&gt;</code> (t.ex. <code class="text-[#38bdf8]">guess 50</code>).</p>
  <div class="text-[11px] text-[#8b949e] pt-1 border-t border-[#30363d]/40">Kommandon: <code class="text-[#38bdf8]">guess &lt;tal&gt;</code> | <code class="text-[#38bdf8]">guess reset</code> | <code class="text-[#38bdf8]">guess quit</code></div>
</div>`
        : `
<div class="text-xs font-mono space-y-1.5 p-3 rounded bg-[#0d1117] border border-[#30363d]">
  <div class="text-[#10b981] font-bold border-b border-[#30363d] pb-1">🎮 NUMBER GUESSING GAME // MINI-CHALLENGE</div>
  <p class="text-[#e6edf3]">I've chosen a secret integer between <span class="text-[#38bdf8] font-bold">1</span> and <span class="text-[#38bdf8] font-bold">100</span>.</p>
  <p class="text-[#8b949e]">Make a guess by typing: <code class="text-[#10b981]">guess &lt;your number&gt;</code> (e.g. <code class="text-[#38bdf8]">guess 50</code>).</p>
  <div class="text-[11px] text-[#8b949e] pt-1 border-t border-[#30363d]/40">Commands: <code class="text-[#38bdf8]">guess &lt;number&gt;</code> | <code class="text-[#38bdf8]">guess reset</code> | <code class="text-[#38bdf8]">guess quit</code></div>
</div>`;
    } else {
      return lang === 'sv'
        ? `<div class="text-[#38bdf8] text-xs font-mono">Spelet pågår! Du har gjort <span class="text-[#e6edf3] font-bold">${state.attempts}</span> gissningar. Skriv <code class="text-[#10b981]">guess &lt;tal&gt;</code> för att gissa.</div>`
        : `<div class="text-[#38bdf8] text-xs font-mono">Game in progress! You've made <span class="text-[#e6edf3] font-bold">${state.attempts}</span> guesses. Type <code class="text-[#10b981]">guess &lt;number&gt;</code> to submit.</div>`;
    }
  }

  // User provided a guess
  const guessNum = parseInt(subCmd, 10);
  if (isNaN(guessNum)) {
    const rawInput = escapeHtml(args[0] || '');
    return lang === 'sv'
      ? `<div class="text-[#f85149] text-xs font-mono">"${rawInput}" är inte ett giltigt heltal. Skriv t.ex. <code class="text-[#10b981]">guess 50</code>.</div>`
      : `<div class="text-[#f85149] text-xs font-mono">"${rawInput}" is not a valid integer. Type e.g. <code class="text-[#10b981]">guess 50</code>.</div>`;
  }

  if (!state.isActive) {
    startNewGame();
  }

  if (guessNum < 1 || guessNum > 100) {
    return lang === 'sv'
      ? `<div class="text-[#f59e0b] text-xs font-mono">Talet måste vara mellan 1 och 100! Försök igen med <code class="text-[#10b981]">guess &lt;tal&gt;</code>.</div>`
      : `<div class="text-[#f59e0b] text-xs font-mono">The number must be between 1 and 100! Try again with <code class="text-[#10b981]">guess &lt;number&gt;</code>.</div>`;
  }

  state.attempts++;

  if (guessNum === state.target) {
    const attempts = state.attempts;
    const target = state.target;
    if (state.bestScore === null || attempts < state.bestScore) {
      state.bestScore = attempts;
    }
    state.isActive = false;

    return lang === 'sv'
      ? `
<div class="text-xs font-mono space-y-2 p-3.5 rounded bg-[#0d1117] border border-[#10b981] shadow-lg">
  <div class="text-[#10b981] font-bold flex items-center gap-2">
    <span>🎉</span>
    <span>HURRA! DU GISSADE HELT RÄTT!</span>
  </div>
  <p class="text-[#e6edf3]">
    Det hemliga talet var <span class="text-[#10b981] font-bold text-sm">${target}</span>. Du klarade det på <span class="text-[#38bdf8] font-bold">${attempts}</span> ${attempts === 1 ? 'försök' : 'försök'}!
  </p>
  <div class="text-[#8b949e] text-[11px] pt-1.5 border-t border-[#30363d]/60 flex items-center justify-between">
    <span>Bästa resultat: ${state.bestScore} försök</span>
    <span>Skriv <code class="text-[#10b981]">guess</code> för en ny omgång!</span>
  </div>
</div>`
      : `
<div class="text-xs font-mono space-y-2 p-3.5 rounded bg-[#0d1117] border border-[#10b981] shadow-lg">
  <div class="text-[#10b981] font-bold flex items-center gap-2">
    <span>🎉</span>
    <span>BULLSEYE! CORRECT GUESS!</span>
  </div>
  <p class="text-[#e6edf3]">
    The secret number was <span class="text-[#10b981] font-bold text-sm">${target}</span>. You solved it in <span class="text-[#38bdf8] font-bold">${attempts}</span> ${attempts === 1 ? 'attempt' : 'attempts'}!
  </p>
  <div class="text-[#8b949e] text-[11px] pt-1.5 border-t border-[#30363d]/60 flex items-center justify-between">
    <span>Best score: ${state.bestScore} attempts</span>
    <span>Type <code class="text-[#10b981]">guess</code> for another round!</span>
  </div>
</div>`;
  }

  if (guessNum < state.target) {
    return lang === 'sv'
      ? `<div class="text-[#38bdf8] text-xs font-mono flex items-center gap-2"><span>⬆️</span> <span><strong class="text-[#e6edf3]">${guessNum}</strong> är för lågt! Gissa ett <strong>högre</strong> tal. (Försök #${state.attempts})</span></div>`
      : `<div class="text-[#38bdf8] text-xs font-mono flex items-center gap-2"><span>⬆️</span> <span><strong class="text-[#e6edf3]">${guessNum}</strong> is too low! Try a <strong>higher</strong> number. (Attempt #${state.attempts})</span></div>`;
  } else {
    return lang === 'sv'
      ? `<div class="text-[#f59e0b] text-xs font-mono flex items-center gap-2"><span>⬇️</span> <span><strong class="text-[#e6edf3]">${guessNum}</strong> är för högt! Gissa ett <strong>lägre</strong> tal. (Försök #${state.attempts})</span></div>`
      : `<div class="text-[#f59e0b] text-xs font-mono flex items-center gap-2"><span>⬇️</span> <span><strong class="text-[#e6edf3]">${guessNum}</strong> is too high! Try a <strong>lower</strong> number. (Attempt #${state.attempts})</span></div>`;
  }
}

function startNewGame() {
  state.isActive = true;
  state.target = Math.floor(Math.random() * 100) + 1;
  state.attempts = 0;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
