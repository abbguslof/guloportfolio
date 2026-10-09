import { getSupabase } from '../../db/supabase';

export interface TelemetryPayload {
  command: string;
  rawInput?: string;
  status: 'success' | 'not_found' | 'message_sent' | 'cancelled';
  lang?: string;
}

interface QueuedTelemetryEvent {
  session_id: string;
  command: string;
  raw_input: string;
  status: string;
  page: string;
  background: string;
  lang: string;
}

let queue: QueuedTelemetryEvent[] = [];
let flushTimer: number | null = null;
let isFlushing = false;

/**
 * Returns an ephemeral session ID stored strictly in sessionStorage.
 * Disappears completely when the browser tab closes. No cookies used!
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let sid = sessionStorage.getItem('terminal_session_id');
    if (!sid) {
      sid = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
      sessionStorage.setItem('terminal_session_id', sid);
    }
    return sid;
  } catch {
    return 'ephemeral_fallback';
  }
}

/**
 * Retrieves non-invasive environmental context (current route, active ambient background)
 */
export function getTerminalContext() {
  const page = typeof window !== 'undefined' ? window.location.pathname : '/';
  let background = 'standard';
  try {
    if (typeof localStorage !== 'undefined') {
      background = localStorage.getItem('site_bg_mode') || 'standard';
    }
  } catch {}
  return { page, background, sessionId: getSessionId() };
}

/**
 * Flushes the in-memory telemetry queue to Supabase in a single batch request
 */
async function flushQueue() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  if (queue.length === 0 || isFlushing) return;

  const itemsToSend = [...queue];
  queue = [];
  isFlushing = true;

  try {
    const client = getSupabase();
    if (!client) return;

    await client.from('terminal_stats').insert(itemsToSend);
  } catch (err) {
    // Non-blocking: Silently handle network drops or adblockers
  } finally {
    isFlushing = false;
  }
}

/**
 * Non-blocking telemetry hook with smart micro-batching.
 * Buffers rapid commands (e.g. fast CLI typing) and dispatches in 2s batches.
 */
export function logTerminalEvent(payload: TelemetryPayload): void {
  if (typeof window === 'undefined') return;

  const ctx = getTerminalContext();
  const cleanCmd = (payload.command || '').trim().slice(0, 64);
  const cleanInput = (payload.rawInput || payload.command || '').trim().slice(0, 500);

  if (!cleanCmd) return;

  const event: QueuedTelemetryEvent = {
    session_id: ctx.sessionId,
    command: cleanCmd,
    raw_input: cleanInput,
    status: payload.status,
    page: ctx.page,
    background: ctx.background,
    lang: payload.lang || 'sv',
  };

  // Prevent memory bloat from rogue loops
  if (queue.length < 30) {
    queue.push(event);
  }

  // Flush immediately if buffer reaches 5 items, otherwise wait 2000ms
  if (queue.length >= 5) {
    flushQueue();
  } else if (!flushTimer) {
    flushTimer = window.setTimeout(flushQueue, 2000);
  }
}

// Flush queue before page navigation / tab close
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushQueue();
    }
  });
  window.addEventListener('beforeunload', () => {
    flushQueue();
  });
}
