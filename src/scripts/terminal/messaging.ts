import { getSupabase } from '../../db/supabase';
import { getTerminalContext } from './telemetry';

let lastMessageTimestamp = 0;
const MESSAGE_COOLDOWN_MS = 4000; // 4 second anti-spam cooldown

let pendingConversationalMessage: string | null = null;

export function getPendingMessage(): string | null {
  return pendingConversationalMessage;
}

export function setPendingMessage(msg: string | null): void {
  pendingConversationalMessage = msg;
}

export interface SendMessageResult {
  success: boolean;
  status: 'sent' | 'cooldown' | 'too_long' | 'empty' | 'offline_mock' | 'error';
  feedback: string;
}

/**
 * Sends a visitor message to the Supabase terminal_messages table.
 * Enforces anti-spam cooldown, character limits, and bilingual feedback.
 */
export async function sendTerminalMessage(
  rawText: string,
  lang: 'sv' | 'en' = 'sv'
): Promise<SendMessageResult> {
  const isSv = lang === 'sv';
  const cleanMsg = (rawText || '').trim();

  if (!cleanMsg) {
    return {
      success: false,
      status: 'empty',
      feedback: isSv
        ? 'Meddelandet kan inte vara tomt. Skriv: <code class="text-[#10b981]">msg &lt;ditt meddelande&gt;</code>'
        : 'Message cannot be empty. Type: <code class="text-[#10b981]">msg &lt;your message&gt;</code>'
    };
  }

  if (cleanMsg.length > 1500) {
    return {
      success: false,
      status: 'too_long',
      feedback: isSv
        ? `Meddelandet är för långt (${cleanMsg.length}/1500 tecken). Korta gärna ner det lite!`
        : `Message is too long (${cleanMsg.length}/1500 chars). Please shorten it a bit!`
    };
  }

  // Rate limit check
  const now = Date.now();
  if (now - lastMessageTimestamp < MESSAGE_COOLDOWN_MS) {
    const remainingSec = Math.ceil((MESSAGE_COOLDOWN_MS - (now - lastMessageTimestamp)) / 1000);
    return {
      success: false,
      status: 'cooldown',
      feedback: isSv
        ? `Vänta ${remainingSec}s innan du skickar ett nytt meddelande (anti-spam skydd).`
        : `Please wait ${remainingSec}s before sending another message (anti-spam cooldown).`
    };
  }

  const client = getSupabase();
  const ctx = getTerminalContext();

  if (!client) {
    // Graceful offline preview mode
    lastMessageTimestamp = now;
    return {
      success: true,
      status: 'offline_mock',
      feedback: isSv
        ? '[✓ LOKALT SPARAT] (Supabase-nycklar ej satta - meddelandet sparades lokalt)'
        : '[✓ LOCALLY SAVED] (Supabase keys not configured - message saved locally)'
    };
  }

  try {
    const { error } = await client.from('terminal_messages').insert({
      message: cleanMsg,
      page: ctx.page,
      background: ctx.background,
      lang: lang,
      session_id: ctx.sessionId
    });

    if (error) {
      console.warn('[Terminal Messaging] Insert error:', error);
      return {
        success: false,
        status: 'error',
        feedback: isSv
          ? 'Kunde inte skicka meddelandet just nu. Försök gärna igen senare eller maila gurra@gulo.se!'
          : 'Could not send message right now. Please try again later or email gurra@gulo.se!'
      };
    }

    lastMessageTimestamp = now;
    setPendingMessage(null);

    return {
      success: true,
      status: 'sent',
      feedback: isSv
        ? `<div class="text-[#10b981] font-mono leading-relaxed">
            <span class="font-bold">[✓ LEVERERAT]</span> Tack! Ditt meddelande har sparats i Gustavs inkorg 📬
           </div>`
        : `<div class="text-[#10b981] font-mono leading-relaxed">
            <span class="font-bold">[✓ DELIVERED]</span> Thanks! Your message was saved to Gustav's inbox 📬
           </div>`
    };
  } catch (err) {
    return {
      success: false,
      status: 'error',
      feedback: isSv
        ? 'Ett nätverksfel uppstod vid sändning. Kontrollera anslutningen.'
        : 'A network error occurred while sending. Please check your connection.'
    };
  }
}

/**
 * Heuristics to detect whether a visitor input is a natural conversational message
 * (e.g. "hej - cool website", "snygg hemsida", "hello i really like this")
 * rather than a bash command or typo.
 */
export function detectConversationalIntent(rawInput: string): { isConversational: boolean; extractedMessage: string } | null {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/\s+/);
  const firstWord = parts[0].toLowerCase().replace(/[^a-zåäö]/g, '');

  const greetingWords = ['hej', 'hello', 'hi', 'hey', 'hejsan', 'halloj', 'tjena', 'yo', 'hallå', 'sup'];

  // Case 1: Greeting + more text (e.g. "hej - cool website", "hello awesome portfolio")
  if (greetingWords.includes(firstWord) && parts.length > 1) {
    // Strip leading dashes or punctuation from message payload
    let rest = parts.slice(1).join(' ').trim();
    if (rest.startsWith('-') || rest.startsWith(':')) {
      rest = rest.replace(/^[-:\s]+/, '').trim();
    }
    const message = rest || trimmed;
    if (message.length >= 3) {
      return { isConversational: true, extractedMessage: message };
    }
  }

  // Case 2: Multi-word phrase with conversational sentiment or keywords
  const conversationalTriggers = [
    'snygg', 'grym', 'cool', 'nice', 'awesome', 'great', 'häftig', 'fin', 'tack', 'thanks', 'love',
    'vem är', 'who are', 'whois', 'kontakt', 'contact', 'gillar', 'like'
  ];

  const lower = trimmed.toLowerCase();
  const hasTrigger = conversationalTriggers.some(t => lower.includes(t));

  if (parts.length >= 2 && (hasTrigger || /[!?]/.test(trimmed))) {
    return { isConversational: true, extractedMessage: trimmed };
  }

  return null;
}
