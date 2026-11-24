import test from 'node:test';
import assert from 'node:assert/strict';
import { CAMPUS_EVENTS } from '../data/campusDirectory';
import { buildIcsContent, computeEventStatus, filterCampusEvents } from './events';

test('computeEventStatus never marks past events as upcoming', () => {
  const ref = new Date(2026, 10, 20); // Nov 20, 2026
  assert.equal(computeEventStatus('2026-10-10', ref), 'past');
  assert.equal(computeEventStatus('2026-11-20', ref), 'today');
  assert.equal(computeEventStatus('2026-11-28', ref), 'upcoming');
});

test('filterCampusEvents separates upcoming and past events accurately', () => {
  const ref = new Date(2026, 10, 20); // Nov 20, 2026
  const upcoming = filterCampusEvents(CAMPUS_EVENTS, { status: 'upcoming', category: 'All', search: '' }, ref);
  const past = filterCampusEvents(CAMPUS_EVENTS, { status: 'past', category: 'All', search: '' }, ref);

  assert.ok(upcoming.length >= 5);
  assert.ok(past.length >= 2);
  for (const evt of upcoming) {
    assert.ok(evt.date >= '2026-11-20', `Upcoming event ${evt.id} has past date ${evt.date}`);
  }
  for (const evt of past) {
    assert.ok(evt.date < '2026-11-20', `Past event ${evt.id} has non-past date ${evt.date}`);
  }
});

test('buildIcsContent produces valid VCALENDAR payload with source label', () => {
  const ics = buildIcsContent(CAMPUS_EVENTS[0]);
  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('BEGIN:VEVENT'));
  assert.ok(ics.includes('END:VCALENDAR'));
  assert.ok(ics.includes('Prototype sample'));
});
