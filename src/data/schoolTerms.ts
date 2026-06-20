export type AustralianState = 'QLD' | 'NSW' | 'VIC' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

export interface SchoolTerm {
  term: 1 | 2 | 3 | 4;
  year: number;
  start: string; // ISO date
  end: string;   // ISO date
}

// Dates sourced from state education department websites
// https://education.qld.gov.au / https://education.nsw.gov.au / etc.
const TERMS: Record<AustralianState, SchoolTerm[]> = {
  QLD: [
    // 2025
    { term: 1, year: 2025, start: '2025-01-27', end: '2025-04-04' },
    { term: 2, year: 2025, start: '2025-04-22', end: '2025-06-27' },
    { term: 3, year: 2025, start: '2025-07-14', end: '2025-09-19' },
    { term: 4, year: 2025, start: '2025-10-06', end: '2025-12-12' },
    // 2026
    { term: 1, year: 2026, start: '2026-01-26', end: '2026-03-27' },
    { term: 2, year: 2026, start: '2026-04-13', end: '2026-06-19' },
    { term: 3, year: 2026, start: '2026-07-06', end: '2026-09-11' },
    { term: 4, year: 2026, start: '2026-09-28', end: '2026-12-04' },
    // 2027
    { term: 1, year: 2027, start: '2027-01-25', end: '2027-04-01' },
    { term: 2, year: 2027, start: '2027-04-19', end: '2027-06-25' },
    { term: 3, year: 2027, start: '2027-07-12', end: '2027-09-17' },
    { term: 4, year: 2027, start: '2027-10-04', end: '2027-12-10' },
  ],
  NSW: [
    { term: 1, year: 2025, start: '2025-01-28', end: '2025-04-11' },
    { term: 2, year: 2025, start: '2025-04-28', end: '2025-07-04' },
    { term: 3, year: 2025, start: '2025-07-21', end: '2025-09-26' },
    { term: 4, year: 2025, start: '2025-10-13', end: '2025-12-19' },
    { term: 1, year: 2026, start: '2026-01-27', end: '2026-04-09' },
    { term: 2, year: 2026, start: '2026-04-27', end: '2026-07-03' },
    { term: 3, year: 2026, start: '2026-07-20', end: '2026-09-25' },
    { term: 4, year: 2026, start: '2026-10-12', end: '2026-12-18' },
    { term: 1, year: 2027, start: '2027-01-26', end: '2027-04-08' },
    { term: 2, year: 2027, start: '2027-04-26', end: '2027-07-02' },
    { term: 3, year: 2027, start: '2027-07-19', end: '2027-09-24' },
    { term: 4, year: 2027, start: '2027-10-11', end: '2027-12-17' },
  ],
  VIC: [
    { term: 1, year: 2025, start: '2025-01-28', end: '2025-04-04' },
    { term: 2, year: 2025, start: '2025-04-22', end: '2025-06-20' },
    { term: 3, year: 2025, start: '2025-07-07', end: '2025-09-19' },
    { term: 4, year: 2025, start: '2025-10-06', end: '2025-12-19' },
    { term: 1, year: 2026, start: '2026-01-27', end: '2026-03-27' },
    { term: 2, year: 2026, start: '2026-04-13', end: '2026-06-19' },
    { term: 3, year: 2026, start: '2026-07-06', end: '2026-09-18' },
    { term: 4, year: 2026, start: '2026-10-05', end: '2026-12-18' },
    { term: 1, year: 2027, start: '2027-01-26', end: '2027-03-26' },
    { term: 2, year: 2027, start: '2027-04-12', end: '2027-06-18' },
    { term: 3, year: 2027, start: '2027-07-05', end: '2027-09-17' },
    { term: 4, year: 2027, start: '2027-10-04', end: '2027-12-17' },
  ],
  WA: [
    { term: 1, year: 2025, start: '2025-02-04', end: '2025-04-11' },
    { term: 2, year: 2025, start: '2025-04-28', end: '2025-07-04' },
    { term: 3, year: 2025, start: '2025-07-21', end: '2025-09-26' },
    { term: 4, year: 2025, start: '2025-10-13', end: '2025-12-12' },
    { term: 1, year: 2026, start: '2026-02-02', end: '2026-04-09' },
    { term: 2, year: 2026, start: '2026-04-27', end: '2026-07-03' },
    { term: 3, year: 2026, start: '2026-07-20', end: '2026-09-25' },
    { term: 4, year: 2026, start: '2026-10-12', end: '2026-12-11' },
    { term: 1, year: 2027, start: '2027-02-01', end: '2027-04-08' },
    { term: 2, year: 2027, start: '2027-04-26', end: '2027-07-02' },
    { term: 3, year: 2027, start: '2027-07-19', end: '2027-09-24' },
    { term: 4, year: 2027, start: '2027-10-11', end: '2027-12-10' },
  ],
  SA: [
    { term: 1, year: 2025, start: '2025-01-28', end: '2025-04-11' },
    { term: 2, year: 2025, start: '2025-04-28', end: '2025-07-04' },
    { term: 3, year: 2025, start: '2025-07-21', end: '2025-09-26' },
    { term: 4, year: 2025, start: '2025-10-13', end: '2025-12-12' },
    { term: 1, year: 2026, start: '2026-01-27', end: '2026-04-09' },
    { term: 2, year: 2026, start: '2026-04-27', end: '2026-07-03' },
    { term: 3, year: 2026, start: '2026-07-20', end: '2026-09-25' },
    { term: 4, year: 2026, start: '2026-10-12', end: '2026-12-11' },
    { term: 1, year: 2027, start: '2027-01-26', end: '2027-04-08' },
    { term: 2, year: 2027, start: '2027-04-26', end: '2027-07-02' },
    { term: 3, year: 2027, start: '2027-07-19', end: '2027-09-24' },
    { term: 4, year: 2027, start: '2027-10-11', end: '2027-12-10' },
  ],
  TAS: [
    { term: 1, year: 2025, start: '2025-01-29', end: '2025-04-11' },
    { term: 2, year: 2025, start: '2025-04-28', end: '2025-06-27' },
    { term: 3, year: 2025, start: '2025-07-14', end: '2025-09-19' },
    { term: 4, year: 2025, start: '2025-10-06', end: '2025-12-19' },
    { term: 1, year: 2026, start: '2026-01-28', end: '2026-04-09' },
    { term: 2, year: 2026, start: '2026-04-27', end: '2026-06-26' },
    { term: 3, year: 2026, start: '2026-07-13', end: '2026-09-18' },
    { term: 4, year: 2026, start: '2026-10-05', end: '2026-12-18' },
    { term: 1, year: 2027, start: '2027-01-27', end: '2027-04-08' },
    { term: 2, year: 2027, start: '2027-04-26', end: '2027-06-25' },
    { term: 3, year: 2027, start: '2027-07-12', end: '2027-09-17' },
    { term: 4, year: 2027, start: '2027-10-04', end: '2027-12-17' },
  ],
  ACT: [
    { term: 1, year: 2025, start: '2025-01-28', end: '2025-04-11' },
    { term: 2, year: 2025, start: '2025-04-28', end: '2025-07-04' },
    { term: 3, year: 2025, start: '2025-07-21', end: '2025-09-26' },
    { term: 4, year: 2025, start: '2025-10-13', end: '2025-12-12' },
    { term: 1, year: 2026, start: '2026-01-27', end: '2026-04-09' },
    { term: 2, year: 2026, start: '2026-04-27', end: '2026-07-03' },
    { term: 3, year: 2026, start: '2026-07-20', end: '2026-09-25' },
    { term: 4, year: 2026, start: '2026-10-12', end: '2026-12-11' },
    { term: 1, year: 2027, start: '2027-01-26', end: '2027-04-08' },
    { term: 2, year: 2027, start: '2027-04-26', end: '2027-07-02' },
    { term: 3, year: 2027, start: '2027-07-19', end: '2027-09-24' },
    { term: 4, year: 2027, start: '2027-10-11', end: '2027-12-10' },
  ],
  NT: [
    { term: 1, year: 2025, start: '2025-01-28', end: '2025-04-04' },
    { term: 2, year: 2025, start: '2025-04-22', end: '2025-06-27' },
    { term: 3, year: 2025, start: '2025-07-14', end: '2025-09-19' },
    { term: 4, year: 2025, start: '2025-10-06', end: '2025-12-12' },
    { term: 1, year: 2026, start: '2026-01-26', end: '2026-03-27' },
    { term: 2, year: 2026, start: '2026-04-13', end: '2026-06-19' },
    { term: 3, year: 2026, start: '2026-07-06', end: '2026-09-11' },
    { term: 4, year: 2026, start: '2026-09-28', end: '2026-12-04' },
    { term: 1, year: 2027, start: '2027-01-25', end: '2027-04-01' },
    { term: 2, year: 2027, start: '2027-04-19', end: '2027-06-25' },
    { term: 3, year: 2027, start: '2027-07-12', end: '2027-09-17' },
    { term: 4, year: 2027, start: '2027-10-04', end: '2027-12-10' },
  ],
};

export function getTermForDate(date: string, state: AustralianState): SchoolTerm | null {
  const d = new Date(date + 'T12:00:00');
  const terms = TERMS[state] ?? TERMS.QLD;
  for (const term of terms) {
    const start = new Date(term.start + 'T00:00:00');
    const end = new Date(term.end + 'T23:59:59');
    if (d >= start && d <= end) return term;
  }
  return null;
}

export function getTermWeekNumber(weekStart: string, term: SchoolTerm): number {
  const ws = new Date(weekStart + 'T12:00:00');
  const ts = new Date(term.start + 'T12:00:00');
  // Find the Sunday on or before term start
  const termStartDay = ts.getDay();
  const termSunday = new Date(ts);
  termSunday.setDate(ts.getDate() - termStartDay);
  const diffMs = ws.getTime() - termSunday.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.max(1, diffWeeks + 1);
}

export function getSchoolHolidayLabel(date: string, state: AustralianState): string | null {
  const terms = TERMS[state] ?? TERMS.QLD;
  const d = new Date(date + 'T12:00:00');
  const year = d.getFullYear();
  const yearTerms = terms.filter(t => t.year === year).sort((a, b) => a.term - b.term);

  for (let i = 0; i < yearTerms.length; i++) {
    const term = yearTerms[i];
    const termEnd = new Date(term.end + 'T23:59:59');
    const nextTerm = yearTerms[i + 1];
    if (nextTerm) {
      const nextStart = new Date(nextTerm.start + 'T00:00:00');
      if (d > termEnd && d < nextStart) {
        return `Term ${term.term} holidays`;
      }
    }
  }

  // Before first term
  if (yearTerms.length > 0) {
    const firstStart = new Date(yearTerms[0].start + 'T00:00:00');
    if (d < firstStart) return 'Summer holidays';
    const lastEnd = new Date(yearTerms[yearTerms.length - 1].end + 'T23:59:59');
    if (d > lastEnd) return 'Summer holidays';
  }

  return null;
}

export const STATE_LABELS: Record<AustralianState, string> = {
  QLD: 'Queensland',
  NSW: 'New South Wales',
  VIC: 'Victoria',
  WA: 'Western Australia',
  SA: 'South Australia',
  TAS: 'Tasmania',
  ACT: 'ACT',
  NT: 'Northern Territory',
};
