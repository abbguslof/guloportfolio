/**
 * src/data/telemetry.ts
 * ============================================================================
 * Station Launch Date & Uptime Configuration
 * ----------------------------------------------------------------------------
 * Ändra SITE_LAUNCH_DATE när du vill nollställa eller sätta datumet för när
 * sidan/servern driftsattes! Format: YYYY-MM-DDTHH:mm:ssZ
 *
 * Change SITE_LAUNCH_DATE anytime you want to configure when this station
 * was launched! Format: ISO-8601 (YYYY-MM-DDTHH:mm:ssZ)
 * ============================================================================
 */
export const SITE_LAUNCH_DATE = '2026-01-01T00:00:00Z';

export interface CalculatedUptime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedEn: string;
  formattedSv: string;
  short: string;
}

export function calculateUptime(
  launchDateStr: string = SITE_LAUNCH_DATE,
  targetTimeMs: number = Date.now()
): CalculatedUptime {
  let launchEpoch = new Date(launchDateStr).getTime();
  if (isNaN(launchEpoch)) {
    launchEpoch = new Date('2026-01-01T00:00:00Z').getTime();
  }
  const diffMs = Math.max(0, targetTimeMs - launchEpoch);

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    formattedEn: `${days} days, ${hours} hours, ${minutes} mins`,
    formattedSv: `${days} dagar, ${hours} timmar, ${minutes} min`,
    short: `${days}d ${hours}h ${minutes}m ${seconds}s`,
  };
}

/**
 * Global reactive connection state helper
 */
export function isSiteOnline(): boolean {
  if (typeof window !== 'undefined') {
    if (typeof (window as any).__siteIsOnline === 'boolean') {
      return (window as any).__siteIsOnline;
    }
    return navigator.onLine;
  }
  return true;
}

export function setSiteOnline(isOnline: boolean): void {
  if (typeof window !== 'undefined') {
    (window as any).__siteIsOnline = isOnline;
    window.dispatchEvent(new CustomEvent('connection-state-change', { detail: { isOnline } }));
  }
}
