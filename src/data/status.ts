/**
 * src/data/status.ts
 * ============================================================================
 * Gulo Status Configuration
 * ----------------------------------------------------------------------------
 * Redigera denna fil när du vill uppdatera vad kommandot 'status' visar i
 * terminalen! Ändringarna syns direkt.
 * 
 * Edit this file anytime you want to update what the 'status' command prints
 * in the terminal!
 * ============================================================================
 */

export interface StatusConfig {
  user: string;
  host: string;
  location: {
    sv: string;
    en: string;
  };
  activity: {
    sv: string;
    en: string;
  };
  focus: {
    sv: string;
    en: string;
  };
  mood: {
    sv: string;
    en: string;
  };
  homelab: {
    sv: string;
    en: string;
  };
  availability: {
    sv: string;
    en: string;
  };
  lastUpdated: string;
}

export const currentStatus: StatusConfig = {
  user: 'gulo',
  host: 'chalmers-station',
  location: {
    sv: 'Göteborg // Chalmers Johanneberg & Valhallabadet',
    en: 'Gothenburg, Sweden // Chalmers Johanneberg & Valhallabadet',
  },
  activity: {
    sv: 'Civilingenjör Datateknik (åk 2) på Chalmers. Tränar 5-6 simpass i veckan.',
    en: 'M.Sc. Computer Science & Engineering (Year 2) at Chalmers. Swimming 5-6 sessions/week.',
  },
  focus: {
    sv: 'Operativsystem, distribuerade system, C/Rust & optimering.',
    en: 'Operating systems, distributed systems, C/Rust & low-level optimization.',
  },
  mood: {
    sv: '☕ Kaffe, Vim-keybindings, och rena shell-skript.',
    en: '☕ Coffee, Vim keybindings, and lean shell scripts.',
  },
  homelab: {
    sv: '🟢 Minecraft PaperMC 1.20 SMP server online (Debian 12 + Docker + WireGuard).',
    en: '🟢 Minecraft PaperMC 1.20 SMP cluster online (Debian 12 + Docker + WireGuard).',
  },
  availability: {
    sv: 'Öppen för sommarjobb, intressanta systemprojekt & hackathons.',
    en: 'Open for summer internships, interesting systems projects & hackathons.',
  },
  lastUpdated: '2026-10-05',
};
