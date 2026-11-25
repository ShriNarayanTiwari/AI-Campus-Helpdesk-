import test from 'node:test';
import assert from 'node:assert/strict';
import { answer, INDICATIVE_FEE_DISCLAIMER, isUnknownAnswer } from './campusAnswer';
import { fees, total, money, records } from '../data/cedar';

test('Sunday follow-up uses the requested field and can be shortened', () => {
  const a = answer('Tell me about the libary');
  const b = answer('What about Sunday?', [{ role: 'assistant', content: a }]);
  assert.match(b, /10 AM to 5 PM/);
  assert.ok(answer('Say it in one line', [{ role: 'assistant', content: b }]).length < b.length);
});

test('Hinglish fees and totals agree with the calculator', () => {
  assert.match(answer('hostel ki fees kitni hai?'), /48,000/);
  assert.ok(
    answer('Total B.Tech double AC with mess').includes(
      money(total(fees.tuition['B.Tech'], fees.ac, true))
    )
  );
  assert.match(answer('Does the cheaper one include mess?'), /Neither.*30,000/);
});

test('exam dates respect the programme, semester and clock', () => {
  assert.match(answer('What is my next exam?'), /programme and semester/);
  assert.match(
    answer('BCA semester 1', [{ role: 'user', content: 'next exam' }], '2026-12-01'),
    /2026-12-12/
  );
  assert.match(answer('next exam B.Tech semester 1', [], '2027-01-01'), /no upcoming/i);
});

test('broad fee queries answer first with compact table, single disclaimer, and follow-up question', () => {
  const ids = new Set<string>();
  const res = answer('fees structure of all branches', [], undefined, records, ids);

  // Compact Markdown table containing every stored programme
  assert.match(res, /\| Programme \| Annual Tuition \| Per Semester \|/);
  assert.match(res, /\| B\.Tech \| ₹1,20,000\/year \| ₹60,000\/semester \|/);
  assert.match(res, /\| BCA \| ₹80,000\/year \| ₹40,000\/semester \|/);
  assert.match(res, /\| BBA \| ₹76,000\/year \| ₹38,000\/semester \|/);

  // Never invents missing programmes
  assert.doesNotMatch(res, /\bMBA\b|\bMCA\b|\bB\.Pharm\b/);

  // Exactly one indicative disclaimer
  const disclaimerMatches = res.match(
    /Figures are indicative\. Verify current fees through official GLA University channels\./g
  );
  assert.equal(disclaimerMatches?.length, 1);

  // Follow-up prompt comes AFTER the table and disclaimer
  assert.ok(
    res.indexOf(INDICATIVE_FEE_DISCLAIMER) <
      res.indexOf('specific programme, hostel room type')
  );
  assert.ok(ids.has('tuition-B.Tech'));
  assert.ok(ids.has('tuition-BCA'));
  assert.ok(ids.has('tuition-BBA'));

  // Also test "all course fees"
  const res2 = answer('all course fees');
  assert.match(res2, /\| B\.Tech \| ₹1,20,000\/year \| ₹60,000\/semester \|/);
  assert.match(res2, /\| BBA \| ₹76,000\/year \| ₹38,000\/semester \|/);
});

test('B.Tech CSE fee for day scholar gives accurate breakdown without hostel fee', () => {
  const res = answer('B.Tech CSE fee for day scholar');
  assert.match(res, /Tuition Fee \(B\.Tech CSE\):\*\* ₹1,20,000 per year \(₹60,000 per semester\)/);
  assert.match(res, /Day Scholar\):\*\* ₹0 per year/);
  assert.match(res, /Estimated First-Year Total:\*\* ₹1,20,000 per year/);
  assert.match(res, /Figures are indicative\. Verify current fees through official GLA University channels\./);
});

test('hostel facilities and rules returns structured guidance and never refuses', () => {
  const ids = new Set<string>();
  const res = answer('Tell me about hostel facilities and rules', [], undefined, records, ids);

  assert.doesNotMatch(res, /I don’t have that policy listed/i);
  assert.match(res, /Hostel Facilities and General Guidance/);
  assert.match(res, /Double Non-AC and Double AC/);
  assert.match(res, /Wi-Fi|maintenance/i);
  assert.match(
    res,
    /For residence-specific rules, timings, and allocation details, verify through official hostel administration\./
  );
  // Must NOT invent curfew times, warden names, or mess schedules
  assert.doesNotMatch(res, /curfew|warden|7:30|9:00 PM/i);
  assert.ok(ids.has('hostel-guidance'));
});

test('campus clubs and upcoming events compound query answers both sections cleanly with no broken markdown', () => {
  const ids = new Set<string>();
  const res = answer('Tell me about campus clubs and upcoming events', [], undefined, records, ids);

  assert.match(res, /\*\*Student Activities\*\*/);
  assert.match(res, /\*\*Upcoming Information\*\*/);
  assert.match(res, /Technical & Coding/);
  assert.match(
    res,
    /For current club activities and event announcements, please refer to official university communication channels\./
  );
  // Must NOT have broken triple-asterisk markdown or fictional clubs/events
  assert.doesNotMatch(res, /\*\*\*[^*]/);
  assert.doesNotMatch(
    res,
    /Circuit Circle|Stagecraft|Circuit Lab|Winter Showcase|Open Debate|Science Hall|Arts Hall|Welcome Court/i
  );
  assert.ok(ids.has('clubs'));
  assert.ok(ids.has('events-notices'));
});

test('unknown/gibberish queries return short rephrase message without recommending Student Services', () => {
  const ids = new Set<string>();
  const res = answer('asdfghjkl 999 xyzzy', [], undefined, records, ids);
  assert.ok(isUnknownAnswer(res));
  assert.match(res, /rephrase/i);
  assert.doesNotMatch(res, /student services|request support/i);
  assert.equal(ids.size, 0);
});

test('evidence refers to an active resource record and KB hygiene & credibility rules pass', () => {
  const ids = new Set<string>();
  answer('Library Sunday hours', [], undefined, records, ids);
  assert.deepEqual([...ids], ['hours-Sunday']);
  assert.equal(new Set(records.map((r) => r.id)).size, records.length);

  // Confirm required Campus Resources record exists
  const hostelGuidance = records.find((r) => r.title === 'Hostel Facilities and General Guidance');
  assert.ok(hostelGuidance, 'Expected "Hostel Facilities and General Guidance" record in Campus Resources');

  const bannedPattern =
    /cedarbrook|prototype|demo|sample|local\s+demo|per unit|science hall|arts hall|welcome court|market square|lake stop|circuit circle|shutter society|stagecraft|river runners|build guild|green circle|design desk|wordsmiths|rhythm room|logic league|market makers|open floor|circuit lab|winter showcase|open debate/i;

  for (const r of records) {
    assert.equal(new Set(r.tags).size, r.tags.length, `Duplicate tags in record ${r.id}`);
    assert.notEqual(r.subcategory, r.category, `Identical category and subcategory in record ${r.id}`);
    assert.match(r.title, /^[A-Z0-9]/, `Title should start with uppercase in record ${r.id}: ${r.title}`);
    assert.doesNotMatch(
      `${r.title} ${r.content}`,
      bannedPattern,
      `Disallowed legacy/fictional term in record ${r.id}: ${r.title}`
    );
  }
});

test('QA suite: accurate routing, compound tuition+exam, and strict guardrails', () => {
  const idsA = new Set<string>();
  const resA = answer('Tell me about library services and hours', [], undefined, records, idsA);
  assert.match(resA, /Central Library/i);
  assert.match(resA, /8 AM to 8 PM/i);
  assert.ok(idsA.has('library'));

  const idsB = new Set<string>();
  const resB = answer('What are the campus bus and transport routes and timings?', [], undefined, records, idsB);
  assert.match(resB, /Transport Office|routes/i);
  assert.doesNotMatch(resB, /library|Market Square|Lake Stop/i);
  assert.ok(idsB.has('travel'));

  const idsC = new Set<string>();
  const resC = answer('How do campus placements and internships work?', [], undefined, records, idsC);
  assert.match(resC, /Training & Placement|internship|résumé/i);
  assert.ok(idsC.has('career'));
  assert.ok(idsC.has('intern'));

  const idsE = new Set<string>();
  const resE = answer('What is the B.Tech tuition fee and exam schedule?', [], '2026-11-24', records, idsE);
  assert.match(resE, /₹1,20,000 per year \(₹60,000 per semester\)/);
  assert.match(resE, /Engineering Mathematics/);
  assert.match(resE, /2026-12-11/);
  assert.ok(idsE.has('tuition-B.Tech'));

  const idsF = new Set<string>();
  const resF = answer('My hostel Wi-Fi is not working', [], undefined, records, idsF);
  assert.match(resF, /GLA Student Wi-Fi/i);
  assert.match(resF, /IT & Wi-Fi/i);
  assert.ok(idsF.has('wifi'));

  const idsH = new Set<string>();
  const resH = answer("What is tomorrow's exact hostel mess menu?", [], undefined, records, idsH);
  assert.match(resH, /not available|live or daily hostel mess menus/i);
  assert.doesNotMatch(resH, /30,000/);
  assert.equal(idsH.size, 0);

  const idsI = new Set<string>();
  const resI = answer('Where is the campus helipad and swimming pool?', [], undefined, records, idsI);
  assert.match(resI, /no record/i);
  assert.match(resI, /helipad/i);
  assert.match(resI, /swimming pool/i);
  assert.equal(idsI.size, 0);
});

test('two-turn fee structure flow parses compound BTech CSE + single room reply completely', () => {
  const turn1 = answer('What is the fee structure?');
  assert.match(turn1, /programme/i);
  assert.match(turn1, /room type/i);

  const ids = new Set<string>();
  const turn2 = answer(
    'BTech CSE + single room',
    [
      { role: 'user', content: 'What is the fee structure?' },
      { role: 'assistant', content: turn1 },
    ],
    undefined,
    records,
    ids
  );

  assert.doesNotMatch(turn2, /per\s+unit/i);
  assert.match(turn2, /₹1,20,000 per year \(₹60,000 per semester\)/);
  assert.match(turn2, /Figures are indicative\. Verify current fees through official GLA University channels\./);
  assert.match(turn2, /- \*\*Tuition Fee \(B\.Tech CSE\):\*\*/);
  assert.match(turn2, /- \*\*Hostel & Room Type Fee \(Single Room\):\*\*/);
  assert.match(turn2, /- \*\*Optional Mess \/ Deposit:\*\*/);
  assert.match(turn2, /Single room fees are not listed/i);
  assert.match(turn2, /Double Non-AC at ₹48,000 per year \(₹24,000 per semester\)/);
  assert.match(turn2, /Double AC at ₹72,000 per year \(₹36,000 per semester\)/);
  assert.match(turn2, /GLA University Hostel Office/i);
  assert.match(turn2, /₹30,000 per year \(₹15,000 per semester\)/);
  assert.match(turn2, /₹5,000/);
  assert.doesNotMatch(turn2, /https?:\/\//i);
  assert.ok(ids.has('tuition-B.Tech'));
  assert.ok(ids.has('rooms'));
  assert.ok(ids.has('mess'));
});
