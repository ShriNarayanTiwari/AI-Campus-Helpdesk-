import { records, exams, fees, money, total } from '../data/cedar.ts';
import {
  CLUBS_DIRECTORY,
  STUDENT_ACTIVITIES_NOTICE,
} from '../data/campusDirectory.ts';
import type { ChatMessage } from '../types/campus.ts';

type KnownProgram = keyof typeof fees.tuition;
type RoomType =
  | 'single'
  | 'triple'
  | 'quad'
  | 'double-ac'
  | 'double-non-ac'
  | 'double-compare'
  | 'day-scholar'
  | 'hostel-general'
  | null;
type MessPreference = 'include' | 'exclude' | 'unspecified';

interface FeeSlots {
  knownProgram: KnownProgram | null;
  programLabel: string | null;
  unlistedProgram: string | null;
  roomType: RoomType;
  roomRequestLabel: string | null;
  mess: MessPreference;
  wantsTotal: boolean;
}

export const INDICATIVE_FEE_DISCLAIMER =
  'Figures are indicative. Verify current fees through official GLA University channels.';
const CAMPUS_REFERENCE_LABEL =
  '(For guidance — verify through official GLA University channels)';
const FEE_CLARIFYING_PROMPT =
  'Which programme (e.g., B.Tech, BCA, BBA) and hostel room type (e.g., double AC, double non-AC, single room, or day scholar) would you like tuition and fee details for?';

export const UNKNOWN_ANSWER_TEXT =
  "I couldn't match that question to a campus topic. Please rephrase your question or pick one of the suggested questions below.";

export function isUnknownAnswer(content: string): boolean {
  return content.startsWith("I couldn't match that question to a campus topic");
}

const GENERIC_STOPWORDS = new Set([
  'the', 'tell', 'what', 'about', 'can', 'with', 'and', 'does', 'you', 'how', 'are', 'that',
  'for', 'its', 'have', 'has', 'this', 'from', 'where', 'when', 'who', 'why', 'please', 'give',
  'show', 'list', 'campus', 'university', 'gla', 'mathura', 'timings', 'timing', 'hours',
  'details', 'detail', 'info', 'information', 'work', 'works', 'working', 'any', 'there',
  'some', 'more', 'exact', 'tomorrow', 'today', 'tonight', 'now', 'currently', 'need', 'want',
  'know', 'find', 'get', 'here', 'college', 'student', 'students', 'our', 'your', 'into',
]);

const HIGH_WEIGHT_DOMAIN_TERMS = new Set([
  'bus', 'buses', 'shuttle', 'transport', 'commute', 'pass',
  'placement', 'placements', 'internship', 'internships', 'career', 'careers', 'resume', 'cv', 'recruiters', 'interview',
  'tuition', 'fee', 'fees', 'scholarship', 'refund', 'deposit',
  'hostel', 'hostels', 'room', 'rooms', 'mess', 'dining', 'meals', 'breakfast', 'lunch', 'dinner', 'laundry',
  'library', 'books', 'book', 'borrowing', 'opac', 'printing', 'printer', 'photocopy', 'study',
  'wifi', 'internet', 'network', 'id', 'card', 'replacement', 'repair', 'repairs', 'maintenance', 'plumbing',
  'counselling', 'counseling', 'counsellor', 'wellbeing', 'health', 'medical', 'clinic', 'sick', 'nurse',
  'sports', 'basketball', 'badminton', 'courts', 'gym', 'computing', 'computer', 'labs', 'lab',
  'club', 'clubs', 'society', 'societies', 'activities', 'event', 'events', 'notices', 'calendar',
  'exam', 'exams', 'examination', 'timetable', 'classes', 'department', 'departments', 'programme', 'programmes', 'courses',
]);

const UNLISTED_FACILITIES: Array<[RegExp, string]> = [
  [/\bhelipad\b/, 'helipad'],
  [/\bswimming\s+pool\b|\bpool\b/, 'swimming pool'],
  [/\bairport\b|\brunway\b/, 'airport'],
  [/\bbowling\s+alley\b|\bbowling\b/, 'bowling alley'],
  [/\bcinema\b|\bmovie\s+theat(?:er|re)\b|\bmultiplex\b/, 'cinema'],
  [/\bgolf\s+course\b/, 'golf course'],
  [/\bwater\s+park\b/, 'water park'],
  [/\bmetro\s+station\b|\bsubway\b/, 'metro station'],
  [/\bice\s+rink\b|\bskating\s+rink\b/, 'ice rink'],
  [/\bspa\b|\bsauna\b/, 'spa'],
  [/\bcasino\b/, 'casino'],
  [/\broller\s*coaster\b|\bamusement\s+park\b/, 'amusement park'],
  [/\bsubmarine\b|\bspaceship\b|\bteleport\b/, 'that facility'],
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/wi[ -]fi/g, 'wifi')
    .replace(/lib(?:ary|rery)/g, 'library')
    .replace(/hostle/g, 'hostel')
    .replace(/b[. ]?tech/g, 'b.tech')
    .replace(/m[. ]?tech/g, 'm.tech')
    .replace(/b[. ]?pharm(?:a)?/g, 'b.pharm')
    .replace(/d[. ]?pharm(?:a)?/g, 'd.pharm')
    .replace(/m[. ]?pharm(?:a)?/g, 'm.pharm')
    .replace(/b[. ]?sc/g, 'b.sc')
    .replace(/m[. ]?sc/g, 'm.sc')
    .replace(/b[. ]?com/g, 'b.com')
    .replace(/b[. ]?ed/g, 'b.ed');
}

function formatPeriodAmount(annual: number): string {
  return `${money(annual)} per year (${money(Math.round(annual / 2))} per semester)`;
}

function detectUnlistedProgram(q: string): string | null {
  const patterns: Array<[RegExp, string]> = [
    [/\bba\s*llb\b/, 'BA LLB'],
    [/\bbba\s*llb\b/, 'BBA LLB'],
    [/\bllb\b|\blaw\b/, 'LLB'],
    [/\bmba\b/, 'MBA'],
    [/\bmca\b/, 'MCA'],
    [/\bm\.tech\b/, 'M.Tech'],
    [/\bb\.pharm\b/, 'B.Pharm'],
    [/\bd\.pharm\b/, 'D.Pharm'],
    [/\bm\.pharm\b/, 'M.Pharm'],
    [/\bpharmacy\b/, 'Pharmacy'],
    [/\bb\.sc\b/, 'B.Sc'],
    [/\bm\.sc\b/, 'M.Sc'],
    [/\bb\.com\b/, 'B.Com'],
    [/\bb\.ed\b/, 'B.Ed'],
    [/\bdiploma\b|\bpolytechnic\b/, 'Diploma'],
    [/\bph\.?d\b/, 'Ph.D'],
    [/\bbiotech(?:nology)?\b/, 'Biotechnology'],
    [/\bagriculture\b/, 'Agriculture'],
  ];
  for (const [regex, label] of patterns) {
    if (regex.test(q)) return label;
  }
  return null;
}

function isBroadFeeOverviewQuery(q: string): boolean {
  const mentionsFees = /\b(fee|fees|tuition|fee\s+structure)\b/.test(q);
  if (!mentionsFees) return false;
  return (
    /\b(all\s+(?:branches?|courses?|programmes?|programs?|degrees?|streams?|fees?)|every\s+(?:branch|course|programme|program)|of\s+all\s+branches?|for\s+all\s+branches?|all\s+course\s+fees?|complete\s+fee\s+structure|branch[- ]?wise\s+fees?|course[- ]?wise\s+fees?)\b/.test(
      q
    ) ||
    (/\b(branches?|courses?|programmes?|programs?)\b/.test(q) &&
      !/\b(b\.tech|bca|bba|cse|mba|mca|m\.tech|b\.pharm|single|double|triple|day[- ]?scholar)\b/.test(
        q
      ))
  );
}

function buildBroadFeesOverviewResponse(
  catalog: typeof records,
  used: Set<string>
): string {
  const programEntries = Object.entries(fees.tuition) as Array<[KnownProgram, number]>;
  for (const [prog] of programEntries) {
    const id = `tuition-${prog}`;
    if (catalog.some((r) => r.id === id)) used.add(id);
  }

  const rows = programEntries.map(
    ([prog, annual]) =>
      `| ${prog} | ${money(annual)}/year | ${money(Math.round(annual / 2))}/semester |`
  );

  return [
    '**Indicative Tuition Fee Overview**',
    '',
    'Here are all programme tuition records currently stored in Campus Assist:',
    '',
    '| Programme | Annual Tuition | Per Semester |',
    '| --- | --- | --- |',
    ...rows,
    '',
    'Only the programmes listed above are stored in Campus Assist; other courses and branch-specific variations are not listed here.',
    '',
    INDICATIVE_FEE_DISCLAIMER,
    '',
    'Would you like a breakdown for a specific programme, hostel room type (Double AC or Double Non-AC), or a day-scholar calculation?',
  ].join('\n');
}

function buildHostelFacilitiesAndGuidanceResponse(
  catalog: typeof records,
  used: Set<string>
): string {
  if (catalog.some((r) => r.id === 'hostel-guidance')) used.add('hostel-guidance');
  else if (catalog.some((r) => r.id === 'hostel')) used.add('hostel');

  return [
    '**Hostel Facilities and General Guidance**',
    '',
    '- **Room Categories Listed:** Campus Assist includes reference estimates for Double Non-AC and Double AC room categories. Single and triple room categories are not listed here.',
    '- **Common Residence Support:** Residents can access guidance for campus Wi-Fi troubleshooting, shared common spaces, and logging room maintenance or repair requests through Student Services.',
    '- **Residence Rules & Allocation:** Hostel policies, entry timings, mess arrangements, and room allocations vary by residence block and academic session.',
    '',
    'For residence-specific rules, timings, and allocation details, verify through official hostel administration.',
  ].join('\n');
}

function buildClubsAndEventsCompoundResponse(
  catalog: typeof records,
  used: Set<string>
): string {
  if (catalog.some((r) => r.id === 'clubs')) used.add('clubs');
  if (catalog.some((r) => r.id === 'events-notices')) used.add('events-notices');

  const activityLines = CLUBS_DIRECTORY.map(
    (area) => `- **${area.name}:** ${area.description}`
  );

  return [
    '**Student Activities**',
    'Student interest areas commonly explored on campus include:',
    ...activityLines,
    '',
    '**Upcoming Information**',
    STUDENT_ACTIVITIES_NOTICE,
  ].join('\n');
}

function buildClubsOnlyResponse(
  catalog: typeof records,
  used: Set<string>
): string {
  if (catalog.some((r) => r.id === 'clubs')) used.add('clubs');

  const activityLines = CLUBS_DIRECTORY.map(
    (area) => `- **${area.name}:** ${area.description}`
  );

  return [
    '**Student Activities**',
    'Here are the student activity interest areas listed in Campus Assist:',
    ...activityLines,
    '',
    STUDENT_ACTIVITIES_NOTICE,
  ].join('\n');
}

function buildEventsOnlyResponse(
  catalog: typeof records,
  used: Set<string>
): string {
  if (catalog.some((r) => r.id === 'events-notices')) used.add('events-notices');

  return [
    '**Upcoming Information**',
    STUDENT_ACTIVITIES_NOTICE,
    '',
    'Visit **Activities & Notices** for official university communication links and student interest areas.',
  ].join('\n');
}

function parseFeeSlots(rawText: string, allowBareRoomTokens = false): FeeSlots {
  const q = normalizeText(rawText);

  let knownProgram: KnownProgram | null = null;
  let programLabel: string | null = null;
  let unlistedProgram: string | null = null;

  if (/\bb\.tech\b/.test(q) || /\bcse\b/.test(q) || /\bcomputer science\b/.test(q)) {
    knownProgram = 'B.Tech';
    if (/\bcse\b|computer science/.test(q)) {
      programLabel = 'B.Tech CSE';
    } else if (/\bai\s*\/?\s*ml\b|\baiml\b|artificial intelligence/.test(q)) {
      programLabel = 'B.Tech AI/ML';
    } else if (/\bece\b|electronics/.test(q)) {
      programLabel = 'B.Tech ECE';
    } else if (/\bmechanical\b|\bme\b/.test(q)) {
      programLabel = 'B.Tech Mechanical';
    } else if (/\bcivil\b/.test(q)) {
      programLabel = 'B.Tech Civil';
    } else if (/\belectrical\b|\bee\b/.test(q)) {
      programLabel = 'B.Tech Electrical';
    } else {
      programLabel = 'B.Tech';
    }
  } else if (/\bbca\b/.test(q)) {
    knownProgram = 'BCA';
    programLabel = 'BCA';
  } else if (/\bbba\b/.test(q) && !/\bbba\s*llb\b/.test(q)) {
    knownProgram = 'BBA';
    programLabel = 'BBA';
  } else {
    unlistedProgram = detectUnlistedProgram(q);
  }

  let roomType: RoomType = null;
  let roomRequestLabel: string | null = null;

  const hasSingle =
    /\b(single\s*(?:ac|non[- ]?ac)?\s*(?:room|seater|bed|occupancy|hostel)|1[- ]?seater|one[- ]?seater|solo\s*room|private\s*room)\b/.test(
      q
    ) || (allowBareRoomTokens && /\bsingle\b/.test(q));
  const hasTriple =
    /\b(triple\s*(?:ac|non[- ]?ac)?\s*(?:room|seater|bed|occupancy|hostel)|3[- ]?seater|three[- ]?seater)\b/.test(
      q
    ) || (allowBareRoomTokens && /\btriple\b/.test(q));
  const hasQuad = /\b(quad\s*(?:room|seater|hostel)|4[- ]?seater|four[- ]?seater)\b/.test(q);
  const hasDayScholar =
    /\b(day[- ]?scholar|no\s+hostel|without\s+hostel|without\s+room)\b/.test(q);
  const hasNonAc = /\bnon[- ]?ac\b|\bstandard\s*(?:room|double)\b|\bdouble\s*standard\b/.test(q);
  const hasAc =
    /\bdouble\s*ac\b|\b2[- ]?seater\s*ac\b|\btwo[- ]?seater\s*ac\b|\bac\s*(?:room|hostel|double)\b|\b(?<!non[- ]?)ac\b/.test(
      q.replace(/non[- ]?ac/g, 'nonac')
    );

  if (hasSingle) {
    roomType = 'single';
    roomRequestLabel = /\bnon[- ]?ac\b/.test(q)
      ? 'Single Non-AC Room'
      : /\bac\b/.test(q.replace(/non[- ]?ac/g, 'nonac'))
      ? 'Single AC Room'
      : 'Single Room';
  } else if (hasTriple) {
    roomType = 'triple';
    roomRequestLabel = /\bnon[- ]?ac\b/.test(q)
      ? 'Triple Non-AC Room'
      : /\bac\b/.test(q.replace(/non[- ]?ac/g, 'nonac'))
      ? 'Triple AC Room'
      : 'Triple Room';
  } else if (hasQuad) {
    roomType = 'quad';
    roomRequestLabel = 'Four-Seater Room';
  } else if (hasDayScholar) {
    roomType = 'day-scholar';
    roomRequestLabel = 'Day Scholar (No Hostel)';
  } else if (hasNonAc && hasAc) {
    roomType = 'double-compare';
    roomRequestLabel = 'Double AC vs Double Non-AC';
  } else if (hasNonAc) {
    roomType = 'double-non-ac';
    roomRequestLabel = 'Double Non-AC Room';
  } else if (hasAc) {
    roomType = 'double-ac';
    roomRequestLabel = 'Double AC Room';
  } else if (/\b(hostel|room|rooms|accommodation|dorm|double|seater|residential)\b/.test(q)) {
    roomType = 'hostel-general';
    roomRequestLabel = 'Hostel Room';
  }

  let mess: MessPreference = 'unspecified';
  if (/\b(without|no|exclude)\s+(mess|meals|food)\b/.test(q)) {
    mess = 'exclude';
  } else if (/\b(mess|meals|dining)\b/.test(q)) {
    mess = 'include';
  }

  const wantsTotal = /\b(total|budget|altogether|overall|combined)\b/.test(q);

  return {
    knownProgram,
    programLabel,
    unlistedProgram,
    roomType,
    roomRequestLabel,
    mess,
    wantsTotal,
  };
}

function hasAnySlot(slots: FeeSlots): boolean {
  return Boolean(
    slots.knownProgram ||
      slots.unlistedProgram ||
      slots.roomType ||
      slots.mess !== 'unspecified'
  );
}

function isFeeIntentText(q: string): boolean {
  if (
    /\b(print|photocopy|lost\s+id|id\s+card|shuttle|bus|transport|wifi|internet|library|laundry|club|event|timetable|direction|route|main\s+gate|counselling|counseling|health|sports|lab|internship|placement|career)\b/.test(
      q
    ) &&
    !/\b(fee|fees|tuition|instalment|installment)\b/.test(q)
  ) {
    return false;
  }
  return /\b(fee|fees|tuition|fee\s+structure|instalment|installment|kitni|kitna|cost|price|charges|budget|total)\b/.test(
    q
  );
}

function isFeeClarifyingMessage(content: string): boolean {
  return /which programme|which room type|fee structure for|tuition and fee details for|programme or room type|double ac or double non-ac|specific programme, hostel room type/i.test(
    content
  );
}

function isExplicitNonFeeTopic(q: string): boolean {
  return (
    /\b(library|books?|clubs?|societ(?:y|ies)|events?|student\s+services|wifi|internet|laundry|print|photocopy|group[- ]?study|study\s+room|main\s+gate|directions?|route|timetable|class\s+schedule|exam|semester|counselling|counseling|health\s+desk|sports|shuttle|bus|transport|id\s+card|internship|placement|career|breakfast|lunch|dinner)\b/.test(
      q
    ) && !/\b(fee|fees|tuition|cost|price|charges|budget|total|instalment|installment)\b/.test(q)
  );
}

function isFeeConversationActive(
  q: string,
  history: Pick<ChatMessage, 'role' | 'content'>[]
): { active: boolean; mergedSlots: FeeSlots } {
  const recent = history.slice(-6);
  const lastAssistant = recent.filter((m) => m.role === 'assistant').at(-1)?.content || '';
  const prevUsers = recent.filter((m) => m.role === 'user');
  const lastUser = prevUsers.at(-1)?.content || '';
  const lastUserNorm = normalizeText(lastUser);

  const pendingFromAssistant = isFeeClarifyingMessage(lastAssistant);
  const previousWasFee =
    isFeeIntentText(lastUserNorm) ||
    /fee structure breakdown|tuition fee|hostel & room type fee|indicative tuition fee overview/i.test(
      lastAssistant
    );
  const currentIsFee = isFeeIntentText(q);

  if (!currentIsFee && isExplicitNonFeeTopic(q)) {
    return { active: false, mergedSlots: parseFeeSlots('', false) };
  }

  const currentSlots = parseFeeSlots(q, pendingFromAssistant || previousWasFee || currentIsFee);

  const active =
    currentIsFee ||
    (pendingFromAssistant && !isExplicitNonFeeTopic(q) && hasAnySlot(currentSlots)) ||
    (previousWasFee && hasAnySlot(currentSlots));

  if (!active) {
    return { active: false, mergedSlots: currentSlots };
  }

  const merged: FeeSlots = {
    knownProgram: null,
    programLabel: null,
    unlistedProgram: null,
    roomType: null,
    roomRequestLabel: null,
    mess: 'unspecified',
    wantsTotal: currentSlots.wantsTotal,
  };

  for (let i = prevUsers.length - 1; i >= 0; i--) {
    const turnNorm = normalizeText(prevUsers[i].content);
    if (isExplicitNonFeeTopic(turnNorm)) break;
    const prevSlots = parseFeeSlots(turnNorm, true);
    if (!merged.knownProgram && !merged.unlistedProgram) {
      if (prevSlots.knownProgram) {
        merged.knownProgram = prevSlots.knownProgram;
        merged.programLabel = prevSlots.programLabel;
      } else if (prevSlots.unlistedProgram) {
        merged.unlistedProgram = prevSlots.unlistedProgram;
      }
    }
    if (!merged.roomType && prevSlots.roomType) {
      merged.roomType = prevSlots.roomType;
      merged.roomRequestLabel = prevSlots.roomRequestLabel;
    }
    if (merged.mess === 'unspecified' && prevSlots.mess !== 'unspecified') {
      merged.mess = prevSlots.mess;
    }
    if (prevSlots.wantsTotal) {
      merged.wantsTotal = true;
    }
  }

  if (currentSlots.knownProgram) {
    merged.knownProgram = currentSlots.knownProgram;
    merged.programLabel = currentSlots.programLabel;
    merged.unlistedProgram = null;
  } else if (currentSlots.unlistedProgram) {
    merged.unlistedProgram = currentSlots.unlistedProgram;
    merged.knownProgram = null;
    merged.programLabel = null;
  }

  if (currentSlots.roomType) {
    merged.roomType = currentSlots.roomType;
    merged.roomRequestLabel = currentSlots.roomRequestLabel;
  }

  if (currentSlots.mess !== 'unspecified') {
    merged.mess = currentSlots.mess;
  }

  return { active: true, mergedSlots: merged };
}

function buildStructuredFeeResponse(
  slots: FeeSlots,
  catalog: typeof records,
  used: Set<string>
): string {
  const cite = (id: string) => {
    if (catalog.some((r) => r.id === id)) used.add(id);
  };

  if (!slots.knownProgram && !slots.unlistedProgram && !slots.roomType) {
    return FEE_CLARIFYING_PROMPT;
  }

  const headingParts: string[] = [];
  if (slots.programLabel) headingParts.push(slots.programLabel);
  else if (slots.unlistedProgram) headingParts.push(slots.unlistedProgram);
  if (slots.roomRequestLabel) headingParts.push(slots.roomRequestLabel);

  const heading =
    headingParts.length > 0
      ? `**Fee Structure Breakdown — ${headingParts.join(' + ')}**`
      : '**Fee Structure Breakdown**';

  const lines: string[] = [heading, ''];

  // 1. Tuition Fee bullet
  if (slots.knownProgram) {
    const tuitionAnnual = fees.tuition[slots.knownProgram];
    cite(`tuition-${slots.knownProgram}`);
    const specNote =
      slots.programLabel && slots.programLabel !== slots.knownProgram
        ? ` (${slots.knownProgram} base indicative tuition; no separate specialization fee is listed here)`
        : '';
    lines.push(
      `- **Tuition Fee (${slots.programLabel || slots.knownProgram}):** ${formatPeriodAmount(tuitionAnnual)}${specNote}.`
    );
  } else if (slots.unlistedProgram) {
    cite('tuition-B.Tech');
    lines.push(
      `- **Tuition Fee (${slots.unlistedProgram}):** ${slots.unlistedProgram} tuition fees are not listed in this directory. Stored reference programmes are B.Tech at ${formatPeriodAmount(fees.tuition['B.Tech'])}, BCA at ${formatPeriodAmount(fees.tuition.BCA)}, and BBA at ${formatPeriodAmount(fees.tuition.BBA)}.`
    );
  } else {
    cite('tuition-B.Tech');
    lines.push(
      `- **Tuition Fee:** No programme was specified. Stored annual tuition rates are B.Tech at ${formatPeriodAmount(fees.tuition['B.Tech'])}, BCA at ${formatPeriodAmount(fees.tuition.BCA)}, and BBA at ${formatPeriodAmount(fees.tuition.BBA)}.`
    );
  }

  // 2. Hostel & Room Type Fee bullet
  let roomAnnualForTotal: number | null = null;
  if (slots.roomType === 'single') {
    cite('rooms');
    lines.push(
      `- **Hostel & Room Type Fee (${slots.roomRequestLabel || 'Single Room'}):** Single room fees are not listed in this directory. Stored reference room options are Double Non-AC at ${formatPeriodAmount(fees.standard)} and Double AC at ${formatPeriodAmount(fees.ac)}. For single-room availability and current charges, please verify with the GLA University Hostel Office.`
    );
  } else if (slots.roomType === 'triple') {
    cite('rooms');
    lines.push(
      `- **Hostel & Room Type Fee (${slots.roomRequestLabel || 'Triple Room'}):** Triple room fees are not listed in this directory. Stored reference room options are Double Non-AC at ${formatPeriodAmount(fees.standard)} and Double AC at ${formatPeriodAmount(fees.ac)}. For triple-seater availability and current charges, please verify with the GLA University Hostel Office.`
    );
  } else if (slots.roomType === 'quad') {
    cite('rooms');
    lines.push(
      `- **Hostel & Room Type Fee (${slots.roomRequestLabel || 'Four-Seater Room'}):** Four-seater room fees are not listed in this directory. Stored reference room options are Double Non-AC at ${formatPeriodAmount(fees.standard)} and Double AC at ${formatPeriodAmount(fees.ac)}.`
    );
  } else if (slots.roomType === 'double-ac') {
    cite('rooms');
    roomAnnualForTotal = fees.ac;
    lines.push(
      `- **Hostel & Room Type Fee (Double AC):** ${formatPeriodAmount(fees.ac)} (excludes mess).`
    );
  } else if (slots.roomType === 'double-non-ac') {
    cite('rooms');
    roomAnnualForTotal = fees.standard;
    lines.push(
      `- **Hostel & Room Type Fee (Double Non-AC):** ${formatPeriodAmount(fees.standard)} (excludes mess).`
    );
  } else if (slots.roomType === 'double-compare') {
    cite('rooms');
    const diff = fees.ac - fees.standard;
    lines.push(
      `- **Hostel & Room Type Fee (Double AC vs Double Non-AC):** Double Non-AC is ${formatPeriodAmount(fees.standard)} and Double AC is ${formatPeriodAmount(fees.ac)} — a difference of ${formatPeriodAmount(diff)} (both exclude mess). Single and triple room fees are not listed here.`
    );
  } else if (slots.roomType === 'day-scholar') {
    roomAnnualForTotal = 0;
    lines.push(
      `- **Hostel & Room Type Fee (Day Scholar):** ₹0 per year (no hostel room selected).`
    );
  } else {
    cite('rooms');
    lines.push(
      `- **Hostel & Room Type Fee:** Stored reference hostel options are Double Non-AC at ${formatPeriodAmount(fees.standard)} and Double AC at ${formatPeriodAmount(fees.ac)} (both exclude mess). Single and triple room fees are not listed here.`
    );
  }

  // 3. Optional Mess / Deposit bullet
  if (slots.roomType === 'day-scholar') {
    if (slots.mess === 'include') {
      cite('mess');
      lines.push(
        `- **Optional Mess / Deposit:** Optional mess plan is ${formatPeriodAmount(fees.mess)}. No hostel security deposit applies for day scholars.`
      );
    } else {
      lines.push(
        `- **Optional Mess / Deposit:** Not applicable for day scholars (no hostel deposit required).`
      );
    }
  } else {
    cite('mess');
    const messPrefix =
      slots.mess === 'include'
        ? 'Requested mess plan is'
        : slots.mess === 'exclude'
        ? 'Mess excluded as requested (optional mess plan is'
        : 'Optional mess plan is';
    const messSuffix = slots.mess === 'exclude' ? ')' : '';
    lines.push(
      `- **Optional Mess / Deposit:** ${messPrefix} ${formatPeriodAmount(fees.mess)} (not included in room fees)${messSuffix}, plus a one-time refundable hostel security deposit of ${money(fees.deposit)}.`
    );
  }

  // 4. Computed first-year total when both a listed programme AND a listed room/day-scholar option are known
  if (slots.knownProgram && roomAnnualForTotal !== null) {
    const tuitionAnnual = fees.tuition[slots.knownProgram];
    if (slots.mess === 'include') {
      const grandTotal = total(tuitionAnnual, roomAnnualForTotal, true);
      lines.push(
        `- **Estimated First-Year Total (With Mess):** ${money(grandTotal)} per year (includes tuition${roomAnnualForTotal ? ', hostel room, one-time ' + money(fees.deposit) + ' refundable deposit' : ''}, and mess).`
      );
    } else if (slots.mess === 'exclude' || slots.roomType === 'day-scholar') {
      const grandTotal = total(tuitionAnnual, roomAnnualForTotal, false);
      lines.push(
        `- **Estimated First-Year Total:** ${money(grandTotal)} per year (includes tuition${roomAnnualForTotal ? ', hostel room, and one-time ' + money(fees.deposit) + ' refundable deposit' : ''}).`
      );
    } else {
      const withoutMess = total(tuitionAnnual, roomAnnualForTotal, false);
      const withMess = total(tuitionAnnual, roomAnnualForTotal, true);
      lines.push(
        `- **Estimated First-Year Total:** ${money(withoutMess)} per year without mess (includes ${money(fees.deposit)} refundable deposit), or ${money(withMess)} per year with optional mess.`
      );
    }
  }

  lines.push('', INDICATIVE_FEE_DISCLAIMER);
  return lines.join('\n');
}

function detectLiveOrPersonalGuardrail(q: string): string | null {
  if (
    /\b(mess|hostel|dining|canteen)\b/.test(q) &&
    /\b(menu|dish|dishes|served|serving|khana|khaana|cooking)\b/.test(q)
  ) {
    return [
      'Live or daily hostel mess menus (including tomorrow’s menu) are not available in Campus Assist.',
      '',
      '- **Why:** Campus Assist provides general campus reference information and is not connected to live catering feeds.',
      '- **Where to verify:** Check your hostel block noticeboard, Hostel Mess Committee updates, or official GLA University channels (GLAMS).',
    ].join('\n');
  }

  if (
    /\b(bus|shuttle|transport)\b/.test(q) &&
    /\b(gps|live\s+location|right\s+now|where\s+is\s+the\s+bus|live\s+track|tracking|real[- ]?time)\b/.test(
      q
    )
  ) {
    return [
      'Live bus GPS tracking and real-time vehicle locations are not available in Campus Assist.',
      '',
      '- **Why:** Campus Assist does not connect to live transport telemetry.',
      '- **Where to verify:** Contact the GLA University Transport Office or check official university transport circulars.',
    ].join('\n');
  }

  if (
    /\bmy\s+(marks|attendance|grades|cgpa|sgpa|result|results|backlog|backlogs|dues|roll\s*number)\b/.test(
      q
    ) ||
    /\bwho\s+is\s+teaching\s+my\s+class\b/.test(q) ||
    /\bis\s+tomorrow\s+(?:a\s+)?holiday\b/.test(q) ||
    /\b(today'?s|tomorrow'?s)\s+(?:exact\s+)?(attendance|faculty|lecture\s+room|holiday\s+notice)\b/.test(
      q
    )
  ) {
    return [
      'Personal student records and live daily university updates are not available in Campus Assist.',
      '',
      '- **Why:** Campus Assist provides general student information and does not connect to private university academic systems.',
      '- **Where to verify:** Sign in to the official GLA University student portal (GLAMS) or contact your Department / Academic Office.',
    ].join('\n');
  }

  return null;
}

function detectUnlistedFacilityGuardrail(q: string): string | null {
  const matched: string[] = [];
  for (const [regex, label] of UNLISTED_FACILITIES) {
    if (regex.test(q) && !matched.includes(label)) {
      matched.push(label);
    }
  }
  if (matched.length === 0) return null;

  const listText =
    matched.length === 1
      ? matched[0]
      : `${matched.slice(0, -1).join(', ')} and ${matched[matched.length - 1]}`;

  return [
    `There is no record of a campus ${listText} in Campus Assist.`,
    '',
    '- **Available listings:** Campus Assist covers the Central Library, Residential Hostels, Academic Computing Labs, Sports & Recreation spaces, Dining & Mess Support, Campus Transport Desk, Campus Health & First Aid, and the Student Services Desk.',
    '- **Where to verify:** Please check the official GLA University website or campus administration desk for the official facilities directory.',
  ].join('\n');
}

function buildCompoundTuitionAndExamResponse(
  q: string,
  day: string,
  catalog: typeof records,
  used: Set<string>
): string {
  const cite = (id: string) => {
    if (catalog.some((r) => r.id === id)) used.add(id);
  };

  const slots = parseFeeSlots(q, true);
  const prog: KnownProgram = slots.knownProgram ?? 'B.Tech';
  const label = slots.programLabel || prog;
  const tuitionAnnual = fees.tuition[prog];
  cite(`tuition-${prog}`);

  const programExams = exams
    .filter((e) => e.program.toLowerCase() === prog.toLowerCase())
    .sort((a, b) => a.date.localeCompare(b.date));

  const upcomingProgramExams = programExams.filter((e) => e.date >= day);
  const displayExams = upcomingProgramExams.length > 0 ? upcomingProgramExams : programExams;

  const examLines =
    displayExams.length > 0
      ? displayExams.map((e) => `${e.subject} (Semester ${e.semester}) on ${e.date}`).join('; ')
      : 'No exam dates are listed for this programme';

  return [
    `Here are the reference ${label} tuition fee and examination schedule details:`,
    '',
    `- **Tuition Fee (${label}):** ${formatPeriodAmount(tuitionAnnual)}. Hostel and mess plans are optional extras.`,
    `- **Examination Schedule (${prog} Semester 1):** ${examLines} ${CAMPUS_REFERENCE_LABEL}.`,
    '',
    INDICATIVE_FEE_DISCLAIMER,
  ].join('\n');
}

function buildTransportResponse(catalog: typeof records, used: Set<string>): string {
  if (catalog.some((r) => r.id === 'travel')) used.add('travel');
  return [
    '**Campus Transport Guidance**',
    '',
    '- **Routes & Timings:** Live bus routes, boarding stops, and daily timings vary by academic term and city corridor and are not hardcoded in Campus Assist.',
    '- **Pass & Fee Verification:** Confirm official bus routes, boarding points, and transport fee circulars directly with the GLA University Transport Office or official university website.',
  ].join('\n');
}

function buildPlacementsResponse(catalog: typeof records, used: Set<string>): string {
  if (catalog.some((r) => r.id === 'career')) used.add('career');
  if (catalog.some((r) => r.id === 'intern')) used.add('intern');
  return [
    '**Placements & Internships Guidance**',
    '',
    '- **Preparation:** Keep an updated résumé and project portfolio ready for department reviews and training sessions.',
    '- **Official Drives & Schedules:** Placement drives, recruiter eligibility criteria, internship notices, and workshop schedules are announced through the official GLA University Training & Placement Cell and GLAMS portal.',
  ].join('\n');
}

function weightedKeywordLookup(
  q: string,
  catalog: typeof records
): { record: (typeof records)[number]; score: number } | null {
  const rawTokens = q.match(/[a-z0-9]+/g) || [];
  const tokens = Array.from(
    new Set(rawTokens.filter((w) => w.length > 2 && !GENERIC_STOPWORDS.has(w)))
  );
  if (tokens.length === 0) return null;

  const wantsTransport = /\b(bus|buses|shuttle|transport|commute)\b/.test(q);
  const wantsPlacements =
    /\b(placement|placements|internship|internships|career|careers|resume|recruiters)\b/.test(q);
  const wantsLibrary = /\b(library|books|opac|librarian|photocopy|printing|study\s+room)\b/.test(q);
  const wantsHostel = /\b(hostel|mess|dining|laundry|residential|room|rooms)\b/.test(q);
  const wantsClubs = /\b(club|clubs|society|societies|activities)\b/.test(q);
  const wantsEvents = /\b(event|events|calendar|notices|announcements)\b/.test(q);
  const wantsServices =
    /\b(ticket|request|id\s+card|repair|maintenance|counselling|counseling|wifi|internet)\b/.test(q);

  const ranked = catalog
    .map((r) => {
      const titleTokens = new Set(r.title.toLowerCase().split(/\W+/).filter(Boolean));
      const kwSet = new Set(r.keywords.map((k) => k.toLowerCase()));
      const contentLower = r.content.toLowerCase();

      let score = 0;
      for (const w of tokens) {
        const isHighWeight = HIGH_WEIGHT_DOMAIN_TERMS.has(w);
        const weightMultiplier = isHighWeight ? 2 : 1;

        if (titleTokens.has(w)) {
          score += 3 * weightMultiplier;
        } else if (kwSet.has(w)) {
          score += 2 * weightMultiplier;
        } else if (
          Array.from(kwSet).some((k) => k.length > 3 && (k.startsWith(w) || w.startsWith(k)))
        ) {
          score += 1.25 * weightMultiplier;
        } else if (contentLower.includes(w) && isHighWeight) {
          score += 1 * weightMultiplier;
        }
      }

      if (wantsTransport && r.category === 'Transport') score += 5;
      if (wantsPlacements && r.category === 'Placements') score += 5;
      if (wantsLibrary && r.category === 'Library') score += 3;
      if (wantsHostel && r.category === 'Hostels & Mess') score += 3;
      if (wantsClubs && r.category === 'Clubs & Societies') score += 3;
      if (wantsEvents && r.category === 'Campus Events') score += 3;
      if (wantsServices && r.category === 'Student Services') score += 3;

      return { record: r, score };
    })
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];
  if (!top || top.score < 3) return null;
  return top;
}

export function answer(
  question: string,
  history: Pick<ChatMessage, 'role' | 'content'>[] = [],
  day = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }),
  catalog = records,
  used = new Set<string>()
) {
  const q = normalizeText(question);
  const last = history.filter((m) => m.role === 'assistant').at(-1)?.content || '';
  const previous = history.filter((m) => m.role === 'user').at(-1)?.content.toLowerCase() || '';

  const fact = (id: string) => {
    const record = catalog.find((r) => r.id === id);
    if (record) used.add(id);
    return record?.content || 'That detail is not listed in Campus Assist.';
  };

  // 1. Shortening / one-line summary follow-up
  if (/one line|shorter|short version|briefly repeat/.test(q)) {
    return (
      last
        .match(/The library is open (.+?) on (Sunday|Saturday|weekdays)/i)
        ?.slice(1)
        .reverse()
        .join(': ') ||
      last.split(/(?<=\.)\s|\n/)[0] ||
      'Which campus topic would you like summarised?'
    );
  }

  // 2. Greeting / capabilities
  if (/^(hi|hey|hello|namaste)\b|what can you do/.test(q)) {
    return 'Welcome to Campus Assist. Ask about campus services, academics, facilities, student activities, or support resources.';
  }

  // 3. Strict Safe Fallback Guardrails (Live/Real-Time/Personal & Nonexistent Facilities)
  const liveGuard = detectLiveOrPersonalGuardrail(q);
  if (liveGuard) return liveGuard;

  const facilityGuard = detectUnlistedFacilityGuardrail(q);
  if (facilityGuard) return facilityGuard;

  if (/nonexistent|doesn.t exist|non-existent|unicorn|teleport|made.up/.test(q)) {
    return 'I don’t have that information listed in Campus Assist.';
  }

  // 4. Broad fee structure queries ("fees structure of all branches", "all course fees", etc.)
  //    Answer FIRST with a compact Markdown table + single disclaimer + follow-up prompt.
  if (isBroadFeeOverviewQuery(q)) {
    return buildBroadFeesOverviewResponse(catalog, used);
  }

  // 5. Compound Clubs + Events query ("Tell me about campus clubs and upcoming events")
  const asksClubs = /\b(clubs?|societ(?:y|ies)|student\s+activities|interest\s+areas?)\b/.test(q);
  const asksEvents = /\b(events?|upcoming\s+(?:events?|activities|notices)|announcements?|calendar)\b/.test(q);
  if (asksClubs && asksEvents) {
    return buildClubsAndEventsCompoundResponse(catalog, used);
  }

  // 6. Hostel facilities and rules guidance (MUST run BEFORE generic /policy|rule/ check!)
  if (
    /\b(hostel|hostels|residential\s+hall|dorm|accommodation)\b/.test(q) &&
    !/\b(fee|fees|tuition|cost|price|charges|kitni|kitna|total|budget|wifi|internet|repair|maintenance|menu)\b/.test(
      q
    ) &&
    /\b(facilit|rule|rules|policy|policies|guidance|about|overview|amenities|options|details|info|life)\b/.test(
      q
    )
  ) {
    return buildHostelFacilitiesAndGuidanceResponse(catalog, used);
  }

  // 7. Compound Tuition + Exam Schedule query
  if (
    /\b(tuition|fee|fees)\b/.test(q) &&
    /\b(exam|exams|examination|exam\s+schedule|exam\s+dates?)\b/.test(q)
  ) {
    return buildCompoundTuitionAndExamResponse(q, day, catalog, used);
  }

  // 8. Explicit Transport / Bus routes & timings
  if (/\b(bus|buses|shuttle|transport|commute)\b/.test(q) && !/\b(tuition|hostel\s+fee)\b/.test(q)) {
    return buildTransportResponse(catalog, used);
  }

  // 9. Explicit Placements & Internships
  if (
    /\b(placement|placements|internship|internships|career\s+studio|career\s+services|recruiters|resume\s+clinic)\b/.test(
      q
    ) &&
    !/\b(tuition|hostel\s+fee)\b/.test(q)
  ) {
    return buildPlacementsResponse(catalog, used);
  }

  // 10. Exam schedule check
  if (
    /exam|semester|sem\b|b\.tech|bca|bba/.test(q) &&
    !/\b(fee|fees|tuition|hostel|room|mess|instalment|installment)\b/.test(q) &&
    (/next exam|exam schedule|when.*exam/.test(q) ||
      /exam/.test(previous) ||
      /programme and semester/.test(last))
  ) {
    const scope = q + ' ' + previous;
    const program = Object.keys({ 'b.tech': 1, bca: 1, bba: 1 }).find((p) => scope.includes(p));
    const sem = scope.match(/sem(?:ester)?\s*([1-8])|([1-8])(?:st|nd|rd|th)\s*sem/);
    if (!program || !sem) return 'Which programme and semester should I check?';
    const e = exams
      .filter(
        (e) =>
          e.program.toLowerCase() === program &&
          e.semester === Number(sem[1] || sem[2]) &&
          e.date >= day
      )
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    return e
      ? `Your next listed exam is ${e.subject} on ${e.date} ${CAMPUS_REFERENCE_LABEL}.`
      : 'There are no upcoming exams listed for that programme and semester.';
  }

  // 11. Generic policy/rule fallback (after hostel facilities & rules!)
  if (/policy|rule/.test(q) && !/refund|borrow|payment/.test(q)) {
    return 'I don’t have that policy listed in Campus Assist. Please verify official policies through GLA University channels.';
  }

  if (/print|photocopy/.test(q)) return fact('print');
  if (/group.study|study room/.test(q)) return fact('study');
  if (/laundry|washing clothes/.test(q)) return fact('laundry');
  if (/breakfast|dinner|lunch|mess.*(?:timing|hours|open)/.test(q)) return fact('meal-hours');
  if (/wifi|internet/.test(q)) return fact('wifi');
  if (/route|directions|how do i get/.test(q) && /main gate/.test(q) && !/library/.test(q)) {
    return 'Which destination do you mean? Ask for campus navigation guidance or follow Main Gate signage toward the academic blocks and Central Library.';
  }
  if (/main gate|direction.*library/.test(q)) return fact('map');

  if (asksClubs) {
    const specific = catalog.find(
      (r) =>
        r.category === 'Clubs & Societies' &&
        r.id !== 'clubs' &&
        q.includes(r.title.toLowerCase())
    );
    if (specific) {
      used.add(specific.id);
      return `${specific.content}`;
    }
    return buildClubsOnlyResponse(catalog, used);
  }

  if (asksEvents) {
    return buildEventsOnlyResponse(catalog, used);
  }

  if (/student services/.test(q)) return fact('services');

  // 12. Direct mess-only inclusion question
  if (
    /\b(mess|meals)\b/.test(q) &&
    !/breakfast|lunch|dinner/.test(q) &&
    !/\b(fee|fees|tuition|total|budget|b\.tech|bca|bba|mba|mca|single|triple|double\s+ac|non[- ]?ac)\b/.test(
      q
    ) &&
    !isFeeClarifyingMessage(last)
  ) {
    return fact('mess');
  }

  // 13. Multi-turn & compound fee-structure / tuition / hostel fee handler
  const feeState = isFeeConversationActive(q, history);
  if (feeState.active) {
    return buildStructuredFeeResponse(feeState.mergedSlots, catalog, used);
  }

  // 14. Library services & hours (supports combined "library services and hours" and Sunday follow-ups)
  if (
    (/library/.test(q) ||
      (/library/i.test(last) && /sunday|saturday|weekday|timing|weekend|hours|it close/.test(q))) &&
    /sunday|saturday|weekday|timing|weekend|hours|open|clos/.test(q)
  ) {
    const days = /sunday/.test(q)
      ? ['Sunday']
      : /saturday/.test(q)
      ? ['Saturday']
      : /weekend/.test(q)
      ? ['Saturday', 'Sunday']
      : /weekday/.test(q)
      ? ['weekdays']
      : ['weekdays', 'Saturday', 'Sunday'];
    const hoursText = days.map((d) => fact('hours-' + d)).join(' ');
    if (/services|facilities|borrow|books/.test(q) && /library/.test(q)) {
      return `${fact('library')}\n\n${hoursText}`;
    }
    return hoursText;
  }
  if (/\blibrary\b/.test(q) && /tell me|about|borrow|books|facilities|services/.test(q)) {
    return fact('library');
  }

  // 15. Weekly timetable
  if (/timetable|class schedule/.test(q)) {
    const slots = catalog.filter((r) => r.id.startsWith('slot-'));
    const dayMatch = q.match(/monday|tuesday|wednesday|thursday|friday/i)?.[0];
    const matchedSlots = dayMatch
      ? slots.filter((r) => r.content.toLowerCase().startsWith(dayMatch.toLowerCase()))
      : slots.slice(0, 6);
    matchedSlots.forEach((r) => used.add(r.id));
    return matchedSlots.length > 0
      ? [
          `Here is the reference B.Tech 1st-year timetable${dayMatch ? ` for ${dayMatch}` : ''}:`,
          '',
          ...matchedSlots.map((r) => `- ${r.content}`),
        ].join('\n')
      : 'No classes are listed for that day.';
  }

  // 16. Weighted multi-term keyword retrieval with strict minimum score threshold
  const best = weightedKeywordLookup(q, catalog);
  if (best) {
    return fact(best.record.id);
  }

  return UNKNOWN_ANSWER_TEXT;
}
