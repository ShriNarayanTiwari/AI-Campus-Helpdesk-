import {
  AnnouncementItem,
  CampusEvent,
  ClubItem,
  FacilityItem,
  HelpdeskTicket,
  SocialChannel,
  SuggestedPrompt,
  TimetableSlot,
} from '../types/campus';

const CHECKED_DATE = '2026-11-20';

export const CAMPUS_IMAGES = {
  hero: '/src/assets/images/gla_campus_hero_1795185170143.jpg',
  library: '/src/assets/images/campus_central_library_1795185183552.jpg',
  clubs: '/src/assets/images/campus_student_clubs_1795185173073.jpg',
  sportsHostel: '/src/assets/images/campus_sports_hostel_1795185172969.jpg',
};

export const FACILITIES_DIRECTORY: FacilityItem[] = [
  ['library','Central Library','Library','Quiet desks, e-books, printing and group-study rooms.',CAMPUS_IMAGES.library],
  ['hostel','Residential Halls','Hostels','Double AC and non-AC rooms with shared lounges, Wi-Fi and laundry.',CAMPUS_IMAGES.sportsHostel],
  ['travel','Campus Shuttle','Transport','Main Gate, Market Square and Lake Stop.',CAMPUS_IMAGES.hero],
  ['meal-hours','Residential Dining Hall','Mess & Dining','Breakfast, lunch and dinner beside the hostels.',CAMPUS_IMAGES.sportsHostel],
  ['health','Welcome Court Health Desk','Medical & Safety','Daytime first-aid assistance at Welcome Court.',CAMPUS_IMAGES.hero],
  ['labs','Science Hall Computing Labs','Academic','Supervised practical sessions and open practice.',CAMPUS_IMAGES.hero],
  ['services','Student Services Desk','Campus Services','ID replacement, support tickets and appointment requests.',CAMPUS_IMAGES.hero],
  ['sports','Sports and Computing','Sports','Outdoor courts and computing labs beside Science Hall.',CAMPUS_IMAGES.sportsHostel]
].map(([id,name,category,summary,image])=>({id,name,category:category as FacilityItem['category'],summary,image,verifiedDetails:[summary],demoDetails:[],sourceUrl:'',sourceName:'Campus handbook',lastChecked:CHECKED_DATE,suggestedQuestion:'Tell me about '+name}));

export const CLUBS_DIRECTORY: ClubItem[] = [
 ['Circuit Circle','Technical','Build and test student electronics projects.','Tuesday','Science Hall'],
 ['Shutter Society','Media & Creative','Learn photography and cover campus events.','Friday','Media Studio'],
 ['Stagecraft','Cultural & Arts','Rehearse plays and help with stage production.','Wednesday','Arts Hall'],
 ['River Runners','Cultural & Arts','Organise social runs and campus walks.','Saturday','Sports Courts'],
 ['Build Guild','Technical','Prototype useful student tools in small teams.','Monday','Computing Lab'],
 ['Green Circle','Departmental','Maintain the teaching garden and run waste audits.','Friday','Welcome Court'],
 ['Design Desk','Media & Creative','Practice layout, design critique and illustration.','Tuesday','Media Studio'],
 ['Wordsmiths','Literary & Debate','Share poems and edit the student anthology.','Friday','Library'],
 ['Rhythm Room','Cultural & Arts','Practice percussion and ensemble arrangements.','Thursday','Arts Hall'],
 ['Logic League','Technical','Solve programming challenges in pairs.','Wednesday','Computing Lab'],
 ['Market Makers','Departmental','Practice budgeting and student enterprise pitches.','Monday','Science Hall'],
 ['Open Floor','Literary & Debate','Practice public speaking and competitive debate.','Thursday','Welcome Court']
].map(([name,category,description,day,venue])=>({id:name.toLowerCase().replaceAll(' ','-'),name,category:category as ClubItem['category'],description,sourceType:'demo',sourceLabel:'Prototype sample',sourceUrl:'',sourceName:'Club register',lastChecked:CHECKED_DATE,verifiedActivities:[description],demoSchedule:day+' at 5 PM.',demoUpcomingActivity:'Open practice session',demoVenueNote:'Meet at '+venue+'.'}));

export const CAMPUS_EVENTS: CampusEvent[] = [
 ['Circuit Lab','Technical','2026-12-04','Science Hall','Circuit Circle'],
 ['Winter Showcase','Cultural','2026-12-18','Arts Hall','Stagecraft'],
 ['Open Debate','Cultural','2026-12-09','Welcome Court','Open Floor'],
 ['Campus Photo Walk','Workshop','2026-12-10','Main Gate','Shutter Society'],
 ['Welcome Fair','Academic','2026-09-04','Welcome Court','Student Services'],
 ['Sports Meet','Sports','2026-10-12','Sports Courts','Student Services'],
 ['Portfolio Clinic','Career','2027-01-08','Media Studio','Career Studio']
].map(([title,category,date,venue,organizer])=>({id:title.toLowerCase().replaceAll(' ','-'),title,category:category as CampusEvent['category'],date,startTime:'16:00',endTime:'18:00',venue,organizer,description:'Join '+organizer+' for '+title+' at '+venue+'.',sourceType:'demo',sourceLabel:'Prototype sample',sourceUrl:'',lastChecked:CHECKED_DATE}));

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
  { day: 'Friday', time: '09:00 – 11:00', subject: 'Mini-Project & Design Thinking Studio', code: 'BPRJ-0190', type: 'Lab', room: 'Demo Innovation Lab' },
  { day: 'Friday', time: '11:15 – 12:15', subject: 'Technical Communication', code: 'BENG-0101', type: 'Tutorial', room: 'Room AB-105' },
];

export const DEMO_ANNOUNCEMENTS: AnnouncementItem[] = CAMPUS_EVENTS.map(e=>({id:e.id,title:e.title,date:e.date,category:e.category,summary:e.description,sourceLabel:'Prototype sample'}));

export const PRELOADED_DEMO_TICKETS: HelpdeskTicket[] = [];
export const OFFICIAL_QUICK_LINKS: {label:string,url:string,tag:string}[] = [];
export const SUGGESTED_TEST_PROMPTS: SuggestedPrompt[] = ['Tell me about the library','Compare double AC and double non-AC hostel fees','What clubs can I join?','What is B.Tech tuition?','What events are coming up?','My hostel Wi-Fi is not working'].map((question,i)=>({id:String(i),question,category:['Library','Hostels','Clubs','Academics','Events','Services'][i],intentHint:'General AI'}));

export interface DemoTourStep {
  step: number;
  pillar:
    | 'Problem Statement'
    | 'Official vs Demo Data'
    | 'Local RAG Retrieval'
    | 'Citations & Evidence'
    | 'Guardrails'
    | 'Local Workflows'
    | 'Limitations'
    | 'Future Scope';
  title: string;
  page: 'home' | 'assistant' | 'facilities' | 'clubs' | 'events' | 'services' | 'knowledge-base' | 'about';
  vivaGoal: string;
  talkingPoint: string;
  demoQuery?: string;
}

export const PRESENTATION_TOUR_STEPS: DemoTourStep[] = [
 {step:1,pillar:'Problem Statement',title:'Find campus information',page:'home',vivaGoal:'Show the student dashboard.',talkingPoint:'Pages and chat share the Cedarbrook handbook.'},
 {step:2,pillar:'Local RAG Retrieval',title:'Ask about the library',page:'assistant',vivaGoal:'Ask a question, then ask about Sunday.',talkingPoint:'The assistant selects handbook records and keeps recent chat context.',demoQuery:'Tell me about the library.'},
 {step:3,pillar:'Local Workflows',title:'Track a request',page:'services',vivaGoal:'Raise a ticket and refresh.',talkingPoint:'The ticket history is stored on this device.'}
];
