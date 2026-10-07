/**
 * src/data/schedule.ts
 * ============================================================================
 * Chalmers Exam, Finals & Athletic Planning Schedule
 * ----------------------------------------------------------------------------
 * Definiera datumintervall för tentaveckor, omtentaperioder, läger och sprintar.
 * När dagens datum matchar ett intervall slår terminalstatusen automatiskt om!
 *
 * Define date ranges for exam periods, finals, training camps and study blocks.
 * When the current date matches a range, terminal status auto-adapts!
 * ============================================================================
 */

export interface ScheduleEvent {
  id: string;
  name: {
    sv: string;
    en: string;
  };
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  statusPreset: 'exam' | 'camp' | 'hackathon' | 'vacation' | 'regular';
  description: {
    sv: string;
    en: string;
  };
  badge: {
    sv: string;
    en: string;
  };
}

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: 'lp1-tentor-2026',
    name: {
      sv: 'Tentavecka Läsperiod 1 (Chalmers)',
      en: 'Study Period 1 Finals / Exam Week (Chalmers)',
    },
    startDate: '2026-10-19',
    endDate: '2026-10-24',
    statusPreset: 'exam',
    description: {
      sv: 'Tentor i Operativsystem & Datakommunikation. Högt fokus, begränsad svarstid.',
      en: 'Final exams in Operating Systems & Data Communications. Deep focus, reduced availability.',
    },
    badge: {
      sv: 'TENTAVECKA LP1',
      en: 'EXAM WEEK SP1',
    },
  },
  {
    id: 'autumn-camp-2026',
    name: {
      sv: 'Höstläger Simning (Valhallabadet)',
      en: 'Autumn Swim Training Camp (Valhallabadet)',
    },
    startDate: '2026-11-02',
    endDate: '2026-11-06',
    statusPreset: 'camp',
    description: {
      sv: 'Dubbelpass i 50m-bassäng, laktattester och teknikslipning.',
      en: 'Double sessions in 50m pool, lactate threshold testing, stroke refinement.',
    },
    badge: {
      sv: 'SIMLÄGER 50M',
      en: 'SWIM CAMP 50M',
    },
  },
  {
    id: 'lp2-tentor-2026',
    name: {
      sv: 'Tentavecka Läsperiod 2 (Chalmers)',
      en: 'Study Period 2 Finals / Exam Week (Chalmers)',
    },
    startDate: '2026-12-14',
    endDate: '2026-12-19',
    statusPreset: 'exam',
    description: {
      sv: 'Tentor i Distribuerade System & Algoritmer. Serverunderhåll på paus.',
      en: 'Finals in Distributed Systems & Algorithms. Server maintenance on hold.',
    },
    badge: {
      sv: 'TENTAVECKA LP2',
      en: 'EXAM WEEK SP2',
    },
  },
  {
    id: 'winter-break-2026',
    name: {
      sv: 'Vinterledighet & Homelab Hackathon',
      en: 'Winter Break & Homelab Sprint',
    },
    startDate: '2026-12-21',
    endDate: '2027-01-08',
    statusPreset: 'hackathon',
    description: {
      sv: 'Ledighet från kurser. Migrerar Minecraft-klustret till ny kernel & bygger dotfiles.',
      en: 'Break from classes. Migrating Minecraft cluster to new kernel & refactoring dotfiles.',
    },
    badge: {
      sv: 'HOMELAB SPRINT',
      en: 'HOMELAB SPRINT',
    },
  },
  {
    id: 'omtentavecka-2027',
    name: {
      sv: 'Omtentavecka Chalmers',
      en: 'Re-exam Week Chalmers',
    },
    startDate: '2027-01-04',
    endDate: '2027-01-09',
    statusPreset: 'exam',
    description: {
      sv: 'Omtentor och laborationsuppsamling.',
      en: 'Re-exams and laboratory completion week.',
    },
    badge: {
      sv: 'OMTENTAVECKA',
      en: 'RE-EXAMS',
    },
  },
];

/**
 * Return currently active schedule event if today falls within startDate <= today <= endDate.
 */
export function getCurrentEvent(targetDate: Date = new Date()): ScheduleEvent | null {
  const isoDate = targetDate.toISOString().slice(0, 10);
  for (const event of scheduleEvents) {
    if (isoDate >= event.startDate && isoDate <= event.endDate) {
      return event;
    }
  }
  return null;
}

/**
 * Return upcoming events that have not ended yet.
 */
export function getUpcomingEvents(limit: number = 4, targetDate: Date = new Date()): ScheduleEvent[] {
  const isoDate = targetDate.toISOString().slice(0, 10);
  return scheduleEvents
    .filter((event) => event.endDate >= isoDate)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
}
