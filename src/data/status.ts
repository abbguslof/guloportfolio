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

export type PresetKey = 'regular' | 'exam' | 'camp' | 'hackathon' | 'vacation' | 'swim';

export const statusPresets: Record<PresetKey, StatusProfile> = {
  regular: {
    name: 'Regular Semester / Normal läsperiod',
    badge: {
      sv: 'Läsperiod & Simning',
      en: 'Semester & Swimming',
    },
    activity: {
      sv: 'Civilingenjör Datateknik på Chalmers, årskurs två. RIU-idrottare godkänd av Svenska Simförbundet. Fem simpass och tre gympass de flesta veckor.',
      en: 'Computer Science and Engineering at Chalmers, year two. RIU athlete approved by the Swedish Swimming Federation. Five swim sessions and three gym sessions most weeks.',
    },
    focus: {
      sv: 'System, nätverkssäkerhet, Linux och sprintsimning.',
      en: 'Systems, network security, Linux, and sprint swimming.',
    },
    mood: {
      sv: 'Kaffe, Neovim-keybindings, och Proxmox-arkitektur.',
      en: 'Coffee, Neovim keybindings, and Proxmox architecture.',
    },
    homelab: {
      sv: 'Proxmox-server, Raspberry Pi-enheter och självhostade tjänster.',
      en: 'Proxmox server, Raspberry Pi cluster, and self-hosted services.',
    },
    availability: {
      sv: 'Öppen för sommarjobb 2027, praktik och examensarbete.',
      en: 'Open to summer 2027 internships, thesis work, and technical projects.',
    },
  },

  exam: {
    name: 'Exam Week / Tentavecka',
    badge: {
      sv: 'Tentor Tentamensperiod & Plugg',
      en: 'Finals Finals Week & Deep Focus',
    },
    activity: {
      sv: 'Tentamensperiod på Chalmers! Repeterar teorifrågor, algoritmer och datateknik.',
      en: 'Final exams period at Chalmers! Reviewing systems theory, algorithms, and computing fundamentals.',
    },
    focus: {
      sv: 'Tentaplugg och problemlösning. Svarstider kan vara något fördröjda.',
      en: 'Exam preparation and problem solving. Response times may be slightly delayed.',
    },
    mood: {
      sv: 'Svart kaffe, whiteboard-pennor och öronproppar.',
      en: 'Black coffee, whiteboard markers, and earplugs.',
    },
    homelab: {
      sv: 'Serverarkitektur i underhållsläge / automatisk backup aktiv.',
      en: 'Server architecture in maintenance mode / automated backups active.',
    },
    availability: {
      sv: 'Begränsad tillgänglighet fram till tentaperiodens slut.',
      en: 'Limited availability until the exam period concludes.',
    },
  },

  camp: {
    name: 'Swim Training Camp / Träningsläger',
    badge: {
      sv: 'Träningsläger',
      en: 'Training Camp',
    },
    activity: {
      sv: 'Intensivt elitträningsläger med Growth Objective (GO). Dubbla simpass och sprintoptimering.',
      en: 'Intensive elite training camp with Growth Objective (GO). Double swim sessions & sprint mechanics.',
    },
    focus: {
      sv: '50m/100m frisim och fjäril, starteknik, laktattester och återhämtning.',
      en: '50m/100m freestyle and butterfly, start mechanics, and athletic recovery.',
    },
    mood: {
      sv: 'Klorlukt, havregrynsgröt och tidiga morgonpass.',
      en: 'Chlorine scent, oatmeal bowls, and early morning practices.',
    },
    homelab: {
      sv: 'Homelab körs autonomt med övervakning över WireGuard.',
      en: 'Homelab running autonomously with WireGuard monitoring.',
    },
    availability: {
      sv: 'Nås säkrast på kvällstid efter dagens träningspass.',
      en: 'Best reached in evenings after training sessions.',
    },
  },

  swim: {
    name: 'National Championships / Svenska Mästerskapen',
    badge: {
      sv: 'Svenska mästerskapen',
      en: 'Swedish Championships',
    },
    activity: {
      sv: 'Tävlar på SM för Mölndals Allmänna Simsällskap (MASS) & Growth Objective (GO).',
      en: 'Competing at the Swedish National Championships for MASS & Growth Objective (GO).',
    },
    focus: {
      sv: 'Individuell sprint (50m/100m fri och fjäril) och lagkapper för MASS.',
      en: 'Individual sprint events (50m/100m free & fly) and relays for MASS.',
    },
    mood: {
      sv: '⚡ Full tävlingsfokus, snabba lopp och laganda.',
      en: '⚡ Full race focus, sprint speed, and team spirit.',
    },
    homelab: {
      sv: 'Servrar och driftsatta tjänster rullar stabilt i bakgrunden.',
      en: 'Servers and deployed services humming stably in the background.',
    },
    availability: {
      sv: 'Fokus på tävlingspassen. Svarar på mejl mellan tävlingspassen.',
      en: 'Focused on race sessions. Checking email between prelims and finals.',
    },
  },

  hackathon: {
    name: 'Homelab Sprint / Hackathon',
    badge: {
      sv: '[⚡ SPRINT] Homelab & Kod-sprint',
      en: '[⚡ SPRINT] Homelab & Code Sprint',
    },
    activity: {
      sv: 'Heltidsfokus på personliga infrastrukturprojekt, Linux, Proxmox och självhostade tjänster.',
      en: 'Dedicated hacking sprint on homelab infra, Linux, Proxmox & self-hosted services.',
    },
    focus: {
      sv: 'Nätverkssäkerhet, Proxmox VM-arkitektur & utvecklingsverktyg.',
      en: 'Network security, Proxmox VM architecture & developer tooling.',
    },
    mood: {
      sv: '💻 Lo-fi beats, Alacritty-fönster och git commit.',
      en: '💻 Lo-fi beats, Alacritty terminal windows, and git commits.',
    },
    homelab: {
      sv: 'Nya containrar och tjänster driftsätts på Proxmox-klustret.',
      en: 'Deploying new containers and services on the Proxmox cluster.',
    },
    availability: {
      sv: 'Aktiv på GitHub!',
      en: 'Active on GitHub!',
    },
  },

  vacation: {
    name: 'Vacation / Ledighet',
    badge: {
      sv: '[🏖 LEDIG] Vinter- eller sommarledighet',
      en: '[🏖 OFF-GRID] Vacation / Off-season',
    },
    activity: {
      sv: 'Friluftsliv, klättring, vandring, cykling eller foto/video med Sony ZV-E10.',
      en: 'Outdoors, climbing, hiking, cycling, or video/photo with Sony ZV-E10.',
    },
    focus: {
      sv: 'Nedvarvning, rörelse i naturen och återhämtning.',
      en: 'Decompressing, outdoor activities, and recharging.',
    },
    mood: {
      sv: '🌲 Frisk luft, natur och offline-läge.',
      en: '🌲 Fresh air, nature, and offline mode.',
    },
    homelab: {
      sv: 'Homelab körs i lågenergiläge med automatiska larm.',
      en: 'Homelab running low-power baseline with automatic alerts.',
    },
    availability: {
      sv: 'Svarar sporadiskt på e-post (gurra@gulo.se).',
      en: 'Checking emails intermittently (gurra@gulo.se).',
    },
  },
};

/**
 * Configure your preferred status mode:
 * - 'auto' : Dynamically checks src/data/schedule.ts for matching dates (exams, camps).
 *            Falls back to 'regular' if no event is currently active.
 * - 'regular' | 'exam' | 'camp' | 'hackathon' | 'vacation' | 'swim' : Manually locks to this preset.
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
      sv: 'Göteborg, Sverige',
      en: 'Gothenburg, Sweden',
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
    lastUpdated: '2026-11-15',
  };
}

// Fallback constant for backwards compatibility
export const currentStatus = getActiveStatus();
