import { records, exams, fees, money, total } from '../data/cedar.ts';
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

const SAMPLE_FEE_LABEL = '[Sample Demo Data — verify official GLA University Mathura fee circular]';
const FEE_CLARIFYING_PROMPT =
  'Which programme (e.g., B.Tech, BCA, BBA) and hostel room type (e.g., double AC, double non-AC, single room, or day scholar) would you like the sample fee structure for?';

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
  return `${money(annual)}/year (${money(Math.round(annual / 2))}/semester)`;
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
    /\b(single\s*(?:ac|non[- ]?ac)?\s*(?:room|seater|bed|occupancy|hostel)|1[- ]?seater|one[- ]?seater|solo\s*room|private\s*room)\b/.test(q) ||
    (allowBareRoomTokens && /\bsingle\b/.test(q));
  const hasTriple =
    /\b(triple\s*(?:ac|non[- ]?ac)?\s*(?:room|seater|bed|occupancy|hostel)|3[- ]?seater|three[- ]?seater)\b/.test(q) ||
    (allowBareRoomTokens && /\btriple\b/.test(q));
  const hasQuad =
    /\b(quad\s*(?:room|seater|hostel)|4[- ]?seater|four[- ]?seater)\b/.test(q);
  const hasDayScholar =
    /\b(day[- ]?scholar|no\s+hostel|without\s+hostel|without\s+room)\b/.test(q);
  const hasNonAc = /\bnon[- ]?ac\b|\bstandard\s*(?:room|double)\b|\bdouble\s*standard\b/.test(q);
  const hasAc = /\bdouble\s*ac\b|\b2[- ]?seater\s*ac\b|\btwo[- ]?seater\s*ac\b|\bac\s*(?:room|hostel|double)\b|\b(?<!non[- ]?)ac\b/.test(
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
  if (/\b(print|photocopy|lost\s+id|id\s+card|shuttle|bus\s+pass|wifi|wi-fi|library|laundry|club|event|exam|timetable|direction|route|main\s+gate|counselling|counseling|health|sports|lab|internship|career)\b/.test(q) && !/\b(fee|fees|tuition|instalment|installment)\b/.test(q)) {
    return false;
  }
  return /\b(fee|fees|tuition|fee\s+structure|instalment|installment|kitni|kitna|cost|price|charges|budget|total)\b/.test(q);
}

function isFeeClarifyingMessage(content: string): boolean {
  return /which programme|which room type|fee structure for|programme or room type|double ac or double non-ac/i.test(
    content
  );
}

function isExplicitNonFeeTopic(q: string): boolean {
  return (
    /\b(library|books?|clubs?|societ(?:y|ies)|events?|student\s+services|wifi|internet|laundry|print|photocopy|group[- ]?study|study\s+room|main\s+gate|directions?|route|timetable|class\s+schedule|exam|semester|counselling|counseling|health\s+desk|sports|shuttle|bus\s+pass|id\s+card|internship|career\s+studio|breakfast|lunch|dinner)\b/.test(
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
    /fee structure breakdown|tuition fee|hostel & room type fee/i.test(lastAssistant);
  const currentIsFee = isFeeIntentText(q);

  if (!currentIsFee && isExplicitNonFeeTopic(q)) {
    return { active: false, mergedSlots: parseFeeSlots('', false) };
  }

  const currentSlots = parseFeeSlots(q, pendingFromAssistant || previousWasFee || currentIsFee);

  // Trigger fee flow if:
  // 1) Current message explicitly asks about fees/tuition/costs, OR
  // 2) Previous assistant turn asked a fee clarifying question, OR
  // 3) Previous turn was about fees AND current turn supplies a fee slot (programme, room type, or mess)
  const active =
    currentIsFee ||
    (pendingFromAssistant && !isExplicitNonFeeTopic(q)) ||
    (previousWasFee && hasAnySlot(currentSlots));

  if (!active) {
    return { active: false, mergedSlots: currentSlots };
  }

  // Gather prior slots from the active fee conversation window (latest non-null wins, with current turn highest priority)
  const merged: FeeSlots = {
    knownProgram: null,
    programLabel: null,
    unlistedProgram: null,
    roomType: null,
    roomRequestLabel: null,
    mess: 'unspecified',
    wantsTotal: currentSlots.wantsTotal,
  };

  // Walk backwards through recent user turns belonging to the fee conversation
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

  // Override with explicitly specified slots from current turn
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

  // If neither programme nor room type was provided, ask for both clearly
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

  const lines: string[] = [heading, SAMPLE_FEE_LABEL, ''];

  // 1. Tuition Fee bullet
  if (slots.knownProgram) {
    const tuitionAnnual = fees.tuition[slots.knownProgram];
    cite(`tuition-${slots.knownProgram}`);
    const specNote =
      slots.programLabel && slots.programLabel !== slots.knownProgram
        ? ` (${slots.knownProgram} base sample tuition; no separate specialization fee is listed in this demo knowledge base)`
        : '';
    lines.push(
      `- **Tuition Fee (${slots.programLabel || slots.knownProgram}):** ${formatPeriodAmount(tuitionAnnual)}${specNote} ${SAMPLE_FEE_LABEL}.`
    );
  } else if (slots.unlistedProgram) {
    cite('tuition-B.Tech');
    lines.push(
      `- **Tuition Fee (${slots.unlistedProgram}):** ${slots.unlistedProgram} tuition fees are not listed in this demo knowledge base. Available sample programmes are B.Tech at ${formatPeriodAmount(fees.tuition['B.Tech'])}, BCA at ${formatPeriodAmount(fees.tuition.BCA)}, and BBA at ${formatPeriodAmount(fees.tuition.BBA)} ${SAMPLE_FEE_LABEL}. Please verify official ${slots.unlistedProgram} tuition fees via the official GLA University Mathura Admissions Office or fee circular.`
    );
  } else {
    cite('tuition-B.Tech');
    lines.push(
      `- **Tuition Fee:** No programme was specified. Sample annual tuition rates in this demo knowledge base are B.Tech at ${formatPeriodAmount(fees.tuition['B.Tech'])}, BCA at ${formatPeriodAmount(fees.tuition.BCA)}, and BBA at ${formatPeriodAmount(fees.tuition.BBA)} ${SAMPLE_FEE_LABEL}. Reply with your programme (e.g., B.Tech CSE, BCA, or BBA) for a programme-specific breakdown.`
    );
  }

  // 2. Hostel & Room Type Fee bullet
  let roomAnnualForTotal: number | null = null;
  if (slots.roomType === 'single') {
    cite('rooms');
    lines.push(
      `- **Hostel & Room Type Fee (${slots.roomRequestLabel || 'Single Room'}):** Single room fees are not listed in this demo knowledge base. Available sample room options are Double Non-AC at ${formatPeriodAmount(fees.standard)} and Double AC at ${formatPeriodAmount(fees.ac)} ${SAMPLE_FEE_LABEL}. For official single-room availability and current charges, please contact the official GLA University Mathura Hostel Office or check the official portal below.`
    );
  } else if (slots.roomType === 'triple') {
    cite('rooms');
    lines.push(
      `- **Hostel & Room Type Fee (${slots.roomRequestLabel || 'Triple Room'}):** Triple room fees are not listed in this demo knowledge base. Available sample room options are Double Non-AC at ${formatPeriodAmount(fees.standard)} and Double AC at ${formatPeriodAmount(fees.ac)} ${SAMPLE_FEE_LABEL}. For official triple-seater availability and current charges, please contact the official GLA University Mathura Hostel Office or check the official portal below.`
    );
  } else if (slots.roomType === 'quad') {
    cite('rooms');
    lines.push(
      `- **Hostel & Room Type Fee (${slots.roomRequestLabel || 'Four-Seater Room'}):** Four-seater room fees are not listed in this demo knowledge base. Available sample room options are Double Non-AC at ${formatPeriodAmount(fees.standard)} and Double AC at ${formatPeriodAmount(fees.ac)} ${SAMPLE_FEE_LABEL}. Please confirm official room options with the official GLA University Mathura Hostel Office or portal below.`
    );
  } else if (slots.roomType === 'double-ac') {
    cite('rooms');
    roomAnnualForTotal = fees.ac;
    lines.push(
      `- **Hostel & Room Type Fee (Double AC):** ${formatPeriodAmount(fees.ac)} (excludes mess) ${SAMPLE_FEE_LABEL}.`
    );
  } else if (slots.roomType === 'double-non-ac') {
    cite('rooms');
    roomAnnualForTotal = fees.standard;
    lines.push(
      `- **Hostel & Room Type Fee (Double Non-AC):** ${formatPeriodAmount(fees.standard)} (excludes mess) ${SAMPLE_FEE_LABEL}.`
    );
  } else if (slots.roomType === 'double-compare') {
    cite('rooms');
    const diff = fees.ac - fees.standard;
    lines.push(
      `- **Hostel & Room Type Fee (Double AC vs Double Non-AC):** Double Non-AC is ${formatPeriodAmount(fees.standard)} and Double AC is ${formatPeriodAmount(fees.ac)} — a difference of ${formatPeriodAmount(diff)} (both exclude mess) ${SAMPLE_FEE_LABEL}. Single and triple room fees are not listed in this demo knowledge base; verify official room types with the GLA Hostel Office or official portal below.`
    );
  } else if (slots.roomType === 'day-scholar') {
    roomAnnualForTotal = 0;
    lines.push(
      `- **Hostel & Room Type Fee (Day Scholar):** ₹0/year (no hostel room selected).`
    );
  } else {
    cite('rooms');
    lines.push(
      `- **Hostel & Room Type Fee:** Available sample hostel room options are Double Non-AC at ${formatPeriodAmount(fees.standard)} and Double AC at ${formatPeriodAmount(fees.ac)} (both exclude mess) ${SAMPLE_FEE_LABEL}. Single and triple room fees are not listed in this demo knowledge base — verify official hostel options and fees with the GLA University Mathura Hostel Office or official portal below.`
    );
  }

  // 3. Optional Mess / Deposit bullet
  if (slots.roomType === 'day-scholar') {
    if (slots.mess === 'include') {
      cite('mess');
      lines.push(
        `- **Optional Mess / Deposit:** Optional mess plan is ${formatPeriodAmount(fees.mess)} covering breakfast, lunch, and dinner ${SAMPLE_FEE_LABEL}. No hostel security deposit applies for day scholars.`
      );
    } else {
      lines.push(
        `- **Optional Mess / Deposit:** Not applicable for day scholars (no hostel deposit required; optional dining details can be confirmed on the official GLA University portal).`
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
      `- **Optional Mess / Deposit:** ${messPrefix} ${formatPeriodAmount(fees.mess)} covering breakfast, lunch, and dinner (not included in room fees)${messSuffix}, plus a one-time refundable hostel security deposit of ${money(fees.deposit)} ${SAMPLE_FEE_LABEL}.`
    );
  }

  // 4. Optional computed first-year total when both a listed programme AND a listed room/day-scholar option are known
  if (slots.knownProgram && roomAnnualForTotal !== null) {
    const tuitionAnnual = fees.tuition[slots.knownProgram];
    if (slots.mess === 'include') {
      const grandTotal = total(tuitionAnnual, roomAnnualForTotal, true);
      lines.push(
        `- **Estimated First-Year Sample Total (With Mess):** ${money(grandTotal)} per year (includes tuition${roomAnnualForTotal ? ', hostel room, one-time ' + money(fees.deposit) + ' refundable deposit' : ''}, and mess) ${SAMPLE_FEE_LABEL}.`
      );
    } else if (slots.mess === 'exclude' || slots.roomType === 'day-scholar') {
      const grandTotal = total(tuitionAnnual, roomAnnualForTotal, false);
      lines.push(
        `- **Estimated First-Year Sample Total:** ${money(grandTotal)} per year (includes tuition${roomAnnualForTotal ? ', hostel room, and one-time ' + money(fees.deposit) + ' refundable deposit' : ''}) ${SAMPLE_FEE_LABEL}.`
      );
    } else {
      const withoutMess = total(tuitionAnnual, roomAnnualForTotal, false);
      const withMess = total(tuitionAnnual, roomAnnualForTotal, true);
      lines.push(
        `- **Estimated First-Year Sample Total:** ${money(withoutMess)} per year without mess (includes ${money(fees.deposit)} refundable deposit), or ${money(withMess)} per year with optional mess ${SAMPLE_FEE_LABEL}.`
      );
    }
  }

  return lines.join('\n');
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
    return record?.content || 'That detail is missing from the campus handbook.';
  };

  if (/one line|shorter|short version|briefly repeat/.test(q)) {
    return (
      last
        .match(/The library is open (.+?) on (Sunday|Saturday|weekdays)/i)
        ?.slice(1)
        .reverse()
        .join(': ') ||
      last.split(/(?<=\.)\s|\n/)[0] ||
      'Which campus topic should I summarise?'
    );
  }
  if (/^(hi|hey|hello|namaste)\b|what can you do/.test(q)) {
    return 'Hi! I can help you find a room, compare fees, check library hours, join a club or track a campus ticket. What do you need?';
  }
  if (/my (marks|attendance|grades)|nonexistent|doesn.t exist|non-existent|unicorn|teleport|made.up/.test(q)) {
    return 'I don’t have that information in the campus handbook.';
  }

  // Exam schedule check (guarded against fee questions so topic switches work cleanly)
  if (
    /exam|semester|sem\b|b\.tech|bca|bba/.test(q) &&
    !/\b(fee|fees|tuition|hostel|room|mess|instalment|installment)\b/.test(q) &&
    (/next exam|exam schedule|when.*exam/.test(q) || /exam/.test(previous) || /programme and semester/.test(last))
  ) {
    const scope = q + ' ' + previous;
    const program = Object.keys({ 'b.tech': 1, bca: 1, bba: 1 }).find((p) => scope.includes(p));
    const sem = scope.match(/sem(?:ester)?\s*([1-8])|([1-8])(?:st|nd|rd|th)\s*sem/);
    if (!program || !sem) return 'Which programme and semester should I check?';
    const e = exams
      .filter((e) => e.program.toLowerCase() === program && e.semester === Number(sem[1] || sem[2]) && e.date >= day)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    return e
      ? 'Your next listed exam is ' + e.subject + ' on ' + e.date + '.'
      : 'There are no upcoming exams listed for that programme and semester.';
  }

  if (/policy|rule/.test(q) && !/refund|borrow|payment/.test(q)) {
    return 'I don’t have that policy in the campus handbook.';
  }
  if (/print|photocopy/.test(q)) return fact('print');
  if (/group.study|study room/.test(q)) return fact('study');
  if (/laundry|washing clothes/.test(q)) return fact('laundry');
  if (/breakfast|dinner|lunch|mess.*(?:timing|hours|open)/.test(q)) return fact('meal-hours');
  if (/wifi|internet/.test(q)) return fact('wifi');
  if (/route|directions|how do i get/.test(q) && /main gate/.test(q) && !/library/.test(q)) {
    return 'Which destination do you mean? I have the walking route from Main Gate to Central Library.';
  }
  if (/main gate|direction.*library/.test(q)) return fact('map');
  if (/club|societ|meet|join/.test(q)) {
    const specific = catalog.find(
      (r) => r.category === 'Clubs & Societies' && r.id !== 'clubs' && q.includes(r.title.toLowerCase())
    );
    if (specific) return specific.content + ' Select Register Interest on its club card to join.';
  }
  if (/student services/.test(q)) return fact('services');
  if (/clubs? (can|are)|what clubs|join a club/.test(q)) return fact('clubs');

  // Direct mess-only inclusion question (e.g., "Does the cheaper one include mess?")
  if (
    /\b(mess|meals)\b/.test(q) &&
    !/breakfast|lunch|dinner/.test(q) &&
    !/\b(fee|fees|tuition|total|budget|b\.tech|bca|bba|mba|mca|single|triple|double\s+ac|non[- ]?ac)\b/.test(q) &&
    !isFeeClarifyingMessage(last)
  ) {
    return fact('mess');
  }

  // Multi-turn & compound fee-structure / tuition / hostel fee handler
  const feeState = isFeeConversationActive(q, history);
  if (feeState.active) {
    return buildStructuredFeeResponse(feeState.mergedSlots, catalog, used);
  }

  if (
    (/library/.test(q) || (/library/i.test(last) && /sunday|saturday|weekday|timing|weekend|hours|it close/.test(q))) &&
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
    return days.map((d) => fact('hours-' + d)).join(' ');
  }
  if (/^.*\blibrary\b/.test(q) && /tell me|about|borrow|books|facilities/.test(q)) return fact('library');
  if (/events?/.test(q) && /upcoming|what|next/.test(q)) {
    return (
      catalog
        .filter((r) => r.category === 'Campus Events' && (r.content.match(/\d{4}-\d\d-\d\d/)?.[0] || '') >= day)
        .slice(0, 3)
        .map((r) => r.content)
        .join('\n') || 'No upcoming events are listed.'
    );
  }
  if (/hostel|residential hall/.test(q) && /about|facilit|options/.test(q)) return fact('hostel');
  if (/timetable|class schedule/.test(q)) {
    const slots = catalog.filter((r) => r.id.startsWith('slot-'));
    const dayMatch = q.match(/monday|tuesday|wednesday|thursday|friday/i)?.[0];
    return (
      (dayMatch ? slots.filter((r) => r.content.toLowerCase().startsWith(dayMatch)) : slots)
        .map((r) => r.content)
        .join('\n') || 'No classes are listed for that day.'
    );
  }
  const words =
    q
      .match(/[a-z0-9]+/g)
      ?.filter(
        (w) =>
          w.length > 2 &&
          !['the', 'tell', 'what', 'about', 'can', 'with', 'and', 'does', 'you', 'how', 'are', 'that', 'for', 'its', 'have'].includes(w)
      ) || [];
  const ranked = catalog
    .map((r) => ({
      r,
      score: words.reduce(
        (n, w) => n + (r.title.toLowerCase().split(/\W+/).includes(w) ? 3 : r.keywords.includes(w) ? 1 : 0),
        0
      ),
    }))
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.score
    ? fact(ranked[0].r.id)
    : 'I don’t have that detail in the campus handbook. I can help with facilities, fees, classes, clubs, events or student services.';
}
