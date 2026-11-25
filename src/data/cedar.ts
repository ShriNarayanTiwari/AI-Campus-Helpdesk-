import type { KnowledgeCategory, KnowledgeRecord } from '../types/campus.ts';
import {
  CLUBS_DIRECTORY,
  DEMO_TIMETABLE,
  STUDENT_ACTIVITIES_NOTICE,
} from './campusDirectory.ts';

export const fees = {
  tuition: { 'B.Tech': 120000, BCA: 80000, BBA: 76000 },
  ac: 72000,
  standard: 48000,
  mess: 30000,
  deposit: 5000,
};

export const money = (v: number) => '₹' + v.toLocaleString('en-IN');

export const total = (tuition: number, room: number, meals: boolean) =>
  tuition + room + (meals ? fees.mess : 0) + (room ? fees.deposit : 0);

export const hours = {
  weekdays: '8 AM to 8 PM',
  Saturday: '9 AM to 6 PM',
  Sunday: '10 AM to 5 PM',
};

export const exams = [
  { program: 'B.Tech', semester: 1, subject: 'Engineering Mathematics', date: '2026-12-11' },
  { program: 'B.Tech', semester: 1, subject: 'Digital Electronics', date: '2026-12-14' },
  { program: 'BCA', semester: 1, subject: 'Programming Fundamentals', date: '2026-12-12' },
  { program: 'BBA', semester: 1, subject: 'Business Communication', date: '2026-12-15' },
];

const FEE_REFERENCE_NOTE =
  'Figures are indicative. Verify current fees through official GLA University channels.';
const CAMPUS_REFERENCE_NOTE =
  '(For guidance — verify through official GLA University channels)';

type Entry = [string, KnowledgeCategory, string, string, string, string];

const dayTitleLabel = (day: string) =>
  day.charAt(0).toUpperCase() + day.slice(1);

const entries: Entry[] = [
  [
    'library',
    'Library',
    'Facilities & Borrowing',
    'Central Library',
    'library facilities books librarian opac reading borrowing services',
    'The Central Library offers quiet reading desks, group-study rooms, printing, and e-books. Bring your student ID to borrow up to four books for 14 days.',
  ],
  ...Object.entries(hours).map(
    ([day, time]): Entry => [
      'hours-' + day,
      'Library',
      'Opening Hours',
      dayTitleLabel(day) + ' Library Hours',
      'library timings opening closing hours ' + day.toLowerCase(),
      'The library is open ' + time + ' on ' + day + '.',
    ]
  ),
  [
    'hostel-guidance',
    'Hostels & Mess',
    'Facilities & Guidance',
    'Hostel Facilities and General Guidance',
    'hostel hostels facilities rules guidance accommodation rooms wifi maintenance residence allocation',
    'Double Non-AC and Double AC room categories are listed in the Campus Assist fee estimator; single and triple room categories are not listed here. Common residence-support topics include campus Wi-Fi assistance, shared common spaces, and logging room maintenance requests through Student Services. Final hostel policies, entry timings, and room allocations vary by residence block. For residence-specific rules, timings, and allocation details, verify through official hostel administration.',
  ],
  [
    'hostel',
    'Hostels & Mess',
    'Accommodation',
    'Residential Hostel Overview',
    'hostel accommodation residential rooms facilities shared lounge',
    'Campus Assist lists Double Non-AC and Double AC categories in the fee estimator, along with Wi-Fi and maintenance support guidance. Mess is a separate optional plan. For residence-specific rules, timings, and allocation details, verify through official hostel administration.',
  ],
  [
    'rooms',
    'Hostels & Mess',
    'Hostel Charges',
    'Hostel Room Fees',
    'hostel room fees compare double ac non-ac cheaper rent deposit',
    `Double non-AC is listed at ${money(fees.standard)} per year (${money(fees.standard / 2)} per semester) and Double AC at ${money(fees.ac)} per year (${money(fees.ac / 2)} per semester). Both exclude mess. A one-time refundable hostel deposit of ${money(fees.deposit)} applies. Single and triple room fees are not listed here. ${FEE_REFERENCE_NOTE}`,
  ],
  [
    'mess',
    'Hostels & Mess',
    'Dining & Meals',
    'Mess Dining Plan',
    'food mess dining meals include cheaper annual plan',
    `Neither room category includes mess. The optional mess plan is listed at ${money(fees.mess)} per year (${money(fees.mess / 2)} per semester) for daily meals. ${FEE_REFERENCE_NOTE}`,
  ],
  ...Object.entries(fees.tuition).map(
    ([p, v]): Entry => [
      'tuition-' + p,
      'Academics',
      'Tuition Fees',
      p + ' Tuition Fee',
      p.toLowerCase() + ' tuition annual fee semester instalment',
      `${p} tuition is listed at ${money(v)} per year (${money(v / 2)} per semester). Hostel and mess plans are optional extras. ${FEE_REFERENCE_NOTE}`,
    ]
  ),
  [
    'aid',
    'Academics',
    'Financial Aid',
    'Scholarships & Refunds',
    'scholarship refund payment merit financial aid',
    `Merit scholarship eligibility and refund terms are governed by university policy; confirm current scholarship criteria and fee refund rules through official GLA University channels.`,
  ],
  [
    'services',
    'Student Services',
    'Helpdesk & Support',
    'Student Services Desk',
    'student services help desk support requests welfare',
    'Student Services supports ID replacement inquiries, campus Wi-Fi troubleshooting, hostel room maintenance requests, and general student assistance. Open Student Services to submit and track a support request.',
  ],
  [
    'wifi',
    'Student Services',
    'IT & Network',
    'Campus & Hostel Wi-Fi Support',
    'wifi wi-fi internet network broken hostel login',
    'Reconnect to GLA Student Wi-Fi and sign in again with your student credentials. If connectivity issues persist, open Student Services and submit an IT & Wi-Fi support request with your hostel block and room number.',
  ],
  [
    'travel',
    'Transport',
    'Commute & Transport',
    'Campus Transport Guidance',
    'bus buses shuttle transport route routes commute pass timings',
    `Campus transport routes, bus timings, and pass charges vary by route and academic term. Verify current bus schedules, boarding points, and official transport fees with the GLA University Transport Office. ${CAMPUS_REFERENCE_NOTE}`,
  ],
  [
    'map',
    'Campus Facilities',
    'Campus Navigation',
    'Campus Navigation Guidance',
    'directions walk map main gate route library courtyard',
    'Follow the main campus signage from the Main Gate toward the academic blocks and the Central Library, or ask at the Main Gate security or Student Services desk for block-specific directions.',
  ],
  [
    'fac',
    'Campus Facilities',
    'Facilities Overview',
    'Campus Facilities Overview',
    'facilities sports labs medical clinic dining halls',
    'Campus facilities covered in Campus Assist include the Central Library, Residential Hostels, Academic Computing Labs, Sports & Recreation spaces, Dining & Mess Support, Campus Transport Desk, Campus Health & First Aid, and the Student Services Desk.',
  ],
  [
    'id-card',
    'Student Services',
    'ID & Cards',
    'Replacement ID Card',
    'lost id card replacement reissue identity',
    'For a lost or damaged student ID card, submit a Student Welfare request in Student Services with your programme and roll number, and confirm re-issue steps and charges with the university administration office.',
  ],
  [
    'repair',
    'Student Services',
    'Maintenance',
    'Hostel Room Repairs',
    'maintenance broken tap plumbing light fan repair',
    'For a hostel room repair, choose Hostel & Mess in Student Services. Include your hostel block, room number, and the item needing attention; you can follow the status in the support tracker.',
  ],
  [
    'care',
    'Student Services',
    'Wellbeing',
    'Student Wellbeing & Counselling',
    'counselling counseling counsellor stress appointment wellbeing',
    'Students seeking wellbeing or counselling guidance can log a Student Welfare inquiry in Student Services or contact official GLA University student welfare coordinators for appointment schedules.',
  ],
  [
    'health',
    'Campus Facilities',
    'Medical & First Aid',
    'Campus Health & First Aid',
    'medical clinic nurse health sick first-aid dispensary',
    'Campus health services provide basic daytime first-aid support. For current medical centre hours, doctor availability, and emergency numbers, verify through official GLA University channels.',
  ],
  [
    'sports',
    'Campus Facilities',
    'Athletics',
    'Sports & Recreation Facilities',
    'sports basketball badminton courts gym athletics',
    'Campus sports spaces include outdoor courts and recreational areas. Confirm facility timings, equipment issue, and court booking rules through campus sports administration.',
  ],
  [
    'labs',
    'Campus Facilities',
    'Academic Labs',
    'Academic Computing Labs',
    'engineering computer computing lab computers practical',
    'Academic computing labs support scheduled coursework and supervised practical sessions. Carry your student ID and verify lab schedules with your department.',
  ],
  [
    'laundry',
    'Hostels & Mess',
    'Hostel Services',
    'Hostel Laundry Guidance',
    'laundry washing clothes hostel counter',
    'Laundry arrangements vary by hostel block. For residence-specific laundry schedules and procedures, verify through official hostel administration.',
  ],
  [
    'print',
    'Library',
    'Printing Services',
    'Library Printing & Photocopy',
    'printing printer photocopy scan pages',
    'Printing and photocopy support is available near the library service area; carry your student ID and verify current per-page charges at the desk.',
  ],
  [
    'study',
    'Library',
    'Study Spaces',
    'Group-Study Room Bookings',
    'group study booking reserve rooms discussion',
    'Group-study spaces can be requested at the Central Library desk with student IDs. Confirm current booking duration limits with library staff.',
  ],
  [
    'meal-hours',
    'Hostels & Mess',
    'Mess Information',
    'Dining & Mess Guidance',
    'breakfast lunch dinner mess timings dining hall',
    `Mess serving hours and daily menus are managed by hostel administration and vary by residence block. Verify current dining timings on your hostel noticeboard or official GLA University channels.`,
  ],
  [
    'department',
    'Academics',
    'Departments',
    'Programmes & Departments',
    'courses programmes department admission degrees',
    'Programmes with indicative tuition listed in Campus Assist are B.Tech, BCA, and BBA. Verify the complete list of GLA University programmes, specialisations, and eligibility on the official university website.',
  ],
  [
    'intern',
    'Placements',
    'Internships',
    'Internship Guidance',
    'internship internships apply cv application portfolio training',
    `Prepare an updated résumé and project portfolio and check official GLA University Training & Placement notices for internship drives, eligibility criteria, and review schedules. ${CAMPUS_REFERENCE_NOTE}`,
  ],
  [
    'welcome',
    'Campus Life',
    'Orientation',
    'First-Week Student Checklist',
    'orientation fresher induction checklist onboarding',
    'Confirm your student ID and GLAMS portal login, connect to GLA Student Wi-Fi, review your section timetable through official department notices, and explore student interest areas.',
  ],
  [
    'career',
    'Placements',
    'Career Services',
    'Placements & Career Preparation',
    'placement placements internship internships careers recruiters resume interview workshops',
    `Campus placement drives, recruiter schedules, résumé workshops, and eligibility notices are coordinated through the official GLA University Training & Placement Cell. ${CAMPUS_REFERENCE_NOTE}`,
  ],
  [
    'clubs',
    'Clubs & Societies',
    'Student Interest Areas',
    'Student Activities & Interest Areas',
    'clubs societies join student groups activities interest areas',
    'Common student interest areas include ' +
      CLUBS_DIRECTORY.map((c) => c.name).join(', ') +
      '. ' +
      STUDENT_ACTIVITIES_NOTICE,
  ],
  [
    'events-notices',
    'Campus Events',
    'Activities & Notices',
    'Student Activities & Notices',
    'events upcoming notices announcements calendar activities',
    STUDENT_ACTIVITIES_NOTICE,
  ],
  ...CLUBS_DIRECTORY.map(
    (c): Entry => [
      c.id,
      'Clubs & Societies',
      c.category,
      c.name,
      `${c.name.toLowerCase()} ${c.category.toLowerCase()} student activity interest area`,
      `${c.description} ${STUDENT_ACTIVITIES_NOTICE}`,
    ]
  ),
  ...DEMO_TIMETABLE.map(
    (s, i): Entry => [
      'slot-' + i,
      'Academics',
      'Weekly Timetable',
      `${s.subject} (${s.day})`,
      `${s.day.toLowerCase()} timetable ${s.subject.toLowerCase()} ${s.code.toLowerCase()}`,
      s.day + ' ' + s.time + ' · ' + s.subject + ' (' + s.code + ') · ' + s.room + '.',
    ]
  ),
];

function dedupeTokens(raw: string): string[] {
  const tokens = raw
    .toLowerCase()
    .split(/[\s,/&]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
  return Array.from(new Set(tokens));
}

export const records: KnowledgeRecord[] = entries.map(
  ([id, category, subcategory, title, rawTags, content]) => {
    const cleanTags = dedupeTokens(rawTags);
    return {
      id,
      category,
      subcategory: subcategory !== category ? subcategory : 'General Guide',
      title,
      content,
      description: content,
      keywords: cleanTags,
      tags: cleanTags,
      sourceName: 'Campus Assist Directory',
      sourceUrl: 'https://www.gla.ac.in',
      sourceType: 'demo',
      sourceLabel: 'Prototype sample',
      verificationStatus: 'Prototype sample',
      lastReviewedDate: '2026-11-24',
      lastChecked: '2026-11-24',
      isPrototypeSample: true,
    };
  }
);
