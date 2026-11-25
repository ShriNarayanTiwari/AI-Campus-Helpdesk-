import { CampusEvent } from '../types/campus';

export type EventTimeStatus = 'upcoming' | 'today' | 'past';

/**
 * Compares YYYY-MM-DD event date strings cleanly without timezone drift.
 */
export function getLocalIsoDate(referenceDate: Date = new Date()): string {
  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const day = String(referenceDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function computeEventStatus(eventDateIso: string, referenceDate: Date = new Date()): EventTimeStatus {
  const todayIso = getLocalIsoDate(referenceDate);
  if (eventDateIso > todayIso) return 'upcoming';
  if (eventDateIso === todayIso) return 'today';
  return 'past';
}

export function filterCampusEvents(
  events: CampusEvent[],
  filters: {
    status: 'all' | 'upcoming' | 'past';
    category: string;
    search: string;
    monthKey?: string; // YYYY-MM
  },
  referenceDate: Date = new Date()
): CampusEvent[] {
  const q = filters.search.trim().toLowerCase();

  return events
    .filter((evt) => {
      const computed = computeEventStatus(evt.date, referenceDate);
      if (filters.status === 'upcoming' && computed === 'past') return false;
      if (filters.status === 'past' && computed !== 'past') return false;
      if (filters.category !== 'All' && evt.category !== filters.category) return false;
      if (filters.monthKey && !evt.date.startsWith(filters.monthKey)) return false;
      if (q) {
        const hay = `${evt.title} ${evt.organizer} ${evt.category} ${evt.description} ${evt.venue}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function formatDisplayDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function buildIcsContent(event: CampusEvent): string {
  const compactDate = event.date.replace(/-/g, '');
  const startCompact = `${compactDate}T${event.startTime.replace(':', '')}00`;
  const endCompact = `${compactDate}T${event.endTime.replace(':', '')}00`;
  const escapeIcs = (str: string) =>
    str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Campus Assist//Student Information Hub//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@campus-assist`,
    `DTSTART:${startCompact}`,
    `DTEND:${endCompact}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `LOCATION:${escapeIcs(event.venue)}`,
    `DESCRIPTION:${escapeIcs(`${event.description} — Campus Assist`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
