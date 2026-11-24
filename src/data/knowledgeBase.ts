import type { FreshnessStatus, KnowledgeCategory, KnowledgeRecord, VerificationStatus } from '../types/campus.ts';
import { EXPANDED_PROTOTYPE_RECORDS } from './knowledgeBaseExpanded.ts';

const CHECKED_DATE = '2026-11-20';

type RawKnowledgeRecord = {
  id: string;
  title: string;
  category: KnowledgeCategory;
  subcategory?: string;
  description: string;
  keywords: string[];
  sourceUrl: string;
  sourceName: string;
  sourceType: 'official' | 'demo';
  sourceLabel: 'Official' | 'Demo Data — Not Official' | 'DEMO DATA — NOT OFFICIAL' | VerificationStatus;
  lastChecked: string;
  freshnessStatus?: FreshnessStatus;
  freshnessNote?: string;
};

const RAW_SEED_KNOWLEDGE_BASE: RawKnowledgeRecord[] = [
  // =========================================================================
  // 1. CAMPUS FACILITIES (Official + Demo)
  // =========================================================================
  {
    id: 'kb-fac-01',
    title: 'GLA University Mathura 110-Acre Campus Overview',
    category: 'Campus Facilities',
    description:
      'GLA University is located on a sprawling 110-acre campus along NH-19 (Mathura-Delhi Road) at Chaumuhan, Mathura, Uttar Pradesh. The campus integrates academic blocks, over 150 laboratories, smart amphitheater-style classrooms, residential hostels, a central library, sports complexes, auditoriums, cafeterias, and medical care.',
    keywords: ['campus', 'acres', 'mathura', 'infrastructure', 'overview', 'facilities', 'chaumuhan', 'nh-19'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'GLA University Campus Facilities',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-fac-02',
    title: 'Campus-Wide High-Speed Wi-Fi & IT Infrastructure',
    category: 'Campus Facilities',
    description:
      'The GLA University campus is enabled with high-speed Wi-Fi connectivity covering academic zones, library areas, and residential hostel blocks to support digital learning, coding labs, and portal access.',
    keywords: ['wifi', 'wi-fi', 'internet', 'network', 'it', 'connectivity', 'campus network'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'GLA University Campus Facilities',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-fac-03',
    title: 'Smart Amphitheater Classrooms & 150+ Laboratories',
    category: 'Campus Facilities',
    description:
      'Academic buildings at GLA University feature modern amphitheater-style smart classrooms equipped with audio-visual projection systems alongside more than 150 specialized engineering, computing, pharmacy, biotechnology, and science laboratories.',
    keywords: ['classrooms', 'smart classrooms', 'labs', 'laboratories', 'amphitheater', 'academic blocks'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'GLA University Campus Facilities',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-fac-04',
    title: 'Sports Complex, Outdoor Fields & Campus Gymnasium',
    category: 'Campus Facilities',
    description:
      'GLA University offers an expansive sports complex with outdoor infrastructure for cricket, football, hockey, basketball, volleyball, badminton, and athletics tracks, plus a well-equipped on-campus gymnasium for student fitness.',
    keywords: ['sports', 'gym', 'gymnasium', 'cricket', 'football', 'basketball', 'badminton', 'volleyball', 'hockey', 'athletics', 'fitness'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'GLA University Campus Facilities',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-fac-05',
    title: 'Auditoriums & Seminar Halls for Events and Conferences',
    category: 'Campus Facilities',
    description:
      'Multiple large-scale auditoriums and air-conditioned seminar halls across the GLA University campus host academic conferences, industry guest lectures, orientations, workshops, and cultural programs.',
    keywords: ['auditorium', 'seminar hall', 'conference', 'lectures', 'venue', 'stage'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'GLA University Campus Facilities',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-fac-06',
    title: 'Aarogyam Medical Centre (On-Campus Healthcare)',
    category: 'Campus Facilities',
    description:
      'The Aarogyam Medical Centre on the GLA University campus provides round-the-clock primary healthcare, first aid, and medical assistance for residential students, day scholars, and university staff.',
    keywords: ['medical', 'aarogyam', 'hospital', 'doctor', 'health', 'clinic', 'first aid', 'healthcare', 'dispensary'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'GLA University Campus Facilities',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-fac-07',
    title: 'On-Campus Banking & ATM Utilities',
    category: 'Campus Facilities',
    description:
      'GLA University provides convenient on-campus banking services and ATM facilities so students and staff can handle everyday banking transactions without leaving campus.',
    keywords: ['bank', 'atm', 'cash', 'banking', 'utilities', 'finance'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'GLA University Campus Facilities',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-fac-08',
    title: 'Campus Cafeterias & Food Courts',
    category: 'Campus Facilities',
    description:
      'Multiple cafeterias and food courts across campus serve snacks, beverages, and varied cuisine options between classes and during evening hours.',
    keywords: ['cafeteria', 'canteen', 'food court', 'snacks', 'coffee', 'dining', 'tea'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
    sourceName: 'GLA University Campus Life',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-fac-09',
    title: 'Sample Campus Gym & Sports Slot Illustration (Demo)',
    category: 'Campus Facilities',
    description:
      'Demonstration schedule illustrating how students might check evening sports equipment issue windows (e.g., morning fitness 6:00 AM–8:00 AM, evening outdoor courts 4:30 PM–7:30 PM). Actual timings vary by season and official Sports Council circulars.',
    keywords: ['gym timings', 'sports schedule', 'equipment issue', 'demo', 'evening sports'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-fac-10',
    title: 'Sample Printing, Stationery & Reprography Tip (Demo)',
    category: 'Campus Facilities',
    description:
      'Demonstration FAQ tip: For lab record printouts and project binding, students typically visit campus utility/stationery counters before exam weeks to avoid queues. Check campus signage for actual counter locations and timings.',
    keywords: ['printing', 'photocopy', 'stationery', 'lab manual', 'binding', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },

  // =========================================================================
  // 2. LIBRARY (Official + Demo)
  // =========================================================================
  {
    id: 'kb-lib-01',
    title: 'Central Library Collection & Academic Resources',
    category: 'Library',
    description:
      'The GLA University Library System comprises a fully air-conditioned Central Library along with institute, departmental, and hostel libraries holding over 1,95,000+ books, bound volumes, and print journals, supplemented by e-books, e-journals, and digital media.',
    keywords: ['library', 'central library', 'books', 'journals', 'reading room', 'volumes', 'e-books', 'study'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
    sourceName: 'GLA University Libraries',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-lib-02',
    title: 'KOHA ILMS & Web OPAC Catalog Search',
    category: 'Library',
    description:
      'GLA University libraries are automated using the KOHA Integrated Library Management System (ILMS) integrated with GLAMS. Students can use Web OPAC and dedicated computer terminals inside the library to search catalog availability, track borrowed books, and place reservations.',
    keywords: ['koha', 'opac', 'catalog', 'book search', 'reservation', 'library automation', 'borrow', 'issue book'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
    sourceName: 'GLA University Libraries',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-lib-03',
    title: 'Refread Digital Library & Research Databases',
    category: 'Library',
    description:
      'Through platforms like Refread, students and researchers can access digital textbooks, e-journals, e-theses, and subscribed research databases including Scopus, Emerald Insight, EBSCOhost, LexisNexis, and SCC Online, alongside anti-plagiarism tools such as Turnitin.',
    keywords: ['refread', 'scopus', 'turnitin', 'plagiarism', 'research', 'databases', 'ebscohost', 'emerald', 'e-journals', 'remote access'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
    sourceName: 'GLA University Libraries',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-lib-04',
    title: 'Departmental & Hostel Libraries Network',
    category: 'Library',
    description:
      'In addition to the Central Library, GLA University maintains institute-level, departmental, and hostel libraries so students have convenient access to subject-specific textbooks and quiet reading spaces near classes and residences.',
    keywords: ['departmental library', 'hostel library', 'institute library', 'reading space', 'textbooks'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
    sourceName: 'GLA University Libraries',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-lib-05',
    title: 'Sample First-Year Library Onboarding Guide (Demo)',
    category: 'Library',
    description:
      'Demonstration student tip: First-year students should carry their university ID card when visiting the Central Library, explore Web OPAC to locate engineering textbooks by subject code, and keep track of return due dates on GLAMS. Official loan limits and fine rules are issued by the Library Office.',
    keywords: ['library card', 'book return', 'first year library', 'borrowing tips', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-lib-06',
    title: 'Sample Exam-Week Extended Study Desk Checklist (Demo)',
    category: 'Library',
    description:
      'Demonstration study tip: During mid-semester and end-semester exams, reading tables fill up quickly after 5:00 PM. Arrive early, keep mobile phones on silent, and use Refread for previous research/reference reading. Verify official exam-week library hours via university circulars.',
    keywords: ['exam study', 'library hours', 'quiet zone', 'reading hall', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },

  // =========================================================================
  // 3. HOSTELS & MESS (Official + Demo)
  // =========================================================================
  {
    id: 'kb-hos-01',
    title: 'Separate On-Campus Boys & Girls Hostels',
    category: 'Hostels & Mess',
    description:
      'GLA University provides separate on-campus residential hostel blocks for boys and girls. Rooms are available in single, double, and triple-seater configurations with choices of AC and Non-AC variants subject to allotment availability.',
    keywords: ['hostel', 'accommodation', 'boys hostel', 'girls hostel', 'rooms', 'single', 'double', 'triple', 'ac', 'non-ac', 'dorm'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'GLA University Campus Facilities',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-hos-02',
    title: 'Hostel Amenities: Wi-Fi, Common Rooms & Laundry',
    category: 'Hostels & Mess',
    description:
      'Residential hostels at GLA University are furnished with essential student furniture and equipped with high-speed Wi-Fi connectivity, common rooms for indoor recreation, laundry services, and dedicated hostel support.',
    keywords: ['hostel amenities', 'laundry', 'common room', 'hostel wifi', 'furnished', 'residential'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
    sourceName: 'GLA University Campus Life',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-hos-03',
    title: 'Hostel Mess Dining Facilities',
    category: 'Hostels & Mess',
    description:
      'Hostel residential blocks include dedicated mess facilities serving hygienic, nutritious home-style vegetarian meals to resident students on campus.',
    keywords: ['mess', 'food', 'meals', 'dining', 'breakfast', 'lunch', 'dinner', 'hostel food'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
    sourceName: 'GLA University Campus Life',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-hos-04',
    title: 'Sample Hostel Packing Checklist for Freshers (Demo)',
    category: 'Hostels & Mess',
    description:
      'Demonstration checklist for incoming B.Tech students: bring bedsheets, pillow covers, padlock, extension surge strip (if permitted), toiletries, reusable water bottle, umbrella, and copies of admission documents. Always review the official Hostel Rulebook issued during allotment.',
    keywords: ['packing list', 'freshers hostel', 'what to bring', 'hostel checklist', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-hos-05',
    title: 'Sample Weekly Mess Meal Structure Illustration (Demo)',
    category: 'Hostels & Mess',
    description:
      'Demonstration illustration showing a typical university four-meal structure (Breakfast, Lunch, Evening Tea/Snacks, Dinner) with rotating North Indian staples. Actual GLA mess menus and timings are published by the Hostel Mess Committee.',
    keywords: ['mess menu', 'mess timings', 'breakfast', 'lunch', 'dinner', 'snacks', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-hos-06',
    title: 'Sample Hostel Maintenance Request Workflow (Demo)',
    category: 'Hostels & Mess',
    description:
      'Demonstration workflow: Students can practice submitting electrical, plumbing, or Wi-Fi repair tickets using the Demo Helpdesk Ticket system on the Student Services page. For real hostel maintenance, contact your assigned hostel warden or official GLAMS portal.',
    keywords: ['hostel maintenance', 'warden', 'repair', 'electrical', 'plumbing', 'complaint', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },

  // =========================================================================
  // 4. TRANSPORT (Official + Demo)
  // =========================================================================
  {
    id: 'kb-trn-01',
    title: 'University Bus Fleet for Day Scholars',
    category: 'Transport',
    description:
      'GLA University operates a dedicated fleet of university buses providing daily commuting facilities for day scholars traveling from Mathura, Vrindavan, Agra, and nearby towns along major routes.',
    keywords: ['transport', 'bus', 'buses', 'commute', 'day scholar', 'mathura', 'vrindavan', 'agra', 'fleet', 'shuttle'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'GLA University Campus Facilities',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-trn-02',
    title: 'Campus Location & Highway Connectivity (NH-19)',
    category: 'Transport',
    description:
      'GLA University is situated at 17km Stone, NH-19 (Mathura-Delhi Highway), P.O. Chaumuhan, Mathura - 281406, Uttar Pradesh, approximately 17 km from Mathura city center with road access to Delhi NCR and Agra.',
    keywords: ['location', 'address', 'highway', 'nh-19', 'how to reach', 'directions', 'mathura junction', 'chaumuhan'],
    sourceUrl: 'https://www.gla.ac.in/contact-us',
    sourceName: 'GLA University Contact Page',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-trn-03',
    title: 'Internal Campus Mobility (Walking & Bicycles)',
    category: 'Transport',
    description:
      'Inside the 110-acre campus, students commonly walk along pedestrian pathways or use bicycles to move between residential hostels, academic blocks, the library, and sports facilities.',
    keywords: ['cycle', 'bicycle', 'walking', 'internal campus', 'commute inside campus'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
    sourceName: 'GLA University Campus Life',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-trn-04',
    title: 'Sample Bus Pass & Route Inquiry Guide (Demo)',
    category: 'Transport',
    description:
      'Demonstration FAQ: Day scholars seeking route pick-up points, departure schedules, or transport fee details should verify official route charts through the Transport Office or GLAMS student portal. This prototype does not store official bus fees or live GPS locations.',
    keywords: ['bus pass', 'bus route', 'bus timings', 'transport fee', 'pickup point', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },

  // =========================================================================
  // 5. CLUBS & SOCIETIES (Official + Demo)
  // =========================================================================
  {
    id: 'kb-clb-01',
    title: 'GLA University Student Clubs & Societies Ecosystem',
    category: 'Clubs & Societies',
    description:
      'GLA University hosts 40+ active student-run clubs and societies spanning technical, cultural, media, literary, departmental, and sports domains. Clubs operate under faculty mentors and the Student Affairs / Dean of Students Welfare (DSW) framework.',
    keywords: ['clubs', 'societies', 'student clubs', 'extracurricular', 'join club', 'dsw', 'activities', 'campus life'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'GLA University Clubs & Societies',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-clb-02',
    title: 'MediaScoop — Official Media & Creative Club',
    category: 'Clubs & Societies',
    description:
      'MediaScoop is the recognized campus media and creative club at GLA University. It leads campus event reporting, multimedia storytelling, photography, videography, and creative digital coverage, and organizes flagship initiatives such as the GLA Creators Awards.',
    keywords: ['mediascoop', 'media club', 'photography', 'videography', 'journalism', 'content creation', 'creators awards'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'GLA University Clubs & Societies',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-clb-03',
    title: 'Cyberonites — Cybersecurity & Ethical Hacking Society',
    category: 'Clubs & Societies',
    description:
      'Cyberonites is a well-known student-driven cybersecurity community at GLA University (founded in 2016) focused on ethical hacking, digital defense, Capture the Flag (CTF) competitions, hands-on security workshops, and mentorship with industry practitioners.',
    keywords: ['cyberonites', 'cybersecurity', 'ethical hacking', 'ctf', 'security', 'infosec', 'technical club'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'GLA University Clubs & Societies',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-clb-04',
    title: 'CSI Student Chapter (Computer Society of India) — Mathura',
    category: 'Clubs & Societies',
    description:
      'The Computer Society of India (CSI) Student Chapter at GLA University operates actively with the computer engineering community to strengthen coding, problem-solving, software development, hackathons, technical symposiums, and career readiness.',
    keywords: ['csi', 'computer society of india', 'coding', 'hackathon', 'programming', 'software', 'mathura chapter', 'technical club'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'GLA University Clubs & Societies',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-clb-05',
    title: 'Ninad (Music) & Natraj (Dance) Cultural Clubs',
    category: 'Clubs & Societies',
    description:
      'Ninad (the campus music club) and Natraj (the dance club) are prominent cultural clubs at GLA University that nurture vocalists, instrumentalists, and classical/contemporary dancers for university festivals and inter-college competitions.',
    keywords: ['ninad', 'natraj', 'music', 'dance', 'singing', 'cultural club', 'band', 'instruments'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'GLA University Clubs & Societies',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-clb-06',
    title: 'Vihiti (Theatre) & Drishti (Photography) Clubs',
    category: 'Clubs & Societies',
    description:
      'Vihiti fosters stage theatre, nukkad natak, acting, and scriptwriting, while Drishti brings together photography and visual storytelling enthusiasts across GLA University campus life.',
    keywords: ['vihiti', 'drishti', 'theatre', 'drama', 'acting', 'photography', 'camera', 'cultural'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'GLA University Clubs & Societies',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-clb-07',
    title: 'Saturangle (Debate) & Literario (Literary) Clubs',
    category: 'Clubs & Societies',
    description:
      'Saturangle and Literario cultivate public speaking, parliamentary debate, creative writing, poetry, and literary events such as Parley and Kavya Sangam at GLA University.',
    keywords: ['saturangle', 'literario', 'debate', 'public speaking', 'writing', 'poetry', 'literary', 'parley', 'kavya sangam'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'GLA University Clubs & Societies',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-clb-08',
    title: 'Technical & Departmental Clubs: Gloud, Datum & GFG Chapter',
    category: 'Clubs & Societies',
    description:
      'Specialized technical communities such as Gloud (cloud computing), Datum (data science & analytics), BCA-O-CRATES, and GeeksforGeeks (GFG) student chapters organize peer coding sessions, cloud labs, and data workshops.',
    keywords: ['gloud', 'datum', 'gfg', 'geeksforgeeks', 'cloud', 'data science', 'ai', 'coding club', 'departmental'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'GLA University Clubs & Societies',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-clb-09',
    title: 'Sample Cyberonites Weekly CTF Practice Slot (Demo)',
    category: 'Clubs & Societies',
    description:
      'Demonstration meeting schedule: Fridays 5:00 PM–6:30 PM beginner-friendly Capture the Flag (CTF) & Linux Security walkthrough (Demo Data — Not Official). Check official club recruitment notices on campus or DSW circulars for real dates.',
    keywords: ['cyberonites schedule', 'ctf practice', 'club timing', 'friday', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-clb-10',
    title: 'Sample CSI Mathura Chapter Coding Circle (Demo)',
    category: 'Clubs & Societies',
    description:
      'Demonstration meeting schedule: Wednesdays 4:30 PM–6:00 PM Data Structures & Algorithms problem-solving session for 1st and 2nd-year B.Tech students (Demo Data — Not Official).',
    keywords: ['csi schedule', 'dsa circle', 'coding session', 'wednesday', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-clb-11',
    title: 'Sample MediaScoop Content & Editing Meetup (Demo)',
    category: 'Clubs & Societies',
    description:
      'Demonstration meeting schedule: Saturdays 11:00 AM–1:00 PM campus reel editing, camera framing, and event journalism orientation for new members (Demo Data — Not Official).',
    keywords: ['mediascoop schedule', 'video editing', 'orientation', 'saturday', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-clb-12',
    title: 'How Demo Club Interest Registration Works in This Prototype (Demo)',
    category: 'Clubs & Societies',
    description:
      'Students can register simulated interest in any club from the Clubs & Societies directory. Registrations are stored locally in the prototype for demonstration purposes and do not submit official forms to GLA University.',
    keywords: ['join club', 'register interest', 'club form', 'membership', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },

  // =========================================================================
  // 6. CAMPUS EVENTS (Official + Demo)
  // =========================================================================
  {
    id: 'kb-evt-01',
    title: 'Spandan — Flagship Annual Cultural & Inter-University Fest',
    category: 'Campus Events',
    description:
      'Spandan is GLA University’s flagship annual cultural fest bringing together music, dance, theatre, literary competitions, celebrity performances, and inter-university participation. Exact annual dates are announced on the official events page.',
    keywords: ['spandan', 'cultural fest', 'annual fest', 'events', 'concert', 'fest', 'celebration'],
    sourceUrl: 'https://www.gla.ac.in/events',
    sourceName: 'GLA University Events',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-evt-02',
    title: 'Official University Events, Conferences & Technical Symposiums',
    category: 'Campus Events',
    description:
      'GLA University regularly hosts academic conferences, coding hackathons, technical symposiums, GLA Creators Awards, literary meets (Kavya Sangam, Parley), and sports tournaments. Verify current official schedules on the GLA Events portal.',
    keywords: ['events', 'conferences', 'symposium', 'hackathon', 'calendar', 'workshops', 'upcoming'],
    sourceUrl: 'https://www.gla.ac.in/events',
    sourceName: 'GLA University Events',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-evt-03',
    title: 'Upcoming Demo Event: Campus AI & RAG Build Workshop (Nov 28, 2026)',
    category: 'Campus Events',
    description:
      'Demonstration upcoming event (Demo Data — Not Official): Hands-on B.Tech workshop on building Retrieval-Augmented Generation (RAG) apps with Python and TypeScript, scheduled for November 28, 2026 (2:00 PM–5:00 PM) by CSI Student Chapter (Demo).',
    keywords: ['upcoming events', 'rag workshop', 'ai workshop', 'november 2026', 'technical event', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/events',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-evt-04',
    title: 'Upcoming Demo Event: CyberShield Mini-CTF Challenge (Dec 05, 2026)',
    category: 'Campus Events',
    description:
      'Demonstration upcoming event (Demo Data — Not Official): Beginner-friendly 6-hour cybersecurity Capture the Flag competition focusing on web security and cryptography, scheduled for December 5, 2026 (10:00 AM–4:00 PM) with Cyberonites (Demo).',
    keywords: ['upcoming events', 'ctf', 'cybersecurity event', 'december 2026', 'competition', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/events',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-evt-05',
    title: 'Upcoming Demo Event: Winter Acoustic Evening by Ninad (Dec 12, 2026)',
    category: 'Campus Events',
    description:
      'Demonstration upcoming event (Demo Data — Not Official): Open-air evening acoustic music showcase and student jam session planned for December 12, 2026 (5:30 PM–8:00 PM) (Demo).',
    keywords: ['upcoming events', 'music event', 'ninad', 'acoustic', 'cultural', 'december 2026', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/events',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-evt-06',
    title: 'Upcoming Demo Event: First-Year Resume & GitHub Clinic (Dec 18, 2026)',
    category: 'Campus Events',
    description:
      'Demonstration upcoming event (Demo Data — Not Official): Career prep workshop introducing Git, GitHub portfolios, and academic project documentation for 1st-year engineering students on December 18, 2026 (3:00 PM–5:00 PM) (Demo).',
    keywords: ['upcoming events', 'resume', 'github', 'career workshop', 'first year', 'december 2026', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/events',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-evt-07',
    title: 'Upcoming Demo Event: Inter-Hostel Basketball Cup (Jan 16, 2027)',
    category: 'Campus Events',
    description:
      'Demonstration upcoming event (Demo Data — Not Official): Weekend inter-hostel basketball knockout tournament scheduled for January 16, 2027 (9:00 AM–5:00 PM) at the campus sports courts (Demo).',
    keywords: ['upcoming events', 'sports event', 'basketball', 'inter-hostel', 'january 2027', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/events',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-evt-08',
    title: 'Past Demo Event Archive: Freshers Coding Kickoff (Oct 10, 2026)',
    category: 'Campus Events',
    description:
      'Demonstration past event (Demo Data — Not Official, concluded Oct 10, 2026): Introductory C and Python programming contest for first-year B.Tech students. Listed in the past archive and never marked as upcoming.',
    keywords: ['past event', 'october 2026', 'freshers coding', 'archive', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/events',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },

  // =========================================================================
  // 7. ACADEMICS (Official + Demo)
  // =========================================================================
  {
    id: 'kb-aca-01',
    title: 'Institute of Engineering & Technology (IET) — B.Tech Programs',
    category: 'Academics',
    description:
      'The Institute of Engineering & Technology (IET) at GLA University offers undergraduate B.Tech programs in Computer Science & Engineering (with modern tracks such as AI/ML, Data Science, and Blockchain), Electronics & Communication, Mechanical, Civil, and Electrical Engineering.',
    keywords: ['btech', 'b.tech', 'iet', 'engineering', 'computer science', 'cse', 'ai ml', 'mechanical', 'ece', 'civil', 'academics'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
    sourceName: 'GLA University Official Website',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-aca-02',
    title: 'Schools & Institutes Across GLA University',
    category: 'Academics',
    description:
      'Beyond Engineering (IET), GLA University houses the Institute of Business Management (IBM), Faculty of Pharmacy, Institute of Applied Sciences & Humanities, and departments for Computer Applications (BCA/MCA), Biotechnology, Law, Agriculture, and Education.',
    keywords: ['institutes', 'departments', 'ibm', 'mba', 'bba', 'pharmacy', 'bca', 'mca', 'biotechnology', 'faculties', 'courses'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
    sourceName: 'GLA University Official Website',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-aca-03',
    title: 'NAAC A+ Accreditation & Academic Governance',
    category: 'Academics',
    description:
      'GLA University, Mathura holds a NAAC A+ accreditation grade, reflecting its structured curriculum, laboratory infrastructure, student support systems, and academic governance.',
    keywords: ['naac', 'accreditation', 'ranking', 'grade', 'a+', 'recognition', 'ugc'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
    sourceName: 'GLA University Official Website',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-aca-04',
    title: 'GLAMS Academic Portal — Attendance, Results & Notices',
    category: 'Academics',
    description:
      'GLAMS (GLA University Management System) at student.glauniversity.in is the official in-house portal where students log in with university credentials to check real-time attendance, exam results, timetables, internal notices, and fee receipts.',
    keywords: ['glams', 'attendance', 'results', 'timetable', 'marks', 'grades', 'portal', 'student login', 'notices'],
    sourceUrl: 'https://student.glauniversity.in/main/',
    sourceName: 'GLAMS Student Portal',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-aca-05',
    title: 'Turnitin & Academic Integrity Tools via Library',
    category: 'Academics',
    description:
      'GLA University provides access to research databases and plagiarism-checking tools like Turnitin through its library system to uphold academic integrity in project reports, dissertations, and research papers.',
    keywords: ['turnitin', 'plagiarism', 'academic integrity', 'project report', 'thesis', 'research'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
    sourceName: 'GLA University Libraries',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-aca-06',
    title: 'Sample First-Year B.Tech CSE Demo Timetable (Demo)',
    category: 'Academics',
    description:
      'Demonstration sample weekly timetable (Demo Data — Not Official) showing illustrative slots for Engineering Mathematics, Programming in C/Python, Basic Electronics, Communication Skills, and Coding Labs. Never rely on this for actual classes — always check your personal GLAMS timetable.',
    keywords: ['demo timetable', 'class schedule', 'btech timetable', 'first year classes', 'labs', 'demo'],
    sourceUrl: 'https://student.glauniversity.in/main/',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-aca-07',
    title: 'Sample Academic Deadlines & Assignment Reminders (Demo)',
    category: 'Academics',
    description:
      'Demonstration academic calendar items (Demo Data — Not Official): Lab Record Verification (Dec 02, 2026), Mini-Project Viva Demo (Dec 10, 2026), End-Semester Exam Form Check (Dec 15, 2026). Verify official dates on GLAMS or with your department coordinator.',
    keywords: ['deadlines', 'assignments', 'viva', 'exam form', 'academic calendar', 'submission', 'demo'],
    sourceUrl: 'https://student.glauniversity.in/main/',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-aca-08',
    title: 'Sample Faculty Consultation Slot Booking Guide (Demo)',
    category: 'Academics',
    description:
      'Demonstration guidance (Demo Data — Not Official): Students preparing for viva or doubt-clearing sessions can draft questions in advance and request office-hour slots through official departmental channels or GLAMS. This prototype does not publish personal faculty phone numbers or live schedules.',
    keywords: ['faculty', 'professor', 'consultation', 'office hours', 'doubt clearing', 'mentor', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-aca-09',
    title: 'Sample Exam Preparation & Assignment Checklist (Demo)',
    category: 'Academics',
    description:
      'Demonstration study guide (Demo Data — Not Official): Carry your physical university ID card and admit card to exam halls, review syllabus units on GLAMS, practice past lab exercises, and confirm room allotment from official notice boards.',
    keywords: ['exam', 'admit card', 'syllabus', 'preparation', 'assignment', 'mid sem', 'end sem', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },

  // =========================================================================
  // 8. STUDENT SERVICES (Official + Demo)
  // =========================================================================
  {
    id: 'kb-srv-01',
    title: 'Dean of Students’ Welfare (DSW) & Student Corner',
    category: 'Student Services',
    description:
      'Student welfare at GLA University is overseen by the Dean of Students’ Welfare (DSW) and the Student Affairs Council, supporting clubs, sports councils, cultural fests, peer mentoring, counseling guidance, and day-to-day student assistance.',
    keywords: ['dsw', 'student welfare', 'student services', 'counseling', 'mentoring', 'student corner', 'support'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'GLA University Student Services',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-srv-02',
    title: 'Student Grievance Redressal Committee (SGRC)',
    category: 'Student Services',
    description:
      'GLA University maintains a formal Student Grievance Redressal Committee (SGRC) to address academic concerns, administrative issues, and student grievances through structured and transparent institutional channels.',
    keywords: ['grievance', 'sgrc', 'complaint', 'redressal', 'academic dispute', 'helpdesk'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'GLA University Student Services',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-srv-03',
    title: 'Anti-Ragging Zero-Tolerance Policy & Verified Helplines',
    category: 'Student Services',
    description:
      'GLA University enforces a strict zero-tolerance policy against ragging across campus and hostels, backed by an Anti-Ragging Committee, Anti-Ragging Squad, and Mentoring Cell. Students submit online undertakings via antiragging.in. Official report emails: antiragging@gla.ac.in and chiefproctor@gla.ac.in; National UGC Anti-Ragging Helpline: 1800-180-5522.',
    keywords: ['anti-ragging', 'ragging', 'safety', 'helpline', 'proctor', 'ugc', 'complaint', 'campus safety'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'GLA University Student Services',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-srv-04',
    title: 'Internal Committee (IC) for Campus Safety',
    category: 'Student Services',
    description:
      'An Internal Committee (IC) operates at GLA University to safeguard campus well-being and handle workplace or campus harassment prevention in accordance with statutory guidelines.',
    keywords: ['internal committee', 'safety', 'harassment', 'women safety', 'campus security', 'welfare'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'GLA University Student Services',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-srv-05',
    title: 'Demo Helpdesk Ticket System Usage Guide (Demo)',
    category: 'Student Services',
    description:
      'Demonstration feature (Demo Data — Not Official): The Student Services page includes a simulated helpdesk ticket form where you can generate a sample ticket ID (e.g., DEMO-TKT-104) and track status transitions locally. It does not transmit requests to GLA University offices.',
    keywords: ['ticket', 'helpdesk ticket', 'support request', 'track ticket', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-srv-06',
    title: 'Sample Lost & Found Notice — Calculator Near Library (Demo)',
    category: 'Student Services',
    description:
      'Demonstration notice (Demo Data — Not Official): Sample lost-and-found entry illustrating how a campus helpdesk logs found items (e.g., Casio fx-991EX scientific calculator found near study desk). For real lost items on campus, contact campus security or your academic block office.',
    keywords: ['lost and found', 'lost item', 'calculator', 'id card lost', 'security desk', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-srv-07',
    title: 'Sample Lost & Found Notice — USB Drive in Coding Lab (Demo)',
    category: 'Student Services',
    description:
      'Demonstration notice (Demo Data — Not Official): Illustrative entry for a 32GB USB drive logged at a demo lab desk. Always label your hardware and check with real lab technicians if you misplace items.',
    keywords: ['lost and found', 'usb', 'pendrive', 'lab', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-srv-08',
    title: 'Sample ID Card Replacement Process FAQ (Demo)',
    category: 'Student Services',
    description:
      'Demonstration FAQ (Demo Data — Not Official): If a student misplaces their university ID card, they typically submit an application via the Student Affairs / Registrar desk or GLAMS portal. Check official university instructions for actual replacement steps and charges.',
    keywords: ['id card', 'replacement', 'lost id', 'student card', 'registrar', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },

  // =========================================================================
  // 9. PLACEMENTS (Official + Demo)
  // =========================================================================
  {
    id: 'kb-plc-01',
    title: 'GLA University Training & Placement Ecosystem Overview',
    category: 'Placements',
    description:
      'GLA University operates a dedicated Training & Placement cell coordinating corporate recruitment drives across engineering, management, and pharmacy programs. Placement percentages, total offers, and recruiter counts change every academic session — verify audited cycle-specific figures directly on the official Placements Overview page (reference checked 2026-11-20).',
    keywords: ['placements', 'jobs', 'career', 'placement rate', 'offers', 'recruiters', 'training'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
    sourceName: 'GLA University Placements Overview',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
    freshnessStatus: 'session-sensitive',
    freshnessNote: 'Placement rates and offer counts change each academic session; verify audited reports on gla.ac.in/placements/overview.',
  },
  {
    id: 'kb-plc-02',
    title: 'Placement Packages & Cycle-Specific Verification Policy',
    category: 'Placements',
    description:
      'Highest and average salary packages at GLA University vary by academic session, degree program, and graduating batch. To avoid presenting outdated or unverified figures as current statistics, this prototype does not assert current-year CTC/package numbers without an official audited session report. Check https://www.gla.ac.in/placements/overview (reference checked 2026-11-20) for official published placement data.',
    keywords: ['package', 'highest package', 'average package', 'salary', 'ctc', 'lpa', 'btech placements'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
    sourceName: 'GLA University Placements Overview',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
    freshnessStatus: 'session-sensitive',
    freshnessNote: 'Package statistics vary every academic session — verify official dated reports on gla.ac.in/placements/overview.',
  },
  {
    id: 'kb-plc-03',
    title: 'Campus Recruiters Participating at GLA University',
    category: 'Placements',
    description:
      'Publicly listed recruiters that have participated in GLA University campus placement drives (as referenced on gla.ac.in/placements/overview, checked 2026-11-20) include multinational technology, consulting, and enterprise firms such as Microsoft, Amazon, Infosys, Wipro, Capgemini, Accenture, Cognizant, Deloitte, VMware, and Zscaler. Participating companies vary by recruitment season.',
    keywords: ['recruiters', 'companies', 'microsoft', 'amazon', 'infosys', 'wipro', 'capgemini', 'accenture', 'deloitte', 'cognizant'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
    sourceName: 'GLA University Placements Overview',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
    freshnessStatus: 'session-sensitive',
    freshnessNote: 'Recruiter participation changes each placement cycle; confirm current season drives via the T&P Cell.',
  },
  {
    id: 'kb-plc-04',
    title: 'Corporate Training, Codethons & Mock Interviews',
    category: 'Placements',
    description:
      'GLA University integrates technical aptitude training, coding marathons (codethons), soft-skills development, and mock interview practice to prepare undergraduate and postgraduate students for campus recruitment.',
    keywords: ['training', 'codethon', 'mock interview', 'soft skills', 'aptitude', 'career guidance', 't&p'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
    sourceName: 'GLA University Placements Overview',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-plc-05',
    title: 'Sample First-Year Career Preparation Roadmap (Demo)',
    category: 'Placements',
    description:
      'Demonstration career tip (Demo Data — Not Official): First-year B.Tech students can build a strong foundation by practicing one programming language consistently, maintaining a clean GitHub portfolio, joining technical clubs like CSI or Cyberonites, and building small real-world projects.',
    keywords: ['first year career', 'roadmap', 'internship prep', 'portfolio', 'github', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-plc-06',
    title: 'Sample Mock Interview Practice Checklist (Demo)',
    category: 'Placements',
    description:
      'Demonstration checklist (Demo Data — Not Official): Keep a one-page resume highlighting 2–3 verifiable projects, be ready to explain architecture trade-offs, and practice core DSA fundamentals before placement drives.',
    keywords: ['resume', 'interview tips', 'placement prep', 'dsa', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },

  // =========================================================================
  // 10. ADMISSIONS & GENERAL (Official + Demo)
  // =========================================================================
  {
    id: 'kb-adm-01',
    title: 'About GLA University, Mathura — General Overview',
    category: 'Admissions & General',
    description:
      'GLA University, Mathura is a private university in Uttar Pradesh accredited with NAAC A+, offering undergraduate, postgraduate, diploma, and doctoral programs across engineering, management, pharmacy, computer applications, sciences, and humanities.',
    keywords: ['about gla', 'gla university', 'mathura', 'private university', 'uttar pradesh', 'overview', 'programs'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
    sourceName: 'GLA University Official Website',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-adm-02',
    title: 'Official Admission Inquiry & Helpline Information',
    category: 'Admissions & General',
    description:
      'For verified admission eligibility, entrance test (GLAET) details, scholarships, and current program fee structures, prospective students should consult the official GLA University website or contact the official Admission Helpline (+91-9027068068) and email (glauniversity@gla.ac.in).',
    keywords: ['admissions', 'admission helpline', 'glaet', 'fees', 'scholarship', 'apply', 'eligibility', 'enrollment'],
    sourceUrl: 'https://www.gla.ac.in/contact-us',
    sourceName: 'GLA University Contact Page',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-adm-03',
    title: 'Why Exact Fees & Policies Must Be Checked Officially',
    category: 'Admissions & General',
    description:
      'Tuition fees, hostel charges, scholarship slabs, and admission deadlines change every academic session. To prevent misinformation, this assistant never invents or estimates fee numbers and always directs students to www.gla.ac.in or the official Admissions Office.',
    keywords: ['tuition fee', 'hostel fee', 'fee structure', 'cost', 'charges', 'scholarship policy'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
    sourceName: 'GLA University Official Website',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-adm-04',
    title: 'Sample New Student Orientation Week Guide (Demo)',
    category: 'Admissions & General',
    description:
      'Demonstration onboarding guide (Demo Data — Not Official): New students typically activate their GLAMS login, verify their official section timetable, tour the Central Library, and attend club introduction booths during the opening weeks.',
    keywords: ['freshers', 'orientation', 'first week', 'new student', 'onboarding', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-adm-05',
    title: 'About This Academic Prototype — Non-Affiliation Notice (Demo)',
    category: 'Admissions & General',
    description:
      'GLA Campus AI is an independent first-year B.Tech student academic project demonstrating Retrieval-Augmented Generation (RAG), grounded citations, and hallucination prevention. It is NOT an official GLA University product or administrative portal.',
    keywords: ['prototype', 'project', 'unofficial', 'student project', 'disclaimer', 'about', 'btech project'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },

  // =========================================================================
  // 11. CONTACTS & PORTALS (Official + Demo)
  // =========================================================================
  {
    id: 'kb-cnt-01',
    title: 'GLA University Official Campus Address',
    category: 'Contacts & Portals',
    description:
      'Official Campus Address: GLA University, 17km Stone, NH-19, Mathura-Delhi Road, P.O. Chaumuhan, Mathura - 281406, Uttar Pradesh, India (approximately 17 km from Mathura).',
    keywords: ['address', 'location', 'pin code', '281406', 'chaumuhan', 'nh-19', 'where is gla'],
    sourceUrl: 'https://www.gla.ac.in/contact-us',
    sourceName: 'GLA University Contact Page',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-cnt-02',
    title: 'Official University Telephone Numbers & General Email',
    category: 'Contacts & Portals',
    description:
      'Verified GLA University contact details from the official contact page: Landline +91-5662-250900, 250909, 241489; Mobile +91-9927064017; Admission Helpline +91-9027068068; Official Email: glauniversity@gla.ac.in.',
    keywords: ['contact', 'phone', 'phone number', 'email', 'helpline', 'call', 'office', 'reach gla'],
    sourceUrl: 'https://www.gla.ac.in/contact-us',
    sourceName: 'GLA University Contact Page',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-cnt-03',
    title: 'Official GLAMS Student Portal Link',
    category: 'Contacts & Portals',
    description:
      'Access the official GLAMS student portal at https://student.glauniversity.in/main/ to view personal attendance, class timetables, examination results, library linkages, and university notices using your student credentials.',
    keywords: ['glams', 'student portal', 'login', 'student.glauniversity.in', 'erp', 'dashboard'],
    sourceUrl: 'https://student.glauniversity.in/main/',
    sourceName: 'GLAMS Student Portal',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-cnt-04',
    title: 'Official GLA University Website Directory',
    category: 'Contacts & Portals',
    description:
      'Key official GLA University web pages: Main Mathura Portal (gla.ac.in/mathura), Campus Facilities (gla.ac.in/facilities/campus-facilities), Clubs & Societies (gla.ac.in/campus-life/clubs-societies), Libraries (gla.ac.in/campus-life/libraries), Events (gla.ac.in/events), Student Services (gla.ac.in/students), and Placements (gla.ac.in/placements/overview).',
    keywords: ['website', 'official links', 'urls', 'directory', 'gla.ac.in', 'portals'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
    sourceName: 'GLA University Official Website',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-cnt-05',
    title: 'Anti-Ragging Official Email & UGC National Helpline',
    category: 'Contacts & Portals',
    description:
      'Official anti-ragging reporting channels published by GLA University: email antiragging@gla.ac.in or chiefproctor@gla.ac.in, and the 24x7 National UGC Anti-Ragging Helpline at 1800-180-5522. Online undertakings are submitted via antiragging.in.',
    keywords: ['anti-ragging helpline', '1800-180-5522', 'antiragging@gla.ac.in', 'chiefproctor@gla.ac.in', 'emergency safety'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'GLA University Student Services',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-cnt-06',
    title: 'Sample GLAMS Password Reset Guidance (Demo)',
    category: 'Contacts & Portals',
    description:
      'Demonstration FAQ (Demo Data — Not Official): If you cannot sign in to GLAMS, verify your university roll number and check for a Forgot Password option on the official login page, or contact the campus IT helpdesk with your student ID.',
    keywords: ['glams password', 'forgot password', 'login issue', 'cannot login', 'it helpdesk', 'demo'],
    sourceUrl: 'https://student.glauniversity.in/main/',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },

  // =========================================================================
  // 12. SOCIAL & COMMUNITY (Official + Unofficial / Demo)
  // =========================================================================
  {
    id: 'kb-soc-01',
    title: 'Official GLA University Instagram (@glauniv)',
    category: 'Social & Community',
    description:
      'Official university Instagram channel (identified as Official by the project owner): https://www.instagram.com/glauniv/. Shares campus highlights, official announcements, and event recaps. Note: This prototype links directly to the channel and does not scrape live Instagram posts.',
    keywords: ['instagram', 'glauniv', 'official instagram', 'social media', 'photos', 'reels'],
    sourceUrl: 'https://www.instagram.com/glauniv/',
    sourceName: 'GLA University Instagram (Owner-Identified Official)',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-soc-02',
    title: 'Official GLA University YouTube Channel (@gla-university)',
    category: 'Social & Community',
    description:
      'Official university YouTube channel: https://www.youtube.com/@gla-university. Features campus tours, convocation highlights, cultural fest aftermovies, and academic showcases. This app provides a direct link without automated video scraping.',
    keywords: ['youtube', 'videos', 'campus tour', 'gla-university', 'social media', 'channel'],
    sourceUrl: 'https://www.youtube.com/@gla-university',
    sourceName: 'GLA University YouTube',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-soc-03',
    title: 'Unofficial / Community Student Instagram Pages',
    category: 'Social & Community',
    description:
      'Student-run and community Instagram pages listed by the project owner as Unofficial / Community: @gla_freshers, @gla_buddy, @gla._verse, and @gla_short. Important: Posts from unofficial community accounts are NOT authoritative university announcements and must be verified against gla.ac.in or GLAMS.',
    keywords: ['gla_freshers', 'gla_buddy', 'gla._verse', 'gla_short', 'community', 'unofficial', 'student pages', 'memes', 'freshers page'],
    sourceUrl: 'https://www.instagram.com/gla_freshers/',
    sourceName: 'Demo Data — Community Directory Notice',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },

  // =========================================================================
  // ADDITIONAL DEPTH RECORDS TO EXCEED 85+ HIGH-VALUE KB ENTRIES
  // =========================================================================
  {
    id: 'kb-ext-01',
    title: 'Campus Life Overview — Holistic Student Development',
    category: 'Campus Facilities',
    description:
      'GLA University campus life blends residential hostel living, student-driven societies, sports leagues, cultural festivals, innovation hackathons, and mentoring ecosystems across its 110-acre Mathura campus.',
    keywords: ['campus life', 'student life', 'holistic', 'culture', 'mathura campus'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
    sourceName: 'GLA University Campus Life',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-02',
    title: 'Computer Science & Engineering (CSE) Specializations',
    category: 'Academics',
    description:
      'Within the Institute of Engineering & Technology (IET), B.Tech Computer Science & Engineering includes contemporary specialization pathways such as Artificial Intelligence & Machine Learning, Data Science, Cloud Computing, and Blockchain.',
    keywords: ['cse', 'ai', 'ml', 'machine learning', 'data science', 'blockchain', 'cloud computing', 'specialization'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
    sourceName: 'GLA University Official Website',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-03',
    title: 'Institute of Business Management (IBM) Programs',
    category: 'Academics',
    description:
      'The Institute of Business Management (IBM) at GLA University offers management degree programs such as BBA and MBA with focus areas across finance, marketing, human resources, and business analytics.',
    keywords: ['ibm', 'mba', 'bba', 'management', 'business', 'finance', 'marketing'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
    sourceName: 'GLA University Official Website',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-04',
    title: 'Faculty of Pharmacy & Applied Sciences',
    category: 'Academics',
    description:
      'GLA University offers pharmacy programs (D.Pharm, B.Pharm, M.Pharm) and applied sciences programs supported by dedicated chemistry, pharmaceutics, and biotechnology research laboratories.',
    keywords: ['pharmacy', 'bpharm', 'dpharm', 'mpharm', 'biotechnology', 'chemistry', 'applied sciences'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
    sourceName: 'GLA University Official Website',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-05',
    title: 'GLA Creators Awards by MediaScoop',
    category: 'Campus Events',
    description:
      'Organized by MediaScoop at GLA University, the GLA Creators Awards celebrates student creativity in digital content, filmmaking, photography, design, and campus storytelling.',
    keywords: ['creators awards', 'mediascoop', 'awards', 'content creators', 'filmmaking'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'GLA University Clubs & Societies',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-06',
    title: 'Literary Meets: Parley & Kavya Sangam',
    category: 'Campus Events',
    description:
      'GLA University literary clubs host vibrant language and debate showcases including Parley (inter-college debating) and Kavya Sangam (poetry and Hindi/English literary recitals).',
    keywords: ['parley', 'kavya sangam', 'poetry', 'debate', 'literary fest', 'events'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'GLA University Clubs & Societies',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-07',
    title: 'Premium & Multi-Configuration Hostel Options',
    category: 'Hostels & Mess',
    description:
      'Depending on availability and annual allotment rules, GLA University residential options include standard single, double, and triple-seater AC/Non-AC hostel rooms as well as specialized wing or flat configurations.',
    keywords: ['ac room', 'single room', 'double seater', 'triple seater', 'hostel room types', 'allotment'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'GLA University Campus Facilities',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-08',
    title: 'E-Resources & Legal/Management Databases in Library',
    category: 'Library',
    description:
      'Beyond engineering titles, GLA University Library subscribes to specialized management and law databases including Emerald Insight, EBSCOhost, LexisNexis, and SCC Online to support MBA, law, and doctoral scholars.',
    keywords: ['lexisnexis', 'scc online', 'emerald insight', 'ebscohost', 'law database', 'mba journals'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
    sourceName: 'GLA University Libraries',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-09',
    title: 'Sample First-Year Coding Lab Etiquette & Tips (Demo)',
    category: 'Academics',
    description:
      'Demonstration student tip (Demo Data — Not Official): Save your C/Python lab files to cloud/Git backup at the end of every lab session, log out of shared lab terminals, and keep your lab observation record signed weekly.',
    keywords: ['coding lab', 'lab tips', 'computer lab', 'c programming', 'python lab', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-10',
    title: 'Sample Hostel Wi-Fi Troubleshooting Steps (Demo)',
    category: 'Hostels & Mess',
    description:
      'Demonstration troubleshooting FAQ (Demo Data — Not Official): If campus Wi-Fi drops, forget and reconnect to the campus SSID, confirm your portal session hasn’t expired, or log a ticket with the campus IT helpdesk.',
    keywords: ['wifi not working', 'internet issue', 'hostel wifi', 'it support', 'troubleshooting', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-11',
    title: 'Sample Day Scholar Commute Tips — Mathura & Vrindavan (Demo)',
    category: 'Transport',
    description:
      'Demonstration tip (Demo Data — Not Official): Day scholars commuting from Mathura or Vrindavan should arrive at designated bus boarding stops 10 minutes before scheduled departure and keep their university ID ready.',
    keywords: ['day scholar tips', 'mathura bus', 'vrindavan bus', 'boarding stop', 'commute', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-12',
    title: 'Sample Campus Cycling & Parking Etiquette (Demo)',
    category: 'Transport',
    description:
      'Demonstration guideline (Demo Data — Not Official): Park bicycles neatly in designated stands outside academic blocks and hostels, always use a sturdy lock, and yield to pedestrians on main walkways.',
    keywords: ['bicycle parking', 'cycle lock', 'campus cycling', 'parking', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-13',
    title: 'Sample Ninad Music Club Jam Session Schedule (Demo)',
    category: 'Clubs & Societies',
    description:
      'Demonstration schedule (Demo Data — Not Official): Thursdays 5:30 PM–7:00 PM open vocal and acoustic practice circle for auditions and fest prep.',
    keywords: ['ninad schedule', 'music practice', 'audition', 'thursday', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-14',
    title: 'Sample Natraj Dance Club Practice Slot (Demo)',
    category: 'Clubs & Societies',
    description:
      'Demonstration schedule (Demo Data — Not Official): Tuesdays and Fridays 5:30 PM–7:00 PM choreography practice across classical, hip-hop, and contemporary styles.',
    keywords: ['natraj schedule', 'dance practice', 'choreography', 'auditions', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-15',
    title: 'Sample Datum Data Science Club Kaggle Study Group (Demo)',
    category: 'Clubs & Societies',
    description:
      'Demonstration schedule (Demo Data — Not Official): Mondays 5:00 PM–6:30 PM Pandas, NumPy, and Machine Learning notebook walkthroughs for beginners.',
    keywords: ['datum', 'data science', 'kaggle', 'python', 'machine learning', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-16',
    title: 'Sample Gloud Cloud Computing Lab Meetup (Demo)',
    category: 'Clubs & Societies',
    description:
      'Demonstration schedule (Demo Data — Not Official): Alternate Saturdays 2:00 PM–4:00 PM introductory workshops on Linux containers, cloud hosting, and GitHub Actions.',
    keywords: ['gloud', 'cloud club', 'docker', 'devops', 'cloud computing', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-17',
    title: 'Sample Vihiti Theatre & Street Play Rehearsal (Demo)',
    category: 'Clubs & Societies',
    description:
      'Demonstration schedule (Demo Data — Not Official): Wednesdays 5:30 PM–7:00 PM voice projection, improv games, and nukkad natak script readings.',
    keywords: ['vihiti schedule', 'nukkad natak', 'acting rehearsal', 'theatre', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-18',
    title: 'Sample Saturangle Parliamentary Debate Meetup (Demo)',
    category: 'Clubs & Societies',
    description:
      'Demonstration schedule (Demo Data — Not Official): Thursdays 4:45 PM–6:15 PM impromptu speaking drills and Asian Parliamentary debate practice.',
    keywords: ['saturangle schedule', 'debate club', 'public speaking', 'mun', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-19',
    title: 'Sample Drishti Campus Photo Walk Event (Demo)',
    category: 'Campus Events',
    description:
      'Demonstration upcoming event (Demo Data — Not Official): Golden-hour campus architecture photo walk organized by Drishti Photography Club on December 06, 2026 (4:00 PM–6:00 PM).',
    keywords: ['drishti', 'photo walk', 'photography event', 'december 2026', 'upcoming', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/events',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-20',
    title: 'Sample Open-Source & Hackathon Pitch Night (Demo)',
    category: 'Campus Events',
    description:
      'Demonstration upcoming event (Demo Data — Not Official): Team formation and 3-minute project pitch night for student developers on January 09, 2027 (4:30 PM–7:00 PM).',
    keywords: ['hackathon', 'pitch night', 'open source', 'january 2027', 'upcoming', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/events',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-21',
    title: 'Past Demo Event Archive: Campus Orientation Expo (Sep 05, 2026)',
    category: 'Campus Events',
    description:
      'Demonstration past event (Demo Data — Not Official, concluded Sep 05, 2026): Welcome showcase where student clubs introduced freshers to campus societies.',
    keywords: ['past event', 'september 2026', 'orientation expo', 'club fair', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/events',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-22',
    title: 'Past Demo Event Archive: Autumn Debate Open (Oct 24, 2026)',
    category: 'Campus Events',
    description:
      'Demonstration past event (Demo Data — Not Official, concluded Oct 24, 2026): Inter-department parliamentary debate hosted in the seminar hall.',
    keywords: ['past event', 'october 2026', 'debate open', 'saturangle', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/events',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-23',
    title: 'Sample Medical Visit Preparation Tip — Aarogyam (Demo)',
    category: 'Student Services',
    description:
      'Demonstration tip (Demo Data — Not Official): When visiting Aarogyam Medical Centre for routine consultation, carry your university ID card and note any known allergies or prescriptions. In emergencies, alert campus security or hostel wardens immediately.',
    keywords: ['medical visit', 'aarogyam tip', 'sick', 'fever', 'doctor visit', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-24',
    title: 'Sample Mental Wellness & Peer Support Note (Demo)',
    category: 'Student Services',
    description:
      'Demonstration guidance (Demo Data — Not Official): Adjusting to first-year university life can feel overwhelming. Students are encouraged to reach out to faculty mentors, senior peer buddies, or the Dean of Students’ Welfare (DSW) counseling support.',
    keywords: ['mental health', 'stress', 'counselor', 'wellness', 'homesick', 'support', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-25',
    title: 'Sample Scholarship Documentation Checklist (Demo)',
    category: 'Admissions & General',
    description:
      'Demonstration FAQ (Demo Data — Not Official): Students applying for university merit or state scholarships should keep digital scans of 10th/12th marksheets, admission receipts, and bank details ready. Always confirm exact eligibility on gla.ac.in.',
    keywords: ['scholarship', 'documents', 'merit scholarship', 'up scholarship', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-26',
    title: 'Sample Attendance Policy Reminder (Demo)',
    category: 'Academics',
    description:
      'Demonstration reminder (Demo Data — Not Official): Track your subject-wise attendance regularly on GLAMS so you stay comfortably above the university’s required attendance threshold before examinations. Confirm exact minimum percentages in official academic regulations.',
    keywords: ['attendance percentage', 'short attendance', 'glams attendance', '75 percent', 'demo'],
    sourceUrl: 'https://student.glauniversity.in/main/',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-27',
    title: 'Sample Viva & Project Presentation Guidelines (Demo)',
    category: 'Academics',
    description:
      'Demonstration tip (Demo Data — Not Official): For B.Tech project vivas, prepare a 2-minute problem statement, live architecture walkthrough, live demo of edge cases (including error handling), and clear separation between verified and simulated data.',
    keywords: ['viva', 'project presentation', 'btech project', 'demo tips', 'rubric', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/students',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-28',
    title: 'Sample Placement Eligibility & CGPA Tip (Demo)',
    category: 'Placements',
    description:
      'Demonstration career tip (Demo Data — Not Official): Many recruiters review academic consistency alongside coding skills. Keep active backlogs cleared and check specific company eligibility criteria announced by the Training & Placement Cell.',
    keywords: ['cgpa', 'eligibility', 'backlog', 'placement criteria', 't&p cell', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/placements/overview',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-29',
    title: 'Sample Hostel Gate Pass & Leave Reminder (Demo)',
    category: 'Hostels & Mess',
    description:
      'Demonstration FAQ (Demo Data — Not Official): Residential students planning weekend or holiday travel should follow official hostel out-pass / leave approval workflows via GLAMS or their respective hostel warden well before departure.',
    keywords: ['gate pass', 'outpass', 'hostel leave', 'home visit', 'warden approval', 'demo'],
    sourceUrl: 'https://student.glauniversity.in/main/',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-30',
    title: 'Sample Campus Weather & Seasonal Gear Tip (Demo)',
    category: 'Campus Facilities',
    description:
      'Demonstration student tip (Demo Data — Not Official): Mathura experiences warm summers (April–June) and chilly foggy mornings in winter (December–January). Carry light cottons and hydration in summer, and warm layers for early morning classes in winter.',
    keywords: ['weather', 'mathura climate', 'winter', 'summer', 'clothes', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/overview',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-31',
    title: 'Sample Inter-Department Study Group Etiquette (Demo)',
    category: 'Library',
    description:
      'Demonstration tip (Demo Data — Not Official): Use designated discussion spaces or cafeterias for collaborative coding debates, and keep the Central Library reading floors strictly silent for individual focus.',
    keywords: ['study group', 'group study', 'library rules', 'discussion', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-32',
    title: 'Sample Sports Trials & Inter-University Teams FAQ (Demo)',
    category: 'Campus Facilities',
    description:
      'Demonstration FAQ (Demo Data — Not Official): Students interested in university cricket, football, basketball, volleyball, or athletics teams watch for Sports Council trial notices at the start of each semester.',
    keywords: ['sports trials', 'cricket team', 'football team', 'basketball team', 'athletics', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-33',
    title: 'Sample Technical Fest Volunteering Guide (Demo)',
    category: 'Clubs & Societies',
    description:
      'Demonstration guide (Demo Data — Not Official): First-year students can volunteer with MediaScoop, CSI, or Cyberonites during workshops and fests to build event management, design, and public-speaking skills.',
    keywords: ['volunteer', 'fest organizing', 'first year clubs', 'certificates', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/clubs-societies',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-34',
    title: 'Sample Official vs Unofficial Information Verification Rule',
    category: 'Social & Community',
    description:
      'Always treat gla.ac.in and student.glauniversity.in (GLAMS) as authoritative for exam dates, holidays, fee deadlines, and administrative notices. Community Instagram pages are great for student culture but should never replace official university circulars.',
    keywords: ['verify', 'rumors', 'official notice', 'holiday notice', 'exam date', 'fact check'],
    sourceUrl: 'https://www.gla.ac.in/mathura',
    sourceName: 'GLA University Official Website',
    sourceType: 'official',
    sourceLabel: 'Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-35',
    title: 'Sample Student Helpdesk Preloaded Ticket Example — Library OPAC (Demo)',
    category: 'Student Services',
    description:
      'Demonstration ticket scenario (Demo Data — Not Official): Illustrates how a student asks for assistance activating remote Refread e-book credentials via the simulated helpdesk tracker.',
    keywords: ['refread login', 'library help', 'sample ticket', 'demo ticket', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/campus-life/libraries',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
  {
    id: 'kb-ext-36',
    title: 'Sample Student Helpdesk Preloaded Ticket Example — Bus Route Inquiry (Demo)',
    category: 'Transport',
    description:
      'Demonstration ticket scenario (Demo Data — Not Official): Illustrates a day-scholar inquiry about Mathura city pick-up schedules tracked inside the Student Services demo helpdesk.',
    keywords: ['bus inquiry', 'transport ticket', 'mathura route', 'demo'],
    sourceUrl: 'https://www.gla.ac.in/facilities/campus-facilities',
    sourceName: 'Demo Data — Campus Prototype',
    sourceType: 'demo',
    sourceLabel: 'Demo Data — Not Official',
    lastChecked: CHECKED_DATE,
  },
];

const SESSION_SENSITIVE_CATEGORIES = new Set([
  'Placements',
  'Admissions & General',
  'Hostels & Mess',
  'Transport',
  'Contacts & Portals',
  'Campus Events',
  'Student Services',
]);

export function isOfficialGlaSourceUrl(url: string): boolean {
  return (
    /^https:\/\/(www\.)?(gla\.ac\.in|student\.glauniversity\.in)(\/|$)/i.test(url) ||
    /^https:\/\/(www\.)?instagram\.com\/glauniv\/?$/i.test(url) ||
    /^https:\/\/(www\.)?youtube\.com\/@gla-university\/?$/i.test(url)
  );
}

function inferSubcategory(rec: RawKnowledgeRecord): string {
  if (rec.subcategory) return rec.subcategory;
  const text = `${rec.title} ${rec.keywords.join(' ')}`.toLowerCase();
  if (rec.category === 'Library') {
    if (/(koha|opac|refread|scopus|turnitin|database|digital)/i.test(text)) return 'Digital Library & Databases';
    return 'Central & Departmental Libraries';
  }
  if (rec.category === 'Campus Facilities') {
    if (/(wifi|wi-fi|it|network|lab)/i.test(text)) return 'Labs & Connectivity';
    if (/(sports|gym|cricket|football|basketball)/i.test(text)) return 'Sports & Fitness';
    if (/(medical|aarogyam|health)/i.test(text)) return 'Healthcare & Wellness';
    if (/(cafeteria|food|bank|atm)/i.test(text)) return 'Campus Utilities & Dining';
    return 'Campus Infrastructure';
  }
  if (rec.category === 'Hostels & Mess') return /(mess|meal|dining|food)/i.test(text) ? 'Mess & Dining' : 'Residential Hostels';
  if (rec.category === 'Transport') return 'University Buses & Mobility';
  if (rec.category === 'Clubs & Societies') {
    if (/(cyber|csi|coding|gfg|cloud|gloud|datum|data|robotics|tech)/i.test(text)) return 'Technology & Coding';
    if (/(media|photo|drishti|video|design)/i.test(text)) return 'Media & Creative';
    if (/(music|ninad|dance|natraj|drama|vihiti|theatre|cultural)/i.test(text)) return 'Cultural & Performing Arts';
    if (/(debate|saturangle|literario|poetry|literary)/i.test(text)) return 'Literary & Debate';
    return 'Student Societies';
  }
  if (rec.category === 'Campus Events') return rec.sourceType === 'official' ? 'University Flagship Events' : 'Sample Event Schedule';
  if (rec.category === 'Academics') {
    if (/(glams|portal|attendance|result)/i.test(text)) return 'GLAMS & Student Portals';
    if (/(timetable|exam|lab|viva)/i.test(text)) return 'Timetable & Assessments';
    return 'Institutes & Programmes';
  }
  if (rec.category === 'Student Services') {
    if (/(ragging|safety|proctor)/i.test(text)) return 'Safety & Anti-Ragging';
    if (/(grievance|sgrc|dsw|welfare)/i.test(text)) return 'Welfare & Grievance';
    return 'Helpdesk & Support';
  }
  if (rec.category === 'Placements') return 'Placements & Career Training';
  if (rec.category === 'Admissions & General') return 'Admissions & Accreditation';
  if (rec.category === 'Contacts & Portals') return 'Official Contacts & Portals';
  if (rec.category === 'Social & Community') return 'Campus Social Channels';
  return 'Campus Guide';
}

function cleanSampleWording(text: string, isSample: boolean): string {
  if (!isSample) return text;
  return text
    .replace(/DEMO DATA\s*[—-]\s*NOT OFFICIAL/gi, 'Prototype sample')
    .replace(/Demo Data\s*[—-]\s*Not Official/gi, 'Prototype sample');
}

function inferFreshness(rec: RawKnowledgeRecord, isVerifiedOfficial: boolean): {
  freshnessStatus: FreshnessStatus;
  freshnessNote: string;
} {
  if (rec.freshnessStatus && rec.freshnessNote) {
    return {
      freshnessStatus: rec.freshnessStatus,
      freshnessNote: cleanSampleWording(rec.freshnessNote, !isVerifiedOfficial),
    };
  }
  if (!isVerifiedOfficial) {
    return {
      freshnessStatus: 'demo-static',
      freshnessNote: 'Prototype sample: Illustrative campus record, not an official GLA University notice.',
    };
  }
  const textBlob = `${rec.title} ${rec.description}`.toLowerCase();
  const isSessionSensitive =
    SESSION_SENSITIVE_CATEGORIES.has(rec.category) ||
    /(fee|fees|helpline|phone|allotment|route|scholarship|placement|policy|undertaking|admission|package|timings|hours|seats)/i.test(
      textBlob
    );

  if (isSessionSensitive) {
    return {
      freshnessStatus: 'session-sensitive',
      freshnessNote: `May change by academic session (reviewed ${rec.lastChecked}). Always verify current details on the official GLA page.`,
    };
  }
  return {
    freshnessStatus: 'verified-reference',
    freshnessNote: `Verified source referencing public GLA University pages as of ${rec.lastChecked}.`,
  };
}

const NORMALIZED_CORE_RECORDS: KnowledgeRecord[] = RAW_SEED_KNOWLEDGE_BASE.map((rec) => {
  const isVerifiedOfficial = rec.sourceType === 'official' && isOfficialGlaSourceUrl(rec.sourceUrl);
  const verificationStatus: VerificationStatus = isVerifiedOfficial ? 'Verified source' : 'Prototype sample';
  const normalizedSourceType = isVerifiedOfficial ? 'official' : 'demo';
  const freshness = inferFreshness(rec, isVerifiedOfficial);
  const cleanedDescription = cleanSampleWording(rec.description, !isVerifiedOfficial);
  const cleanedSourceName = isVerifiedOfficial
    ? rec.sourceName
    : rec.sourceName.replace(/Demo Data\s*[—-]\s*/i, 'Prototype Sample — ');

  return {
    id: rec.id,
    title: rec.title.replace(/\(Demo\)/gi, '(Prototype Sample)').replace(/\(Demo Archive\)/gi, '(Prototype Sample Archive)'),
    category: rec.category,
    subcategory: inferSubcategory(rec),
    content: cleanedDescription,
    description: cleanedDescription,
    tags: rec.keywords,
    keywords: rec.keywords,
    sourceUrl: rec.sourceUrl,
    sourceName: cleanedSourceName,
    sourceType: normalizedSourceType,
    verificationStatus,
    sourceLabel: verificationStatus,
    lastReviewedDate: rec.lastChecked,
    lastChecked: rec.lastChecked,
    isPrototypeSample: !isVerifiedOfficial,
    freshnessStatus: freshness.freshnessStatus,
    freshnessNote: freshness.freshnessNote,
  };
});

export const SEED_KNOWLEDGE_BASE: KnowledgeRecord[] = [
  ...NORMALIZED_CORE_RECORDS,
  ...EXPANDED_PROTOTYPE_RECORDS,
];

