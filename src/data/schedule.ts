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
  statusPreset: 'exam' | 'camp' | 'hackathon' | 'vacation' | 'regular' | 'swim';
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
    id: 'training-camp-2026',
    name: {
      sv: 'Träningsläger (Growth Objective)',
      en: 'Swim Training Camp (Growth Objective)',
    },
    startDate: '2026-10-14',
    endDate: '2026-10-23',
    statusPreset: 'camp',
    description: {
      sv: 'Intensivt träningsläger med Growth Objective. Dubbelpass, fysträning & sprintoptimering.',
      en: 'Intensive training camp with Growth Objective. Double swim sessions, dryland & sprint mechanics.',
    },
    badge: {
      sv: 'TRÄNINGSLÄGER',
      en: 'TRAINING CAMP',
    },
  },
  {
    id: 'lp1-tentor-2026',
    name: {
      sv: 'Tentamensperiod 1 (Chalmers)',
      en: 'Exam Period 1 / Finals (Chalmers)',
    },
    startDate: '2026-10-24',
    endDate: '2026-10-30',
    statusPreset: 'exam',
    description: {
      sv: 'Tentavecka på Chalmers Datateknik. Högt pluggfokus, begränsad svarstid.',
      en: 'Final exams at Chalmers Computer Science & Eng. Deep focus, reduced availability.',
    },
    badge: {
      sv: 'TENTAMENSPERIOD 1',
      en: 'EXAM PERIOD 1',
    },
  },
  {
    id: 'sm-kortbana-2026',
    name: {
      sv: 'SM / U21-SM kortbana 25m',
      en: 'Swedish National Championships 25m',
    },
    startDate: '2026-12-09',
    endDate: '2026-12-13',
    statusPreset: 'swim',
    description: {
      sv: 'Tävlar på Svenska Mästerskapen för MASS & Growth Objective. 50m/100m frisim och fjäril.',
      en: 'Competing at Swedish Nationals for MASS & Growth Objective. 50m/100m freestyle and butterfly.',
    },
    badge: {
      sv: 'SM 25M',
      en: 'SM NATIONALS 25M',
    },
  },
  {
    id: 'vinter-studier-2026',
    name: {
      sv: 'Självstudier & Vinterledighet',
      en: 'Self-Study & Winter Break',
    },
    startDate: '2026-12-21',
    endDate: '2026-12-30',
    statusPreset: 'vacation',
    description: {
      sv: 'Uppehåll från föreläsningar. Självstudier, homelab och återhämtning.',
      en: 'Break from lectures. Self-study, homelab tinkering, and recovery.',
    },
    badge: {
      sv: 'VINTERLEDIGHET',
      en: 'WINTER BREAK',
    },
  },
  {
    id: 'lp2-tentor-2027',
    name: {
      sv: 'Tentamensperiod 2 (Chalmers)',
      en: 'Exam Period 2 / Finals (Chalmers)',
    },
    startDate: '2027-01-09',
    endDate: '2027-01-16',
    statusPreset: 'exam',
    description: {
      sv: 'Tentor på Chalmers tekniska högskola.',
      en: 'Final examinations at Chalmers University of Technology.',
    },
    badge: {
      sv: 'TENTAMENSPERIOD 2',
      en: 'EXAM PERIOD 2',
    },
  },
  {
    id: 'charm-2027',
    name: {
      sv: 'CHARM Arbetsmarknadsdagar',
      en: 'CHARM Career Fair (Chalmers)',
    },
    startDate: '2027-02-09',
    endDate: '2027-02-10',
    statusPreset: 'hackathon',
    description: {
      sv: 'Chalmers arbetsmarknadsdagar. Nätverkar och diskuterar sommarjobb 2027 & exjobb.',
      en: 'Chalmers career fair. Networking for summer 2027 internships & thesis.',
    },
    badge: {
      sv: 'CHARM 2027',
      en: 'CHARM CAREER FAIR',
    },
  },
  {
    id: 'lp3-tentor-2027',
    name: {
      sv: 'Tentamensperiod 3 (Chalmers)',
      en: 'Exam Period 3 / Finals (Chalmers)',
    },
    startDate: '2027-03-13',
    endDate: '2027-03-20',
    statusPreset: 'exam',
    description: {
      sv: 'Tentamensvecka för läsperiod 3.',
      en: 'Exam week for study period 3.',
    },
    badge: {
      sv: 'TENTAMENSPERIOD 3',
      en: 'EXAM PERIOD 3',
    },
  },
  {
    id: 'lp4-tentor-2027',
    name: {
      sv: 'Tentamensperiod 4 (Chalmers)',
      en: 'Exam Period 4 / Finals (Chalmers)',
    },
    startDate: '2027-05-29',
    endDate: '2027-06-05',
    statusPreset: 'exam',
    description: {
      sv: 'Sluttentor för läsåret på Chalmers.',
      en: 'Academic year-end final exams at Chalmers.',
    },
    badge: {
      sv: 'TENTAMENSPERIOD 4',
      en: 'EXAM PERIOD 4',
    },
  },
  {
    id: 'sm-langbana-2027',
    name: {
      sv: 'SM / Para-SM / U21-SM 50m',
      en: 'Swedish National Championships 50m',
    },
    startDate: '2027-06-30',
    endDate: '2027-07-04',
    statusPreset: 'swim',
    description: {
      sv: 'Svenska Mästerskapen i långbana (50m).',
      en: 'Swedish National Championships (50m).',
    },
    badge: {
      sv: 'SM 50M',
      en: 'SM NATIONALS 50M',
    },
  },
  {
    id: 'sm-kortbana-2027',
    name: {
      sv: 'SM / U21-SM 25m',
      en: 'Swedish National Championships 25m',
    },
    startDate: '2027-12-15',
    endDate: '2027-12-19',
    statusPreset: 'swim',
    description: {
      sv: 'Kortbane-SM (25m).',
      en: 'Short course Swedish Nationals (25m).',
    },
    badge: {
      sv: 'SM 25M',
      en: 'SM NATIONALS 25M',
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
