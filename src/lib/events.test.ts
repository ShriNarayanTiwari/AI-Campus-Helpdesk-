import test from 'node:test';
import assert from 'node:assert/strict';
import { CAMPUS_EVENTS } from '../data/campusDirectory';
import { buildIcsContent, computeEventStatus, filterCampusEvents } from './events';
import type { CampusEvent } from '../types/campus';

const FIXTURE_EVENTS: CampusEvent[] = [
  {
    id: 'evt-past-1',
    title: 'Orientation Briefing',
    category: 'Academic',
    date: '2026-10-10',
    startTime: '10:00',
    endTime: '11:30',
    venue: 'Academic Block',
    organizer: 'Academic Office',
    description: 'General orientation briefing.',
    sourceType: 'official',
    sourceLabel: 'Verified source',
    sourceUrl: 'https://www.gla.ac.in/',
    lastChecked: '2026-04-12',
  },
  {
    id: 'evt-today-1',
    title: 'Library Information Session',
    category: 'Academic',
    date: '2026-11-20',
    startTime: '14:00',
    endTime: '15:00',
    venue: 'Central Library',
    organizer: 'Library Desk',
    description: 'Overview of library resources.',
    sourceType: 'official',
    sourceLabel: 'Verified source',
    sourceUrl: 'https://www.gla.ac.in/',
    lastChecked: '2026-04-12',
  },
  {
    id: 'evt-upcoming-1',
    title: 'Student Coding Meetup',
    category: 'Technical',
    date: '2026-11-28',
    startTime: '16:00',
    endTime: '17:30',
    venue: 'Computer Lab',
    organizer: 'Student Activities',
    description: 'Peer coding practice session.',
    sourceType: 'official',
    sourceLabel: 'Verified source',
    sourceUrl: 'https://www.gla.ac.in/',
    lastChecked: '2026-04-12',
  },
];

test('CAMPUS_EVENTS contains no static fictional future events', () => {
  assert.equal(CAMPUS_EVENTS.length, 0);
});

test('computeEventStatus never marks past events as upcoming', () => {
  const ref = new Date(2026, 10, 20); // Nov 20, 2026
  assert.equal(computeEventStatus('2026-10-10', ref), 'past');
  assert.equal(computeEventStatus('2026-11-20', ref), 'today');
  assert.equal(computeEventStatus('2026-11-28', ref), 'upcoming');
});

test('filterCampusEvents separates upcoming and past events accurately', () => {
  const ref = new Date(2026, 10, 20); // Nov 20, 2026
  const upcoming = filterCampusEvents(FIXTURE_EVENTS, { status: 'upcoming', category: 'All', search: '' }, ref);
  const past = filterCampusEvents(FIXTURE_EVENTS, { status: 'past', category: 'All', search: '' }, ref);

  assert.equal(upcoming.length, 2);
  assert.equal(past.length, 1);
  for (const evt of upcoming) {
    assert.ok(evt.date >= '2026-11-20', `Upcoming event ${evt.id} has past date ${evt.date}`);
  }
  for (const evt of past) {
    assert.ok(evt.date < '2026-11-20', `Past event ${evt.id} has non-past date ${evt.date}`);
  }
});

test('buildIcsContent produces valid VCALENDAR payload with Campus Assist branding', () => {
  const ics = buildIcsContent(FIXTURE_EVENTS[2]);
  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('BEGIN:VEVENT'));
  assert.ok(ics.includes('END:VCALENDAR'));
  assert.ok(ics.includes('Campus Assist'));
});
