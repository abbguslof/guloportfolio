/**
 * src/data/status.ts
 * ============================================================================
 * Gulo Dynamic Status & Presets Configuration
 * ----------------------------------------------------------------------------
 * Välj en aktiv profil manuellt eller låt 'auto' styra baserat på kalendern
 * i src/data/schedule.ts (tentaveckor, träningsläger osv.)!
 *
 * Choose an active profile manually or set to 'auto' to adapt dynamically
 * based on the exam & event calendar in src/data/schedule.ts!
 * ============================================================================
 */

import { getCurrentEvent, type ScheduleEvent } from './schedule';

export interface StatusProfile {
  name: string;
  badge: {
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
}

export type PresetKey = 'regular' | 'exam' | 'camp' | 'hackathon' | 'vacation';

export const statusPresets: Record<PresetKey, StatusProfile> = {
  regular: {
    name: 'Regular Semester / Normal läsperiod',
    badge: {
      sv: '[● ONLINE] Läsperiod & Simning',
      en: '[● ONLINE] Semester & Swimming',
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
  },

  exam: {
    name: 'Exam Week / Tentavecka',
    badge: {
      sv: '[⚠ TENTOR] Tentavecka & Intensivplugg',
      en: '[⚠ FINALS] Finals Week & Deep Focus',
    },
    activity: {
      sv: 'Tentavecka på Chalmers! Repeterar teorifrågor, minneshantering och bevis.',
      en: 'Exam week at Chalmers! Reviewing systems theory, memory safety and proofs.',
    },
    focus: {
      sv: 'Tentaplugg & problemlösning. Svarstider kan vara något fördröjda.',
      en: 'Exam preparation & problem solving. Response times may be slightly delayed.',
    },
    mood: {
      sv: '📚 Svart kaffe, whiteboard-pennor och öronproppar.',
      en: '📚 Black coffee, whiteboard markers, and earplugs.',
    },
    homelab: {
      sv: '🟡 Serverkluster i underhållsläge / auto-backup aktivt utan manuella ändringar.',
      en: '🟡 Server cluster in maintenance mode / automated backups active.',
    },
    availability: {
      sv: 'Begränsad tillgänglighet fram till tentaperiodens slut.',
      en: 'Limited availability until the exam period concludes.',
    },
  },

  camp: {
    name: 'Swim Training Camp / Träningsläger',
    badge: {
      sv: '[🏊 SIMLÄGER] Träningsläger 50m',
      en: '[🏊 SWIM CAMP] 50m Training Camp',
    },
    activity: {
      sv: 'Intensivt träningsläger i 50m-bassäng (Valhallabadet). Dubbelpass varje dag.',
      en: 'Intensive 50m swimming camp at Valhallabadet. Double sessions daily.',
    },
    focus: {
      sv: 'Fjärilsim, frisimstempo och återhämtning.',
      en: 'Butterfly stroke, freestyle pacing, and athletic recovery.',
    },
    mood: {
      sv: '🏊 Klorlukt, havregrynsgröt och tidiga morgnar.',
      en: '🏊 Chlorine scent, oatmeal bowls, and early morning starts.',
    },
    homelab: {
      sv: '🟢 Autonoma monitorer aktiva via WireGuard.',
      en: '🟢 Automated alerts active over WireGuard tunnel.',
    },
    availability: {
      sv: 'Nås säkrast efter kl 19 eller tidiga eftermiddagar.',
      en: 'Best reached in evenings after 19:00 or early afternoons.',
    },
  },

  hackathon: {
    name: 'Homelab Sprint / Hackathon',
    badge: {
      sv: '[⚡ SPRINT] Homelab & Kod-sprint',
      en: '[⚡ SPRINT] Homelab & Code Sprint',
    },
    activity: {
      sv: 'Heltidsfokus på personliga infrastrukturprojekt, Linux kernel & Neovim-plugins.',
      en: 'Dedicated hacking sprint on homelab infra, Linux kernel & Neovim plugins.',
    },
    focus: {
      sv: 'Docker swarm migration, WireGuard routing & prestandamätningar.',
      en: 'Docker swarm migration, WireGuard routing & benchmarking.',
    },
    mood: {
      sv: '💻 Lo-fi beats, tmux sessions och git rebase.',
      en: '💻 Lo-fi beats, multi-pane tmux sessions, and interactive git rebase.',
    },
    homelab: {
      sv: '🚀 Nya microservices rullas ut och testas under hög belastning.',
      en: '🚀 Deploying new microservices and load testing server nodes.',
    },
    availability: {
      sv: 'Mycket aktiv på GitHub & Discord!',
      en: 'Very active on GitHub & Discord!',
    },
  },

  vacation: {
    name: 'Vacation / Ledighet',
    badge: {
      sv: '[🏖 LEDIG] Sommar- eller vinterledighet',
      en: '[🏖 OFF-GRID] Vacation / Off-season',
    },
    activity: {
      sv: 'Ute i skärgården, fotar 35mm film eller läser skönlitteratur.',
      en: 'Exploring the archipelago, shooting 35mm film, or reading.',
    },
    focus: {
      sv: 'Nedvarvning och återhämtning.',
      en: 'Decompressing and offline recharging.',
    },
    mood: {
      sv: '🌲 Skogsdoft, analog kamera och flygplansläge.',
      en: '🌲 Forest breeze, mechanical film camera, and airplane mode.',
    },
    homelab: {
      sv: '🟢 Homelab körs i lågenergiläge med automatiska larm.',
      en: '🟢 Homelab running low-power baseline with automatic alerts.',
    },
    availability: {
      sv: 'Svarar sporadiskt på e-post.',
      en: 'Checking emails intermittently.',
    },
  },
};

/**
 * Configure your preferred status mode:
 * - 'auto' : Dynamically checks src/data/schedule.ts for matching dates (exams, camps).
 *            Falls back to 'regular' if no event is currently active.
 * - 'regular' | 'exam' | 'camp' | 'hackathon' | 'vacation' : Manually locks to this preset.
 */
export const activePresetMode: 'auto' | PresetKey = 'auto';

export interface ActiveStatusResult {
  user: string;
  host: string;
  location: { sv: string; en: string };
  activity: { sv: string; en: string };
  focus: { sv: string; en: string };
  mood: { sv: string; en: string };
  homelab: { sv: string; en: string };
  availability: { sv: string; en: string };
  badge: { sv: string; en: string };
  mode: string;
  isAutoScheduled: boolean;
  activeEvent: ScheduleEvent | null;
  lastUpdated: string;
}

export function getActiveStatus(targetDate: Date = new Date()): ActiveStatusResult {
  const currentEvent = activePresetMode === 'auto' ? getCurrentEvent(targetDate) : null;
  const presetKey: PresetKey = currentEvent ? currentEvent.statusPreset : (activePresetMode === 'auto' ? 'regular' : activePresetMode);
  const profile = statusPresets[presetKey] || statusPresets.regular;

  return {
    user: 'gulo',
    host: 'chalmers-station',
    location: {
      sv: 'Göteborg // Chalmers Johanneberg & Valhallabadet',
      en: 'Gothenburg, Sweden // Chalmers Johanneberg & Valhallabadet',
    },
    activity: currentEvent ? currentEvent.description : profile.activity,
    focus: profile.focus,
    mood: profile.mood,
    homelab: profile.homelab,
    availability: profile.availability,
    badge: currentEvent ? currentEvent.badge : profile.badge,
    mode: presetKey,
    isAutoScheduled: !!currentEvent,
    activeEvent: currentEvent,
    lastUpdated: '2026-10-06',
  };
}

// Fallback constant for backwards compatibility
export const currentStatus = getActiveStatus();
