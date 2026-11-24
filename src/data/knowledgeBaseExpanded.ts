import type { KnowledgeCategory, KnowledgeRecord } from '../types/campus.ts';

const REVIEWED_DATE = '2026-11-23';

interface ExpandedSampleInput {
  id: string;
  title: string;
  category: KnowledgeCategory;
  subcategory: string;
  content: string;
  tags: string[];
  sourceUrl: string;
}

/**
 * Expanded Prototype Sample Knowledge Records (118 curated, illustrative student-guide records).
 *
 * STRICT DATA INTEGRITY POLICY:
 * - Every record here is explicitly classified as `sourceType: 'demo'`, `isPrototypeSample: true`,
 *   and `verificationStatus: 'Prototype sample'`.
 * - None of these records invent official GLA University fees, examination dates, placement
 *   statistics, faculty details, phone numbers, hostel rules, emergency contacts, bus schedules,
 *   official policies, or announcements.
 * - They provide practical first-year student guidance, campus workflows, club templates,
 *   study frameworks, and career preparation checklists that remain excluded from normal AI
 *   answers unless the user explicitly asks for prototype/sample guidance.
 */
const RAW_EXPANDED_PROTOTYPE_RECORDS: ExpandedSampleInput[] = [
  // =========================================================================
  // 1. ACADEMICS (18 Prototype Sample Records)
  // =========================================================================
  {
    id: 'kb-exp-acad-01',
    title: 'Choosing a First-Year Study Group Strategy (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Study Support',
    content:
      'Prototype sample study guide: Form small 3-to-4-student peer groups early in the semester to review calculus, physics, and introductory programming problem sets weekly. Rotate who explains each topic aloud so every member spots conceptual gaps before sessional assessments.',
    tags: ['study group', 'first year', 'peer learning', 'btech', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
  },
  {
    id: 'kb-exp-acad-02',
    title: 'Organizing Engineering Lab Files & Observation Notes (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Lab Preparation',
    content:
      'Prototype sample lab guide: Maintain a dated index in every practical notebook, write circuit diagrams or algorithm flowcharts neatly before entering the lab, and keep digital backups of code submissions. Always verify official evaluation rubrics with your lab instructor or GLAMS.',
    tags: ['lab file', 'practicals', 'observations', 'engineering labs', 'prototype', 'sample'],
    sourceUrl: 'https://student.glauniversity.in/main/',
  },
  {
    id: 'kb-exp-acad-03',
    title: 'Effective Note-Taking for Smart Amphitheater Lectures (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Study Support',
    content:
      'Prototype sample study workflow: Use the Cornell note layout during 50-minute lectures—record key definitions in the main column, write viva-style recall questions in the margin, and write a 3-line summary within 24 hours to boost retention.',
    tags: ['notes', 'cornell method', 'lectures', 'study tips', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
  },
  {
    id: 'kb-exp-acad-04',
    title: 'Using Reference Textbooks Alongside Classroom Slides (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Library Resources',
    content:
      'Prototype sample library tip: Pair lecture slides with standard reference textbooks located via KOHA Web OPAC to practice worked numerical problems. Borrow high-demand titles ahead of assessment weeks and confirm loan durations at the library circulation desk.',
    tags: ['textbooks', 'library', 'opac', 'study resources', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
  },
  {
    id: 'kb-exp-acad-05',
    title: 'Structuring a 14-Day Mid-Term & End-Term Revision Plan (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Exam Preparation',
    content:
      'Prototype sample exam prep plan: Divide subjects into conceptual, derivation-heavy, and coding modules. Spend days 1–8 revising core units, days 9–12 solving past-pattern practice questions under timed conditions, and the final two days reviewing formula sheets. Confirm real exam schedules only on GLAMS.',
    tags: ['exam prep', 'revision plan', 'mid term', 'end term', 'study schedule', 'prototype', 'sample'],
    sourceUrl: 'https://student.glauniversity.in/main/',
  },
  {
    id: 'kb-exp-acad-06',
    title: 'Preparing for First-Year Practical Viva Voce Questions (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Exam Preparation',
    content:
      'Prototype sample viva checklist: Review the objective, apparatus or software stack, edge cases, and real-world applications of every experiment in your syllabus. Practice explaining each lab step concisely in under two minutes.',
    tags: ['viva', 'practical exam', 'oral assessment', 'preparation', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
  },
  {
    id: 'kb-exp-acad-07',
    title: 'Academic Mentoring & Office-Hours Preparation Checklist (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Mentoring',
    content:
      'Prototype sample mentoring guide: Before meeting a faculty mentor or senior peer tutor, list 2–3 specific doubts along with the steps you already tried. Bringing attempted solutions leads to faster, clearer feedback than broad open-ended questions.',
    tags: ['mentoring', 'academic advisor', 'doubts', 'faculty guidance', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-acad-08',
    title: 'First-Year Mini-Project Ideation & Scoping Framework (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Project Guidance',
    content:
      'Prototype sample project guide: Pick a real campus or community problem with a clear 4-week MVP scope, define input/output behavior early, split work across UI, logic, and documentation, and reserve at least 4 days for end-to-end testing before presentation.',
    tags: ['mini project', 'btech project', 'mvp', 'scoping', 'teamwork', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
  },
  {
    id: 'kb-exp-acad-09',
    title: 'Writing Clean Academic Project Reports & Citations (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Project Guidance',
    content:
      'Prototype sample documentation guide: Structure technical reports with Abstract, Problem Statement, System Architecture, Implementation Details, Test Cases, Limitations, and References. Always cite official sources accurately and avoid copying unattributed text.',
    tags: ['project report', 'citations', 'academic writing', 'plagiarism', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
  },
  {
    id: 'kb-exp-acad-10',
    title: 'Delivering a Confident 5-Minute Project Viva Demo (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Project Guidance',
    content:
      'Prototype sample presentation guide: Spend 60 seconds on the problem statement, 2 minutes walking through a live working user journey, 1 minute explaining core logic and safeguards, and 60 seconds transparently sharing limitations and future scope.',
    tags: ['viva demo', 'presentation', 'slides', 'project evaluation', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
  },
  {
    id: 'kb-exp-acad-11',
    title: 'How to Track Academic Calendar Milestones Safely (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Academic Calendar Guidance',
    content:
      'Prototype sample planning tip: At the start of each semester, check the official university academic calendar on gla.ac.in or GLAMS and copy verified teaching windows, project milestones, and break periods into your personal planner. Never rely on unverified social media forwards for exam dates.',
    tags: ['academic calendar', 'semester planning', 'glams', 'deadlines', 'prototype', 'sample'],
    sourceUrl: 'https://student.glauniversity.in/main/',
  },
  {
    id: 'kb-exp-acad-12',
    title: 'Understanding Credit-Based Coursework & Elective Exploration (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Programmes Guidance',
    content:
      'Prototype sample curriculum guide: Balance foundational theory courses, laboratory credits, and skill-enhancement modules across semesters. Review official institute curriculum brochures on gla.ac.in before selecting future specialization tracks or open electives.',
    tags: ['credits', 'curriculum', 'electives', 'specializations', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
  },
  {
    id: 'kb-exp-acad-13',
    title: 'Transitioning from School Coding to University Programming Labs (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Study Support',
    content:
      'Prototype sample coding guide: Practice writing modular functions, dry-running loops on paper, and using a debugger to inspect variables rather than memorizing syntax. Consistent 30-minute daily coding builds stronger fluency than last-minute cramming.',
    tags: ['programming', 'c language', 'python', 'debugging', 'first year', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
  },
  {
    id: 'kb-exp-acad-14',
    title: 'Using Digital E-Journals for Literature Reviews (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Library Resources',
    content:
      'Prototype sample research tip: When writing seminar papers, search subscribed academic portals such as Scopus or Emerald Insight using Boolean operators (AND, OR, quotes) and filter by peer-reviewed survey articles first to grasp a field quickly.',
    tags: ['research papers', 'literature review', 'scopus', 'e-journals', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
  },
  {
    id: 'kb-exp-acad-15',
    title: 'Academic Integrity & Originality Self-Check Habits (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Library Resources',
    content:
      'Prototype sample integrity guide: Paraphrase reference ideas in your own words, enclose direct quotes properly, keep a running bibliography while drafting, and review originality reports responsibly using approved institutional tools.',
    tags: ['academic integrity', 'originality', 'turnitin', 'referencing', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
  },
  {
    id: 'kb-exp-acad-16',
    title: 'Balancing Theory Lectures, Tutorials & Self-Study Hours (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Study Support',
    content:
      'Prototype sample weekly routine: Dedicate 20 minutes after classes to review same-day notes, use tutorial slots to clear numerical doubts immediately, and reserve weekend mornings for uninterrupted lab practice or project building.',
    tags: ['tutorials', 'self study', 'routine', 'time blocking', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
  },
  {
    id: 'kb-exp-acad-17',
    title: 'Exploring Interdisciplinary Tracks Across GLA Institutes (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Programmes Guidance',
    content:
      'Prototype sample academic guide: Engineering, management, pharmacy, law, and applied-science students can collaborate through multidisciplinary clubs, hackathons, and innovation challenges. Check official institute notices for formal minor or audit options.',
    tags: ['interdisciplinary', 'iet', 'ibm', 'pharmacy', 'collaboration', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
  },
  {
    id: 'kb-exp-acad-18',
    title: 'Post-Exam Reflection & Continuous Improvement Checklist (Prototype Sample)',
    category: 'Academics',
    subcategory: 'Exam Preparation',
    content:
      'Prototype sample study habit: After graded assessments return on GLAMS, categorize mistakes into concept gaps, calculation slips, or time-management bottlenecks so you can target weak topics cleanly before the next evaluation.',
    tags: ['reflection', 'grades', 'assessment', 'improvement', 'prototype', 'sample'],
    sourceUrl: 'https://student.glauniversity.in/main/',
  },

  // =========================================================================
  // 2. CAMPUS FACILITIES (18 Prototype Sample Records)
  // =========================================================================
  {
    id: 'kb-exp-fac-01',
    title: 'Quiet Reading Zone Etiquette in Campus Libraries (Prototype Sample)',
    category: 'Library',
    subcategory: 'Reading Spaces',
    content:
      'Prototype sample etiquette guide: Keep mobile devices on silent mode in quiet reading halls, use headphones at low volume at computer terminals, avoid reserving empty seats with unattended bags, and return reference volumes to designated carts.',
    tags: ['reading space', 'library etiquette', 'quiet study', 'seats', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
  },
  {
    id: 'kb-exp-fac-02',
    title: 'Group Study vs Solo Deep-Work Spaces on Campus (Prototype Sample)',
    category: 'Campus Facilities',
    subcategory: 'Reading Spaces',
    content:
      'Prototype sample space guide: Use quiet reading halls for solo textbook revision and note consolidation, while reserving collaborative discussion zones, hostel common rooms, or club study circles for brainstorming and coding sprints.',
    tags: ['study spaces', 'deep work', 'group study', 'common room', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-fac-03',
    title: 'Computer Lab Login & File Backup Hygiene (Prototype Sample)',
    category: 'Campus Facilities',
    subcategory: 'Computer Labs',
    content:
      'Prototype sample IT checklist: Always save lab source code to your own cloud drive or Git repository before logging out of shared computing workstations, and sign out of personal accounts cleanly at the end of every practical session.',
    tags: ['computer labs', 'backup', 'git', 'workstation', 'security', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-fac-04',
    title: 'Troubleshooting Campus Wi-Fi Connectivity Basics (Prototype Sample)',
    category: 'Campus Facilities',
    subcategory: 'Wi-Fi Help',
    content:
      'Prototype sample Wi-Fi checklist: If campus Wi-Fi drops, toggle airplane mode, forget and reconnect to the official SSID, verify captive-portal sign-in in a browser tab, and disable conflicting VPN profiles. Report persistent room dead-zones through official IT support channels.',
    tags: ['wifi', 'troubleshooting', 'internet', 'network help', 'it support', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-fac-05',
    title: 'Preparing Devices for High-Bandwidth Coding & Lab Sessions (Prototype Sample)',
    category: 'Campus Facilities',
    subcategory: 'Wi-Fi Help',
    content:
      'Prototype sample productivity tip: Download large SDKs, Docker images, or offline documentation during low-traffic morning hours so classroom workshops and live lab sessions run smoothly without waiting on large installs.',
    tags: ['bandwidth', 'downloads', 'sdk', 'laptop setup', 'wifi', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-fac-06',
    title: 'Starting a Beginner Fitness Routine at Campus Sports Facilities (Prototype Sample)',
    category: 'Campus Facilities',
    subcategory: 'Sports & Fitness',
    content:
      'Prototype sample wellness tip: Start with 30 minutes of light jogging, badminton, or guided gym sessions three times a week, wear non-marking athletic shoes on courts, carry a refillable water bottle, and check current facility slots locally with the Sports Office.',
    tags: ['sports', 'gym', 'fitness', 'badminton', 'running', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-fac-07',
    title: 'Borrowing Sports Gear & Joining Pickup Games (Prototype Sample)',
    category: 'Campus Facilities',
    subcategory: 'Sports & Fitness',
    content:
      'Prototype sample recreation guide: Evening hours after lectures are popular for informal cricket, basketball, volleyball, and football games. Keep your student ID ready if borrowing university sports equipment from official issue counters.',
    tags: ['sports equipment', 'cricket', 'basketball', 'volleyball', 'football', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-fac-08',
    title: 'Navigating Campus Cafeterias & Peak Break Windows (Prototype Sample)',
    category: 'Hostels & Mess',
    subcategory: 'Food Areas',
    content:
      'Prototype sample dining tip: Campus food courts are busiest right after morning and lunch lecture bells. Carrying a reusable water bottle and planning quick snack stops slightly off-peak saves waiting time between labs.',
    tags: ['cafeteria', 'food court', 'snacks', 'dining', 'lunch break', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
  },
  {
    id: 'kb-exp-fac-09',
    title: 'Healthy Eating Habits Between Hostel Mess & Cafeteria Meals (Prototype Sample)',
    category: 'Hostels & Mess',
    subcategory: 'Food Areas',
    content:
      'Prototype sample nutrition guide: Do not skip breakfast before morning lectures, balance mess meals with seasonal fruits and hydration, and avoid heavy late-night caffeine right before exam mornings.',
    tags: ['mess', 'nutrition', 'breakfast', 'hostel food', 'health', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
  },
  {
    id: 'kb-exp-fac-10',
    title: 'Hostel Move-In & Room Inventory Checklist (Prototype Sample)',
    category: 'Hostels & Mess',
    subcategory: 'Hostels Guidance',
    content:
      'Prototype sample move-in guide: Upon room allotment, check lighting, fan/AC switches, study desk stability, cupboard locks, and Wi-Fi signal on day one, and report any maintenance need promptly through official hostel warden procedures.',
    tags: ['hostel move-in', 'room checklist', 'warden', 'accommodation', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-fac-11',
    title: 'Organizing a Shared Hostel Study Desk & Power Strip Safely (Prototype Sample)',
    category: 'Hostels & Mess',
    subcategory: 'Hostels Guidance',
    content:
      'Prototype sample hostel tip: Use a certified surge-protected extension strip for laptops and chargers, label adapters clearly in double or triple-seater rooms, and confirm allowed electrical appliances directly with your hostel office.',
    tags: ['hostel room', 'study desk', 'electronics', 'safety', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-fac-12',
    title: 'Day-Scholar Commute Planning & Bus Pass Verification (Prototype Sample)',
    category: 'Transport',
    subcategory: 'Transport Guidance',
    content:
      'Prototype sample commute guide: Day scholars commuting along NH-19 from Mathura, Vrindavan, or Agra should verify official route maps, pick-up stops, and transport pass renewals exclusively through the University Transport Office and GLAMS.',
    tags: ['day scholar', 'bus pass', 'commute', 'transport office', 'nh-19', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-fac-13',
    title: 'Walking & Cycling Across the 110-Acre Campus Safely (Prototype Sample)',
    category: 'Transport',
    subcategory: 'Transport Guidance',
    content:
      'Prototype sample campus mobility tip: Allow a 10-minute buffer when moving between distant academic blocks, hostels, and the Central Library. Use designated pedestrian pathways, park bicycles in marked racks, and carry an umbrella during monsoon months.',
    tags: ['walking', 'bicycle', 'campus mobility', 'pathways', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-fac-14',
    title: 'Accessibility & Mobility Assistance Navigation Guidance (Prototype Sample)',
    category: 'Campus Facilities',
    subcategory: 'Accessibility',
    content:
      'Prototype sample accessibility guide: Students needing ground-floor classroom considerations, ramp navigation support, or exam scribe accommodations should coordinate early in the semester with the Dean of Students’ Welfare (DSW) and their academic department office.',
    tags: ['accessibility', 'mobility', 'ramps', 'inclusive campus', 'dsw', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-fac-15',
    title: 'When to Visit On-Campus Healthcare & What to Carry (Prototype Sample)',
    category: 'Campus Facilities',
    subcategory: 'Health Guidance',
    content:
      'Prototype sample health guide: Visit Aarogyam Medical Centre promptly for fever, sprains, dehydration, or first aid rather than self-medicating. Carry your student ID card and note any personal allergies or ongoing prescriptions.',
    tags: ['health', 'aarogyam', 'first aid', 'medical visit', 'id card', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-fac-16',
    title: 'Auditorium & Seminar Hall Etiquette for Guest Lectures (Prototype Sample)',
    category: 'Campus Facilities',
    subcategory: 'Academic Venues',
    content:
      'Prototype sample event etiquette: Arrive 10 minutes before guest talks, silence phones, keep aisles clear, and jot down one thoughtful question for the Q&A segment to make the most of visiting industry speakers.',
    tags: ['auditorium', 'seminar hall', 'guest lecture', 'etiquette', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-fac-17',
    title: 'Digital & Cashless Payment Readiness Around Campus (Prototype Sample)',
    category: 'Campus Facilities',
    subcategory: 'Campus Utilities',
    content:
      'Prototype sample utility tip: Keep small emergency cash alongside UPI apps in case of weak mobile data indoors, and always use official university portals for institutional fee payments rather than third-party links.',
    tags: ['atm', 'banking', 'upi', 'cashless', 'utilities', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-fac-18',
    title: 'Eco-Friendly & Sustainable Campus Habits (Prototype Sample)',
    category: 'Campus Facilities',
    subcategory: 'Sustainability',
    content:
      'Prototype sample green-campus tip: Carry a reusable bottle, turn off lab monitors and hostel lights before leaving, print double-sided only when required, and dispose of recyclables in marked campus bins.',
    tags: ['sustainability', 'green campus', 'recycling', 'eco friendly', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
  },

  // =========================================================================
  // 3. CLUBS & SOCIETIES (18 Prototype Sample Records)
  // =========================================================================
  {
    id: 'kb-exp-club-01',
    title: 'How to Choose Your First 1–2 Student Clubs Without Overcommitting (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Club Onboarding',
    content:
      'Prototype sample student advice: First-year students often benefit from pairing one career/technical society (such as coding, cloud, or cybersecurity) with one creative, literary, or sports society so academics remain balanced while building friendships.',
    tags: ['clubs', 'freshers', 'choosing clubs', 'balance', 'societies', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-02',
    title: 'Technology & Open-Source Contribution Circle Guide (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Technology',
    content:
      'Prototype sample club activity guide: Beginner tech club sessions typically cover Git branching, pull requests, Markdown docs, and building small full-stack web apps collaboratively before advancing to national open-source programs.',
    tags: ['technology', 'open source', 'git', 'github', 'web dev', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-03',
    title: 'Competitive Coding & DSA Practice Club Roadmap (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Coding',
    content:
      'Prototype sample coding roadmap: Start with arrays, strings, recursion, and time complexity in semester one, participate in weekly peer problem-solving rounds, and gradually explore trees, graphs, and dynamic programming.',
    tags: ['coding', 'dsa', 'competitive programming', 'algorithms', 'csi', 'gfg', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-04',
    title: 'Cybersecurity & Capture-the-Flag (CTF) Beginner Track (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Technology',
    content:
      'Prototype sample security learning guide: Newcomers interested in ethical hacking communities learn Linux command-line basics, HTTP inspection, web security fundamentals, and safe sandboxed CTF puzzles—strictly practicing only on authorized lab environments.',
    tags: ['cybersecurity', 'ctf', 'ethical hacking', 'cyberonites', 'linux', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-05',
    title: 'Robotics, Embedded Systems & IoT Maker Projects (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Robotics',
    content:
      'Prototype sample robotics guide: Hardware-focused student circles experiment with microcontroller kits, ultrasonic sensors, line-following bots, and CAD enclosures. Always follow lab safety guidelines when soldering or testing battery packs.',
    tags: ['robotics', 'iot', 'arduino', 'embedded systems', 'hardware', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-06',
    title: 'AI, Machine Learning & Data Analytics Peer Labs (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Technology',
    content:
      'Prototype sample AI society guide: Peer ML workshops typically progress from Python & Pandas data cleaning to exploratory visualization, supervised models, and grounded retrieval pipelines like this campus helpdesk prototype.',
    tags: ['ai', 'machine learning', 'data science', 'datum', 'python', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-07',
    title: 'Cultural Societies & Annual Fest Stage Preparation (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Cultural',
    content:
      'Prototype sample cultural guide: Cultural clubs coordinate auditions, theme curation, stage choreography, sound checks, and backstage logistics ahead of major campus festivals. Confirm real audition notices on official student channels.',
    tags: ['cultural', 'spandan', 'auditions', 'stage', 'fest', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-08',
    title: 'Music Club Vocal, Instrumental & Acoustic Jam Guide (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Music',
    content:
      'Prototype sample music guide: Campus music circles welcome classical vocalists, guitarists, keyboardists, percussionists, and sound enthusiasts for practice jams, ensemble arrangements, and unplugged campus evenings.',
    tags: ['music', 'ninad', 'vocals', 'guitar', 'band', 'acoustic', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-09',
    title: 'Dance Society Audition & Choreography Practice Tips (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Dance',
    content:
      'Prototype sample dance guide: Prepare a clean 60-second routine in your strongest style (classical, folk, hip-hop, or contemporary), warm up properly before rehearsals, and focus on rhythm synchronization for team sets.',
    tags: ['dance', 'natraj', 'choreography', 'audition', 'performance', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-10',
    title: 'Theatre, Street Plays & Scriptwriting Club Workshop Guide (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Cultural',
    content:
      'Prototype sample dramatics guide: Student theatre groups practice voice projection, improvisation games, social-theme nukkad natak scripting, and stage direction—building strong public-speaking confidence alongside performance art.',
    tags: ['theatre', 'drama', 'vihiti', 'nukkad natak', 'acting', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-11',
    title: 'Campus Photography, Videography & Visual Storytelling (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Photography',
    content:
      'Prototype sample media guide: Photography and creative clubs explore framing, natural light, event documentary coverage, and color grading—whether shooting on a smartphone or DSLR camera.',
    tags: ['photography', 'videography', 'drishti', 'mediascoop', 'camera', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-12',
    title: 'Entrepreneurship, Startup Ideation & Pitch Circles (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Entrepreneurship',
    content:
      'Prototype sample startup guide: Student entrepreneurship circles explore customer discovery, lean business canvases, prototype validation, and 3-minute pitch decks—helping technical and management students team up early.',
    tags: ['entrepreneurship', 'startup', 'pitch deck', 'innovation', 'e-cell', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-13',
    title: 'Sports Clubs, Inter-Hostel Leagues & Team Trials (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Sports',
    content:
      'Prototype sample sports club guide: Campus athletic groups organize regular fitness drills, friendly inter-branch matches, and selection trials for cricket, football, basketball, badminton, chess, and athletics.',
    tags: ['sports club', 'trials', 'tournament', 'athletics', 'fitness', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-club-14',
    title: 'Volunteering, Social Outreach & Community Drives (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Volunteering',
    content:
      'Prototype sample outreach guide: Student social-service circles participate in literacy mentoring, campus cleanliness drives, tree-plantation campaigns, and awareness walks coordinated through approved student welfare channels.',
    tags: ['volunteering', 'nss', 'community service', 'outreach', 'social impact', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-club-15',
    title: 'Debating, MUN & Literary Society Speaking Tips (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Literary',
    content:
      'Prototype sample literary guide: Parliamentary debate and writing societies sharpen structured argumentation, rebuttal timing, poetry performance, and campus newsletter editing.',
    tags: ['debate', 'literary', 'poetry', 'saturangle', 'literario', 'public speaking', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-16',
    title: 'UI/UX, Graphic Design & Motion Arts Student Circle (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Design',
    content:
      'Prototype sample design guide: Campus design contributors learn typography hierarchy, accessibility contrast, event poster layout, Figma prototyping, and design-system handoff for student clubs and hackathons.',
    tags: ['design', 'ui ux', 'figma', 'graphics', 'typography', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-17',
    title: 'Cloud Computing & DevOps Study Jam Playbook (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Technology',
    content:
      'Prototype sample cloud guide: Cloud circles practice containerization basics, CI/CD scripts, free-tier static and server deployments, and collaborative architecture diagrams without incurring paid cloud bills.',
    tags: ['cloud', 'devops', 'gloud', 'deployment', 'containers', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-club-18',
    title: 'How to Volunteer as a Club Coordinator or Event Crew Member (Prototype Sample)',
    category: 'Clubs & Societies',
    subcategory: 'Club Leadership',
    content:
      'Prototype sample leadership tip: First-year students often start in hospitality, design, content, or technical logistics crews during major campus fests—gaining hands-on teamwork experience before applying for core club roles in year two.',
    tags: ['club leadership', 'coordinator', 'volunteering', 'event management', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },

  // =========================================================================
  // 4. CAMPUS EVENTS (16 Prototype Sample Records)
  // =========================================================================
  {
    id: 'kb-exp-evt-01',
    title: 'Sample Workshop Blueprint: Intro to Git, GitHub & Clean Code (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Workshops',
    content:
      'Prototype sample event outline: A 2-hour hands-on beginner workshop covering repository setup, branching, commit hygiene, and resolving merge conflicts. Check gla.ac.in/events for real university workshop calendars.',
    tags: ['workshop', 'git', 'github', 'hands-on', 'event sample', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/events',
  },
  {
    id: 'kb-exp-evt-02',
    title: 'Sample Workshop Blueprint: Building Responsible RAG Applications (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Workshops',
    content:
      'Prototype sample event outline: Explores structured knowledge bases, keyword/BM25 retrieval, source verification labels, and refusal guardrails so student AI prototypes avoid hallucinated answers.',
    tags: ['rag workshop', 'ai workshop', 'prompt engineering', 'citations', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/events',
  },
  {
    id: 'kb-exp-evt-03',
    title: 'Sample Coding Contest Format: 3-Hour Freshers Algorithm Sprint (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Coding Contests',
    content:
      'Prototype sample contest format: Features 5 graduated logic and programming problems (2 beginner, 2 intermediate, 1 challenge) designed to help first-year students experience competitive judging platforms without intimidation.',
    tags: ['coding contest', 'algorithms', 'freshers', 'programming competition', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/events',
  },
  {
    id: 'kb-exp-evt-04',
    title: 'Sample 24-Hour Campus Hackathon Preparation Checklist (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Coding Contests',
    content:
      'Prototype sample hackathon guide: Form a balanced 3-to-4-member team (frontend, backend/logic, design/pitch), bring chargers and extension cords, ship a small end-to-end demo early, and rehearse a crisp 3-minute presentation.',
    tags: ['hackathon', 'team checklist', 'coding event', 'demo pitch', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/events',
  },
  {
    id: 'kb-exp-evt-05',
    title: 'Sample Cultural Evening: Unplugged Acoustic & Poetry Open Mic (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Cultural Events',
    content:
      'Prototype sample cultural event outline: Student vocalists, instrumentalists, and spoken-word poets share 4-minute original or classic pieces in an inclusive evening showcase.',
    tags: ['cultural event', 'open mic', 'music', 'poetry', 'evening showcase', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/events',
  },
  {
    id: 'kb-exp-evt-06',
    title: 'Sample Cultural Showcase: Short Film & Reel Creators Screening (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Cultural Events',
    content:
      'Prototype sample media showcase outline: Celebrates student-shot documentaries, campus life reels, and cinematography pieces followed by peer editing Q&A sessions.',
    tags: ['film screening', 'creators', 'videography', 'cultural', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/events',
  },
  {
    id: 'kb-exp-evt-07',
    title: 'Sample Sports Activity: Inter-Hostel Basketball & Volleyball League (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Sports Activities',
    content:
      'Prototype sample sports schedule illustration: Weekend knockout brackets encouraging hostel and day-scholar teams to compete in friendly matches with student referees and fair-play recognition.',
    tags: ['sports event', 'basketball', 'volleyball', 'inter hostel', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/events',
  },
  {
    id: 'kb-exp-evt-08',
    title: 'Sample Sports Activity: Morning Campus 5K Fun Run & Fitness Walk (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Sports Activities',
    content:
      'Prototype sample wellness event illustration: Community morning run/walk loop emphasizing hydration stations, warm-up stretches, and beginner participation across all departments.',
    tags: ['5k run', 'fitness', 'sports activity', 'wellness', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/events',
  },
  {
    id: 'kb-exp-evt-09',
    title: 'Sample Career Session: Alumni Tech & Management AMA Panel (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Career Sessions',
    content:
      'Prototype sample career session outline: Interactive Q&A where alumni discuss internship search timelines, project portfolios, and transitioning from campus coursework to industry teams.',
    tags: ['career session', 'alumni panel', 'ama', 'internships', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-evt-10',
    title: 'Sample Career Session: Resume & GitHub Portfolio Peer Teardown (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Career Sessions',
    content:
      'Prototype sample career workshop outline: Small-group review clinic focusing on quantified project bullet points, clean README screenshots, and concise 1-page resume formatting.',
    tags: ['resume clinic', 'github portfolio', 'career workshop', 'placements', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-evt-11',
    title: 'Sample Wellbeing Session: Exam Stress Management & Sleep Hygiene Talk (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Wellbeing Sessions',
    content:
      'Prototype sample wellbeing outline: Practical student session covering paced breathing, realistic study blocks, sleep consistency before exams, and recognizing when to reach out to campus counselors or mentors.',
    tags: ['wellbeing', 'stress management', 'sleep hygiene', 'mental health', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-evt-12',
    title: 'Sample Wellbeing Session: Digital Detox & Focus Habits Circle (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Wellbeing Sessions',
    content:
      'Prototype sample student wellness activity: Explores notification hygiene, Pomodoro study blocks, and screen-free evening walks to counter burnout during busy project weeks.',
    tags: ['digital detox', 'focus', 'wellbeing', 'burnout prevention', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-evt-13',
    title: 'Sample Club Recruitment Event: Freshers Society Orientation Expo (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Club Recruitment',
    content:
      'Prototype sample recruitment outline: Open-stall showcase where technical, media, cultural, literary, and design societies demonstrate past projects and explain how new students can try out.',
    tags: ['club recruitment', 'orientation expo', 'freshers', 'societies', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-evt-14',
    title: 'Sample Club Recruitment Event: Technical Audition & Portfolio Review (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Club Recruitment',
    content:
      'Prototype sample recruitment tip: Technical clubs usually look for curiosity and willingness to learn rather than prior mastery—bringing even one small classroom project or design sample makes your introduction memorable.',
    tags: ['club interview', 'recruitment', 'portfolio', 'freshers', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
  },
  {
    id: 'kb-exp-evt-15',
    title: 'Using .ics Calendar Exports in This Prototype Events Page (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Prototype Workflow',
    content:
      'Prototype sample feature guide: Every sample event on the Events page supports local browser RSVP storage and standard .ics file download. Official event schedules and venue confirmations must always be checked on gla.ac.in/events.',
    tags: ['ics', 'calendar export', 'rsvp', 'local workflow', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/events',
  },
  {
    id: 'kb-exp-evt-16',
    title: 'Sample Design Workshop: Accessible Web Interfaces & UI Basics (Prototype Sample)',
    category: 'Campus Events',
    subcategory: 'Workshops',
    content:
      'Prototype sample workshop outline: Covers color contrast (WCAG AA), responsive grids, semantic HTML buttons, and keyboard focus outlines for student web projects.',
    tags: ['ui workshop', 'accessibility', 'web design', 'frontend', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/events',
  },

  // =========================================================================
  // 5. STUDENT SERVICES (16 Prototype Sample Records)
  // =========================================================================
  {
    id: 'kb-exp-srv-01',
    title: 'How the Local Prototype Support Ticket Workflow Works (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Support Tickets',
    content:
      'Prototype sample workflow guide: The Student Services ticket form stores tickets strictly in your browser localStorage so evaluators can test ticket creation, priority selection, and status transitions (Submitted -> In Review -> Resolved). It does NOT contact university staff.',
    tags: ['support ticket', 'helpdesk', 'localstorage', 'prototype workflow', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-srv-02',
    title: 'Writing a Clear Campus Support Request (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Support Tickets',
    content:
      'Prototype sample guidance: When submitting a real support request through official university offices or GLAMS, include your enrolment reference, exact department/block, concise summary of the issue, and screenshots or error messages where relevant.',
    tags: ['support request', 'ticket writing', 'glams', 'student help', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-srv-03',
    title: 'Lost and Found Checklist on Campus (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Lost and Found',
    content:
      'Prototype sample guidance: If you misplace an ID card, charger, notebook, or water bottle, retrace your last classroom, library desk, or cafeteria stop immediately and check with the building caretaker, hostel warden, or campus security desk.',
    tags: ['lost and found', 'id card', 'missing item', 'security desk', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-srv-04',
    title: 'Labeling Essentials to Prevent Lost Campus Gear (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Lost and Found',
    content:
      'Prototype sample prevention tip: Add a name label inside lab coats, calculators, laptop sleeves, and chargers so found items can be returned smoothly through department or hostel offices.',
    tags: ['lost items', 'labeling', 'calculators', 'chargers', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-srv-05',
    title: 'Reporting Hostel or Classroom Maintenance Issues Officially (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Maintenance',
    content:
      'Prototype sample maintenance guide: For electrical, plumbing, furniture, or Wi-Fi faults in hostels or academic rooms, log details through official hostel warden registers or university maintenance desks rather than informal chat groups.',
    tags: ['maintenance', 'electrical', 'plumbing', 'hostel repair', 'warden', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
  },
  {
    id: 'kb-exp-srv-06',
    title: 'Document Checklist for Official Scholarship Inquiries (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Scholarships Guidance',
    content:
      'Prototype sample scholarship checklist: Keep clear scans of mark sheets, admission letters, identity proof, and income/category certificates (where applicable) ready before official deadlines. Verify real eligibility slabs and dates solely on gla.ac.in or government scholarship portals.',
    tags: ['scholarships', 'documents', 'financial aid', 'eligibility', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
  },
  {
    id: 'kb-exp-srv-07',
    title: 'Avoiding Unverified Scholarship & Fee Scams (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Scholarships Guidance',
    content:
      'Prototype sample safety tip: Never share OTPs, portal passwords, or fee transfers with unofficial WhatsApp messages or lookalike links. Always verify scholarship notices and fee portals directly on gla.ac.in or student.glauniversity.in.',
    tags: ['scam prevention', 'scholarships', 'fee safety', 'official links', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/contact-us',
  },
  {
    id: 'kb-exp-srv-08',
    title: 'Accessing Career Guidance & Training Support Early (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Career Support',
    content:
      'Prototype sample career support tip: Attend orientation talks by training & placement coordinators early, understand skill expectations for your branch, and track official workshop announcements on university noticeboards and GLAMS.',
    tags: ['career support', 'training cell', 'placement guidance', 'workshops', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-srv-09',
    title: 'Understanding Escalation Paths for Academic or Administrative Concerns (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Grievance Guidance',
    content:
      'Prototype sample escalation guide: Start with your class advisor, faculty mentor, or hostel warden for routine issues. For unresolved formal concerns, consult the official Student Grievance Redressal Committee (SGRC) or Dean of Students’ Welfare channels listed on gla.ac.in/students.',
    tags: ['grievance', 'sgrc', 'escalation', 'dsw', 'student rights', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-srv-10',
    title: 'Preparing Documentation for Formal Grievance Submissions (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Grievance Guidance',
    content:
      'Prototype sample guidance: Write factual, chronological notes with dates and prior ticket or email references when escalating a formal academic or facility grievance through official university channels.',
    tags: ['grievance documentation', 'sgrc', 'formal request', 'student services', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-srv-11',
    title: 'Requesting Accessibility & Learning Accommodations (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Accessibility Support',
    content:
      'Prototype sample inclusion guide: Students with documented temporary injuries or long-term learning/mobility needs should notify their department coordinator and DSW early before exam periods so official accommodations can be reviewed in time.',
    tags: ['accessibility support', 'accommodations', 'dsw', 'inclusive education', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-srv-12',
    title: 'Keeping Digital Copies of Key Student Documents Safely (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Student Records',
    content:
      'Prototype sample organization tip: Store PDF copies of your university ID card, admission receipt, fee acknowledgements from GLAMS, and semester grade cards in a password-protected personal cloud folder for quick internship or scholarship verification.',
    tags: ['student documents', 'id card', 'receipts', 'records', 'prototype', 'sample'],
    sourceUrl: 'https://student.glauniversity.in/main/',
  },
  {
    id: 'kb-exp-srv-13',
    title: 'Navigating Official Certificates & Bonafide Requests (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Student Records',
    content:
      'Prototype sample guidance: Apply for bonafide certificates, transcripts, or official letters well ahead of internship or passport deadlines through the official university registrar/student-portal procedure confirmed on GLAMS.',
    tags: ['bonafide', 'transcripts', 'certificates', 'registrar', 'prototype', 'sample'],
    sourceUrl: 'https://student.glauniversity.in/main/',
  },
  {
    id: 'kb-exp-srv-14',
    title: 'IT & Portal Password Hygiene for GLAMS & Library Accounts (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'IT Support',
    content:
      'Prototype sample security tip: Use a unique strong password for your student ERP and library logins, avoid saving credentials on shared lab PCs, and follow official IT helpdesk recovery steps if locked out.',
    tags: ['password security', 'glams login', 'it helpdesk', 'account safety', 'prototype', 'sample'],
    sourceUrl: 'https://student.glauniversity.in/main/',
  },
  {
    id: 'kb-exp-srv-15',
    title: 'Peer Mentoring & Fresher Onboarding Support Circles (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Student Welfare',
    content:
      'Prototype sample welfare guide: Connecting with official student mentors and faculty advisors during the first month helps new students navigate timetable terminology, club auditions, and healthy academic routines.',
    tags: ['peer mentoring', 'freshers support', 'student welfare', 'onboarding', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-srv-16',
    title: 'Understanding Local Prototype vs Official University Actions (Prototype Sample)',
    category: 'Student Services',
    subcategory: 'Prototype Transparency',
    content:
      'Prototype sample transparency note: Actions inside GLA Campus AI—such as prototype accounts, saved favorites, club interest forms, event RSVPs, and helpdesk tickets—stay strictly inside your browser localStorage and never submit data to GLA University servers.',
    tags: ['prototype transparency', 'localstorage', 'disclaimer', 'privacy', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },

  // =========================================================================
  // 6. PLACEMENTS & CAREER (16 Prototype Sample Records)
  // =========================================================================
  {
    id: 'kb-exp-plc-01',
    title: 'One-Page Technical Resume Structure for B.Tech Students (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Resume Support',
    content:
      'Prototype sample resume guide: Keep your undergraduate resume to one clean ATS-friendly page with sections in order: Education, Technical Skills, Projects (with measurable impact), Internships/Experience, and Achievements/Clubs.',
    tags: ['resume', 'ats', 'cv format', 'btech career', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-02',
    title: 'Writing Impact-Driven Project Bullet Points (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Resume Support',
    content:
      'Prototype sample resume tip: Use the Action + Tech Stack + Result formula—for example, describe what problem your app solved, which frameworks or algorithms you built, and how you tested reliability or latency.',
    tags: ['resume bullets', 'project description', 'impact', 'career', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-03',
    title: 'Common First-Year Resume Mistakes to Avoid (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Resume Support',
    content:
      'Prototype sample career tip: Avoid skill-rating progress bars, multi-column graphics that confuse parsers, broken project links, and listing technologies you cannot explain in an interview.',
    tags: ['resume mistakes', 'career tips', 'ats friendly', 'formatting', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-04',
    title: 'Structured Technical Interview Preparation Roadmap (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Interview Preparation',
    content:
      'Prototype sample interview guide: Build fluency across four pillars—Data Structures & Algorithms, Core CS fundamentals (OS, DBMS, Networks, OOP), deep knowledge of your own projects, and clear verbal problem decomposition.',
    tags: ['technical interview', 'dsa', 'os', 'dbms', 'coding interview', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-05',
    title: 'Practicing Behavioral & HR Interviews with the STAR Method (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Interview Preparation',
    content:
      'Prototype sample HR guide: Prepare 4–5 authentic stories from team projects, clubs, or hackathons structured by Situation, Task, Action, and Result so you answer teamwork and conflict questions naturally.',
    tags: ['hr interview', 'star method', 'behavioral questions', 'communication', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-06',
    title: 'Running Effective Peer Mock Interviews on Campus (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Interview Preparation',
    content:
      'Prototype sample practice guide: Pair up with a classmate for 45-minute mock rounds—25 minutes solving one unseen coding/case question aloud, 10 minutes discussing a resume project, and 10 minutes exchanging constructive feedback.',
    tags: ['mock interview', 'peer practice', 'feedback', 'placements', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-07',
    title: 'How First & Second-Year Students Prepare for Internships (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Internships',
    content:
      'Prototype sample internship roadmap: Focus year one on programming fundamentals and 2–3 deployed projects; in year two, contribute to open source, build a strong GitHub/LinkedIn profile, and apply early to summer internship programs.',
    tags: ['internships', 'summer internship', 'first year', 'roadmap', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-08',
    title: 'Evaluating Internship Offers & Avoiding Unpaid Scam Listings (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Internships',
    content:
      'Prototype sample safety guide: Legitimate internships never ask students to pay registration or training fees to receive an offer letter. Verify company domains, review role descriptions carefully, and consult placement coordinators if unsure.',
    tags: ['internship safety', 'offer verification', 'career', 'scam awareness', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-09',
    title: 'Getting the Most Out of Campus Career Workshops & Codethons (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Career Workshops',
    content:
      'Prototype sample workshop tip: Treat aptitude drills, group discussions, and coding marathons as low-stakes practice arenas—track which question patterns slowed you down and revisit them within 48 hours.',
    tags: ['career workshops', 'codethon', 'aptitude', 'group discussion', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-10',
    title: 'Group Discussion (GD) Participation & Listening Tips (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Career Workshops',
    content:
      'Prototype sample GD guide: Contribute 2–3 concise, evidence-backed points rather than interrupting others, acknowledge teammates’ perspectives smoothly, and help summarize key takeaways if the group stalls.',
    tags: ['group discussion', 'gd tips', 'soft skills', 'placements', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-11',
    title: 'Building a Standout GitHub Portfolio for Engineering Roles (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Portfolio Guidance',
    content:
      'Prototype sample portfolio guide: Pin your top 4 repositories with crisp READMEs containing problem motivation, architecture diagram, live demo link or screenshots, setup steps, and automated tests.',
    tags: ['github', 'portfolio', 'readme', 'engineering projects', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-12',
    title: 'Creating a Clean Personal Portfolio Website on a ₹0 Budget (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Portfolio Guidance',
    content:
      'Prototype sample zero-cost guide: Students can showcase projects, skills, and technical blog posts using free static hosting and clean responsive HTML/React templates—focusing on clarity and working demos over flashy effects.',
    tags: ['portfolio website', 'free hosting', 'projects', 'personal brand', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-13',
    title: 'LinkedIn Profile Hygiene for College Students (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Portfolio Guidance',
    content:
      'Prototype sample networking guide: Use a clear headline stating your programme and core interests (e.g., B.Tech CSE Student | Web & AI Projects), highlight shipped academic projects with honest descriptions, and personalize connection notes.',
    tags: ['linkedin', 'networking', 'student profile', 'career', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-14',
    title: 'Non-Coding & Management Career Tracks: Case Study Prep (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Interview Preparation',
    content:
      'Prototype sample management prep guide: BBA, MBA, and product-oriented students can strengthen business interviews by practicing market-sizing guesstimates, Excel/SQL data analysis, and structured product-improvement cases.',
    tags: ['management careers', 'case study', 'mba', 'bba', 'analytics', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-15',
    title: 'Documenting Hackathon & Club Achievements Effectively (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Portfolio Guidance',
    content:
      'Prototype sample tip: Save short demo recordings, architecture slides, and team role summaries right after every hackathon or club project so you can reference concrete work months later during interviews.',
    tags: ['hackathon portfolio', 'achievements', 'demo video', 'career', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },
  {
    id: 'kb-exp-plc-16',
    title: 'Verifying Official Placement Information Safely (Prototype Sample)',
    category: 'Placements',
    subcategory: 'Official Verification',
    content:
      'Prototype sample reminder: Never rely on unverified claims about placement packages or recruiter counts from informal posts. Always check official placement overviews directly on gla.ac.in/placements/overview.',
    tags: ['placement verification', 'official sources', 'recruiters', 'career', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
  },

  // =========================================================================
  // 7. CAMPUS LIFE (16 Prototype Sample Records)
  // =========================================================================
  {
    id: 'kb-exp-life-01',
    title: 'First-Year Survival Guide: Your First 30 Days on Campus (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'First-Year Survival Guide',
    content:
      'Prototype sample survival guide: Walk the route from your hostel or gate to your academic block before day one, activate your official GLAMS and library credentials early, meet 3 classmates in your section, and attend at least one club orientation.',
    tags: ['first year', 'survival guide', 'freshers', 'campus life', 'onboarding', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
  },
  {
    id: 'kb-exp-life-02',
    title: 'Managing Monthly Student Budgets & Daily Expenses (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'First-Year Survival Guide',
    content:
      'Prototype sample student life tip: Track weekly cafeteria, stationery, laundry, and commute spending in a simple spreadsheet or notes app so small daily purchases do not quietly drain your monthly allowance.',
    tags: ['student budget', 'expenses', 'money management', 'campus life', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
  },
  {
    id: 'kb-exp-life-03',
    title: 'Seasonal Packing Tips for Mathura Summers, Monsoons & Winters (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'First-Year Survival Guide',
    content:
      'Prototype sample weather guide: Mathura experiences warm summers, humid monsoons, and crisp winter mornings. Pack breathable cotton wear, a sturdy umbrella, a refillable insulated bottle, and warm layers for November–February.',
    tags: ['mathura weather', 'packing', 'winter', 'monsoon', 'summer', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
  },
  {
    id: 'kb-exp-life-04',
    title: 'Finding Your Ideal Study Environment Across Campus (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'Study Spaces',
    content:
      'Prototype sample study guide: Experiment in week two with different study rhythms—silent library reading halls for deep focus, hostel desks for evening coding, and peer study tables for collaborative problem solving.',
    tags: ['study spaces', 'focus', 'library', 'hostel study', 'campus life', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
  },
  {
    id: 'kb-exp-life-05',
    title: 'Designing a Distraction-Free Desk Setup in Hostel or PG (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'Study Spaces',
    content:
      'Prototype sample desk tip: Keep a warm desk lamp, keep your phone face-down across the room during 45-minute study blocks, and clear clutter each night so starting work the next day takes zero friction.',
    tags: ['desk setup', 'focus', 'study environment', 'productivity', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
  },
  {
    id: 'kb-exp-life-06',
    title: 'Healthy Roommate Communication & Shared-Space Etiquette (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'Roommate Guidance',
    content:
      'Prototype sample roommate guide: Agree early on lights-out hours, headphone usage for calls/videos, alarm volume, desk tidiness, and guest visits. Calm, direct conversations in week one prevent friction all semester.',
    tags: ['roommate', 'hostel life', 'etiquette', 'communication', 'shared room', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
  },
  {
    id: 'kb-exp-life-07',
    title: 'Resolving Roommate Differences Respectfully (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'Roommate Guidance',
    content:
      'Prototype sample conflict guide: Address small annoyances privately using "I" statements (e.g., sleep schedule needs) before frustration builds up. If an issue cannot be resolved amicably, consult your hostel warden respectfully.',
    tags: ['roommate conflict', 'hostel warden', 'respect', 'communication', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-life-08',
    title: 'Weekly Time-Management Blueprint for B.Tech First-Years (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'Time Management',
    content:
      'Prototype sample planner: Block fixed lecture and lab hours first, reserve 1 hour daily for revision/coding, protect 7–8 hours of sleep, and keep 2–3 evening slots per week for clubs, sports, and rest.',
    tags: ['time management', 'schedule', 'balance', 'sleep', 'productivity', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
  },
  {
    id: 'kb-exp-life-09',
    title: 'Beating Procrastination on Assignments & Lab Submissions (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'Time Management',
    content:
      'Prototype sample productivity technique: Use the 10-minute starter rule—open the assignment document and complete just the outline or first problem on the day it is assigned to eliminate last-night panic.',
    tags: ['procrastination', 'assignments', 'deadlines', 'time management', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
  },
  {
    id: 'kb-exp-life-10',
    title: 'Handling Homesickness During Your First Semester Away (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'Student Wellbeing',
    content:
      'Prototype sample wellbeing guide: Feeling homesick in the first few weeks is completely normal. Schedule regular family calls, stay active through sports or a club, walk outdoors with peers after dinner, and talk to a mentor or counselor if low moods persist.',
    tags: ['homesickness', 'wellbeing', 'freshers', 'mental health', 'support', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-life-11',
    title: 'Protecting Sleep, Hydration & Mental Energy During Exam Weeks (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'Student Wellbeing',
    content:
      'Prototype sample wellness tip: Pulling all-nighters sharply reduces recall and problem-solving accuracy. Aim for consistent sleep, short 10-minute stretch breaks every hour, and balanced meals throughout exam weeks.',
    tags: ['sleep', 'exam wellness', 'hydration', 'mental energy', 'wellbeing', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-life-12',
    title: 'Building Genuine Friendships & Peer Networks on Campus (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'Student Wellbeing',
    content:
      'Prototype sample social guide: Say hello to classmates sitting nearby, join a project team or evening sport, and stay open to meeting peers across branches—strong friendships often grow naturally out of shared routines.',
    tags: ['friendships', 'community', 'campus life', 'networking', 'freshers', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
  },
  {
    id: 'kb-exp-life-13',
    title: 'Everyday Personal & Digital Safety Habits on Campus (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'Safety Guidance',
    content:
      'Prototype sample safety guide: Carry your student ID card at all times, lock laptops and lockers when stepping out, stick to well-lit campus paths after dark, and never share personal credentials on unverified links.',
    tags: ['campus safety', 'id card', 'digital safety', 'security', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-life-14',
    title: 'Standing Against Ragging & Supporting a Respectful Campus Culture (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'Safety Guidance',
    content:
      'Prototype sample safety reminder: Healthy campus communities thrive on mutual respect. If you ever witness or experience harassment or ragging, report immediately through official Anti-Ragging channels (UGC helpline 1800-180-5522 or university authorities on gla.ac.in/students).',
    tags: ['anti-ragging', 'respect', 'campus safety', 'helpline', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/students',
  },
  {
    id: 'kb-exp-life-15',
    title: 'Weekend Recharge Ideas Around Campus Life (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'Student Wellbeing',
    content:
      'Prototype sample lifestyle tip: Use Sunday mornings to catch up on laundry, tidy your study space, play an outdoor sport, or attend a photography walk or club meetup so Monday starts feeling organized and refreshed.',
    tags: ['weekend', 'recharge', 'laundry', 'campus life', 'routine', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
  },
  {
    id: 'kb-exp-life-16',
    title: 'Distinguishing Official Campus Notices from Informal Social Rumors (Prototype Sample)',
    category: 'Campus Life',
    subcategory: 'Safety Guidance',
    content:
      'Prototype sample media-literacy tip: Unofficial Instagram pages and student chat groups are great for campus humor and community reels, but never treat them as official sources for holidays, exams, or fee notices—always verify on gla.ac.in or GLAMS.',
    tags: ['official notices', 'rumors', 'social media', 'verification', 'glams', 'prototype', 'sample'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
  },
];

export const EXPANDED_PROTOTYPE_RECORDS: KnowledgeRecord[] = RAW_EXPANDED_PROTOTYPE_RECORDS.map((item) => ({
  id: item.id,
  title: item.title,
  category: item.category,
  subcategory: item.subcategory,
  content: item.content,
  description: item.content,
  tags: item.tags,
  keywords: item.tags,
  sourceUrl: item.sourceUrl,
  sourceName: 'Prototype Sample — Campus Student Guide',
  sourceType: 'demo',
  verificationStatus: 'Prototype sample',
  sourceLabel: 'Prototype sample',
  lastReviewedDate: REVIEWED_DATE,
  lastChecked: REVIEWED_DATE,
  isPrototypeSample: true,
  freshnessStatus: 'demo-static',
  freshnessNote: 'Prototype sample: Illustrative student guidance, not an official GLA University notice or policy.',
}));
