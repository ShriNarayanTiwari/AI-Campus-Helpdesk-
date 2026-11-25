import {
  AnnouncementItem,
  CampusEvent,
  ClubItem,
  FacilityItem,
  HelpdeskTicket,
  SocialChannel,
  TimetableSlot,
} from '../types/campus';

const CHECKED_DATE = '2026-11-24';

export const STUDENT_ACTIVITIES_NOTICE =
  'For current club activities and event announcements, please refer to official university communication channels.';

export const CAMPUS_IMAGES = {
  hero: '/src/assets/images/gla_campus_hero_1795185170143.jpg',
  library: '/src/assets/images/campus_central_library_1795185183552.jpg',
  clubs: '/src/assets/images/campus_student_clubs_1795185173073.jpg',
  sportsHostel: '/src/assets/images/campus_sports_hostel_1795185172969.jpg',
};

export const FACILITIES_DIRECTORY: FacilityItem[] = [
  [
    'library',
    'Central Library',
    'Library',
    'Quiet reading desks, e-books, printing, and group-study rooms. Bring your student ID to borrow books.',
    CAMPUS_IMAGES.library,
    'Tell me about library services and hours',
  ],
  [
    'hostel',
    'Residential Hostels',
    'Hostels',
    'Double AC and Double Non-AC categories are listed in the estimator, with Wi-Fi support and shared common spaces. Verify allocation and residence rules through official hostel administration.',
    CAMPUS_IMAGES.sportsHostel,
    'Tell me about hostel facilities and rules',
  ],
  [
    'travel',
    'Campus Transport Desk',
    'Transport',
    'General campus commuting and transport desk guidance. Confirm live bus routes, timings, and pass charges with the GLA University Transport Office.',
    CAMPUS_IMAGES.hero,
    'What are the campus transport details?',
  ],
  [
    'meal-hours',
    'Dining & Mess Support',
    'Mess & Dining',
    'Optional annual mess plan information for residential students. Confirm daily menus and serving schedules through official hostel notices.',
    CAMPUS_IMAGES.sportsHostel,
    'How does the optional mess plan work?',
  ],
  [
    'health',
    'Campus Health & First Aid',
    'Medical & Safety',
    'Daytime first-aid assistance and student health support. Verify dispensary hours and emergency contacts through official university channels.',
    CAMPUS_IMAGES.hero,
    'Tell me about campus health and first aid support',
  ],
  [
    'labs',
    'Academic Computing Labs',
    'Academic',
    'Supervised practical sessions and workstation access for enrolled students. Confirm lab allocations and schedules through your academic department.',
    CAMPUS_IMAGES.hero,
    'Tell me about academic computing labs',
  ],
  [
    'services',
    'Student Services Desk',
    'Campus Services',
    'Guidance for student ID card inquiries, campus Wi-Fi support, hostel maintenance requests, and general student assistance.',
    CAMPUS_IMAGES.hero,
    'What student services are available?',
  ],
  [
    'sports',
    'Sports & Recreation',
    'Sports',
    'Outdoor courts and campus recreational areas for student fitness and athletics. Confirm access hours and bookings with campus sports administration.',
    CAMPUS_IMAGES.sportsHostel,
    'Tell me about campus sports facilities',
  ],
].map(([id, name, category, summary, image, suggestedQuestion]) => ({
  id,
  name,
  category: category as FacilityItem['category'],
  summary,
  image,
  verifiedDetails: [summary],
  demoDetails: [],
  sourceUrl: 'https://www.gla.ac.in',
  sourceName: 'Campus Assist',
  lastChecked: CHECKED_DATE,
  suggestedQuestion,
}));

/**
 * Credible Student Activity Interest Areas (not official named GLA clubs).
 * Shared across ClubsPage, EventsPage, HomePage, and the Campus Assist engine.
 */
export const CLUBS_DIRECTORY: ClubItem[] = [
  [
    'Technical & Coding',
    'Technical',
    'Software development, competitive programming, electronics, robotics, and technical project collaboration.',
  ],
  [
    'Media & Photography',
    'Media & Creative',
    'Campus photography, videography, graphic design, digital media, and creative documentation.',
  ],
  [
    'Cultural & Performing Arts',
    'Cultural & Arts',
    'Music, theatre, dance, fine arts, and student-led cultural performances.',
  ],
  [
    'Literary & Debate',
    'Literary & Debate',
    'Public speaking, debate, creative writing, journalism, and campus editorial interests.',
  ],
  [
    'Sports & Fitness',
    'Sports & Fitness',
    'Outdoor sports, athletics, indoor games, and student wellness activities.',
  ],
  [
    'Community & Sustainability',
    'Departmental',
    'Student volunteering, environmental awareness, and department-level outreach initiatives.',
  ],
].map(([name, category, description]) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  name,
  category: category as ClubItem['category'],
  description,
  sourceType: 'demo',
  sourceLabel: 'Prototype sample',
  sourceUrl: 'https://www.gla.ac.in',
  sourceName: 'Student Interest Areas',
  lastChecked: CHECKED_DATE,
  verifiedActivities: [description],
  demoSchedule: 'Schedules and registrations are announced through official university channels.',
  demoUpcomingActivity: STUDENT_ACTIVITIES_NOTICE,
  demoVenueNote: 'Verify current club names, faculty coordinators, and venues via official university notices.',
}));

export const CAMPUS_EVENTS: CampusEvent[] = [];

export const SOCIAL_CHANNELS: SocialChannel[] = [];

export const DEMO_TIMETABLE: TimetableSlot[] = [
  { day: 'Monday', time: '09:00 – 10:00', subject: 'Engineering Mathematics I', code: 'BMAS-0101', type: 'Lecture', room: 'Room AB-101' },
  { day: 'Monday', time: '10:00 – 11:00', subject: 'Programming for Problem Solving', code: 'BCSC-0101', type: 'Lecture', room: 'Room AB-101' },
  { day: 'Monday', time: '11:15 – 13:15', subject: 'C / Python Programming Lab', code: 'BCSC-0151', type: 'Lab', room: 'Lab CS-02' },
  { day: 'Tuesday', time: '09:00 – 10:00', subject: 'Basic Electronics Engineering', code: 'BECE-0101', type: 'Lecture', room: 'Room AB-104' },
  { day: 'Tuesday', time: '10:00 – 11:00', subject: 'Technical Communication', code: 'BENG-0101', type: 'Lecture', room: 'Room AB-104' },
  { day: 'Tuesday', time: '14:00 – 16:00', subject: 'Applied Physics Lab', code: 'BPHY-0151', type: 'Lab', room: 'Lab PH-01' },
  { day: 'Wednesday', time: '09:00 – 10:00', subject: 'Engineering Mathematics I', code: 'BMAS-0101', type: 'Tutorial', room: 'Room AB-102' },
  { day: 'Wednesday', time: '11:15 – 12:15', subject: 'Introduction to AI & Computing', code: 'BCSC-0105', type: 'Lecture', room: 'Room AB-102' },
  { day: 'Thursday', time: '10:00 – 12:00', subject: 'Electronics & Circuits Lab', code: 'BECE-0151', type: 'Lab', room: 'Lab EC-03' },
  { day: 'Thursday', time: '14:00 – 15:00', subject: 'Programming for Problem Solving', code: 'BCSC-0101', type: 'Lecture', room: 'Room AB-101' },
  { day: 'Friday', time: '09:00 – 11:00', subject: 'Mini-Project & Design Thinking Studio', code: 'BPRJ-0190', type: 'Lab', room: 'Innovation Lab' },
  { day: 'Friday', time: '11:15 – 12:15', subject: 'Technical Communication', code: 'BENG-0101', type: 'Tutorial', room: 'Room AB-105' },
];

export const DEMO_ANNOUNCEMENTS: AnnouncementItem[] = [];

export const PRELOADED_DEMO_TICKETS: HelpdeskTicket[] = [];

export const OFFICIAL_QUICK_LINKS: { label: string; url: string; tag: string }[] = [
  { label: 'Official GLA University Website', url: 'https://www.gla.ac.in', tag: 'University Portal' },
  { label: 'Official GLA Hostel Information', url: 'https://www.gla.ac.in/campus-life/hostel-facility', tag: 'Hostel & Residence' },
  { label: 'GLAMS Student Portal', url: 'https://glauniversity.in:8085', tag: 'Student Portal' },
  { label: 'GLA Admissions & Contact Desk', url: 'https://www.gla.ac.in/contact-us', tag: 'Admissions & Support' },
];

export interface SuggestedQuestionItem {
  id: string;
  label: string;
  question: string;
  category: string;
}

export const SUGGESTED_QUESTIONS: SuggestedQuestionItem[] = [
  {
    id: 'all-course-fees',
    label: 'Fee structure overview',
    question: 'What is the fees structure of all branches?',
    category: 'Academics & Fees',
  },
  {
    id: 'hostel-facilities-rules',
    label: 'Hostel facilities & rules',
    question: 'Tell me about hostel facilities and rules',
    category: 'Hostels',
  },
  {
    id: 'library-services',
    label: 'Library services',
    question: 'Tell me about library services and hours',
    category: 'Library',
  },
  {
    id: 'clubs-and-events',
    label: 'Student activities & events',
    question: 'Tell me about campus clubs and upcoming events',
    category: 'Student Life',
  },
  {
    id: 'student-services',
    label: 'Student services',
    question: 'What student services are available?',
    category: 'Support',
  },
];
