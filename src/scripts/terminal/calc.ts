// src/scripts/terminal/calc.ts - Safe Expression Evaluator & Math Engine
import type { LangCode } from './types';

const SUPERSCRIPT_MAP: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9'
};

function normalizeSuperscripts(str: string): string {
  return str.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (match) => {
    const normalDigits = match.split('').map(ch => SUPERSCRIPT_MAP[ch] || ch).join('');
    return `^${normalDigits}`;
  });
}

/**
 * Safely evaluates mathematical expressions without eval() or Function()
 */
export function evaluateMathExpression(expr: string, lang: LangCode): string {
  if (!expr || !expr.trim()) {
    return lang === 'sv'
      ? `<div class="text-[#f59e0b] text-xs font-mono">Användning: <code class="text-[#10b981]">calc &lt;uttryck&gt;</code> (t.ex. <code class="text-[#38bdf8]">calc 2²</code>, <code class="text-[#38bdf8]">calc 2**2</code>, <code class="text-[#38bdf8]">calc 2^8</code> eller <code class="text-[#38bdf8]">calc sqrt(256) + 10</code>)</div>`
      : `<div class="text-[#f59e0b] text-xs font-mono">Usage: <code class="text-[#10b981]">calc &lt;expression&gt;</code> (e.g. <code class="text-[#38bdf8]">calc 2²</code>, <code class="text-[#38bdf8]">calc 2**2</code>, <code class="text-[#38bdf8]">calc 2^8</code> or <code class="text-[#38bdf8]">calc sqrt(256) + 10</code>)</div>`;
  }

  const cleanExpr = expr.trim();

  try {
    const result = parseExpression(cleanExpr);
    if (typeof result !== 'number' || isNaN(result)) {
      throw new Error('NaN result');
    }

    const formattedResult = Number.isInteger(result)
      ? result.toLocaleString(lang === 'sv' ? 'sv-SE' : 'en-US')
      : parseFloat(result.toFixed(6)).toLocaleString(lang === 'sv' ? 'sv-SE' : 'en-US');

    return `
<div class="text-xs font-mono space-y-1 p-2 rounded bg-[#0d1117] border border-[#30363d]/80 inline-block min-w-[240px]">
  <div class="text-[#8b949e] flex items-center justify-between gap-4">
    <span>expr: <code class="text-[#38bdf8]">${escapeHtml(cleanExpr)}</code></span>
    <span class="text-[10px] text-[#10b981] font-bold">CALC</span>
  </div>
  <div class="text-sm font-bold text-[#10b981] flex items-center gap-2 pt-0.5 border-t border-[#30363d]/50">
    <span>=</span>
    <span class="text-[#e6edf3]">${formattedResult}</span>
  </div>
</div>`;
  } catch (err: any) {
    const errorMsg = lang === 'sv'
      ? `Matematiskt beräkningsfel: ogiltigt uttryck "${escapeHtml(cleanExpr)}"`
      : `Math evaluation error: invalid expression "${escapeHtml(cleanExpr)}"`;
    return `<div class="text-[#f85149] text-xs font-mono">${errorMsg}</div>`;
  }
}

// Tokenizer & Recursive Descent Parser for safe arithmetic
type TokenType = 'NUMBER' | 'OP' | 'LPAREN' | 'RPAREN' | 'IDENT' | 'COMMA';

interface Token {
  type: TokenType;
  value: string;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(input[i + 1] || ''))) {
      let numStr = ch;
      i++;
      while (i < input.length && /[0-9.]/.test(input[i])) {
        numStr += input[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let ident = ch;
      i++;
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) {
        ident += input[i];
        i++;
      }
      tokens.push({ type: 'IDENT', value: ident.toLowerCase() });
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (ch === ',') {
      tokens.push({ type: 'COMMA', value: ',' });
      i++;
      continue;
    }

    if ('+-*/%^'.includes(ch)) {
      // Detect ** (double-star exponent) and emit as ^ for uniform parsing
      if (ch === '*' && input[i + 1] === '*') {
        tokens.push({ type: 'OP', value: '^' });
        i += 2;
        continue;
      }
      tokens.push({ type: 'OP', value: ch });
      i++;
      continue;
    }

    throw new Error(`Unexpected character: ${ch}`);
  }

  return tokens;
}

function parseExpression(input: string): number {
  const tokens = tokenize(normalizeSuperscripts(input));
  let pos = 0;

  function peek(): Token | undefined {
    return tokens[pos];
  }

  function consume(): Token {
    return tokens[pos++];
  }

  function parseAddSub(): number {
    let left = parseMulDiv();

    while (peek() && peek()!.type === 'OP' && (peek()!.value === '+' || peek()!.value === '-')) {
      const op = consume().value;
      const right = parseMulDiv();
      if (op === '+') left += right;
      else left -= right;
    }
    return left;
  }

  function parseMulDiv(): number {
    let left = parsePower();

    while (peek() && peek()!.type === 'OP' && (peek()!.value === '*' || peek()!.value === '/' || peek()!.value === '%')) {
      const op = consume().value;
      const right = parsePower();
      if (op === '*') left *= right;
      else if (op === '/') {
        if (right === 0) throw new Error('Division by zero');
        left /= right;
      } else if (op === '%') {
        left %= right;
      }
    }
    return left;
  }

  function parsePower(): number {
    let left = parseUnary();

    while (peek() && peek()!.type === 'OP' && peek()!.value === '^') {
      consume();
      const right = parseUnary();
      left = Math.pow(left, right);
    }
    return left;
  }

  function parseUnary(): number {
    if (peek() && peek()!.type === 'OP' && (peek()!.value === '+' || peek()!.value === '-')) {
      const op = consume().value;
      const val = parseUnary();
      return op === '-' ? -val : val;
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    const t = peek();
    if (!t) throw new Error('Unexpected end of expression');

    if (t.type === 'NUMBER') {
      consume();
      const val = parseFloat(t.value);
      if (isNaN(val)) throw new Error(`Invalid number: ${t.value}`);
      return val;
    }

    if (t.type === 'IDENT') {
      const name = consume().value;
      if (name === 'pi') return Math.PI;
      if (name === 'e') return Math.E;

      if (peek() && peek()!.type === 'LPAREN') {
        consume(); // consume '('
        const args: number[] = [];
        if (peek() && peek()!.type !== 'RPAREN') {
          args.push(parseAddSub());
          while (peek() && peek()!.type === 'COMMA') {
            consume();
            args.push(parseAddSub());
          }
        }
        if (!peek() || peek()!.type !== 'RPAREN') {
          throw new Error(`Missing closing parenthesis for function ${name}`);
        }
        consume(); // consume ')'

        switch (name) {
          case 'sqrt': return Math.sqrt(args[0]);
          case 'abs': return Math.abs(args[0]);
          case 'round': return Math.round(args[0]);
          case 'floor': return Math.floor(args[0]);
          case 'ceil': return Math.ceil(args[0]);
          case 'sin': return Math.sin(args[0]);
          case 'cos': return Math.cos(args[0]);
          case 'tan': return Math.tan(args[0]);
          case 'log': return Math.log10(args[0]);
          case 'ln': return Math.log(args[0]);
          case 'min': return Math.min(...args);
          case 'max': return Math.max(...args);
          default:
            throw new Error(`Unknown function: ${name}`);
        }
      }

      throw new Error(`Unknown variable: ${name}`);
    }

    if (t.type === 'LPAREN') {
      consume();
      const val = parseAddSub();
      if (!peek() || peek()!.type !== 'RPAREN') {
        throw new Error('Unbalanced parenthesis: expected )');
      }
      consume();
      return val;
    }

    throw new Error(`Unexpected token: ${t.value}`);
  }

  const result = parseAddSub();
  if (pos < tokens.length) {
    throw new Error(`Unexpected trailing token: ${tokens[pos].value}`);
  }
  return result;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
